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

## 14. Filtres et tri du catalogue (bonus)

- Demandes : « Fusionne la PR » (PR #6, CI verte sur les 4 jobs, fusionnée) puis « Ajoute les filtres et le tri du catalogue ». La branche par défaut du dépôt est `master` (mon `git checkout main` a échoué, sans conséquence).
- **Choix de l'IA** (ADR-0021) : état dans l'URL via un formulaire `GET` rendu côté serveur, donc fonctionnel sans JavaScript et partageable ; logique pure dans `src/lib/vehicles/catalog.ts` ; paramètres invalides ignorés plutôt qu'erreur ; choix de filtres déduits de la base ; filtre carburant/boîte par « famille » (avant la parenthèse du JSON) pour éviter une option par variante.
- **Erreurs de l'IA, corrigées par les tests** : deux attentes fausses dans mes tests unitaires (tri alphabétique français : « Sportive » avant « SUV » ; ordre par année mal calculé). Le code était correct, les attentes non : corrigées dans le test, pas en adaptant le code.
- **Constat d'environnement** : au premier lancement des E2E, aucun conteneur ne tournait (base absente → « cannot connect to Postgres », timeout du serveur de test). Base de dev relancée, migrations et seed rejoués. Résultat : 54 tests unitaires, 30 E2E verts (7 nouveaux : filtre par catégorie, disponibles seulement, prix + boîte, tri décroissant, résultat vide + réinitialisation, paramètres invalides, formulaire sans JavaScript).

## 15. Refonte visuelle (accueil, catalogue) avec le plugin frontend-design

- Demande : installer le plugin `frontend-design`, puis un brief de direction artistique complet (luxe discret et méditerranéen, blanc dominant, gris perle/acier/anthracite, serif éditoriale + sans géométrique, GSAP, **pas de smooth scroll**, liste d'interdits « no AI slop »).
- Deux consignes ajoutées **en cours de travail** : « Met à jour ton .md pour dire que 0 ai slop » → règle 10 de `CLAUDE.md` + ADR-0022 ; « utilise tailwind css » → ADR-0023. Cette seconde consigne **inverse un choix de l'IA** (ADR-0017 avait écarté Tailwind) : l'ADR ancien n'est pas modifié, un nouveau le complète, et le tableau « alternatives » du README est mis à jour.
- **Choix de l'IA** : polices Bodoni Moda (didone, évoque les cadrans) + Plus Jakarta Sans plutôt que les exemples du brief ; le plan de design a été relu contre les défauts « générés » avant de coder (pas d'étiquette en capitales, pas de grands chiffres génériques : la bande de chiffres de l'accueil est devenue « Tout est annoncé avant la demande », avec les fourchettes réelles de prix, caution et kilomètres) ; hero = titre mot à mot + une plaque anthracite présentant le véhicule disponible le plus puissant (donnée réelle) ; visuel de remplacement = plaque typographique, jamais une fausse photo ; disponibilité indiquée par un point plein/vide (pas seulement par la couleur) ; curseur en anneau `mix-blend-mode: difference`, sans masquer le curseur natif, uniquement pointeur précis et sans réduction de mouvement.
- **Défauts trouvés en regardant les captures** (captures Playwright, desktop et mobile) : lien d'évitement visible en haut de page (la classe avait disparu dans la migration vers Tailwind) ; symbole « € » illisible en didone (les traits fins disparaissent) → montant en serif, symbole en sans (`PriceAmount`). L'espacement des mots paraissait cassé : c'était le rendu du Chromium sans interface (hinting), confirmé en relançant avec `--font-render-hinting=none`, pas un défaut du CSS.
- Vérifié : lint, types, 54 tests unitaires, 30 E2E verts sur le nouveau rendu, build Next.js OK.

## 16. Pied de page de loueur, police plus lisible, photos libres

- Demandes (après « ok good pour le design ») : un footer « professionnel de vrai loueur », une police plus lisible, et des images libres de voitures « sur Google » téléchargées.
- **Police** : Bodoni Moda était belle mais fatigante à lire (traits fins, « € » illisible, constaté sur les captures) → Newsreader (titres) + Inter (texte). Nouvel ADR-0024 qui complète l'ADR-0022.
- **Photos** : plutôt qu'une recherche Google (licences floues), l'IA a interrogé l'API de **Wikimedia Commons**, qui donne licence, auteur et source vérifiables. Candidats filtrés (≥ 1600 px, format proche du 4:3), puis choix **à l'œil sur planches contact** pour retenir une photo du bon modèle par véhicule. 10 photos, toutes CC BY-SA 4.0 : l'attribution est obligatoire → données de crédit typées + page publique `/credits-photos` liée du footer. Fichiers nommés comme les chemins déjà dans `vehicles.json` (`/images/vehicles/…`) : le JSON n'est pas touché et `findExistingImage` les trouve tel quel. Recompression 1200 px (≈ 6 Mo → ≈ 2 Mo).
- **Limites assumées** : les photos montrent le même modèle, pas les voitures de l'agence, parfois d'une autre couleur que celle du JSON (le Rafale « Bleu Héritage » est bien bleu, la M4 « jaune » est rouge) ; certaines plaques d'immatriculation de particuliers sont visibles. Écrit dans l'ADR.
- **Footer — ce que l'IA a refusé d'inventer** : le sujet ne donne ni adresse, ni téléphone, ni horaires. Plutôt que des coordonnées plausibles, quatre champs **facultatifs** ont été ajoutés au global `agency` (migration `agency_contact`) : le gérant les remplit dans `/admin` et le footer n'affiche que le renseigné. Pas de page « mentions légales » (SIRET et hébergeur à fournir par le candidat). Les conditions de location du footer sont calculées depuis les véhicules (caution, km, âge/permis maximaux). Une première formulation (« sur les véhicules les plus puissants ») était une inférence non vérifiée : reformulée en « selon le véhicule ».
- **Tests** : l'ancien test « visuel de remplacement » ne correspondait plus (les images existent) → remplacé par « une photo par véhicule et chaque fichier est servi » (images en chargement différé : on vérifie les fichiers, pas l'affichage). Nouveaux tests du footer et des crédits ; garde-fou : aucun lien `tel:`/`mailto:` inventé. 57 tests unitaires, 33 E2E verts.

## 17. Navbar moins « slop » et hero sur image plein écran

- Demande : « fais en sorte que la navbar fasse moins IA slop » et une image de fond plein écran, un peu assombrie, « une concession, une route ou autre ». Décision : ADR-0025.
- **Image** : l'IA a d'abord cherché des concessions sur Wikimedia Commons ; les résultats étaient des gros plans d'une seule voiture (phares, volant, logo), inutilisables en fond. Elle a élargi à Marseille et sa région, puis choisi sur planche contact la **route des Crêtes** (route de corniche au-dessus de la Méditerranée, CC BY-SA 4.0, crédit ajouté). Assombrissement par un aplat à 60 %, pas de dégradé.
- **Navbar** : point plein pour la page courante (même langage que la disponibilité des véhicules), ville à côté du nom, action « Demander une réservation » à un clic ; sur l'accueil elle se superpose à l'image. Marquage `aria-current` testé.
- **Défaut vu sur la capture** : le texte du hero collait au bord gauche (`w-full` annulait les marges du conteneur) → classe retirée.
- **Environnement** : la base de développement n'était plus publiée sur le port 5433 (conteneur recréé sans le fichier de dev, vraisemblablement par un `docker compose up` de l'utilisateur). Plutôt que de redémarrer une base en cours d'utilisation, l'IA s'est connectée à l'adresse interne du conteneur pour ses captures et les E2E. 57 tests unitaires, 35 E2E verts.

