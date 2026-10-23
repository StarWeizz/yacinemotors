# ADR-0013 : Modèle de données des véhicules et import depuis `vehicles.json`

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Le sujet fournit `sujet/vehicles.json` (agence + 10 véhicules) à utiliser « tel quel, sans le modifier » et précise que « toutes ses informations ont un sens pour le client ». Payload (ADR-0004) doit permettre au gérant de modifier le catalogue. Les images référencées n'existent pas.

## Décision

- Une **collection Payload `vehicles`** reprend **tous** les champs du JSON, nommés en anglais côté code (`pricePerDay`, `deposit`, `includedKmPerDay`, `critAir`, `minimumAge`, `minimumLicenseYears`, `unavailableUntil`…). Les valeurs (textes, catégories, équipements) restent en français, telles que fournies.
- Un **global Payload `agency`** reprend `nom`, `ville`, `devise`.
- Les champs optionnels du JSON (âge minimum, années de permis, date de fin d'indisponibilité) sont conservés : ce sont des **conditions de location** à afficher au client, et la date de retour d'un véhicule indisponible est une information utile.
- L'import se fait par un **script de seed** (`npm run seed`) qui lit le fichier **sans l'écrire**, le valide à l'exécution (type guards, pas de `any`) et crée ou met à jour les véhicules par `slug` (**idempotent**).
- Les images sont stockées comme **chemins texte** (fichiers absents) : le front affichera un visuel de remplacement. Le téléversement de médias dans Payload pourra venir plus tard.
- Lecture publique de la collection ; création, modification, suppression réservées aux utilisateurs authentifiés.

## Alternatives envisagées

- **Lire le JSON directement dans Next.js** : plus simple mais le gérant ne peut rien modifier (contraire à l'ADR-0004).
- **Collection média Payload dès maintenant** : aucune image à téléverser pour l'instant, complexité inutile.
- **Garder les noms français des champs** : mélange de langues dans le code ; l'anglais est retenu pour le code, le français pour le contenu.

## Conséquences

- Le seed est une opération manuelle (hôte → base) ; il n'est pas lancé automatiquement par Docker, et le dossier `sujet/` n'est pas dans l'image.
- Une nouvelle migration Payload est nécessaire (ADR-0012).
- Les données d'agence et de véhicules deviennent modifiables dans l'admin : le JSON n'est que la source initiale.
