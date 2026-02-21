# Natural Language Processing (NLP)

## Description

Le traitement automatique du langage naturel (NLP) est le domaine de l'IA qui permet aux machines de **comprendre, interpréter et générer du langage humain**. C'est le champ qui a produit les chatbots, la traduction automatique, les moteurs de recherche modernes et les LLMs.

## Pourquoi c'est important

Le langage est le principal moyen de communication humain. Le NLP permet d'automatiser l'analyse de textes à grande échelle : modération de contenu, analyse de sentiment, extraction d'information, résumé automatique, et surtout les assistants conversationnels (ChatGPT, Claude) qui ont démocratisé l'IA.

## Concepts fondamentaux

### Représentation du texte
Le texte brut doit être converti en nombres pour être traité par un modèle :
- **Tokenisation** : découper le texte en unités (mots, sous-mots, caractères)
- **Bag of Words / TF-IDF** : représentations classiques basées sur la fréquence
- **Word Embeddings** : vecteurs denses qui capturent le sens (Word2Vec, GloVe)
- **Embeddings contextuels** : représentations qui dépendent du contexte (BERT, GPT)

### Le mécanisme d'attention
Permet au modèle de "regarder" différentes parties de la séquence d'entrée avec des poids différents. L'attention est au coeur des Transformers :

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

### Architectures clés
- **RNN / LSTM** : traitent les séquences mot par mot (historique)
- **Transformers** : traitent toute la séquence en parallèle (état de l'art)
  - **Encoder-only** : BERT — comprendre le texte (classification, NER)
  - **Decoder-only** : GPT — générer du texte
  - **Encoder-Decoder** : T5, BART — transformer du texte (traduction, résumé)

### Tâches classiques du NLP
- **Classification de texte** : sentiment, spam, catégorisation
- **NER** (Named Entity Recognition) : identifier les entités (personnes, lieux, organisations)
- **Question Answering** : répondre à des questions à partir d'un contexte
- **Traduction automatique** : d'une langue à une autre
- **Résumé automatique** : condensé d'un texte long
- **Génération de texte** : produire du texte cohérent

## Prérequis recommandés

- [Machine Learning](../machine-learning/) — les bases
- [Deep Learning](../deep-learning/) — réseaux de neurones
- Probabilités (modèles de langue, Bayes)
- Python + Hugging Face Transformers

## Applications

- Assistants conversationnels (ChatGPT, Claude, Gemini)
- Traduction (Google Translate, DeepL)
- Moteurs de recherche
- Analyse de sentiment (réseaux sociaux, avis clients)
- Génération de code (GitHub Copilot)
- Modération de contenu