## 18. Code review de la PR #8 et corrections

- Demande : « Lance la code review sur master » puis « Corrige les points 1 à 5 et ouvre la PR ». La revue (skill `/code-review`, par lecture du code, rien d'exécuté) ne portait que sur le dernier merge, la PR #8 ; 10 constats.
- **Acceptés et corrigés** : (1) le layout et la page lisaient chacun l'agence et les véhicules, et une panne de base faisait tomber tout le site, `/credits-photos` compris → requêtes partagées par `cache()` et en-tête/pied de page qui se dégradent (message dans les logs, pas de page blanche) ; (2) le titre du hero restait masqué si GSAP ne démarrait pas → filet de sécurité en CSS ; (3) le bouton de la barre disait « Demander une réservation » mais menait au catalogue → renommé « Voir les véhicules disponibles » ; (4) la disponibilité était définie de deux façons (`available` vide = indisponible dans le badge, réservable dans le bouton) → un seul helper `isAvailable` partout, y compris la validation serveur ; (5) CSS mort `.nav-link` supprimé. Bonus : le curseur ne recrée plus une animation à chaque mouvement de souris.
- **Rejeté** : « le curseur n'a pas d'ADR » — il est décrit dans l'ADR-0022 (animations) et la barre dans l'ADR-0025 ; la revue n'avait lu que les noms de fichiers. **Laissés de côté (mineurs, assumé)** : la fonction « de X à Y » dupliquée à trois endroits, le tri complet pour un simple maximum, les fourchettes de prix de l'accueil qui incluent les véhicules indisponibles (« annoncé » parle du catalogue entier), le symbole € retiré puis remis dans `PriceAmount` (l'agence est en EUR).
- **Erreur de l'IA rattrapée par un test** : mon premier filet de sécurité (`transform: translateY(0)`) ne servait à rien, car Tailwind v4 masque le mot avec la propriété CSS `translate`, pas `transform`. Le test E2E (scripts JavaScript bloqués, position du mot mesurée à l'écran) a échoué sur « Received: 0 » au lieu du masquage attendu ; corrigé en `translate: 0 0`. Vérification par mutation : sans le filet, le test échoue (mot à 95 px sous son masque) ; avec, il passe.
- Vérifié : 59 tests unitaires, 36 E2E, lint, types.

## 19. Page détail par véhicule (bonus)

- Demande : « Ajoute la page détail par véhicule ». Décision : ADR-0026.
- **Choix de l'IA** : route `/vehicules/[slug]` rendue côté serveur (404 si inconnu) ; contenu tiré uniquement des données existantes (photo, description du JSON, caractéristiques, équipements, conditions, disponibilité) ; **exemples de durée** (1, 3, 7 jours) = multiplication du prix et des kilomètres inclus, présentés comme exemple « hors options » et non comme un devis ; trois « autres véhicules » de la même catégorie ; titre et photo des cartes du catalogue mènent à la fiche, le lien de la photo étant masqué au clavier et aux lecteurs d'écran pour éviter un doublon.
- **Rejeté par l'IA** : fenêtre modale (pas d'adresse partageable, inutilisable sans JS), galerie (le JSON n'a qu'une image par véhicule), données structurées schema.org (un prix de location n'est pas une offre de vente).
- **Constats pendant le travail** : un test E2E était ambigu (le lien du titre et le bouton de réservation contenaient tous deux « BMW M4 ») → locator précisé dans le test, pas de changement de code ; Next.js signalait l'absence de `metadataBase` pour l'image de partage → nouvelle variable `SITE_URL` (`.env.example`, compose).
- Vérifié : captures desktop/mobile relues, 59 tests unitaires, 43 E2E (7 nouveaux dont un sans JavaScript et un 404), lint, types.

## 20. Audit d'accessibilité

- Demande : « Fais l'audit d'accessibilité ». Décision : ADR-0027 ; rapport : `docs/accessibilite.md`.
- **Méthode choisie par l'IA** : axe-core (WCAG 2.2 AA + bonnes pratiques) sur 10 pages en bureau et mobile, puis contrôles manuels de ce que l'outil ne voit pas (reflow à 320 px, espacement du texte, ordre de tabulation et focus, lien d'évitement, focus après erreur serveur, contraste du texte sur la photo calculé sur la zone la plus claire, taille des cibles). Tout ce qui est automatisable est devenu un test E2E.
- **Résultat honnête** : peu de violations pour axe (étiquette dans le nom du logo, ordre des titres du catalogue, page 404 sans `lang` ni `main`), mais les contrôles manuels en ont trouvé d'autres que l'outil ne voit pas : en-tête de 365 px à 320 px de large, `placeholder` à ≈ 3,4:1, case à cocher dont la ligne fait 20 px, focus qui restait sur le bouton après une erreur serveur, focus qui restait sur `body` après le lien d'évitement. 10 défauts corrigés.
- **Faux positifs écartés** : le contrôle d'espacement du texte signalait des boutons « coupés » ; c'était l'élément de survol (translaté hors du bouton) et le lien d'évitement (masqué), pas du contenu perdu. Vérifié, pas corrigé.
- **Les tests prouvent quelque chose** : en retirant les corrections (`git stash`), 28 des 36 tests d'accessibilité échouent ; avec elles, 36/36. La suite complète : 59 unitaires, 79 E2E, lint, types.
- **Ce que l'IA n'a pas fait et le dit** : aucun lecteur d'écran, aucun utilisateur réel, un seul navigateur, `/admin` non audité ; aucune conformité revendiquée. Le README ne dit donc plus « non audité » mais « audité par outil, pas par des personnes ».

## 21. Audit de sécurité

- Demande : « Fait un audit de sécurité ». Décision : ADR-0028 ; rapport : `docs/securite.md`.
- **Méthode** : revue du code et de la configuration (Payload, routes de formulaires, client Telegram, nginx, Docker, CI) ; recherche de secrets dans **tout l'historique git** (aucun) ; `npm audit` ; puis **sondes sur une vraie pile Docker isolée** (projet `ymaudit`, port et base à part, supprimée ensuite) pour ne pas toucher à la pile en cours d'utilisation de l'utilisateur.
- **Constats corrigés** : usurpation de contenu par `?erreur=` (messages maintenant signés en HMAC) ; aucune CSP (CSP stricte à nonce via `src/proxy.ts`, hors `/admin`) ; jeton de session visible dans les réponses JSON de connexion ; cookies et origines autorisées ; connexion sans limite dédiée dans nginx ; corps de requête jusqu'à 5 Mo sur les formulaires publics ; `X-Powered-By` ; conteneurs avec tous les privilèges par défaut ; pas d'audit de dépendances ni de Dependabot.
- **Erreur de l'IA, rattrapée par une vérification** : j'avais écrit « GraphQL exposé » dans le rapport. En vérifiant la mutation de mon propre test (le test de 404 passait même avec `graphQL.disable: false`), j'ai constaté que **l'application n'a aucune route GraphQL** : rien n'a jamais été exposé. Constat reclassé « info » dans le rapport, l'ADR et le README ; la désactivation reste comme précaution.
- **Autres vérifications utiles** : une première version du test « GSAP tourne sous la CSP » dépendait d'un délai de 2,5 s et échouait sous charge → remplacée par une preuve déterministe (seul GSAP écrit un `transform` inline ; le filet CSS n'en écrit pas), stable sur 3 répétitions. Dans le test CSP, `role="alert"` comptait l'annonceur de routes de Next.js, pas mon message → test ciblé sur la classe du message.
- **Sur la pile Docker** : CSP avec nonce différent à chaque requête, en-têtes sur pages et fichiers statiques, 413 sur un corps de 40 Ko, 429 dès la 6e connexion ratée, 429 sur le formulaire après 4 requêtes, écritures anonymes en 403, cookie `HttpOnly` + `SameSite=Strict`, jeton absent de la réponse, requête avec cookie depuis `evil.example` traitée comme anonyme ; l'app démarre, migre et charge le catalogue avec un système de fichiers en lecture seule et zéro capacité.
- **Observation** : après `first-register`, Payload n'ouvre pas la session (jeton retiré des réponses) ; il faut se connecter. Noté dans l'ADR.
- **Risques non corrigés, écrits** : création du premier admin ouverte tant qu'aucun compte n'existe ; 8 alertes npm transitives (probablement inatteignables, non démontré) ; pas de TLS/HSTS ; `/admin` public ; pas de rôles ni de 2FA ; limite de débit par IP derrière un proxy. Aucune garantie revendiquée, ce n'est pas un test d'intrusion.
- Mutation vérifiée : sans la CSP, les 2 tests de CSP échouent ; avec une validation de signature qui accepte tout, le test de signature copiée échoue. 63 tests unitaires, 95 E2E, lint, types.

## 22. Carte sur la page contact, Telegram en réel, supervision du candidat

- **Telegram** : l'utilisateur a donné le token de son bot ; l'IA l'a écrit dans `.env` (ignoré par git) sans l'afficher ni le recopier dans les docs, puis a lu l'identifiant de conversation via `getUpdates` (seulement l'`id` du chat, pas le contenu du message). Premier essai à vide (aucune mise à jour : message envoyé au mauvais endroit ou file vidée) → l'IA a vérifié l'identité du bot (`getMe`) et l'absence de webhook avant de redemander un message, au lieu de deviner l'identifiant. Rappel donné : le token a transité dans la conversation, à révoquer avec `/revoke` si elle est partagée.
- **Carte** (ADR-0029) : « ajoute à côté du formulaire sur pc une carte Google Maps zoomée sur Marseille ». Choix de l'IA : `iframe` sans clé, centrée sur la ville lue en base (zoom 12, ou adresse au zoom 15 si le gérant la renseigne), **chargée au clic** parce qu'afficher une carte Google dès l'ouverture envoie l'IP du visiteur à un tiers ; CSP `frame-src` ouvert à Google **uniquement sur `/contact`**. C'est un écart assumé par rapport à la demande littérale (carte visible tout de suite) ; réversible en une ligne et signalé à l'utilisateur.
- **Vérifié** : captures avant/après le clic (vraie carte de Marseille, interface passée en français avec `hl=fr` après avoir vu « Open in Maps » en anglais), 5 nouveaux tests E2E (aucune requête vers Google avant le clic, iframe centrée sur Marseille sans violation de CSP, carte à droite sur grand écran et dessous sur téléphone, lien sans JavaScript, `frame-src 'none'` ailleurs) ; l'accessibilité (axe) et la sécurité passent toujours.
- **README** : l'encadré « À compléter par le candidat » est remplacé par la déclaration du candidat, **telle qu'il l'a donnée** : il a supervisé, vérifié et testé à la main les demandes de réservation, la page contact et l'admin (« tout a été testé correctement »), et reçoit bien les messages dans son bot Telegram. L'IA n'a pas ajouté « relu ligne à ligne », qu'il n'a pas affirmé. La limite « jamais testé avec un vrai bot » est reformulée : testé en réel par le candidat seulement, pas de cas d'échec réel.

