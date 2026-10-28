# ADR-0033 : Icône, robots.txt, sitemap.xml et pages légales

- **Statut** : Accepté
- **Date** : 2026-10-28
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Il manquait au site ce que n'importe quel site fini a : une icône d'onglet, un `robots.txt`, un `sitemap.xml`, des mentions légales et une politique de confidentialité (les formulaires collectent des données personnelles). L'utilisateur précise que le projet est une **démonstration** : il n'y a pas de vraie agence, pas de mise en ligne, et le reste (déploiement, stockage des demandes, etc.) est laissé de côté.

## Décision

- **Icône** : le pictogramme « car » de **Tabler Icons** (licence MIT), trouvé sur internet, dans un carré anthracite aux couleurs du site. Trois fichiers selon la convention de Next.js : `icon.svg`, `apple-icon.png` (180 px) et `favicon.ico` (16, 32, 48 px), générés à partir du même SVG. Crédit et texte de licence dans `docs/licences-tierces.md` et sur la page des crédits.
- **`robots.txt`** (`src/app/robots.ts`, obligatoirement à la racine de `app`) : tout est autorisé sauf `/admin`, `/api/` et les formulaires de réservation par véhicule ; il indique l'adresse du plan du site.
- **`sitemap.xml`** (`src/app/(frontend)/sitemap.ts`) : les pages fixes et **une fiche par véhicule** lue en base (avec sa date de modification), construit à chaque requête car le build n'a pas de base. Les formulaires de réservation n'y figurent pas. Les adresses absolues viennent de `SITE_URL`.
- **Mentions légales** et **politique de confidentialité** : deux pages, liées depuis le pied de page et, pour la seconde, sous chaque formulaire. Comme l'agence est fictive, elles le **disent clairement** (ligne « Site de démonstration : agence fictive » dans le pied de page) et **n'inventent aucune identité** : l'éditeur est l'auteur du dépôt public, sans société ni numéro d'immatriculation, et aucun hébergeur n'est cité puisque le site n'est pas en ligne.
- **La politique de confidentialité décrit ce que fait réellement le code** : données collectées par formulaire, envoi à Telegram (service tiers, possiblement hors UE), aucun enregistrement par le site, journaux techniques, aucun cookie pour les visiteurs, carte Google chargée au clic seulement (ADR-0029), droits RGPD exercés par le formulaire de contact, réclamation auprès de la CNIL.
- Les nouvelles pages sont dans les scans d'accessibilité et de politique de sécurité de contenu de la suite E2E.

## Alternatives envisagées

- **Icône dessinée à la main ou monogramme « YM »** : identité plus propre, mais l'utilisateur demandait une icône trouvée sur internet.
- **Mentions légales avec des informations plausibles** (SIRET, adresse du siège) : refusé, ce serait inventer des informations sur une entreprise qui n'existe pas.
- **Ne pas faire de pages légales (site fictif)** : un visiteur ou un évaluateur doit pouvoir savoir ce qui arrive à ses données ; la page est courte et exacte.
- **Sitemap statique** : se périme dès que le gérant ajoute un véhicule dans l'admin.

## Conséquences

- Les textes décrivent un projet de démonstration. **Pour une vraie agence**, ils doivent être refaits : raison sociale, SIRET, adresse, responsable de publication, hébergeur, durée de conservation réelle, et validés par un juriste.
- Toute nouvelle page publique doit être ajoutée à `buildSitemap` (`src/lib/seo.ts`) et à la liste de `e2e/accessibility.spec.ts`.
- Le site indique aux moteurs de recherche de ne pas explorer `/admin` ; ce n'est pas une protection (voir ADR-0028).
