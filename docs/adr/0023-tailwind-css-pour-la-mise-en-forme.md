# ADR-0023 : Tailwind CSS pour la mise en forme

- **Statut** : Accepté — complète l'ADR-0017 (paragraphe « Style ») et l'ADR-0022 (dernière alternative envisagée)
- **Date** : 2026-10-26
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

L'ADR-0017 avait écarté Tailwind (« dépendance supplémentaire sans besoin réel à cette échelle ») au profit d'un CSS global écrit à la main. Avec la refonte visuelle (ADR-0022), le design repose sur un système de jetons (couleurs, échelle typographique, espacements) et beaucoup de variantes responsives. L'utilisateur a demandé d'utiliser Tailwind CSS. Les ADR ne se réécrivent pas : celui-ci complète les deux précédents.

## Décision

- **Tailwind CSS v4** avec son plugin PostCSS (`@tailwindcss/postcss`), importé dans `src/app/(frontend)/globals.css`. Le back-office Payload (`(payload)`) garde ses propres styles : la feuille Tailwind n'est chargée que par le groupe de routes du site.
- **Jetons de design dans `@theme`** : couleurs (`paper`, `pearl`, `mist`, `line`, `steel`, `graphite`, `ink`, `brick`), échelle typographique, polices (variables `next/font`) et courbe d'animation. Les classes utilitaires (`bg-pearl`, `text-steel`, `font-serif`, `text-4xl`…) sortent de ces jetons : aucune valeur de couleur n'est écrite dans les composants.
- **Utilitaires dans le JSX** pour la mise en page et le style des composants. Une petite couche `@layer components` (`@apply`) ne garde que les éléments répétés partout : boutons, champs de formulaire, avis, titre de page.
- **CSS maison conservé** uniquement là où Tailwind n'a pas d'équivalent simple : curseur (`mix-blend-mode`), masque des mots du titre, soulignement animé de la navigation, champ piège anti-spam.
- Variante personnalisée `js:` (classe `js` posée avant le premier rendu) pour que les animations partent de l'état masqué sans clignotement, et sans rien masquer si JavaScript est absent.
- Pas de bibliothèque de composants (shadcn, etc.) : voir ADR-0022.

## Alternatives envisagées

- **CSS global écrit à la main** (ADR-0017) : sans dépendance, mais les variantes responsives et d'état deviennent longues à maintenir, et les valeurs se dispersent.
- **CSS Modules** : isolation propre, mais pas de système de jetons partagé ni de variantes prêtes à l'emploi.
- **Tailwind v3** : plus ancien ; la v4 configure les jetons directement en CSS.

## Conséquences

- Nouvelles dépendances de développement : `tailwindcss`, `@tailwindcss/postcss`, `postcss` (nécessaires au build, déjà installées par le Dockerfile à l'étape de construction).
- Les preflights de Tailwind remettent à zéro les styles du navigateur : les composants du site déclarent explicitement leurs marges et tailles de texte.
- Les noms de classes ne sont plus sémantiques : les tests E2E s'appuient sur les rôles ARIA et les textes, pas sur les classes (voir ADR-0007).
