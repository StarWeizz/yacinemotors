# ADR-0016 : Intégration continue avec GitHub Actions

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Le projet suit des règles strictes (zéro `any`, tests, migrations versionnées, image Docker). Elles doivent être vérifiées automatiquement sur chaque PR, pas seulement en local, puisque le code est produit avec une IA et relu par l'humain.

## Décision

Un workflow `.github/workflows/ci.yml` s'exécute sur chaque PR et sur `master`, avec trois jobs :

1. **quality** : `npm run lint`, `typecheck`, `npm test` (Vitest) puis `npm run build` ;
2. **migrations** : sur un PostgreSQL de service vide, `npm run migrate`, `migrate:status`, puis `npm run seed` exécuté deux fois (idempotence) — cela valide aussi qu'un schéma neuf se construit uniquement à partir des migrations versionnées (ADR-0015) ;
3. **docker** : l'image de production se construit.

Permissions minimales (`contents: read`), annulation des exécutions obsolètes, aucun secret : les valeurs de CI sont des placeholders. Les tests Playwright (E2E) seront ajoutés à ce workflow dès que le dossier `e2e/` existera.

## Alternatives envisagées

- Pas de CI : les règles reposeraient sur la discipline locale seulement.
- Un seul job : plus lent à diagnostiquer, et le job de migrations a besoin d'un service PostgreSQL.

## Conséquences

La CI doit être verte avant fusion d'une PR. Le workflow ne peut pas être exécuté localement : sa première exécution a lieu sur GitHub.
