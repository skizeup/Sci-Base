---
generated_by: ollama/deepseek-r1:1.5b
generated_at: 2026-02-21T12:25:13Z
topic: machine-learning
---

### Contexte
À la fin des années 1990, la reconnaissance automatique de caractères manuscrits (comme lire un code postal sur une enveloppe) était un défi majeur. Les méthodes traditionnelles nécessitaient de concevoir manuellement des caractéristiques visuelles (traits, courbes, angles), un processus long et fragile. LeCun et ses collègues (1998) proposent une approche radicalement différente : laisser la machine **apprendre elle-même** à extraire les caractéristiques utiles directement depuis les images brutes.

### Approche
L'article introduit **LeNet-5**, l'un des tout premiers réseaux de neurones convolutifs (CNN). Son architecture empile plusieurs types de couches : des **couches de convolution** qui détectent des motifs locaux (bords, coins, courbes) en faisant glisser de petits filtres sur l'image, des **couches de pooling** qui réduisent la taille de l'image tout en gardant l'essentiel, et des **couches entièrement connectées** qui combinent le tout pour prendre la décision finale. C'est comme un entonnoir : on part d'une image complète et on extrait progressivement des informations de plus en plus abstraites, jusqu'à reconnaître le chiffre.

### Résultats clés
- LeNet-5 atteint une précision de **99,2 %** sur le dataset MNIST (chiffres manuscrits), un résultat remarquable pour l'époque.
- Le réseau apprend **sans ingénierie manuelle** des caractéristiques : il découvre seul quels motifs sont pertinents.
- L'article démontre aussi l'intégration du CNN dans un système complet de lecture de chèques bancaires, prouvant son utilité pratique.
- L'approche par apprentissage de bout en bout (end-to-end) surpasse les méthodes classiques à base de règles.

### Impact
Cet article est considéré comme l'acte fondateur de la **vision par ordinateur moderne**. L'architecture CNN introduite par LeNet-5 est l'ancêtre direct de tous les réseaux utilisés aujourd'hui en reconnaissance d'images (AlexNet, VGG, ResNet). Bien que les CNN aient dû attendre les années 2010 et la puissance des GPU pour révéler leur plein potentiel, les principes posés dans cet article de 1998 restent au coeur de pratiquement tous les systèmes de vision artificielle actuels.
