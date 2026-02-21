# Deep Learning

## Description

Le deep learning (apprentissage profond) est un sous-domaine du machine learning basé sur les **réseaux de neurones artificiels** à plusieurs couches. L'idée : empiler des couches de neurones qui transforment progressivement les données brutes en représentations de plus en plus abstraites, permettant au modèle d'apprendre automatiquement les features pertinentes.

## Pourquoi c'est important

Le deep learning a révolutionné l'IA depuis 2012. Il domine aujourd'hui la vision par ordinateur, le traitement du langage naturel, la génération d'images, la synthèse vocale et bien d'autres domaines. Les LLMs (GPT, Claude, Llama) sont des modèles de deep learning.

## Concepts fondamentaux

### Le neurone artificiel
Inspiré (très librement) du neurone biologique : il reçoit des entrées $x_1, ..., x_n$, les pondère, applique une fonction d'activation, et produit une sortie :

$$y = f\left(\sum_{i=1}^{n} w_i x_i + b\right)$$

### Fonctions d'activation
- **ReLU** : $f(x) = \max(0, x)$ — la plus utilisée, simple et efficace
- **Sigmoid** : $f(x) = \frac{1}{1+e^{-x}}$ — historique, utilisée en sortie pour la classification binaire
- **Softmax** : transforme un vecteur en distribution de probabilités

### Rétropropagation (Backpropagation)
Algorithme qui calcule le gradient de la fonction de coût par rapport à chaque poids du réseau, en propageant l'erreur de la sortie vers l'entrée via la règle de la chaîne.

### Architectures principales
- **MLP** (Perceptron multicouche) : couches fully connected empilées
- **CNN** (Réseaux convolutifs) : spécialisés pour les images, voir [Computer Vision](../computer-vision/)
- **RNN / LSTM** : pour les séquences (historique, remplacés par les Transformers)
- **Transformers** : architecture dominante actuelle, basée sur le mécanisme d'attention

### Techniques d'entraînement
- **Batch normalization** : normalise les activations entre couches
- **Dropout** : désactive aléatoirement des neurones pendant l'entraînement (régularisation)
- **Transfer learning** : réutiliser un modèle pré-entraîné sur une nouvelle tâche
- **Data augmentation** : augmenter artificiellement le jeu de données

## Prérequis recommandés

- [Machine Learning](../machine-learning/) — les bases
- Algèbre linéaire (multiplication matricielle, valeurs propres)
- Calcul différentiel (règle de la chaîne, gradient)
- Python + PyTorch ou TensorFlow

## Applications

- Vision par ordinateur (classification, détection, segmentation)
- NLP (traduction, résumé, question-réponse, chatbots)
- Génération d'images (DALL-E, Stable Diffusion, Midjourney)
- Synthèse et reconnaissance vocale
- Découverte de médicaments (AlphaFold)
- Jeux et simulation
