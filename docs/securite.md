# Audit de sécurité

Audit réalisé le 2026-10-27 sur le site tel qu'il est après la PR #11, avec Claude Code. Décision : [ADR-0028](adr/0028-audit-de-securite-et-durcissement.md). Ce n'est pas un test d'intrusion : c'est une revue de code et de configuration, complétée par des sondes sur une pile Docker réelle.

## Méthode

1. **Revue de code et de configuration** : configuration Payload (accès, authentification, cookies), routes de formulaires, client Telegram, nginx, Dockerfile, `docker-compose.yml`, CI.
2. **Historique git** : recherche de jetons Telegram, mots de passe, clés privées et `PAYLOAD_SECRET` dans tous les commits. Résultat : **aucun secret versionné** (seuls `.env.example`, des valeurs factices de CI et un mot de passe `dev` de base jetable cité dans la documentation).
3. **Dépendances** : `npm audit --omit=dev`.
4. **Sondes dynamiques** sur une pile Docker isolée (projet `ymaudit`, port 8091, base vierge, supprimée après coup) : en-têtes, limites de débit, taille des corps, accès anonyme, connexion et cookies, GraphQL.
5. **Tests permanents** : tout ce qui est automatisable est dans `e2e/security.spec.ts` et `src/lib/forms/notice.test.ts`.

## Constats et corrections

| # | Gravité | Constat | Correction |
|---|---|---|---|
| 1 | Moyenne | **Usurpation de contenu** : la page de contact affichait n'importe quel texte passé dans `?erreur=…`. Un lien piégé pouvait faire afficher « appelez ce numéro pour confirmer votre réservation » sous l'identité du site | Les messages de redirection sont **signés** (HMAC-SHA256 avec `PAYLOAD_SECRET`) ; un message sans signature valide n'est jamais affiché |
| 2 | Moyenne | **Aucune Content Security Policy** : si un script étranger parvenait dans une page, rien ne l'arrêtait | CSP stricte par requête (`src/proxy.ts`) : scripts uniquement avec un nonce, pas de `unsafe-inline`, `object-src 'none'`, `frame-ancestors 'none'`, `form-action 'self'` |
| 3 | Info | Constat initial **erroné** : je supposais GraphQL exposé. Ce site n'a aucune route GraphQL (seule la route REST de Payload est montée) : `/api/graphql` répondait déjà 404 | Aucune faille. Par précaution, `graphQL.disable` est activé dans la configuration pour que l'ajout futur d'une route ne l'expose pas ; un test garde le 404 |
| 4 | Moyenne | **Jeton de session dans les réponses JSON** de connexion : lisible par un script de la page | `removeTokenFromResponses` (le cookie reste `HttpOnly`) ; cookie `SameSite=Strict`, `Secure` dès que `SITE_URL` est en HTTPS ; liste d'origines autorisées (`csrf`) = `SITE_URL` |
| 5 | Faible | Connexion à l'admin limitée seulement par la limite générale de 30 requêtes par seconde | Zone nginx dédiée : 10 requêtes par minute (plus un verrouillage de compte après 5 échecs) |
| 6 | Faible | Corps de requête jusqu'à 5 Mo, y compris sur les formulaires publics | 32 Ko sur `/api/contact` et `/api/reservation`, 1 Mo ailleurs |
| 7 | Faible | `X-Powered-By: Next.js` envoyé à chaque réponse | En-tête supprimé |
| 8 | Faible | Conteneurs avec les privilèges Linux par défaut | `no-new-privileges`, toutes les capacités retirées (nginx garde les quatre nécessaires), système de fichiers de l'app en lecture seule |
| 9 | Info | `Cross-Origin-Opener-Policy` absent | Ajouté (`same-origin`) |
| 10 | Info | Aucun contrôle automatique des dépendances | `npm audit --audit-level=critical` en CI, Dependabot (npm, Docker, Actions) |

## Vérifié sur la pile Docker (après correction)

- En-têtes sur les pages : CSP avec nonce différent à chaque requête, `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `COOP` ; **aucune version de serveur ni de framework**. Les fichiers statiques gardent leurs en-têtes.
- Corps de 40 Ko sur le formulaire de contact : **413**.
- 12 mauvais mots de passe à la suite sur `/api/users/login` : 401 ×5 puis **429**.
- Formulaire de contact : 4 requêtes acceptées puis **429**.
- Écriture anonyme (`POST /api/vehicles`, `DELETE /api/vehicles/1`, `POST /api/globals/agency`) et lecture de `/api/users` : **403**. Le catalogue public reste lisible.
- Session : le cookie est `HttpOnly` et `SameSite=Strict` ; la réponse de connexion **ne contient pas le jeton** ; une requête portant ce cookie depuis une origine non autorisée (`http://evil.example`) est traitée comme anonyme.
- L'application démarre, migre et charge le catalogue avec un système de fichiers en lecture seule et sans aucune capacité.

## Risques restants (non corrigés)

- **Création du premier administrateur ouverte à tout visiteur** tant qu'aucun compte n'existe. À faire dès le déploiement (voir README). Après cette création, Payload n'ouvre pas la session : il faut se connecter ensuite (constaté).
- **8 alertes `npm audit`** (3 élevées, 5 modérées), toutes transitives de Payload : `happy-dom` (via l'éditeur Lexical), `esbuild` et `drizzle-kit` (outils de développement). Aucun champ de texte riche n'est utilisé par ce site, ce qui rend l'alerte `happy-dom` probablement inatteignable, **mais je ne l'ai pas démontré**. Aucune correction compatible n'existe pour l'instant (Dependabot surveille).
- **Pas de TLS ni de HSTS** : le site est servi en HTTP en local. À activer avec `upgrade-insecure-requests` et le drapeau `Secure` des cookies (déjà prévu via `SITE_URL`).
- **`/admin` est joignable par tout le monde** (protégé par mot de passe, limite de débit et verrouillage de compte) : une restriction par IP ou VPN serait préférable en production. Le back-office Payload n'a pas la CSP du site.
- **Pas de rôles** : tout utilisateur connecté peut tout modifier. Suffisant pour un seul gérant, à revoir sinon. Pas de double authentification.
- **Limite de débit par IP** : derrière un autre proxy ou un CDN, il faudra transmettre l'IP réelle à nginx, sinon tous les visiteurs partagent une même limite.
- **Les demandes ne sont pas stockées** : si Telegram échoue, elles sont perdues (déjà noté).
- Images Docker et actions GitHub épinglées par étiquette, pas par empreinte (Dependabot proposera les mises à jour).

## Ce que cet audit ne couvre pas

Pas de test d'intrusion, pas de fuzzing, pas d'analyse approfondie de la chaîne d'approvisionnement des dépendances, pas d'audit du back-office Payload ni de l'hébergement futur. Ne pas y voir une garantie : c'est un état des lieux, daté.

## Relancer

```bash
npx playwright test e2e/security.spec.ts
npm run test -- notice
npm audit --omit=dev
```
