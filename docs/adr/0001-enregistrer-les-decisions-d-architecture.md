# ADR-0001 : Enregistrer les décisions d'architecture (ADR)

- **Statut** : Accepté
- **Date** : 2026-10-23
- **Décideur** : utilisateur (avec l'assistance de Claude)

## Contexte

Ce projet est un test technique réalisé avec un agent IA. Les évaluateurs jugent la pertinence des choix et la façon dont l'IA est pilotée : chaque décision doit être traçable.

## Décision

- Chaque décision (technique, architecture, process, produit) est consignée dans `docs/adr/` sous la forme `NNNN-titre-court.md`, d'après `0000-template.md`.
- **Un ADR n'est jamais supprimé ni réécrit.** Si la décision change, un nouvel ADR est créé et l'ancien passe au statut « Remplacé par ADR-NNNN » (seule modification autorisée).
- Les règles données oralement par l'utilisateur sont transformées en ADR.
- La documentation est rédigée en français.

## Alternatives envisagées

- Tout mettre dans le README : perd l'historique et le « pourquoi » des changements de cap.
- Wiki externe : éloigné du code, non versionné avec lui.

## Conséquences

Historique complet et auditable des décisions, y compris celles abandonnées. Légère charge de rédaction à chaque décision.
