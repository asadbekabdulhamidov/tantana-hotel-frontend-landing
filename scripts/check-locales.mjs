// Barcha tillarda kalitlar mosligini tekshiradi (plural qo'shimchalarni hisobga olgan holda)
import { readFileSync } from 'node:fs'
const langs = ['uz', 'ru', 'en', 'tr']
const strip = (k) => k.replace(/_(zero|one|two|few|many|other)$/, '')
function flat(o, p = '') {
  return Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? flat(v, `${p}${k}.`) : [`${p}${k}`],
  )
}
const sets = Object.fromEntries(
  langs.map((l) => [l, new Set(flat(JSON.parse(readFileSync(`src/locales/${l}/translation.json`, 'utf8'))).map(strip))]),
)
let ok = true
for (const l of langs) {
  for (const k of sets.en) if (!sets[l].has(k)) { ok = false; console.log(`[${l}] missing: ${k}`) }
  for (const k of sets[l]) if (!sets.en.has(k)) { ok = false; console.log(`[${l}] extra: ${k}`) }
}
// Cyrillic harflar lotin tillarda tasodifan qolmaganini tekshirish
for (const l of ['uz', 'en', 'tr']) {
  const raw = readFileSync(`src/locales/${l}/translation.json`, 'utf8')
  if (/[Ѐ-ӿ]/.test(raw)) { ok = false; console.log(`[${l}] contains Cyrillic characters`) }
}
console.log(ok ? 'All locales in sync ✓' : 'Locale problems found')
process.exit(ok ? 0 : 1)
