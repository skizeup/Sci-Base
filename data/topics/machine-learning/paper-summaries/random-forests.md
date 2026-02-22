---
generated_by: ollama/deepseek-r1:1.5b
generated_at: 2026-02-21T12:24:59Z
topic: machine-learning
---

### Contexte
Avant les Random Forests, les arbres de décision étaient populaires mais fragiles : un petit changement dans les données pouvait produire un arbre complètement différent. De plus, un seul arbre avait tendance au **surapprentissage** (il mémorisait les données d'entraînement au lieu de généraliser). Leo Breiman a cherché un moyen de rendre les arbres de décision plus robustes et plus précis, sans sacrifier leur simplicité d'interprétation.

### Approche
L'idée est simple mais puissante : au lieu de construire un seul arbre, on en construit **des centaines** (une "forêt"). Chaque arbre est entraîné sur un sous-échantillon aléatoire des données (technique appelée *bagging*), et à chaque noeud de l'arbre, seul un sous-ensemble aléatoire de variables est considéré. C'est comme demander l'avis à 500 experts qui ont chacun vu une partie différente du problème : individuellement, ils peuvent se tromper, mais leur **vote majoritaire** est presque toujours correct. Cette double injection d'aléatoire (dans les données et dans les variables) rend chaque arbre légèrement différent et réduit les corrélations entre eux.

### Résultats clés
- Les Random Forests surpassent systématiquement un arbre de décision seul en termes de précision.
- L'algorithme est naturellement **résistant au surapprentissage** : ajouter plus d'arbres ne dégrade jamais les performances.
- Il fournit une mesure d'**importance des variables**, permettant de comprendre quels facteurs influencent le plus la prédiction.
- Il gère efficacement les données manquantes et les jeux de données de grande dimension.

### Impact
Ce paper de 2001 a démocratisé l'apprentissage ensembliste. Les Random Forests sont devenus l'un des algorithmes les plus utilisés en pratique, de la **médecine** (diagnostic de maladies) à la **finance** (détection de fraudes) en passant par l'**écologie** (classification d'espèces). Leur simplicité d'utilisation (peu d'hyperparamètres à régler) en fait souvent le premier choix avant d'explorer des méthodes plus complexes. L'idée de combiner des modèles faibles pour obtenir un modèle fort a inspiré toute une famille d'algorithmes ensemblistes, dont XGBoost.
