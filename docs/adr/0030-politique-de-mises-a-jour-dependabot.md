# ADR-0030 : Politique de mises à jour Dependabot

- **Statut** : Accepté — complète l'ADR-0028
- **Date** : 2026-10-28
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Dependabot (ADR-0028) a ouvert huit PR en une semaine. Triées une par une : quatre mises à jour d'actions GitHub saines, trois montées de version majeure inutilisables (`graphql` 17, `typescript` 7, `@types/node` 26) et un changement d'image Docker (`node` 22 → 26) que la CI ne vérifie pas vraiment.

## Décision

- **Les mises à jour mineures et correctives restent automatiques** (PR hebdomadaires, groupées pour Payload).
- **Les montées de version majeure sont retenues** pour trois paquets npm et pour l'image Docker `node` :
  - `graphql` : `payload` et `@payloadcms/*` exigent `^16.8.1`, l'installation échoue en 17 ;
  - `typescript` : `typescript-eslint` exige `<6.1.0`, l'installation échoue en 7 ;
  - `@types/node` : les types doivent suivre la version majeure de Node réellement utilisée (sinon le code peut appeler une API absente du Node lancé) ;
  - image `node` : changer de version majeure se décide en bloc (image, CI, types), voir l'ADR-0031.
- **Les mises à jour d'actions GitHub sont fusionnées une à une**, la CI de chaque PR en vérifiant au moins une (les étapes qui ne tournent qu'en cas d'échec, comme l'envoi du rapport de tests, ne sont pas exercées par un succès : la réserve est notée dans la PR).
- Lever une retenue est un changement volontaire : retirer l'entrée du fichier `.github/dependabot.yml` dans une PR dédiée, une fois la contrainte levée en amont.

## Alternatives envisagées

- **Fusionner tout ce qui est vert** : #19 (`@types/node` 26) et #13 (`node` 26) étaient verts sans être sûrs ; la CI n'exécute pas l'application sous Node 26.
- **Fermer chaque PR avec `@dependabot ignore`** : sans trace dans le dépôt ; une règle versionnée est relisible et se retire.
- **Désactiver Dependabot** : on perdrait les correctifs de sécurité.

## Conséquences

- Les montées majeures des quatre paquets ne sont plus proposées : il faut y penser soi-même, surtout quand Node 22 arrivera en fin de vie (avril 2027).
- Les PR #18, #19 et #20 ont été fermées avec une explication ; Dependabot ne les rouvrira pas pour cette version.
