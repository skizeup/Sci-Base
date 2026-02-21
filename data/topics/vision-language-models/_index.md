# Vision-Language Models

## Description

Les Vision-Language Models (VLMs) sont des modèles multimodaux capables de comprendre et de raisonner conjointement sur des images et du texte. Ils combinent un encodeur visuel (souvent un Vision Transformer) avec un modèle de langage pour réaliser des tâches à l'intersection de la vision et du langage : description d'images, réponse à des questions visuelles, recherche d'images par texte, etc.

Les architectures phares incluent CLIP, BLIP, LLaVA, Flamingo et GPT-4V, qui ont montré des capacités remarquables de compréhension multimodale.

## Pourquoi c'est important

Le monde réel est intrinsèquement multimodal : nous comprenons en combinant ce que nous voyons et ce que nous lisons. Les VLMs ouvrent la voie à des systèmes IA capables d'interagir avec le monde visuel via le langage naturel, avec des applications en accessibilité, robotique, analyse de documents, e-commerce et bien plus.

## Concepts clés

### Contrastive Learning (CLIP)
CLIP aligne des embeddings visuels et textuels dans un espace commun via un objectif contrastif :

$$\mathcal{L} = -\frac{1}{N}\sum_{i=1}^{N}\left[\log \frac{\exp(\text{sim}(v_i, t_i)/\tau)}{\sum_{j=1}^{N}\exp(\text{sim}(v_i, t_j)/\tau)}\right]$$

où $v_i$ et $t_i$ sont les embeddings image et texte, $\text{sim}$ est la similarité cosinus et $\tau$ est un paramètre de température.

### Visual instruction tuning
Les modèles comme LLaVA connectent un encodeur visuel à un LLM via un projecteur, puis fine-tunent l'ensemble sur des paires instruction-réponse multimodales.

### Cross-attention multimodale
Certains modèles (Flamingo, Qwen-VL) utilisent des couches de cross-attention pour permettre au modèle de langage de "regarder" les features visuelles à chaque couche.

### Zero-shot transfer
Grâce à l'alignement vision-langage, les VLMs peuvent classifier des images dans des catégories jamais vues pendant l'entraînement, simplement à partir de descriptions textuelles.

## Prérequis recommandés

- [Deep Learning](../deep-learning/) — réseaux de neurones profonds, Transformers
- [Computer Vision](../computer-vision/) — fondamentaux de la vision par ordinateur
- [Natural Language Processing](../natural-language-processing/) — traitement du langage, embeddings
- Compréhension des Transformers et du mécanisme d'attention

## Applications

- Description automatique d'images (image captioning)
- Réponse visuelle à des questions (VQA)
- Recherche d'images par requête textuelle
- Analyse et compréhension de documents
- Navigation robotique guidée par le langage
- Accessibilité pour les personnes malvoyantes
