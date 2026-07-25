import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDays, format, isSameDay, isToday, setHours, setMinutes, startOfWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Video, Plus, UserX, Sparkles } from 'lucide-react'
import { useAgendaStore, labelAcaoStatus, proximoStatus } from '@/stores/useAgendaStore'
import { useUiStore } from '@/stores/useUiStore'
import { equipe, profById } from '@/data/team'
import { contatos, contatoById } from '@/data/contacts'
import type { Appointment, AppointmentTipo } from '@/data/types'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { Modal } from '@/components/ui/Modal'
import { fmtHora } from '@/lib/format'

const HORA_INI = 7
const HORA_FIM = 19
const PX_POR_MIN = 56 / 60 // 56px por hora

const corTipo: Record<AppointmentTipo, { bg: string; borda: string; texto: string; label: string }> = {
  avaliacao: { bg: 'bg-brand-50', borda: 'border-brand-500', texto: 'text-brand-800', label: 'Avaliação' },
  retorno: { bg: 'bg-sky-50', borda: 'border-sky-400', texto: 'text-sky-800', label: 'Retorno' },
  procedimento: { bg: 'bg-gold-50', borda: 'border-gold-400', texto: 'text-gold-800', label: 'Procedimento' },
  teleconsulta: { bg: 'bg-ai-50', borda: 'border-ai-500', texto: 'text-ai-700', label: 'Teleconsulta' },
  injetavel: { bg: 'bg-rose-50', borda: 'border-rose-400', texto: 'text-rose-800', label: 'Injetável' },
}

