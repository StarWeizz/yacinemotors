# ADR-0003 : React + Next.js + TypeScript pour le front

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Le sujet laisse la stack libre « à justifier ». Le dépôt contenait un squelette React + Vite (SPA). Le site est un site vitrine + catalogue avec formulaires, où le référencement et la vitesse comptent pour une agence locale.

## Décision

Utiliser **React avec Next.js** en **TypeScript** (mode strict), en remplacement du squelette Vite.

Raisons données par l'utilisateur :
- robuste et moderne ;
- rapide ;
- rendu côté serveur : la page s'affiche **sans JavaScript côté utilisateur** (bon pour SEO, performances et accessibilité) ;
- modulable et branchable à toutes les API possibles (Telegram, Payload, etc.).

Les routes serveur de Next.js hébergeront l'envoi vers Telegram, ce qui garde le token côté serveur.

## Alternatives envisagées

- **React + Vite (SPA)** : rendu uniquement côté client, pas de serveur pour cacher le token Telegram sans service supplémentaire, SEO moins bon.
- **Astro / SvelteKit** : bons candidats, écartés car l'utilisateur maîtrise React et Payload s'intègre nativement à Next.js.

## Conséquences

Le squelette Vite (`vite.config.ts`, `index.html`, `src/main.tsx`) sera remplacé lors de la mise en place de Next.js. Nécessite un runtime Node en production (couvert par Docker, voir ADR-0008).
