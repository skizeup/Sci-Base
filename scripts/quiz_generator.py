"""Générateur de quizzes interactifs pour SciBase.

Utilise un LLM (Ollama/DeepSeek/Claude/Groq) pour produire des quiz
à partir du contenu existant (summary, index, papers).
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

from llm_providers import get_provider
from prompts import QUIZ_PROMPT, QUIZ_SYSTEM_PROMPT

TOPICS_DIR = Path(__file__).parent.parent / "data" / "topics"
LEARNING_PATH = TOPICS_DIR / "learning-path.json"

# Nombre de questions par niveau
QUESTIONS_BY_LEVEL = {
    "debutant": 5,
    "intermediaire": 10,
    "avance": 15,
}


def get_topic_level(topic_id: str) -> str:
    """Retrouve le niveau d'un topic depuis learning-path.json."""
    if not LEARNING_PATH.exists():
        return "intermediaire"
    lp = json.loads(LEARNING_PATH.read_text(encoding="utf-8"))
    for p in lp["paths"]:
        for t in p["topics"]:
            if t["topic_id"] == topic_id:
                return t["level"]
    return "intermediaire"


def format_papers_info(papers: list[dict]) -> str:
    """Formate les papers pour inclusion dans un prompt."""
    lines = []
    for p in papers:
        authors = ", ".join(p.get("authors", [])[:3])
        if len(p.get("authors", [])) > 3:
            authors += " et al."
        lines.append(f"- **{p['title']}** ({p.get('year', '?')}) — {authors}")
        if p.get("abstract"):
            abstract = p["abstract"][:300]
            if len(p["abstract"]) > 300:
                abstract += "..."
            lines.append(f"  > {abstract}")
    return "\n".join(lines)


def extract_json_array(text: str) -> list:
    """Extrait un tableau JSON d'une réponse LLM (gère le markdown autour)."""
    # Essai direct
    text = text.strip()
    if text.startswith("["):
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass

    # Chercher un bloc de code JSON
    match = re.search(r"```(?:json)?\s*\n(\[[\s\S]*?\])\s*\n```", text)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    # Chercher le premier [ ... ] dans le texte
    start = text.find("[")
    end = text.rfind("]")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(text[start:end + 1])
        except json.JSONDecodeError:
            pass

    raise ValueError("Impossible d'extraire un tableau JSON de la réponse LLM")


def validate_questions(questions: list, num_expected: int) -> list:
    """Valide et normalise les questions générées."""
    valid = []
    for i, q in enumerate(questions):
        # Vérifier les champs requis
        required = ["question", "type", "difficulty", "options", "correct_answer", "explanation"]
        if not all(k in q for k in required):
            print(f"  [warn] Question {i+1} : champs manquants, ignorée")
            continue

        # Normaliser l'id
        q["id"] = q.get("id", f"q{i+1}")

        # Valider le type
        if q["type"] not in ("multiple_choice", "true_false"):
            print(f"  [warn] Question {q['id']} : type invalide '{q['type']}', ignorée")
            continue

        # Valider la difficulté
        if q["difficulty"] not in ("facile", "moyen", "difficile"):
            q["difficulty"] = "moyen"

        # Valider les options
        if q["type"] == "true_false" and len(q["options"]) != 2:
            q["options"] = ["Vrai", "Faux"]
        if q["type"] == "multiple_choice" and len(q["options"]) != 4:
            print(f"  [warn] Question {q['id']} : {len(q['options'])} options au lieu de 4, ignorée")
            continue

        # Valider correct_answer
        if not isinstance(q["correct_answer"], int) or q["correct_answer"] < 0 or q["correct_answer"] >= len(q["options"]):
            print(f"  [warn] Question {q['id']} : correct_answer invalide, ignorée")
            continue

        valid.append(q)

    if len(valid) < num_expected:
        print(f"  [warn] {len(valid)}/{num_expected} questions valides (attendu {num_expected})")

    return valid


