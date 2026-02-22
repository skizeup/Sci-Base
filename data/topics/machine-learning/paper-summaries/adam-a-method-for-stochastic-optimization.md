---
generated_by: ollama/deepseek-r1:1.5b
generated_at: 2026-02-21T12:25:36Z
topic: machine-learning
---

### Contexte
Entraîner un modèle de machine learning, c'est chercher les meilleurs paramètres en ajustant progressivement les poids du réseau. Pour cela, on utilise un **optimiseur** qui décide comment modifier chaque poids à chaque étape. Les optimiseurs classiques comme SGD (descente de gradient stochastique) utilisent le même taux d'apprentissage pour tous les paramètres, ce qui n'est pas toujours idéal. Certains paramètres auraient besoin de grands pas, d'autres de petits ajustements. Kingma et Ba (2014) proposent Adam pour résoudre ce problème.

### Approche
Adam combine deux idées existantes : **AdaGrad** (qui adapte le learning rate à chaque paramètre) et **RMSProp** (qui utilise une moyenne mobile pour lisser les gradients). Concrètement, Adam maintient deux estimations pour chaque paramètre : la **moyenne des gradients** (premier moment, la direction) et la **moyenne des gradients au carré** (second moment, la vitesse). Imaginez un randonneur dans le brouillard : le premier moment lui donne la direction générale de la pente, le second moment lui indique si le terrain est régulier ou accidenté, pour adapter la taille de ses pas. Une correction de biais est aussi appliquée pour compenser le démarrage à froid.

### Résultats clés
- Adam est **peu sensible au choix des hyperparamètres** : les valeurs par défaut ($\alpha = 0.001$, $\beta_1 = 0.9$, $\beta_2 = 0.999$) fonctionnent bien dans la plupart des cas.
- Il est **efficace en mémoire** : ne stocke que deux vecteurs supplémentaires par paramètre.
- Il converge rapidement sur des problèmes variés : vision, NLP, modèles génératifs.
- Il gère bien les **gradients bruités** et les données éparses (sparse).

### Impact
Adam est devenu l'optimiseur par défaut dans la majorité des projets de deep learning. Quand on débute en machine learning, c'est presque toujours l'optimiseur qu'on utilise en premier. Sa simplicité d'utilisation (peu d'hyperparamètres à régler) et sa robustesse en font un outil incontournable. Il a engendré toute une famille de variantes (AdamW, RAdam, etc.) qui continuent d'améliorer l'entraînement des modèles modernes.
