# ADR-0010 : PostgreSQL confirmé, proximité avec Supabase

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

L'[ADR-0009](0009-postgresql-pour-payload.md) proposait PostgreSQL pour Payload, en attente de confirmation. L'utilisateur l'a confirmé et a ajouté un argument supplémentaire (l'ADR-0009 n'est pas modifié, conformément à l'ADR-0001).

## Décision

PostgreSQL est **confirmé**. Il rapproche le projet de **Supabase**, qui est :
- une excellente offre hébergée en ligne (PostgreSQL managé) ;
- disponible aussi en **solution open source** (auto-hébergeable) ;
- **économique**.

Conséquence pratique : `DATABASE_URI` est une chaîne PostgreSQL standard. Passer du conteneur local à une base Supabase (ou à tout autre PostgreSQL managé) ne demande qu'un changement de variable d'environnement, sans changement de code.

## Alternatives envisagées

- SQLite : plus simple localement, mais pas de chemin vers une base managée équivalente. Reste un repli.
- MongoDB : voir ADR-0009.

## Conséquences

- Le déploiement en ligne (bonus) pourra s'appuyer sur Supabase pour la base, si l'utilisateur le décide (ADR dédié).
- Avec Supabase, utiliser la chaîne de connexion adaptée (pooler en mode transaction) et activer SSL ; à documenter lors du déploiement.
