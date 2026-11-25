import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { ALL_AMENITIES, CURRENCY, MAX_GUESTS, PRICE_MAX, PRICE_MIN, ROOM_TYPES, type AmenityKey, type RoomType } from '@/data/rooms'
import { useLang } from '@/hooks/useLang'
import { formatPrice } from '@/utils/date'
import { cn } from '@/utils/cn'
import { AMENITY_ICONS } from './amenityIcons'

export interface FilterState {
  guests: number
  types: RoomType[]
  maxPrice: number
  amenities: AmenityKey[]
}

export const EMPTY_FILTERS: FilterState = { guests: 0, types: [], maxPrice: PRICE_MAX, amenities: [] }

function toggle<T>(list: T[], item: T) {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
}

export function RoomFilters({ value, onChange }: { value: FilterState; onChange: (v: FilterState) => void }) {
  const { t } = useTranslation()
  const lang = useLang()
  const id = useId()

  return (
    <div className="flex flex-col gap-8">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">{t('rooms.filters.guests')}</legend>
        <div className="flex flex-wrap gap-2">
          {[0, ...Array.from({ length: MAX_GUESTS }, (_, i) => i + 1)].map((n) => (
            <Chip key={n} name={`${id}-guests`} type="radio" checked={value.guests === n} onChange={() => onChange({ ...value, guests: n })}>
              {n === 0 ? t('rooms.filters.any') : `${n}+`}
            </Chip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold">{t('rooms.filters.type')}</legend>
        <div className="flex flex-wrap gap-2">
          {ROOM_TYPES.map((type) => (
            <Chip key={type} type="checkbox" checked={value.types.includes(type)} onChange={() => onChange({ ...value, types: toggle(value.types, type) })}>
              {t(`rooms.filters.types.${type}`)}
            </Chip>
          ))}
        </div>
      </fieldset>

      <div>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <label htmlFor={`${id}-price`} className="text-sm font-semibold">
            {t('rooms.filters.price')}
          </label>
          <output htmlFor={`${id}-price`} className="text-sm text-muted">
            {value.maxPrice >= PRICE_MAX ? t('rooms.filters.priceAny') : t('rooms.filters.priceUpTo', { value: formatPrice(value.maxPrice, lang, CURRENCY) })}
          </output>
        </div>
        <input
          id={`${id}-price`}
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={5}
          value={value.maxPrice}
          onChange={(e) => onChange({ ...value, maxPrice: Number(e.target.value) })}
          aria-valuetext={formatPrice(value.maxPrice, lang, CURRENCY)}
          className="h-2 w-full cursor-pointer accent-ink"
        />
        <div className="mt-1.5 flex justify-between text-xs text-subtle">
          <span>{formatPrice(PRICE_MIN, lang, CURRENCY)}</span>
          <span>{formatPrice(PRICE_MAX, lang, CURRENCY)}</span>
        </div>
        <p className="mt-2 text-[0.6875rem] text-[#8a5300]">{t('rooms.card.sample')}</p>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold">{t('rooms.filters.amenities')}</legend>
        <div className="flex flex-wrap gap-2">
          {ALL_AMENITIES.map((a) => {
            const Icon = AMENITY_ICONS[a]
            return (
              <Chip key={a} type="checkbox" checked={value.amenities.includes(a)} onChange={() => onChange({ ...value, amenities: toggle(value.amenities, a) })}>
                <Icon className="size-3.5" aria-hidden strokeWidth={1.75} />
                {t(`rooms.amenities.${a}`)}
              </Chip>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}

/** Haqiqiy input asosidagi "chip" — klaviatura va screen reader'ga mos */
function Chip({
  children,
  checked,
  onChange,
  type,
  name,
}: {
  children: React.ReactNode
  checked: boolean
  onChange: () => void
  type: 'checkbox' | 'radio'
  name?: string
}) {
  return (
    <label
      className={cn(
        'relative inline-flex cursor-pointer select-none items-center gap-1.5 rounded-full border px-3.5 py-2 text-[0.8125rem] font-medium transition-colors',
        'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink',
        checked ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink/40',
      )}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      {checked && type === 'checkbox' && <Check className="size-3.5" aria-hidden />}
      {children}
    </label>
  )
}
