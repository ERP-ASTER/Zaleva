import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isToday } from 'date-fns'
import {
  CalendarDays,
  BarChart3,
  Camera,
  Bell,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Zap,
  Aperture,
  RefreshCw,
  Star,
  Wallet,
  Target,
  HeartPulse,
  MessagesSquare,
  Send,
  Paperclip,
  Hash,
} from 'lucide-react'
import { useSessionStore } from '@/stores/useSessionStore'
import { useAgendaStore, labelAcaoStatus, proximoStatus } from '@/stores/useAgendaStore'
import { useClinicalStore } from '@/stores/useClinicalStore'
import { useUiStore } from '@/stores/useUiStore'
import { useCrmStore } from '@/stores/useCrmStore'
import { usePostOpStore } from '@/stores/usePostOpStore'
import { contatoById, contatos } from '@/data/contacts'
import { profById } from '@/data/team'
import { historicoFinanceiro } from '@/data/billing'
import type { FotoCategoria } from '@/data/types'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { brl, fmtHora, fmtAtras, fmtMes, primeiroNome, diaPosOp } from '@/lib/format'
import { create } from 'zustand'
import { uid } from '@/lib/ids'
import { horasAtras, minutosAtras } from '@/data/dates'

// ─── Chat interno da equipe (estado em memória, sobrevive à troca de abas) ───
interface MsgInterna {
  id: string
  autorId: string // 'eu' = médico logado
  texto: string
  em: string
}

interface ConversaInterna {
  id: string
  tipo: 'direta' | 'canal'
  nome: string
  membroId?: string // conversa direta
  naoLidas: number
  vinculo?: { label: string; rota: string }
  mensagens: MsgInterna[]
}

const respostasEquipe: Record<string, string[]> = {
  'ci-patricia': ['Perfeito, Dr.! Já aviso ela 😊', 'Combinado, deixo tudo pronto por aqui!'],
  'ci-centro': ['Anotado! Atualizei o checklist ✅', 'Ciente, equipe alinhada.'],
  'ci-diego': ['Show! Assim que sair da consulta eu disparo o orçamento 🚀', 'Fechado, Dr.!'],
  'ci-camila': ['Combinado! Te retorno ainda hoje.', 'Perfeito 😊'],
  default: ['Ciente!', 'Combinado 👍'],
}

