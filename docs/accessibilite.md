# Audit d'accessibilité

Audit réalisé le 2026-10-27 sur le site tel qu'il est après la PR #10, avec Claude Code. Référentiel visé : **WCAG 2.2 niveau AA**. Décision : [ADR-0027](adr/0027-audit-d-accessibilite-et-tests-axe.md).

## Méthode

1. **Passage automatique** avec axe-core (règles WCAG 2.0 / 2.1 / 2.2 A et AA, plus les bonnes pratiques) sur **10 pages**, en bureau (1440 px) et en mobile (390 px) : accueil, catalogue (sans filtre, filtré, sans résultat), fiche d'un véhicule disponible et d'un véhicule indisponible, réservation, contact, crédits photos, page introuvable.
2. **Contrôles manuels** de ce que les outils automatiques ne voient pas : reflow à 320 px (WCAG 1.4.10), espacement du texte (1.4.12), ordre de tabulation et indicateur de focus (2.4.3, 2.4.7), lien d'évitement (2.4.1), gestion du focus après une erreur de formulaire (3.3.1), contraste du texte posé sur la photo du hero (1.4.3), taille des cibles (2.5.8).
3. **Tests permanents** : tout ce qui est automatisable est devenu un test E2E (`e2e/accessibility.spec.ts`, 36 tests) exécuté par la CI. Chaque test a été vérifié en retirant les corrections : sans elles, 28 des 36 échouent.

## Défauts trouvés et corrigés

| # | Critère WCAG | Défaut | Correction |
|---|---|---|---|
| 1 | 2.5.3 Étiquette dans le nom | Le lien du logo avait un `aria-label` (« Yacine Motors, accueil ») qui ne reprenait pas le texte visible (« Yacine Motors Marseille ») | `aria-label` retiré : le texte visible fait le nom accessible |
| 2 | 1.3.1 / bonne pratique | Sur le catalogue, les titres des cartes étaient des `h3` sous un `h1` : niveau `h2` sauté | Niveau de titre réglable ; `h2` sur le catalogue, `h3` sur l'accueil (sous « Notre sélection ») |
| 3 | 3.1.1 / 1.3.1 | Les adresses inconnues affichaient la page 404 par défaut de Next.js : pas de `lang`, pas de repère `main`, pas de navigation | Page « Page introuvable » dans la mise en page du site (langue, repères, liens de retour) |
| 4 | 1.4.10 Reflow | À 320 px, l'en-tête dépassait (365 px de large) : défilement horizontal | En-tête et navigation qui passent à la ligne |
| 5 | 1.4.3 Contraste | Texte indicatif (`placeholder`) à 50 % d'opacité, environ 3,4:1 | Gris acier opaque (#6a7077, 4,9:1) |
| 6 | 2.5.8 Taille de la cible | Case « Disponibles uniquement » : ligne de 20 px de haut | Case de 20 px, ligne de 32 px minimum |
| 7 | 3.3.1 Identification des erreurs | Après une erreur renvoyée par le serveur, le focus restait sur le bouton | Le focus passe au premier champ en erreur |
| 8 | 2.4.1 Contourner des blocs | Après le lien d'évitement, le focus restait sur `body` | `main` reçoit le focus (`tabindex="-1"`, sans cadre visible) |
| 9 | 2.4.11 Focus non masqué | L'en-tête collant pouvait recouvrir un élément atteint au clavier | `scroll-padding-top` sur la page |
| 10 | 2.4.4 Fonction du lien | Plusieurs liens « source » identiques sur la page des crédits | Nom accessible précis : « Source de la photo : … » |

## Vérifié et conforme

- **Contraste du texte sur la photo du hero** : calculé sur la zone la plus claire de l'image sous l'aplat à 60 % : **5,6:1** pour le blanc (4,9:1 pour le texte à 85 %), au-dessus de 4,5:1. Le gros titre n'exige que 3:1.
- Lien d'évitement en première position, indicateur de focus de 2 px sur chaque arrêt de tabulation, aucune coupure de contenu avec l'espacement du texte imposé, page lisible sans JavaScript, `prefers-reduced-motion` respecté, curseur personnalisé masqué aux technologies d'assistance et sans effet sur le curseur natif.
- Langue (`lang="fr"`), titre de page unique par page, repères (`banner`, `navigation` nommées, `main`, `contentinfo`), formulaires (libellés liés, champs obligatoires indiqués, erreurs reliées par `aria-describedby`, annonce `role="status"`), état de disponibilité jamais porté par la couleur seule (point plein ou creux + texte).

## Ce que cet audit ne couvre pas

- **Aucun test avec un lecteur d'écran** (NVDA, VoiceOver, TalkBack) : l'ordre de lecture et la qualité des annonces n'ont pas été écoutés.
- **Aucun test avec de vraies personnes** (navigation au clavier seul, commande vocale, zoom du navigateur à 200 % et 400 %, mode contraste élevé de Windows).
- Un seul navigateur automatisé (Chromium) ; pas de Firefox ni de Safari.
- **Le back-office Payload (`/admin`) n'est pas audité** : c'est l'interface fournie par Payload.
- Les outils automatiques détectent environ un tiers des problèmes d'accessibilité : « zéro violation » ne veut pas dire « conforme ». Aucune déclaration de conformité (RGAA) n'est revendiquée.
- Les photos libres (Wikimedia Commons) ont pour texte alternatif le nom du véhicule, pas une description de la scène.

## Relancer l'audit

```bash
npx playwright test e2e/accessibility.spec.ts
```
