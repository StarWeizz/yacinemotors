# ADR-0015 : Versionnement des migrations de base de données

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

L'utilisateur demande que les migrations de la base soient versionnées « comme pour Supabase, Laravel ou autre » : un historique ordonné, rejouable et relu en revue de code. Payload génère déjà des migrations (ADR-0012 : pas de `push`, migrations au démarrage), mais la politique n'était pas écrite.

## Décision

- Les migrations vivent dans **`src/migrations/`** et sont **commitées avec le changement de schéma qui les provoque** (même branche, même PR). Chaque migration comprend `AAAAMMJJ_HHMMSS_nom.ts` (`up`/`down`) et son **snapshot** `.json` (état du schéma, base du diff suivant), plus `index.ts` qui les enregistre.
- Une migration est créée par changement de schéma : `npm run migrate:create -- <nom>`. Nom en anglais, descriptif (`vehicles`, `add-booking-status`).
- **Une migration déjà fusionnée n'est jamais modifiée ni supprimée** (même principe que les ADR) : une correction passe par une nouvelle migration.
- Application : `npm run migrate` en local, automatiquement au démarrage du serveur en production. État : `npm run migrate:status`. Retour arrière : `npm run migrate:down` (développement uniquement).
- Les `down` sont conservés pour le développement ; en production on corrige en avant.
- Les données de départ ne sont **pas** dans les migrations mais dans le seed idempotent (ADR-0013).

## Alternatives envisagées

- `push` automatique du schéma : rapide mais sans historique ni revue (écarté, ADR-0012).
- Outil externe (Supabase CLI, Flyway…) : redondant avec les migrations natives de Payload, qui suivent le modèle de données TypeScript. Comme PostgreSQL est standard (ADR-0010), un passage à Supabase reste possible.

## Conséquences

L'historique du schéma est lisible dans git et relu en PR. Les fichiers générés sont exclus du lint (ADR-0012) mais doivent être relus à la main avant le commit.
