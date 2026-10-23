# ADR-0017 : Pages accueil et catalogue — rendu serveur à la requête, CSS simple, image de remplacement

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

F1 (accueil) et F2 (catalogue) affichent des données modifiables par le gérant dans Payload (ADR-0004, ADR-0013). Le build Docker et la CI n'ont pas de vraie base de données ; les images référencées par le JSON n'existent pas.

## Décision

- **Rendu serveur à la requête** (`dynamic = 'force-dynamic'`) pour les pages qui lisent Payload : un changement fait dans l'admin est visible immédiatement, et le build n'a pas besoin de base. Le HTML est complet sans JavaScript (ADR-0003). Le mode *Cache Components* de Next.js n'est pas activé pour l'instant : à réévaluer quand le trafic le justifiera.
- **Accès aux données** par l'API locale de Payload dans des fonctions serveur (`src/lib/vehicles/queries.ts`), typées avec les types générés.
- **Images** : le serveur vérifie que le fichier référencé existe dans `public/` ; sinon un **visuel de remplacement** (SVG avec marque et modèle) est affiché. Aucune image cassée.
- **Informations affichées** : toutes celles utiles au client — caractéristiques, prix/jour, caution, km inclus, Crit'Air, équipements, disponibilité et date de retour, **conditions du conducteur** (âge minimum, années de permis). Prix et dates formatés en français (`Intl`).
- **Style** : CSS global simple avec variables CSS, sans framework, pour garder le code lisible et le bundle léger. Accessibilité de base : repères sémantiques, lien d'évitement, focus visible, contrastes.
- **GSAP** (ADR-0014) : une couche d'animation d'apparition isolée dans un composant client, désactivée avec `prefers-reduced-motion`.
- **Hors périmètre ici** : filtres et tri (bonus), page détail, formulaires (F3, F4).

## Alternatives envisagées

- Génération statique + revalidation : rapide, mais exige une base au build et une invalidation depuis Payload.
- Tailwind / CSS-in-JS : dépendance supplémentaire sans besoin réel à cette échelle.
- `next/image` sur des fichiers absents : erreurs 404 ; la vérification côté serveur est plus simple.

## Conséquences

Chaque affichage du catalogue interroge la base (acceptable pour 10 véhicules ; mise en cache à envisager ensuite). Le visuel de remplacement sera automatiquement supplanté dès que de vraies images seront déposées dans `public/`.
