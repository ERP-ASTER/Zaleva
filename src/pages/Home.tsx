import { Link, useNavigate } from 'react-router-dom'
import { isToday } from 'date-fns'
import {
  CalendarDays,
  AlertTriangle,
  HeartPulse,
  FileText,
  ArrowRight,
  Phone,
  Users,
  MessageCircle,
  Target,
  Clock,
  CheckCircle2,
  Cake,
  BarChart3,
  Star,
  Wallet,
  Sparkles,
} from 'lucide-react'
import { useSessionStore } from '@/stores/useSessionStore'
import { useAgendaStore, labelAcaoStatus } from '@/stores/useAgendaStore'
import { useCrmStore, nomeEtapa } from '@/stores/useCrmStore'
import { useInboxStore } from '@/stores/useInboxStore'
import { usePostOpStore } from '@/stores/usePostOpStore'
import { useBillingStore } from '@/stores/useBillingStore'
import { useUiStore } from '@/stores/useUiStore'
import { contatoById } from '@/data/contacts'
import { profById } from '@/data/team'
import { historicoFinanceiro } from '@/data/billing'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { Stat } from '@/components/ui/Stat'
import { PageHeader } from '@/components/layout/PageHeader'
import { brl, fmtHora, diaPosOp, primeiroNome, fmtDataLonga } from '@/lib/format'

export default function Home() {
  const papel = useSessionStore((s) => s.papel)
  return (
    <div className="mx-auto max-w-[1200px] p-6">
      {papel === 'medico' && <HomeMedico />}
      {papel === 'recepcao' && <HomeRecepcao />}
      {papel === 'comercial' && <HomeComercial />}
      {papel === 'gestor' && <HomeGestor />}
    </div>
  )
}

// ─── Cartão de alerta crítico (Carla) — compartilhado ────────────────────────
function AlertaCritico() {
  const navigate = useNavigate()
  const jornadaCarla = usePostOpStore((s) => s.jornadas.find((j) => j.id === 'jn-carla'))
  if (!jornadaCarla || jornadaCarla.alertaResolvido) return null
  const carla = contatoById('ct-carla')!
  return (
    <div className="card mb-5 flex items-center gap-4 border-red-200 bg-gradient-to-r from-red-50 to-white p-4 animate-fade-up">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle size={18} className="animate-pulse-soft" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-semibold text-red-800">Resposta crítica no pós-operatório — ação imediata</p>
        <p className="mt-0.5 text-[12.5px] text-red-700/80">
          <strong>{carla.nome}</strong> ({diaPosOp(jornadaCarla.procedimentoEm)} de abdominoplastia) relatou <strong>dor 8/10</strong> no check-in automático. A medicação atual não está controlando.
        </p>
      </div>
      <button onClick={() => navigate('/pos-atendimento')} className="btn-danger shrink-0">
        Ver e agir <ArrowRight size={13} />
      </button>
    </div>
  )
}

function Saudacao({ frase }: { frase: string }) {
  const profissionalId = useSessionStore((s) => s.profissionalId)
  const prof = profById(profissionalId)
  const hora = new Date().getHours()
  const oi = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'
  return (
    <PageHeader
      titulo={`${oi}, ${primeiroNome(prof?.nome.replace(/^Dr[a]?\. /, '') ?? '')}`}
      subtitulo={
        <>
          {fmtDataLonga(new Date().toISOString())} · {frase}
        </>
      }
    />
  )
}

