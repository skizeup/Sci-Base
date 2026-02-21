# SciBase

## Vision
Plateforme d'apprentissage scientifique open-source.
Phase 1 : Repo GitHub curé de ressources scientifiques.
Phase 2 : Site web interactif style W3Schools pour la science.

## Stack
- Data : Markdown + JSON pour le contenu
- Scripts : Python 3.11+ (scrapers, indexation)
- Web : Next.js 14 + TypeScript + Tailwind CSS
- Math : KaTeX pour le rendu LaTeX
- Search : Fuse.js (client-side) ou Algolia (plus tard)

## Sources de données
- arxiv.org (API REST)
- Semantic Scholar (API gratuite)
- PubMed (API Entrez)
- Papers With Code (API)
- HAL Science, CORE, DBLP

## Conventions
- Un topic = un dossier avec _index.md + papers.json + resources.md
- papers.json suit le schéma défini dans data/schemas/paper.schema.json
- learning-path.json suit le schéma défini dans data/schemas/learning-path.schema.json
- Fichiers générés (summary.md, paper-summaries/*.md) contiennent un frontmatter YAML avec generated_by, generated_at, topic
- Contenu en français prioritairement, papers en anglais OK
- Commits conventionnels (feat:, fix:, docs:)

## Public cible
- Étudiants en sciences (licence/master)
- Curieux autodidactes

## Scope
- Phase 1 : IA/ML en priorité (~10 topics initiaux)
- Ensuite : élargissement progressif aux autres sciences

## Curation
- Automatique via scripts (APIs arxiv, Semantic Scholar, etc.)
- Ajout manuel possible par contribution

## Priorités web (Phase 2)
1. Navigation claire entre topics
2. Recherche efficace
3. Rendu LaTeX (KaTeX)
- Notebooks Jupyter intégrés prévus
- Déploiement : Vercel

## Structure des dossiers
```
data/topics/       — Un sous-dossier par topic
data/schemas/      — Schémas JSON de validation
scripts/           — Scripts Python (fetchers, validation, summarizer)
web/               — App Next.js (Phase 2)
notebooks/         — Notebooks Jupyter intégrables
docs/              — Documentation du projet
```

## Structure d'un topic
```
data/topics/<topic-name>/
  ├── _index.md              — Description du topic
  ├── papers.json            — Papers référencés
  ├── resources.md           — Ressources complémentaires
  ├── summary.md             — GÉNÉRÉ : vulgarisation du topic
  └── paper-summaries/       — GÉNÉRÉ : résumés individuels
      ├── <slug-du-paper>.md
      └── ...
```

## Commandes
- `python scripts/arxiv_fetcher.py --topic "machine learning"` — fetch papers
- `python scripts/summarizer.py --topic "machine learning"` — génère les résumés (ollama par défaut)
- `python scripts/summarizer.py --topic "machine learning" --provider claude` — résumés via Claude API
- `python scripts/summarizer.py --topic "machine learning" --mode papers` — résumés individuels uniquement
- `python scripts/summarizer.py --topic "machine learning" --dry-run` — prévisualisation sans LLM
- `npm run dev` — lance le site en local (dans /web)
- `npm run build` — build prod
- `python scripts/validate.py` — valide la structure des données

## LLM Providers (summarizer)
- **ollama** (défaut) : LLM local via Ollama, modèle `deepseek-r1`. Nécessite `ollama serve`.
- **deepseek** : API DeepSeek. Variable d'env `DEEPSEEK_API_KEY` requise.
- **claude** : API Anthropic. Variable d'env `ANTHROPIC_API_KEY` requise.