---
generated_by: groq/llama-3.3-70b-versatile
generated_at: 2026-02-22T08:38:33Z
topic: large-language-models
---

### Contexte
Les modèles de langage à grande échelle (LLM) ont considérablement avancé dans le domaine de la recherche sur le langage et la parole. Cependant, ces modèles manquent de benchmarking spécifique par rapport aux modèles de pointe (SOTA) adaptés à des langues et des tâches particulières. C'est particulièrement vrai pour le traitement du langage naturel arabe (NLP) et le traitement de la parole. LAraBench vise à combler cette lacune en évaluant les performances des LLM sur des tâches spécifiques à la langue arabe.

### Approche
Pour aborder ce défi, les auteurs ont utilisé plusieurs modèles LLM, tels que GPT-3.5-turbo, GPT-4, BLOOMZ, Jais-13b-chat, Whisper et USM. Ils ont employé des techniques d'apprentissage zéro et à few-shot pour traiter 33 tâches distinctes sur 61 jeux de données publics. Cela a impliqué 98 configurations expérimentales, couvrant environ 296 000 points de données, 46 heures de parole et 30 phrases pour la synthèse de parole (TTS). Les auteurs ont mesure les performances de ces modèles par rapport aux modèles SOTA pour évaluer les écarts de performance.

### Résultats clés
Les résultats montrent que les modèles SOTA surpassent généralement les LLM dans les cas d'apprentissage zéro, avec quelques exceptions. Cependant, les modèles de calcul plus importants combinés avec des techniques d'apprentissage à few-shot parviennent à réduire les écarts de performance entre les LLM et les modèles SOTA. Ces résultats fournissent des informations précieuses sur l'applicabilité des LLM pour le traitement du langage naturel arabe et les tâches de traitement de la parole.

### Impact
Ce papier est important car il fournit une évaluation comparative des performances des LLM par rapport aux modèles SOTA pour le traitement du langage naturel arabe. Les résultats peuvent aider les chercheurs et les développeurs à mieux comprendre les forces et les faiblesses des LLM dans ce contexte, contribuant ainsi à l'amélioration de ces modèles pour une utilisation plus efficace dans des applications réelles. Les applications potentielles incluent l'amélioration de la traduction automatique, de la reconnaissance de la parole, de la synthèse de la parole et d'autres tâches liées au traitement du langage naturel en arabe.