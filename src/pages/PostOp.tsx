import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  HeartPulse,
  AlertTriangle,
  Phone,
  CalendarClock,
  MessageCircle,
  Camera,
  Star,
  Megaphone,
  FileText,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { usePostOpStore } from '@/stores/usePostOpStore'
import { useSessionStore } from '@/stores/useSessionStore'
import { useUiStore } from '@/stores/useUiStore'
import { contatoById } from '@/data/contacts'
import { profById } from '@/data/team'
import type { Journey, JourneyStepTipo } from '@/data/types'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { PageHeader } from '@/components/layout/PageHeader'
import { diaPosOp, fmtData, fmtRelativa } from '@/lib/format'

const iconeStep: Record<JourneyStepTipo, typeof FileText> = {
  orientacoes: FileText,
  checkin: MessageCircle,
  foto: Camera,
  retorno: CalendarClock,
  nps: Star,
  'avaliacao-publica': Megaphone,
}

export default function PostOp() {
  const { jornadas } = usePostOpStore()
  const [aba, setAba] = useState('acompanhamento')
  const criticas = jornadas.filter((j) => j.steps.some((s) => s.status === 'critico'))

  return (
    <div className="mx-auto max-w-[1150px] p-6">
      <PageHeader
        titulo="Pós-atendimento & jornadas"
        subtitulo={`${jornadas.length} pacientes em acompanhamento ativo · ${criticas.length} com alerta crítico · jornadas 100% automatizadas com retaguarda humana`}
      />

      <Tabs
        className="mb-5"
        ativa={aba}
        onMudar={setAba}
        tabs={[
          { id: 'acompanhamento', label: 'Pacientes em acompanhamento', badge: jornadas.length },
          { id: 'construtor', label: 'Construtor de jornada' },
        ]}
      />

      {aba === 'acompanhamento' && <ListaAcompanhamento />}
      {aba === 'construtor' && <ConstrutorJornada />}
    </div>
  )
}

