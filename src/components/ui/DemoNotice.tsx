import { Info } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

/** Demo/placeholder holatlarini aniq ko'rsatadigan eslatma (faqat rangga tayanmaydi — ikonka + matn) */
export function DemoNotice({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div role="note" className={cn('flex gap-3 rounded-2xl border border-[#f0dcb4] bg-[#fffaf0] p-4 text-sm leading-relaxed text-[#6b4a12]', className)}>
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  )
}
