# SciBase

**Plateforme d'apprentissage scientifique open-source** — Apprendre l'IA et le machine learning par la pratique, avec des ressources curées et des résumés vulgarisés.

> SciBase est pensé pour les étudiants en sciences (licence/master) et les curieux autodidactes qui veulent comprendre l'IA sans se noyer dans les papers académiques.

**Phase 1** (en cours) : Repo GitHub de ressources scientifiques curées.
**Phase 2** (planifiée) : Site web interactif style W3Schools pour la science.

---

## Topics disponibles

| Topic | Papers | Niveau | Description |
|-------|:------:|--------|-------------|
| [Machine Learning](data/topics/machine-learning/) | 10 | Debutant | Fondamentaux du ML : supervisé, non supervisé, algorithmes classiques |
| [Deep Learning](data/topics/deep-learning/) | 7 | Debutant | Réseaux de neurones profonds, CNN, RNN, Transformers, GANs |
| [Natural Language Processing](data/topics/natural-language-processing/) | 7 | Intermediaire | Traitement du langage : embeddings, BERT, GPT, LLMs, RAG |
| [Computer Vision](data/topics/computer-vision/) | 7 | Intermediaire | Vision par ordinateur : classification, détection, segmentation, diffusion |
| [Reinforcement Learning](data/topics/reinforcement-learning/) | 7 | Intermediaire | Apprentissage par renforcement : DQN, PPO, AlphaGo, RLHF |
| [Transfer Learning](data/topics/transfer-learning/) | 20 | Intermediaire | Apprentissage par transfert : fine-tuning, domain adaptation, few-shot |
| [Generative Models](data/topics/generative-models/) | 20 | Intermediaire | Modèles génératifs : GANs, VAEs, diffusion, normalizing flows |
| [Graph Neural Networks](data/topics/graph-neural-networks/) | 20 | Avance | Réseaux de neurones sur graphes : GCN, GAT, message passing |
| [Large Language Models](data/topics/large-language-models/) | 20 | Avance | Grands modèles de langage : GPT, LLaMA, RLHF, scaling laws |
| [Vision-Language Models](data/topics/vision-language-models/) | 20 | Avance | Modèles vision-langage : CLIP, multimodal, image-text alignment |

## Parcours d'apprentissage

Le parcours recommandé suit cette progression :

```
Machine Learning (debutant)
    ├── Deep Learning (debutant)
    │       ├── NLP (intermediaire)
    │       │       └── Large Language Models (avance)
    │       ├── Computer Vision (intermediaire)
    │       │       └── Vision-Language Models (avance) ← aussi NLP
    │       ├── Transfer Learning (intermediaire) ← aussi ML
    │       ├── Generative Models (intermediaire)
    │       └── Graph Neural Networks (avance)
    └── Reinforcement Learning (intermediaire)
```

Chaque topic contient :
- **`_index.md`** — Présentation pédagogique avec concepts clés et formules KaTeX
- **`papers.json`** — Papers fondamentaux soigneusement sélectionnés
- **`resources.md`** — Cours, livres et outils recommandés

---

## Installation

```bash
git clone https://github.com/<user>/Sci-Base.git
cd Sci-Base
pip install -r scripts/requirements.txt
```

## Utilisation

### Récupérer des papers depuis arXiv

```bash
python scripts/arxiv_fetcher.py --topic "machine learning"
python scripts/arxiv_fetcher.py --topic "reinforcement learning" --max-results 50
```

### Générer des résumés vulgarisés

Le summarizer utilise un LLM pour produire des résumés accessibles en français.

```bash
# Avec Ollama (defaut, gratuit, local)
python scripts/summarizer.py --topic "machine learning"

# Avec l'API Claude
python scripts/summarizer.py --topic "machine learning" --provider claude

# Avec l'API DeepSeek
python scripts/summarizer.py --topic "machine learning" --provider deepseek

# Avec l'API Groq (gratuit, ultra rapide)
python scripts/summarizer.py --topic "machine learning" --provider groq

# Résumés de papers uniquement
python scripts/summarizer.py --topic "machine learning" --mode papers

# Prévisualisation (sans appeler le LLM)
python scripts/summarizer.py --topic "machine learning" --dry-run
```

### Providers LLM disponibles

| Provider | Type | Modele par defaut | Prerequis |
|----------|------|-------------------|-----------|
| `ollama` | Local (gratuit) | `deepseek-r1` | [Ollama](https://ollama.ai) installe + `ollama serve` |
| `deepseek` | API | `deepseek-chat` | Variable d'env `DEEPSEEK_API_KEY` |
| `claude` | API | `claude-sonnet-4-5-20250929` | Variable d'env `ANTHROPIC_API_KEY` |
| `groq` | API (gratuit) | `llama-3.3-70b-versatile` | Variable d'env `GROQ_API_KEY` |

> Les résumés sont générés une seule fois et stockés dans le repo. Les utilisateurs qui clonent le projet n'ont **pas besoin** d'un LLM pour consulter le contenu.

## Structure du projet

```
data/
  topics/                 Un sous-dossier par topic
    <topic-name>/
      _index.md           Presentation pedagogique du topic
      papers.json         Papers fondamentaux (valide par schema)
      resources.md        Cours, livres et outils recommandes
      summary.md          Resume vulgarise (genere par LLM)
      paper-summaries/    Resumes individuels (generes par LLM)
    learning-path.json    Parcours d'apprentissage ordonne
  schemas/                Schemas JSON de validation
scripts/                  Scripts Python (fetchers, summarizer)
web/                      App Next.js (Phase 2)
notebooks/                Notebooks Jupyter
docs/                     Documentation
```

## Stack technique

- **Data** : Markdown + JSON
- **Scripts** : Python 3.11+
- **LLM** : Ollama (local) / DeepSeek / Claude / Groq (API)
- **Web** (Phase 2) : Next.js 14 + TypeScript + Tailwind CSS
- **Math** : KaTeX pour le rendu LaTeX

## Sources de donnees

- [arXiv](https://arxiv.org) (API REST)
- [Semantic Scholar](https://www.semanticscholar.org) (API gratuite)
- [PubMed](https://pubmed.ncbi.nlm.nih.gov) (API Entrez)
- [Papers With Code](https://paperswithcode.com) (API)
- HAL Science, CORE, DBLP

## Contribuer

1. Fork le repo
2. Cree une branche (`git checkout -b feat/mon-topic`)
3. Ajoute ton contenu ou tes corrections
4. Commits conventionnels : `feat:`, `fix:`, `docs:`
5. Ouvre une Pull Request

## Licence

MIT
