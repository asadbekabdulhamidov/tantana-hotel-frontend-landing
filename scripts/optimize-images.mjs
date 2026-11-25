// src/images/*.jpg (asl suratlar) -> public/images/hotel/<kalit>-<kenglik>.{avif,webp}
// va src/data/hotelPhotos.gen.ts (nisbat va mavjud kengliklar) ni yaratadi.
// Ishga tushirish: npm run images
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs'
import sharp from 'sharp'

const WIDTHS = [480, 768, 1024, 1600, 2400]
const SRC = 'src/images'
const OUT = 'public/images/hotel'
const manifest = JSON.parse(readFileSync('src/data/hotelPhotos.json', 'utf8')).photos
mkdirSync(OUT, { recursive: true })

const meta = {}
for (const [key, { file, position }] of Object.entries(manifest)) {
  const path = `${SRC}/${file}`
  if (!existsSync(path)) {
    console.warn(`⚠ ${key}: ${path} topilmadi`)
    continue
  }
  const img = sharp(path).rotate()
  const { width, height } = await img.metadata()
  // Asl o'lchamdan kattalashtirmaymiz
  const widths = [...new Set([...WIDTHS.filter((w) => w < width), width])]
  const srcTime = statSync(path).mtimeMs
  for (const w of widths) {
    const target = `${OUT}/${key}-${w}.webp`
    // Allaqachon yaratilgan va asl fayldan yangi bo'lsa — o'tkazib yuboramiz
    if (existsSync(target) && existsSync(`${OUT}/${key}-${w}.avif`) && statSync(target).mtimeMs >= srcTime) continue
    const base = sharp(path).rotate().resize({ width: w, withoutEnlargement: true })
    await base.clone().avif({ quality: 55, effort: 4 }).toFile(`${OUT}/${key}-${w}.avif`)
    await base.clone().webp({ quality: 74 }).toFile(`${OUT}/${key}-${w}.webp`)
  }
  meta[key] = { ratio: +(width / height).toFixed(4), widths, ...(position ? { position } : {}) }

}

console.log(`✓ Mehmonxona suratlari tayyor: ${Object.keys(meta).length} ta`)
writeFileSync(
  'src/data/hotelPhotos.gen.ts',
  `// Avtomatik yaratilgan — scripts/optimize-images.mjs. Qo'lda o'zgartirmang.\nexport const HOTEL_PHOTOS = ${JSON.stringify(meta, null, 2)} as const\n`,
)
