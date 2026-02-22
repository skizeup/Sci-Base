---
generated_by: groq/llama-3.3-70b-versatile
generated_at: 2026-02-21T13:15:07Z
topic: generative-models
---

### Contexte
Les modèles de génération d'images à partir de texte (Text-to-Image, T2I) ont connu un succès croissant dans le domaine public. Cependant, leur nature opaque expose les utilisateurs à des sorties biaisées, intentionnelles ou intrinsèques. Les techniques de manipulation et d'atténuation des biais nécessitent généralement un ajustement soigneux des paramètres d'apprentissage et des données de formation, ce qui peut être computalement coûteux. Cette recherche vise à résoudre ce problème en proposant une méthode pour manipuler et atténuer les biais de ces modèles sans nécessiter une ré-formation.

### Approche
Les auteurs proposent une méthode pour manipuler dynamiquement les biais des modèles T2I en exploitant leurs riches espaces d'embeddings de langage sans nécessiter de ré-formation du modèle. Ils utilisent des principes fondamentaux d'algèbre vectorielle pour contrôler les embeddings de langage et ajuster les sorties des modèles T2I. Cette approche permet un contrôle précis sur la distribution des classes générées et peut même être utilisée pour créer des images qui sont généralement impossibles à obtenir avec des prompts textuels réguliers.

### Résultats clés
Les résultats principaux de cette recherche sont :
* Une méthode pour manipuler les biais des modèles T2I sans ré-formation
* Un contrôle précis sur la distribution des classes générées
* La capacité de créer des images impossibles à obtenir avec des prompts textuels réguliers
* Une application constructive pour équilibrer la fréquence des classes sociales dans les images générées
* Une démonstration de l'utilisation de cette méthode comme une attaque de backdoor avec un taux de réussite pouvant aller jusqu'à 100%

### Impact
Ce paper est important car il propose une méthode pour contrôler et atténuer les biais dans les modèles T2I sans nécessiter de ré-formation, ce qui peut être utile pour de nombreuses applications, telles que :
* La création d'images plus diversifiées et représentatives
* L'atténuation des biais dans les images générées
* La protection contre les attaques de backdoor
* L'amélioration de la sécurité et de la fiabilité des modèles T2I
Cette recherche a des implications importantes pour les domaines de la vision par ordinateur, de l'intelligence artificielle et de la sécurité informatique.