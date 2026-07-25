import type { ReactNode } from 'react'

export function EmptyState({ icone, titulo, descricao }: { icone?: ReactNode; titulo: string; descricao?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      {icone && <div className="text-ink-faint">{icone}</div>}
      <p className="text-[13px] font-medium text-ink-soft">{titulo}</p>
      {descricao && <p className="max-w-xs text-[12px] text-ink-muted">{descricao}</p>}
    </div>
  )
}
