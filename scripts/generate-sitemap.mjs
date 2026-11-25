// public/sitemap.xml ni yaratadi: har bir sahifa × 4 til, hreflang alternativlari bilan.
// Ishga tushirish: npm run sitemap  (build'dan oldin avtomatik ham ishlaydi)
import { readFileSync, writeFileSync } from 'node:fs'

// Domen: SITE_URL=https://sizning-domen.uz npm run build
const SITE = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://YOUR-DOMAIN.uz').replace(/\/$/, '')
if (SITE.includes('YOUR-DOMAIN')) console.warn('⚠ SITE_URL berilmagan — sitemap.xml da vaqtinchalik domen ishlatildi')
const LANGS = ['uz', 'ru', 'en', 'tr']
const roomsSrc = readFileSync('src/data/rooms.ts', 'utf8')
const slugs = [...roomsSrc.matchAll(/slug: '([^']+)'/g)].map((m) => m[1])
const pages = ['/', '/rooms', ...slugs.map((s) => `/rooms/${s}`), '/experiences', '/about', '/discover', '/contact']
const today = new Date().toISOString().slice(0, 10)

const urls = pages.flatMap((p) =>
  LANGS.map((l) => {
    const alt = [...LANGS.map((a) => `    <xhtml:link rel="alternate" hreflang="${a}" href="${SITE}/${a}${p}"/>`), `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/uz${p}"/>`].join('\n')
    return `  <url>\n    <loc>${SITE}/${l}${p}</loc>\n    <lastmod>${today}</lastmod>\n${alt}\n  </url>`
  }),
)

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
writeFileSync('public/sitemap.xml', xml)
writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\nDisallow: /*/booking/confirmation\n\nSitemap: ${SITE}/sitemap.xml\n`)
console.log(`sitemap.xml: ${urls.length} URLs`)
