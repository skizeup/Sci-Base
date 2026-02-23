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

QUIZ_SYSTEM_PROMPT = """\
Tu es un assistant pédagogique spécialisé en création de quiz scientifiques pour la plateforme SciBase.

Règles :
- Rédige les questions et explications en français.
- Crée des questions claires et sans ambiguïté.
- Les distracteurs (mauvaises réponses) doivent être plausibles mais clairement faux.
- Les explications doivent être pédagogiques (2-3 phrases).
- Varie les niveaux de difficulté (facile, moyen, difficile).
- Ne jamais inventer de résultats ou de citations : base-toi uniquement sur les informations fournies.
- Tu dois retourner UNIQUEMENT du JSON valide, sans markdown, sans commentaires, sans texte autour.
"""

QUIZ_PROMPT = """\
À partir des informations suivantes sur le topic "{topic_name}", génère un quiz de {num_questions} questions en français.

## Contenu du topic
{index_content}

## Résumé du topic
{summary_content}

## Papers référencés ({paper_count} articles)
{papers_info}

## Consignes

Génère exactement {num_questions} questions avec un mix de types et de difficultés :
- Questions à choix multiples (QCM) : 4 options, 1 seule correcte
- Questions vrai/faux : 2 options ("Vrai", "Faux")
- Environ 70% QCM et 30% vrai/faux
- Mix de difficultés : ~30% facile, ~40% moyen, ~30% difficile

## Format de sortie

Retourne UNIQUEMENT un tableau JSON (pas d'objet englobant, pas de markdown) :
[
  {{
    "id": "q1",
    "question": "Quelle est la principale différence entre...",
    "type": "multiple_choice",
    "difficulty": "facile",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": 0,
    "explanation": "Explication pédagogique de la bonne réponse."
  }},
  {{
    "id": "q2",
    "question": "Le deep learning est un sous-domaine du machine learning.",
    "type": "true_false",
    "difficulty": "facile",
    "options": ["Vrai", "Faux"],
    "correct_answer": 0,
    "explanation": "Explication pédagogique."
  }}
]

IMPORTANT : retourne UNIQUEMENT le tableau JSON, sans aucun texte avant ou après.
"""
