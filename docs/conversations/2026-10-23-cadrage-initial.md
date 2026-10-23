# Session du 2026-10-23 — Cadrage initial

Outil : Claude Code (Sonnet 5.5). Langue des échanges : français.

## 1. Demande initiale (utilisateur)

- Analyser `sujet/` (`sujet.pdf` + `vehicles.json`) : test technique React / TypeScript, à réaliser avec l'IA, donc **tout documenter**.
- Créer un `CLAUDE.md` avec les règles du projet (d'autres règles viendront).
- Micro commits, en anglais, `type(scope): ...`, Claude co-auteur.
- Chaque décision dans un dossier ADR ; **ne jamais supprimer un ADR**, en créer un nouveau si les choses changent.
- Stack libre : React + Next.js + **Payload CMS** (non proposé dans le sujet) pour que l'utilisateur puisse modifier facilement son site. Payload headless, pensé « utilisateur et produit ». Next.js pour sa robustesse, sa modernité, sa rapidité, son rendu sans JavaScript côté utilisateur, et sa capacité à se brancher à toute API.
- Log des conversations.
- README avec la stack, le linter, etc. **Zéro `any`**. Tests E2E (Playwright) dans un dossier dédié + tests basiques.

## 2. Analyse du sujet par l'IA

- 4 fonctionnalités : accueil, catalogue, contact → Telegram, réservation → Telegram.
- `vehicles.json` : agence + 10 véhicules (catégories Citadine, Compacte, SUV, Sportive), avec prix/jour, caution, km inclus, Crit'Air, disponibilité, équipements. À utiliser sans modification ; images absentes.
- Constat : le dépôt contient déjà un squelette **Vite**, qui ne correspond pas à Next.js → à remplacer (ADR-0003).
- Point de tension relevé par l'IA : le sujet dit « sans back-office à gérer », alors que Payload ajoute une interface d'admin. Consigné dans l'ADR-0004 ; l'utilisateur garde la décision.

## 3. Réalisé

- Commits `docs(sujet)` et `chore(deps)` pour l'existant.
- `CLAUDE.md`, ADR 0000 à 0008.

## 4. Corrections de l'utilisateur en cours de session

| Correction | Effet |
|---|---|
| « En français stp. Sauf les commits » | Première version de `CLAUDE.md` rédigée en anglais, rejetée → réécrite en français. Règle de langue ajoutée (ADR-0001, CLAUDE.md). |
| « On essaye de faire des PR si utiles et code review » | Règle ajoutée au CLAUDE.md et à l'ADR-0002. |
| « Le tout dans Docker avec la config + config nginx si besoin » | Règle ajoutée au CLAUDE.md et nouvel ADR-0008. |

## 5. Suite prévue

Remplacer le squelette Vite par Next.js + Payload, Dockerfile/compose, décider de la base de données et de l'intégration Telegram (nouveaux ADR), puis F1 à F4.
