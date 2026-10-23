# ADR-0005 : Journal des conversations avec l'IA

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Le sujet demande d'expliquer comment l'IA a été cadrée et d'avoir « au moins un exemple où vous avez corrigé, refusé ou réorienté » ses propositions.

## Décision

Tenir un log des conversations dans `docs/conversations/` (un fichier par session, `AAAA-MM-JJ-sujet.md`), comprenant : demandes, propositions de l'IA, corrections/refus et leurs raisons, résultats. Mis à jour dans des commits `docs(log)` dédiés.

## Alternatives envisagées

- Export brut des conversations : trop verbeux et peu exploitable.
- Aucun log : impossible de prouver le pilotage de l'IA.

## Conséquences

Matière directe pour la section « Workflow de développement assisté par IA » du README.
