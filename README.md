# SciBase

**Apprendre l'IA et le Machine Learning** — des résumés vulgarisés en français, des papers fondamentaux, et un parcours d'apprentissage structuré.

> Pour les étudiants en sciences (licence/master) et les curieux autodidactes qui veulent comprendre l'IA sans se noyer dans les papers académiques.

---

## Site web

**[sci-base.vercel.app](https://sci-base.vercel.app)** — le site est déployé et accessible publiquement.

Rendu LaTeX, diagrammes Mermaid interactifs, recherche intégrée, parcours d'apprentissage progressif, dark mode automatique, SEO (Open Graph, sitemap, robots.txt).

```bash
# Développement local
cd web && npm install && npm run dev
# → http://localhost:3000
```

### Stack web

| Technologie | Rôle |
|-------------|------|
| Next.js 14 (App Router) | Framework React, SSG |
| TypeScript | Typage statique |
| Tailwind CSS | Styling + `@tailwindcss/typography` + dark mode (`darkMode: 'class'`) |
| unified / remark / rehype | Pipeline Markdown → HTML |
| KaTeX (rehype-katex) | Rendu LaTeX au build-time (zero JS client) |
| Mermaid.js | Diagrammes (client-side, dynamic import) |
| Fuse.js | Recherche client-side (index JSON pré-généré) |
| gray-matter | Parsing du frontmatter YAML |

### Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — grille des 10 topics |
| `/topics/[slug]` | Page topic — vue d'ensemble, résumé IA, papers, ressources |
| `/topics/[slug]/papers` | Liste des papers d'un topic |
| `/topics/[slug]/papers/[slug]` | Résumé vulgarisé d'un paper |
| `/parcours` | Parcours d'apprentissage progressif |
| `/recherche` | Recherche full-page (248 items indexés) |

**146 pages statiques** générées au build.

### Dark mode

Le site supporte un dark mode avec 3 modes :
- **Auto** — basé sur l'heure locale (7h-20h clair, 20h-7h sombre)
- **Clair** — forcé light
- **Sombre** — forcé dark

Le choix est persisté dans `localStorage`. Le mode auto se met à jour automatiquement. Un script inline dans `<head>` empêche le flash blanc au chargement.

### SEO

- **Open Graph** + **Twitter Cards** sur toutes les pages (titre, description, URL canonique)
- **sitemap.xml** généré au build (142 URLs avec priorités)
- **robots.txt** avec lien vers le sitemap

---

## Parcours d'apprentissage

```
Machine Learning (debutant)
    ├── Deep Learning (debutant)
    │       ├── NLP (intermediaire)
    │       │       └── Large Language Models (avance)
    │       ├── Computer Vision (intermediaire)
    │       │       └── Vision-Language Models (avance)
    │       ├── Transfer Learning (intermediaire)
    │       ├── Generative Models (intermediaire)
    │       └── Graph Neural Networks (avance)
    └── Reinforcement Learning (intermediaire)
```

## Topics

| Topic | Papers | Niveau | Description |
|-------|:------:|--------|-------------|
| [Machine Learning](data/topics/machine-learning/) | 10 | Debutant | Supervisé, non supervisé, algorithmes classiques (SVM, Random Forests, XGBoost) |
| [Deep Learning](data/topics/deep-learning/) | 7 | Debutant | Réseaux de neurones profonds, CNN, Transformers, GANs, diffusion |
| [Natural Language Processing](data/topics/natural-language-processing/) | 7 | Intermediaire | Embeddings, BERT, GPT, LLaMA, RAG |
| [Computer Vision](data/topics/computer-vision/) | 7 | Intermediaire | Classification, détection (YOLO), segmentation (U-Net, Mask R-CNN) |
| [Reinforcement Learning](data/topics/reinforcement-learning/) | 7 | Intermediaire | DQN, PPO, AlphaGo, MuZero, RLHF |
| [Transfer Learning](data/topics/transfer-learning/) | 16 | Intermediaire | Fine-tuning, domain adaptation, few-shot learning |
| [Generative Models](data/topics/generative-models/) | 20 | Intermediaire | GANs, VAEs, modèles de diffusion |
| [Graph Neural Networks](data/topics/graph-neural-networks/) | 5 | Avance | GCN, GAT, message passing, graphes hétérogènes |
| [Large Language Models](data/topics/large-language-models/) | 20 | Avance | GPT, LLaMA, scaling laws, RLHF, multimodalité |
| [Vision-Language Models](data/topics/vision-language-models/) | 20 | Avance | CLIP, BLIP, visual instruction tuning |

## Que contient chaque topic ?

Chaque dossier de topic contient :

- **`_index.md`** — Explication pédagogique du domaine avec concepts clés et formules
- **`summary.md`** — Résumé vulgarisé généré par IA avec diagrammes Mermaid
- **`papers.json`** — Papers fondamentaux soigneusement sélectionnés
- **`paper-summaries/`** — Un résumé en français pour chaque paper
- **`resources.md`** — Cours, livres et outils recommandés

---

<details>
<summary><b>Pour les contributeurs</b></summary>

### Installation

```bash
# Scripts Python (fetchers, summarizer)
pip install -r scripts/requirements.txt

# Site web
cd web && npm install
```

### Développement web

```bash
cd web
npm run dev      # Dev server → http://localhost:3000
npm run build    # Build prod (146 pages statiques)
npm run lint     # Lint TypeScript/ESLint
```

Le `prebuild` script copie les données, génère `public/search-index.json` (index Fuse.js) et `public/sitemap.xml` (142 URLs).

### Déploiement

Le site est déployé automatiquement sur [Vercel](https://vercel.com) à chaque `git push` sur `master`.

- **URL** : [sci-base.vercel.app](https://sci-base.vercel.app)
- **Root directory** : `web`
- **Build** : `npm run build` (prebuild copie `data/` + génère l'index de recherche + sitemap, puis `next build` génère 146 pages statiques)

### Récupérer des papers depuis arXiv

```bash
python scripts/arxiv_fetcher.py --topic "machine learning"
python scripts/arxiv_fetcher.py --topic "reinforcement learning" --max-results 50
```

### Générer des résumés

Le summarizer utilise un LLM pour produire des résumés en français. Les résumés sont déjà générés et inclus dans le repo — cette étape n'est nécessaire que pour ajouter de nouveaux topics.

```bash
# Ollama (local, gratuit)
python scripts/summarizer.py --topic "machine learning"

# Groq (API gratuite, rapide) — RECOMMANDÉ
python scripts/summarizer.py --topic "machine learning" --provider groq

# Claude ou DeepSeek
python scripts/summarizer.py --topic "machine learning" --provider claude
python scripts/summarizer.py --topic "machine learning" --provider deepseek
```

| Provider | Type | Modèle par défaut | Prérequis |
|----------|------|-------------------|-----------|
| `ollama` | Local (gratuit) | `deepseek-r1` | [Ollama](https://ollama.ai) + `ollama serve` |
| `groq` | API (gratuit) | `llama-3.3-70b-versatile` | `GROQ_API_KEY` |
| `deepseek` | API | `deepseek-chat` | `DEEPSEEK_API_KEY` |
| `claude` | API | `claude-sonnet-4-5-20250929` | `ANTHROPIC_API_KEY` |

### Contribuer

1. Fork le repo
2. Crée une branche (`git checkout -b feat/mon-topic`)
3. Commits conventionnels : `feat:`, `fix:`, `docs:`
4. Ouvre une Pull Request

</details>

## Licence

MIT
