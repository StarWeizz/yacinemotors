# ADR-0011 : Architecture Docker Compose et rôle de nginx

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

L'[ADR-0008](0008-docker-et-nginx.md) décide de tout conteneuriser et laissait ouverte la nécessité de nginx. Le site expose des formulaires publics qui déclenchent des messages Telegram : c'est une cible naturelle pour le spam.

## Décision

`docker compose up` lance trois services :
- **db** : PostgreSQL 17 (volume persistant, healthcheck, non exposé à l'extérieur) ;
- **app** : image Next.js `standalone` multi-étapes, utilisateur non-root, démarrée une fois la base prête ;
- **nginx** : seul service exposé (port 80), reverse proxy vers `app`.

nginx est **retenu** pour : en-têtes de sécurité, limitation de débit (plus stricte sur `/api/` et les formulaires), compression et cache des fichiers statiques de Next.js. TLS est laissé à l'hébergeur ou à un proxy en amont (non traité localement).

Un fichier `docker-compose.override.yml` (chargé automatiquement en local) publie la base sur `127.0.0.1:5433` pour le développement.

En production, les migrations Payload s'exécutent au démarrage (`prodMigrations`) ; `push` du schéma n'est utilisé qu'en développement.

## Alternatives envisagées

- Sans nginx : plus simple, mais pas de rate limiting ni d'en-têtes centralisés devant l'application.
- Caddy / Traefik : bons candidats (TLS automatique) ; nginx retenu car demandé par l'utilisateur et très répandu.

## Conséquences

Un service de plus à maintenir. Le rate limiting nginx complète, sans la remplacer, une protection anti-spam applicative (bonus à décider).
