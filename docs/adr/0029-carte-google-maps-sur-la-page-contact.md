# ADR-0029 : Carte Google Maps sur la page contact

- **Statut** : Accepté
- **Date** : 2026-10-28
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

L'utilisateur demande, sur la page contact, une carte Google Maps zoomée sur Marseille à côté du formulaire sur grand écran. Une carte intégrée charge du contenu de Google : cela transmet l'adresse IP du visiteur (et pose potentiellement des cookies) à un tiers, et la politique de sécurité de contenu (ADR-0028) interdit par défaut toute intégration externe.

## Décision

- **Intégration par `iframe` sans clé d'API** (`https://maps.google.com/maps?q=…&z=…&output=embed`, interface en français), centrée sur la ville de l'agence lue en base, au zoom 12. Si le gérant renseigne l'adresse dans l'admin (ADR-0024), la carte se centre sur cette adresse au zoom 15.
- **Chargement au clic** : la page affiche d'abord un encart (« La carte est fournie par Google Maps. L'afficher transmet votre adresse IP à Google ») avec un bouton « Afficher la carte ». Aucune requête vers Google n'est faite avant ce choix. Sans JavaScript, le lien « Ouvrir Marseille dans Google Maps » reste disponible.
- **Mise en page** : carte à droite du formulaire à partir de 1024 px (collante au défilement), sous le formulaire sur téléphone ; titre accessible sur l'iframe.
- **Politique de sécurité** : `frame-src` n'autorise `maps.google.com` et `www.google.com` que sur `/contact` ; toutes les autres pages gardent `frame-src 'none'`.

## Alternatives envisagées

- **Carte affichée dès le chargement** : exactement ce qui était demandé, mais envoie l'IP de chaque visiteur à Google avant tout choix. Réversible en une ligne si le client préfère (le comportement par défaut est documenté ici).
- **Google Maps JavaScript API** : exige une clé, un compte de facturation et du script tiers dans la page ; disproportionné pour un point sur une carte.
- **OpenStreetMap** : plus respectueux de la vie privée et sans clé, mais l'utilisateur a demandé Google Maps.
- **Image statique de carte** : sans interaction ; l'API Static Maps exige aussi une clé.

## Conséquences

- La carte dépend d'une URL d'intégration non documentée comme API stable ; si Google la change, seul l'encart de la page contact est touché (le lien d'ouverture reste valable).
- Le bouton « Afficher la carte » est masqué sans JavaScript (il ne ferait rien) : le lien le remplace.
- Une mention sur la vie privée plus complète (cookies, finalités) relève du client, comme les mentions légales (ADR-0024).
