# ADR-0002 : Micro commits, Conventional Commits, PR et code review

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Le sujet impose Git et précise que « l'historique fait partie de l'évaluation » (commits atomiques, messages clairs).

## Décision

- Micro commits : un changement logique par commit.
- Messages **en anglais**, format `type(scope): subject`.
- Claude est co-auteur via le trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Quand c'est utile, travail sur branche + Pull Request vers `main`, avec code review (`/code-review`) avant fusion. Les changements triviaux peuvent aller directement sur `main`.
- Aucune PR ni push sans accord de l'utilisateur.

## Alternatives envisagées

- Gros commits par fonctionnalité : historique peu lisible, retours en arrière difficiles.
- Commits en français : la convention du métier est l'anglais.
- PR systématique : lourd pour un projet à un seul développeur ; réservé aux changements qui le méritent.

## Conséquences

Historique lisible qui montre le pilotage de l'IA. Co-signature transparente de la contribution de l'agent. Demande de la discipline à chaque étape.
