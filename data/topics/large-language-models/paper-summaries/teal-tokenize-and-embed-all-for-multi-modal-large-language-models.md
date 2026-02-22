---
generated_by: groq/llama-3.3-70b-versatile
generated_at: 2026-02-22T08:38:11Z
topic: large-language-models
---

### Contexte
Les modèles de langage multi-modaux (MM-LLM) ont fait des progrès significatifs récemment, mais ils peinent encore à modéliser efficacement les interactions entre les entrées multi-modales et la génération dans des modalités non textuelles. Les chercheurs abordent ce problème en proposant une nouvelle approche pour traiter les entrées de différentes modalités de manière unifiée.

### Approche
L'approche proposée, appelée TEAL (Tokenize and Embed ALL), consiste à traiter les entrées de toutes les modalités comme des séquences de jetons (ou tokens) et à apprendre un espace d'intégration commun pour toutes les modalités. Plus précisément, TEAL discrétise les entrées dans chaque modalité en une séquence de jetons à l'aide d'un tokenizer standard, puis les intègre dans un espace d'intégration commun à l'aide d'une matrice d'intégration apprenable. Les MM-LLM n'ont ensuite qu'à prédire les jetons multi-modaux de manière autonome, similaires aux modèles de langage classiques pour le texte. Enfin, un dé-tokenizer correspondant est appliqué pour générer la sortie dans chaque modalité en fonction de la séquence de jetons prédite.

### Résultats clés
Les expériences montrent que TEAL réalise des améliorations significatives dans la compréhension multi-modale et met en œuvre un schéma simple pour la génération multi-modale. L'utilisation d'un espace d'intégration commun permet aux modèles de langage existants (même gelés) de réaliser à la fois des tâches de compréhension et de génération impliquant des modalités non textuelles, comme les images et les audio, sans compromettre leurs performances dans le texte.

### Impact
Ce paper est important car il propose une solution pour améliorer la capacité des modèles de langage à traiter et à générer des contenus multi-modaux de manière plus efficace et plus générale. Les applications potentielles de cette technologie incluent l'amélioration des systèmes de dialogue, la génération de contenu créatif multi-modal (comme des vidéos ou des présentations), et le développement d'outils d'aide à la décision basés sur des données multi-modales. En simplifiant l'intégration de différentes modalités, TEAL ouvre des perspectives pour des applications innovantes qui combinent le texte, les images, les sons, et d'autres types de données de manière harmonieuse.