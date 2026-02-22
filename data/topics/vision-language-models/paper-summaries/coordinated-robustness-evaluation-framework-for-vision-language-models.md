---
generated_by: groq/llama-3.3-70b-versatile
generated_at: 2026-02-22T08:40:38Z
topic: vision-language-models
---

### Contexte
Les modèles de vision-langage, qui combinent les capacités de la vision par ordinateur et du traitement automatique des langues, ont réalisé des progrès significatifs dans des tâches telles que la description d'images et la réponse à des questions visuelles. Cependant, ces modèles sont vulnérables aux petites perturbations, ce qui pose un défi à leur robustesse, en particulier lors de leur déploiement dans des scénarios réels. L'évaluation de la robustesse de ces modèles nécessite des perturbations dans les modalités à la fois visuelle et linguistique pour apprendre leurs dépendances inter-modales.

### Approche
Les auteurs proposent une approche innovante consistant à entraîner un modèle générique de substitution (ou "surrogate") qui peut accepter à la fois des images et du texte comme entrée et générer une représentation conjointe. Cette représentation est ensuite utilisée pour générer des perturbations adverses à la fois pour le texte et les images. Cette stratégie d'attaque coordonnée est conçue pour évaluer la robustesse des modèles de vision-langage en ciblant simultanément les deux modalités, contrairement aux approches traditionnelles qui se concentrent sur une modalité à la fois.

### Résultats clés
Les résultats de cette étude montrent que la stratégie d'attaque coordonnée proposée surpasse les autres attaques multi-modales et mono-modales de la littérature récente. Les expériences menées sur des jeux de données de réponse à des questions visuelles et de raisonnement visuel avec divers modèles de vision-langage de pointe, tels que Instruct-BLIP et ViLT, démontrent l'efficacité de cette approche à compromettre la robustesse de plusieurs modèles multi-modaux pré-entraînés.

### Impact
Ce travail est important car il met en évidence les vulnérabilités des modèles de vision-langage aux perturbations adverses, ce qui est crucial pour des applications où la fiabilité et la sécurité sont primordiales, comme dans les véhicules autonomes, les systèmes de surveillance ou les assistants virtuels. Les applications potentielles de cette recherche incluent le développement de modèles plus robustes et résistants aux attaques, améliorant ainsi la confiance et la sécurité dans les systèmes qui combinent la vision par ordinateur et le traitement automatique des langues.