export default function Agenda() {
  const { agendamentos, reagendar, criarAgendamento } = useAgendaStore()
  const toast = useUiStore((s) => s.toast)
  const [visao, setVisao] = useState<'semana' | 'dia'>('semana')
  const [diaBase, setDiaBase] = useState(new Date())
  const [profFiltro, setProfFiltro] = useState('todos')
  const [arrastandoId, setArrastandoId] = useState<string | null>(null)
  const [detalheId, setDetalheId] = useState<string | null>(null)
  const [novoSlot, setNovoSlot] = useState<{ dia: Date; hora: number; meia: boolean } | null>(null)

  const inicioSemana = startOfWeek(diaBase, { weekStartsOn: 1 })
  const dias = visao === 'semana' ? Array.from({ length: 6 }, (_, i) => addDays(inicioSemana, i)) : [diaBase]

  const visiveis = useMemo(
    () => agendamentos.filter((a) => (profFiltro === 'todos' ? true : a.profissionalId === profFiltro)),
    [agendamentos, profFiltro],
  )

  const soltarEm = (dia: Date, hora: number, meia: boolean) => {
    if (!arrastandoId) return
    const novo = setMinutes(setHours(dia, hora), meia ? 30 : 0)
    const ap = agendamentos.find((a) => a.id === arrastandoId)
    reagendar(arrastandoId, novo.toISOString())
    if (ap) {
      toast({
        titulo: 'Agendamento remarcado',
        descricao: `${contatoById(ap.contactId)?.nome} → ${format(novo, "EEEE, dd/MM 'às' HH:mm", { locale: ptBR })}. Confirmação reenviada por WhatsApp.`,
        tipo: 'sucesso',
      })
    }
    setArrastandoId(null)
  }

  const detalhe = agendamentos.find((a) => a.id === detalheId)

  return (
    <div className="flex h-full">
      <div className="flex min-w-0 flex-1 flex-col p-6 pb-0">
        {/* Cabeçalho */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div>
            <h1 className="font-display text-[22px] font-semibold tracking-tight text-ink">Agenda</h1>
            <p className="text-[12px] text-ink-muted">Arraste um evento para reagendar · clique em um horário vazio para criar</p>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1 rounded-lg border border-line bg-surface p-0.5">
            <button onClick={() => setVisao('semana')} className={`rounded-md px-3 py-1.5 text-[12px] font-medium ${visao === 'semana' ? 'bg-ink text-white' : 'text-ink-soft'}`}>Semana</button>
            <button onClick={() => setVisao('dia')} className={`rounded-md px-3 py-1.5 text-[12px] font-medium ${visao === 'dia' ? 'bg-ink text-white' : 'text-ink-soft'}`}>Dia</button>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setDiaBase(addDays(diaBase, visao === 'semana' ? -7 : -1))} className="rounded-lg border border-line bg-surface p-2 hover:bg-canvas"><ChevronLeft size={14} /></button>
            <button onClick={() => setDiaBase(new Date())} className="rounded-lg border border-line bg-surface px-3 py-2 text-[12px] font-medium hover:bg-canvas">Hoje</button>
            <button onClick={() => setDiaBase(addDays(diaBase, visao === 'semana' ? 7 : 1))} className="rounded-lg border border-line bg-surface p-2 hover:bg-canvas"><ChevronRight size={14} /></button>
          </div>
          <select className="input w-auto py-2 text-[12px]" value={profFiltro} onChange={(e) => setProfFiltro(e.target.value)}>
            <option value="todos">Todos os profissionais</option>
            {equipe.filter((p) => ['cirurgiao', 'dermatologista'].includes(p.papel)).map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>

        {/* Legenda */}
        <div className="mb-3 flex flex-wrap items-center gap-3">
          {Object.entries(corTipo).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5 text-[11px] text-ink-muted">
              <span className={`h-2.5 w-2.5 rounded-sm border-l-2 ${v.bg} ${v.borda}`} /> {v.label}
            </span>
          ))}
        </div>

        {/* Grade */}
        <div className="min-h-0 flex-1 overflow-auto rounded-t-xl border border-line bg-surface">
          <div className="grid" style={{ gridTemplateColumns: `56px repeat(${dias.length}, minmax(150px, 1fr))` }}>
            {/* Cabeçalho dos dias */}
            <div className="sticky top-0 z-20 border-b border-line bg-surface" />
            {dias.map((d) => (
              <div key={d.toISOString()} className={`sticky top-0 z-20 border-b border-l border-line px-2 py-2 text-center ${isToday(d) ? 'bg-brand-50' : 'bg-surface'}`}>
                <p className={`text-[10.5px] font-semibold uppercase tracking-wide ${isToday(d) ? 'text-brand-700' : 'text-ink-muted'}`}>
                  {format(d, 'EEE', { locale: ptBR })}
                </p>
                <p className={`font-display text-[16px] font-semibold ${isToday(d) ? 'text-brand-700' : 'text-ink'}`}>{format(d, 'dd')}</p>
              </div>
            ))}

            {/* Corpo */}
            <div className="relative">
              {Array.from({ length: HORA_FIM - HORA_INI }, (_, i) => (
                <div key={i} className="relative border-b border-line/50 text-right" style={{ height: 56 }}>
                  <span className="absolute -top-2 right-1.5 text-[10px] text-ink-faint">{HORA_INI + i}:00</span>
                </div>
              ))}
            </div>
            {dias.map((dia) => (
              <div key={dia.toISOString()} className="relative border-l border-line/70">
                {Array.from({ length: (HORA_FIM - HORA_INI) * 2 }, (_, i) => {
                  const hora = HORA_INI + Math.floor(i / 2)
                  const meia = i % 2 === 1
                  return (
                    <div
                      key={i}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => soltarEm(dia, hora, meia)}
                      onClick={() => setNovoSlot({ dia, hora, meia })}
                      className={`group cursor-pointer border-b ${meia ? 'border-line/30' : 'border-line/50'} transition-colors hover:bg-brand-50/50`}
                      style={{ height: 28 }}
                    >
                      <span className="hidden items-center justify-center gap-1 text-[10px] text-brand-600 group-hover:flex">
                        <Plus size={10} /> {hora}:{meia ? '30' : '00'}
                      </span>
                    </div>
                  )
                })}
                {/* Eventos do dia */}
                {visiveis
                  .filter((a) => isSameDay(new Date(a.inicio), dia))
                  .map((a) => {
                    const inicio = new Date(a.inicio)
                    const minutos = (inicio.getHours() - HORA_INI) * 60 + inicio.getMinutes()
                    if (minutos < 0) return null
                    const cor = corTipo[a.tipo]
                    const contato = contatoById(a.contactId)!
                    const prof = profById(a.profissionalId)
                    const cancelado = ['cancelado', 'no-show'].includes(a.status)
                    return (
                      <div
                        key={a.id}
                        draggable={!cancelado}
                        onDragStart={() => setArrastandoId(a.id)}
                        onClick={(e) => {
                          e.stopPropagation()
                          setDetalheId(a.id)
                        }}
                        className={`absolute inset-x-1 z-10 cursor-pointer overflow-hidden rounded-lg border-l-[3px] px-1.5 py-1 shadow-sm transition-shadow hover:z-20 hover:shadow-raised ${cor.bg} ${cor.borda} ${cancelado ? 'opacity-45' : ''}`}
                        style={{ top: minutos * PX_POR_MIN + 1, height: Math.max(26, a.duracaoMin * PX_POR_MIN - 2) }}
                        title={`${contato.nome} — ${a.titulo}`}
                      >
                        <p className={`truncate text-[10.5px] font-semibold leading-tight ${cor.texto} ${a.status === 'no-show' ? 'line-through' : ''}`}>
                          {a.tipo === 'teleconsulta' && <Video size={9} className="mr-0.5 inline" />}
                          {fmtHora(a.inicio)} {contato.nome}
                        </p>
                        {a.duracaoMin >= 40 && <p className="truncate text-[9.5px] leading-tight text-ink-muted">{a.titulo}</p>}
                        {a.duracaoMin >= 60 && prof && <p className="truncate text-[9px] leading-tight text-ink-faint">{prof.nome} {a.sala ? `· ${a.sala}` : ''}</p>}
                        {a.status === 'no-show' && <p className="text-[8.5px] font-bold uppercase text-red-600">No-show</p>}
                      </div>
                    )
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fila do dia */}
      <FilaDoDia onAbrirDetalhe={setDetalheId} />

      {/* Modal detalhe */}
      <Modal aberto={!!detalhe} onFechar={() => setDetalheId(null)} titulo={detalhe ? contatoById(detalhe.contactId)?.nome : ''}>
        {detalhe && <DetalheAgendamento ap={detalhe} onFechar={() => setDetalheId(null)} />}
      </Modal>

      {/* Modal novo agendamento */}
      <Modal aberto={!!novoSlot} onFechar={() => setNovoSlot(null)} titulo="Novo agendamento">
        {novoSlot && (
          <NovoAgendamento
            slot={novoSlot}
            onCriar={(dados) => {
              criarAgendamento(dados)
              setNovoSlot(null)
              toast({ titulo: 'Agendamento criado', descricao: 'Solicitação de confirmação enviada por WhatsApp.', tipo: 'sucesso' })
            }}
          />
        )}
      </Modal>
    </div>
  )
}

function FilaDoDia({ onAbrirDetalhe }: { onAbrirDetalhe: (id: string) => void }) {
  const { agendamentos, avancarStatus, setStatus } = useAgendaStore()
  const toast = useUiStore((s) => s.toast)
  const hoje = agendamentos.filter((a) => isToday(new Date(a.inicio))).sort((a, b) => a.inicio.localeCompare(b.inicio))
  const finalizados = hoje.filter((a) => a.status === 'finalizado').length

  return (
    <div className="flex w-[300px] shrink-0 flex-col border-l border-line bg-surface">
      <div className="border-b border-line p-4">
        <p className="font-display text-[15px] font-semibold text-ink">Fila do dia</p>
        <p className="mt-0.5 text-[11.5px] text-ink-muted">{finalizados} de {hoje.length} atendimentos concluídos</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/5">
          <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${hoje.length ? (finalizados / hoje.length) * 100 : 0}%` }} />
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {hoje.map((a) => {
          const contato = contatoById(a.contactId)!
          const acao = labelAcaoStatus[a.status]
          const podeNoShow = ['confirmado', 'aguardando-confirmacao', 'pre-agendado'].includes(a.status) && new Date(a.inicio) < new Date()
          return (
            <div key={a.id} className={`rounded-xl border p-3 transition-colors ${a.status === 'em-atendimento' ? 'border-brand-300 bg-brand-50/50' : 'border-line'} ${['finalizado', 'no-show', 'cancelado'].includes(a.status) ? 'opacity-55' : ''}`}>
              <button onClick={() => onAbrirDetalhe(a.id)} className="flex w-full items-center gap-2 text-left">
                <Avatar nome={contato.nome} cor={contato.avatarColor} size={28} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-semibold text-ink">{fmtHora(a.inicio)} · {contato.nome}</span>
                  <span className="block truncate text-[10.5px] text-ink-muted">{a.titulo}</span>
                </span>
              </button>
              <div className="mt-2 flex items-center justify-between gap-1.5">
                <StatusPill status={a.status} />
                <div className="flex gap-1">
                  {podeNoShow && (
                    <button
                      onClick={() => {
                        setStatus(a.id, 'no-show')
                        toast({ titulo: 'No-show registrado', descricao: 'Fluxo de remarcação automática iniciado.', tipo: 'info' })
                      }}
                      title="Registrar falta"
                      className="rounded-md p-1 text-red-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <UserX size={13} />
                    </button>
                  )}
                  {acao && proximoStatus[a.status] && (
                    <button onClick={() => avancarStatus(a.id)} className="btn-secondary px-2 py-1 text-[10.5px]">
                      {acao}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DetalheAgendamento({ ap, onFechar }: { ap: Appointment; onFechar: () => void }) {
  const navigate = useNavigate()
  const { avancarStatus } = useAgendaStore()
  const contato = contatoById(ap.contactId)!
  const prof = profById(ap.profissionalId)
  const acao = labelAcaoStatus[ap.status]
  return (
    <div>
      <div className="flex items-center gap-3">
        <Avatar nome={contato.nome} cor={contato.avatarColor} size={40} />
        <div>
          <p className="text-[13.5px] font-semibold text-ink">{ap.titulo}</p>
          <p className="text-[12px] text-ink-muted">{format(new Date(ap.inicio), "EEEE, dd/MM 'às' HH:mm", { locale: ptBR })} · {ap.duracaoMin} min</p>
        </div>
      </div>
      <dl className="mt-4 space-y-2 rounded-xl bg-canvas p-3.5 text-[12.5px]">
        <div className="flex justify-between"><dt className="text-ink-muted">Status</dt><dd><StatusPill status={ap.status} /></dd></div>
        <div className="flex justify-between"><dt className="text-ink-muted">Profissional</dt><dd className="font-medium text-ink">{prof?.nome}</dd></div>
        {ap.sala && <div className="flex justify-between"><dt className="text-ink-muted">Sala</dt><dd className="font-medium text-ink">{ap.sala}</dd></div>}
        {ap.observacao && <div><dt className="text-ink-muted">Observação</dt><dd className="mt-0.5 text-ink">{ap.observacao}</dd></div>}
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {acao && proximoStatus[ap.status] && (
          <button onClick={() => avancarStatus(ap.id)} className="btn-primary">{acao}</button>
        )}
        {ap.encounterId && (
          <button onClick={() => { onFechar(); navigate(ap.tipo === 'teleconsulta' ? '/teleconsulta' : `/consulta/${ap.encounterId}`) }} className="btn-ai">
            <Sparkles size={13} /> {ap.tipo === 'teleconsulta' ? 'Entrar na teleconsulta' : 'Abrir consulta'}
          </button>
        )}
        <button onClick={() => { onFechar(); navigate(`/pacientes/${contato.id}`) }} className="btn-secondary">Perfil 360°</button>
      </div>
    </div>
  )
}

function NovoAgendamento({
  slot,
  onCriar,
}: {
  slot: { dia: Date; hora: number; meia: boolean }
  onCriar: (dados: Parameters<ReturnType<typeof useAgendaStore.getState>['criarAgendamento']>[0]) => void
}) {
  const [contactId, setContactId] = useState('ct-amanda')
  const [profissionalId, setProfissionalId] = useState('prof-otavio')
  const [tipo, setTipo] = useState<AppointmentTipo>('avaliacao')
  const inicio = setMinutes(setHours(slot.dia, slot.hora), slot.meia ? 30 : 0)

  return (
    <div className="space-y-3.5">
      <p className="rounded-lg bg-brand-50 px-3 py-2 text-[12.5px] font-medium text-brand-800">
        {format(inicio, "EEEE, dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
      </p>
      <div>
        <label className="mb-1 block text-[11.5px] font-medium text-ink-soft">Paciente / lead</label>
        <select className="input" value={contactId} onChange={(e) => setContactId(e.target.value)}>
          {contatos.map((c) => (
            <option key={c.id} value={c.id}>{c.nome} ({c.tipo})</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[11.5px] font-medium text-ink-soft">Profissional</label>
          <select className="input" value={profissionalId} onChange={(e) => setProfissionalId(e.target.value)}>
            {equipe.filter((p) => ['cirurgiao', 'dermatologista'].includes(p.papel)).map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[11.5px] font-medium text-ink-soft">Tipo</label>
          <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value as AppointmentTipo)}>
            <option value="avaliacao">Avaliação</option>
            <option value="retorno">Retorno</option>
            <option value="procedimento">Procedimento</option>
            <option value="teleconsulta">Teleconsulta</option>
            <option value="injetavel">Injetável</option>
          </select>
        </div>
      </div>
      <button
        onClick={() => {
          const c = contatoById(contactId)!
          onCriar({
            contactId,
            profissionalId,
            tipo,
            titulo: `${corTipoLabel(tipo)} — ${c.interesse ?? 'Consulta'}`,
            inicio: inicio.toISOString(),
            duracaoMin: tipo === 'procedimento' ? 180 : tipo === 'avaliacao' ? 50 : 30,
            unidadeId: c.unidadeId,
          })
        }}
        className="btn-primary w-full py-2.5"
      >
        Criar agendamento
      </button>
    </div>
  )
}

function corTipoLabel(t: AppointmentTipo) {
  return { avaliacao: 'Avaliação', retorno: 'Retorno', procedimento: 'Procedimento', teleconsulta: 'Teleconsulta', injetavel: 'Aplicação' }[t]
}
