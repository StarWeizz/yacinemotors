# Décisions d'architecture (ADR)

Chaque décision du projet a son ADR, dans l'ordre où elle a été prise. Un ADR n'est **jamais supprimé ni réécrit** : si une décision change, un nouvel ADR la remplace ou la complète (voir [ADR-0001](0001-enregistrer-les-decisions-d-architecture.md) et le modèle [0000-template.md](0000-template.md)).

Ce fichier est généré : `npm run adr:index`.

| N° | Décision | Statut | Date |
|---|---|---|---|
| [0001](0001-enregistrer-les-decisions-d-architecture.md) | Enregistrer les décisions d'architecture (ADR) | Accepté | 2026-10-23 |
| [0002](0002-micro-commits-et-conventional-commits.md) | Micro commits, Conventional Commits, PR et code review | Accepté | 2026-10-23 |
| [0003](0003-nextjs-react-typescript.md) | React + Next.js + TypeScript pour le front | Accepté | 2026-10-23 |
| [0004](0004-payload-cms-headless.md) | Payload CMS headless pour la gestion du contenu | Accepté | 2026-10-23 |
| [0005](0005-journal-des-conversations.md) | Journal des conversations avec l'IA | Accepté | 2026-10-23 |
| [0006](0006-qualite-typescript-strict-zero-any.md) | TypeScript strict, zéro `any`, ESLint | Accepté | 2026-10-23 |
| [0007](0007-strategie-de-tests-vitest-playwright.md) | Stratégie de tests (Vitest + Playwright) | Accepté | 2026-10-23 |
| [0008](0008-docker-et-nginx.md) | Conteneurisation avec Docker et nginx | Accepté | 2026-10-23 |
| [0009](0009-postgresql-pour-payload.md) | PostgreSQL comme base de données de Payload | Accepté | 2026-10-23 |
| [0010](0010-postgresql-confirme-et-proximite-supabase.md) | PostgreSQL confirmé, proximité avec Supabase | Accepté | 2026-10-23 |
| [0011](0011-architecture-docker-compose-et-nginx.md) | Architecture Docker Compose et rôle de nginx | Accepté | 2026-10-23 |
| [0012](0012-correctifs-de-la-code-review-docker-nginx.md) | Ajustements Docker, nginx et migrations après code review | Accepté | 2026-10-23 |
| [0013](0013-modele-vehicules-et-import-depuis-le-json.md) | Modèle de données des véhicules et import depuis `vehicles.json` | Accepté | 2026-10-23 |
| [0014](0014-gsap-pour-la-presentation-des-vehicules.md) | GSAP pour la présentation des véhicules | Accepté | 2026-10-23 |
| [0015](0015-versionnement-des-migrations-de-base-de-donnees.md) | Versionnement des migrations de base de données | Accepté | 2026-10-23 |
| [0016](0016-integration-continue-github-actions.md) | Intégration continue avec GitHub Actions | Accepté | 2026-10-23 |
| [0017](0017-interface-catalogue-rendu-serveur-et-css-simple.md) | Pages accueil et catalogue — rendu serveur à la requête, CSS simple, image de remplacement | Accepté | 2026-10-23 |
| [0018](0018-integration-telegram-bot-api-cote-serveur.md) | Intégration Telegram via l'API Bot, appelée côté serveur | Accepté | 2026-10-24 |
| [0019](0019-formulaires-validation-anti-spam-amelioration-progressive.md) | Formulaires — validation serveur, anti-spam et amélioration progressive | Accepté | 2026-10-24 |
| [0020](0020-amorce-automatique-du-catalogue-au-demarrage.md) | Amorce automatique du catalogue au premier démarrage | Accepté | 2026-10-24 |
| [0021](0021-filtres-et-tri-du-catalogue.md) | Filtres et tri du catalogue | Accepté | 2026-10-25 |
| [0022](0022-direction-artistique-et-regle-zero-ai-slop.md) | Direction artistique et règle « zéro AI slop » | Accepté | 2026-10-26 |
| [0023](0023-tailwind-css-pour-la-mise-en-forme.md) | Tailwind CSS pour la mise en forme | Accepté — complète l'ADR-0017 (paragraphe « Style ») et l'ADR-0022 (dernière alternative envisagée) | 2026-10-26 |
| [0024](0024-police-lisible-photos-libres-et-pied-de-page.md) | Police plus lisible, photos libres de droits et pied de page de loueur | Accepté — complète l'ADR-0022 (typographie) ; ne remplace aucun ADR | 2026-10-26 |
| [0025](0025-hero-plein-ecran-et-barre-de-navigation.md) | Hero plein écran sur photo et barre de navigation sobre | Accepté — complète l'ADR-0022 (direction artistique) et l'ADR-0024 (photos) | 2026-10-26 |
| [0026](0026-page-detail-par-vehicule.md) | Page détail par véhicule | Accepté | 2026-10-27 |
| [0027](0027-audit-d-accessibilite-et-tests-axe.md) | Audit d'accessibilité et tests axe-core | Accepté | 2026-10-27 |
| [0028](0028-audit-de-securite-et-durcissement.md) | Audit de sécurité et durcissement | Accepté | 2026-10-27 |
| [0029](0029-carte-google-maps-sur-la-page-contact.md) | Carte Google Maps sur la page contact | Accepté | 2026-10-28 |
| [0030](0030-politique-de-mises-a-jour-dependabot.md) | Politique de mises à jour Dependabot | Accepté — complète l'ADR-0028 | 2026-10-28 |
| [0031](0031-node-24-pour-l-image-la-ci-et-le-developpement.md) | Node 24 pour l'image, la CI et le développement | Accepté — complète l'ADR-0030 | 2026-10-28 |
| [0032](0032-polices-hebergees-dans-le-depot.md) | Polices hébergées dans le dépôt | Accepté — complète l'ADR-0022 et l'ADR-0024 (typographie) | 2026-10-28 |
| [0033](0033-icone-robots-sitemap-et-pages-legales.md) | Icône, robots.txt, sitemap.xml et pages légales | Accepté | 2026-10-28 |
| [0034](0034-licence-mit.md) | Licence MIT | Accepté | 2026-10-29 |