def generate_quiz(topic_id: str, provider, *, force: bool = False, dry_run: bool = False) -> Path | None:
    """Génère quiz.json pour un topic."""
    topic_dir = TOPICS_DIR / topic_id
    if not topic_dir.is_dir():
        raise FileNotFoundError(f"Topic introuvable : '{topic_id}' (cherché dans {TOPICS_DIR})")

    output_path = topic_dir / "quiz.json"
    if output_path.exists() and not force:
        print(f"  [skip] {topic_id}/quiz.json existe déjà (--force pour écraser)")
        return None

    # Charger les données
    index_path = topic_dir / "_index.md"
    summary_path = topic_dir / "summary.md"
    papers_path = topic_dir / "papers.json"

    index_content = index_path.read_text(encoding="utf-8") if index_path.exists() else ""
    summary_content = summary_path.read_text(encoding="utf-8") if summary_path.exists() else ""
    papers = json.loads(papers_path.read_text(encoding="utf-8")) if papers_path.exists() else []

    # Déterminer le nombre de questions
    level = get_topic_level(topic_id)
    num_questions = QUESTIONS_BY_LEVEL.get(level, 10)

    print(f"  Topic : {topic_id} (niveau: {level}, {num_questions} questions)")
    print(f"  Données : {len(index_content)} car. index, {len(summary_content)} car. summary, {len(papers)} papers")

    if dry_run:
        print(f"  [dry-run] Générerait {topic_id}/quiz.json ({num_questions} questions)")
        return output_path

    # Construire le prompt
    prompt = QUIZ_PROMPT.format(
        topic_name=topic_id.replace("-", " ").title(),
        num_questions=num_questions,
        index_content=index_content[:3000],
        summary_content=summary_content[:5000],
        paper_count=len(papers),
        papers_info=format_papers_info(papers),
    )

    print(f"  Génération de {topic_id}/quiz.json...")
    response = provider.generate(prompt, system=QUIZ_SYSTEM_PROMPT)

    # Parser la réponse
    try:
        questions = extract_json_array(response.content)
    except ValueError as e:
        print(f"  [erreur] {e}")
        print(f"  Réponse brute (500 premiers car.) :\n{response.content[:500]}")
        return None

    # Valider
    questions = validate_questions(questions, num_questions)
    if not questions:
        print(f"  [erreur] Aucune question valide générée")
        return None

    # Écrire le fichier
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    quiz = {
        "topic_id": topic_id,
        "generated_by": f"{response.provider}/{response.model}",
        "generated_at": now,
        "questions": questions,
    }

    output_path.write_text(json.dumps(quiz, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  [ok] {topic_id}/quiz.json créé ({len(questions)} questions)")
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Génère des quizzes interactifs pour SciBase")
    parser.add_argument("--topic", required=True, help="Nom/slug du topic (ou 'all' pour tous)")
    parser.add_argument("--provider", default="groq", choices=["ollama", "deepseek", "claude", "groq"],
                        help="Provider LLM (défaut: groq)")
    parser.add_argument("--model", default=None, help="Modèle spécifique à utiliser")
    parser.add_argument("--force", action="store_true", help="Écrase les fichiers existants")
    parser.add_argument("--dry-run", action="store_true", help="Prévisualisation sans génération")
    args = parser.parse_args()

    # Lister les topics
    if args.topic == "all":
        topics = [d.name for d in sorted(TOPICS_DIR.iterdir()) if d.is_dir()]
    else:
        topics = [args.topic]

    print(f"Provider : {args.provider}" + (f" ({args.model})" if args.model else ""))
    print(f"Topics : {len(topics)}")
    if args.dry_run:
        print("--- MODE DRY-RUN ---")
    print()

    # Initialiser le provider (sauf en dry-run)
    provider = None
    if not args.dry_run:
        provider_kwargs = {}
        if args.model:
            provider_kwargs["model"] = args.model
        try:
            provider = get_provider(args.provider, **provider_kwargs)
            if not provider.check_availability():
                print(f"Erreur : provider '{args.provider}' non disponible", file=sys.stderr)
                sys.exit(1)
        except ValueError as e:
            print(f"Erreur : {e}", file=sys.stderr)
            sys.exit(1)

    # Générer les quizzes
    success = 0
    for topic_id in topics:
        try:
            result = generate_quiz(topic_id, provider, force=args.force, dry_run=args.dry_run)
            if result:
                success += 1
        except FileNotFoundError as e:
            print(f"  [erreur] {e}")
        except Exception as e:
            print(f"  [erreur] {topic_id} : {e}")
        print()

    print(f"Terminé. {success}/{len(topics)} quizzes générés.")


if __name__ == "__main__":
    main()
