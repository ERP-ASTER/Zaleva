import type { ReactNode } from 'react'

export function PageHeader({ titulo, subtitulo, acoes }: { titulo: ReactNode; subtitulo?: ReactNode; acoes?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-[22px] font-semibold tracking-tight text-ink">{titulo}</h1>
        {subtitulo && <p className="mt-0.5 text-[12.5px] text-ink-muted">{subtitulo}</p>}
      </div>
      {acoes && <div className="flex items-center gap-2">{acoes}</div>}
    </div>
  )
}
