# ADR-0018 : Intégration Telegram via l'API Bot, appelée côté serveur

- **Statut** : Accepté
- **Date** : 2026-10-24
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Chaque envoi des formulaires de contact (F3) et de demande de réservation (F4) doit arriver comme message sur le Telegram de Yacine Motors, sans back-office de suivi. Le sujet demande de trouver l'approche dans la documentation officielle et précise que l'évaluateur branchera son propre bot.

## Décision

- Appel de la méthode **`sendMessage`** de l'API Bot officielle (`POST https://api.telegram.org/bot<token>/sendMessage`, corps JSON, `chat_id` et `text` obligatoires, `text` de 1 à 4096 caractères) **depuis une route serveur Next.js**. Le token n'est jamais envoyé au navigateur.
- Configuration par variables d'environnement : `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` ; `TELEGRAM_API_URL` (optionnelle, défaut `https://api.telegram.org`) permet de pointer vers un faux serveur dans les tests. Brancher le bot de l'évaluateur = changer deux variables.
- Messages en **`parse_mode: HTML`** ; tout texte saisi par l'utilisateur est échappé (`<`, `>`, `&`, comme l'exige la doc) et le message est tronqué sous la limite de 4096 caractères.
- Appel avec délai maximal (8 s). Les erreurs de Telegram (dont `retry_after` en cas de limitation de débit) sont journalisées sans le token et traduites en réponse générique pour le visiteur.
- Si les variables sont absentes, les formulaires répondent « service momentanément indisponible » au lieu de faire croire à un envoi.

## Alternatives envisagées

- **Appel depuis le navigateur** : exposerait le token, n'importe qui pourrait écrire avec le bot (écarté).
- **Webhook / long polling** : sert à *recevoir* des messages ; inutile pour seulement en envoyer.
- **E-mail ou service tiers (n8n, Zapier)** : contraire à la demande (Telegram direct) et ajoute une dépendance.
- **Bibliothèque (grammY, telegraf)** : superflue pour un seul appel HTTP.

## Conséquences

Un message peut être perdu si Telegram est indisponible (pas de file d'attente) ; le visiteur est alors invité à réessayer ou à téléphoner. Les tests n'appellent jamais l'API réelle.
