# ADR-0034 : Licence MIT

- **Statut** : Accepté
- **Date** : 2026-10-29
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Le dépôt est public mais n'avait aucune licence : sans licence, le code reste protégé par défaut et personne n'a le droit de le réutiliser ni de le modifier, même pour s'en inspirer. L'utilisateur demande une licence MIT.

## Décision

- **Licence MIT** pour le **code** du projet : fichier `LICENSE` à la racine, champ `license` de `package.json`, section « Licence » du README, mention dans les mentions légales du site.
- **Titulaire du droit d'auteur : « StarWeizz »**, l'identifiant GitHub du dépôt, faute d'un autre nom fourni (le projet ne fait apparaître aucune identité civile). À remplacer par le nom voulu si besoin.
- **La licence MIT ne couvre pas les éléments tiers**, qui gardent la leur : photographies (CC BY-SA 4.0, attribution et partage dans les mêmes conditions), polices (SIL OFL 1.1), icône (MIT, Tabler Icons). Ils sont listés dans `docs/licences-tierces.md`.
- **Les données d'exemple** de `sujet/` (énoncé, `vehicles.json`) appartiennent à leur auteur ; elles sont dans le dépôt pour faire tourner le projet et ne sont pas relicenciées.

## Alternatives envisagées

- **Aucune licence** : code réutilisable par personne, ce qui n'est pas ce que l'on veut pour un projet montré publiquement.
- **Apache-2.0** : protection de brevets explicite, texte plus long ; sans intérêt ici.
- **GPL** : impose le partage des dérivés ; trop contraignant pour une démonstration.

## Conséquences

- N'importe qui peut réutiliser le code à condition de conserver le texte de licence ; le logiciel est fourni sans garantie.
- Les photographies restent sous CC BY-SA : les réutiliser exige de citer les auteurs et de partager les modifications sous la même licence, ce que la licence MIT du code ne change pas.
- `package.json` reste `private: true` (non publié sur npm) ; ce champ n'a rien à voir avec la licence.
