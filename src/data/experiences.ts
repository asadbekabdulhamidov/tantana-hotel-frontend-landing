import type { ImageKey } from './images'

/**
 * Mehmonxona xizmatlari — bron platformalarida e'lon qilingan ma'lumotlar asosida
 * (`source: 'listing'`). Mehmonxona tasdiqlagach `source: 'hotel'` qiling.
 */
export interface Experience {
  key: 'restaurant' | 'breakfast' | 'events' | 'reception' | 'parking' | 'services'
  image: ImageKey
  source: 'listing' | 'hotel'
}

export const EXPERIENCES: Experience[] = [
  { key: 'restaurant', image: 'dining', source: 'listing' },
  { key: 'breakfast', image: 'cafe', source: 'listing' },
  { key: 'events', image: 'conference', source: 'listing' },
  { key: 'reception', image: 'reception', source: 'listing' },
  { key: 'parking', image: 'exteriorStreet', source: 'listing' },
  { key: 'services', image: 'lift', source: 'listing' },
]
