# ADR-0032 : Polices hébergées dans le dépôt

- **Statut** : Accepté — complète l'ADR-0022 et l'ADR-0024 (typographie)
- **Date** : 2026-10-28
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Les polices (Newsreader et Inter) étaient chargées avec `next/font/google` : Next.js les télécharge **au moment du build** depuis `fonts.googleapis.com`, puis les sert depuis l'application (aucun appel à Google à la visite). En vérifiant les commandes du README depuis un clone neuf, un `npm run build` sans cache a échoué (« Failed to fetch `Newsreader` from Google Fonts »), faute d'accès réseau à ce moment-là. Un évaluateur derrière un proxy d'entreprise, hors ligne, ou dont le réseau coupe un instant, aurait obtenu le même échec en lançant `docker compose up --build`.

## Décision

- Les deux polices sont **versionnées dans le dépôt** (`src/app/fonts/`, sous-ensemble latin, format `woff2` variable) et chargées avec `next/font/local` : **le build n'a plus besoin d'aucun accès réseau** pour les polices.
- Fichiers issus des paquets `@fontsource-variable/newsreader` et `@fontsource-variable/inter` (5.3.0), licence **SIL Open Font License 1.1** qui autorise l'hébergement et la redistribution ; les textes de licence sont dans `src/app/fonts/LICENSES.txt`.
- Mêmes axes qu'avant : graisse variable, et taille optique pour Newsreader. Rendu vérifié sur capture : identique.
- Le sous-ensemble latin couvre le français (accents, œ, €). Aucun italique n'est utilisé par le site.

## Alternatives envisagées

- **Garder `next/font/google`** : dépôt plus léger (≈ 180 Ko de moins), mais un build qui dépend d'un service tiers.
- **Dépendre des paquets `@fontsource-variable/*` à l'exécution** : fonctionne aussi sans réseau après `npm install`, mais ajoute deux dépendances pour deux fichiers.
- **Polices système** : abandonnerait la direction artistique (ADR-0022).

## Conséquences

- Le dépôt grossit d'environ 180 Ko ; les polices ne se mettent plus à jour toutes seules (changer de version = remplacer les fichiers).
- Les références à Google Fonts restantes dans `.next` viennent de la bibliothèque `@vercel/og` de Next.js, non utilisée par le site.
- Le build reste dépendant du réseau pour `npm ci` (dépendances), ce qui est normal.
