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

## 6. Migration vers Next.js + Payload (même jour)

Demande : « Oui, migre vers Next.js et Payload ».

- Branche `feat/migrate-nextjs-payload`, changement d'architecture donc candidat à une PR.
- Décision prise par l'IA et consignée : PostgreSQL pour Payload (ADR-0009, à confirmer par l'utilisateur ; SQLite en repli).
- Suppression du squelette Vite, installation de Next 16 et Payload 3.92, routes admin/API, collection `users`, page d'accueil minimale.
- Problèmes rencontrés :
  - le port 5432 de la machine était déjà occupé → base de test sur 5433 ;
  - Payload génère `importMap.js`, ce qui cassait la compilation stricte (`implicit any`) → ajout d'un `importMap.d.ts` typé plutôt qu'un `any` ou un `@ts-ignore`, conformément à la règle zéro `any`.
- Vérifié : `tsc`, `eslint`, `next build` OK ; en exécution : accueil 200, `/admin` 200, `/api/users` 403 sans authentification (attendu).

## 7. Confirmation PostgreSQL et setup Docker

- Utilisateur : PostgreSQL confirmé, à présenter comme proche de **Supabase** (hébergé, open source, économique). Comme un ADR ne se réécrit pas, l'IA a créé l'ADR-0010 au lieu de modifier l'ADR-0009.
- Docker : ADR-0011 (db + app + nginx). nginx retenu pour le rate limiting des formulaires et les en-têtes de sécurité.
- Migrations : Payload ne synchronise pas le schéma en production → migration initiale générée et exécutée au démarrage (`prodMigrations`).
- Correction de l'IA sur son propre travail : ESLint a échoué sur le fichier de migration généré (variables inutilisées) après un premier commit ; le dossier généré a été exclu du lint dans un commit dédié, sans toucher à la règle zéro `any` pour le code écrit à la main.
- Vérifié : `docker compose up` → db healthy, migration appliquée, accueil 200, admin 200, en-têtes nginx présents, 429 après 6 requêtes rapides sur `/api/`.

## 8. Code review de la branche et correctifs

Demande : « Ouvre la PR et lance la code review », puis « installe GH et corrige les corrections ».

- `gh` absent et pas de sudo sans mot de passe → binaire installé dans `~/.local/bin` (sans droits root). Connexion à faire par l'utilisateur.
- `/code-review high` a relevé 9 points ; l'IA les a tous acceptés après les avoir présentés à l'utilisateur :

| # | Remarque | Suite |
|---|---|---|
| 1 | Rate limit `/api/` trop strict pour l'admin Payload (constaté : 429 dès 6 requêtes) | Corrigé : zones générales larges, zone stricte réservée aux formulaires |
| 2 | Statiques sans en-têtes de sécurité (`add_header` non hérité) | Corrigé : fichier d'en-têtes inclus partout |
| 3 | nginx garde l'ancienne IP de `app` | Corrigé : resolver Docker + variable |
| 4 | Migrations lancées à la 1ʳᵉ requête, pas au démarrage (doc inexacte) | Corrigé : `instrumentation.ts` |
| 5 | Variables d'env remplacées par `''` | Corrigé : échec explicite |
| 6 | Mot de passe non encodé dans l'URL | Contrainte documentée (lettres/chiffres) |
| 7 | `.env.example` incomplet (`DB_PORT`) | Corrigé |
| 8 | `push` en dev contourne les migrations | Corrigé : `push: false`, scripts `migrate` |
| 9 | `override.yml` chargé automatiquement en prod | Corrigé : `docker-compose.dev.yml` opt-in |

