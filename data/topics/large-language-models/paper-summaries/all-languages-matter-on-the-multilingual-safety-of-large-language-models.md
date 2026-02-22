---
generated_by: groq/llama-3.3-70b-versatile
generated_at: 2026-02-22T08:37:45Z
topic: large-language-models
---

### Contexte
Le développement et le déploiement de grands modèles de langage (LLM) nécessitent une attention particulière à la sécurité. Jusqu'à présent, les évaluations de la sécurité de ces modèles ne portaient que sur une langue à la fois, généralement la langue majoritaire dans les données d'entraînement, comme l'anglais. Cependant, avec la mise en œuvre mondiale de ces modèles, il est essentiel de considérer leur sécurité dans plusieurs langues. Cette recherche vise à combler cette lacune en créant un benchmark multilingue pour évaluer la sécurité des LLM.

### Approche
Les auteurs ont créé un benchmark appelé XSafety, qui couvre 14 types de problèmes de sécurité courants dans 10 langues différentes appartenant à plusieurs familles de langues. Ils ont utilisé XSafety pour évaluer la sécurité multilingue de 4 LLM largement utilisés, tant pour les modèles avec API fermée que pour les modèles open source. Pour améliorer la sécurité multilingue, ils ont également proposé des méthodes d'incitation (prompting) simples et efficaces pour évoquer les connaissances de sécurité et améliorer la généralisation cross-linguistique de l'alignement de sécurité.

### Résultats clés
Les résultats expérimentaux montrent que tous les LLM produisent significativement plus de réponses non sûres pour les requêtes non anglaises que pour les requêtes anglaises. Cela souligne la nécessité de développer un alignement de sécurité pour les langues non anglaises. De plus, la méthode de prompting proposée a réduit de manière significative le taux de réponses non sûres pour les requêtes non anglaises, passant de 19,1% à 9,7%.

### Impact
Ce papier est important car il met en évidence la nécessité d'une approche multilingue pour la sécurité des LLM. Les résultats soulignent les risques potentiels associés à l'utilisation de ces modèles dans différentes langues et cultures. Les applications potentielles de cette recherche incluent l'amélioration de la sécurité des LLM pour les utilisateurs non anglophones, ce qui pourrait avoir un impact significatif sur la confiance et l'adoption de ces technologies à l'échelle mondiale. La méthode de prompting proposée offre également une solution pratique pour améliorer la sécurité multilingue des LLM, ce qui pourrait être bénéfique pour une variété d'applications, allant des chatbots aux assistants virtuels.