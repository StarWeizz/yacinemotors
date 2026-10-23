# ADR-0007 : Stratégie de tests (Vitest + Playwright)

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

« Tests automatisés » fait partie des bonus du sujet, mais le socle passe avant. L'utilisateur veut des tests E2E isolés et des tests basiques.

## Décision

- **Playwright** pour les tests E2E, dans un dossier dédié `e2e/` à la racine (parcours : accueil, catalogue, formulaires ; l'API Telegram est simulée, jamais appelée en test).
- **Vitest** pour des tests unitaires basiques (validation des formulaires, mise en forme des messages Telegram, utilitaires), placés à côté du code testé.

## Alternatives envisagées

- Cypress : valable, Playwright retenu (multi-navigateurs, rapide, intégré à TypeScript).
- Jest : Vitest est plus léger et plus récent.

## Conséquences

Deux commandes de test (`npm test`, `npm run test:e2e`) à documenter dans le README et à exécuter dans l'image Docker de CI si nécessaire.