## 23. Tri des PR Dependabot

- Demande : « Trie les PR Dependabot », puis « Fais les 3 » (fusionner les mises à jour d'actions, fermer les inutilisables avec une règle durable, préparer le passage à Node 24).
- **Tri fait avec des preuves, pas au feu vert de la CI** : pour chaque PR, statut, fichiers, journaux des échecs, contraintes de paquets (`engines`, `peerDependencies` dans `node_modules`) et ce que la CI exécute réellement. Constats : `graphql` 17 et `typescript` 7 échouent à l'installation (Payload exige `graphql ^16.8.1`, `typescript-eslint` exige `typescript <6.1.0`) ; `@types/node` 26 et `node` 26 sont **verts mais non démontrés** : les E2E tournent sous Node 22 sur l'hôte et le job Docker construit l'image sans la lancer ; l'étape `upload-artifact@v7` de la PR n°14 a été **sautée** (elle ne tourne qu'en cas d'échec), donc le vert ne la prouve pas.
- **Exécution** : #15, #16, #14 fusionnées une à une ; #17 est devenue conflictuelle après les autres (même fichier) → rebase demandé à Dependabot. #18, #19 et #20 fermées avec un message d'explication. Règle versionnée dans `.github/dependabot.yml` (ADR-0030) pour que ces montées majeures ne reviennent pas.

## 24. Passage à Node 24

- Suite du tri Dependabot (« Fais les 3 », point 3). Décision : ADR-0031. Plutôt que de fusionner la PR « Node 26 » (verte mais non démontrée), passage volontaire à **Node 24** pour l'image, la CI, `engines` et le README en une seule PR.
- **Constat en route** : `package.json` déclarait `node >=20.9` alors que Payload exige `^22.23.4 || >=24.22.1` : la déclaration du projet était incohérente avec sa propre dépendance. Corrigée (`>=24.22.1`). Conséquence à dire à l'utilisateur : sa machine a Node 20.19.4 ; le développement hors Docker demande maintenant Node 24.
- **Vérification sur l'image réelle** (pile Docker jetable `ymnode24`, supprimée ensuite) : `node -v` = 24.22.1, utilisateur non-root, système de fichiers en lecture seule, 10 véhicules, en-têtes, formulaires ; puis 61 tests navigateur contre cette pile.
- **Faux positif écarté** : 4 tests ont échoué contre la pile. Cause : la limite de débit de nginx (128 réponses 429 avec 6 navigateurs en parallèle), pas Node 24. Relancés en série, ils passent. Noté dans l'ADR.

## 25. Vérification des commandes du README depuis un clone neuf

- Demande de l'utilisateur : s'assurer que le README et le projet sont complets et que toutes les commandes de démarrage sont là. L'IA n'a pas relu le README « à l'œil » : elle a **cloné le dépôt à neuf** et suivi les commandes dans l'ordre, sur des ports et des projets Docker séparés de la pile de l'utilisateur.
- **Chemin Docker** : `cp .env.example .env`, `docker compose up -d --build` → site et admin 200, 10 véhicules, formulaire qui répond « n'a pas pu être envoyé » sans variables Telegram (jamais de faux succès), création du premier compte admin puis connexion : conforme au README.
- **Chemin développement local** : deux défauts réels. (1) Le README place `docker compose … up -d db` **avant** `cp .env.example .env`, alors que le compose exige `POSTGRES_PASSWORD` : la commande échoue (« required variable POSTGRES_PASSWORD is missing »). (2) `DATABASE_URI` garde `change-me` comme mot de passe alors que `POSTGRES_PASSWORD` est généré à part : `npm run migrate` échoue avec « password authentication failed ». Le README ne disait pas de les synchroniser.
- **Autres constats** : `npx playwright install` (navigateurs) n'était pas mentionné ; aucune commande pour arrêter ou réinitialiser la pile ; message d'erreur des formulaires qui parlait de « contactez-nous par téléphone » alors que le site n'affiche aucun numéro tant que le gérant n'en a pas saisi.
- **Fragilité découverte en chemin** : le premier `npm run build` du clone neuf a échoué en tentant de télécharger Newsreader depuis Google Fonts (réseau momentanément indisponible). Rejoué : OK. Plutôt que de le noter comme limite, correction : polices hébergées dans le dépôt (ADR-0032), build vérifié sans accès à Google, rendu identique sur capture.
- Après ces vérifications, `npm test` (63) et `npm run test:e2e` (100) passent depuis le clone neuf.

## 26. Fusion des PR en attente, README complété, index des ADR

- Demande : « Oui, fais-le dans cet ordre qu'on termine le projet » : fusionner #22 (Dependabot), #23 (Node 24), #24 (polices), puis ouvrir la PR du README.
- **Conflits prévisibles résolus à la main** : #23 et #24 modifiaient toutes deux la fin de ce journal (chacune y ajoutait sa section) ; après la fusion de la première, GitHub les a marquées « CONFLICTING ». Résolution locale (`git merge master`, conservation des deux sections dans l'ordre, ligne vide rétablie), CI relancée et verte avant chaque fusion. La CI de #23 a tourné sous Node 24 : lint, types, tests, build, migrations et E2E verts.
- **README** : démarrage rapide (secrets générés et mots de passe synchronisés par une commande `sed` testée), ordre corrigé du développement local, commandes complétées, section de dépannage, mentions périmées retirées. Vérifié depuis des clones neufs (Docker et local), y compris `down` puis `up` (base conservée, pas de rechargement du catalogue).
- **Index des ADR** généré par `npm run adr:index` (32 décisions) ; règle ajoutée à `CLAUDE.md` : régénérer l'index après chaque nouvel ADR.
- Constat honnête : le README ne prétend toujours pas ce qui n'est pas fait (pas de déploiement, pas de stockage des demandes, accessibilité testée par outil seulement).

## 27. Icône, robots.txt, sitemap.xml et pages légales

- Demande : « on ne fait pas de mise en ligne car c'est un projet exemple, vitrine. Donc pas de vraie agence, ni rien. Ajoute une icône trouvée sur internet, le robots.txt, le sitemap.xml, et crée les mentions légales et la politique de confidentialité. Le reste, on passe. » Décision : ADR-0033. La mise en ligne, le stockage des demandes, etc. sortent donc de la liste des suites « à faire » : projet vitrine assumé.
- **Icône** : pictogramme « car » de Tabler Icons (MIT), vérifié via l'API GitHub (licence MIT, copyright Paweł Kuna) avant de l'utiliser ; mis dans un carré anthracite, puis décliné en `icon.svg`, `apple-icon.png` et `favicon.ico` (rendu avec Chromium, aperçu relu). Texte de licence versionné dans `docs/licences-tierces.md`.
- **Choix de l'IA sur les textes légaux** : l'agence étant fictive, aucune identité plausible n'est inventée (ni SIRET, ni siège, ni hébergeur) ; les pages le disent, le pied de page affiche « Site de démonstration : agence fictive », et la politique de confidentialité décrit **ce que fait vraiment le code** (Telegram, aucun enregistrement, journaux de nginx, aucun cookie visiteur, carte Google au clic). Écart signalé à l'utilisateur : la mention « agence fictive » dans le pied de page n'était pas demandée.
- **Erreurs rattrapées** : (1) `robots.ts` placé dans le groupe de routes `(frontend)` : le test E2E répondait 404 et le build n'affichait aucune route `/robots.txt` — Next.js n'accepte ce fichier qu'à la racine de `app` (le plan du site, lui, peut être dans un segment) ; déplacé. (2) J'ai lancé Prettier sur la page de réservation pour corriger une erreur de JSX : sans configuration dans le projet, il a réécrit tout le fichier (147 lignes changées pour une modification de quelques lignes) ; fichier restauré et modification refaite à la main.
- **Vérifié** : 68 tests unitaires, 117 E2E (9 nouveaux : icône dans les trois formats et déclarée dans l'en-tête, contenu de `robots.txt`, plan du site avec 10 fiches et sans formulaires, **chaque adresse du plan répond 200**, pages légales, lien de confidentialité sous les deux formulaires) ; les deux nouvelles pages passent l'accessibilité (axe, reflow 320 px) et la politique de sécurité de contenu.
