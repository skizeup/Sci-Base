---
generated_by: groq/llama-3.3-70b-versatile
generated_at: 2026-02-22T08:39:39Z
topic: vision-language-models
---

### Contexte
Les modèles de vision et de langage (LVLMs) évoluent rapidement, ce qui leur permet de traiter des informations à la fois visuelles et textuelles de manière plus humaine. Cependant, il est essentiel d'évaluer soigneusement leurs applications dans différents domaines, car ils peuvent comporter des biais indésirables. Cette recherche se concentre sur les biais comportementaux de ces modèles, en particulier dans le contexte de la finance comportementale, qui étudie l'intersection de la finance et de la psychologie.

### Approche
Les auteurs proposent un cadre intégré pour évaluer les capacités de raisonnement et les comportements dynamiques des LVLMs, en les testant sur deux biais comportementaux bien établis en finance : le biais de récence (préférence pour les informations récentes) et le biais d'autorité (tendance à suivre les informations provenant de sources autorisées). Ils ont développé une méthode pour collecter des données et des métriques d'évaluation nouvelles afin de tester ces biais chez différents modèles, dont des modèles open-source tels que LLaVA-NeXT, MobileVLM-V2, Mini-Gemini, MiniCPM-Llama3-V 2.5 et Phi-3-vision-128k, ainsi que le modèle propriétaire GPT-4o.

### Résultats clés
Les résultats montrent que les modèles open-source testés souffrent significativement des biais de récence et d'autorité, alors que le modèle propriétaire GPT-4o est beaucoup moins affecté. Ces observations mettent en lumière les directions dans lesquelles les modèles open-source pourraient être améliorés.

### Impact
Cette recherche est importante car elle souligne la nécessité d'évaluer soigneusement les biais comportementaux des modèles de vision et de langage avant de les déployer dans des applications réelles, en particulier dans des domaines sensibles comme la finance. Les résultats de cette étude pourraient contribuer à améliorer la robustesse et la fiabilité des LVLMs, et avoir des implications pour le développement de modèles plus éthiques et plus responsables dans l'avenir. Les applications potentielles incluent une meilleure prise de décision dans la finance, un usage plus éclairé des informations visuelles et textuelles, et une réduction des risques associés aux biais indésirables dans les systèmes d'intelligence artificielle.