const useChatInternoStore = create<{
  conversas: ConversaInterna[]
  digitando: Record<string, boolean>
  enviar: (conversaId: string, texto: string) => void
  marcarLida: (conversaId: string) => void
}>((set, get) => ({
  digitando: {},
  conversas: [
    {
      id: 'ci-patricia',
      tipo: 'direta',
      nome: 'Patrícia Lemos · Recepção',
      membroId: 'prof-patricia',
      naoLidas: 1,
      vinculo: { label: 'Mariana Duarte', rota: '/pacientes/ct-mariana' },
      mensagens: [
        { id: uid('ci'), autorId: 'prof-patricia', texto: 'Dr., a Mariana Duarte confirmou presença na avaliação das 10h 😊', em: horasAtras(2, 5) },
        { id: uid('ci'), autorId: 'eu', texto: 'Ótimo! Separa o formulário pré-consulta dela pra mim, por favor.', em: horasAtras(2, 1) },
        { id: uid('ci'), autorId: 'prof-patricia', texto: 'Já está no prontuário! Ela marcou alergia a dipirona, deixei em destaque ⚠️', em: minutosAtras(35) },
      ],
    },
    {
      id: 'ci-centro',
      tipo: 'canal',
      nome: 'centro-cirurgico',
      naoLidas: 1,
      vinculo: { label: 'Gabriela Pontes', rota: '/pacientes/ct-gabriela' },
      mensagens: [
        { id: uid('ci'), autorId: 'prof-suelen', texto: 'Checklist pré-op da Gabriela Pontes (rino de daqui a 3 dias): exames ok, termos assinados, reserva do CC confirmada das 7h30 às 11h.', em: horasAtras(4, 20) },
        { id: uid('ci'), autorId: 'prof-bruno', texto: 'Anestesista confirmado. Kit cirúrgico reservado.', em: horasAtras(3, 40) },
        { id: uid('ci'), autorId: 'prof-suelen', texto: 'Falta apenas o jejum — envio o lembrete automático na véspera às 20h. Algo mais, Dr. Renato?', em: minutosAtras(50) },
      ],
    },
    {
      id: 'ci-diego',
      tipo: 'direta',
      nome: 'Diego Antunes · Comercial',
      membroId: 'prof-diego',
      naoLidas: 0,
      vinculo: { label: 'Negociação — Mariana', rota: '/crm/dl-mariana' },
      mensagens: [
        { id: uid('ci'), autorId: 'prof-diego', texto: 'Dr., deixei o orçamento da Mariana em rascunho. Se a avaliação de hoje confirmar rino + septo, me dá um toque que eu envio na sequência 🙌', em: horasAtras(1, 15) },
      ],
    },
    {
      id: 'ci-camila',
      tipo: 'direta',
      nome: 'Dra. Camila Iwata',
      membroId: 'prof-camila',
      naoLidas: 0,
      vinculo: { label: 'Ricardo Tavares', rota: '/pacientes/ct-ricardo' },
      mensagens: [
        { id: uid('ci'), autorId: 'eu', texto: 'Camila, o Ricardo aplica toxina amanhã com você e semana que vem avalia lifting comigo. Aproveita e observa a região frontal?', em: horasAtras(26) },
        { id: uid('ci'), autorId: 'prof-camila', texto: 'Claro! Registro as observações direto no prontuário dele 😊', em: horasAtras(25, 30) },
      ],
    },
  ],
  enviar: (conversaId, texto) => {
    set((s) => ({
      conversas: s.conversas.map((c) =>
        c.id === conversaId
          ? { ...c, mensagens: [...c.mensagens, { id: uid('ci'), autorId: 'eu', texto, em: new Date().toISOString() }] }
          : c,
      ),
    }))
    const respostas = respostasEquipe[conversaId] ?? respostasEquipe.default
    const resposta = respostas[get().conversas.find((c) => c.id === conversaId)!.mensagens.length % respostas.length]
    const conversa = get().conversas.find((c) => c.id === conversaId)!
    const autorResposta = conversa.membroId ?? 'prof-suelen'
    setTimeout(() => set((s) => ({ digitando: { ...s.digitando, [conversaId]: true } })), 700)
    setTimeout(() => {
      set((s) => ({
        digitando: { ...s.digitando, [conversaId]: false },
        conversas: s.conversas.map((c) =>
          c.id === conversaId
            ? { ...c, mensagens: [...c.mensagens, { id: uid('ci'), autorId: autorResposta, texto: resposta, em: new Date().toISOString() }] }
            : c,
        ),
      }))
    }, 2100)
  },
  marcarLida: (conversaId) =>
    set((s) => ({ conversas: s.conversas.map((c) => (c.id === conversaId ? { ...c, naoLidas: 0 } : c)) })),
}))

type AbaApp = 'hoje' | 'indicadores' | 'camera' | 'chat' | 'alertas'

