"""Traducteur FR -> EN pour SciBase.

Traduit le contenu des topics (Markdown, JSON) du français vers l'anglais
en utilisant un LLM (Groq recommandé).
Pattern identique à summarizer.py / quiz_generator.py.
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

from llm_providers import get_provider

TOPICS_DIR = Path(__file__).parent.parent / "data" / "topics"
EN_TOPICS_DIR = Path(__file__).parent.parent / "data" / "en" / "topics"

SYSTEM_PROMPT = """You are a professional scientific translator. Translate the following French content to English.

Rules:
- Preserve ALL Markdown formatting exactly (headings, bold, italic, lists, links, code blocks)
- Preserve ALL LaTeX formulas exactly as-is (anything between $ or $$)
- Preserve ALL Mermaid diagrams exactly as-is (```mermaid blocks)
- Preserve ALL internal links (e.g., ../topic-slug/) exactly as-is
- Preserve ALL YAML frontmatter keys (only translate values where appropriate)
- Do NOT translate code, URLs, file names, or technical identifiers
- Keep the same tone: accessible, educational, for university students
- Output ONLY the translated content, no explanations or commentary"""

MARKDOWN_TRANSLATE_PROMPT = """Translate this French Markdown document to English.
Preserve all formatting, LaTeX, Mermaid diagrams, and links exactly.

---
{content}
---

Output ONLY the translated Markdown."""

QUIZ_TRANSLATE_PROMPT = """Translate this French quiz JSON to English.
Translate: questions, options, and explanations.
Do NOT translate: id, type, difficulty values (keep "facile", "moyen", "difficile"), correct_answer, topic_id.
Preserve the exact JSON structure.

---
{content}
---

Output ONLY the translated JSON (valid JSON, no markdown fences)."""

LEARNING_PATH_TRANSLATE_PROMPT = """Translate this French learning path JSON to English.
Translate: title, description fields.
Do NOT translate: id, topic_id, level values, version, prerequisites, order.
Preserve the exact JSON structure.

---
{content}
---

Output ONLY the translated JSON (valid JSON, no markdown fences)."""


def get_all_topic_slugs() -> list[str]:
    """List all topic slugs."""
    return sorted(
        d.name for d in TOPICS_DIR.iterdir()
        if d.is_dir() and not d.name.startswith(".")
    )


def make_frontmatter(provider_name: str, model: str, topic: str) -> str:
    """Generate YAML frontmatter for a translated file."""
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    return f"""---
translated_from: fr
translated_by: {provider_name}/{model}
translated_at: {now}
topic: {topic}
---

"""


def translate_markdown(provider, content: str) -> str:
    """Translate a Markdown document."""
    prompt = MARKDOWN_TRANSLATE_PROMPT.format(content=content)
    response = provider.generate(prompt, system=SYSTEM_PROMPT)
    # Clean potential wrapping
    text = response.content.strip()
    # Remove markdown fences if LLM wrapped output
    if text.startswith("```markdown"):
        text = text[len("```markdown"):].strip()
    if text.startswith("```md"):
        text = text[len("```md"):].strip()
    if text.startswith("```"):
        text = text[3:].strip()
    if text.endswith("```"):
        text = text[:-3].strip()
    return text


def translate_json(provider, content: str, prompt_template: str) -> str:
    """Translate a JSON document."""
    prompt = prompt_template.format(content=content)
    response = provider.generate(prompt, system=SYSTEM_PROMPT)
    text = response.content.strip()
    # Remove markdown fences
    if text.startswith("```json"):
        text = text[len("```json"):].strip()
    if text.startswith("```"):
        text = text[3:].strip()
    if text.endswith("```"):
        text = text[:-3].strip()
    # Validate JSON
    json.loads(text)
    return text


def strip_frontmatter(content: str) -> tuple[str, str]:
    """Split frontmatter and body."""
    match = re.match(r"^---\n(.*?)\n---\n(.*)", content, re.DOTALL)
    if match:
        return match.group(1), match.group(2)
    return "", content


def translate_topic(slug: str, provider, *, mode: str = "all", force: bool = False, dry_run: bool = False):
    """Translate a single topic."""
    src_dir = TOPICS_DIR / slug
    dst_dir = EN_TOPICS_DIR / slug

    if not src_dir.is_dir():
        print(f"  [error] Topic not found: {slug}")
        return

    dst_dir.mkdir(parents=True, exist_ok=True)

    provider_name = f"{provider.__class__.__name__}"
    model = getattr(provider, "model", "unknown")

    files_to_translate = []

    if mode in ("all", "index"):
        files_to_translate.append(("_index.md", "md"))
    if mode in ("all", "summary"):
        files_to_translate.append(("summary.md", "md"))
    if mode in ("all", "resources"):
        files_to_translate.append(("resources.md", "md"))
    if mode in ("all", "quiz"):
        files_to_translate.append(("quiz.json", "quiz"))

    # Translate markdown/json files
    for filename, ftype in files_to_translate:
        src_path = src_dir / filename
        dst_path = dst_dir / filename

        if not src_path.exists():
            print(f"  [skip] {slug}/{filename} — source n'existe pas")
            continue

        if dst_path.exists() and not force:
            print(f"  [skip] {slug}/{filename} — déjà traduit (--force pour écraser)")
            continue

        if dry_run:
            print(f"  [dry-run] Traduirait {slug}/{filename}")
            continue

        print(f"  [translate] {slug}/{filename}...", end=" ", flush=True)

        content = src_path.read_text(encoding="utf-8")

        try:
            if ftype == "md":
                frontmatter_str, body = strip_frontmatter(content)
                translated = translate_markdown(provider, body)
                fm = make_frontmatter(provider_name, model, slug)
                dst_path.write_text(fm + translated, encoding="utf-8")
            elif ftype == "quiz":
                translated = translate_json(provider, content, QUIZ_TRANSLATE_PROMPT)
                dst_path.write_text(translated, encoding="utf-8")
            print("OK")
        except Exception as e:
            print(f"ERREUR: {e}")

    # Translate paper summaries
    if mode in ("all", "papers"):
        summaries_src = src_dir / "paper-summaries"
        summaries_dst = dst_dir / "paper-summaries"

        if summaries_src.is_dir():
            summaries_dst.mkdir(parents=True, exist_ok=True)
            md_files = sorted(summaries_src.glob("*.md"))
            for md_file in md_files:
                dst_path = summaries_dst / md_file.name

                if dst_path.exists() and not force:
                    print(f"  [skip] {slug}/paper-summaries/{md_file.name} — déjà traduit")
                    continue

                if dry_run:
                    print(f"  [dry-run] Traduirait {slug}/paper-summaries/{md_file.name}")
                    continue

                print(f"  [translate] {slug}/paper-summaries/{md_file.name}...", end=" ", flush=True)

                try:
                    content = md_file.read_text(encoding="utf-8")
                    _, body = strip_frontmatter(content)
                    translated = translate_markdown(provider, body)
                    fm = make_frontmatter(provider_name, model, slug)
                    dst_path.write_text(fm + translated, encoding="utf-8")
                    print("OK")
                except Exception as e:
                    print(f"ERREUR: {e}")


def translate_learning_path(provider, *, force: bool = False, dry_run: bool = False):
    """Translate learning-path.json."""
    src_path = TOPICS_DIR / "learning-path.json"
    dst_path = EN_TOPICS_DIR / "learning-path.json"

    if not src_path.exists():
        print("[error] learning-path.json not found")
        return

    if dst_path.exists() and not force:
        print("[skip] learning-path.json — déjà traduit (--force pour écraser)")
        return

    if dry_run:
        print("[dry-run] Traduirait learning-path.json")
        return

    print("[translate] learning-path.json...", end=" ", flush=True)
    EN_TOPICS_DIR.mkdir(parents=True, exist_ok=True)

    try:
        content = src_path.read_text(encoding="utf-8")
        translated = translate_json(provider, content, LEARNING_PATH_TRANSLATE_PROMPT)
        dst_path.write_text(translated, encoding="utf-8")
        print("OK")
    except Exception as e:
        print(f"ERREUR: {e}")


def main():
    parser = argparse.ArgumentParser(description="SciBase Content Translator (FR -> EN)")
    parser.add_argument("--topic", type=str, default=None,
                        help="Topic slug to translate, or 'all' for all topics")
    parser.add_argument("--learning-path", action="store_true",
                        help="Translate learning-path.json")
    parser.add_argument("--mode", type=str, default="all",
                        choices=["all", "index", "summary", "resources", "quiz", "papers"],
                        help="What to translate (default: all)")
    parser.add_argument("--provider", type=str, default="groq",
                        choices=["ollama", "deepseek", "claude", "groq"],
                        help="LLM provider (default: groq)")
    parser.add_argument("--force", action="store_true",
                        help="Overwrite existing translations")
    parser.add_argument("--dry-run", action="store_true",
                        help="Show what would be translated without doing it")

    args = parser.parse_args()

    if not args.topic and not args.learning_path:
        parser.error("Specify --topic <slug|all> or --learning-path")

    provider = get_provider(args.provider)

    if not args.dry_run:
        if not provider.check_availability():
            print(f"[error] Provider '{args.provider}' is not available.")
            sys.exit(1)

    if args.learning_path:
        translate_learning_path(provider, force=args.force, dry_run=args.dry_run)

    if args.topic:
        if args.topic == "all":
            slugs = get_all_topic_slugs()
        else:
            slugs = [args.topic]

        for slug in slugs:
            print(f"\n{'='*60}")
            print(f"Topic: {slug}")
            print(f"{'='*60}")
            translate_topic(slug, provider, mode=args.mode, force=args.force, dry_run=args.dry_run)

    print("\nDone!")


if __name__ == "__main__":
    main()
