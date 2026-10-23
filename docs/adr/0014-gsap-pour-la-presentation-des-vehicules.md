# ADR-0014 : GSAP pour la présentation des véhicules

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

L'utilisateur souhaite intégrer **GSAP** pour animer la présentation des véhicules (catalogue, fiches). Le choix de Next.js repose en partie sur le rendu sans JavaScript côté utilisateur (ADR-0003).

## Décision

Utiliser GSAP (avec `@gsap/react`) pour les animations de la présentation des véhicules, en respectant ces garde-fous :

- les animations sont une **amélioration progressive** : le contenu est rendu côté serveur et lisible sans JavaScript ;
- les composants animés sont de petits **composants clients** isolés ; le reste reste en composants serveur ;
- respect de `prefers-reduced-motion` (animations désactivées ou réduites) pour l'accessibilité ;
- pas de décalage de mise en page (CLS) : les états initiaux ne masquent pas le contenu tant que GSAP n'a pas chargé.

L'intégration se fera avec l'interface du catalogue (F2), pas avant.

## Alternatives envisagées

- CSS pur / View Transitions : plus léger, mais moins de contrôle sur des séquences et du défilement.
- Framer Motion : bon choix React, mais GSAP est le choix de l'utilisateur et se prête mieux aux séquences complexes.

## Conséquences

Ajoute une dépendance côté client (poids du bundle à surveiller, import limité aux modules utilisés). À tester en E2E avec les animations désactivées pour éviter l'instabilité.