export default function DoctorApp() {
  const [aba, setAba] = useState<AbaApp>('hoje')
  const profissionalId = useSessionStore((s) => s.profissionalId)
  const prof = profById(profissionalId) ?? profById('prof-otavio')!
  const naoLidas = useUiStore((s) => s.notificacoes.filter((n) => !n.lida).length)
  const chatNaoLidas = useChatInternoStore((s) => s.conversas.reduce((acc, c) => acc + c.naoLidas, 0))

  return (
    <div className="flex min-h-full items-center justify-center bg-gradient-to-br from-ink via-brand-950 to-brand-900 p-8">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
        {/* Contexto da demo */}
        <div className="hidden max-w-sm text-white lg:block">
          <p className="font-display text-[26px] font-semibold leading-tight">O consultório no bolso do médico.</p>
          <p className="mt-3 text-[13.5px] leading-relaxed text-white/60">
            O app que o <strong className="text-white/90">Dr. Renato Somensi</strong> instala no celular: agenda do dia, indicadores, alertas críticos e a câmera clínica — cada foto capturada sincroniza na hora com o arquivo do paciente.
          </p>
          <ul className="mt-5 space-y-2 text-[12.5px] text-white/70">
            <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold-300" /> Foto tirada na aba Câmera aparece no Paciente 360° → Fotos</li>
            <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold-300" /> Alertas de pós-operatório chegam como notificação push</li>
            <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold-300" /> Check-in e andamento da fila em tempo real</li>
            <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold-300" /> Chat interno da equipe, com conversas vinculadas a pacientes</li>
          </ul>
        </div>

        {/* Moldura do celular */}
        <div className="rounded-[42px] bg-zinc-900 p-2.5 shadow-overlay ring-1 ring-white/20">
          <div className="relative flex h-[680px] w-[330px] flex-col overflow-hidden rounded-[34px] bg-canvas">
            <div className="absolute left-1/2 top-2 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-zinc-900" />

            {/* Header */}
            <div className="bg-brand-950 px-5 pb-4 pt-10 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar nome={prof.nome} cor={prof.avatarColor} size={34} />
                  <div>
                    <p className="text-[9.5px] uppercase tracking-[0.16em] text-white/50">Zaleva Médico</p>
                    <p className="font-display text-[15px] font-semibold leading-tight">Dr. {primeiroNome(prof.nome.replace(/^Dr[a]?\. /, ''))}</p>
                  </div>
                </div>
                <button onClick={() => setAba('alertas')} className="relative rounded-full bg-white/10 p-2">
                  <Bell size={15} className="text-white/80" />
                  {naoLidas > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold">{naoLidas}</span>
                  )}
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {aba === 'hoje' && <AppHoje />}
              {aba === 'indicadores' && <AppIndicadores />}
              {aba === 'camera' && <AppCamera />}
              {aba === 'chat' && <AppChat />}
              {aba === 'alertas' && <AppAlertas />}
            </div>

            {/* Bottom nav */}
            <div className="flex items-center justify-around border-t border-line bg-surface px-2 py-2.5">
              {(
                [
                  ['hoje', CalendarDays, 'Hoje'],
                  ['indicadores', BarChart3, 'Indicad.'],
                  ['camera', Camera, 'Câmera'],
                  ['chat', MessagesSquare, 'Chat'],
                  ['alertas', Bell, 'Alertas'],
                ] as const
              ).map(([id, Icone, label]) => (
                <button key={id} onClick={() => setAba(id)} className={`relative flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 ${aba === id ? 'text-brand-700' : 'text-ink-faint'}`}>
                  <Icone size={17} />
                  <span className="text-[8.5px] font-medium">{label}</span>
                  {id === 'alertas' && naoLidas > 0 && <span className="absolute right-0.5 top-0 h-1.5 w-1.5 rounded-full bg-red-500" />}
                  {id === 'chat' && chatNaoLidas > 0 && (
                    <span className="absolute -top-0.5 right-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-brand-600 px-0.5 text-[8px] font-bold text-white">{chatNaoLidas}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── HOJE ────────────────────────────────────────────────────────────────────
function AppHoje() {
  const { agendamentos, avancarStatus } = useAgendaStore()
  const jornadaCarla = usePostOpStore((s) => s.jornadas.find((j) => j.id === 'jn-carla'))
  const hoje = agendamentos.filter((a) => isToday(new Date(a.inicio))).sort((a, b) => a.inicio.localeCompare(b.inicio))
  const pendentes = hoje.filter((a) => !['finalizado', 'cancelado', 'no-show'].includes(a.status))
  const proximo = pendentes[0]
  const proxContato = contatoById(proximo?.contactId)

  return (
    <div className="space-y-3 p-4">
      {jornadaCarla && !jornadaCarla.alertaResolvido && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5">
          <p className="flex items-center gap-1.5 text-[11.5px] font-bold text-red-700">
            <HeartPulse size={13} className="animate-pulse-soft" /> Pós-op crítico — Carla Menezes
          </p>
          <p className="mt-1 text-[11px] leading-snug text-red-700/80">Dor 8/10 no check-in D+1 de abdominoplastia. A equipe aguarda sua orientação.</p>
        </div>
      )}

      {proximo && proxContato && (
        <div className="rounded-2xl bg-brand-600 p-4 text-white shadow-card">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/60">Próximo · {fmtHora(proximo.inicio)}</p>
          <div className="mt-1.5 flex items-center gap-2.5">
            <Avatar nome={proxContato.nome} cor="rgba(255,255,255,0.2)" size={36} />
            <div>
              <p className="font-display text-[15px] font-semibold leading-tight">{proxContato.nome}</p>
              <p className="text-[11px] text-white/75">{proximo.titulo}</p>
            </div>
          </div>
          {proximoStatus[proximo.status] && (
            <button onClick={() => avancarStatus(proximo.id)} className="mt-3 w-full rounded-lg bg-white/15 py-2 text-[11.5px] font-semibold backdrop-blur hover:bg-white/25">
              {labelAcaoStatus[proximo.status]}
            </button>
          )}
        </div>
      )}

      <p className="pt-1 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Agenda de hoje · {hoje.length} atendimentos</p>
      <div className="space-y-2">
        {hoje.map((a) => {
          const ct = contatoById(a.contactId)!
          return (
            <div key={a.id} className={`flex items-center gap-2.5 rounded-xl border border-line bg-surface p-2.5 ${['finalizado', 'no-show'].includes(a.status) ? 'opacity-50' : ''}`}>
              <span className="w-9 text-[11px] font-bold tabular-nums text-ink">{fmtHora(a.inicio)}</span>
              <Avatar nome={ct.nome} cor={ct.avatarColor} size={26} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11.5px] font-medium text-ink">{ct.nome}</span>
                <span className="block truncate text-[9.5px] text-ink-muted">{a.titulo}</span>
              </span>
              <StatusPill status={a.status} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── INDICADORES ─────────────────────────────────────────────────────────────
function AppIndicadores() {
  const negociacoes = useCrmStore((s) => s.negociacoes)
  const mesAtual = historicoFinanceiro[historicoFinanceiro.length - 1]
  const fechadas = negociacoes.filter((d) => d.etapa === 'fechado')
  const maxReceita = Math.max(...historicoFinanceiro.map((m) => m.receitaRealizada))

  return (
    <div className="space-y-3 p-4">
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { label: 'Receita (mês)', valor: brl(mesAtual.receitaRealizada), icone: Wallet, dourado: true },
          { label: 'Funil ativo', valor: brl(negociacoes.filter((d) => !['fechado', 'perdido'].includes(d.etapa)).reduce((a, d) => a + d.valor, 0)), icone: Target },
          { label: 'Fechadas', valor: `${fechadas.length} · ${brl(fechadas.reduce((a, d) => a + d.valor, 0))}`, icone: Zap },
          { label: 'NPS', valor: String(mesAtual.nps), icone: Star },
        ].map((k) => (
          <div key={k.label} className={`rounded-2xl border p-3 ${k.dourado ? 'border-gold-200 bg-gradient-to-br from-gold-50 to-white' : 'border-line bg-surface'}`}>
            <k.icone size={13} className={k.dourado ? 'text-gold-500' : 'text-ink-faint'} />
            <p className={`mt-1.5 truncate font-display text-[14px] font-semibold ${k.dourado ? 'text-gold-700' : 'text-ink'}`}>{k.valor}</p>
            <p className="text-[9px] font-medium uppercase tracking-wide text-ink-muted">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-surface p-3.5">
        <p className="mb-2.5 text-[11px] font-semibold text-ink">Receita — últimos 6 meses</p>
        <div className="flex h-28 items-end gap-1.5">
          {historicoFinanceiro.map((m, i) => (
            <div key={m.mes} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-md transition-all ${i === historicoFinanceiro.length - 1 ? 'bg-gold-300' : 'bg-brand-500'}`}
                style={{ height: `${(m.receitaRealizada / maxReceita) * 100}%` }}
                title={brl(m.receitaRealizada)}
              />
              <span className="text-[8px] font-medium capitalize text-ink-muted">{fmtMes(m.mes)}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[9.5px] text-ink-faint">Mês atual em andamento (parcial) · dados completos no dashboard web</p>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-3.5">
        <p className="mb-2 text-[11px] font-semibold text-ink">Sua semana</p>
        {[
          { t: 'Ocupação da agenda', v: '78%' },
          { t: 'Consultas realizadas', v: '14' },
          { t: 'Cirurgias', v: '2' },
          { t: 'Pós-ops em acompanhamento', v: '7' },
        ].map((l) => (
          <div key={l.t} className="flex items-center justify-between border-b border-line/60 py-1.5 text-[11.5px] last:border-0">
            <span className="text-ink-muted">{l.t}</span>
            <span className="font-semibold text-ink">{l.v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── CÂMERA ──────────────────────────────────────────────────────────────────
function AppCamera() {
  const navigate = useNavigate()
  const addFoto = useClinicalStore((s) => s.addFoto)
  const fotos = useClinicalStore((s) => s.fotos)
  const jornadas = usePostOpStore((s) => s.jornadas)
  const toast = useUiStore((s) => s.toast)
  const [contactId, setContactId] = useState('ct-carla')
  const [categoria, setCategoria] = useState<FotoCategoria>('evolucao')
  const [capturando, setCapturando] = useState(false)
  const [ultimaFoto, setUltimaFoto] = useState<string | null>(null)

  const contato = contatoById(contactId)!
  const jornada = jornadas.find((j) => j.contactId === contactId)
  const fotosDoPaciente = fotos.filter((f) => f.contactId === contactId).length

  const capturar = () => {
    setCapturando(true)
    setTimeout(() => {
      const titulo =
        categoria === 'evolucao' && jornada
          ? `Evolução ${diaPosOp(jornada.procedimentoEm)} — ${jornada.procedimento}`
          : categoria === 'pre-op'
            ? 'Pré-op — registro fotográfico'
            : categoria === 'planejamento'
              ? 'Planejamento — marcação'
              : 'Registro clínico'
      addFoto(contactId, titulo, categoria, 'app-medico')
      setCapturando(false)
      setUltimaFoto(titulo)
      toast({ titulo: 'Foto sincronizada ✓', descricao: `Adicionada ao arquivo de ${contato.nome} com data, autor e finalidade.`, tipo: 'sucesso' })
    }, 1100)
  }

  return (
    <div className="flex h-full flex-col p-4">
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Paciente</label>
        <select className="input py-2 text-[12px]" value={contactId} onChange={(e) => { setContactId(e.target.value); setUltimaFoto(null) }}>
          {contatos.filter((c) => c.tipo === 'paciente' || c.id === 'ct-mariana').map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <div className="mt-2 flex gap-1">
          {(
            [
              ['pre-op', 'Pré-op'],
              ['planejamento', 'Marcação'],
              ['evolucao', 'Evolução'],
              ['pos-op', 'Pós-op'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setCategoria(id)}
              className={`flex-1 rounded-full px-1 py-1 text-[9.5px] font-medium transition-colors ${categoria === id ? 'bg-brand-600 text-white' : 'bg-black/5 text-ink-soft'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Visor */}
      <div className="relative mt-3 flex-1 overflow-hidden rounded-2xl bg-zinc-950">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="border border-white/5" />
          ))}
        </div>
        <div className="absolute inset-x-8 inset-y-14 rounded-[40%] border-2 border-dashed border-white/25" />
        <div className="absolute inset-x-0 top-3 flex justify-center">
          <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[9.5px] text-white/80 backdrop-blur">
            <Aperture size={10} className={capturando ? 'animate-spin' : ''} />
            {capturando ? 'Capturando e sincronizando...' : `Câmera clínica · ${contato.nome.split(' ')[0]} · ${fotosDoPaciente} fotos no arquivo`}
          </span>
        </div>
        {jornada && (
          <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2 py-0.5 text-[9px] text-white/70 backdrop-blur">
            {jornada.procedimento} · {diaPosOp(jornada.procedimentoEm)}
          </span>
        )}
        {ultimaFoto && !capturando && (
          <div className="absolute inset-x-3 bottom-10 rounded-xl bg-emerald-500/90 p-2.5 text-white backdrop-blur animate-fade-up">
            <p className="flex items-center gap-1.5 text-[10.5px] font-semibold"><RefreshCw size={11} /> Sincronizada ao arquivo do paciente</p>
            <p className="text-[10px] text-white/85">{ultimaFoto}</p>
            <button onClick={() => navigate(`/pacientes/${contactId}`)} className="mt-1.5 flex items-center gap-0.5 text-[10px] font-bold underline-offset-2 hover:underline">
              Ver no Paciente 360° → Fotos <ChevronRight size={10} />
            </button>
          </div>
        )}
      </div>

      {/* Botão de captura */}
      <div className="flex items-center justify-center py-4">
        <button
          onClick={capturar}
          disabled={capturando}
          aria-label="Capturar foto"
          className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-brand-600 bg-white shadow-raised transition-transform active:scale-90 disabled:opacity-60"
        >
          <span className={`h-11 w-11 rounded-full ${capturando ? 'animate-pulse-soft bg-brand-300' : 'bg-brand-600'}`} />
        </button>
      </div>
      <p className="pb-1 text-center text-[9px] leading-relaxed text-ink-faint">
        Criptografada no dispositivo · vinculada ao prontuário com autor, data e finalidade (LGPD)
      </p>
    </div>
  )
}

// ─── ALERTAS ─────────────────────────────────────────────────────────────────
function AppAlertas() {
  const navigate = useNavigate()
  const { notificacoes, marcarLida, marcarTodasLidas } = useUiStore()

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Notificações</p>
        <button onClick={marcarTodasLidas} className="text-[10.5px] font-medium text-brand-600">Marcar todas como lidas</button>
      </div>
      <div className="space-y-2">
        {notificacoes.map((n) => (
          <button
            key={n.id}
            onClick={() => {
              marcarLida(n.id)
              if (n.rota) navigate(n.rota)
            }}
            className={`w-full rounded-2xl border p-3.5 text-left transition-all ${
              n.tipo === 'critico' && !n.lida ? 'border-red-200 bg-red-50' : 'border-line bg-surface'
            } ${n.lida ? 'opacity-55' : ''}`}
          >
            <div className="flex items-start gap-2.5">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.tipo === 'critico' ? 'bg-red-500 animate-pulse-soft' : n.tipo === 'comercial' ? 'bg-gold-400' : n.tipo === 'financeiro' ? 'bg-amber-500' : n.tipo === 'clinico' ? 'bg-brand-500' : 'bg-sky-400'} ${n.lida ? 'opacity-30' : ''}`} />
              <span className="min-w-0">
                <span className="block text-[11.5px] font-semibold leading-snug text-ink">{n.titulo}</span>
                <span className="mt-0.5 block text-[10.5px] leading-snug text-ink-muted">{n.descricao}</span>
                <span className="mt-1 block text-[9px] text-ink-faint">{fmtAtras(n.em)}</span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── CHAT INTERNO ────────────────────────────────────────────────────────────
function AppChat() {
  const navigate = useNavigate()
  const { conversas, digitando, enviar, marcarLida } = useChatInternoStore()
  const [abertaId, setAbertaId] = useState<string | null>(null)
  const [texto, setTexto] = useState('')
  const fimRef = useRef<HTMLDivElement>(null)

  const aberta = conversas.find((c) => c.id === abertaId)
  const estaDigitando = abertaId ? digitando[abertaId] : false

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aberta?.mensagens.length, estaDigitando])

  // ── Lista de conversas ──
  if (!aberta) {
    return (
      <div className="p-4">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Chat interno da equipe</p>
        <p className="mb-3 text-[10.5px] leading-snug text-ink-muted">Conversas vinculadas a pacientes e registros — nada se perde no WhatsApp pessoal.</p>
        <div className="space-y-2">
          {conversas.map((c) => {
            const ultima = c.mensagens[c.mensagens.length - 1]
            const membro = profById(c.membroId)
            return (
              <button
                key={c.id}
                onClick={() => {
                  setAbertaId(c.id)
                  marcarLida(c.id)
                }}
                className="flex w-full items-center gap-2.5 rounded-2xl border border-line bg-surface p-3 text-left transition-colors hover:border-brand-300"
              >
                {c.tipo === 'canal' ? (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <Hash size={15} />
                  </span>
                ) : (
                  <Avatar nome={membro?.nome ?? c.nome} cor={membro?.avatarColor} size={36} />
                )}
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-[12px] ${c.naoLidas ? 'font-bold text-ink' : 'font-medium text-ink'}`}>
                    {c.tipo === 'canal' ? `#${c.nome}` : c.nome}
                  </span>
                  <span className="block truncate text-[10.5px] text-ink-muted">
                    {ultima.autorId === 'eu' ? 'Você: ' : ''}
                    {ultima.texto}
                  </span>
                  {c.vinculo && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-black/5 px-1.5 py-0.5 text-[9px] font-medium text-ink-soft">
                      <Paperclip size={8} /> {c.vinculo.label}
                    </span>
                  )}
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-[9px] text-ink-faint">{fmtHora(ultima.em)}</span>
                  {c.naoLidas > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white">{c.naoLidas}</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-center text-[9px] text-ink-faint">Histórico auditável · disponível também na versão web (em breve)</p>
      </div>
    )
  }

  // ── Conversa aberta ──
  const membro = profById(aberta.membroId)
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2.5">
        <button onClick={() => setAbertaId(null)} className="rounded-lg p-1 text-ink-muted hover:bg-black/5" aria-label="Voltar">
          <ChevronLeft size={16} />
        </button>
        {aberta.tipo === 'canal' ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Hash size={12} />
          </span>
        ) : (
          <Avatar nome={membro?.nome ?? aberta.nome} cor={membro?.avatarColor} size={28} />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-ink">{aberta.tipo === 'canal' ? `#${aberta.nome}` : aberta.nome}</p>
          {aberta.vinculo && (
            <button
              onClick={() => navigate(aberta.vinculo!.rota)}
              className="flex items-center gap-1 text-[9.5px] font-medium text-brand-600"
            >
              <Paperclip size={8} /> {aberta.vinculo.label} — abrir registro
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {aberta.mensagens.map((m) => {
          const minha = m.autorId === 'eu'
          const autor = profById(m.autorId)
          return (
            <div key={m.id} className={`flex ${minha ? 'justify-end' : 'justify-start'} animate-fade-up`}>
              {!minha && <Avatar nome={autor?.nome ?? '?'} cor={autor?.avatarColor} size={22} className="mr-1.5 mt-auto" />}
              <div className={`max-w-[78%] rounded-2xl px-3 py-1.5 ${minha ? 'rounded-br-md bg-brand-600 text-white' : 'rounded-bl-md border border-line bg-surface'}`}>
                {!minha && aberta.tipo === 'canal' && <p className="text-[9px] font-bold text-brand-700">{autor?.nome}</p>}
                <p className={`text-[11.5px] leading-relaxed ${minha ? '' : 'text-ink'}`}>{m.texto}</p>
                <p className={`mt-0.5 text-right text-[8.5px] ${minha ? 'text-white/60' : 'text-ink-faint'}`}>{fmtHora(m.em)}</p>
              </div>
            </div>
          )
        })}
        {estaDigitando && (
          <div className="flex items-center gap-1 pl-8">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        <div ref={fimRef} />
      </div>

      <div className="flex gap-2 border-t border-line bg-surface p-3">
        <input
          className="input flex-1 py-2 text-[12px]"
          placeholder="Mensagem para a equipe..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && texto.trim()) {
              enviar(aberta.id, texto.trim())
              setTexto('')
            }
          }}
        />
        <button
          onClick={() => {
            if (!texto.trim()) return
            enviar(aberta.id, texto.trim())
            setTexto('')
          }}
          className="btn-primary px-3"
          aria-label="Enviar"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}
