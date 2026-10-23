# ADR-0006 : TypeScript strict, zéro `any`, ESLint

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Le sujet recommande le clean code. Le code généré par une IA doit être relu et contraint.

## Décision

- TypeScript en mode `strict`.
- **Aucun `any`** dans le code (ni `as any`, ni `@ts-ignore`) ; `unknown` + affinage de type à la place.
- Règle ESLint `@typescript-eslint/no-explicit-any` en `error`, lint et vérification des types obligatoires avant chaque commit.
- Les types Payload sont générés (`payload generate:types`), pas écrits à la main.

## Alternatives envisagées

- Règle en `warn` : trop facile à ignorer.
- Typage laxiste : l'IA introduit alors des `any` silencieux.

## Conséquences

Code plus sûr et plus lisible ; peut ralentir légèrement l'écriture, surtout aux frontières (JSON, API Telegram, entrées de formulaire) où il faut valider les données.
