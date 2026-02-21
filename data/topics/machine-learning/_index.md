# Machine Learning

## Description

Le machine learning (apprentissage automatique) est une branche de l'intelligence artificielle qui permet aux systèmes d'apprendre à partir de données sans être explicitement programmés. Plutôt que de coder des règles à la main, on fournit des exemples au système et il en déduit les patterns sous-jacents.

## Pourquoi c'est important

Le ML est au coeur de la plupart des avancées technologiques récentes : moteurs de recherche, recommandations (Netflix, Spotify), traduction automatique, voitures autonomes, diagnostic médical, détection de fraude. C'est le socle sur lequel reposent le deep learning, le NLP et la computer vision.

## Les grands paradigmes

### Apprentissage supervisé
On fournit des paires (entrée, sortie attendue) et le modèle apprend la relation entre les deux.
- **Classification** : prédire une catégorie (spam ou pas spam, type de tumeur)
- **Régression** : prédire une valeur continue (prix d'un logement, température)
- Algorithmes classiques : régression linéaire/logistique, SVM, arbres de décision, forêts aléatoires

### Apprentissage non supervisé
On fournit des données sans étiquettes et le modèle cherche des structures cachées.
- **Clustering** : regrouper des données similaires ($k$-means, DBSCAN)
- **Réduction de dimensionnalité** : projeter en moins de dimensions (PCA, t-SNE)
- **Détection d'anomalies** : identifier les observations inhabituelles

### Apprentissage par renforcement
Un agent apprend en interagissant avec un environnement et en recevant des récompenses. Voir le topic [Reinforcement Learning](../reinforcement-learning/).

## Concepts mathématiques fondamentaux

- **Fonction de coût** : mesure l'erreur du modèle, par ex. l'erreur quadratique moyenne $\text{MSE} = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2$
- **Descente de gradient** : algorithme d'optimisation itératif $\theta \leftarrow \theta - \alpha \nabla J(\theta)$
- **Biais vs variance** : compromis entre un modèle trop simple (sous-apprentissage) et trop complexe (surapprentissage)
- **Validation croisée** : technique pour estimer la performance de généralisation

## Prérequis recommandés

- Algèbre linéaire (vecteurs, matrices, produit scalaire)
- Probabilités et statistiques (distributions, Bayes, espérance)
- Calcul différentiel (dérivées, gradient)
- Programmation Python (NumPy, pandas)

## Sous-domaines couverts dans SciBase

- [Deep Learning](../deep-learning/) — réseaux de neurones profonds
- [Natural Language Processing](../natural-language-processing/) — traitement du langage
- [Computer Vision](../computer-vision/) — vision par ordinateur
- [Reinforcement Learning](../reinforcement-learning/) — apprentissage par renforcement
