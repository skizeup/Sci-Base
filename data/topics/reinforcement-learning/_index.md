# Reinforcement Learning

## Description

L'apprentissage par renforcement (RL) est un paradigme du machine learning dans lequel un **agent** apprend à prendre des décisions en interagissant avec un **environnement**. À chaque étape, l'agent observe un état, choisit une action, et reçoit une récompense. L'objectif est de trouver la **politique** (stratégie) qui maximise les récompenses cumulées sur le long terme.

## Pourquoi c'est important

Le RL est derrière certaines des avancées les plus spectaculaires de l'IA : AlphaGo (battre le champion du monde de Go), les robots qui apprennent à marcher, les voitures autonomes, et plus récemment le RLHF (Reinforcement Learning from Human Feedback) qui est au coeur de l'entraînement de ChatGPT et des LLMs modernes.

## Concepts fondamentaux

### Le cadre MDP (Processus de Décision Markovien)
Le RL se formalise comme un MDP défini par le tuple $(S, A, P, R, \gamma)$ :
- $S$ : ensemble des états
- $A$ : ensemble des actions
- $P(s'|s,a)$ : probabilités de transition
- $R(s,a)$ : fonction de récompense
- $\gamma \in [0,1]$ : facteur d'actualisation (discount factor)

### Fonction de valeur
- **Fonction de valeur d'état** : $V^\pi(s) = \mathbb{E}\left[\sum_{t=0}^{\infty} \gamma^t r_t \mid s_0 = s\right]$
- **Fonction de valeur d'action** (Q-value) : $Q^\pi(s,a)$ — valeur espérée en prenant l'action $a$ dans l'état $s$, puis en suivant la politique $\pi$

### Exploration vs Exploitation
Dilemme central du RL : faut-il **exploiter** ce qu'on sait déjà être bon, ou **explorer** de nouvelles actions potentiellement meilleures ? Stratégie classique : $\epsilon$-greedy.

## Les grandes familles d'algorithmes

### Méthodes tabulaires
- **Q-Learning** : apprentissage off-policy de la Q-value optimale
- **SARSA** : apprentissage on-policy

### Méthodes par approximation de fonction (Deep RL)
- **DQN** (Deep Q-Network) : Q-learning avec réseaux de neurones profonds
- **Policy Gradient** : optimisation directe de la politique (REINFORCE)
- **Actor-Critic** : combine estimation de valeur et optimisation de politique (A2C, A3C, PPO)

### Méthodes model-based
- L'agent apprend un modèle de l'environnement puis planifie (Dyna, MuZero)

## Prérequis recommandés

- [Machine Learning](../machine-learning/) — bases du ML
- Probabilités (chaînes de Markov, espérance conditionnelle)
- Optimisation (descente de gradient)
- Python (PyTorch ou TensorFlow, Gymnasium/Gym)

## Applications

- Jeux (Go, Atari, StarCraft, Dota 2)
- Robotique (locomotion, manipulation)
- RLHF pour les LLMs (ChatGPT, Claude)
- Trading algorithmique
- Conduite autonome
- Gestion de ressources et énergie
