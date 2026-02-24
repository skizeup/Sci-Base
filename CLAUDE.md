# SciBase

## Vision
Plateforme d'apprentissage scientifique open-source.
Phase 1 : Repo GitHub curé de ressources scientifiques — FAIT (13 topics, 148 papers).
Phase 2 : Site web Next.js interactif — FAIT (live sur sci-base.vercel.app).
Phase 3 Sprint 1 : Dark mode + SEO — FAIT.
Phase 3 Sprint 2 : Nouveaux topics + Parcours interactif — FAIT.
Phase 3 Sprint 3 : Quizzes interactifs — FAIT (13 quiz, 193 pages statiques).
Phase 3 Sprint 3 (suite) : Supabase auth + progression + bookmarks — FAIT (194 pages).
Phase 3 Sprint 4 : i18n (FR + EN) — FAIT (386 pages statiques, 2 locales).

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
- Recherche : Fuse.js (client-side, index JSON par locale au build via scripts/generateSearchIndex.mjs)
- Frontmatter : gray-matter
- Auth/DB : Supabase (`@supabase/supabase-js` v2, client-side only — email + Google + GitHub)
- i18n : custom léger (dictionnaires JSON, LocaleContext, pas de next-intl), 2 locales (fr/en)
- SEO : metadataBase, Open Graph, Twitter cards, hreflang alternates, robots.txt, sitemap.xml (380 URLs au build)
- SSG : generateStaticParams sur toutes les routes dynamiques (produit cartésien locale x slugs)

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
- Contenu FR dans `data/topics/`, contenu EN dans `data/en/topics/` (fallback FR si EN manquant)
- `papers.json` non dupliqué (contenu déjà anglais, lu toujours depuis `data/topics/`)
- Commits conventionnels (feat:, fix:, docs:)

## Public cible
- Étudiants en sciences (licence/master)
- Curieux autodidactes

## Structure des dossiers
```
data/topics/       — Contenu FR (un sous-dossier par topic)
data/en/topics/    — Contenu EN (structure miroir, fallback vers FR)
data/schemas/      — Schémas JSON de validation
scripts/           — Scripts Python (fetchers, validation, summarizer, translator)
web/               — App Next.js
  src/
    app/[locale]/  — Pages préfixées par locale (App Router)
    lib/           — Data layer (types, markdown, content, i18n)
    components/    — Composants React
    contexts/      — React contexts (Auth, Locale)
    hooks/         — Custom hooks (progress, quiz, bookmarks)
  scripts/         — Scripts Node.js (search index, sitemap, copyData)
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
  types.ts              — Interfaces TS (Paper, Topic, Level, SearchItem, Quiz, etc.)
  markdown.ts           — Pipeline unified + plugins (rehypeMermaid, rehypeRewriteLinks locale-aware)
  content.ts            — Lecture data/topics/ via fs, toutes fonctions acceptent locale
  supabase.ts           — Client Supabase singleton
  database.types.ts     — Types TS tables Supabase
  i18n/
    config.ts           — LOCALES, Locale type, DEFAULT_LOCALE
    dictionaries/
      fr.json           — ~120 strings UI françaises
      en.json           — ~120 strings UI anglaises
    dictionaries.ts     — Loader statique (getDictionary)
    translate.ts        — Helper translate(dict, key, params?) avec interpolation
    link.ts             — localePath(locale, path) — préfixe les chemins

components/
  Header.tsx            — Nav + ThemeToggle + LanguageSwitcher + AuthModal/UserMenu
  Footer.tsx            — Footer (client component, useTranslation)
  ThemeToggle.tsx       — Toggle dark mode (useTranslation)
  LanguageSwitcher.tsx  — Toggle FR/EN (remplacement dans le pathname)
  LocaleLink.tsx        — Wrapper <Link> auto-préfixé locale
  TopicCard.tsx         — Carte topic (reçoit locale en prop)
  LevelBadge.tsx        — Badge coloré (reçoit locale en prop)
  PaperCard.tsx         — Carte paper (reçoit locale en prop)
  MarkdownRenderer.tsx  — Client component, rendu HTML + Mermaid
  SearchBar.tsx         — Recherche Fuse.js (useLocale, fetch search-index-${locale}.json)
  LearningPath.tsx      — Parcours interactif (useTranslation, locale prop)
  Quiz.tsx              — Quiz interactif (useTranslation)
  Breadcrumb.tsx        — Fil d'Ariane
  Providers.tsx         — Wrapper client pour AuthProvider
  AuthModal.tsx         — Modal connexion/inscription (useTranslation)
  UserMenu.tsx          — Dropdown avatar (useTranslation, useLocale)
  BookmarkButton.tsx    — Bouton favori (useTranslation)

contexts/
  AuthContext.tsx        — Provider auth Supabase
  LocaleContext.tsx      — LocaleProvider + useLocale() + useTranslation()

hooks/
  useProgress.ts        — Progression topics (dual localStorage/Supabase)
  useQuizScore.ts       — Scores quiz (dual localStorage/Supabase)
  useBookmarks.ts       — Favoris Supabase (requiert login)

app/
  layout.tsx                                        — Shell minimal (html, body, scripts inline)
  page.tsx                                          — Redirect → /fr/
  [locale]/
    layout.tsx                                      — Layout locale (metadata, LocaleProvider, Header, Footer)
    page.tsx                                        — Homepage
    parcours/page.tsx                               — Parcours d'apprentissage
    recherche/page.tsx                              — Page recherche
    profil/page.tsx                                 — Page profil utilisateur
    topics/[slug]/page.tsx                          — Page topic
    topics/[slug]/papers/page.tsx                   — Liste papers
    topics/[slug]/papers/[paperSlug]/page.tsx       — Résumé paper
    topics/[slug]/quiz/page.tsx                     — Quiz interactif
```

