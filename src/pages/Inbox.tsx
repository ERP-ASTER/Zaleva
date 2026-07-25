import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Send,
  Mic,
  Sparkles,
  Bot,
  UserCheck,
  CalendarPlus,
  ArrowUpRight,
  Instagram,
  Globe,
  Phone,
  CheckCheck,
  Tag,
} from 'lucide-react'
import { useInboxStore, sugestoesIA } from '@/stores/useInboxStore'
import { useSessionStore } from '@/stores/useSessionStore'
import { useUiStore } from '@/stores/useUiStore'
import { useCrmStore, nomeEtapa } from '@/stores/useCrmStore'
import { useAgendaStore } from '@/stores/useAgendaStore'
import { contatoById } from '@/data/contacts'
import { profById } from '@/data/team'
import type { Canal, Conversation, ConversaStatus } from '@/data/types'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { AISuggestion, AIChip } from '@/components/ui/AISuggestion'
import { fmtHora, fmtRelativa, brl, fmtDataHora } from '@/lib/format'

const iconeCanal: Record<Canal, typeof Instagram> = { whatsapp: Phone, instagram: Instagram, site: Globe }
const corCanal: Record<Canal, string> = { whatsapp: 'text-emerald-600', instagram: 'text-pink-600', site: 'text-sky-600' }

