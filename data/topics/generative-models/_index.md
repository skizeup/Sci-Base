# Generative Models

## Description

Les modèles génératifs sont une famille de modèles de deep learning dont l'objectif est d'apprendre la distribution sous-jacente des données pour en générer de nouvelles. Contrairement aux modèles discriminatifs qui apprennent la frontière de décision $p(y|x)$, les modèles génératifs apprennent $p(x)$ ou $p(x|z)$ — la distribution des données elle-même.

Les principales architectures incluent les GANs (Generative Adversarial Networks), les VAEs (Variational Autoencoders), les modèles de diffusion et les modèles autorégressifs.

## Pourquoi c'est important

Les modèles génératifs sont à l'origine des avancées spectaculaires en génération d'images (DALL-E, Stable Diffusion, Midjourney), de vidéo (Sora), de musique et de molécules. Ils permettent aussi l'augmentation de données, le transfert de style, la super-résolution et la conception de médicaments.

## Concepts clés

### Generative Adversarial Networks (GANs)
Deux réseaux s'entraînent en compétition : un générateur $G$ et un discriminateur $D$ :

$$\min_G \max_D \; \mathbb{E}_{x \sim p_\text{data}}[\log D(x)] + \mathbb{E}_{z \sim p_z}[\log(1 - D(G(z)))]$$

### Variational Autoencoders (VAEs)
Les VAEs optimisent une borne inférieure de la vraisemblance (ELBO) :

$$\mathcal{L} = \mathbb{E}_{q(z|x)}[\log p(x|z)] - D_\text{KL}(q(z|x) \| p(z))$$

### Modèles de diffusion
Les modèles de diffusion apprennent à inverser un processus de bruitage gaussien progressif. Le processus forward ajoute du bruit :

$$q(x_t | x_{t-1}) = \mathcal{N}(x_t; \sqrt{1-\beta_t}\, x_{t-1}, \beta_t I)$$

Le réseau apprend à prédire le bruit ajouté pour reconstruire l'image pas à pas.

### Flow-based models
Les modèles à flux utilisent des transformations inversibles pour calculer exactement la vraisemblance via la formule du changement de variables.

## Prérequis recommandés

- [Deep Learning](../deep-learning/) — réseaux de neurones, backpropagation
- Probabilités (distributions, KL-divergence, maximum de vraisemblance)
- Algèbre linéaire (espaces latents, jacobiens)

## Applications

- Génération d'images, vidéo et audio
- Augmentation de données pour l'entraînement de modèles
- Conception de molécules et drug discovery
- Transfert de style et édition d'images
- Super-résolution et inpainting
