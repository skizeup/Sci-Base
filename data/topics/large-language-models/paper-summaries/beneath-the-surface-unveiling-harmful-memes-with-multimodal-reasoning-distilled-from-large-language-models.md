---
generated_by: groq/llama-3.3-70b-versatile
generated_at: 2026-02-22T08:37:33Z
topic: large-language-models
---

### Contexte
Les médias sociaux regorgent de memes, qui sont souvent utilisés pour transmettre des idées ou des messages, mais qui peuvent également véhiculer des contenus nocifs ou préjudiciables. Le problème est que ces memes peuvent avoir une signification implicite qui n'est pas explicitement exprimée dans le texte ou l'image, ce qui rend leur détection difficile. Les approches actuelles de détection de memes nocifs se concentrent principalement sur les signaux superficiels sans prendre en compte la compréhension en profondeur du texte et de l'image.

### Approche
Les auteurs proposent une approche innovante pour détecter les memes nocifs en utilisant une raison multimodale qui prend en compte l'interaction entre les informations textuelles et visuelles. Ils s'inspirent du succès des grands modèles de langage (LLM) pour effectuer une raison abductive, puis proposent un cadre génératif pour apprendre des connaissances de raisonnement multimodal à partir des LLM. Ce cadre comporte deux étapes de formation : 
1. La distillation des connaissances de raisonnement multimodal à partir des LLM ;
2. L'ajustement fin du cadre génératif pour inférer la nocivité des memes.

### Résultats clés
Les expériences menées sur trois ensembles de données de memes montrent que l'approche proposée atteint des performances supérieures à celles des méthodes actuelles de détection de memes nocifs. Cette approche permet une meilleure compréhension des memes en analysant de manière plus approfondie le texte et l'image.

### Impact
Ce papier est important car il propose une solution innovante pour détecter les memes nocifs, qui peut avoir des applications potentielles pour les plateformes de médias sociaux, les outils de modération de contenu et les systèmes de détection de la désinformation. L'utilisation de la raison multimodale et des grands modèles de langage pour analyser les memes pourrait aider à créer des outils plus efficaces pour protéger les utilisateurs contre les contenus nocifs en ligne.