export default function Inbox() {
  const { conversas, selecionadaId, selecionar } = useInboxStore()
  const [filtroCanal, setFiltroCanal] = useState<Canal | 'todos'>('todos')
  const [filtroStatus, setFiltroStatus] = useState<ConversaStatus | 'todas'>('todas')

  const filtradas = useMemo(
    () =>
      conversas
        .filter((c) => (filtroCanal === 'todos' ? true : c.canal === filtroCanal))
        .filter((c) => (filtroStatus === 'todas' ? true : c.status === filtroStatus))
        .sort((a, b) => {
          const ua = a.mensagens[a.mensagens.length - 1]?.em ?? ''
          const ub = b.mensagens[b.mensagens.length - 1]?.em ?? ''
          return ub.localeCompare(ua)
        }),
    [conversas, filtroCanal, filtroStatus],
  )

  const ativa = conversas.find((c) => c.id === selecionadaId) ?? filtradas[0]

  useEffect(() => {
    if (!selecionadaId && filtradas[0]) selecionar(filtradas[0].id)
  }, [selecionadaId, filtradas, selecionar])

  return (
    <div className="flex h-full">
      {/* Coluna 1 — filas e conversas */}
      <div className="flex w-[300px] shrink-0 flex-col border-r border-line bg-surface">
        <div className="border-b border-line p-4">
          <h1 className="font-display text-[16px] font-semibold text-ink">Caixa de entrada</h1>
          <div className="mt-3 flex gap-1">
            {(['todos', 'whatsapp', 'instagram', 'site'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFiltroCanal(c)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize transition-colors ${filtroCanal === c ? 'bg-ink text-white' : 'bg-black/5 text-ink-soft hover:bg-black/10'}`}
              >
                {c === 'todos' ? 'Todos' : c}
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {(
              [
                ['todas', 'Todas'],
                ['nova', 'Novas'],
                ['ia', 'IA atendendo'],
                ['em-atendimento', 'Em atendimento'],
                ['aguardando', 'Aguardando'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setFiltroStatus(id as ConversaStatus | 'todas')}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${filtroStatus === id ? 'bg-brand-600 text-white' : 'bg-black/5 text-ink-soft hover:bg-black/10'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtradas.map((c) => (
            <ItemConversa key={c.id} conversa={c} ativa={ativa?.id === c.id} onClick={() => selecionar(c.id)} />
          ))}
        </div>
      </div>

      {/* Coluna 2 — conversa */}
      {ativa ? <PainelConversa conversa={ativa} /> : <div className="flex-1" />}

      {/* Coluna 3 — contexto do contato */}
      {ativa && <PainelContato conversa={ativa} />}
    </div>
  )
}

function ItemConversa({ conversa, ativa, onClick }: { conversa: Conversation; ativa: boolean; onClick: () => void }) {
  const contato = contatoById(conversa.contactId)!
  const ultima = conversa.mensagens[conversa.mensagens.length - 1]
  const Icone = iconeCanal[conversa.canal]
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-2.5 border-b border-line/60 px-4 py-3 text-left transition-colors ${ativa ? 'bg-brand-50/70' : 'hover:bg-canvas'}`}
    >
      <div className="relative">
        <Avatar nome={contato.nome} cor={contato.avatarColor} size={38} />
        <span className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white ${corCanal[conversa.canal]}`}>
          <Icone size={10} />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className={`truncate text-[12.5px] ${conversa.naoLidas ? 'font-semibold text-ink' : 'font-medium text-ink-soft'}`}>{contato.nome}</p>
          <span className="shrink-0 text-[10px] text-ink-faint">{ultima ? fmtHora(ultima.em) : ''}</span>
        </div>
        <p className="mt-0.5 truncate text-[11.5px] text-ink-muted">
          {ultima?.autor === 'ia' && <Bot size={10} className="mr-0.5 inline text-ai-600" />}
          {ultima?.tipo === 'audio' ? '🎙 Áudio' : ultima?.texto}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          <StatusPill status={conversa.status} />
          {conversa.naoLidas > 0 && (
            <span className="ml-auto rounded-full bg-brand-600 px-1.5 py-px text-[9.5px] font-bold text-white">{conversa.naoLidas}</span>
          )}
        </div>
      </div>
    </button>
  )
}

function PainelConversa({ conversa }: { conversa: Conversation }) {
  const { enviarMensagem, assumirConversa, digitando } = useInboxStore()
  const { profissionalId } = useSessionStore()
  const toast = useUiStore((s) => s.toast)
  const [texto, setTexto] = useState('')
  const [sugestaoVisivel, setSugestaoVisivel] = useState(false)
  const [transcricaoAberta, setTranscricaoAberta] = useState<string | null>(null)
  const fimRef = useRef<HTMLDivElement>(null)
  const contato = contatoById(conversa.contactId)!
  const prof = profById(profissionalId)
  const estaDigitando = digitando[conversa.id]

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversa.mensagens.length, estaDigitando])

  useEffect(() => setSugestaoVisivel(false), [conversa.id])

  const enviar = (t?: string) => {
    const msg = (t ?? texto).trim()
    if (!msg) return
    enviarMensagem(conversa.id, msg, prof?.nome ?? 'Equipe')
    setTexto('')
    setSugestaoVisivel(false)
  }

  const sugestao = sugestoesIA[conversa.id] ?? sugestoesIA.default

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#F4F3EF]">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 border-b border-line bg-surface px-5 py-3">
        <Avatar nome={contato.nome} cor={contato.avatarColor} size={34} />
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-ink">{contato.nome}</p>
          <p className="text-[11px] text-ink-muted">
            {conversa.canal === 'whatsapp' ? 'WhatsApp' : conversa.canal === 'instagram' ? 'Instagram Direct' : 'Chat do site'} · {contato.telefone}
          </p>
        </div>
        {conversa.intencao && (
          <span className="flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-1 text-[11px] text-ink-soft">
            <Tag size={10} /> {conversa.intencao}
          </span>
        )}
        {conversa.status === 'ia' && (
          <button
            onClick={() => {
              assumirConversa(conversa.id, profissionalId, prof?.nome ?? 'Equipe')
              toast({ titulo: 'Conversa assumida', descricao: 'A IA registrou o contexto e passou o bastão para você.', tipo: 'sucesso' })
            }}
            className="btn-primary py-1.5"
          >
            <UserCheck size={14} /> Assumir conversa
          </button>
        )}
      </div>

      {conversa.status === 'ia' && (
        <div className="flex items-center gap-2 border-b border-ai-200 bg-ai-50 px-5 py-2 text-[11.5px] text-ai-700">
          <Bot size={13} className="animate-pulse-soft" />
          Agente de IA conduzindo este atendimento — coletando informações e qualificando. Transferirá automaticamente ao detectar intenção de agendamento.
        </div>
      )}

      {/* Mensagens */}
      <div className="flex-1 space-y-2.5 overflow-y-auto px-6 py-4">
        {conversa.mensagens.map((m) => {
          if (m.autor === 'sistema') {
            return (
              <div key={m.id} className="flex justify-center">
                <span className="rounded-full bg-black/5 px-3 py-1 text-[10.5px] text-ink-muted">{m.texto}</span>
              </div>
            )
          }
          const minha = m.autor === 'equipe' || m.autor === 'ia'
          return (
            <div key={m.id} className={`flex ${minha ? 'justify-end' : 'justify-start'} animate-fade-up`}>
              <div
                className={`max-w-[68%] rounded-2xl px-3.5 py-2 shadow-sm ${
                  m.autor === 'ia'
                    ? 'rounded-br-md border border-dashed border-ai-300 bg-ai-50'
                    : minha
                      ? 'rounded-br-md bg-brand-600 text-white'
                      : 'rounded-bl-md bg-white'
                }`}
              >
                {m.autor === 'ia' && (
                  <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold text-ai-700">
                    <Bot size={10} /> Agente IA M. Luther
                  </p>
                )}
                {m.autor === 'equipe' && m.autorNome && <p className="mb-0.5 text-[10px] font-semibold text-white/70">{m.autorNome}</p>}
                {m.tipo === 'audio' ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <Mic size={14} className={minha ? 'text-white' : 'text-ink-muted'} />
                      <span className="flex h-5 items-center gap-px">
                        {[3, 7, 5, 9, 4, 8, 6, 3, 7, 5, 8, 4, 6, 9, 3].map((h, i) => (
                          <span key={i} className={`w-0.5 rounded-full ${minha ? 'bg-white/70' : 'bg-ink-faint'}`} style={{ height: h * 2 }} />
                        ))}
                      </span>
                      <span className={`text-[11px] ${minha ? 'text-white/80' : 'text-ink-muted'}`}>{m.duracaoAudio}</span>
                    </div>
                    <button
                      onClick={() => setTranscricaoAberta(transcricaoAberta === m.id ? null : m.id)}
                      className="mt-1.5 flex items-center gap-1 text-[10.5px] font-medium text-ai-700"
                    >
                      <Sparkles size={10} /> {transcricaoAberta === m.id ? 'Ocultar transcrição' : 'Ver transcrição da IA'}
                    </button>
                    {transcricaoAberta === m.id && (
                      <p className={`mt-1.5 rounded-lg p-2 text-[11.5px] italic leading-relaxed ${minha ? 'bg-white/15 text-white/90' : 'bg-ai-50 text-ink-soft'}`}>{m.transcricao}</p>
                    )}
                  </div>
                ) : (
                  <p className={`text-[13px] leading-relaxed ${m.autor === 'ia' ? 'text-ink' : ''}`}>{m.texto}</p>
                )}
                <p className={`mt-1 flex items-center justify-end gap-1 text-[9.5px] ${minha && m.autor !== 'ia' ? 'text-white/60' : 'text-ink-faint'}`}>
                  {fmtHora(m.em)}
                  {minha && <CheckCheck size={11} />}
                </p>
              </div>
            </div>
          )
        })}

        {estaDigitando && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={fimRef} />
      </div>

      {/* Sugestão da IA + campo de resposta */}
      <div className="border-t border-line bg-surface p-4">
        {sugestaoVisivel ? (
          <AISuggestion
            titulo="Resposta sugerida pela IA"
            compacto
            className="mb-3"
            onAprovar={() => enviar(sugestao)}
            labelAprovar="Enviar resposta"
            onEditar={() => {
              setTexto(sugestao)
              setSugestaoVisivel(false)
            }}
            onDescartar={() => setSugestaoVisivel(false)}
          >
            {sugestao}
          </AISuggestion>
        ) : (
          <button onClick={() => setSugestaoVisivel(true)} className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-ai-200 bg-ai-50 px-3 py-1.5 text-[11.5px] font-medium text-ai-700 hover:bg-ai-100">
            <Sparkles size={12} /> Sugerir resposta com IA
          </button>
        )}
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                enviar()
              }
            }}
            placeholder="Escreva uma mensagem... (Enter para enviar)"
            className="input max-h-28 min-h-[42px] flex-1 resize-none py-2.5"
          />
          <button onClick={() => enviar()} className="btn-primary h-[42px] w-[42px] p-0" aria-label="Enviar">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

function PainelContato({ conversa }: { conversa: Conversation }) {
  const navigate = useNavigate()
  const toast = useUiStore((s) => s.toast)
  const contato = contatoById(conversa.contactId)!
  const deal = useCrmStore((s) => s.negociacoes.find((d) => d.contactId === conversa.contactId && d.etapa !== 'perdido'))
  const proximoAg = useAgendaStore((s) =>
    s.agendamentos
      .filter((a) => a.contactId === conversa.contactId && new Date(a.inicio) >= new Date())
      .sort((x, y) => x.inicio.localeCompare(y.inicio))[0],
  )
  const atendente = conversa.atendenteId === 'ia' ? 'Agente IA' : profById(conversa.atendenteId)?.nome ?? 'Não atribuído'

  return (
    <div className="w-[290px] shrink-0 overflow-y-auto border-l border-line bg-surface p-5">
      <div className="flex flex-col items-center text-center">
        <Avatar nome={contato.nome} cor={contato.avatarColor} size={62} />
        <p className="mt-2.5 font-display text-[15px] font-semibold text-ink">{contato.nome}</p>
        <p className="text-[11.5px] text-ink-muted">{contato.idade} anos · {contato.profissao ?? contato.cidade}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-1">
          <StatusPill status={contato.tipo} />
          {contato.tags.slice(0, 2).map((t) => (
            <span key={t} className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] text-ink-soft">{t}</span>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="rounded-xl bg-canvas p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Origem</p>
          <p className="mt-0.5 text-[12px] font-medium text-ink">{contato.origem}{contato.campanha ? ` · ${contato.campanha}` : ''}</p>
        </div>

        {deal && (
          <div className="rounded-xl bg-canvas p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Etapa do funil</p>
            <p className="mt-0.5 text-[12px] font-medium text-ink">{nomeEtapa(deal.etapa)}</p>
            <p className="mt-1 text-[11px] text-ink-muted">{deal.procedimentos.join(' + ')} · <span className="font-semibold text-ink">{brl(deal.valor)}</span></p>
            {deal.proximaAcao && (
              <p className="mt-2 rounded-lg bg-amber-50 px-2 py-1.5 text-[10.5px] leading-snug text-amber-800">Próxima ação: {deal.proximaAcao.descricao}</p>
            )}
          </div>
        )}

        <div className="rounded-xl bg-canvas p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Responsável</p>
          <p className="mt-0.5 text-[12px] font-medium text-ink">{atendente}</p>
        </div>

        {proximoAg && (
          <div className="rounded-xl bg-canvas p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Próximo agendamento</p>
            <p className="mt-0.5 text-[12px] font-medium text-ink">{proximoAg.titulo}</p>
            <p className="text-[11px] text-ink-muted">{fmtDataHora(proximoAg.inicio)}</p>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {deal ? (
          <button onClick={() => navigate(`/crm/${deal.id}`)} className="btn-secondary w-full justify-between">
            Abrir negociação <ArrowUpRight size={13} />
          </button>
        ) : (
          <button
            onClick={() => {
              toast({ titulo: 'Lead criado no CRM', descricao: `${contato.nome} entrou no funil em "Novo lead".`, tipo: 'sucesso' })
              navigate('/crm')
            }}
            className="btn-primary w-full"
          >
            Criar lead no CRM
          </button>
        )}
        <button onClick={() => navigate('/agenda')} className="btn-secondary w-full justify-between">
          Agendar avaliação <CalendarPlus size={13} />
        </button>
        <button onClick={() => navigate(`/pacientes/${contato.id}`)} className="btn-secondary w-full justify-between">
          Ver perfil 360° <ArrowUpRight size={13} />
        </button>
        <button
          onClick={() => toast({ titulo: 'Conversa transferida', descricao: 'Encaminhada para a fila da Recepção.', tipo: 'info' })}
          className="btn-ghost w-full"
        >
          Transferir atendimento
        </button>
      </div>

      <p className="mt-4 border-t border-line pt-3 text-[10px] leading-relaxed text-ink-faint">
        Última atividade {fmtRelativa(conversa.mensagens[conversa.mensagens.length - 1]?.em ?? new Date().toISOString())} · Histórico completo no perfil 360°
      </p>
    </div>
  )
}
