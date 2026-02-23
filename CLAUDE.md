# SciBase

## Vision
Plateforme d'apprentissage scientifique open-source.
Phase 1 : Repo GitHub curé de ressources scientifiques — FAIT (13 topics, 148 papers).
Phase 2 : Site web Next.js interactif — FAIT (live sur sci-base.vercel.app).
Phase 3 Sprint 1 : Dark mode + SEO — FAIT.
Phase 3 Sprint 2 : Nouveaux topics + Parcours interactif — FAIT.
Phase 3 Sprint 3 : Quizzes interactifs — FAIT (13 quiz, 193 pages statiques).
Phase 3 Sprint 3 (suite) : Supabase auth + progression + bookmarks — FAIT (194 pages).

## Stack

### Données (Phase 1)
- Data : Markdown + JSON pour le contenu
- Scripts : Python 3.11+ (scrapers, indexation)

### Web (Phase 2)
- Framework : Next.js 14 (App Router) + TypeScript
- Styling : Tailwind CSS (`darkMode: 'class'`) + @tailwindcss/typography (`dark:prose-invert`)
- Dark mode : ThemeToggle 3 états (auto/clair/sombre), auto = basé sur l'heure locale (7h-20h light, 20h-7h dark)
- Markdown : unified + remark-parse + remark-gfm + remark-math + remark-rehype
- LaTeX : rehype-katex (rendu 100% build-time, zero JS client)
- Diagrammes : Mermaid.js (client-side, dynamic import, thème adapté light/dark)
- Recherche : Fuse.js (client-side, index JSON pré-généré au build via scripts/generateSearchIndex.mjs)
- Frontmatter : gray-matter
- Auth/DB : Supabase (`@supabase/supabase-js` v2, client-side only — email + Google + GitHub)
- SEO : metadataBase, Open Graph, Twitter cards, robots.txt, sitemap.xml (190 URLs au build)
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
- quiz.json suit le schéma défini dans data/schemas/quiz.schema.json
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
  scripts/         — Scripts Node.js (search index, sitemap)
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
  ├── quiz.json              — GÉNÉRÉ : quiz interactif (5/10/15 questions selon niveau)
  └── paper-summaries/       — GÉNÉRÉ : résumés individuels
      ├── <slug-du-paper>.md
      └── ...
```

## Architecture web (web/src/)
```
lib/
  types.ts         — Interfaces TS (Paper, Topic, Level, SearchItem, LearningPath, Quiz, Question...)
  markdown.ts      — Pipeline unified + plugins custom (rehypeMermaid, rehypeRewriteLinks)
  content.ts       — Lecture data/topics/ via fs au build-time (SSG)

components/
  Header.tsx       — Nav sticky avec burger mobile + ThemeToggle
  Footer.tsx       — Footer simple
  ThemeToggle.tsx  — Toggle dark mode : auto (heure locale) / clair / sombre
  TopicCard.tsx    — Carte topic pour la grille
  LevelBadge.tsx   — Badge coloré (vert/ambre/violet)
  PaperCard.tsx    — Carte paper avec liens et tags
  MarkdownRenderer.tsx — Client component, rendu HTML + init Mermaid (dynamic import, thème adapté)
  SearchBar.tsx    — Recherche Fuse.js (dropdown compact ou full page)
  LearningPath.tsx — Parcours interactif : 3 colonnes, flèches SVG au hover, progression useProgress hook
  Quiz.tsx         — Quiz interactif : questions, score, explications, useQuizScore hook
  Breadcrumb.tsx   — Fil d'Ariane
  Providers.tsx    — Wrapper client pour AuthProvider
  AuthModal.tsx    — Modal connexion/inscription (email + OAuth Google/GitHub)
  UserMenu.tsx     — Dropdown avatar utilisateur (profil, déconnexion)
  BookmarkButton.tsx — Bouton favori (coeur, toggle, Supabase)

contexts/
  AuthContext.tsx   — Provider auth Supabase (session, login/logout, migration localStorage)

hooks/
  useProgress.ts   — Progression topics (dual localStorage/Supabase)
  useQuizScore.ts  — Scores quiz (dual localStorage/Supabase)
  useBookmarks.ts  — Favoris Supabase (requiert login)

