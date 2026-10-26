# ADR-0022 : Direction artistique et règle « zéro AI slop »

- **Statut** : Accepté
- **Date** : 2026-10-26
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Le premier habillage du site (thème sombre, accent jaune, dégradé radial dans le hero) fonctionne mais ressemble à un gabarit générique. Le client est une agence de location de véhicules haut de gamme à Marseille : l'identité visuelle doit être reconnaissable, sobre et propre à ce métier. L'utilisateur a demandé une refonte du design de l'accueil et du catalogue avec des interdictions explicites, puis de les inscrire dans `CLAUDE.md` : « 0 AI slop ».

## Décision

- **Ambiance** : luxe discret et méditerranéen, inspiré de l'horlogerie et de l'architecture contemporaine. Blanc dominant, gris perle, acier brossé, aplats de noir anthracite pour les contrastes. Aucune couleur vive.
- **Typographie** : une serif éditoriale pour les titres, une sans-serif géométrique lisible pour le texte ; échelle typographique définie une fois (variables CSS).
- **Espace** : généreux, asymétries légères, lignes fines plutôt que cartes ombrées.
- **Interdits (« zéro AI slop »)** : dégradés violet/cyan et « glows » néon ; formes flottantes et « blobs » sans fonction ; illustrations 3D isométriques ou style Memphis ; animations de scroll lourdes et micro-interactions gratuites ; sections « témoignages » ou « partenaires » avec faux contenu. Tout élément doit avoir un sens métier.
- **Animations** : GSAP (ADR-0014), sobres et précises : apparition du titre du hero, révélation des cartes au scroll, survols soignés, curseur discret sur écrans à pointeur précis. **Pas de smooth scroll** (Lenis ou équivalent) : le défilement natif est conservé pour la réactivité et l'accessibilité. `prefers-reduced-motion` est respecté et le contenu reste visible sans JavaScript.
- La règle est ajoutée à `CLAUDE.md` (règle 10) pour qu'elle s'applique à chaque session.

## Alternatives envisagées

- **Garder le thème sombre actuel** : cohérent avec le travail déjà fait mais ne correspond pas à la direction demandée.
- **Bibliothèque de composants (shadcn, etc.)** : rapide, mais c'est exactement l'aspect « gabarit » à éviter ; le CSS reste écrit à la main (ADR-0017).

## Conséquences

- Les polices sont chargées via `next/font` (hébergées avec l'application, pas d'appel à un CDN au moment de la visite).
- Les photos des véhicules n'étant pas fournies, le visuel de substitution doit rester sobre et honnête (ADR-0017) : il n'invente aucune photo.
- Les tests E2E existants (contenu, accessibilité de base, sans JavaScript) doivent continuer à passer après la refonte.
