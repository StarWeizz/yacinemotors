# Yacine Motors

Site de l'agence de location de véhicules **Yacine Motors** (Marseille) — test technique LEMDINT, réalisé avec un agent IA (Claude Code).
Sujet et données : [`sujet/`](sujet/).

> **État d'avancement** : le socle Next.js + Payload (PostgreSQL) est en place et fonctionne (accueil, admin Payload, API). Docker (PostgreSQL + app + nginx) est opérationnel. Les fonctionnalités F1 à F4 et les tests restent à faire. Les sections ci-dessous sont mises à jour au fil des commits.

## Stack

| Domaine | Choix | Décision |
|---|---|---|
| Front | React + Next.js, TypeScript strict | [ADR-0003](docs/adr/0003-nextjs-react-typescript.md) |
| CMS | Payload CMS (headless) : utilisateurs et produits | [ADR-0004](docs/adr/0004-payload-cms-headless.md) |
| Qualité | ESLint, **zéro `any`** | [ADR-0006](docs/adr/0006-qualite-typescript-strict-zero-any.md) |
| Tests | Vitest (basiques) + Playwright (E2E, dossier `e2e/`) | [ADR-0007](docs/adr/0007-strategie-de-tests-vitest-playwright.md) |
| Base de données | PostgreSQL (proche de Supabase : hébergé, open source et économique) | [ADR-0009](docs/adr/0009-postgresql-pour-payload.md), [ADR-0010](docs/adr/0010-postgresql-confirme-et-proximite-supabase.md) |
| Infra | Docker Compose (db + app + nginx reverse proxy, rate limiting) | [ADR-0008](docs/adr/0008-docker-et-nginx.md), [ADR-0011](docs/adr/0011-architecture-docker-compose-et-nginx.md), [ADR-0012](docs/adr/0012-correctifs-de-la-code-review-docker-nginx.md) |
| Notifications | Telegram (API Bot) — à décider | à venir |

## Linter et règles de code

- ESLint avec `typescript-eslint`, `react-hooks`, `react-refresh`.
- `@typescript-eslint/no-explicit-any` et `ban-ts-comment` en **erreur** : pas de `any`, pas de `@ts-ignore`.
- `npm run lint` et la compilation TypeScript doivent passer avant chaque commit.

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
npm run migrate:create -- <nom>   # après un changement de schéma
```

Commandes cibles (à venir) : `npm test` (Vitest), `npm run test:e2e` (Playwright).

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
e2e/                tests Playwright (à venir)
CLAUDE.md           règles du projet pour l'agent
```

## Sections exigées par le sujet

À compléter au fil du projet : installation et lancement, choix techniques et architecture (fonctionnement Telegram, alternatives écartées), workflow assisté par IA (exemples de corrections), sécurité, choix face aux points flous, limites et suites.
