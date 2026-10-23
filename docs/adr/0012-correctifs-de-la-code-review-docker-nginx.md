# ADR-0012 : Ajustements Docker, nginx et migrations après code review

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

La code review de la branche `feat/migrate-nextjs-payload` a relevé des écarts avec l'[ADR-0011](0011-architecture-docker-compose-et-nginx.md) (qui n'est pas modifié) et des défauts de configuration. Voir le log de conversation du 2026-10-23.

## Décision

Le comportement décrit dans l'ADR-0011 est précisé et corrigé :

- **Rate limiting par zone** : `/api/` et `/` généreux (l'admin Payload fait de nombreux appels API par page) ; limite **stricte** (6 requêtes/min, rafale de 3) uniquement sur les routes de formulaires publics `/api/contact` et `/api/reservation`, qui déclencheront des messages Telegram.
- **En-têtes de sécurité** partagés via un fichier inclus dans chaque `location` (nginx n'hérite pas des `add_header` d'un niveau supérieur dès qu'un `location` en définit un).
- **Résolution DNS dynamique** de `app` (resolver Docker + variable) : nginx survit à la recréation du conteneur applicatif.
- **Migrations au démarrage du serveur** (`instrumentation.ts`) et non à la première requête. `push` du schéma est désactivé : tout changement passe par une migration (`npm run migrate`, `npm run migrate:create`).
- **Variables d'environnement obligatoires** (`PAYLOAD_SECRET`, `DATABASE_URI`) : l'application échoue au démarrage en nommant la variable manquante.
- **Publication du port de la base en développement uniquement**, via `docker-compose.dev.yml` à activer explicitement (plus de fichier `override` chargé automatiquement).
- Mot de passe PostgreSQL limité aux lettres et chiffres, car il est intégré dans une URL de connexion.

## Alternatives envisagées

- Garder `docker-compose.override.yml` : risque de publier le port de la base sur un serveur.
- Laisser `push` actif en développement : dérive entre la base de dev et les migrations versionnées.
- Encoder le mot de passe dans l'URL : plus fragile qu'une contrainte documentée.

## Conséquences

- Plusieurs instances de l'application lancées simultanément pourraient exécuter les migrations en même temps : à traiter (verrou ou étape de migration dédiée) avant tout passage à plusieurs réplicas.
- Les routes `/api/contact` et `/api/reservation` n'existent pas encore ; la règle nginx est prête pour elles.
