// Regenerates docs/adr/README.md from the ADR files (numbers, titles, status, dates).
// Usage: npm run adr:index. The ADRs themselves are never rewritten (ADR-0001).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const dir = path.join(process.cwd(), 'docs', 'adr')
const files = readdirSync(dir)
  .filter((name) => /^\d{4}-.+\.md$/.test(name) && !name.startsWith('0000-'))
  .sort()

const rows = files.map((name) => {
  const text = readFileSync(path.join(dir, name), 'utf8')
  const title = /^# ADR-\d{4} : (.+)$/m.exec(text)?.[1] ?? name
  const status = /^- \*\*Statut\*\* : (.+)$/m.exec(text)?.[1] ?? ''
  const date = /^- \*\*Date\*\* : (.+)$/m.exec(text)?.[1] ?? ''
  return `| [${name.slice(0, 4)}](${name}) | ${title} | ${status} | ${date} |`
})

const output = `# Décisions d'architecture (ADR)

Chaque décision du projet a son ADR, dans l'ordre où elle a été prise. Un ADR n'est **jamais supprimé ni réécrit** : si une décision change, un nouvel ADR la remplace ou la complète (voir [ADR-0001](${files[0]}) et le modèle [0000-template.md](0000-template.md)).

Ce fichier est généré : \`npm run adr:index\`.

| N° | Décision | Statut | Date |
|---|---|---|---|
${rows.join('\n')}
`

writeFileSync(path.join(dir, 'README.md'), output)
console.log(`${rows.length} ADR indexed`)
