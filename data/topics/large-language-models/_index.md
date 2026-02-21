# Large Language Models

## Description

Les Large Language Models (LLMs) sont des modèles de deep learning massivement paramétrés, entraînés sur d'immenses corpus textuels pour comprendre et générer du langage naturel. Basés sur l'architecture Transformer, ces modèles (GPT, LLaMA, Claude, Gemini) ont révolutionné le traitement du langage en démontrant des capacités émergentes : raisonnement, suivi d'instructions, génération de code et bien plus.

L'entraînement d'un LLM se fait généralement en deux phases : le pré-entraînement auto-supervisé sur de grands corpus, suivi d'un fine-tuning aligné avec les préférences humaines (RLHF, DPO).

## Pourquoi c'est important

Les LLMs sont au cœur de la révolution actuelle de l'IA. Ils alimentent les assistants conversationnels, les outils de génération de code, la recherche scientifique automatisée, et transforment des secteurs entiers (éducation, santé, droit, ingénierie). Comprendre leur fonctionnement est devenu essentiel pour tout praticien de l'IA.

## Concepts clés

### Architecture Transformer
Le Transformer repose sur le mécanisme d'auto-attention (*self-attention*) :

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

Les LLMs utilisent typiquement un Transformer décodeur uniquement (*decoder-only*), où chaque token ne peut attendre que les tokens précédents (attention causale).

### Scaling laws
Les lois d'échelle montrent que la performance des LLMs suit des lois de puissance prévisibles en fonction du nombre de paramètres $N$, de la taille du dataset $D$ et du budget de calcul $C$ :

$$L(N) \propto N^{-\alpha}$$

### Alignement et RLHF
Le Reinforcement Learning from Human Feedback (RLHF) permet d'aligner le modèle avec les intentions humaines en entraînant un modèle de récompense sur des préférences annotées, puis en optimisant le LLM via PPO ou DPO.

### Techniques d'efficacité
- **LoRA** : adaptation de rang faible pour le fine-tuning efficace
- **Quantization** : réduction de la précision des poids (INT8, INT4)
- **KV-cache** : mise en cache des clés/valeurs pour accélérer l'inférence

## Prérequis recommandés

- [Deep Learning](../deep-learning/) — architecture des réseaux de neurones
- [Natural Language Processing](../natural-language-processing/) — fondamentaux du traitement du langage
- Algèbre linéaire (produits matriciels, décomposition en valeurs singulières)
- Probabilités (maximum de vraisemblance, entropie croisée)

## Applications

- Assistants conversationnels et chatbots
- Génération et complétion de code
- Résumé automatique et traduction
- Recherche d'information et question-answering
- Agents autonomes et utilisation d'outils