app/
  page.tsx                              — Homepage (hero + grille topics)
  topics/[slug]/page.tsx                — Page topic (index + summary + papers + resources + CTA quiz)
  topics/[slug]/papers/page.tsx         — Liste papers
  topics/[slug]/papers/[paperSlug]/page.tsx — Résumé paper individuel
  topics/[slug]/quiz/page.tsx           — Quiz interactif par topic
  parcours/page.tsx                     — Parcours d'apprentissage
  recherche/page.tsx                    — Page recherche
  profil/page.tsx                       — Page profil utilisateur (stats, scores, favoris)
```

## Routes web

| Route | Pages | Description |
|-------|-------|-------------|
| `/` | 1 | Homepage — grille de 13 topics triés par learning-path |
| `/topics/[slug]` | 13 | Page topic — vue d'ensemble, résumé IA, Mermaid, KaTeX, papers, ressources |
| `/topics/[slug]/papers` | 13 | Liste papers par topic |
| `/topics/[slug]/papers/[slug]` | 148 | Résumé vulgarisé d'un paper |
| `/topics/[slug]/quiz` | 13 | Quiz interactif par topic |
| `/parcours` | 1 | Parcours interactif (3 colonnes, flèches SVG, progression localStorage) |
| `/recherche` | 1 | Recherche full-page (322 items indexés) |
| `/profil` | 1 | Page profil utilisateur (stats, scores, favoris — client-side) |

**Total : 194 pages statiques**

## Plugins Markdown custom

- **rehypeMermaid** : transforme `<pre><code class="language-mermaid">` en `<pre class="mermaid">` (format attendu par Mermaid.js)
- **rehypeRewriteLinks** : réécrit les liens `../topic-slug/` en `/topics/topic-slug` pour la navigation web

## Dark mode

- **Stratégie** : `darkMode: 'class'` dans Tailwind. Classe `dark` sur `<html>` active tous les `dark:` prefixes.
- **ThemeToggle** : 3 modes cycliques — Auto (horloge) → Clair (soleil) → Sombre (lune)
- **Mode Auto** : basé sur l'heure locale de l'utilisateur (7h-20h = light, 20h-7h = dark), re-check chaque minute
- **Persistance** : `localStorage('theme')` pour le choix manuel, supprimé en mode auto
- **Anti-flash** : script inline dans `<head>` lit localStorage/heure AVANT le premier rendu
- **Mermaid** : MutationObserver sur `<html>` détecte le changement de classe `dark` → re-render avec le bon thème
- **KaTeX** : `.dark .katex { color: inherit }` dans globals.css
- **Prose** : `dark:prose-invert` (plugin typography built-in)

## Parcours interactif (`/parcours`)

- **Layout** : grille 3 colonnes (desktop `md:grid-cols-3`) / empilé vertical (mobile)
- **Colonnes** : Débutant (4 topics) | Intermédiaire (6) | Avancé (3)
- **Flèches SVG** : masquées par défaut, apparaissent au hover d'un topic (courbes bézier entre prérequis et dépendants)
- **Hover highlight** : cartes connectées restent opaques, les autres passent en `opacity-25`, flèches colorées par niveau
- **Progression** : checkbox par topic, `localStorage('scibase-progress')`, barre de progression gradient en haut
- **Responsive** : pas de flèches SVG sur mobile (`hidden md:block`)
- **Markers SVG** : arrowheads colorés par niveau (emerald/amber/purple), adaptés light/dark via `isDark` state
- **Dark mode** : MutationObserver sur `<html>` pour détecter les changements de classe

## SEO

- **metadataBase** : `https://sci-base.vercel.app` dans `layout.tsx` — toutes les URLs OG sont résolues contre cette base
- **Open Graph** : `type`, `locale` (fr_FR), `siteName`, `title`, `description`, `url` définis au niveau layout, hérités par les pages enfants
- **Twitter cards** : `summary_large_image` défini globalement
- **generateMetadata** : chaque page dynamique ajoute `openGraph.url` pour l'URL canonique
- **robots.txt** : fichier statique dans `web/public/`, Allow all + lien vers sitemap
- **sitemap.xml** : généré au prebuild par `generateSitemap.mjs` (190 URLs, priorités 1.0→0.5)
- **poweredByHeader** : désactivé dans `next.config.mjs`

