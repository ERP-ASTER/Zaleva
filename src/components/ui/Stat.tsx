import type { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function Stat({
  label,
  valor,
  delta,
  deltaBom = true,
  sufixo,
  icone,
  dourado = false,
  onClick,
}: {
  label: string
  valor: string
  delta?: string
  deltaBom?: boolean
  sufixo?: string
  icone?: ReactNode
  /** Destaque dourado — reservado a valores de receita/LTV */
  dourado?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`card p-4 ${onClick ? 'cursor-pointer transition-shadow hover:shadow-raised' : ''} ${dourado ? 'border-gold-200 bg-gradient-to-br from-gold-50 to-white' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">{label}</span>
        {icone && <span className={dourado ? 'text-gold-500' : 'text-ink-faint'}>{icone}</span>}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className={`font-display text-[22px] font-semibold leading-none ${dourado ? 'text-gold-700' : 'text-ink'}`}>{valor}</span>
        {sufixo && <span className="text-[12px] text-ink-muted">{sufixo}</span>}
      </div>
      {delta && (
        <div className={`mt-1.5 flex items-center gap-1 text-[11px] font-medium ${deltaBom ? 'text-emerald-600' : 'text-red-600'}`}>
          {deltaBom ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta}
        </div>
      )}
    </div>
  )
}