- Vérifié après correction (Docker) : migration visible dans les logs sans aucune requête, 30 appels `/api/` sans 429, 429 sur la route de formulaire après la rafale, 200 après recréation du conteneur `app` sans toucher à nginx, base non publiée.
- Les remarques 1 à 5 étaient les plus importantes ; l'ADR-0012 les consigne sans modifier l'ADR-0011.
- Limite connue : plusieurs réplicas pourraient lancer les migrations en concurrence (noté dans l'ADR-0012).

## 9. PR fusionnée, collection véhicules, migrations, CI

- PR #1 fusionnée (merge commit, pour conserver les micro-commits). `gh` connecté par l'utilisateur.
- **Analyse des données** : trois champs optionnels (`age_minimum`, `permis_minimum_annees`, `indisponible_jusqu_au`) sont des conditions de location utiles au client → conservés dans le modèle (ADR-0013).
- **GSAP** (demande de l'utilisateur en cours de travail) : ADR-0014, intégré plus tard avec l'UI du catalogue, en amélioration progressive et avec `prefers-reduced-motion`.
- **Migrations versionnées** (demande de l'utilisateur) : elles l'étaient déjà dans git ; la politique est maintenant formalisée (ADR-0015, CLAUDE.md, scripts `migrate:status` / `migrate:down`).
- **CI GitHub Actions** (demande de l'utilisateur) : ADR-0016.
- **Erreurs de l'IA corrigées en route** :
  - le script de seed s'exécutait sans rien insérer : `payload run` quitte dès que le module est évalué → remplacement du `.then()` par un top-level await ;
  - `public/` n'existait plus dans le dépôt (dossier vide non suivi par git) et cassait le build Docker → `.gitkeep`.
- **Incident machine** : disque plein pendant les builds (cache Docker de 7,7 Go) ; seul le cache de build a été purgé, volumes et images conservés.
- Vérifié : 10 véhicules insérés puis mis à jour sans doublon (seed idempotent), champs optionnels corrects en base, `vehicles.json` non modifié, migrations appliquées sur base vierge dans Docker.
- Non vérifié : le workflow CI n'a pas encore tourné (première exécution sur GitHub).

## 10. PR #2 fusionnée, F1 et F2

- Demande : « Fusionne la PR et passe à F1 et F2 ». Règle de CLAUDE.md respectée : la fusion n'a eu lieu qu'une fois la CI entièrement verte (les trois jobs, dont le build Docker de ~6 min).
- `AGENTS.md` (généré par Next) impose de lire la doc embarquée avant de coder. Lecture du chapitre sur le cache : le mode *Cache Components* n'est pas activé.
- **Décision de l'IA, argumentée dans l'ADR-0017** : pages en `force-dynamic` parce que le build (Docker, CI) n'a pas de base de données et que le gérant doit voir ses modifications tout de suite. Vérifié : `next build` passe avec une base inexistante.
- Images absentes : le serveur vérifie l'existence du fichier (avec contrôle de chemin) et affiche sinon un visuel de remplacement ; aucune image cassée (testé en E2E).
- Contenu du site : l'IA n'a **inventé aucune information** sur l'agence (pas d'adresse, de téléphone ni d'horaires, absents des données) ; l'accueil n'affiche que des chiffres calculés à partir du catalogue.
- GSAP : isolé dans `Reveal` (composant client), contenu visible sans JavaScript, désactivé avec `prefers-reduced-motion`. Les tests E2E vérifient les deux cas.
- Erreurs de l'IA corrigées en route :
  - des espaces insécables littéraux dans un test ont fait échouer ESLint (`no-irregular-whitespace`) → échappements `\u00a0` ;
  - `pkill -f "next dev"` a tué son propre shell (la commande contenait ce motif) → motif entre crochets ;
  - `next start` est incompatible avec `output: standalone` : les tests passaient, mais sans garantie que le CSS/JS soit servi → le script `start` copie `public` et `.next/static` puis lance `server.js` ; vérifié (CSS et JS en 200).
- Vérifié : 15 tests unitaires, 9 tests E2E, lint, types, build sans base.
- Non fait volontairement : filtres/tri, page détail, boutons de réservation (F4), formulaire de contact (F3).

## 11. PR #3 fusionnée, F3 et F4 (Telegram)

- Demande : « Fusionne la PR et passe à F3 et F4 ». CI verte sur les 4 jobs (dont E2E, 11 min) avant la fusion.
- **Documentation officielle lue** (le sujet le demande) : `sendMessage`, texte de 1 à 4096 caractères, `parse_mode: HTML` avec échappement obligatoire de `<`, `>`, `&`, `retry_after` en cas de limitation. Le premier essai avec l'outil de lecture web n'a lu que le début de la page (580 000 caractères) ; l'IA a donc téléchargé la page et extrait elle-même les sections voulues plutôt que de deviner.
- **Décisions** : ADR-0018 (Telegram côté serveur) et ADR-0019 (formulaires natifs fonctionnant sans JavaScript, validation serveur, honeypot, contrôle d'origine).
- **Point flou tranché, à confirmer avec le client** : le nombre de jours = date de retour − date de départ (minimum 1). L'estimation est marquée « indicative » dans le message.
- **Initiative de l'IA liée au sujet** (« toutes ses informations ont un sens pour le client ») : le formulaire de réservation demande l'âge et les années de permis et refuse la demande si elles ne respectent pas les conditions du véhicule ; une date de départ avant la fin d'indisponibilité est refusée. Prix, conditions et disponibilité sont relus en base : un prix envoyé par le client est ignoré (testé).
- **Bug évité grâce à la réflexion sur nginx** : `proxy_set_header Host $host` supprime le port, ce qui aurait fait échouer le contrôle d'origine derrière nginx (`localhost:8080` ≠ `localhost`). Ajout de `X-Forwarded-Host $http_host`.
- **Erreurs de l'IA corrigées en route** :
  - une regex de caractères de contrôle refusée par ESLint (`no-control-regex`) → filtre sur les codes de caractère ;
  - 12 tests E2E en échec : un ancien serveur de test occupait encore le port 3000 et Playwright l'avait réutilisé (build sans les nouvelles pages). Vérifié que le processus appartenait bien au projet avant de l'arrêter ;
  - deux tests mal écrits (un e-mail invalide arrêté par la validation native du navigateur ; un message de « trop court » qui faisait exactement 10 caractères) → données corrigées, pas le code ;
  - un test ambigu (texte présent aussi dans le résumé du véhicule) → recherche limitée à la région du formulaire. Vérifié stable avec 3 répétitions (69 tests).
- Vérifié : 39 tests unitaires, 23 tests E2E (×3 stables), lint, types.
- Limites assumées : aucune demande n'est stockée (si Telegram échoue, elle est perdue) ; un robot qui ignore le honeypot et reste sous la limite nginx peut passer.

## 12. PR #4 fusionnée, README complet

- Demande : « Fusionne la PR et passe au README complet ». CI verte sur les 4 jobs avant la fusion.
- **Audit de sécurité avant d'écrire la section Sécurité** (plutôt que d'affirmer de mémoire) :
  - `npm audit --omit=dev` : 10 alertes dont 1 **critique** (`dompurify`, dans l'éditeur de code de l'admin Payload). `npm audit fix` sans effet ; un `override` sur `dompurify` (version corrigée) l'a supprimée ; lint, types, 39 tests unitaires et 23 E2E toujours verts. Il reste 8 alertes (3 élevées, 5 modérées), toutes transitives via Payload (Lexical/`happy-dom`, `esbuild`, `drizzle-kit`), sans correctif compatible : documentées dans « Limites ».
  - Vérifié dans le code de Payload : verrouillage après 5 échecs de connexion pendant 10 minutes (réglage par défaut) ; vue « créer le premier utilisateur » ouverte à tout visiteur tant qu'aucun compte n'existe → **risque documenté** et consigne de créer l'admin immédiatement.
- Fausse alerte de ma part : une série de tests E2E en échec venait d'une base recréée vide après un `docker compose down -v`, pas de l'override ; migration + seed puis 23/23.
- **Honnêteté du README** : la section « ce que le candidat a vérifié » ne contient que des faits tirés de ce journal ; ce que seul le candidat sait (relecture ligne à ligne, tests manuels, envoi avec un vrai bot) est laissé en encadré **« À compléter »** plutôt qu'inventé.
- **Constat à traiter** : avec `docker compose up`, le catalogue est vide tant que le seed n'a pas été lancé depuis l'hôte (le dossier `sujet/` n'est pas dans l'image). Documenté ; une amorce automatique au premier démarrage serait plus simple pour l'évaluateur (à décider, nouvel ADR).

## 13. Question de l'utilisateur sur le lancement, puis amorce automatique

- **Lancement local** : l'utilisateur demande s'il faut `npm run dev` et Docker pour PostgreSQL. Recommandation : Docker uniquement pour la base (`docker-compose.dev.yml`), `npm run dev` pour l'app (rechargement à chaud).
- **« Rien ne se charge »** : diagnostic sans rien supposer — `docker ps`, ports en écoute et `curl` sur `/`, `/vehicules`, `/contact`, `/admin` (tous en 200, 10 véhicules, CSS servi, logs sans erreur). Cause : l'utilisateur ouvrait le port 8000 au lieu de 8080. Aucun défaut de code.
- Demande : « Fusionne la PR et ajoute l'amorce automatique ». PR #5 fusionnée (CI verte).
- **Amorce automatique** (ADR-0020) : au démarrage, si `AUTO_SEED=true` et qu'aucun véhicule n'existe, le catalogue est chargé depuis `vehicles.json`, embarqué seul dans l'image. La logique de seed a été extraite dans un module partagé avec `npm run seed` (aucun doublon de code) ; elle est typée sur la collection, sans cast ni `any`.
- Choix de sécurité de l'IA : l'amorce ne s'exécute que si la collection est vide (jamais d'écrasement des modifications du gérant) ; une erreur d'amorce est journalisée sans faire tomber le site ; seul `vehicles.json` est copié dans l'image, pas le reste de `sujet/`.
- Risque assumé et documenté : si le gérant supprime tous les véhicules et que l'app redémarre avec `AUTO_SEED=true`, le catalogue d'origine revient → mettre `AUTO_SEED=false` en production.
- **Vérifié dans Docker, volumes supprimés puis reconstruction complète** : 10 véhicules créés au premier démarrage (`Initial catalog loaded`), `/vehicules` affiche 10 cartes ; après `docker compose restart app` le log indique `Catalog already present, auto-seed skipped` et le total reste 10 (pas de doublon, pas de rechargement) ; `ls sujet` dans le conteneur ne montre que `vehicles.json` ; `git status sujet` propre. 43 tests unitaires, lint et types verts.
