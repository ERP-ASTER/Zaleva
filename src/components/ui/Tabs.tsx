import type { ReactNode } from 'react'

export interface TabDef {
  id: string
  label: string
  badge?: string | number
  bloqueada?: boolean
  tooltip?: string
  icone?: ReactNode
}

export function Tabs({
  tabs,
  ativa,
  onMudar,
  className = '',
}: {
  tabs: TabDef[]
  ativa: string
  onMudar: (id: string) => void
  className?: string
}) {
  return (
    <div className={`flex items-center gap-0.5 overflow-x-auto border-b border-line scrollbar-none ${className}`} role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={ativa === t.id}
          disabled={t.bloqueada}
          title={t.tooltip}
          onClick={() => !t.bloqueada && onMudar(t.id)}
          className={`group relative flex shrink-0 items-center gap-1.5 px-3.5 py-2.5 text-[12.5px] font-medium transition-colors
            ${ativa === t.id ? 'text-brand-700' : t.bloqueada ? 'cursor-not-allowed text-ink-faint' : 'text-ink-muted hover:text-ink'}`}
        >
          {t.icone}
          {t.label}
          {t.badge !== undefined && (
            <span className="rounded-full bg-black/5 px-1.5 py-px text-[10px] font-semibold text-ink-muted">{t.badge}</span>
          )}
          {ativa === t.id && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-600" />}
        </button>
      ))}
    </div>
  )
}
