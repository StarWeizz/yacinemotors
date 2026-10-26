# ADR-0021 : Filtres et tri du catalogue

- **Statut** : Accepté
- **Date** : 2026-10-25
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Le sujet propose en bonus des filtres et un tri sur le catalogue. Avec 10 véhicules la liste reste lisible, mais un client qui cherche « une automatique disponible sous 100 € » doit parcourir toutes les cartes. Le site doit rester utilisable sans JavaScript (ADR-0019).

## Décision

- **Critères** : catégorie, carburant, boîte, prix maximum par jour, « disponibles uniquement ». **Tris** : ordre du catalogue (défaut), prix croissant / décroissant, puissance décroissante, plus récents.
- **État dans l'URL** (`/vehicules?categorie=SUV&tri=prix-asc`) : un simple formulaire `GET` rendu côté serveur. Fonctionne sans JavaScript, les résultats sont partageables, le bouton « retour » se comporte normalement. Aucun composant client ni état React supplémentaire.
- **Familles de carburant et de boîte** : les valeurs du JSON sont détaillées (`Essence (micro-hybride)`, `Automatique (7 rapports)`). Le filtre porte sur la partie avant la parenthèse (`Essence`, `Automatique`…), sinon chaque variante deviendrait un choix distinct. Les valeurs affichées sur les cartes ne changent pas.
- **Les choix proposés sont déduits des véhicules en base** : si le gérant ajoute une catégorie dans `/admin`, elle apparaît sans modification du code.
- **Logique pure et testée** (`src/lib/vehicles/catalog.ts`) : lecture des paramètres, filtrage, tri, sans accès à la base.
- **Paramètres invalides ignorés** (valeur inconnue, prix non numérique, tri inconnu) : jamais d'erreur 500, la page affiche simplement le catalogue sans ce critère. Rien de l'URL n'est injecté dans une requête SQL.
- Résultat annoncé dans une région `role="status"` (« 3 véhicules sur 10 ») ; message explicite et lien « Réinitialiser » quand rien ne correspond.

## Alternatives envisagées

- **Filtrage côté client (React + état)** : réponse immédiate, mais inutilisable sans JavaScript, URL non partageable et JavaScript supplémentaire à livrer.
- **Filtrage en SQL via `where` de Payload** : pertinent pour des centaines de véhicules ; ici, un seul chargement de toute la collection (déjà fait pour le catalogue) puis filtre en mémoire est plus simple et plus lisible. À revoir si le catalogue grossit nettement.
- **Un champ de recherche libre** : non retenu, les critères structurés couvrent les besoins du client.

## Conséquences

- La page `/vehicules` dépend de `searchParams` : elle est rendue à chaque requête (elle l'était déjà, `force-dynamic`).
- Le filtre carburant/boîte repose sur la convention « famille puis détail entre parenthèses » du fichier fourni ; un libellé saisi autrement dans l'admin serait traité comme sa propre famille.
- Le critère de prix s'appuie sur le prix journalier ; il ne tient pas compte de la durée ni de la caution.
