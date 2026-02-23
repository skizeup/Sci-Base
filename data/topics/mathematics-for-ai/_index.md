# Mathématiques pour l'Intelligence Artificielle

## Description

Les mathématiques sont le langage dans lequel l'intelligence artificielle est écrite. De l'algèbre linéaire qui structure les données, au calcul différentiel qui entraîne les réseaux de neurones, en passant par l'optimisation qui guide l'apprentissage — chaque composant de l'IA repose sur des fondations mathématiques précises.

## Pourquoi c'est important

Comprendre les maths derrière l'IA permet de :
- Intuiter pourquoi un modèle fonctionne (ou pas)
- Choisir les bonnes architectures et hyperparamètres
- Lire les papers de recherche originaux
- Débugger des problèmes d'entraînement (gradients explosifs, convergence)
- Innover au-delà des recettes existantes

## Algèbre linéaire

L'algèbre linéaire est omniprésente en IA : les données sont des vecteurs, les transformations sont des matrices, et les modèles opèrent dans des espaces vectoriels.

- **Vecteurs et matrices** : $\mathbf{x} \in \mathbb{R}^n$, $\mathbf{A} \in \mathbb{R}^{m \times n}$
- **Produit matriciel** : $\mathbf{C} = \mathbf{A}\mathbf{B}$ — opération fondamentale des réseaux de neurones
- **Valeurs et vecteurs propres** : $\mathbf{A}\mathbf{v} = \lambda\mathbf{v}$ — essentiels en PCA et analyse spectrale
- **Décomposition en valeurs singulières (SVD)** : $\mathbf{A} = \mathbf{U}\mathbf{\Sigma}\mathbf{V}^T$ — compression, recommandation
- **Normes** : $\|\mathbf{x}\|_2 = \sqrt{\sum x_i^2}$ — mesure de distance, régularisation

## Calcul différentiel et intégral

Le calcul permet de mesurer comment les sorties changent en fonction des entrées — la base de l'entraînement des modèles.

- **Dérivée** : taux de changement instantané $f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$
- **Gradient** : vecteur des dérivées partielles $\nabla f = \left(\frac{\partial f}{\partial x_1}, \ldots, \frac{\partial f}{\partial x_n}\right)$
- **Règle de la chaîne** : $\frac{\partial L}{\partial w} = \frac{\partial L}{\partial y} \cdot \frac{\partial y}{\partial w}$ — fondation de la backpropagation dans le [Deep Learning](../deep-learning/)
- **Jacobienne et hessienne** : matrices de dérivées pour l'analyse multivarée

## Optimisation

L'entraînement d'un modèle de ML est un problème d'optimisation : minimiser une fonction de coût.

- **Descente de gradient** : $\theta_{t+1} = \theta_t - \alpha \nabla_\theta J(\theta_t)$ où $\alpha$ est le learning rate
- **SGD (Stochastic Gradient Descent)** : mini-batchs pour des mises à jour plus fréquentes
- **Adam** : combinaison de momentum et de taux adaptatifs, $m_t = \beta_1 m_{t-1} + (1 - \beta_1) g_t$
- **Convexité** : une fonction convexe a un unique minimum global — garantie de convergence
- **Problèmes non convexes** : les réseaux de neurones profonds ont des paysages de perte complexes avec saddle points et minima locaux

## Théorie de l'information

Branche des mathématiques qui quantifie l'information, largement utilisée en ML.

- **Entropie** : $H(X) = -\sum_{x} P(x) \log P(x)$ — mesure l'incertitude
- **Entropie croisée** : $H(p, q) = -\sum_{x} p(x) \log q(x)$ — fonction de coût standard en classification
- **Divergence KL** : $D_{KL}(p \| q) = \sum_{x} p(x) \log \frac{p(x)}{q(x)}$ — mesure la différence entre distributions, utilisée dans les VAE et autres [modèles génératifs](../generative-models/)
- **Information mutuelle** : quantifie la dépendance entre variables

## Théorie des probabilités

Voir le topic [Statistiques](../statistics/) pour un traitement approfondi. En bref :
- Distributions de probabilité (continue, discrète)
- Variables aléatoires et espérance
- Théorème de Bayes et inférence

## Applications transversales

Les mathématiques connectent tous les domaines de l'IA :
- **Algèbre linéaire + optimisation** = entraînement des réseaux ([Deep Learning](../deep-learning/))
- **Probabilités + théorie de l'information** = modèles génératifs, NLP
- **Géométrie différentielle** = [Graph Neural Networks](../graph-neural-networks/)
- **Algèbre tensorielle** = calcul GPU, architectures Transformer

## Prérequis recommandés

- Mathématiques de lycée (fonctions, suites, trigonométrie)
- Curiosité et patience — les concepts se construisent progressivement
