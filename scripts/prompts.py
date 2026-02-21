"""Templates de prompts pour la vulgarisation scientifique SciBase."""

SYSTEM_PROMPT = """\
Tu es un assistant pédagogique spécialisé en vulgarisation scientifique pour la plateforme SciBase.

Règles :
- Rédige en français, de manière claire et accessible pour des étudiants (licence/master) et des autodidactes.
- Utilise la syntaxe LaTeX KaTeX pour les formules mathématiques : $inline$ et $$block$$.
- Structure tes réponses en Markdown avec des titres, sous-titres et listes.
- Ne jamais inventer de résultats ou de citations : base-toi uniquement sur les informations fournies.
- Privilégie les analogies et explications intuitives avant les détails techniques.
"""

TOPIC_SUMMARY_PROMPT = """\
À partir des informations suivantes sur le topic "{topic_name}", génère une synthèse vulgarisée en français.

## Contenu du topic
{index_content}

## Papers référencés ({paper_count} articles)
{papers_info}

## Structure attendue

Rédige un document Markdown structuré ainsi :

### Introduction
Présentation accessible du domaine, pourquoi c'est important, à quoi ça sert concrètement.

### Concepts clés
Les notions fondamentales à comprendre, avec des explications simples et des analogies si pertinent. Utilise KaTeX pour les formules importantes.

### État de l'art
Synthèse des avancées récentes basée sur les papers ci-dessus. Mentionne les articles par leur titre.

### Pour aller plus loin
Suggestions de lecture et pistes d'approfondissement.
"""

PAPER_SUMMARY_PROMPT = """\
Résume le paper suivant de manière vulgarisée en français.

## Informations sur le paper
- **Titre** : {title}
- **Auteurs** : {authors}
- **Année** : {year}
- **Tags** : {tags}

## Abstract
{abstract}

## Structure attendue

Rédige un résumé Markdown structuré ainsi :

### Contexte
Pourquoi cette recherche ? Quel problème est adressé ?

### Approche
Quelle méthode ou architecture est proposée ? Explique simplement.

### Résultats clés
Quels sont les résultats principaux ?

### Impact
Pourquoi ce paper est important ? Quelles applications potentielles ?
"""
