import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/utils/cn'

type Variant = 'primary' | 'secondary' | 'light' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface StyleProps {
  variant?: Variant
  size?: Size
  /** Staymint uslubidagi oq doiradagi o'q */
  arrow?: boolean
  block?: boolean
}

const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-out-soft)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-white hover:bg-ink-soft shadow-[0_6px_18px_-8px_rgb(17_17_17/0.5)]',
  secondary: 'border border-line bg-canvas text-ink hover:border-ink/30 hover:bg-surface',
  light: 'bg-white text-ink hover:bg-white/90',
  ghost: 'border border-white/40 text-white hover:bg-white/10 hover:border-white/70',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-[0.8125rem]',
  md: 'h-12 px-5 text-sm',
  lg: 'h-14 px-6 text-[0.9375rem]',
}

export function buttonClass({ variant = 'primary', size = 'md', arrow, block }: StyleProps, extra?: string) {
  return cn(base, variants[variant], sizes[size], arrow && 'pr-1.5', block && 'w-full', extra)
}

function Arrow({ variant = 'primary' }: { variant?: Variant }) {
  const dark = variant === 'primary' || variant === 'ghost'
  return (
    <span
      aria-hidden
      className={cn(
        'ml-1 grid size-8 place-items-center rounded-full transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover/btn:translate-x-0.5',
        dark ? 'bg-white text-ink' : 'bg-ink text-white',
      )}
    >
      <ArrowRight className="size-4 -rotate-45 transition-transform duration-300 group-hover/btn:rotate-0" strokeWidth={2.25} />
    </span>
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleProps & { children: ReactNode }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, arrow, block, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClass({ variant, size, arrow, block }, className)} {...rest}>
      {children}
      {arrow && <Arrow variant={variant} />}
    </button>
  )
})

type ButtonLinkProps = LinkProps & StyleProps & { children: ReactNode }

export function ButtonLink({ variant, size, arrow, block, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClass({ variant, size, arrow, block }, className)} {...rest}>
      {children}
      {arrow && <Arrow variant={variant} />}
    </Link>
  )
}
