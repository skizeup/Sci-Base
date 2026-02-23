# Statistiques pour la Data Science

## Description

Les statistiques sont le socle mathématique de la data science et du machine learning. Elles fournissent les outils pour collecter, analyser, interpréter et présenter des données. Comprendre les statistiques est essentiel pour évaluer la fiabilité des modèles, concevoir des expériences et tirer des conclusions rigoureuses à partir de données.

## Pourquoi c'est important

Sans statistiques solides, impossible de :
- Savoir si un modèle de ML est réellement meilleur qu'un autre (tests d'hypothèse)
- Comprendre la distribution de ses données (statistiques descriptives)
- Gérer l'incertitude dans les prédictions (intervalles de confiance)
- Éviter les biais d'échantillonnage et les faux positifs

Les statistiques sont le langage commun entre la science des données, la recherche scientifique et la prise de décision basée sur les données.

## Statistiques descriptives

Les statistiques descriptives résument les caractéristiques principales d'un jeu de données.

- **Mesures de tendance centrale** : moyenne $\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i$, médiane, mode
- **Mesures de dispersion** : variance $\sigma^2 = \frac{1}{n}\sum_{i=1}^{n}(x_i - \bar{x})^2$, écart-type $\sigma$, étendue, écart interquartile
- **Mesures de forme** : asymétrie (skewness), aplatissement (kurtosis)

## Probabilités

Les probabilités formalisent l'incertitude et sont au coeur du ML.

- **Théorème de Bayes** : $P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}$ — fondation de l'inférence bayésienne et de nombreux algorithmes de classification
- **Distributions** : normale $\mathcal{N}(\mu, \sigma^2)$, binomiale, Poisson, exponentielle
- **Espérance et variance** : $\mathbb{E}[X] = \sum_x x \cdot P(X=x)$, $\text{Var}(X) = \mathbb{E}[(X - \mu)^2]$
- **Loi des grands nombres** et **théorème central limite** : pourquoi les moyennes convergent et suivent une loi normale

## Inférence statistique

L'inférence permet de tirer des conclusions sur une population à partir d'un échantillon.

- **Estimation** : estimateurs ponctuels et par intervalles de confiance
- **Tests d'hypothèse** : $H_0$ vs $H_1$, p-value, erreurs de type I ($\alpha$) et type II ($\beta$)
- **Tests courants** : test $t$ de Student, test du $\chi^2$, ANOVA, test de Mann-Whitney
- **Puissance statistique** : probabilité de détecter un effet réel

## Régression et corrélation

- **Corrélation** : coefficient de Pearson $r = \frac{\sum(x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum(x_i - \bar{x})^2 \sum(y_i - \bar{y})^2}}$
- **Régression linéaire** : $y = \beta_0 + \beta_1 x + \varepsilon$ — modèle fondamental utilisé en [Machine Learning](../machine-learning/)
- **Moindres carrés ordinaires** (OLS) : minimiser $\sum_{i=1}^{n}(y_i - \hat{y}_i)^2$
- **$R^2$** : proportion de la variance expliquée par le modèle

## Statistiques bayésiennes

Approche alternative à l'inférence fréquentiste, de plus en plus utilisée en ML.

- **Prior** $P(\theta)$ : croyance initiale sur les paramètres
- **Likelihood** $P(D|\theta)$ : vraisemblance des données
- **Posterior** $P(\theta|D) \propto P(D|\theta) \cdot P(\theta)$ : croyance mise à jour
- Applications : réseaux bayésiens, optimisation bayésienne des hyperparamètres

## Lien avec le Machine Learning

Les statistiques et le ML sont intimement liés :
- La régression linéaire/logistique vient directement des statistiques
- L'évaluation de modèles repose sur des concepts statistiques (cross-validation, bootstrap)
- La régularisation ($L_1$, $L_2$) est une forme de prior bayésien
- Voir [Machine Learning](../machine-learning/) pour les applications directes

## Prérequis recommandés

- Mathématiques de base (algèbre, fonctions)
- Notions de calcul différentiel
- Programmation Python (NumPy, pandas)
