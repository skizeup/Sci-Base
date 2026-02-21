# Transfer Learning

## Description

Le transfer learning (apprentissage par transfert) est une technique qui consiste à réutiliser un modèle pré-entraîné sur une tâche source (souvent à grande échelle) pour l'adapter à une tâche cible différente, généralement avec moins de données. Au lieu de partir de zéro, on exploite les représentations apprises pour accélérer l'entraînement et améliorer les performances.

Cette approche est devenue le paradigme dominant en deep learning : plutôt que d'entraîner un modèle from scratch, on part presque toujours d'un modèle pré-entraîné (BERT, ResNet, GPT, etc.) que l'on fine-tune.

## Pourquoi c'est important

Le transfer learning résout un problème fondamental : la plupart des tâches réelles disposent de peu de données annotées, tandis que l'entraînement from scratch nécessite d'énormes datasets. Il permet d'obtenir d'excellentes performances même avec quelques centaines d'exemples, démocratisant l'accès au deep learning pour les petites équipes et les domaines de niche (médecine, droit, langues rares).

## Concepts clés

### Feature extraction
On gèle les couches du modèle pré-entraîné et on n'entraîne qu'un nouveau classifieur au-dessus :

$$\hat{y} = \text{softmax}(W \cdot f_\theta(x) + b)$$

où $f_\theta$ est le backbone gelé et seuls $W$, $b$ sont appris.

### Fine-tuning
On déverrouille tout ou partie des couches du modèle pré-entraîné et on les ré-entraîne avec un learning rate réduit. Le fine-tuning discriminatif applique des learning rates différents par couche.

### Domain adaptation
Quand la distribution source diffère de la distribution cible, des techniques de domain adaptation (adversarial training, MMD) permettent d'aligner les représentations.

### Few-shot et zero-shot learning
- **Few-shot** : adapter un modèle avec très peu d'exemples (1 à 10 par classe)
- **Zero-shot** : utiliser un modèle sur des classes jamais vues pendant l'entraînement, grâce à des descriptions textuelles ou des embeddings sémantiques

## Prérequis recommandés

- [Deep Learning](../deep-learning/) — architectures de réseaux, entraînement
- [Machine Learning](../machine-learning/) — overfitting, régularisation, validation
- Compréhension des embeddings et représentations latentes

## Applications

- Classification d'images médicales avec peu de données
- Adaptation de LLMs à des domaines spécialisés
- NLP sur langues à faibles ressources
- Détection d'objets dans des environnements spécifiques
- Personnalisation de modèles de recommandation
