# ADR-0027 : Audit d'accessibilité et tests axe-core

- **Statut** : Accepté
- **Date** : 2026-10-27
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Le bonus « accessibilité » du sujet figurait comme limite connue : des bases étaient en place (lien d'évitement, repères, libellés, focus visible, `prefers-reduced-motion`) mais rien n'avait été mesuré. Depuis, le site a été refait (ADR-0022 à ADR-0026). L'utilisateur demande l'audit.

## Décision

- Référentiel visé : **WCAG 2.2 AA**.
- **axe-core** (`@axe-core/playwright`, dépendance de développement) sur les 10 pages du site, en bureau et en mobile, dans la suite E2E existante : la CI échoue si une violation apparaît. Toutes les règles WCAG A et AA (2.0, 2.1, 2.2) et les bonnes pratiques sont actives, sans règle désactivée.
- Les contrôles que l'outil ne fait pas (reflow à 320 px, ordre et indicateur de focus, lien d'évitement, focus après erreur de formulaire, contraste du texte sur la photo, taille des cibles) ont été faits à la main puis **transformés en tests** quand c'était possible. Le contraste sur la photo a été calculé sur la zone la plus claire de l'image.
- Les animations sont désactivées (`reducedMotion`) pendant les scans pour qu'axe ne lise pas un élément à moitié transparent ; une page d'accueil est aussi scannée après la fin de l'animation.
- Le rapport est dans `docs/accessibilite.md` : méthode, défauts corrigés, ce qui est conforme, et **ce qui n'est pas couvert**. Aucune déclaration de conformité n'est revendiquée.
- Les adresses inconnues passent par une route de rattrapage et une page « introuvable » du site, pour garder la langue, les repères et la navigation.

## Alternatives envisagées

- **Lighthouse seul** : score global peu précis et non bloquant ; axe donne des règles nommées et des cibles exactes.
- **pa11y / Accessibility Insights en ligne de commande** : doublon avec axe, et une configuration de plus.
- **Désactiver des règles pour passer au vert** : refusé ; les violations ont été corrigées.
- **Rapport manuel sans tests** : se périme à la prochaine modification ; les tests restent en CI.

## Conséquences

- Toute nouvelle page doit être ajoutée à la liste `PAGES` de `e2e/accessibility.spec.ts`.
- Le temps de la suite E2E augmente d'environ une minute.
- Les limites (aucun lecteur d'écran, aucun test avec des utilisateurs, `/admin` non audité) sont écrites dans le rapport et le README, pas passées sous silence.