## Routes web

| Route | Pages | Description |
|-------|-------|-------------|
| `/` | 1 | Redirect → `/fr/` |
| `/[locale]` | 2 | Homepage — grille de 13 topics (FR + EN) |
| `/[locale]/topics/[slug]` | 26 | Page topic (13 x 2 locales) |
| `/[locale]/topics/[slug]/papers` | 26 | Liste papers par topic |
| `/[locale]/topics/[slug]/papers/[slug]` | 296 | Résumé paper (148 x 2 locales) |
| `/[locale]/topics/[slug]/quiz` | 26 | Quiz interactif par topic |
| `/[locale]/parcours` | 2 | Parcours interactif |
| `/[locale]/recherche` | 2 | Recherche full-page (322 items par locale) |
| `/[locale]/profil` | 2 | Page profil utilisateur |

**Total : ~386 pages statiques (190 pages x 2 locales + pages root)**

## Plugins Markdown custom

- **rehypeMermaid** : transforme `<pre><code class="language-mermaid">` en `<pre class="mermaid">` (format attendu par Mermaid.js)
- **rehypeRewriteLinks** : réécrit les liens `../topic-slug/` en `/${locale}/topics/topic-slug` pour la navigation web (locale-aware)

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

- **metadataBase** : `https://sci-base.vercel.app` dans `[locale]/layout.tsx`
- **Open Graph** : `type`, `locale` (fr_FR / en_US selon langue), `siteName`, `title`, `description`, `url` définis par locale
- **hreflang** : `alternates.languages` avec `{ fr: '/fr/...', en: '/en/...' }` sur chaque page
- **Twitter cards** : `summary_large_image` défini globalement
- **generateMetadata** : chaque page ajoute `openGraph.url` canonique et `alternates.languages`
- **robots.txt** : fichier statique dans `web/public/`, Allow all + lien vers sitemap
- **sitemap.xml** : généré au prebuild par `generateSitemap.mjs` (380 URLs = 190 x 2 locales, hreflang + x-default)
- **`<html lang>`** : script inline détecte `/fr` ou `/en` dans l'URL pathname
- **poweredByHeader** : désactivé dans `next.config.mjs`

## i18n (Internationalisation)

- **Locales** : `fr` (défaut), `en` — définies dans `lib/i18n/config.ts`
- **Routing** : URLs préfixées `/fr/...` et `/en/...`, `/` redirige vers `/fr/`
- **Dictionnaires** : `lib/i18n/dictionaries/{fr,en}.json` (~120 strings UI chacun)
- **Server components** : `getDictionary(locale)` + `translate(dict, key, params)` pour les strings
- **Client components** : `useTranslation()` hook via `LocaleContext`
- **Liens** : `localePath(locale, path)` ou `<LocaleLink>` pour préfixer automatiquement
- **Contenu** : FR dans `data/topics/`, EN dans `data/en/topics/` (fallback FR si EN manquant)
- **Traduction** : `scripts/translator.py` — traduit le contenu via LLM (Groq recommandé)
- **Search** : un index par locale (`search-index-fr.json`, `search-index-en.json`)
- **`papers.json`** : non dupliqué (contenu déjà en anglais)
- **Valeurs internes** : niveaux (`debutant`, `intermediaire`, `avance`) et difficultés (`facile`, `moyen`, `difficile`) restent en français — seul l'affichage est traduit

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
- `cd web && npm run build` — build prod (~386 pages statiques, prebuild génère search-index-{fr,en}.json + sitemap.xml)
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
- `python scripts/translator.py --topic all --provider groq` — traduit tout le contenu FR→EN
- `python scripts/translator.py --topic machine-learning --provider groq` — traduit un topic
- `python scripts/translator.py --topic all --mode quiz --provider groq` — traduit les quizzes seulement
- `python scripts/translator.py --learning-path --provider groq` — traduit learning-path.json
- `python scripts/translator.py --topic all --dry-run` — prévisualisation sans LLM

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
- `web/scripts/generateSearchIndex.mjs` : génère `public/search-index-{fr,en}.json` (322 items par locale)
- `web/scripts/generateSitemap.mjs` : génère `public/sitemap.xml` (380 URLs = 190 x 2 locales, hreflang)
- Auto-deploy à chaque `git push` sur master
- **Important** : avec Root Directory = `web/`, les fichiers hors de `web/` ne sont PAS accessibles au build. Le script `copyData.mjs` résout ce problème.
