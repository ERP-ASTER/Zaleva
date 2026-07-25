import type { ReactNode } from 'react'
import { X } from 'lucide-react'

export function Modal({
  aberto,
  onFechar,
  titulo,
  children,
  larguraMax = 'max-w-lg',
}: {
  aberto: boolean
  onFechar: () => void
  titulo?: ReactNode
  children: ReactNode
  larguraMax?: string
}) {
  if (!aberto) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-fade-in" onClick={onFechar} />
      <div className={`relative w-full ${larguraMax} max-h-[85vh] overflow-y-auto rounded-2xl bg-surface p-6 shadow-overlay animate-fade-up`}>
        <button onClick={onFechar} className="absolute right-4 top-4 rounded-lg p-1.5 text-ink-muted hover:bg-black/5 hover:text-ink" aria-label="Fechar">
          <X size={16} />
        </button>
        {titulo && <h2 className="mb-4 pr-8 font-display text-lg font-semibold text-ink">{titulo}</h2>}
        {children}
      </div>
    </div>
  )
}
