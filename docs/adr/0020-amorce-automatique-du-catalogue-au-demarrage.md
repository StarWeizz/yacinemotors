# ADR-0020 : Amorce automatique du catalogue au premier démarrage

- **Statut** : Accepté
- **Date** : 2026-10-24
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Avec `docker compose up`, la base est migrée mais **vide** : le catalogue n'apparaît qu'après avoir lancé `npm run seed` depuis l'hôte, car le dossier `sujet/` n'est pas dans l'image et la base n'est pas publiée. Pour un évaluateur qui veut simplement lancer le site, c'est une étape cachée (ADR-0013 prévoyait un seed manuel).

## Décision

- Au démarrage du serveur (`instrumentation.ts`, juste après les migrations), **si `AUTO_SEED=true` et si la collection `vehicles` est vide**, le catalogue est chargé depuis `vehicles.json` avec la même logique que `npm run seed` (module partagé `src/lib/vehicles/seed.ts`).
- L'image Docker embarque **uniquement** `sujet/vehicles.json` (le reste de `sujet/` reste exclu). Le chemin peut être changé avec `CATALOG_PATH`.
- `docker-compose.yml` active `AUTO_SEED` par défaut. Hors Docker, la variable est absente : le comportement reste celui d'avant (`npm run seed` manuel).
- L'amorce ne s'exécute **que si la collection est vide** : elle n'écrase jamais les modifications du gérant et ne ralentit pas les démarrages suivants.
- Une erreur d'amorce est journalisée mais **ne fait pas échouer le démarrage** du site.
- `vehicles.json` n'est jamais écrit ni modifié.

## Alternatives envisagées

- **Étape manuelle documentée** (situation actuelle) : fiable mais facile à oublier.
- **Conteneur « seed » séparé dans le compose** : plus explicite, mais embarque les outils de développement (`payload run`, `tsx`) dans une image supplémentaire.
- **Seed dans une migration** : mélange schéma et données (contraire à l'ADR-0015) et rejoue des données déjà modifiées.

## Conséquences

- Si le gérant **supprime tous les véhicules** puis que l'application redémarre, le catalogue d'origine est rechargé tant que `AUTO_SEED=true` : mettre `AUTO_SEED=false` en production une fois le catalogue du client en place.
- Avec plusieurs instances démarrant simultanément, l'amorce pourrait s'exécuter deux fois (le seed est idempotent par `slug`, donc sans doublon) ; même limite que les migrations (ADR-0012).
