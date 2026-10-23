# ADR-0009 : PostgreSQL comme base de données de Payload

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude) — choix recommandé par l'IA, à confirmer

## Contexte

Payload CMS (ADR-0004) exige une base de données. Le projet est conteneurisé (ADR-0008), ce qui rend l'ajout d'un service de base de données peu coûteux.

## Décision

Utiliser **PostgreSQL** via `@payloadcms/db-postgres`, lancé comme service dans `docker-compose.yml`. Les identifiants viennent de variables d'environnement (`DATABASE_URI`).

## Alternatives envisagées

- **SQLite** (`@payloadcms/db-sqlite`) : zéro service à lancer, très simple pour un test. Écarté car moins proche d'une production réelle et non adapté à plusieurs instances ; reste une option de repli si PostgreSQL gêne l'évaluation.
- **MongoDB** : supporté par Payload, mais les données (véhicules, utilisateurs) sont relationnelles et typées.

## Conséquences

- `docker compose up` démarre PostgreSQL ; le développement local nécessite ce conteneur.
- Les migrations Payload devront être versionnées avant la mise en production.