function ListaAcompanhamento() {
  const navigate = useNavigate()
  const { jornadas, resolverAlerta } = usePostOpStore()
  const profissionalId = useSessionStore((s) => s.profissionalId)
  const toast = useUiStore((s) => s.toast)
  const [detalhe, setDetalhe] = useState<Journey | null>(null)
  const [modalAcao, setModalAcao] = useState<Journey | null>(null)

  const ordenadas = [...jornadas].sort((a, b) => {
    const critA = a.steps.some((s) => s.status === 'critico') ? 0 : 1
    const critB = b.steps.some((s) => s.status === 'critico') ? 0 : 1
    return critA - critB
  })

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {ordenadas.map((j) => {
          const ct = contatoById(j.contactId)!
          const critico = j.steps.find((s) => s.status === 'critico')
          const ultimoCheckin = [...j.steps].reverse().find((s) => s.tipo === 'checkin' && s.concluidoEm)
          const concluidos = j.steps.filter((s) => s.status === 'concluido').length
          return (
            <div
              key={j.id}
              className={`card p-4 transition-all ${critico ? 'border-red-300 bg-gradient-to-br from-red-50 to-white shadow-raised' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Avatar nome={ct.nome} cor={ct.avatarColor} size={40} />
                <div className="min-w-0 flex-1">
                  <button onClick={() => navigate(`/pacientes/${ct.id}`)} className="block truncate text-[13.5px] font-semibold text-ink hover:text-brand-700">
                    {ct.nome}
                  </button>
                  <p className="text-[11.5px] text-ink-muted">{j.procedimento} · <span className="font-semibold text-ink-soft">{diaPosOp(j.procedimentoEm)}</span></p>
                </div>
                <StatusPill status={critico ? 'critico' : j.risco} label={critico ? 'Resposta crítica' : undefined} />
              </div>

              {critico && (
                <div className="mt-3 rounded-xl border border-red-200 bg-white p-3">
                  <p className="flex items-center gap-1.5 text-[12px] font-bold text-red-700">
                    <AlertTriangle size={13} className="animate-pulse-soft" /> Dor {critico.notaDor}/10 relatada no check-in {diaPosOp(j.procedimentoEm)}
                  </p>
                  <p className="mt-1 text-[12px] italic leading-relaxed text-ink-soft">"{critico.resposta}"</p>
                  <div className="mt-2.5 flex gap-2">
                    <button onClick={() => setModalAcao(j)} className="btn-danger flex-1 py-1.5 text-[11.5px]">
                      <Phone size={12} /> Ligar / antecipar retorno
                    </button>
                    <button onClick={() => navigate('/inbox')} className="btn-secondary py-1.5 text-[11.5px]">
                      <MessageCircle size={12} /> Conversa
                    </button>
                  </div>
                </div>
              )}

              {!critico && ultimoCheckin && (
                <p className="mt-2.5 rounded-lg bg-canvas px-3 py-2 text-[11.5px] text-ink-muted">
                  Último check-in: {ultimoCheckin.notaDor !== undefined ? `dor ${ultimoCheckin.notaDor}/10 · ` : ''}{ultimoCheckin.resposta}
                </p>
              )}
              {j.alertaResolvido && (
                <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-[11.5px] font-medium text-emerald-700">
                  <CheckCircle2 size={12} /> Alerta resolvido — equipe agiu e o retorno foi antecipado
                </p>
              )}

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {j.steps.map((s) => (
                    <span
                      key={s.id}
                      title={s.titulo}
                      className={`h-1.5 w-6 rounded-full ${s.status === 'concluido' ? 'bg-brand-500' : s.status === 'critico' ? 'bg-red-500' : s.status === 'aguardando' ? 'bg-amber-400' : 'bg-black/10'}`}
                    />
                  ))}
                </div>
                <button onClick={() => setDetalhe(j)} className="flex items-center gap-1 text-[11.5px] font-medium text-brand-600 hover:text-brand-700">
                  {concluidos}/{j.steps.length} etapas <ArrowRight size={11} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detalhe da jornada */}
      <Modal aberto={!!detalhe} onFechar={() => setDetalhe(null)} titulo={detalhe ? `${contatoById(detalhe.contactId)?.nome} — ${detalhe.procedimento}` : ''} larguraMax="max-w-xl">
        {detalhe && (
          <div className="space-y-0">
            {detalhe.steps.map((s, i) => {
              const Icone = iconeStep[s.tipo]
              return (
                <div key={s.id} className="relative flex gap-3 pb-5">
                  {i < detalhe.steps.length - 1 && <span className="absolute left-[15px] top-9 h-full w-px bg-line" />}
                  <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${s.status === 'concluido' ? 'bg-brand-100 text-brand-700' : s.status === 'critico' ? 'bg-red-100 text-red-600' : s.status === 'aguardando' ? 'bg-amber-50 text-amber-600' : 'bg-black/5 text-ink-faint'}`}>
                    <Icone size={14} />
                  </span>
                  <div className="min-w-0 flex-1 pt-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-medium text-ink">{s.titulo}</p>
                      <StatusPill status={s.status} />
                    </div>
                    <p className="text-[11px] text-ink-faint">{s.concluidoEm ? fmtRelativa(s.concluidoEm) : `previsto para ${fmtData(s.previstoEm)}`}</p>
                    {s.resposta && <p className={`mt-1 text-[12px] leading-relaxed ${s.status === 'critico' ? 'text-red-700' : 'text-ink-muted'}`}>{s.resposta}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Modal>

      {/* Modal de ação — resolve o alerta da Carla */}
      <Modal aberto={!!modalAcao} onFechar={() => setModalAcao(null)} titulo="Agir sobre a resposta crítica">
        {modalAcao && (
          <>
            <p className="mb-4 text-[12.5px] leading-relaxed text-ink-muted">
              <strong className="text-ink">{contatoById(modalAcao.contactId)?.nome}</strong> relatou dor intensa no {diaPosOp(modalAcao.procedimentoEm)}. Selecione a ação — tudo fica registrado na timeline e a paciente é notificada.
            </p>
            <div className="space-y-2">
              {[
                { acao: 'Liguei para a paciente, ajustei a analgesia e antecipei o retorno para amanhã às 9h', label: 'Ligar agora + antecipar retorno', desc: 'Recomendado — contato imediato e reavaliação presencial em 24h', destaque: true },
                { acao: 'Orientei pelo WhatsApp e mantive o retorno programado com reforço de analgesia', label: 'Orientar por mensagem', desc: 'Para casos com dor esperada e sinais vitais normais' },
              ].map((o) => (
                <button
                  key={o.label}
                  onClick={() => {
                    resolverAlerta(modalAcao.id, o.acao, profById(profissionalId)?.nome ?? 'Equipe')
                    setModalAcao(null)
                    toast({ titulo: 'Ação registrada na jornada', descricao: 'Alerta resolvido · timeline da paciente atualizada · sino limpo.', tipo: 'sucesso' })
                  }}
                  className={`w-full rounded-xl border p-4 text-left transition-all hover:shadow-card ${o.destaque ? 'border-brand-400 bg-brand-50/60' : 'border-line'}`}
                >
                  <p className="text-[13px] font-semibold text-ink">{o.label}</p>
                  <p className="mt-0.5 text-[11.5px] text-ink-muted">{o.desc}</p>
                </button>
              ))}
            </div>
          </>
        )}
      </Modal>
    </>
  )
}

function ConstrutorJornada() {
  const etapas = [
    { icone: CheckCircle2, titulo: 'Procedimento concluído', desc: 'Gatilho automático ao finalizar o registro cirúrgico', cor: 'bg-brand-600 text-white' },
    { icone: FileText, titulo: 'Enviar orientações', desc: 'Imediato · WhatsApp + portal do paciente', cor: 'bg-brand-50 text-brand-700' },
    { icone: MessageCircle, titulo: 'Check-in de bem-estar', desc: 'D+1 · pergunta escala de dor 0–10', cor: 'bg-brand-50 text-brand-700' },
    { icone: AlertTriangle, titulo: 'Alerta se resposta crítica', desc: 'Dor ≥ 7 → notifica equipe com prioridade máxima', cor: 'bg-red-50 text-red-600', ramo: true },
    { icone: Camera, titulo: 'Solicitar foto de evolução', desc: 'D+7 · anexada automaticamente ao prontuário', cor: 'bg-brand-50 text-brand-700' },
    { icone: CalendarClock, titulo: 'Confirmar retorno', desc: 'D+30 · reagenda automaticamente se não confirmado', cor: 'bg-brand-50 text-brand-700' },
    { icone: Star, titulo: 'Pesquisa de satisfação (NPS)', desc: 'D+40 · notas baixas geram tarefa para a gestão', cor: 'bg-gold-50 text-gold-700' },
    { icone: Megaphone, titulo: 'Convite para avaliação pública', desc: 'D+45 · somente para promotores (NPS ≥ 9)', cor: 'bg-gold-50 text-gold-700' },
    { icone: HeartPulse, titulo: 'Campanha de relacionamento', desc: 'Paciente entra no fluxo de recorrência e indicação', cor: 'bg-ai-100 text-ai-700' },
  ]

  return (
    <div className="card p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-display text-[16px] font-semibold text-ink">Jornada padrão — pós-operatório cirúrgico</p>
          <p className="text-[12px] text-ink-muted">Ativada automaticamente quando um contrato é fechado · visualização do fluxo (edição na versão completa)</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">● Ativa — 7 pacientes no fluxo</span>
      </div>

      <div className="mx-auto max-w-md">
        {etapas.map((e, i) => (
          <div key={e.titulo} className="relative">
            <div className={`relative z-10 flex items-center gap-3.5 rounded-xl border p-3.5 shadow-card animate-fade-up ${e.ramo ? 'ml-10 border-red-200 bg-red-50/40' : 'border-line bg-surface'}`} style={{ animationDelay: `${i * 70}ms` }}>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${e.cor}`}>
                <e.icone size={16} />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-ink">{e.titulo}</p>
                <p className="text-[11px] text-ink-muted">{e.desc}</p>
              </div>
            </div>
            {i < etapas.length - 1 && (
              <div className="relative z-0 ml-[33px] h-5 w-px bg-gradient-to-b from-line to-brand-300" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
