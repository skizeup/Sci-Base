# Graph Neural Networks

## Description

Les Graph Neural Networks (GNNs) sont une famille de réseaux de neurones conçus pour opérer directement sur des données structurées en graphes. Contrairement aux images (grilles) ou au texte (séquences), les graphes ont une topologie irrégulière : réseaux sociaux, molécules, graphes de connaissances, etc. Les GNNs apprennent des représentations de nœuds, d'arêtes ou du graphe entier en agrégeant itérativement l'information du voisinage.

## Pourquoi c'est important

De nombreuses données du monde réel sont naturellement structurées en graphes : réseaux sociaux, interactions protéine-protéine, systèmes de recommandation, graphes de connaissances, circuits électroniques. Les GNNs permettent d'exploiter cette structure relationnelle là où les modèles classiques ignoreraient la topologie.

## Concepts clés

### Message passing
Le paradigme fondamental des GNNs : chaque nœud met à jour sa représentation en agrégeant les messages de ses voisins :

$$h_v^{(l+1)} = \text{UPDATE}\left(h_v^{(l)}, \text{AGGREGATE}\left(\{h_u^{(l)} : u \in \mathcal{N}(v)\}\right)\right)$$

### Graph Convolutional Networks (GCN)
Les GCN généralisent la convolution aux graphes via une propagation spectrale simplifiée :

$$H^{(l+1)} = \sigma\left(\tilde{D}^{-\frac{1}{2}} \tilde{A} \tilde{D}^{-\frac{1}{2}} H^{(l)} W^{(l)}\right)$$

où $\tilde{A} = A + I$ est la matrice d'adjacence augmentée et $\tilde{D}$ la matrice de degré correspondante.

### Graph Attention Networks (GAT)
Les GAT utilisent un mécanisme d'attention pour pondérer différemment les contributions de chaque voisin, permettant au modèle d'apprendre quelles connexions sont les plus importantes.

### Pooling et readout
Pour obtenir une représentation du graphe entier (graph-level), on agrège les représentations de tous les nœuds via des opérations de pooling (somme, moyenne, ou pooling hiérarchique).

## Prérequis recommandés

- [Deep Learning](../deep-learning/) — réseaux de neurones, backpropagation
- Théorie des graphes (nœuds, arêtes, adjacence, degrés)
- Algèbre linéaire (matrices creuses, décomposition spectrale)

## Applications

- Prédiction de propriétés moléculaires et drug discovery
- Systèmes de recommandation (graphe utilisateur-item)
- Classification de nœuds dans les réseaux sociaux
- Graphes de connaissances et raisonnement relationnel
- Prédiction de trafic et optimisation de réseaux
