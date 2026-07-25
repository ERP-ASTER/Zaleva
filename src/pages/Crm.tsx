import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, Clock, Filter } from 'lucide-react'
import { useCrmStore, etapasFunil } from '@/stores/useCrmStore'
import { useSessionStore } from '@/stores/useSessionStore'
import { useUiStore } from '@/stores/useUiStore'
import { contatoById } from '@/data/contacts'
import { profById } from '@/data/team'
import type { Deal, DealStage } from '@/data/types'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { brl, diasDesde } from '@/lib/format'

export default function Crm() {
  const { negociacoes, moverEtapa } = useCrmStore()
  const profissionalId = useSessionStore((s) => s.profissionalId)
  const toast = useUiStore((s) => s.toast)
  const [arrastando, setArrastando] = useState<string | null>(null)
  const [sobre, setSobre] = useState<DealStage | null>(null)
  const [filtroProc, setFiltroProc] = useState('todos')
  const [filtroOrigem, setFiltroOrigem] = useState('todas')

  const procedimentos = useMemo(() => [...new Set(negociacoes.flatMap((d) => d.procedimentos))], [negociacoes])

  const filtradas = negociacoes
    .filter((d) => (filtroProc === 'todos' ? true : d.procedimentos.includes(filtroProc)))
    .filter((d) => (filtroOrigem === 'todas' ? true : contatoById(d.contactId)?.origem === filtroOrigem))

  const soltar = (etapa: DealStage) => {
    if (!arrastando) return
    const deal = negociacoes.find((d) => d.id === arrastando)
    moverEtapa(arrastando, etapa, profById(profissionalId)?.nome ?? 'Equipe')
    if (deal && deal.etapa !== etapa) {
      toast({ titulo: 'Negociação movida', descricao: `${deal.titulo} → ${etapasFunil.find((e) => e.id === etapa)?.nome}. O dashboard comercial já reflete a mudança.`, tipo: 'sucesso' })
    }
    setArrastando(null)
    setSobre(null)
  }

  return (
    <div className="flex h-full flex-col p-6 pb-3">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="font-display text-[22px] font-semibold tracking-tight text-ink">CRM comercial</h1>
          <p className="mt-0.5 text-[12.5px] text-ink-muted">
            {filtradas.filter((d) => !['fechado', 'perdido'].includes(d.etapa)).length} negociações ativas ·{' '}
            <span className="font-semibold text-ink">{brl(filtradas.filter((d) => !['fechado', 'perdido'].includes(d.etapa)).reduce((a, d) => a + d.valor, 0))}</span> no funil · arraste os cards entre etapas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-ink-faint" />
          <select className="input w-auto py-1.5 text-[12px]" value={filtroProc} onChange={(e) => setFiltroProc(e.target.value)}>
            <option value="todos">Todos os procedimentos</option>
            {procedimentos.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <select className="input w-auto py-1.5 text-[12px]" value={filtroOrigem} onChange={(e) => setFiltroOrigem(e.target.value)}>
            <option value="todas">Todas as origens</option>
            <option>Instagram Ads</option>
            <option>Google</option>
            <option>Indicação</option>
            <option>Site</option>
          </select>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto pb-3">
        {etapasFunil.map((etapa) => {
          const deals = filtradas.filter((d) => d.etapa === etapa.id)
          const total = deals.reduce((a, d) => a + d.valor, 0)
          return (
            <div
              key={etapa.id}
              onDragOver={(e) => {
                e.preventDefault()
                setSobre(etapa.id)
              }}
              onDragLeave={() => setSobre((s) => (s === etapa.id ? null : s))}
              onDrop={() => soltar(etapa.id)}
              className={`flex w-[248px] shrink-0 flex-col rounded-xl transition-colors ${sobre === etapa.id ? 'bg-brand-50 ring-2 ring-brand-300' : 'bg-black/[0.03]'}`}
            >
              <div className="px-3 pb-2 pt-3">
                <div className="flex items-center justify-between">
                  <p className={`text-[11.5px] font-semibold uppercase tracking-wide ${etapa.id === 'fechado' ? 'text-emerald-700' : etapa.id === 'perdido' ? 'text-red-600' : 'text-ink-soft'}`}>
                    {etapa.nome}
                  </p>
                  <span className="rounded-full bg-black/5 px-1.5 py-px text-[10px] font-semibold text-ink-muted">{deals.length}</span>
                </div>
                <p className="mt-0.5 text-[10.5px] font-medium text-ink-faint">{total > 0 ? brl(total) : '—'}</p>
              </div>
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-2 pb-2">
                {deals.map((d) => (
                  <CardDeal key={d.id} deal={d} onDragStart={() => setArrastando(d.id)} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CardDeal({ deal, onDragStart }: { deal: Deal; onDragStart: () => void }) {
  const navigate = useNavigate()
  const contato = contatoById(deal.contactId)!
  const parado = diasDesde(deal.atualizadoEm)
  const paradoDemais = parado > 7 && !['fechado', 'perdido'].includes(deal.etapa)

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={() => navigate(`/crm/${deal.id}`)}
      className={`cursor-grab rounded-xl border bg-surface p-3 shadow-card transition-all hover:shadow-raised active:cursor-grabbing ${paradoDemais ? 'border-red-200' : 'border-line'}`}
    >
      <div className="flex items-center gap-2">
        <Avatar nome={contato.nome} cor={contato.avatarColor} size={28} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-semibold text-ink">{contato.nome}</p>
          <p className="truncate text-[10.5px] text-ink-muted">{contato.origem}{contato.campanha ? ` · ${contato.campanha}` : ''}</p>
        </div>
        {deal.temperatura === 'quente' && <Flame size={13} className="shrink-0 text-orange-500" />}
      </div>
      <p className="mt-2 truncate text-[11.5px] text-ink-soft">{deal.procedimentos.join(' + ')}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[13px] font-bold text-ink">{brl(deal.valor)}</span>
        <span className="text-[10.5px] text-ink-muted">{deal.probabilidade}%</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-black/5">
        <div className="h-full rounded-full bg-brand-500" style={{ width: `${deal.probabilidade}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between gap-1">
        {deal.proximaAcao ? (
          <p className="truncate text-[10px] text-ink-muted">→ {deal.proximaAcao.descricao}</p>
        ) : deal.motivoPerda ? (
          <p className="truncate text-[10px] text-red-600">{deal.motivoPerda}</p>
        ) : (
          <span />
        )}
        <span className={`flex shrink-0 items-center gap-0.5 text-[10px] font-medium ${paradoDemais ? 'text-red-600' : 'text-ink-faint'}`}>
          <Clock size={9} /> {parado === 0 ? 'hoje' : `${parado}d`}
        </span>
      </div>
    </div>
  )
}
