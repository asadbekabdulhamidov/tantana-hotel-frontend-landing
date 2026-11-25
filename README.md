# Tantana Hotel — frontend

Farg'onadagi **Tantana Hotel** uchun 4 tilli (uz / ru / en / tr) premium mehmonxona sayti.
Dizayn — Staymint uslubida: oq va och kulrang fon, qora "pill" tugmalar, katta yumaloq rasmlar, shisha (glass) panelli kartalar.

## Ishga tushirish

```bash
npm install
npm run dev        # http://localhost:5173  → avtomatik /uz/ ga yo'naltiradi
npm run build      # tarjimalarni tekshiradi, sitemap.xml yaratadi, dist/ ga build qiladi
npm run preview    # build natijasini ko'rish
```

Node.js 20+ kerak.

## Texnologiyalar

React 19 + TypeScript · Vite 6 · Tailwind CSS 4 · Motion (Framer Motion) · React Router 7 · i18next · React Hook Form + Zod · Lucide.
SEO metateglar React 19 ning o'zida chiqadigan `<title>/<meta>/<link>` orqali, qo'shimcha kutubxona kerak emas.

## Tuzilma

```
src/
  components/
    layout/    Header, MobileMenu, Footer, Layout, Logo, MobileBookingBar
    booking/   BookingSearch, BookingForm, BookingSummary, StepIndicator
    rooms/     RoomCard, RoomListItem, RoomGallery (+lightbox), RoomFilters, RoomFacts, RoomPrice
    sections/  HeroSection, TravelStyles, FeaturedRooms, WhySection, ExperiencesTeaser,
               ExperienceRow, DiscoverFergana, CtaBanner, PageHeader
    ui/        Button, Container, SectionHeading, Img, Reveal, Field, Badge, DemoNotice,
               Breadcrumbs, LanguageSwitcher
    seo/       Seo (title, description, canonical, hreflang, OG, Twitter, JSON-LD)
  pages/       Home, Rooms, RoomDetails, Experiences, About, Discover, Contact, Booking, Confirmation, NotFound
  data/        hotel.ts, rooms.ts, experiences.ts, destinations.ts, images.ts
  locales/     uz/ ru/ en/ tr/ translation.json
  i18n/        sozlamalar va tilni dinamik yuklash
  hooks/ utils/
scripts/       check-locales.mjs, generate-sitemap.mjs
```

## Marshrutlar

`/:lang/` — `uz` (standart), `ru`, `en`, `tr`

| Sahifa | Yo'l |
|---|---|
| Bosh sahifa | `/uz/` |
| Xonalar | `/uz/rooms?checkIn=2026-12-01&checkOut=2026-12-03&guests=2` |
| Xona | `/uz/rooms/deluxe-double` |
| Xizmatlar | `/uz/experiences` |
| Biz haqimizda | `/uz/about` |
| Farg'ona | `/uz/discover` |
| Aloqa | `/uz/contact` |
| Bron | `/uz/booking` |
| Tasdiq | `/uz/booking/confirmation` |

Til almashtirilganda sahifa va query parametrlar saqlanadi, til `localStorage` ga yoziladi, `<html lang>` va metateglar yangilanadi.

## ⚠️ Mehmonxonadan olinishi kerak bo'lgan ma'lumotlar

Sayt **hech qanday ma'lumotni o'ylab topmaydi**. Quyidagilar hozircha placeholder:

| Nima | Qayerda o'zgartiriladi |
|---|---|
| Telefon, email, ijtimoiy tarmoqlar | `src/data/hotel.ts` (`null` → haqiqiy qiymat; sayt avtomatik ko'rsatadi) |
| Xonalarning maydoni va narxi | `src/data/rooms.ts`; tayyor bo'lgach `placeholder: false` |
| Domen (canonical, hreflang, sitemap) | `.env` → `VITE_SITE_URL=https://domen.uz`, build: `SITE_URL=https://domen.uz npm run build` |
| Farg'ona bo'limi rasmlari (hozir Unsplash / placeholder) | `src/data/images.ts` |
| Xizmatlar tasdig'i | `src/data/experiences.ts` — `source: 'hotel'` |
| Rasmiy logotip | `src/components/layout/Logo.tsx` |

Manzil (Al-Farg'oniy ko'chasi 122A), 64 xona va xizmatlar ro'yxati ochiq bron platformalaridan olingan — mehmonxona bilan tasdiqlang.
Check-in/check-out bo'yicha manbalar farq qiladi (14:00/12:00 va 12:30/12:30) — hozir 14:00/12:00 ko'rsatilgan.

## Mehmonxona suratlari

Asl suratlar `src/images/` da. Yangi surat qo'shish:
1. Faylni `src/images/` ga tashlang
2. `src/data/hotelPhotos.json` ga kalit qo'shing (masalan `"roomSuite": { "file": "123.jpg" }`)
3. `npm run dev` yoki `npm run build` `public/images/hotel/` ga AVIF/WebP versiyalarini avtomatik yaratadi (qo'lda: `npm run images`)
4. Tarjimalarga `images.<kalit>` alt matnini qo'shing

Hero slider suratlari: `src/components/sections/HeroSlider.tsx` → `HERO_SLIDES`.
Hozirgi suratlar Booking.com'dan (1024 px) — mehmonxonadan asl fayllar olinsa, hero ancha tiniqroq bo'ladi.

## Bron oqimi

Sanalar → xona → mehmon ma'lumotlari → tekshirish → tasdiq. Hozir **demo**: hech narsa yuborilmaydi, bu sahifalarda aniq yozib qo'yilgan.
Backend ulanganda `src/pages/BookingPage.tsx` dagi `confirm()` va `src/pages/ContactPage.tsx` dagi `onSubmit()` ni API chaqiruviga almashtiring.

## SEO

- Har sahifada alohida title/description, canonical, `hreflang` (uz/ru/en/tr + x-default), OG va Twitter teglari
- `Hotel` va `BreadcrumbList` JSON-LD; Offer/Room schema ataylab yo'q (narxlar hali haqiqiy emas)
- `public/robots.txt`, `public/sitemap.xml` (`npm run sitemap`)
- `index.html` da JS'siz ham ko'rinadigan statik Hotel JSON-LD va `<noscript>` matni

**Tavsiya:** bu SPA (client-side render). Google JS'ni render qiladi, lekin Yandex va ijtimoiy tarmoqlar preview'lari uchun
har bir til/sahifa server tomonda HTML bo'lishi yaxshiroq. Production uchun **Next.js (App Router)** ga ko'chirish
yoki `vite-react-ssg` bilan statik pre-render qilish tavsiya etiladi — komponentlar va tarjimalar o'zgarishsiz ko'chadi.

## Performance va accessibility

- Hero rasm `fetchpriority="high"`, qolganlari `loading="lazy"`; `srcset` + `auto=format` (AVIF/WebP)
- Sahifalar va tillar alohida chunk'larda (code splitting); shriftlar mahalliy (`@fontsource`)
- Animatsiyalar faqat `opacity`/`transform`, `prefers-reduced-motion` hurmat qilinadi
- Skip-link, ko'rinadigan fokus, aria-label'lar, klaviatura bilan ishlaydigan galereya (← → Esc) va native `<dialog>`
