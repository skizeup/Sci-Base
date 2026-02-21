# SciBase

Plateforme d'apprentissage scientifique open-source.

**Phase 1** (en cours) : Repo GitHub de ressources scientifiques curées automatiquement.
**Phase 2** (planifiée) : Site web interactif style W3Schools pour la science.

## Fonctionnalités

- Fetch automatique de papers depuis arXiv
- Résumés vulgarisés générés par LLM (Ollama, DeepSeek ou Claude)
- Validation des données par schémas JSON
- Parcours d'apprentissage structurés
- Contenu en français, papers en anglais

## Structure du projet

```
data/
  topics/              Un sous-dossier par topic
    <topic-name>/
      _index.md        Description du topic
      papers.json      Papers référencés (validé par schema)
      resources.md     Ressources complémentaires
      summary.md       Résumé vulgarisé (généré)
      paper-summaries/ Résumés individuels (générés)
  schemas/             Schémas JSON de validation
scripts/               Scripts Python (fetchers, summarizer)
web/                   App Next.js (Phase 2)
notebooks/             Notebooks Jupyter
docs/                  Documentation
```

## Installation

```bash
# Cloner le repo
git clone https://github.com/<user>/Sci-Base.git
cd Sci-Base

# Installer les dépendances Python
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
# Avec Ollama (défaut, gratuit, local)
# Nécessite : ollama serve + un modèle installé (ex: ollama pull deepseek-r1)
python scripts/summarizer.py --topic "machine learning"

# Avec l'API Claude
# Nécessite : variable d'env ANTHROPIC_API_KEY
python scripts/summarizer.py --topic "machine learning" --provider claude

# Avec l'API DeepSeek
# Nécessite : variable d'env DEEPSEEK_API_KEY
python scripts/summarizer.py --topic "machine learning" --provider deepseek

# Résumés de papers uniquement
python scripts/summarizer.py --topic "machine learning" --mode papers

# Prévisualisation (sans appeler le LLM)
python scripts/summarizer.py --topic "machine learning" --dry-run
```

### Providers LLM disponibles

| Provider | Type | Modèle par défaut | Prérequis |
|----------|------|-------------------|-----------|
| `ollama` | Local (gratuit) | `deepseek-r1` | [Ollama](https://ollama.ai) installé + `ollama serve` |
| `deepseek` | API | `deepseek-chat` | Variable d'env `DEEPSEEK_API_KEY` |
| `claude` | API | `claude-sonnet-4-5-20250929` | Variable d'env `ANTHROPIC_API_KEY` |

> **Note** : Les résumés sont générés une seule fois et stockés dans le repo. Les utilisateurs qui clonent le projet n'ont **pas besoin** d'un LLM pour consulter le contenu.

## Stack technique

- **Data** : Markdown + JSON
- **Scripts** : Python 3.11+
- **Web** (Phase 2) : Next.js 14 + TypeScript + Tailwind CSS
- **Math** : KaTeX pour le rendu LaTeX
- **Recherche** : Fuse.js (client-side)

## Sources de données

- [arXiv](https://arxiv.org) (API REST)
- [Semantic Scholar](https://www.semanticscholar.org) (API gratuite)
- [PubMed](https://pubmed.ncbi.nlm.nih.gov) (API Entrez)
- [Papers With Code](https://paperswithcode.com) (API)
- HAL Science, CORE, DBLP

## Contribuer

1. Fork le repo
2. Crée une branche (`git checkout -b feat/mon-topic`)
3. Ajoute ton contenu ou tes corrections
4. Commits conventionnels : `feat:`, `fix:`, `docs:`
5. Ouvre une Pull Request

## Licence

MIT
