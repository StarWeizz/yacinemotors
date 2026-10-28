# Yacine Motors

Site de l'agence de location de véhicules **Yacine Motors** (Marseille) — test technique LEMDINT (stage développeur web), réalisé **avec un agent IA** (Claude Code) et documenté de bout en bout.

- Sujet et données fournies : [`sujet/`](sujet/) (`vehicles.json` est utilisé tel quel, jamais modifié).
- Dépôt : https://github.com/StarWeizz/yacinemotors
- Décisions : [ADR numérotés, avec index](docs/adr/README.md) · Audits : [accessibilité](docs/accessibilite.md), [sécurité](docs/securite.md) · [Licences tierces](docs/licences-tierces.md) · Journal des échanges avec l'IA : [`docs/conversations/`](docs/conversations/) · Règles données à l'IA : [`CLAUDE.md`](CLAUDE.md)

## Ce que fait le site

| | Fonctionnalité | Où |
|---|---|---|
| F1 | **Page d'accueil** : présentation de l'agence, chiffres calculés depuis le catalogue, sélection de véhicules | `/` |
| F2 | **Catalogue** : les 10 véhicules avec toutes leurs informations (prix/jour, caution, km inclus, Crit'Air, équipements, disponibilité et date de retour, conditions du conducteur), avec filtres et tri (catégorie, carburant, boîte, prix max., disponibles, tri par prix/puissance/année) | `/vehicules` |
| F3 | **Formulaire de contact** : chaque envoi arrive sur le Telegram de l'agence ; carte Google Maps centrée sur Marseille à côté du formulaire (chargée au clic, [ADR-0029](docs/adr/0029-carte-google-maps-sur-la-page-contact.md)) | `/contact` |
| F4 | **Demande de réservation** : bouton « Demander une réservation » sur chaque véhicule, formulaire dédié, envoi sur Telegram | `/vehicules/[slug]/reservation` |
| — | **Fiche véhicule** (bonus) : grande photo, description, caractéristiques, équipements, tarif avec exemples de durée, conditions, véhicules de la même catégorie | `/vehicules/[slug]` |
| — | **Pages légales** : mentions légales et politique de confidentialité (le site est une démonstration, l'agence est fictive), icône du site, `robots.txt` et `sitemap.xml` ([ADR-0033](docs/adr/0033-icone-robots-sitemap-et-pages-legales.md)) | `/mentions-legales`, `/confidentialite`, `/robots.txt`, `/sitemap.xml` |
| — | **Administration** : le gérant modifie véhicules, tarifs et informations d'agence sans développeur | `/admin` |

Bonus traités : **tests automatisés** (68 unitaires, 117 E2E, CI GitHub Actions) et **protection anti-spam** (honeypot, contrôle d'origine, limitation de débit nginx) et **filtres et tri du catalogue** ([ADR-0021](docs/adr/0021-filtres-et-tri-du-catalogue.md)) et **page détail par véhicule** ([ADR-0026](docs/adr/0026-page-detail-par-vehicule.md)). Idée personnelle : l'édition du catalogue par le client via Payload CMS, et un formulaire de réservation qui applique les conditions de chaque véhicule (voir « Choix face aux points flous »). L'**accessibilité** a fait l'objet d'un audit WCAG 2.2 AA (axe-core sur 10 pages, contrôles manuels, 36 tests en CI) : voir [`docs/accessibilite.md`](docs/accessibilite.md), qui dit aussi ce qui n'est pas couvert.

---

## Installation et lancement

Prérequis : Docker (et Node.js ≥ 24.22.1 pour le développement hors conteneur, la version exigée par Payload et utilisée par l'image et la CI).

### Démarrage rapide (Docker)

```bash
git clone https://github.com/StarWeizz/yacinemotors.git && cd yacinemotors
cp .env.example .env
# Secrets aléatoires : un même mot de passe pour POSTGRES_PASSWORD et DATABASE_URI, un nouveau PAYLOAD_SECRET
sed -i.bak "s/change-me-to-a-long-random-string/$(openssl rand -hex 32)/; s/change-me/$(openssl rand -hex 16)/g" .env && rm .env.bak
docker compose up -d --build      # PostgreSQL + application + nginx, migrations et catalogue automatiques
```

Puis ouvrir http://localhost:8080 (le site) et http://localhost:8080/admin (créer le **premier compte administrateur**, voir plus bas). Sans Windows/WSL/Git Bash, remplacer à la main les valeurs `change-me…` de `.env`. Les messages Telegram demandent en plus `TELEGRAM_BOT_TOKEN` et `TELEGRAM_CHAT_ID` (voir « Configurer le bot Telegram »).

### Variables d'environnement

Copier `.env.example` en `.env` (jamais commité — `.gitignore`) :

| Variable | Rôle | Obligatoire |
|---|---|---|
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL. **Lettres et chiffres uniquement** (il est placé dans une URL de connexion) : `openssl rand -hex 16` | oui |
| `PAYLOAD_SECRET` | Secret de Payload (sessions, jetons) : `openssl rand -hex 32` | oui |
| `POSTGRES_USER`, `POSTGRES_DB` | Utilisateur et base (défaut `yacinemotors`) | non |
| `TELEGRAM_BOT_TOKEN` | Token du bot Telegram | pour envoyer les messages |
| `TELEGRAM_CHAT_ID` | Conversation ou groupe qui reçoit les messages | pour envoyer les messages |
| `TELEGRAM_API_URL` | Remplace `https://api.telegram.org` (tests uniquement) | non |
| `AUTO_SEED` | `true` (défaut dans Docker) : charge `vehicles.json` au démarrage si aucun véhicule n'existe | non |
| `CATALOG_PATH` | Chemin du fichier chargé par l'amorce (défaut `sujet/vehicles.json`) | non |
| `HTTP_PORT` | Port d'nginx sur la machine (défaut `8080`) | non |
| `SITE_URL` | Adresse publique du site, pour les URL absolues d'aperçu de partage (défaut `http://localhost:8080` dans Docker) ; à régler sur le vrai domaine au déploiement | non |
| `DATABASE_URI`, `DB_PORT` | Développement hors Docker uniquement | non |

Sans les variables Telegram, le site fonctionne mais les formulaires répondent « n'a pas pu être envoyé » (ils ne simulent jamais un envoi).

### Configurer le bot Telegram

1. Créer un bot avec [@BotFather](https://t.me/BotFather) (`/newbot`) et copier le **token**.
2. Écrire un message au bot (ou l'ajouter à un groupe), puis ouvrir `https://api.telegram.org/bot<token>/getUpdates` et lire `message.chat.id` : c'est le **chat id**.
3. Renseigner les deux variables dans `.env`.

Brancher un autre bot (celui de l'évaluateur) = changer ces deux variables, sans toucher au code.

### Avec Docker (recommandé)

```bash
cp .env.example .env              # renseigner les variables ci-dessus
docker compose up -d --build      # PostgreSQL + application + nginx
```

Le site est sur http://localhost:8080 et l'administration sur http://localhost:8080/admin. Les migrations s'appliquent automatiquement au démarrage du serveur.

Au **premier démarrage**, le catalogue (`vehicles.json`) est chargé automatiquement si la base ne contient encore aucun véhicule ([ADR-0020](docs/adr/0020-amorce-automatique-du-catalogue-au-demarrage.md)) : `docker compose up` suffit. Ensuite **créer le compte administrateur sur `/admin` immédiatement** (voir « Sécurité »).

Une fois le catalogue du client en place, mettre `AUTO_SEED=false` dans `.env` : sinon, si tous les véhicules étaient supprimés, un redémarrage rechargerait le catalogue d'origine.

**Premier compte administrateur.** Sur http://localhost:8080/admin, tant qu'aucun utilisateur n'existe, Payload affiche « Créer le premier utilisateur » : saisir un e-mail et un mot de passe, valider, puis **se connecter** avec ce compte (la session n'est pas ouverte automatiquement). Dans l'administration, la rubrique **Agence** permet de renseigner adresse, téléphone, e-mail public et horaires : le pied de page n'affiche que ce qui est rempli. `SITE_URL` doit correspondre à l'adresse tapée dans le navigateur, sinon l'administration refuse les requêtes.

**Au quotidien.**

```bash
docker compose logs -f app        # journaux de l'application (démarrage, amorce, envois Telegram refusés)
docker compose down               # arrête la pile ; la base est conservée
docker compose down -v            # arrête ET supprime la base : repart de zéro (catalogue rechargé)
docker compose up -d --build      # reconstruit et relance après un changement de code
```

### Développement local (hors Docker)

Node.js **24** (version exigée par Payload, [ADR-0031](docs/adr/0031-node-24-pour-l-image-la-ci-et-le-developpement.md)) et Docker pour la base.

```bash
cp .env.example .env              # d'abord : le compose lit POSTGRES_PASSWORD dans ce fichier
sed -i.bak "s/change-me-to-a-long-random-string/$(openssl rand -hex 32)/; s/change-me/$(openssl rand -hex 16)/g" .env && rm .env.bak
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db   # base seule, sur 127.0.0.1:5433
npm ci
npm run migrate                   # applique les migrations (le schéma n'est jamais poussé automatiquement)
npm run seed                      # charge sujet/vehicles.json — idempotent, ne modifie pas le fichier (hors Docker, pas d'amorce automatique)
npm run dev                       # http://localhost:3000 — admin : /admin
```

Le mot de passe de `DATABASE_URI` doit être celui de `POSTGRES_PASSWORD` : la commande `sed` ci-dessus met le même aux deux endroits. Pour lancer les tests de bout en bout, installer une fois les navigateurs : `npx playwright install chromium`.

### Commandes

| Commande | Effet |
|---|---|
| `npm run lint` · `npm run typecheck` | ESLint · `tsc --noEmit` |
| `npm test` | tests unitaires (Vitest) |
| `npm run test:e2e` | tests Playwright (base migrée et seedée requise ; l'app est construite et lancée automatiquement avec un faux serveur Telegram) |
| `npm run build` · `npm start` | build de production · serveur standalone |
| `npm run migrate` · `migrate:status` · `migrate:create -- <nom>` | migrations (voir [ADR-0015](docs/adr/0015-versionnement-des-migrations-de-base-de-donnees.md)) |
| `npm run migrate:down` | annule la dernière migration |
| `npm run generate:types` · `npm run generate:importmap` | régénère `src/payload-types.ts` · la table des composants de l'administration |
| `npm run adr:index` | régénère l'index des décisions `docs/adr/README.md` |
| `npx playwright install chromium` | une fois, avant le premier `npm run test:e2e` |

### En cas de problème

| Symptôme | Cause probable et remède |
|---|---|
| `required variable POSTGRES_PASSWORD is missing` | `.env` absent : `cp .env.example .env` avant toute commande `docker compose` |
| `password authentication failed` (migrate, seed, dev) | `DATABASE_URI` et `POSTGRES_PASSWORD` n'ont pas le même mot de passe (voir la commande `sed`) |
| Rien ne répond sur http://localhost:8080 | Port occupé ou autre : changer `HTTP_PORT` **et** `SITE_URL`, puis `docker compose up -d` ; l'application seule écoute sur le 3000 en développement |
| L'administration refuse la connexion ou renvoie des erreurs | `SITE_URL` ne correspond pas à l'adresse tapée dans le navigateur |
| Le formulaire répond « n'a pas pu être envoyé » | `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` absents ou faux : `docker compose logs app` affiche la ligne `[telegram]` avec le code de Telegram (jamais le token) |
| Erreur 429 sur un formulaire ou en rechargeant vite | Limite de débit nginx (anti-spam) : attendre une minute |
| Avertissement `EBADENGINE` à `npm ci` | Node trop ancien : installer Node 24 |
| `npm run test:e2e` : navigateur introuvable | `npm run adr:index` | régénère l'index des décisions `docs/adr/README.md` |
| `npx playwright install chromium` |

---

## Choix techniques et architecture

### Stack

| Domaine | Choix | Pourquoi (ADR) |
|---|---|---|
| Front | **React + Next.js**, TypeScript strict | Robuste, moderne, rapide ; page rendue côté serveur donc utilisable **sans JavaScript** côté visiteur ; branchable à toute API ([ADR-0003](docs/adr/0003-nextjs-react-typescript.md)) |
| CMS | **Payload CMS** (headless, dans le même projet Next.js) | Le gérant modifie lui-même son site ; modèle « utilisateurs + produits » ; types TypeScript générés ([ADR-0004](docs/adr/0004-payload-cms-headless.md)) |
| Base | **PostgreSQL** | Standard, relationnel ; proche de **Supabase** (hébergé, open source et économique) : passer à une base managée = changer `DATABASE_URI` ([ADR-0009](docs/adr/0009-postgresql-pour-payload.md), [ADR-0010](docs/adr/0010-postgresql-confirme-et-proximite-supabase.md)) |
| Telegram | API Bot `sendMessage`, appelée côté serveur | Token jamais exposé au navigateur ([ADR-0018](docs/adr/0018-integration-telegram-bot-api-cote-serveur.md)) |
| Animations | **GSAP** | Titre du hero, révélation des cartes au scroll, curseur discret ; amélioration progressive, `prefers-reduced-motion` respecté, pas de smooth scroll ([ADR-0014](docs/adr/0014-gsap-pour-la-presentation-des-vehicules.md)) |
| Style | **Tailwind CSS v4** | Jetons de design dans `@theme`, utilitaires dans le JSX ([ADR-0023](docs/adr/0023-tailwind-css-pour-la-mise-en-forme.md)) |
| Direction artistique | Blanc, gris perle, acier, anthracite ; Newsreader + Inter (hébergées dans le dépôt, [ADR-0032](docs/adr/0032-polices-hebergees-dans-le-depot.md)) ; règle « zéro AI slop » | [ADR-0022](docs/adr/0022-direction-artistique-et-regle-zero-ai-slop.md), police et photos : [ADR-0024](docs/adr/0024-police-lisible-photos-libres-et-pied-de-page.md), hero et navigation : [ADR-0025](docs/adr/0025-hero-plein-ecran-et-barre-de-navigation.md) |
| Accessibilité | **axe-core** dans la suite E2E + contrôles manuels, cible WCAG 2.2 AA | Défauts corrigés et gardés par des tests ; rapport et limites dans [`docs/accessibilite.md`](docs/accessibilite.md), [ADR-0027](docs/adr/0027-audit-d-accessibilite-et-tests-axe.md) |
| Qualité | ESLint, TypeScript `strict`, **zéro `any`** | Règle imposée par ESLint ([ADR-0006](docs/adr/0006-qualite-typescript-strict-zero-any.md)) |
| Tests | Vitest + Playwright (`e2e/`) | [ADR-0007](docs/adr/0007-strategie-de-tests-vitest-playwright.md) |
| Infra | Docker Compose : `db` + `app` + `nginx` | [ADR-0008](docs/adr/0008-docker-et-nginx.md), [0011](docs/adr/0011-architecture-docker-compose-et-nginx.md), [0012](docs/adr/0012-correctifs-de-la-code-review-docker-nginx.md) |
| CI | GitHub Actions | [ADR-0016](docs/adr/0016-integration-continue-github-actions.md) |

> **Écart assumé avec le sujet** : le client ne veut « pas de back-office à gérer ». Payload ajoute une interface d'administration. Elle sert uniquement à **éditer le catalogue** ; les *demandes* des clients, elles, n'arrivent que sur Telegram et ne sont stockées nulle part, donc il n'y a rien à « gérer » côté demandes. C'est un choix du candidat, justifié dans l'[ADR-0004](docs/adr/0004-payload-cms-headless.md).

### Organisation du code

```
src/
  app/(frontend)/        pages du site (accueil, catalogue, contact, réservation) et routes API des formulaires
  app/(payload)/         administration et API REST de Payload
  app/fonts/             polices hébergées (Newsreader, Inter) et leurs licences
  proxy.ts               politique de sécurité de contenu (CSP) à nonce par requête
  collections/           Vehicles, Users          globals/  Agency
  components/            cartes véhicule, en-tête/pied, animation GSAP, formulaires (components/forms)
  lib/vehicles/          lecture de vehicles.json (validée), requêtes Payload, présentation (conditions, disponibilité)
  lib/forms/             validation serveur, lecture sécurisée de la requête, réponses JSON ou redirection
  lib/telegram/          client sendMessage et mise en forme des messages
  migrations/            migrations de base versionnées
scripts/seed.ts          import idempotent de sujet/vehicles.json
e2e/                     tests Playwright + faux serveur Telegram
docker/nginx/            configuration nginx
public/images/           photos des véhicules et du hero (crédits sur /credits-photos)
docs/adr/                décisions (index dans docs/adr/README.md)
docs/conversations/      journal des échanges avec l'IA
docs/securite.md, docs/accessibilite.md    audits
```

Principes : composants serveur par défaut (seuls les formulaires et l'animation sont des composants clients) ; la logique métier est en fonctions pures testées (`lib/`) ; pas de `any`, les données externes (JSON, réponse Telegram, formulaires) sont validées à l'exécution.

### Données

`sujet/vehicles.json` est la **source de départ** ; il n'est jamais modifié. Le script `npm run seed` (ou l'amorce automatique de Docker, [ADR-0020](docs/adr/0020-amorce-automatique-du-catalogue-au-demarrage.md)) le valide à l'exécution puis crée ou met à jour (par `slug`) la collection `vehicles` et le global `agency` de Payload ([ADR-0013](docs/adr/0013-modele-vehicules-et-import-depuis-le-json.md)). Tous les champs sont conservés, y compris ceux qui ne concernent que certains véhicules : `age_minimum`, `permis_minimum_annees` et `indisponible_jusqu_au` sont des **conditions de location** affichées au client. Une fois chargé, c'est Payload qui fait foi : le gérant modifie le catalogue dans `/admin`.

Les pages lisant le catalogue sont rendues **à chaque requête** : le gérant voit ses changements immédiatement et le build n'a pas besoin de base de données ([ADR-0017](docs/adr/0017-interface-catalogue-rendu-serveur-et-css-simple.md)).

### Fonctionnement de l'envoi vers Telegram

```
Navigateur ──POST──▶ nginx ──▶ route /api/contact ou /api/reservation (Next.js)
                              1. contrôle d'origine, taille, honeypot
                              2. validation côté serveur (+ relecture du véhicule en base pour la réservation)
                              3. message HTML échappé, tronqué à 4096 caractères
                              4. POST https://api.telegram.org/bot<token>/sendMessage
◀── JSON (avec JS) ou redirection 303 (sans JS)
```

- Documentation officielle utilisée : méthode `sendMessage` (`chat_id` et `text` obligatoires, texte de 1 à 4096 caractères) ; en `parse_mode: HTML`, `<`, `>` et `&` doivent être remplacés par des entités.
- Le **token reste sur le serveur** (variables d'environnement) et n'est jamais journalisé (testé).
- Les formulaires sont de vrais `<form method="post">` : ils **fonctionnent sans JavaScript** (le serveur répond par une redirection avec un message). Un composant client les améliore : envoi en `fetch`, saisie conservée, erreurs champ par champ ([ADR-0019](docs/adr/0019-formulaires-validation-anti-spam-amelioration-progressive.md)).
- Réservation : le véhicule est relu en base à partir de son `slug`. Prix, disponibilité et conditions viennent de la base, jamais du formulaire. Le message contient une **estimation indicative** (jours × prix/jour, km inclus, caution).
- Les tests n'appellent jamais la vraie API Telegram : Playwright lance un faux serveur (`e2e/support/telegram-mock.mjs`) via `TELEGRAM_API_URL`.

### Alternatives envisagées et écartées

| Sujet | Écarté | Raison |
|---|---|---|
| Front | React + Vite (SPA) — c'était le squelette de départ | Pas de rendu serveur, pas d'endroit pour cacher le token Telegram, SEO moins bon |
| Données | Lire `vehicles.json` directement | Le client ne pourrait rien modifier sans développeur |
| CMS | Strapi, Directus, Sanity | Payload s'installe dans le même projet Next.js, en TypeScript |
| Base | SQLite, MongoDB | SQLite : pas de chemin vers une base managée ; MongoDB : données relationnelles |
| Telegram | Appel depuis le navigateur ; webhook ; e-mail ; n8n/Zapier ; grammY/telegraf | Token exposé ; un webhook sert à *recevoir* ; dépendance inutile pour un seul appel HTTP |
| Formulaires | Server Actions ; reCAPTCHA/Turnstile ; modale | Server Actions : URL non ciblables par nginx ; captcha : dépendance et données personnelles (à reconsidérer si du spam apparaît) ; page dédiée plus accessible |
| Rendu | Pages statiques + revalidation | Exige une base au build et une invalidation depuis Payload |
| Style | CSS global écrit à la main, CSS-in-JS | Le CSS à la main était le choix initial (ADR-0017) ; remplacé par Tailwind à la demande du candidat ([ADR-0023](docs/adr/0023-tailwind-css-pour-la-mise-en-forme.md)). CSS-in-JS : exécution côté client en plus |

---

## Workflow de développement assisté par IA

### Outils et tâches

**Claude Code** (CLI) a été utilisé pour l'ensemble du projet : analyse du sujet, rédaction du code, des tests, de la configuration Docker/nginx/CI et de la documentation, ainsi que pour une **revue de code** (`/code-review`) sur la branche d'infrastructure. Le candidat décide, l'agent exécute puis rend compte.

### Comment l'IA a été cadrée

- **`CLAUDE.md`** : règles de projet lues à chaque session — micro commits en anglais (Conventional Commits, Claude co-auteur), documentation en français, ADR jamais supprimés, journal des conversations, zéro `any`, tests, Docker, migrations versionnées, PR + code review + **CI verte avant fusion**.
- **Un ADR par décision** ([`docs/adr/`](docs/adr/)) : l'IA doit consigner le pourquoi, les alternatives et les conséquences. Quand une décision évolue, un nouvel ADR la complète ou la remplace (les ADR 0010 et 0012 précisent les ADR 0009 et 0011 sans les réécrire).
- **Découpage** : une branche et une PR par grand sujet (socle, véhicules, accueil + catalogue, formulaires Telegram, README), micro commits à l'intérieur, vérification (lint, types, tests, build, Docker) avant chaque commit significatif.
- **Journal des échanges** : [`docs/conversations/2026-10-23-cadrage-initial.md`](docs/conversations/2026-10-23-cadrage-initial.md) — demandes, propositions, corrections, erreurs.
- **Garde-fous automatiques** : ESLint (zéro `any`, pas de `@ts-ignore`), tests, CI sur chaque PR.

### Exemples où l'IA a été corrigée, refusée ou réorientée

1. **Langue** — l'IA a rédigé le premier `CLAUDE.md` en anglais. Le candidat a interrompu : « En français stp. Sauf les commits ». Le fichier a été réécrit et la règle de langue ajoutée au `CLAUDE.md` et à l'[ADR-0001](docs/adr/0001-enregistrer-les-decisions-d-architecture.md).
2. **Périmètre ajouté en cours de route par le candidat** — PR et code review « si utiles », Docker + nginx, versionnement des migrations « comme Supabase ou Laravel », CI GitHub, GSAP pour la présentation des véhicules. Chaque demande est devenue une règle dans `CLAUDE.md` et/ou un ADR (0002, 0008, 0014, 0015, 0016), puis la refonte visuelle (règle « zéro AI slop », ADR-0022) et Tailwind (ADR-0023).
3. **La revue de code a invalidé une configuration de l'IA** — la limitation de débit nginx proposée par l'IA (1 requête/s sur `/api/`) était trop stricte : elle bloquait l'administration (constaté en test : 429 dès les premières requêtes). La revue a aussi relevé 8 autres défauts : en-têtes de sécurité perdus sur les fichiers statiques, nginx qui garde l'ancienne IP de l'app, migrations lancées à la première requête (la doc disait « au démarrage »), variables d'environnement remplacées par une chaîne vide, etc. Les 9 points ont été traités, vérifiés dans Docker et consignés ([ADR-0012](docs/adr/0012-correctifs-de-la-code-review-docker-nginx.md)).
4. **L'IA a corrigé ses propres erreurs** — un script de seed qui n'insérait rien sans erreur (le lanceur quitte avant la fin d'une promesse non attendue) ; `next start` incompatible avec `output: standalone` (les tests passaient mais sans garantie que CSS/JS soient servis) ; un contrôle d'origine qui aurait échoué derrière nginx car `Host` perd le port ; des tests E2E faussement rouges à cause d'un ancien serveur resté sur le port 3000 (vérifié que le processus était bien celui du projet avant de l'arrêter).
5. **Rigueur sur les sources** — pour Telegram, l'outil de lecture web n'a lu que le début d'une page de 580 000 caractères ; plutôt que de deviner, l'IA a téléchargé la page et extrait elle-même les sections `sendMessage`, le mode HTML et `ResponseParameters`.
6. **Ne pas inventer** — le sujet ne donne ni adresse, ni téléphone, ni horaires de l'agence : le pied de page n'affiche que les coordonnées saisies dans `/admin` (champs facultatifs du global « Agence ») et n'en invente aucune. L'accueil n'utilise que des chiffres calculés à partir du catalogue.

### Ce que le candidat a décidé et vérifié

- Décisions d'architecture : Next.js + Payload CMS (choix hors sujet, pour que le client édite son site), PostgreSQL avec la perspective Supabase, Docker + nginx, GSAP, versionnement des migrations, CI.
- Pilotage : validation de chaque étape avant de passer à la suivante, **fusion des PR uniquement après CI verte**.
- Vérifications automatiques : 68 tests unitaires, 117 E2E (stables sur 3 répétitions), lint, types, build Docker, migrations sur base vide, contrôles réseau derrière nginx (origine, limitation de débit).

> **Supervision et vérifications du candidat** : le candidat a supervisé le travail de l'agent du début à la fin, vérifié le résultat et l'a testé à la main sur l'application lancée : **les demandes de réservation, la page contact et le back-office `/admin`** (ainsi que le reste du site) ; tout a fonctionné correctement. Il a aussi fait un **envoi réel avec son propre bot Telegram** : les messages du formulaire de contact et des demandes de réservation arrivent bien dans sa conversation avec le bot. Cela complète les tests automatiques de l'agent, qui n'ont jamais pu appeler la vraie API Telegram (aucun token dans son environnement) et passent par un faux serveur.

---

## Sécurité

| Risque | Traitement |
|---|---|
| **Fuite du token Telegram** | Appel uniquement côté serveur ; token en variable d'environnement, jamais envoyé au navigateur ni journalisé (test unitaire) ; `.env` ignoré par git, seul `.env.example` (sans valeur) est versionné |
| **Injection dans les messages Telegram** (HTML) | Tout texte saisi est échappé (`<`, `>`, `&`) avant l'envoi en mode HTML, message tronqué sous 4096 caractères (tests unitaires et E2E avec un `<script>`) |
| **Spam des formulaires** | Champ piège invisible (succès simulé sans envoi), limitation de débit nginx par IP (très stricte sur `/api/contact` et `/api/reservation`), taille de corps limitée, validation stricte |
| **CSRF** | Contrôle de l'en-tête `Origin` (ou `Sec-Fetch-Site`) sur les POST ; nginx transmet `X-Forwarded-Host` pour que la vérification fonctionne derrière le proxy |
| **Manipulation du prix ou des conditions** | Le véhicule est relu en base ; prix, disponibilité, âge et permis minimum ne viennent jamais du formulaire (testé) |
| **XSS** | React échappe les valeurs ; aucune injection de HTML brut ; **Content Security Policy** stricte avec nonce par requête (pas de `unsafe-inline` pour les scripts), testée en E2E ([ADR-0028](docs/adr/0028-audit-de-securite-et-durcissement.md)) |
| **Contenu tiers (carte Google)** | La carte n'est chargée qu'après un clic (sinon l'adresse IP du visiteur partirait chez Google dès l'ouverture de la page) ; `frame-src` de la CSP n'autorise Google que sur `/contact`, `'none'` partout ailleurs |
| **Usurpation de contenu** (`?erreur=…`) | Les messages affichés après un envoi sans JavaScript sont **signés** (HMAC) : un texte forgé dans l'URL n'est jamais affiché |
| **Dépôt public** | Aucun secret versionné ; valeurs de CI factices |
| **Conteneurs** | Image multi-étapes, utilisateur non-root, `no-new-privileges`, capacités Linux retirées, système de fichiers de l'app en lecture seule, base **non publiée** sur l'hôte (sauf opt-in explicite pour le développement) |
| **Force brute sur l'admin** | Verrouillage de compte après 5 échecs (10 minutes) ; limite nginx dédiée à la connexion (10 requêtes par minute, vérifiée : 429 dès la 6e) |
| **Session de l'admin** | Cookie `HttpOnly` et `SameSite=Strict` (`Secure` en HTTPS), jeton absent des réponses JSON, requêtes authentifiées acceptées seulement depuis `SITE_URL` |
| **Surface de l'API** | Pas de GraphQL (aucune route, et désactivé en configuration par précaution) ; écritures et liste des utilisateurs refusées aux anonymes (403, testé) ; corps limités à 32 Ko sur les formulaires |
| **Dépendances** | `npm audit` bloquant en CI sur les alertes critiques, Dependabot ; alertes restantes : voir « Limites » |
| **En-têtes HTTP** | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, CSP ; versions de nginx et de Next.js masquées |

L'audit complet (méthode, constats corrigés, sondes sur la pile Docker, **risques restants** et ce qu'il ne couvre pas) est dans [`docs/securite.md`](docs/securite.md). Ce n'est pas un test d'intrusion.

**À faire avant une mise en ligne** (non automatisé) :

- **Créer immédiatement le compte administrateur.** Tant qu'aucun utilisateur n'existe, Payload propose à n'importe quel visiteur de `/admin` de créer le premier compte. Le déploiement doit donc être suivi sans délai de la création de l'admin (ou `/admin` restreint par IP / authentification nginx le temps de l'initialisation).
- Servir en **HTTPS** (TLS n'est pas géré en local), régler `SITE_URL` sur l'adresse `https://`, activer HSTS (ligne prête, commentée, dans `docker/nginx/security_headers`) et `upgrade-insecure-requests` dans la CSP.
- Restreindre `/admin` (IP, VPN) si possible, et transmettre l'IP réelle à nginx derrière un proxy ou un CDN.
- Choisir un `PAYLOAD_SECRET` et un mot de passe de base uniques, et ne jamais réutiliser ceux de développement.

---

## Choix face aux points flous

| Point flou du sujet | Décision |
|---|---|
| Images « non fournies » | Le serveur vérifie que le fichier existe ; sinon un visuel de remplacement (marque, modèle) s'affiche. Aucune image cassée. Les 10 véhicules ont une photo libre de droits (Wikimedia Commons, CC BY-SA 4.0) du même modèle, nommée comme le chemin du JSON : le JSON reste intact. Auteurs et licences sur `/credits-photos` ([ADR-0024](docs/adr/0024-police-lisible-photos-libres-et-pied-de-page.md)). Ce ne sont pas les véhicules de l'agence |
| Pas de back-office voulu / Payload | Payload sert uniquement à éditer le catalogue ; les demandes ne sont ni stockées ni gérées (Telegram uniquement) |
| Informations « qui ont un sens pour le client » | Tout le JSON est exploité : caution, km inclus, Crit'Air, équipements, et surtout les conditions (**âge minimum, années de permis**) et la **date de fin d'indisponibilité** |
| Véhicule indisponible | Affiché avec sa date de retour ; on peut demander une réservation **à partir de** cette date, pas avant. Sans date de retour, la demande est refusée et le bouton masqué |
| Conditions du conducteur | Le formulaire demande l'âge et les années de permis et refuse la demande qui ne respecte pas les conditions du véhicule, avec un message explicite |
| Durée de location | Nombre de jours = date de retour − date de départ (minimum 1), maximum 90 jours. **Hypothèse à confirmer avec le client.** L'estimation est marquée « indicative » |
| Réservation = demande, pas confirmation | Le texte l'indique ; aucun paiement, aucune réservation ferme |
| Champs obligatoires | Contact : nom, e-mail, message (téléphone facultatif). Réservation : en plus, téléphone obligatoire (le gérant rappelle) |
| Fuseau horaire | `Europe/Paris` pour « aujourd'hui » |
| Langue | Site en français ; code et commits en anglais ; documentation en français |
| Informations d'agence absentes | Aucune adresse, téléphone ni horaire inventés |
| Que faire si Telegram échoue | Le visiteur est averti et invité à réessayer dans quelques minutes ; jamais de faux succès |
| Bonus choisis | Tests automatisés, anti-spam, filtres et tri du catalogue, page détail par véhicule, plus l'idée personnelle (édition du catalogue par le client). Le déploiement en ligne n'a pas été réalisé |

---

## Limites et suites

**Limites connues**

- **Aucune demande n'est stockée** : si Telegram est indisponible au moment de l'envoi, la demande est perdue (le visiteur en est averti).
- **Anti-spam de niveau modéré** : un robot qui ignore le honeypot et reste sous la limite nginx peut passer. À renforcer (captcha respectueux de la vie privée) si du spam apparaît.
- **Telegram : testé en réel par le candidat seulement** (un bot, une conversation privée, envois de contact et de réservation reçus). Les tests automatiques de l'agent n'appellent jamais la vraie API : tests unitaires et faux serveur conforme à la documentation. Pas de test de charge ni de cas d'échec réel (token révoqué, Telegram indisponible) en conditions réelles.
- **Vulnérabilités de dépendances** : `npm audit --omit=dev` signale 8 alertes (3 élevées, 5 modérées) après correction de la critique (`dompurify`, forcé à la version corrigée par un `override`). Elles sont **transitives via Payload** : l'éditeur riche Lexical (`happy-dom`, côté administration) et des outils de développement (`esbuild`, `drizzle-kit`). Elles ne concernent pas les pages publiques ; la correction passe par une mise à jour de Payload.
- **Pas de HTTPS ni de HSTS** : TLS n'est pas géré localement (la CSP, elle, est en place, [ADR-0028](docs/adr/0028-audit-de-securite-et-durcissement.md)).
- **La CI ne lance pas l'image Docker** : elle la construit, et exécute lint, types, tests unitaires, migrations et E2E sur la machine de la CI ; un écart entre cette machine et le conteneur reste possible (vérifié à la main pour Node 24, [ADR-0031](docs/adr/0031-node-24-pour-l-image-la-ci-et-le-developpement.md)).
- **Migrations concurrentes** : avec plusieurs instances démarrant en même temps, les migrations pourraient s'exécuter simultanément (une seule instance aujourd'hui).
- **Accessibilité : auditée par outil, pas par des personnes** : 10 défauts corrigés et testés en CI ([`docs/accessibilite.md`](docs/accessibilite.md)), mais aucun test avec un lecteur d'écran ni avec de vrais utilisateurs, un seul navigateur automatisé, `/admin` (Payload) non audité. Les outils automatiques ne détectent qu'une partie des problèmes : aucune conformité n'est revendiquée.
- **Amorce automatique** : tant que `AUTO_SEED=true`, une collection vidée puis un redémarrage rechargent le catalogue d'origine ; deux instances démarrant en même temps pourraient l'exécuter deux fois (sans doublon, le seed est idempotent).
- **Pas de déploiement en ligne** ; images réelles à ajouter ; le premier compte administrateur doit être créé à la main.

**Suites possibles**

1. Déploiement (par exemple application conteneurisée + Supabase pour la base, ADR dédié), HTTPS et HSTS.
2. Remplacer les photos libres de Commons par celles de l'agence et renseigner ses coordonnées dans `/admin` (le pied de page s'adapte).
3. Stocker les demandes (table Payload) pour ne rien perdre et permettre un suivi — en discuter avec le client, car cela réintroduit un back-office.
4. Gérer les photos via la médiathèque Payload plutôt que par des fichiers dans `public/`.
5. Tests d'accessibilité avec un lecteur d'écran et de vrais utilisateurs ; renforcement anti-spam (captcha respectueux de la vie privée).
6. Mise en cache des pages catalogue avec invalidation depuis Payload.
