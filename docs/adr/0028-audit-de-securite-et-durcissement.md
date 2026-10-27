# ADR-0028 : Audit de sécurité et durcissement

- **Statut** : Accepté
- **Date** : 2026-10-27
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Le tableau « Sécurité » du README listait les protections prévues dès le départ (ADR-0008, ADR-0011, ADR-0012, ADR-0018, ADR-0019) mais rien n'avait été vérifié de bout en bout sur la pile Docker. L'utilisateur demande un audit de sécurité. Rapport : `docs/securite.md`.

## Décision

- **Audit en cinq temps** : revue du code et de la configuration, recherche de secrets dans tout l'historique git, `npm audit`, sondes dynamiques sur une pile Docker **isolée et jetable** (projet `ymaudit`, port et base séparés, sans toucher à la pile de l'utilisateur), tests permanents.
- **Corrections retenues** :
  - messages de redirection des formulaires **signés** (HMAC) pour empêcher l'usurpation de contenu (`src/lib/forms/notice.ts`) ;
  - **Content Security Policy** stricte avec nonce, appliquée au site public par `src/proxy.ts` (pas à `/admin` ni à l'API) ; pas de `upgrade-insecure-requests` tant que le site n'est pas en HTTPS ;
  - jeton de session retiré des réponses JSON ; cookie `SameSite=Strict`, `Secure` si `SITE_URL` est en HTTPS ; origines autorisées = `SITE_URL` ;
  - nginx : limite dédiée à la connexion (10 requêtes par minute), corps limités (32 Ko sur les formulaires, 1 Mo ailleurs), `Cross-Origin-Opener-Policy` ; HSTS prêt mais commenté jusqu'au passage en HTTPS ;
  - `X-Powered-By` supprimé ; conteneurs sans privilèges superflus (`no-new-privileges`, `cap_drop: ALL`, système de fichiers de l'app en lecture seule) ;
  - `npm audit` bloquant sur les alertes **critiques** en CI, Dependabot.
- **GraphQL** : l'audit a d'abord supposé l'endpoint exposé ; vérification faite, **aucune route GraphQL n'est montée** dans l'application, donc rien n'était exposé. `graphQL.disable` est tout de même activé par précaution (défense en profondeur) et un test garde le 404.
- **Les en-têtes de sécurité restent dans nginx** (ADR-0012), sauf la CSP qui dépend d'un nonce par requête et vient de l'application.
- Les risques non corrigés sont **écrits** dans le rapport et le README, pas passés sous silence.

## Alternatives envisagées

- **CSP statique dans nginx avec `unsafe-inline`** : simple mais n'arrête pas un script injecté, donc peu utile.
- **CSP sur l'admin aussi** : le back-office de Payload a ses propres besoins ; une politique trop large n'apporterait rien, une politique stricte risquerait de le casser.
- **Monter GraphQL et le protéger** (limite de complexité, introspection coupée) : une surface de plus à surveiller pour un usage nul.
- **Création du premier administrateur par variables d'environnement** : ferme la fenêtre d'inscription ouverte, mais impose un mot de passe en clair dans la configuration ; reporté, documenté.
- **Forcer `npm audit` au niveau « high »** : échouerait aujourd'hui sur trois alertes transitives sans correctif ; seul « critical » est bloquant.

## Conséquences

- `SITE_URL` devient **sensible** : l'admin n'accepte les requêtes authentifiées que depuis cette adresse. Elle doit correspondre à l'adresse tapée dans le navigateur (si `HTTP_PORT` change, `SITE_URL` aussi).
- Après la création du premier compte, Payload n'ouvre pas la session (le jeton n'est plus dans la réponse) : il faut se connecter.
- Un script inline ajouté plus tard doit porter le nonce (`headers().get('x-nonce')`) ou il sera refusé.
- Toute nouvelle page publique est couverte par la CSP ; les tests E2E échouent si elle déclenche une violation.
