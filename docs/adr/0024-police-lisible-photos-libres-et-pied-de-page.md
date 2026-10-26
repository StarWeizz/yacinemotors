# ADR-0024 : Police plus lisible, photos libres de droits et pied de page de loueur

- **Statut** : Accepté — complète l'ADR-0022 (typographie) ; ne remplace aucun ADR
- **Date** : 2026-10-26
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Après la refonte (ADR-0022, ADR-0023), l'utilisateur demande trois choses : un pied de page « professionnel de vrai loueur de voitures », une police **plus lisible**, et des **images libres de voitures** téléchargées. Le sujet ne fournit ni photos, ni adresse, ni téléphone, ni horaires (`vehicles.json` ne contient que le nom et la ville de l'agence).

## Décision

**Police** — la didone Bodoni Moda (traits très fins, signe « € » presque invisible, lecture pénible en petit) est remplacée par **Newsreader** (serif éditoriale à axe optique, lisible) pour les titres et **Inter** (sans-serif très lisible) pour le texte. La direction artistique (blanc, perle, acier, anthracite) ne change pas.

**Photos** — les 10 véhicules reçoivent une photo issue de **Wikimedia Commons**, choisie pour correspondre au modèle (même modèle, pas le véhicule de l'agence).
- Licences retenues : CC0, CC BY, CC BY-SA 4.0. Les 10 photos retenues sont en **CC BY-SA 4.0** : l'auteur doit être crédité, la licence et la source indiquées.
- Les fichiers sont nommés comme les chemins déjà présents dans `vehicles.json` (`/images/vehicles/…`) : **le JSON reste intact** et le code existant (`findExistingImage`) les trouve sans changement. Le visuel de remplacement reste pour tout véhicule sans photo.
- Redimensionnées à 1200 px et recompressées (≈ 200 Ko chacune) ; les originaux ne sont pas conservés.
- Les auteurs, licences et sources sont dans `src/lib/vehicles/photo-credits.ts` et affichés sur la page publique `/credits-photos`, liée depuis le pied de page.

**Pied de page** — quatre blocs : présentation de l'agence, navigation, conditions de location, contact.
- Les **conditions** (fourchettes de caution et de kilomètres, âge et permis maximaux exigés) sont **calculées à partir des véhicules en base**, pas écrites en dur.
- Les **coordonnées** (adresse, téléphone, e-mail public, horaires) sont des champs **facultatifs** du global `agency` de Payload (migration `agency_contact`) : le gérant les saisit dans `/admin` et le pied de page n'affiche que ce qui est renseigné. **Rien n'est inventé** : tant que ces champs sont vides, seul le formulaire de contact est proposé.
- Pas de page « mentions légales » : elle exige des informations d'entreprise (raison sociale, SIRET, hébergeur) que le candidat doit fournir.

## Alternatives envisagées

- **Unsplash / Pexels** : licence très permissive sans attribution obligatoire, mais les photos sont rarement identifiables par modèle précis et le téléchargement passe par une API ou un site intermédiaire. Commons permet de choisir le modèle exact avec une licence et un auteur vérifiables par API.
- **Photos générées par IA** : refusées, ce serait présenter de fausses photos de véhicules.
- **Coordonnées plausibles écrites dans le code** : refusé, ce serait inventer des informations sur une vraie agence.

## Conséquences

- Le dépôt contient environ 2 Mo d'images ; les licences CC BY-SA s'appliquent aux **photos** (partage dans les mêmes conditions en cas de modification), pas au code du projet.
- Si le client fournit ses propres photos, il suffit de remplacer les fichiers (mêmes noms) ou de changer les chemins dans l'admin, puis de retirer les crédits devenus inutiles.
- Plusieurs photos montrent des plaques d'immatriculation de particuliers ; ce sont des photos publiées sous licence libre, mais à remplacer par les photos de l'agence dès qu'elles existent.
- Le formulaire d'administration du global « Agence » comporte quatre champs de plus (migration versionnée).
