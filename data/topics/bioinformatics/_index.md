# Bioinformatique

## Description

La bioinformatique se situe à l'intersection de la biologie, de l'informatique et des mathématiques. Elle développe des méthodes computationnelles pour analyser les données biologiques : séquences ADN/ARN, structures protéiques, données omiques. Avec l'explosion des données de séquençage et l'essor du deep learning, la bioinformatique connaît une révolution sans précédent.

## Pourquoi c'est important

- Le génome humain contient ~3 milliards de paires de bases — seul l'informatique peut analyser cette masse de données
- La bioinformatique accélère la découverte de médicaments (drug discovery) et la médecine personnalisée
- AlphaFold (DeepMind) a résolu le problème de la prédiction de structure protéique, un défi vieux de 50 ans
- Les techniques de [Machine Learning](../machine-learning/) et de [Deep Learning](../deep-learning/) transforment la recherche biomédicale

## Génomique et séquençage

- **ADN** : séquence de nucléotides (A, T, G, C) qui encode l'information génétique
- **Séquençage NGS** (Next-Generation Sequencing) : technologies haut-débit (Illumina, Oxford Nanopore)
- **Assemblage de génomes** : reconstruire un génome complet à partir de millions de fragments courts
- **Annotation** : identifier les gènes, régions régulatrices et éléments fonctionnels

## Alignement de séquences

Comparer des séquences biologiques pour identifier les similarités et les relations évolutives.

- **Alignement global** : algorithme de Needleman-Wunsch — aligne deux séquences sur toute leur longueur
- **Alignement local** : algorithme de Smith-Waterman — trouve les sous-régions les plus similaires
- **BLAST** (Basic Local Alignment Search Tool) : recherche rapide de similarité dans les bases de données
- **Matrices de substitution** : BLOSUM62, PAM250 — scorent les substitutions d'acides aminés
- **Alignement multiple** : ClustalW, MUSCLE — aligne plusieurs séquences simultanément

## Prédiction de structure protéique

Les protéines sont des chaînes d'acides aminés dont la fonction dépend de leur structure 3D.

- **Problème du repliement** : prédire la structure 3D à partir de la séquence — historiquement un des grands défis de la biologie
- **AlphaFold** (DeepMind, 2020) : réseau de neurones qui prédit la structure avec une précision atomique
- **ESMFold** (Meta) : modèle de langage protéique pour la prédiction de structure
- **Niveaux de structure** : primaire (séquence), secondaire (hélices $\alpha$, feuillets $\beta$), tertiaire (repliement 3D), quaternaire (complexes)

## Drug discovery computationnelle

L'informatique accélère chaque étape de la découverte de médicaments.

- **Criblage virtuel** : tester in silico des millions de molécules contre une cible protéique
- **Docking moléculaire** : prédire comment une molécule se lie à une protéine
- **QSAR** (Quantitative Structure-Activity Relationship) : prédire l'activité biologique à partir de la structure chimique
- **Modèles génératifs** : utiliser le deep learning pour concevoir de nouvelles molécules candidates

## ML appliqué au vivant

Le [Machine Learning](../machine-learning/) et le [Deep Learning](../deep-learning/) sont de plus en plus utilisés en bioinformatique :

- **Classification de séquences** : identifier des familles de gènes, prédire des fonctions
- **Analyse d'images biomédicales** : histopathologie, imagerie cellulaire
- **Réseaux de neurones sur graphes** : représenter les interactions protéine-protéine, les réseaux métaboliques
- **NLP pour les protéines** : les modèles de langage (BERT, Transformers) adaptés aux séquences protéiques
- **Single-cell RNA-seq** : analyse de l'expression génique cellule par cellule grâce au clustering et à la réduction de dimensionnalité

## Bases de données biologiques

- **GenBank / NCBI** : séquences nucléotidiques et protéiques
- **UniProt** : base de données de protéines annotées
- **PDB** (Protein Data Bank) : structures 3D de protéines
- **KEGG** : voies métaboliques et réseaux biologiques

## Prérequis recommandés

- Notions de biologie moléculaire (ADN, protéines, gènes)
- [Machine Learning](../machine-learning/) — les algorithmes de base
- Programmation Python (Biopython, pandas)
