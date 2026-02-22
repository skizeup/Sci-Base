# SciBase

## Vision
Plateforme d'apprentissage scientifique open-source.
Phase 1 : Repo GitHub curé de ressources scientifiques — FAIT (10 topics, 119 papers).
Phase 2 : Site web Next.js interactif — FAIT (146 pages statiques, live sur sci-base.vercel.app).

## Stack

### Données (Phase 1)
- Data : Markdown + JSON pour le contenu
- Scripts : Python 3.11+ (scrapers, indexation)

### Web (Phase 2)
- Framework : Next.js 14 (App Router) + TypeScript
- Styling : Tailwind CSS + @tailwindcss/typography
- Markdown : unified + remark-parse + remark-gfm + remark-math + remark-rehype
- LaTeX : rehype-katex (rendu 100% build-time, zero JS client)
- Diagrammes : Mermaid.js (client-side, dynamic import seulement si diagrammes présents)
- Recherche : Fuse.js (client-side, index JSON pré-généré au build via scripts/generateSearchIndex.mjs)
- Frontmatter : gray-matter
- SSG : generateStaticParams sur toutes les routes dynamiques

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

## Structure des dossiers
```
data/topics/       — Un sous-dossier par topic
data/schemas/      — Schémas JSON de validation
scripts/           — Scripts Python (fetchers, validation, summarizer)
web/               — App Next.js (Phase 2)
  src/
    app/           — Pages (App Router)
    lib/           — Data layer (types, markdown pipeline, content reader)
    components/    — Composants React
  scripts/         — Scripts Node.js (search index generator)
notebooks/         — Notebooks Jupyter intégrables
docs/              — Documentation du projet
```

## Structure d'un topic
```
data/topics/<topic-name>/
  ├── _index.md              — Description du topic
  ├── papers.json            — Papers référencés
  ├── resources.md           — Ressources complémentaires
  ├── summary.md             — GÉNÉRÉ : vulgarisation du topic + diagrammes Mermaid
  └── paper-summaries/       — GÉNÉRÉ : résumés individuels
      ├── <slug-du-paper>.md
      └── ...
```

## Architecture web (web/src/)
```
lib/
  types.ts         — Interfaces TS (Paper, Topic, Level, SearchItem, LearningPath...)
  markdown.ts      — Pipeline unified + plugins custom (rehypeMermaid, rehypeRewriteLinks)
  content.ts       — Lecture data/topics/ via fs au build-time (SSG)

components/
  Header.tsx       — Nav sticky avec burger mobile
  Footer.tsx       — Footer simple
  TopicCard.tsx    — Carte topic pour la grille
  LevelBadge.tsx   — Badge coloré (vert/ambre/violet)
  PaperCard.tsx    — Carte paper avec liens et tags
  MarkdownRenderer.tsx — Client component, rendu HTML + init Mermaid (dynamic import)
  SearchBar.tsx    — Recherche Fuse.js (dropdown compact ou full page)
  LearningPath.tsx — Visualisation parcours par niveau
  Breadcrumb.tsx   — Fil d'Ariane

app/
  page.tsx                              — Homepage (hero + grille topics)
  topics/[slug]/page.tsx                — Page topic (index + summary + papers + resources)
  topics/[slug]/papers/page.tsx         — Liste papers
  topics/[slug]/papers/[paperSlug]/page.tsx — Résumé paper individuel
  parcours/page.tsx                     — Parcours d'apprentissage
  recherche/page.tsx                    — Page recherche
```

## Routes web

| Route | Pages | Description |
|-------|-------|-------------|
| `/` | 1 | Homepage — grille de 10 topics triés par learning-path |
| `/topics/[slug]` | 10 | Page topic — vue d'ensemble, résumé IA, Mermaid, KaTeX, papers, ressources |
| `/topics/[slug]/papers` | 10 | Liste papers par topic |
| `/topics/[slug]/papers/[slug]` | 119 | Résumé vulgarisé d'un paper |
| `/parcours` | 1 | Parcours d'apprentissage progressif (3 niveaux) |
| `/recherche` | 1 | Recherche full-page (248 items indexés) |

**Total : 146 pages statiques**

## Plugins Markdown custom

- **rehypeMermaid** : transforme `<pre><code class="language-mermaid">` en `<pre class="mermaid">` (format attendu par Mermaid.js)
- **rehypeRewriteLinks** : réécrit les liens `../topic-slug/` en `/topics/topic-slug` pour la navigation web

## Commandes

### Web
- `cd web && npm run dev` — lance le site en local (http://localhost:3000)
- `cd web && npm run build` — build prod (146 pages statiques, prebuild génère search-index.json)
- `cd web && npm run lint` — lint TypeScript/ESLint

### Scripts Python
- `python scripts/arxiv_fetcher.py --topic "machine learning"` — fetch papers
- `python scripts/summarizer.py --topic "machine learning"` — génère les résumés (ollama par défaut)
- `python scripts/summarizer.py --topic "machine learning" --provider groq` — résumés via Groq API (gratuit)
- `python scripts/summarizer.py --topic "machine learning" --provider claude` — résumés via Claude API
- `python scripts/summarizer.py --topic "machine learning" --mode papers` — résumés individuels uniquement
- `python scripts/summarizer.py --topic "machine learning" --dry-run` — prévisualisation sans LLM
- `python scripts/validate.py` — valide la structure des données

## LLM Providers (summarizer)
- **ollama** (défaut) : LLM local via Ollama, modèle `deepseek-r1`. Nécessite `ollama serve`.
- **deepseek** : API DeepSeek. Variable d'env `DEEPSEEK_API_KEY` requise.
- **claude** : API Anthropic. Variable d'env `ANTHROPIC_API_KEY` requise.
- **groq** : API Groq (gratuit, compatible OpenAI). Variable d'env `GROQ_API_KEY` requise. Modèle `llama-3.3-70b-versatile`.

## Déploiement — live sur [sci-base.vercel.app](https://sci-base.vercel.app)
- Vercel : root directory = `web/`
- `web/vercel.json` : `framework: null`, `outputDirectory: "out"` (désactive l'intégration Next.js native de Vercel)
- `output: 'export'` dans next.config.mjs → HTML statique dans `out/`
- `web/scripts/copyData.mjs` : copie `data/` dans `web/data/` au prebuild (Vercel sandbox le root directory, `../data` n'est pas accessible)
- `web/scripts/generateSearchIndex.mjs` : génère `public/search-index.json` (248 items)
- Auto-deploy à chaque `git push` sur master
- **Important** : avec Root Directory = `web/`, les fichiers hors de `web/` ne sont PAS accessibles au build. Le script `copyData.mjs` résout ce problème.
