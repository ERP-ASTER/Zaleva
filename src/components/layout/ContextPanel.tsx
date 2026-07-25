import { useNavigate } from 'react-router-dom'
import { X, MessageCircle, CalendarPlus, FileText, ArrowUpRight } from 'lucide-react'
import { useUiStore } from '@/stores/useUiStore'
import { useCrmStore, nomeEtapa } from '@/stores/useCrmStore'
import { useAgendaStore } from '@/stores/useAgendaStore'
import { useTimelineStore } from '@/stores/useTimelineStore'
import { contatoById } from '@/data/contacts'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { Timeline } from '@/components/ui/Timeline'
import { brl, fmtDataHora } from '@/lib/format'

/** Painel lateral contextual — resumo do paciente/lead acessível de qualquer tela. */
export function ContextPanel() {
  const navigate = useNavigate()
  const { contextContactId, fecharContexto } = useUiStore()
  const contato = contatoById(contextContactId)
  const deal = useCrmStore((s) => s.negociacoes.find((d) => d.contactId === contextContactId && d.etapa !== 'perdido'))
  const proximoAg = useAgendaStore((s) =>
    s.agendamentos
      .filter((a) => a.contactId === contextContactId && new Date(a.inicio) >= new Date() && a.status !== 'cancelado')
      .sort((x, y) => x.inicio.localeCompare(y.inicio))[0],
  )
  const eventos = useTimelineStore((s) => s.eventos.filter((e) => e.contactId === contextContactId).slice(0, 6))

  if (!contato) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-ink/20 animate-fade-in" onClick={fecharContexto} />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-[380px] flex-col overflow-y-auto bg-surface shadow-overlay animate-slide-in-right">
        <div className="flex items-start justify-between border-b border-line p-5">
          <div className="flex items-center gap-3">
            <Avatar nome={contato.nome} cor={contato.avatarColor} size={46} />
            <div>
              <p className="font-display text-[15px] font-semibold text-ink">{contato.nome}</p>
              <p className="text-[11.5px] text-ink-muted">
                {contato.idade} anos · {contato.origem}
                {contato.campanha ? ` · ${contato.campanha}` : ''}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                <StatusPill status={contato.tipo} />
                {contato.tags.slice(0, 2).map((t) => (
                  <span key={t} className="rounded-full bg-black/5 px-2 py-0.5 text-[10.5px] text-ink-soft">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <button onClick={fecharContexto} className="rounded-lg p-1.5 text-ink-muted hover:bg-black/5" aria-label="Fechar painel">
            <X size={15} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {/* Ações rápidas */}
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => { fecharContexto(); navigate('/inbox') }} className="btn-secondary flex-col gap-1 py-2.5 text-[10.5px]">
              <MessageCircle size={15} className="text-brand-600" /> Mensagem
            </button>
            <button onClick={() => { fecharContexto(); navigate('/agenda') }} className="btn-secondary flex-col gap-1 py-2.5 text-[10.5px]">
              <CalendarPlus size={15} className="text-brand-600" /> Agendar
            </button>
            <button onClick={() => { fecharContexto(); navigate(deal ? `/orcamentos/qt-mariana` : '/crm') }} className="btn-secondary flex-col gap-1 py-2.5 text-[10.5px]">
              <FileText size={15} className="text-brand-600" /> Orçamento
            </button>
          </div>

          {contato.ltv > 0 && (
            <div className="rounded-xl border border-gold-200 bg-gradient-to-br from-gold-50 to-white p-3.5">
              <p className="text-[10.5px] font-medium uppercase tracking-wide text-gold-700">Valor do relacionamento (LTV)</p>
              <p className="mt-0.5 font-display text-[20px] font-semibold text-gold-700">{brl(contato.ltv)}</p>
            </div>
          )}

          {deal && (
            <div className="rounded-xl border border-line p-3.5">
              <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Negociação ativa</p>
              <p className="text-[13px] font-medium text-ink">{deal.titulo}</p>
              <div className="mt-1.5 flex items-center gap-2 text-[12px] text-ink-muted">
                <StatusPill status={deal.temperatura} />
                <span>{nomeEtapa(deal.etapa)}</span>
                <span className="ml-auto font-semibold text-ink">{brl(deal.valor)}</span>
              </div>
              {deal.proximaAcao && (
                <p className="mt-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11.5px] text-amber-800">
                  Próxima ação: {deal.proximaAcao.descricao}
                </p>
              )}
            </div>
          )}

          {proximoAg && (
            <div className="rounded-xl border border-line p-3.5">
              <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Próximo agendamento</p>
              <p className="text-[13px] font-medium text-ink">{proximoAg.titulo}</p>
              <p className="mt-0.5 text-[12px] text-ink-muted">{fmtDataHora(proximoAg.inicio)}</p>
              <div className="mt-1.5"><StatusPill status={proximoAg.status} /></div>
            </div>
          )}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Timeline resumida</p>
              <button
                onClick={() => { fecharContexto(); navigate(`/pacientes/${contato.id}`) }}
                className="flex items-center gap-0.5 text-[11.5px] font-medium text-brand-600 hover:text-brand-700"
              >
                Ver 360° <ArrowUpRight size={11} />
              </button>
            </div>
            <Timeline eventos={eventos} />
          </div>
        </div>
      </aside>
    </>
  )
}
