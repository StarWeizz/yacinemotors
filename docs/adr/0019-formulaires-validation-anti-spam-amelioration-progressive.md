# ADR-0019 : Formulaires — validation serveur, anti-spam et amélioration progressive

- **Statut** : Accepté
- **Date** : 2026-10-24
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Les formulaires sont publics et déclenchent des messages Telegram : cibles de spam et d'injection de contenu. Le choix de Next.js repose sur un site utilisable sans JavaScript (ADR-0003). Le sujet attend un bouton « Demander une réservation » sur chaque véhicule qui ouvre un formulaire.

## Décision

- **Formulaires HTML natifs** (`method="post"`) vers les routes `/api/contact` et `/api/reservation` : ils fonctionnent **sans JavaScript** (réponse en redirection 303 vers la page avec un message). Un composant client les améliore (envoi en `fetch`, erreurs par champ, saisie conservée) ; les routes répondent en JSON si le client le demande.
- Les routes `/api/contact` et `/api/reservation` sont celles que la limitation de débit stricte de nginx cible déjà (ADR-0012).
- **Validation uniquement côté serveur faisant foi** (le HTML n'est qu'une aide) : types, longueurs, e-mail, téléphone, dates. Les erreurs sont en français et par champ.
- **Réservation** : le véhicule est relu en base à partir de son `slug` (le prix n'est jamais pris du formulaire). Le conducteur indique son âge et ses années de permis : la demande est refusée si elle ne respecte pas les **conditions du véhicule** (âge/permis minimum du JSON). Si le véhicule est indisponible jusqu'à une date, le début de location ne peut pas être antérieur. Le message Telegram contient une **estimation** (nombre de jours × prix/jour, km inclus, caution), marquée comme indicative.
- Durée : le nombre de jours est la différence entre retour et départ (minimum 1) — hypothèse à confirmer avec le client.
- **Anti-spam** : champ piège invisible (*honeypot*, succès simulé sans envoi), limitation de débit nginx par IP, taille de corps limitée, et contrôle de l'en-tête `Origin` (protection CSRF simple).
- Le bouton « Demander une réservation » est un **lien vers une page dédiée** `/vehicules/[slug]/reservation` (plutôt qu'une fenêtre modale) : accessible, utilisable sans JavaScript, et partageable.

## Alternatives envisagées

- **Server Actions** : bonnes en amélioration progressive, mais leurs URL ne sont pas ciblables par nginx pour la limitation de débit.
- **reCAPTCHA / Turnstile** : plus efficace contre les robots avancés, mais dépendance externe et données personnelles ; à reconsidérer si le spam apparaît.
- **Validation côté client seule** : contournable.

## Conséquences

Pas de protection contre un robot ciblé qui ignore le honeypot et reste sous le débit autorisé : limite documentée dans le README. Aucune demande n'est stockée (pas de back-office) : si Telegram échoue, la demande est perdue.