// ─── MÉDICO ──────────────────────────────────────────────────────────────────
function HomeMedico() {
  const navigate = useNavigate()
  const agendamentos = useAgendaStore((s) => s.agendamentos)
  const jornadas = usePostOpStore((s) => s.jornadas)
  const abrirContexto = useUiStore((s) => s.abrirContexto)

  const hoje = agendamentos.filter((a) => isToday(new Date(a.inicio))).sort((a, b) => a.inicio.localeCompare(b.inicio))
  const pendentes = hoje.filter((a) => !['finalizado', 'cancelado', 'no-show'].includes(a.status))
  const proximo = pendentes[0]
  const proxContato = contatoById(proximo?.contactId)
  const emAcompanhamento = jornadas.filter((j) => j.steps.some((s) => s.status !== 'concluido'))

  return (
    <>
      <Saudacao frase="sua agenda e seus pacientes em acompanhamento" />
      <AlertaCritico />

      <div className="grid grid-cols-4 gap-4">
        <Stat label="Consultas hoje" valor={String(hoje.length)} sufixo={`${hoje.filter((a) => a.status === 'finalizado').length} finalizadas`} icone={<CalendarDays size={15} />} />
        <Stat label="Pós-ops em acompanhamento" valor={String(emAcompanhamento.length)} sufixo="1 crítico" icone={<HeartPulse size={15} />} />
        <Stat label="Prontuários pendentes" valor="2" sufixo="evoluções a revisar" icone={<FileText size={15} />} />
        <Stat label="Cirurgias esta semana" valor={String(agendamentos.filter((a) => a.tipo === 'procedimento' && new Date(a.inicio) > new Date()).length)} sufixo="checklists em dia" icone={<CheckCircle2 size={15} />} />
      </div>

      <div className="mt-5 grid grid-cols-5 gap-5">
        {/* Próximo paciente */}
        <div className="col-span-2">
          {proximo && proxContato && (
            <div className="card overflow-hidden">
              <div className="border-b border-line bg-brand-50/60 px-5 py-3">
                <p className="text-[10.5px] font-semibold uppercase tracking-wide text-brand-700">Próximo paciente · {fmtHora(proximo.inicio)}</p>
              </div>
              <div className="p-5">
                <button className="flex items-center gap-3" onClick={() => abrirContexto(proxContato.id)}>
                  <Avatar nome={proxContato.nome} cor={proxContato.avatarColor} size={48} />
                  <span className="text-left">
                    <span className="block font-display text-[16px] font-semibold text-ink">{proxContato.nome}</span>
                    <span className="block text-[12px] text-ink-muted">{proximo.titulo}</span>
                  </span>
                </button>
                <div className="mt-3 flex items-center gap-2">
                  <StatusPill status={proximo.status} />
                  {proxContato.origem === 'Instagram Ads' && <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10.5px] text-ink-soft">Campanha {proxContato.campanha}</span>}
                </div>
                {proximo.observacao && <p className="mt-3 rounded-lg bg-canvas p-2.5 text-[12px] text-ink-soft">{proximo.observacao}</p>}
                <div className="mt-4 flex gap-2">
                  {proximo.encounterId ? (
                    <button onClick={() => navigate(`/consulta/${proximo.encounterId}`)} className="btn-primary flex-1">
                      <Sparkles size={13} /> Abrir prontuário e consulta
                    </button>
                  ) : (
                    <button onClick={() => navigate('/agenda')} className="btn-primary flex-1">Ver na agenda</button>
                  )}
                  <button onClick={() => navigate(`/pacientes/${proxContato.id}`)} className="btn-secondary">360°</button>
                </div>
              </div>
            </div>
          )}

          {/* Pós-ops */}
          <div className="card mt-5 p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-ink">Pacientes em pós-operatório</p>
              <Link to="/pos-atendimento" className="text-[11.5px] font-medium text-brand-600 hover:text-brand-700">Ver todos</Link>
            </div>
            <div className="space-y-2.5">
              {emAcompanhamento.slice(0, 4).map((j) => {
                const ct = contatoById(j.contactId)!
                return (
                  <button key={j.id} onClick={() => navigate('/pos-atendimento')} className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left hover:bg-canvas">
                    <Avatar nome={ct.nome} cor={ct.avatarColor} size={30} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-medium text-ink">{ct.nome}</span>
                      <span className="block text-[11px] text-ink-muted">{j.procedimento} · {diaPosOp(j.procedimentoEm)}</span>
                    </span>
                    <StatusPill status={j.risco} />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Agenda do dia */}
        <div className="card col-span-3 p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-ink">Agenda de hoje</p>
            <Link to="/agenda" className="text-[11.5px] font-medium text-brand-600 hover:text-brand-700">Abrir agenda completa</Link>
          </div>
          <div className="space-y-1.5">
            {hoje.map((a) => {
              const ct = contatoById(a.contactId)!
              return (
                <div key={a.id} className={`flex items-center gap-3 rounded-xl border border-line px-3.5 py-2.5 ${a.status === 'finalizado' ? 'opacity-50' : ''}`}>
                  <span className="w-11 text-[12.5px] font-semibold tabular-nums text-ink">{fmtHora(a.inicio)}</span>
                  <span className={`h-8 w-1 rounded-full ${a.tipo === 'procedimento' ? 'bg-gold-400' : a.tipo === 'avaliacao' ? 'bg-brand-500' : a.tipo === 'teleconsulta' ? 'bg-ai-500' : 'bg-sky-400'}`} />
                  <Avatar nome={ct.nome} cor={ct.avatarColor} size={28} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-medium text-ink">{ct.nome}</span>
                    <span className="block truncate text-[11px] text-ink-muted">{a.titulo}</span>
                  </span>
                  <StatusPill status={a.status} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

// ─── RECEPÇÃO ────────────────────────────────────────────────────────────────
function HomeRecepcao() {
  const navigate = useNavigate()
  const { agendamentos, avancarStatus } = useAgendaStore()
  const conversas = useInboxStore((s) => s.conversas)
  const abrirContexto = useUiStore((s) => s.abrirContexto)

  const hoje = agendamentos.filter((a) => isToday(new Date(a.inicio))).sort((a, b) => a.inicio.localeCompare(b.inicio))
  const aguardandoConfirmacao = agendamentos.filter((a) => a.status === 'aguardando-confirmacao' || a.status === 'pre-agendado')
  const semResposta = conversas.filter((c) => c.naoLidas > 0)
  const aniversariantes = ['ct-helena', 'ct-sofia']

  return (
    <>
      <Saudacao frase="fila do dia, confirmações e chegadas" />
      <AlertaCritico />
      <div className="grid grid-cols-4 gap-4">
        <Stat label="Atendimentos hoje" valor={String(hoje.length)} icone={<CalendarDays size={15} />} />
        <Stat label="Aguardando confirmação" valor={String(aguardandoConfirmacao.length)} icone={<Clock size={15} />} />
        <Stat label="Mensagens sem resposta" valor={String(semResposta.length)} icone={<MessageCircle size={15} />} onClick={() => navigate('/inbox')} />
        <Stat label="Aniversariantes" valor={String(aniversariantes.length)} sufixo="esta semana" icone={<Cake size={15} />} />
      </div>

      <div className="mt-5 grid grid-cols-5 gap-5">
        <div className="card col-span-3 p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-ink">Fila do dia</p>
            <Link to="/agenda" className="text-[11.5px] font-medium text-brand-600 hover:text-brand-700">Abrir recepção</Link>
          </div>
          <div className="space-y-1.5">
            {hoje.map((a) => {
              const ct = contatoById(a.contactId)!
              const acao = labelAcaoStatus[a.status]
              return (
                <div key={a.id} className={`flex items-center gap-3 rounded-xl border border-line px-3.5 py-2.5 ${a.status === 'finalizado' ? 'opacity-50' : ''}`}>
                  <span className="w-11 text-[12.5px] font-semibold tabular-nums">{fmtHora(a.inicio)}</span>
                  <Avatar nome={ct.nome} cor={ct.avatarColor} size={28} />
                  <button onClick={() => abrirContexto(ct.id)} className="min-w-0 flex-1 text-left">
                    <span className="block truncate text-[12.5px] font-medium text-ink hover:text-brand-700">{ct.nome}</span>
                    <span className="block truncate text-[11px] text-ink-muted">{a.titulo}</span>
                  </button>
                  <StatusPill status={a.status} />
                  {acao && a.status !== 'finalizado' && (
                    <button onClick={() => avancarStatus(a.id)} className="btn-secondary px-2.5 py-1 text-[11px]">
                      {acao}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="col-span-2 space-y-5">
          <div className="card p-5">
            <p className="mb-3 text-[13px] font-semibold text-ink">Confirmações pendentes</p>
            <div className="space-y-2">
              {aguardandoConfirmacao.slice(0, 5).map((a) => {
                const ct = contatoById(a.contactId)!
                return (
                  <div key={a.id} className="flex items-center gap-2.5">
                    <Avatar nome={ct.nome} cor={ct.avatarColor} size={26} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-medium text-ink">{ct.nome}</span>
                      <span className="block truncate text-[10.5px] text-ink-muted">{a.titulo}</span>
                    </span>
                    <button onClick={() => useAgendaStore.getState().setStatus(a.id, 'confirmado')} className="btn-secondary px-2 py-1 text-[10.5px]">
                      Confirmar
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card p-5">
            <p className="mb-3 flex items-center gap-1.5 text-[13px] font-semibold text-ink"><Cake size={14} className="text-gold-500" /> Aniversariantes da semana</p>
            {aniversariantes.map((id) => {
              const ct = contatoById(id)!
              return (
                <div key={id} className="flex items-center gap-2.5 py-1.5">
                  <Avatar nome={ct.nome} cor={ct.avatarColor} size={26} />
                  <span className="flex-1 text-[12px] font-medium text-ink">{ct.nome}</span>
                  <button onClick={() => navigate('/inbox')} className="text-[11px] font-medium text-brand-600 hover:text-brand-700">Enviar mensagem</button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

// ─── COMERCIAL ───────────────────────────────────────────────────────────────
function HomeComercial() {
  const navigate = useNavigate()
  const negociacoes = useCrmStore((s) => s.negociacoes)
  const conversas = useInboxStore((s) => s.conversas)

  const ativas = negociacoes.filter((d) => !['fechado', 'perdido'].includes(d.etapa))
  const fechadas = negociacoes.filter((d) => d.etapa === 'fechado')
  const receitaFechada = fechadas.reduce((acc, d) => acc + d.valor, 0)
  const meta = 250000
  const pctMeta = Math.min(100, Math.round((receitaFechada / meta) * 100))
  const semResposta = conversas.filter((c) => c.naoLidas > 0)
  const followUps = ativas.filter((d) => d.proximaAcao).sort((a, b) => (a.proximaAcao!.em > b.proximaAcao!.em ? 1 : -1))

  return (
    <>
      <Saudacao frase="seus leads, follow-ups e meta do mês" />
      <AlertaCritico />
      <div className="grid grid-cols-4 gap-4">
        <Stat label="Negociações ativas" valor={String(ativas.length)} sufixo={brl(ativas.reduce((a, d) => a + d.valor, 0))} icone={<Target size={15} />} onClick={() => navigate('/crm')} />
        <Stat label="Leads sem resposta" valor={String(semResposta.length)} sufixo="na caixa de entrada" icone={<MessageCircle size={15} />} onClick={() => navigate('/inbox')} />
        <Stat label="Orçamentos aguardando" valor="2" sufixo="1 vence em 7 dias" icone={<FileText size={15} />} />
        <Stat label="Fechados no mês" valor={brl(receitaFechada)} dourado icone={<Wallet size={15} />} />
      </div>

      {/* Meta */}
      <div className="card mt-5 p-5">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-semibold text-ink">Meta do mês</p>
          <p className="text-[12px] text-ink-muted">
            <span className="font-semibold text-gold-700">{brl(receitaFechada)}</span> de {brl(meta)} · {pctMeta}%
          </p>
        </div>
        <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-black/5">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-gold-400 transition-all duration-700" style={{ width: `${pctMeta}%` }} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-5">
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-ink">Follow-ups de hoje</p>
            <Link to="/crm" className="text-[11.5px] font-medium text-brand-600 hover:text-brand-700">Abrir funil</Link>
          </div>
          <div className="space-y-2">
            {followUps.slice(0, 5).map((d) => {
              const ct = contatoById(d.contactId)!
              return (
                <button key={d.id} onClick={() => navigate(`/crm/${d.id}`)} className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left hover:bg-canvas">
                  <Avatar nome={ct.nome} cor={ct.avatarColor} size={30} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-medium text-ink">{d.titulo}</span>
                    <span className="block truncate text-[11px] text-ink-muted">{d.proximaAcao?.descricao}</span>
                  </span>
                  <span className="text-[12px] font-semibold text-ink">{brl(d.valor)}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-ink">Conversas aguardando resposta</p>
            <Link to="/inbox" className="text-[11.5px] font-medium text-brand-600 hover:text-brand-700">Abrir caixa</Link>
          </div>
          <div className="space-y-2">
            {semResposta.map((c) => {
              const ct = contatoById(c.contactId)!
              const ultima = c.mensagens[c.mensagens.length - 1]
              return (
                <button key={c.id} onClick={() => navigate('/inbox')} className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left hover:bg-canvas">
                  <Avatar nome={ct.nome} cor={ct.avatarColor} size={30} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-medium text-ink">{ct.nome}</span>
                    <span className="block truncate text-[11px] text-ink-muted">{ultima?.texto || 'Áudio'}</span>
                  </span>
                  <span className="rounded-full bg-red-500 px-1.5 py-px text-[10px] font-bold text-white">{c.naoLidas}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

// ─── GESTOR ──────────────────────────────────────────────────────────────────
function HomeGestor() {
  const navigate = useNavigate()
  const negociacoes = useCrmStore((s) => s.negociacoes)
  const mesAtual = historicoFinanceiro[historicoFinanceiro.length - 1]
  const mesAnterior = historicoFinanceiro[historicoFinanceiro.length - 2]
  const funil = negociacoes.filter((d) => !['fechado', 'perdido'].includes(d.etapa))

  return (
    <>
      <Saudacao frase="visão executiva da Clínica M. Luther" />
      <AlertaCritico />
      <div className="grid grid-cols-4 gap-4">
        <Stat label="Receita do mês (parcial)" valor={brl(mesAtual.receitaRealizada)} delta={`Mês anterior: ${brl(mesAnterior.receitaRealizada)}`} dourado icone={<Wallet size={15} />} onClick={() => navigate('/dashboards')} />
        <Stat label="Funil ativo" valor={brl(funil.reduce((a, d) => a + d.valor, 0))} sufixo={`${funil.length} negociações`} icone={<Target size={15} />} onClick={() => navigate('/crm')} />
        <Stat label="NPS" valor={String(mesAtual.nps)} delta={`+${mesAtual.nps - mesAnterior.nps} vs mês anterior`} icone={<Star size={15} />} />
        <Stat label="Novos pacientes" valor={String(mesAtual.novosPacientes)} sufixo="no mês" icone={<Users size={15} />} />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        {[
          { titulo: 'Dashboard comercial', desc: 'Funil, origens, campanhas e conversão', rota: '/dashboards', icone: Target },
          { titulo: 'Dashboard financeiro', desc: 'Receita, inadimplência e ticket médio', rota: '/dashboards', icone: Wallet },
          { titulo: 'Visão executiva', desc: 'NPS, ocupação e recorrência', rota: '/dashboards', icone: BarChart3 },
        ].map((c) => (
          <button key={c.titulo} onClick={() => navigate(c.rota)} className="card group p-5 text-left transition-shadow hover:shadow-raised">
            <c.icone size={18} className="text-brand-600" />
            <p className="mt-2.5 text-[13.5px] font-semibold text-ink group-hover:text-brand-700">{c.titulo}</p>
            <p className="mt-0.5 text-[12px] text-ink-muted">{c.desc}</p>
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="mb-3 text-[13px] font-semibold text-ink">Pontos de atenção</p>
          {[
            { texto: 'Carla Menezes — dor 8/10 no pós-op D+1 (alerta ativo)', rota: '/pos-atendimento', critico: true },
            { texto: 'Priscila Nunes — avaliação feita há 9 dias sem orçamento enviado', rota: '/crm/dl-priscila', critico: false },
            { texto: 'Flávio Arruda — parcela de R$ 2.700 vencida há 9 dias', rota: '/pacientes/ct-flavio', critico: false },
            { texto: 'Beatriz Mont’Alverne — faltou ao retorno D+60', rota: '/pos-atendimento', critico: false },
          ].map((p) => (
            <button key={p.texto} onClick={() => navigate(p.rota)} className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left hover:bg-canvas">
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${p.critico ? 'bg-red-500 animate-pulse-soft' : 'bg-amber-400'}`} />
              <span className="flex-1 text-[12.5px] text-ink">{p.texto}</span>
              <ArrowRight size={12} className="text-ink-faint" />
            </button>
          ))}
        </div>
        <div className="card p-5">
          <p className="mb-3 text-[13px] font-semibold text-ink">Time hoje</p>
          {[
            { nome: 'Dr. Renato Somensi', info: '6 atendimentos · 1 cirurgia esta semana', id: 'prof-otavio' },
            { nome: 'Dra. Letícia Fontes', info: '4 atendimentos · agenda 82% ocupada', id: 'prof-leticia' },
            { nome: 'Dr. Bruno Rezende', info: '3 atendimentos · Eldorado', id: 'prof-bruno' },
            { nome: 'Dra. Camila Iwata', info: '5 procedimentos injetáveis', id: 'prof-camila' },
          ].map((m) => (
            <div key={m.id} className="flex items-center gap-2.5 py-1.5">
              <Avatar nome={m.nome} cor={profById(m.id)?.avatarColor} size={28} />
              <span className="min-w-0">
                <span className="block text-[12.5px] font-medium text-ink">{m.nome}</span>
                <span className="block text-[11px] text-ink-muted">{m.info}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
