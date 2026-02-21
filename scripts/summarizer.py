"""Générateur de résumés vulgarisés pour SciBase.

Utilise un LLM (Ollama/DeepSeek/Claude) pour produire des résumés
accessibles à partir des papers et du contenu existant.
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

from llm_providers import get_provider
from prompts import PAPER_SUMMARY_PROMPT, SYSTEM_PROMPT, TOPIC_SUMMARY_PROMPT

TOPICS_DIR = Path(__file__).parent.parent / "data" / "topics"


def slugify(text: str) -> str:
    """Convertit un titre en slug pour nom de fichier."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")


def find_topic_dir(topic_name: str) -> Path:
    """Trouve le dossier d'un topic par son nom."""
    slug = slugify(topic_name)
    topic_dir = TOPICS_DIR / slug
    if topic_dir.is_dir():
        return topic_dir
    # Recherche par nom partiel
    for d in TOPICS_DIR.iterdir():
        if d.is_dir() and slug in d.name:
            return d
    raise FileNotFoundError(f"Topic introuvable : '{topic_name}' (cherché dans {TOPICS_DIR})")


def load_topic_data(topic_dir: Path) -> tuple[str, list[dict]]:
    """Charge le contenu _index.md et papers.json d'un topic."""
    index_path = topic_dir / "_index.md"
    papers_path = topic_dir / "papers.json"

    index_content = index_path.read_text(encoding="utf-8") if index_path.exists() else ""
    papers = json.loads(papers_path.read_text(encoding="utf-8")) if papers_path.exists() else []

    return index_content, papers


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


def make_frontmatter(provider_name: str, model: str, topic: str) -> str:
    """Génère le frontmatter YAML pour un fichier généré."""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    return f"""---
generated_by: {provider_name}/{model}
generated_at: {now}
topic: {topic}
---

"""


def generate_topic_summary(
    topic_dir: Path, provider, index_content: str, papers: list[dict], *, force: bool = False, dry_run: bool = False
) -> Path | None:
    """Génère summary.md pour un topic."""
    output_path = topic_dir / "summary.md"
    if output_path.exists() and not force:
        print(f"  [skip] {output_path.relative_to(TOPICS_DIR)} existe déjà (--force pour écraser)")
        return None

    prompt = TOPIC_SUMMARY_PROMPT.format(
        topic_name=topic_dir.name,
        index_content=index_content,
        paper_count=len(papers),
        papers_info=format_papers_info(papers),
    )

    if dry_run:
        print(f"  [dry-run] Générerait {output_path.relative_to(TOPICS_DIR)}")
        print(f"            Prompt : {len(prompt)} caractères, {len(papers)} papers")
        return output_path

    print(f"  Génération de {output_path.relative_to(TOPICS_DIR)}...")
    response = provider.generate(prompt, system=SYSTEM_PROMPT)
    frontmatter = make_frontmatter(response.provider, response.model, topic_dir.name)
    output_path.write_text(frontmatter + response.content, encoding="utf-8")
    print(f"  [ok] {output_path.relative_to(TOPICS_DIR)} créé")
    return output_path


def generate_paper_summaries(
    topic_dir: Path, provider, papers: list[dict], *, force: bool = False, dry_run: bool = False, max_results: int = 0
) -> list[Path]:
    """Génère un résumé individuel par paper."""
    summaries_dir = topic_dir / "paper-summaries"
    summaries_dir.mkdir(exist_ok=True)
    generated = []

    papers_to_process = papers[:max_results] if max_results > 0 else papers

    for paper in papers_to_process:
        slug = slugify(paper["title"])
        output_path = summaries_dir / f"{slug}.md"

        if output_path.exists() and not force:
            print(f"  [skip] paper-summaries/{slug}.md existe déjà")
            continue

        if not paper.get("abstract"):
            print(f"  [skip] {paper['title'][:50]}... — pas d'abstract")
            continue

        prompt = PAPER_SUMMARY_PROMPT.format(
            title=paper["title"],
            authors=", ".join(paper.get("authors", [])),
            year=paper.get("year", "?"),
            tags=", ".join(paper.get("tags", [])),
            abstract=paper.get("abstract", ""),
        )

        if dry_run:
            print(f"  [dry-run] Générerait paper-summaries/{slug}.md")
            generated.append(output_path)
            continue

        print(f"  Génération de paper-summaries/{slug}.md...")
        response = provider.generate(prompt, system=SYSTEM_PROMPT)
        frontmatter = make_frontmatter(response.provider, response.model, topic_dir.name)
        output_path.write_text(frontmatter + response.content, encoding="utf-8")
        print(f"  [ok] paper-summaries/{slug}.md créé")
        generated.append(output_path)

    return generated


def main():
    parser = argparse.ArgumentParser(description="Génère des résumés vulgarisés pour SciBase")
    parser.add_argument("--topic", required=True, help="Nom du topic à traiter")
    parser.add_argument("--provider", default="ollama", choices=["ollama", "deepseek", "claude"],
                        help="Provider LLM (défaut: ollama)")
    parser.add_argument("--model", default=None, help="Modèle spécifique à utiliser")
    parser.add_argument("--mode", default="all", choices=["topic", "papers", "all"],
                        help="Mode de génération (défaut: all)")
    parser.add_argument("--force", action="store_true", help="Écrase les fichiers existants")
    parser.add_argument("--dry-run", action="store_true", help="Prévisualisation sans génération")
    parser.add_argument("--max-results", type=int, default=0,
                        help="Nombre max de papers à résumer (0 = tous)")
    args = parser.parse_args()

    # 1. Trouver le topic
    try:
        topic_dir = find_topic_dir(args.topic)
    except FileNotFoundError as e:
        print(f"Erreur : {e}", file=sys.stderr)
        sys.exit(1)

    print(f"Topic : {topic_dir.name}")
    print(f"Provider : {args.provider}" + (f" ({args.model})" if args.model else ""))
    print(f"Mode : {args.mode}")
    if args.dry_run:
        print("--- MODE DRY-RUN ---")
    print()

    # 2. Charger les données
    index_content, papers = load_topic_data(topic_dir)
    print(f"Données chargées : {len(index_content)} car. d'index, {len(papers)} papers")
    print()

    # 3. Initialiser le provider (sauf en dry-run)
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

    # 4. Générer les résumés
    if args.mode in ("topic", "all"):
        generate_topic_summary(
            topic_dir, provider, index_content, papers,
            force=args.force, dry_run=args.dry_run,
        )

    if args.mode in ("papers", "all"):
        generate_paper_summaries(
            topic_dir, provider, papers,
            force=args.force, dry_run=args.dry_run, max_results=args.max_results,
        )

    print()
    print("Terminé.")


if __name__ == "__main__":
    main()
