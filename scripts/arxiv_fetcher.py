"""Fetch papers from arXiv and save them to a topic's papers.json."""

import argparse
import json
import os
import re
import shutil
import sys

import arxiv
import jsonschema

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
TOPICS_DIR = os.path.join(PROJECT_ROOT, "data", "topics")
SCHEMA_PATH = os.path.join(PROJECT_ROOT, "data", "schemas", "paper.schema.json")


def slugify(topic: str) -> str:
    """Convert a topic name to a URL-friendly slug.

    "Machine Learning" -> "machine-learning"
    """
    slug = topic.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_]+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    return slug.strip("-")


def ensure_topic_folder(slug: str, name: str) -> str:
    """Create the topic folder with scaffold files if it doesn't exist.

    Returns the path to the topic folder.
    """
    topic_dir = os.path.join(TOPICS_DIR, slug)
    os.makedirs(topic_dir, exist_ok=True)

    index_path = os.path.join(topic_dir, "_index.md")
    if not os.path.exists(index_path):
        title = name.strip().title()
        with open(index_path, "w", encoding="utf-8") as f:
            f.write(f"# {title}\n\n## Description\n\n_(à compléter)_\n")
        print(f"  Créé : {index_path}")

    resources_path = os.path.join(topic_dir, "resources.md")
    if not os.path.exists(resources_path):
        title = name.strip().title()
        with open(resources_path, "w", encoding="utf-8") as f:
            f.write(f"# Ressources — {title}\n\n_(à compléter)_\n")
        print(f"  Créé : {resources_path}")

    return topic_dir


def fetch_papers(query: str, max_results: int) -> list[dict]:
    """Fetch papers from arXiv matching the query."""
    client = arxiv.Client(page_size=max_results, delay_seconds=3.0, num_retries=3)
    search = arxiv.Search(
        query=query,
        max_results=max_results,
        sort_by=arxiv.SortCriterion.Relevance,
    )

    papers = []
    for result in client.results(search):
        authors = [a.name for a in result.authors]
        year = result.published.year

        abstract = result.summary
        if abstract:
            abstract = re.sub(r"\s+", " ", abstract).strip()

        tags = list(dict.fromkeys(result.categories)) if result.categories else []

        paper: dict = {
            "title": result.title,
            "authors": authors,
            "year": year,
            "url": result.entry_id,
        }

        if abstract:
            paper["abstract"] = abstract
        if result.pdf_url:
            paper["pdf_url"] = result.pdf_url
        paper["source"] = "arxiv"
        if tags:
            paper["tags"] = tags
        if result.doi:
            paper["doi"] = result.doi

        papers.append(paper)

    return papers


def merge_papers(existing: list[dict], new: list[dict]) -> list[dict]:
    """Merge new papers into the existing list, deduplicating by URL."""
    seen_urls = {p["url"] for p in existing}
    merged = list(existing)
    added = 0
    for paper in new:
        if paper["url"] not in seen_urls:
            seen_urls.add(paper["url"])
            merged.append(paper)
            added += 1
    print(f"  {added} nouveau(x) paper(s) ajouté(s), {len(existing)} existant(s) conservé(s)")
    return merged


def validate_papers(papers: list[dict], schema_path: str) -> list[dict]:
    """Validate papers against the JSON schema, keeping only valid ones."""
    if not os.path.exists(schema_path):
        print(f"  Attention : schéma introuvable ({schema_path}), validation ignorée")
        return papers

    with open(schema_path, "r", encoding="utf-8") as f:
        schema = json.load(f)

    valid = []
    for paper in papers:
        try:
            jsonschema.validate(instance=paper, schema=schema)
            valid.append(paper)
        except jsonschema.ValidationError as e:
            print(f"  Paper invalide ignoré : {paper.get('title', '?')} — {e.message}")

    if len(valid) < len(papers):
        print(f"  {len(papers) - len(valid)} paper(s) invalide(s) retiré(s)")

    return valid


def main():
    parser = argparse.ArgumentParser(description="Fetch papers from arXiv for SciBase")
    parser.add_argument("--topic", required=True, help="Search query (e.g. 'machine learning')")
    parser.add_argument(
        "--max-results",
        type=int,
        default=20,
        help="Number of papers to fetch (default: 20, max: 100)",
    )
    args = parser.parse_args()

    max_results = min(args.max_results, 100)
    topic = args.topic
    slug = slugify(topic)

    print(f"=== arXiv Fetcher — topic: {topic} (slug: {slug}) ===")

    # 1. Ensure topic folder exists
    topic_dir = ensure_topic_folder(slug, topic)
    papers_path = os.path.join(topic_dir, "papers.json")

    # 2. Load existing papers
    existing = []
    if os.path.exists(papers_path):
        try:
            with open(papers_path, "r", encoding="utf-8") as f:
                existing = json.load(f)
            print(f"  {len(existing)} paper(s) existant(s) chargé(s)")
        except (json.JSONDecodeError, ValueError):
            bak_path = papers_path + ".bak"
            shutil.copy2(papers_path, bak_path)
            print(f"  papers.json corrompu, backup créé : {bak_path}")

    # 3. Fetch new papers
    print(f"  Recherche de {max_results} papers sur arXiv...")
    try:
        new_papers = fetch_papers(topic, max_results)
    except Exception as e:
        print(f"Erreur lors du fetch arXiv : {e}", file=sys.stderr)
        sys.exit(1)
    print(f"  {len(new_papers)} paper(s) récupéré(s)")

    # 4. Merge
    merged = merge_papers(existing, new_papers)

    # 5. Validate
    validated = validate_papers(merged, SCHEMA_PATH)

    # 6. Save
    with open(papers_path, "w", encoding="utf-8") as f:
        json.dump(validated, f, indent=2, ensure_ascii=False)
    print(f"  Sauvegardé : {papers_path} ({len(validated)} papers)")
    print("=== Terminé ===")


if __name__ == "__main__":
    main()
