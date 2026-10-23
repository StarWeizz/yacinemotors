# ADR-0008 : Conteneurisation avec Docker et nginx

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Le projet (Next.js + Payload + base de données) a plusieurs composants. L'évaluateur doit pouvoir le lancer facilement.

## Décision

Tout le projet tourne dans Docker :
- `Dockerfile` multi-étapes, image finale minimale, utilisateur non-root ;
- `docker-compose.yml` : application, base de données, et nginx si nécessaire ;
- configuration nginx versionnée dans `docker/nginx/` (reverse proxy, en-têtes de sécurité, limitation de débit sur les routes de formulaires, cache des fichiers statiques) ;
- secrets par variables d'environnement ; seul `.env.example` est versionné.

## Alternatives envisagées

- Lancement local sans conteneur uniquement : reproductibilité moindre.
- Plateforme managée seule (Vercel) : possible pour le déploiement, mais n'apporte pas de configuration versionnée ni de contrôle sur la base de données.

## Conséquences

`docker compose up` doit suffire à lancer le site. Nginx n'est ajouté que si son apport (rate limiting, TLS, cache) est confirmé ; ce point sera tranché par un ADR dédié.
