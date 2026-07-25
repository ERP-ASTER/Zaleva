import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { TimelineEvent, TimelineTipo } from '@/data/types'
import { fmtRelativa } from '@/lib/format'
import {
  MessageCircle,
  CalendarDays,
  Stethoscope,
  FileText,
  FileSignature,
  CircleDollarSign,
  Syringe,
  HeartPulse,
  AlertTriangle,
  Star,
  UserPlus,
  CheckSquare,
  ArrowUpRight,
} from 'lucide-react'

const config: Record<TimelineTipo, { icone: typeof MessageCircle; cor: string; label: string }> = {
  lead: { icone: UserPlus, cor: 'bg-ai-100 text-ai-700', label: 'Lead' },
  conversa: { icone: MessageCircle, cor: 'bg-sky-50 text-sky-600', label: 'Conversa' },
  agendamento: { icone: CalendarDays, cor: 'bg-brand-50 text-brand-600', label: 'Agenda' },
  consulta: { icone: Stethoscope, cor: 'bg-brand-100 text-brand-700', label: 'Consulta' },
  orcamento: { icone: FileText, cor: 'bg-gold-100 text-gold-700', label: 'Orçamento' },
  contrato: { icone: FileSignature, cor: 'bg-indigo-50 text-indigo-600', label: 'Contrato' },
  pagamento: { icone: CircleDollarSign, cor: 'bg-gold-100 text-gold-700', label: 'Pagamento' },
  procedimento: { icone: Syringe, cor: 'bg-brand-100 text-brand-700', label: 'Procedimento' },
  checkin: { icone: HeartPulse, cor: 'bg-rose-50 text-rose-600', label: 'Check-in' },
  alerta: { icone: AlertTriangle, cor: 'bg-red-50 text-red-600', label: 'Alerta' },
  nps: { icone: Star, cor: 'bg-amber-50 text-amber-600', label: 'NPS' },
  documento: { icone: FileText, cor: 'bg-zinc-100 text-zinc-600', label: 'Documento' },
  tarefa: { icone: CheckSquare, cor: 'bg-zinc-100 text-zinc-600', label: 'Tarefa' },
}

export function Timeline({ eventos, comFiltro = false }: { eventos: TimelineEvent[]; comFiltro?: boolean }) {
  const [filtro, setFiltro] = useState<TimelineTipo | 'todos'>('todos')
  const tiposPresentes = [...new Set(eventos.map((e) => e.tipo))]
  const visiveis = filtro === 'todos' ? eventos : eventos.filter((e) => e.tipo === filtro)
  const ordenados = [...visiveis].sort((a, b) => b.em.localeCompare(a.em))

  return (
    <div>
      {comFiltro && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          <button
            onClick={() => setFiltro('todos')}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${filtro === 'todos' ? 'bg-ink text-white' : 'bg-black/5 text-ink-soft hover:bg-black/10'}`}
          >
            Todos ({eventos.length})
          </button>
          {tiposPresentes.map((t) => (
            <button
              key={t}
              onClick={() => setFiltro(t)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${filtro === t ? 'bg-ink text-white' : 'bg-black/5 text-ink-soft hover:bg-black/10'}`}
            >
              {config[t].label}
            </button>
          ))}
        </div>
      )}

      <ol className="relative space-y-0">
        {ordenados.map((e, idx) => {
          const { icone: Icone, cor } = config[e.tipo]
          return (
            <li key={e.id} className="relative flex gap-3 pb-5 animate-fade-up" style={{ animationDelay: `${Math.min(idx * 25, 300)}ms` }}>
              {idx < ordenados.length - 1 && <span className="absolute left-[15px] top-8 h-full w-px bg-line" aria-hidden />}
              <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${cor}`}>
                <Icone size={14} />
              </span>
              <div className="min-w-0 pt-0.5">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <p className="text-[13px] font-medium text-ink">{e.titulo}</p>
                  <span className="text-[11px] text-ink-faint">{fmtRelativa(e.em)}</span>
                </div>
                {e.descricao && <p className="mt-0.5 text-[12px] leading-relaxed text-ink-muted">{e.descricao}</p>}
                {e.rota && (
                  <Link to={e.rota} className="mt-1 inline-flex items-center gap-0.5 text-[11.5px] font-medium text-brand-600 hover:text-brand-700">
                    Abrir <ArrowUpRight size={11} />
                  </Link>
                )}
              </div>
            </li>
          )
        })}
      </ol>
      {ordenados.length === 0 && <p className="py-8 text-center text-[12px] text-ink-muted">Nenhum evento neste filtro.</p>}
    </div>
  )
}
