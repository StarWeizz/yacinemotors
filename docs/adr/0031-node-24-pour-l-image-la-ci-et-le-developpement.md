# ADR-0031 : Node 24 pour l'image, la CI et le développement

- **Statut** : Accepté — complète l'ADR-0030
- **Date** : 2026-10-28
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Dependabot proposait de passer l'image Docker de `node:22-alpine` à `node:26-alpine` (PR n°13). La CI était verte, mais elle ne prouve pas grand-chose : les tests E2E tournent sous Node 22 sur la machine de la CI, et le job Docker construit l'image sans la lancer. En regardant les contraintes réelles : Payload exige `node ^22.23.4 || >=24.22.1`, alors que `package.json` déclarait `>=20.9` (et le README « Node.js ≥ 20.9 ») : la déclaration du projet était plus permissive que celle de sa propre dépendance principale. Node 22 passe en fin de vie en avril 2027.

## Décision

- **Node 24** (version LTS active) partout, **en un seul changement** : image Docker (`node:24-alpine`), les trois jobs de la CI (`node-version: 24`), `engines` de `package.json` (`>=24.22.1`, le plancher de Payload pour la branche 24) et le prérequis du README. `@types/node` était déjà en 24 : types, exécution et CI sont maintenant alignés.
- **Pas Node 26** : non indispensable, non exercé par la CI ; le changement de version majeure suivant se décidera de la même façon (ADR-0030).
- **Vérification faite sur l'image, pas seulement sur la CI** : pile Docker construite et lancée sur Node 24.22.1 (utilisateur non-root, système de fichiers en lecture seule), pages, catalogue (10 véhicules), en-têtes, formulaires, puis les tests navigateur de l'accueil, du catalogue, des fiches, de l'accessibilité et du pied de page exécutés contre cette pile. La CI exécute désormais aussi lint, types, tests unitaires, build, migrations et E2E sous Node 24.

## Alternatives envisagées

- **Fusionner la PR Dependabot (Node 26)** : verte mais non démontrée, voir le contexte.
- **Rester en Node 22** : fonctionne jusqu'en avril 2027, mais laisse `engines` incohérent avec Payload et prépare une migration forcée.
- **Faire lancer l'image par la CI et y exécuter les E2E** : prouverait le runtime à chaque PR ; plus long et à part (voir « Conséquences »).

## Conséquences

- **Pour développer hors Docker, il faut Node ≥ 24.22.1.** Avec Node 20, `npm install` affiche un avertissement `EBADENGINE` (non bloquant par défaut) et rien ne garantit le fonctionnement.
- La CI continue de ne **pas** lancer l'image Docker : un écart entre l'hôte de la CI et le conteneur reste possible. Le garde-fou est la vérification manuelle ci-dessus ; la faire en CI est une suite possible.
- Les tests contre une pile derrière nginx doivent tourner en série ou avec peu de parallélisme : la limite de débit renvoie sinon des 429 (constaté : 128).
