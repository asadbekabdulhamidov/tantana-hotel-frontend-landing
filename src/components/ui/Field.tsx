import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/utils/cn'

interface FieldShellProps {
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
  className?: string
}

/** Label + xato + yordamchi matnni aria orqali bog'lovchi umumiy qobiq */
export function FieldShell({ label, error, hint, required, children, className }: FieldShellProps) {
  const { t } = useTranslation()
  const id = useId()
  const errId = `${id}-err`
  const hintId = `${id}-hint`
  const describedBy = [error ? errId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[0.8125rem] font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-muted" aria-hidden>
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-subtle"> ({t('common.optional')})</span>
        )}
      </label>
      {children({ id, describedBy, invalid: !!error })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errId} role="alert" className="flex items-center gap-1.5 text-xs font-medium text-danger">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass = (invalid: boolean) =>
  cn(
    'w-full rounded-xl border bg-white px-4 text-[0.9375rem] text-ink placeholder:text-subtle transition-[border-color,box-shadow] outline-none',
    'focus:border-ink focus:ring-4 focus:ring-ink/5',
    invalid ? 'border-danger' : 'border-line hover:border-ink/25',
  )

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, required, className, ...rest },
  ref,
) {
  return (
    <FieldShell label={label} error={error} hint={hint} required={required} className={className}>
      {({ id, describedBy, invalid }) => (
        <input
          ref={ref}
          id={id}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          aria-required={required}
          className={cn(inputClass(invalid), 'h-12')}
          {...rest}
        />
      )}
    </FieldShell>
  )
})

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; hint?: string }

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, error, hint, required, className, rows = 4, ...rest },
  ref,
) {
  return (
    <FieldShell label={label} error={error} hint={hint} required={required} className={className}>
      {({ id, describedBy, invalid }) => (
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          aria-required={required}
          className={cn(inputClass(invalid), 'resize-y py-3 leading-relaxed')}
          {...rest}
        />
      )}
    </FieldShell>
  )
})
