# ADR-0025 : Hero plein écran sur photo et barre de navigation sobre

- **Statut** : Accepté — complète l'ADR-0022 (direction artistique) et l'ADR-0024 (photos)
- **Date** : 2026-10-26
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

L'utilisateur trouve la barre de navigation trop « IA slop » (un nom, trois liens soulignés, rien de plus) et demande, pour la section hero, une **image de fond qui occupe tout l'espace, un peu assombrie**, par exemple une concession ou une route.

## Décision

**Image du hero** — la **route des Crêtes entre Cassis et La Ciotat** (Wikimedia Commons, auteur JYB Devot, CC BY-SA 4.0) : une route de corniche qui domine la Méditerranée, à une heure de Marseille. Elle raconte le métier (partir en voiture) et le lieu, sans fausse photo de concession. Recherche d'abord faite sur des concessions : seules des photos de détails d'une même voiture sortaient (phares, volant), inutilisables en fond.
- Fichier local `public/images/hero-route-des-cretes.jpg` (2000 px, ≈ 420 Ko), balise `img` décorative (`alt=""`, `fetchpriority="high"`) plutôt que `next/image`, pour ne pas dépendre de `sharp` dans l'image Docker standalone.
- **Assombrissement par un aplat anthracite à 60 %**, sans dégradé ni effet de verre, pour que le texte blanc reste lisible. Hero sur toute la hauteur de l'écran (`min-h-svh`). La plaque du véhicule reste en anthracite plein.
- Crédit ajouté à `/credits-photos`.

**Barre de navigation** —
- Sur l'accueil, elle se superpose à l'image (texte clair, non collante) ; ailleurs, barre blanche collante avec filet fin.
- La **page courante est marquée** (`aria-current="page"`) par un point plein, le même que celui d'un véhicule disponible : un seul langage visuel pour « actif / disponible ». Au survol, un point creux apparaît.
- Le nom de la ville accompagne le nom de l'agence, séparé par un filet.
- L'**action principale** (« Demander une réservation », vers les véhicules disponibles) reste à un clic, masquée en mobile où la navigation seule tient sur une ligne.

## Alternatives envisagées

- **Photo de concession** : voir ci-dessus, aucune photo libre exploitable trouvée en fond.
- **Vidéo en fond** : lourde, contraire à la sobriété demandée (ADR-0022).
- **Navigation collante transparente avec effet de flou au défilement** : motif très répandu et écouteur de défilement en plus ; écarté.
- **Menu burger en mobile** : inutile pour trois liens ; reporté si la navigation grandit.

## Conséquences

- La navbar devient un composant client (`usePathname`) pour marquer la page courante.
- Le contraste du texte sur la photo a été vérifié à l'œil, pas par outil automatique ; l'aplat à 60 % est le réglage à augmenter si une autre photo est utilisée.
- Sur l'accueil, l'en-tête n'est plus collant : le visiteur le retrouve en remontant en haut de page.
