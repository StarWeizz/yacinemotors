# ADR-0026 : Page détail par véhicule

- **Statut** : Accepté
- **Date** : 2026-10-27
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Bonus du sujet : une page détail par véhicule. Le catalogue affiche déjà toutes les informations dans la carte ; la fiche dédiée sert à présenter un véhicule seul (grande photo, description, caractéristiques lisibles, tarif) et à avoir une adresse partageable.

## Décision

- **Route** `/vehicules/[slug]`, rendue côté serveur à la requête (comme le catalogue, ADR-0017) ; `404` si le `slug` est inconnu. Le `slug` est celui du JSON, déjà utilisé pour la réservation.
- **Contenu** : grande photo (ou plaque de remplacement), description, caractéristiques complètes en liste de définitions, équipements, conditions du conducteur, disponibilité avec date de retour, et un bloc tarif qui reste visible au défilement sur grand écran.
- **Exemples de durée** (1, 3, 7 jours) : simple multiplication du prix journalier et des kilomètres inclus par jour, présentée comme exemple de calcul « hors options » ; ce n'est pas un devis (cohérent avec l'estimation du formulaire de réservation, ADR-0019).
- **Autres véhicules de la même catégorie** : trois liens maximum, pour continuer la navigation sans revenir au catalogue.
- **Accès** : le titre et la photo de chaque carte du catalogue mènent à la fiche (le lien de la photo est masqué aux technologies d'assistance et au clavier pour éviter un doublon) ; la page de réservation renvoie vers la fiche. Le bouton « Demander une réservation » reste l'action principale (même règle que sur la carte : proposé si le véhicule est disponible ou a une date de retour).
- **Métadonnées** : titre `Marque Modèle Version`, description (texte du véhicule + prix et caution), image de partage quand la photo existe. Les URL absolues de partage reposent sur la variable `SITE_URL` (défaut `http://localhost:3000` en local, `http://localhost:8080` dans Docker) : à régler sur le vrai domaine au déploiement.
- Accessibilité : fil d'Ariane (`aria-current`), titres hiérarchisés, tableau avec en-têtes de lignes, rien ne dépend d'un script.

## Alternatives envisagées

- **Fiche en fenêtre modale depuis le catalogue** : pas d'adresse partageable, inutilisable sans JavaScript.
- **Galerie de plusieurs photos** : le JSON ne référence qu'une image par véhicule ; à ajouter si le client en fournit plusieurs.
- **Calculateur de prix interactif** : doublon du formulaire de réservation, et plus de JavaScript pour un gain faible.
- **Données structurées (schema.org `Car`/`Offer`)** : utile pour le référencement, mais un prix de location n'est pas une offre de vente ; reporté.

## Conséquences

- Chaque véhicule a une adresse stable ; modifier le `slug` dans l'admin casse les liens existants.
- La lecture des véhicules est partagée par requête (`cache`), la liste « autres véhicules » ne coûte donc pas de requête de plus.
- Nouvelle variable d'environnement `SITE_URL` (`.env.example`, `docker-compose.yml`).
