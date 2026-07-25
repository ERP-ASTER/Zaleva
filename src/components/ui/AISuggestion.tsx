import type { ReactNode } from 'react'
import { Sparkles, Check, Pencil, X } from 'lucide-react'

/** Selo visual de conteúdo de IA — usado em chips, mensagens e blocos. */
export function AIChip({ children = 'Sugestão da IA', className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-ai-100 px-2 py-0.5 text-[10.5px] font-semibold text-ai-700 ${className}`}>
      <Sparkles size={10} />
      {children}
    </span>
  )
}

/**
 * Container padrão para conteúdo gerado por IA: visual distinto (borda tracejada
 * lilás) + ações Aprovar / Editar / Descartar. Nada de IA entra no registro sem
 * aprovação explícita (CFM 2.454/2026).
 */
export function AISuggestion({
  titulo = 'Sugestão da IA',
  children,
  onAprovar,
  onEditar,
  onDescartar,
  labelAprovar = 'Aprovar',
  compacto = false,
  className = '',
}: {
  titulo?: string
  children: ReactNode
  onAprovar?: () => void
  onEditar?: () => void
  onDescartar?: () => void
  labelAprovar?: string
  compacto?: boolean
  className?: string
}) {
  return (
    <div className={`rounded-xl border border-dashed border-ai-300 bg-ai-50 ${compacto ? 'p-3' : 'p-4'} animate-fade-up ${className}`}>
      <div className="mb-2 flex items-center gap-1.5">
        <Sparkles size={13} className="text-ai-600" />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ai-700">{titulo}</span>
      </div>
      <div className="text-[13px] leading-relaxed text-ink">{children}</div>
      {(onAprovar || onEditar || onDescartar) && (
        <div className="mt-3 flex items-center gap-2">
          {onAprovar && (
            <button onClick={onAprovar} className="btn bg-ai-600 px-3 py-1.5 text-[12px] text-white hover:bg-ai-700">
              <Check size={13} /> {labelAprovar}
            </button>
          )}
          {onEditar && (
            <button onClick={onEditar} className="btn border border-ai-200 bg-white px-3 py-1.5 text-[12px] text-ai-700 hover:bg-ai-100">
              <Pencil size={12} /> Editar
            </button>
          )}
          {onDescartar && (
            <button onClick={onDescartar} className="btn px-3 py-1.5 text-[12px] text-ink-muted hover:bg-black/5">
              <X size={13} /> Descartar
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/** Indicador "IA processando..." com pontinhos. */
export function AIPensando({ texto = 'IA processando' }: { texto?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-ai-300 bg-ai-50 p-3 text-[12.5px] text-ai-700">
      <Sparkles size={13} className="animate-pulse-soft" />
      {texto}
      <span className="flex gap-0.5">
        <span className="h-1 w-1 animate-bounce rounded-full bg-ai-500" style={{ animationDelay: '0ms' }} />
        <span className="h-1 w-1 animate-bounce rounded-full bg-ai-500" style={{ animationDelay: '150ms' }} />
        <span className="h-1 w-1 animate-bounce rounded-full bg-ai-500" style={{ animationDelay: '300ms' }} />
      </span>
    </div>
  )
}
