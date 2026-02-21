# Computer Vision

## Description

La vision par ordinateur (computer vision) est le domaine de l'IA qui permet aux machines d'**interpréter et comprendre le contenu visuel** : images, vidéos, flux de caméras. L'objectif est d'extraire de l'information sémantique à partir de pixels.

## Pourquoi c'est important

La vision par ordinateur est partout : reconnaissance faciale (déverrouillage du téléphone), voitures autonomes, imagerie médicale (détection de tumeurs), contrôle qualité industriel, réalité augmentée, et la génération d'images par IA (DALL-E, Midjourney).

## Concepts fondamentaux

### La convolution
Opération mathématique qui applique un filtre (kernel) sur une image pour extraire des features locales (contours, textures, motifs). C'est la brique de base des CNN :

$$(f * g)(x, y) = \sum_{i}\sum_{j} f(i, j) \cdot g(x-i, y-j)$$

### Architectures CNN classiques
- **LeNet** (1998) : le pionnier, pour la reconnaissance de chiffres
- **AlexNet** (2012) : le déclencheur de la révolution deep learning (ImageNet)
- **VGG** (2014) : montre que la profondeur compte (16-19 couches)
- **ResNet** (2015) : connexions résiduelles pour entraîner des réseaux très profonds ($100+$ couches)
- **EfficientNet** (2019) : scaling optimal (profondeur, largeur, résolution)

### Vision Transformers (ViT)
Depuis 2020, les Transformers (initialement conçus pour le NLP) rivalisent avec les CNN en vision. L'image est découpée en patches traités comme des tokens.

### Tâches principales
- **Classification** : identifier ce que contient une image (chat, chien, voiture...)
- **Détection d'objets** : localiser et identifier les objets (YOLO, Faster R-CNN)
- **Segmentation sémantique** : classifier chaque pixel de l'image
- **Segmentation d'instance** : séparer chaque objet individuel (Mask R-CNN)
- **Estimation de pose** : détecter la position du corps humain
- **Génération d'images** : créer des images réalistes (GANs, Diffusion Models)

## Prérequis recommandés

- [Machine Learning](../machine-learning/) — les bases
- [Deep Learning](../deep-learning/) — réseaux de neurones
- Algèbre linéaire (convolutions, transformations)
- Python + PyTorch + torchvision ou OpenCV

## Applications

- Voitures autonomes (Tesla, Waymo)
- Imagerie médicale (radiologie, pathologie)
- Reconnaissance faciale
- Réalité augmentée (AR)
- Agriculture de précision (drones)
- Contrôle qualité industriel
- Génération d'images (Stable Diffusion, DALL-E, Midjourney)