## Quizzes interactifs

- **Stockage** : `quiz.json` par topic dans `data/topics/<slug>/`
- **Schema** : `data/schemas/quiz.schema.json` (JSON Schema Draft-07)
- **Génération** : `scripts/quiz_generator.py` via Groq (pattern du summarizer)
- **Route** : `/topics/[slug]/quiz` — page dédiée par topic
- **Nb questions** : 5 (débutant), 10 (intermédiaire), 15 (avancé)
- **Types** : QCM (4 options) + Vrai/Faux
- **Composant** : `Quiz.tsx` — client component avec state, progression, score
- **Scores** : `useQuizScore` hook (dual localStorage/Supabase)
- **Search** : quizzes indexés dans Fuse.js (type `'quiz'`)
- **CTA** : lien "Testez vos connaissances" sur chaque page topic (si quiz existe)

## Supabase (Auth + Données utilisateur)

- **Client** : `@supabase/supabase-js` v2, client-side only (compatible `output: 'export'`)
- **Env vars** : `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (build-time, publiques par design)
- **Auth providers** : Email/Password (autoconfirm ON), GitHub OAuth — Google OAuth a configurer
- **Tables** : `profiles`, `topic_progress`, `quiz_scores`, `bookmarks` — toutes protégées par RLS
- **Projet** : `fpvbiephobgmadcalwwk` (region `eu-west-1`)
- **SQL schema** : `supabase/schema.sql` — déjà exécuté en prod
- **Stratégie dual** : anonyme = localStorage seul, connecté = Supabase + localStorage (cache)
- **Migration** : au premier login, localStorage est migré vers Supabase (flag `scibase-migrated`)
- **Fichiers clés** :
  - `lib/supabase.ts` — client singleton (placeholder si env vars absentes)
  - `lib/database.types.ts` — types TS des tables Supabase
  - `contexts/AuthContext.tsx` — provider auth, session, migration localStorage
  - `components/Providers.tsx` — wrapper client pour providers
  - `components/AuthModal.tsx` — modal connexion/inscription (email + OAuth)
  - `components/UserMenu.tsx` — dropdown avatar (profil, déconnexion)
  - `components/BookmarkButton.tsx` — bouton favori (coeur)
  - `hooks/useProgress.ts` — progression topics (dual localStorage/Supabase)
  - `hooks/useQuizScore.ts` — scores quiz (dual localStorage/Supabase)
  - `hooks/useBookmarks.ts` — favoris (Supabase uniquement)
  - `app/profil/page.tsx` — page profil (stats, scores, favoris)

## Commandes

### Web
- `cd web && npm run dev` — lance le site en local (http://localhost:3000)
- `cd web && npm run build` — build prod (194 pages statiques, prebuild génère search-index.json + sitemap.xml)
- `cd web && npm run lint` — lint TypeScript/ESLint

### Scripts Python
- `python scripts/arxiv_fetcher.py --topic "machine learning"` — fetch papers (option `--slug` pour découpler query et slug)
- `python scripts/summarizer.py --topic "machine learning"` — génère les résumés (ollama par défaut)
- `python scripts/summarizer.py --topic "machine learning" --provider groq` — résumés via Groq API (gratuit)
- `python scripts/summarizer.py --topic "machine learning" --provider claude` — résumés via Claude API
- `python scripts/summarizer.py --topic "machine learning" --mode papers` — résumés individuels uniquement
- `python scripts/summarizer.py --topic "machine learning" --dry-run` — prévisualisation sans LLM
- `python scripts/quiz_generator.py --topic "machine-learning" --provider groq` — génère un quiz
- `python scripts/quiz_generator.py --topic all --provider groq` — génère les quizzes pour tous les topics
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
- `web/scripts/generateSearchIndex.mjs` : génère `public/search-index.json` (322 items)
- `web/scripts/generateSitemap.mjs` : génère `public/sitemap.xml` (190 URLs avec priorités)
- Auto-deploy à chaque `git push` sur master
- **Important** : avec Root Directory = `web/`, les fichiers hors de `web/` ne sont PAS accessibles au build. Le script `copyData.mjs` résout ce problème.
