# Yacine Motors

Site de l'agence de location de véhicules **Yacine Motors** (Marseille) — test technique LEMDINT, réalisé avec un agent IA (Claude Code).
Sujet et données : [`sujet/`](sujet/).

> **État d'avancement** : le socle Next.js + Payload (PostgreSQL) est en place et fonctionne (accueil, admin Payload, API). Docker, le modèle de données véhicules, le seed et la CI sont en place. F1 à F4 sont en place : accueil, catalogue, formulaire de contact et demande de réservation, avec envoi sur Telegram, GSAP et tests E2E. Restent à compléter : sections du sujet (sécurité, points flous, limites), déploiement. Les sections ci-dessous sont mises à jour au fil des commits.

## Stack

| Domaine | Choix | Décision |
|---|---|---|
| Front | React + Next.js, TypeScript strict | [ADR-0003](docs/adr/0003-nextjs-react-typescript.md) |
| CMS | Payload CMS (headless) : utilisateurs et produits | [ADR-0004](docs/adr/0004-payload-cms-headless.md) |
| Qualité | ESLint, **zéro `any`** | [ADR-0006](docs/adr/0006-qualite-typescript-strict-zero-any.md) |
| Tests | Vitest (basiques) + Playwright (E2E, dossier `e2e/`) | [ADR-0007](docs/adr/0007-strategie-de-tests-vitest-playwright.md) |
| Base de données | PostgreSQL (proche de Supabase : hébergé, open source et économique) | [ADR-0009](docs/adr/0009-postgresql-pour-payload.md), [ADR-0010](docs/adr/0010-postgresql-confirme-et-proximite-supabase.md) |
| Telegram | API Bot `sendMessage` appelée côté serveur, token jamais exposé | [ADR-0018](docs/adr/0018-integration-telegram-bot-api-cote-serveur.md) |
| Formulaires | Validation serveur, honeypot, contrôle d'origine, fonctionnent sans JavaScript | [ADR-0019](docs/adr/0019-formulaires-validation-anti-spam-amelioration-progressive.md) |
| Données | Collection `vehicles` + global `agency`, seed depuis `vehicles.json` | [ADR-0013](docs/adr/0013-modele-vehicules-et-import-depuis-le-json.md) |
| Migrations | Versionnées dans `src/migrations/` | [ADR-0015](docs/adr/0015-versionnement-des-migrations-de-base-de-donnees.md) |
| Interface | Rendu serveur à la requête, CSS simple, visuel de remplacement | [ADR-0017](docs/adr/0017-interface-catalogue-rendu-serveur-et-css-simple.md) |
| Animations | GSAP (apparition au scroll, désactivée si `prefers-reduced-motion`) | [ADR-0014](docs/adr/0014-gsap-pour-la-presentation-des-vehicules.md) |
| CI | GitHub Actions | [ADR-0016](docs/adr/0016-integration-continue-github-actions.md) |
| Infra | Docker Compose (db + app + nginx reverse proxy, rate limiting) | [ADR-0008](docs/adr/0008-docker-et-nginx.md), [ADR-0011](docs/adr/0011-architecture-docker-compose-et-nginx.md), [ADR-0012](docs/adr/0012-correctifs-de-la-code-review-docker-nginx.md) |
| Notifications | Telegram (API Bot) — à décider | à venir |

## Linter et règles de code

- ESLint avec `typescript-eslint`, `react-hooks`, `react-refresh`.
- `@typescript-eslint/no-explicit-any` et `ban-ts-comment` en **erreur** : pas de `any`, pas de `@ts-ignore`.
- `npm run lint` et la compilation TypeScript doivent passer avant chaque commit.

## Configuration de Telegram

1. Créer un bot avec [@BotFather](https://t.me/BotFather) (`/newbot`) et récupérer le **token**.
2. Écrire au bot (ou l'ajouter à un groupe), puis ouvrir `https://api.telegram.org/bot<token>/getUpdates` pour lire le **chat id** (`message.chat.id`).
3. Renseigner `TELEGRAM_BOT_TOKEN` et `TELEGRAM_CHAT_ID` dans `.env` (jamais commité).

Brancher un autre bot (celui de l'évaluateur) = changer ces deux variables. Sans elles, les formulaires répondent « le message n'a pas pu être envoyé » au lieu de simuler un envoi. Les tests n'appellent jamais la vraie API : un faux serveur Telegram (`e2e/support/telegram-mock.mjs`) est lancé avec Playwright.

## Lancement avec Docker (recommandé)

```bash
cp .env.example .env          # renseigner POSTGRES_PASSWORD et PAYLOAD_SECRET (openssl rand -hex 32)
docker compose up -d --build
# site : http://localhost:8080 — admin Payload : http://localhost:8080/admin
```

- `db` : PostgreSQL 17, volume persistant, **non publié** par défaut.
- `app` : Next.js en mode `standalone`, utilisateur non-root ; les migrations Payload s'appliquent au démarrage du serveur.
- `nginx` : seul service exposé ; en-têtes de sécurité, cache des statiques, limitation de débit (stricte uniquement sur les formulaires `/api/contact` et `/api/reservation`, voir ADR-0012), config dans `docker/nginx/`.
- Passer à Supabase ou un autre PostgreSQL managé = changer `DATABASE_URI` (voir ADR-0010).

## Développement local (hors Docker)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db   # base seule, sur 127.0.0.1:5433
npm install
npm run migrate               # le schéma n'est jamais poussé automatiquement
npm run dev                   # http://localhost:3000 — admin : /admin
npm run lint                  # ESLint
npm run typecheck             # tsc --noEmit
npm run build                 # build de production
npm run generate:types        # régénère src/payload-types.ts
npm test                      # Vitest
npm run seed                  # charge sujet/vehicles.json (idempotent, ne le modifie pas)
npm run migrate:status        # état des migrations
npm run migrate:create -- <nom>   # après un changement de schéma
```

`npm run test:e2e` : tests Playwright du dossier `e2e/` (base migrée et seedée requise ; le serveur est construit et lancé automatiquement).

## Migrations de base de données

Chaque changement de schéma = une migration commitée dans la même PR (`src/migrations/`, avec son snapshot `.json`). Jamais de modification d'une migration fusionnée : on en crée une nouvelle. Le seed (données de départ) est séparé des migrations. Détails : ADR-0015.

## CI

`.github/workflows/ci.yml` : lint, types, tests, build, migrations sur base vide + seed idempotent, build de l'image Docker.

## Workflow de développement

- **Micro commits** en anglais, Conventional Commits, Claude co-auteur ([ADR-0002](docs/adr/0002-micro-commits-et-conventional-commits.md)).
- **PR et code review** quand c'est utile.
- **ADR** pour chaque décision, jamais supprimés : [`docs/adr/`](docs/adr/).
- **Log des conversations** avec l'IA : [`docs/conversations/`](docs/conversations/).
- Règles de pilotage de l'IA : [`CLAUDE.md`](CLAUDE.md).

## Structure du dépôt

```
sujet/              sujet.pdf et vehicles.json (ne pas modifier)
docs/adr/           décisions d'architecture
docs/conversations/ journal des échanges avec l'IA
e2e/                tests Playwright (pages, formulaires, sans JavaScript, faux Telegram)
CLAUDE.md           règles du projet pour l'agent
```

## Sections exigées par le sujet

À compléter au fil du projet : installation et lancement, choix techniques et architecture (fonctionnement Telegram, alternatives écartées), workflow assisté par IA (exemples de corrections), sécurité, choix face aux points flous, limites et suites.
