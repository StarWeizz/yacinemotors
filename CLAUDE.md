# CLAUDE.md — Yacine Motors

Règles du projet pour Claude Code. À lire au début de chaque session.
Toute nouvelle règle donnée par l'utilisateur est ajoutée ici **et** consignée dans un ADR.

## Langues

- **Documentation en français** : README, ADR, logs de conversation, CLAUDE.md.
- **Commits en anglais** (convention Conventional Commits).
- Le code (noms de variables, fonctions, types) reste en anglais ; l'interface du site est en français.

## Contexte

Test technique (stage développeur web, LEMDINT), réalisé **volontairement avec un agent IA** :
les évaluateurs regardent comment l'agent est piloté, donc **tout doit être documenté**.

- Sujet : `sujet/sujet.pdf` — client : Yacine Motors, agence de location de véhicules à Marseille.
- Données : `sujet/vehicles.json` — 10 véhicules. **À utiliser tel quel, ne jamais le modifier.** Les images ne sont pas fournies : gérer proprement leur absence.
- Fonctionnalités : F1 page d'accueil, F2 catalogue, F3 formulaire de contact → Telegram, F4 demande de réservation par véhicule → Telegram.
- Rendu : dépôt GitHub public + `README.md` avec les sections exigées (installation, choix techniques, workflow IA, sécurité, points flous, limites).
- Aucun secret dans le dépôt ; fournir un `.env.example` sans valeurs réelles.

## Stack (le pourquoi est dans les ADR)

React + TypeScript (strict) · Next.js · Payload CMS (headless, gestion utilisateur + produits) · ESLint · Vitest (tests basiques) · Playwright (E2E) · Docker (docker compose) + nginx (reverse proxy) si nécessaire.

## Règles

### 1. Git : micro commits
- Un changement logique par commit, le plus petit possible. Ne jamais mélanger des sujets sans rapport.
- Messages **en anglais**, format Conventional Commits : `type(scope): subject`
  (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `build`, `ci`). Impératif, sujet en minuscules, sans point final.
- Claude est co-auteur de chaque commit avec le trailer :
  `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`
- Ne committer que du code qui fonctionne ; jamais de secret ni de `.env`.

### 2. Pull requests et code review
- Quand c'est utile (fonctionnalité, changement d'architecture, infra), travailler sur une branche dédiée (`feat/...`, `fix/...`, `chore/...`) et ouvrir une PR vers `main` plutôt que committer directement. Les changements triviaux (docs, typos) peuvent aller directement sur `main`.
- Titre de PR en anglais (Conventional Commits), description en français : contexte, changements, comment tester, ADR liés.
- Faire une code review (skill `/code-review`) avant de fusionner ; consigner dans le log les retours acceptés ou rejetés et pourquoi.
- Ne pas créer de PR ni pousser sans l'accord de l'utilisateur (action visible de l'extérieur).

### 3. Décisions : ADR
- Chaque décision (technique, architecture, process, produit) a un ADR dans `docs/adr/`, nommé `NNNN-titre-court.md`, basé sur `docs/adr/0000-template.md`.
- **Ne jamais supprimer ni réécrire un ADR.** Si une décision change, on crée un nouvel ADR qui remplace l'ancien ; on ne modifie dans l'ancien que la ligne `Statut` (`Remplacé par ADR-NNNN`).
- Toute règle donnée par l'utilisateur dans la conversation et absente des ADR doit y être consignée.

### 4. Log des conversations
- Conserver un log des échanges humain ↔ IA dans `docs/conversations/` (un fichier par session/sujet, `AAAA-MM-JJ-sujet.md`).
- Y noter : demandes de l'utilisateur, propositions de l'IA, ce qui a été accepté / corrigé / refusé et pourquoi, résultats. Les corrections et refus sont les plus précieux (le README doit en montrer au moins un).
- Mettre à jour le log dans un commit `docs(log)` dédié.

### 5. Qualité du code
- TypeScript en mode `strict`. **Zéro `any`** — pas de `as any`, pas de `@ts-ignore` (utiliser `unknown` + affinage de type, ou de vrais types). Imposé par ESLint (`@typescript-eslint/no-explicit-any: error`).
- Clean code : noms lisibles, petits composants/fonctions, organisation claire des fichiers.
- `npm run lint` et la vérification des types doivent passer avant chaque commit.

### 6. Tests
- Tests basiques (Vitest) à côté du code testé.
- Tests E2E avec Playwright dans un dossier dédié `e2e/` à la racine.
- Ne jamais simuler un test qui passe ; signaler honnêtement les échecs.

### 7. Docker
- Tout le projet tourne dans Docker : `Dockerfile` multi-étapes (build puis image d'exécution minimale, utilisateur non-root) et `docker-compose.yml` (app, base de données, nginx si nécessaire).
- Configuration nginx versionnée (`docker/nginx/`) : reverse proxy, en-têtes de sécurité, limitation de débit sur les routes de formulaires.
- Les secrets passent par des variables d'environnement (`.env`, ignoré par git) ; seul `.env.example` est versionné.
- Un `docker compose up` doit suffire pour lancer le site ; documenter la procédure dans le README.

### 8. Documentation
- Le `README.md` documente la stack, l'outillage (linter, tests, Docker), l'installation, les variables d'environnement et les sections exigées par le sujet. Le garder synchronisé avec les ADR.

## Points ouverts (chacun aura son ADR)
- Intégration Telegram (API Bot `sendMessage` depuis une route serveur, token jamais exposé au navigateur).
- Base de données Payload (ex. PostgreSQL en conteneur) et chargement de `vehicles.json` dans Payload sans modifier le fichier.
- Nginx : nécessaire ou non selon le déploiement (rate limiting, TLS, cache des assets).
- Anti-spam, déploiement en ligne, choix des 1 ou 2 bonus.
- Le sujet dit « sans back-office à gérer » : Payload ajoute une interface d'admin — à justifier dans l'ADR dédié.
