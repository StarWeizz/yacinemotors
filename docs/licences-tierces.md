# Licences des éléments tiers

Le **code** du projet est sous licence MIT (fichier `LICENSE`, [ADR-0034](adr/0034-licence-mit.md)). Cette licence ne s'applique pas aux éléments ci-dessous, qui gardent la leur.

Le site réutilise quelques éléments libres. Les auteurs sont aussi crédités sur la page publique `/credits-photos`.

| Élément | Source | Licence | Où |
|---|---|---|---|
| Photographies des véhicules et de l'accueil | Wikimedia Commons (auteurs et fichiers dans `src/lib/vehicles/photo-credits.ts`) | CC BY-SA 4.0 (attribution et partage dans les mêmes conditions, pour les **photos** seulement) | `public/images/` |
| Polices Newsreader et Inter | Paquets npm `@fontsource-variable/newsreader` et `@fontsource-variable/inter` 5.3.0 | SIL Open Font License 1.1 | `src/app/fonts/` (textes de licence : `LICENSES.txt`) |
| Icône du site (pictogramme « car ») | [Tabler Icons](https://github.com/tabler/tabler-icons) | MIT (texte ci-dessous) | `src/app/icon.svg`, `apple-icon.png`, `favicon.ico` |
| Carte | Google Maps, chargée au clic seulement | Conditions de Google, aucun code ni donnée n'est copié dans le dépôt | page `/contact` |

## Tabler Icons — licence MIT

```text
MIT License

Copyright (c) 2020-2026 Paweł Kuna

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
