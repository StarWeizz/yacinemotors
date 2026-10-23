# ADR-0004 : Payload CMS headless pour la gestion du contenu

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Le client doit pouvoir modifier facilement son site. Payload CMS (https://payloadcms.com/) n'est **pas proposé dans le sujet** : c'est un choix de l'utilisateur. Le sujet mentionne cependant « sans back-office à gérer » (à propos de la réception des demandes via Telegram, sans interface d'administration des demandes).

## Décision

Utiliser **Payload CMS en mode headless**, intégré à Next.js, pour que l'utilisateur final (le gérant) puisse modifier facilement le site. Modèle de contenu envisagé : **utilisateurs** et **produits** (véhicules).

Les demandes (contact, réservation) continuent d'arriver sur Telegram, sans back-office de suivi : l'esprit du sujet est respecté. Le back-office Payload ne sert qu'à éditer le contenu du site.

## Alternatives envisagées

- **Lire `vehicles.json` directement** : plus simple, mais le client ne peut rien modifier sans développeur.
- **Strapi / Directus / Sanity** : possibles ; Payload retenu car il s'installe dans le même projet Next.js, en TypeScript, avec des types générés (compatible avec la règle « zéro any »).

## Conséquences

- Ajoute une base de données (à décider dans un ADR dédié) et une interface d'admin à sécuriser.
- `sujet/vehicles.json` ne doit jamais être modifié : il servira de source de départ (seed) pour Payload.
- Complexité supérieure à celle attendue pour le sujet : assumée et à justifier dans le README.
