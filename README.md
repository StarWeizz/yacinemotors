# Yacine Motors

Site de l'agence de location de véhicules **Yacine Motors** (Marseille) — test technique LEMDINT, réalisé avec un agent IA (Claude Code).
Sujet et données : [`sujet/`](sujet/).

> **État d'avancement** : phase de cadrage terminée (règles, ADR, outillage). Le squelette actuel est encore un projet Vite ; la migration vers Next.js + Payload est la prochaine étape ([ADR-0003](docs/adr/0003-nextjs-react-typescript.md), [ADR-0004](docs/adr/0004-payload-cms-headless.md)). Les sections ci-dessous décrivent la cible et sont mises à jour au fil des commits.

## Stack

| Domaine | Choix | Décision |
|---|---|---|
| Front | React + Next.js, TypeScript strict | [ADR-0003](docs/adr/0003-nextjs-react-typescript.md) |
| CMS | Payload CMS (headless) : utilisateurs et produits | [ADR-0004](docs/adr/0004-payload-cms-headless.md) |
| Qualité | ESLint, **zéro `any`** | [ADR-0006](docs/adr/0006-qualite-typescript-strict-zero-any.md) |
| Tests | Vitest (basiques) + Playwright (E2E, dossier `e2e/`) | [ADR-0007](docs/adr/0007-strategie-de-tests-vitest-playwright.md) |
| Infra | Docker + docker compose, nginx si nécessaire | [ADR-0008](docs/adr/0008-docker-et-nginx.md) |
| Notifications | Telegram (API Bot) — à décider | à venir |

## Linter et règles de code

- ESLint avec `typescript-eslint`, `react-hooks`, `react-refresh`.
- `@typescript-eslint/no-explicit-any` et `ban-ts-comment` en **erreur** : pas de `any`, pas de `@ts-ignore`.
- `npm run lint` et la compilation TypeScript doivent passer avant chaque commit.

## Commandes

```bash
npm install
npm run lint      # ESLint
npm run build     # tsc + build
```

Commandes cibles (à venir) : `npm test` (Vitest), `npm run test:e2e` (Playwright), `docker compose up` (site complet).

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
