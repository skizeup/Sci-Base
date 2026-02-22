---
generated_by: ollama/deepseek-r1:1.5b
generated_at: 2026-02-21T12:25:05Z
topic: machine-learning
---

### Contexte
Au début des années 1990, les réseaux de neurones étaient populaires mais souffraient de problèmes d'entraînement (convergence lente, minima locaux). Les chercheurs avaient besoin d'un algorithme de classification avec des **garanties théoriques solides** et de bonnes performances même avec peu de données. Corinna Cortes et Vladimir Vapnik ont proposé les Support-Vector Networks (SVM), une méthode fondée sur la théorie de l'apprentissage statistique.

### Approche
L'idée centrale est géométrique : pour séparer deux classes de points, on cherche l'**hyperplan** (une frontière droite en 2D, un plan en 3D) qui maximise la **marge**, c'est-à-dire la distance entre la frontière et les points les plus proches de chaque classe. Imaginez deux groupes d'élèves dans une cour de récréation : le SVM trace la ligne qui les sépare en laissant le plus d'espace possible entre les deux groupes. Mais que faire si les groupes sont mélangés et qu'aucune ligne droite ne peut les séparer ? C'est là qu'intervient le **kernel trick** : on projette les données dans un espace de dimension supérieure où une séparation linéaire devient possible, sans jamais calculer explicitement cette projection (d'où le terme "trick").

### Résultats clés
- Les SVM atteignent des performances de classification **comparables ou supérieures** aux réseaux de neurones de l'époque sur la reconnaissance de chiffres manuscrits.
- La solution est **unique et globale** (pas de problème de minima locaux, contrairement aux réseaux de neurones).
- L'algorithme fonctionne remarquablement bien en **haute dimension**, même quand le nombre de variables dépasse le nombre d'exemples.
- Seuls quelques points d'entraînement (les *vecteurs supports*) déterminent la frontière de décision, rendant le modèle compact.

### Impact
Ce paper de 1995 a fondé toute la famille des **machines à vecteurs de support** et a dominé le machine learning pendant plus d'une décennie, avant l'essor du deep learning. Les SVM ont été appliqués avec succès à la reconnaissance de texte, la bio-informatique (classification de protéines), la détection de visages et bien d'autres domaines. Le concept de marge maximale et le kernel trick restent des notions fondamentales enseignées dans tous les cours de machine learning, et les SVM demeurent un outil pertinent quand les données sont peu nombreuses mais de haute dimension.
