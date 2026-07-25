import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Flame,
  Megaphone,
  MousePointerClick,
  UserPlus,
  MessageCircle,
  CalendarCheck,
  Wallet,
  Trophy,
  XCircle,
  Phone,
  Sparkles,
  FileText,
  Plus,
  ChevronRight,
} from 'lucide-react'
import { useCrmStore, nomeEtapa, etapasFunil } from '@/stores/useCrmStore'
import { useBillingStore } from '@/stores/useBillingStore'
import { useSessionStore } from '@/stores/useSessionStore'
import { useUiStore } from '@/stores/useUiStore'
import { useTimelineStore } from '@/stores/useTimelineStore'
import { contatoById } from '@/data/contacts'
import { profById } from '@/data/team'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { AISuggestion } from '@/components/ui/AISuggestion'
import { Timeline } from '@/components/ui/Timeline'
import { useInboxStore } from '@/stores/useInboxStore'
import { brl, fmtRelativa, fmtDataHora } from '@/lib/format'

export default function DealDetail() {
  const { dealId } = useParams()
  const navigate = useNavigate()
  const deal = useCrmStore((s) => s.negociacoes.find((d) => d.id === dealId))
  const { registrarAtividade, marcarPerdido, marcarGanho } = useCrmStore()
  const profissionalId = useSessionStore((s) => s.profissionalId)
  const toast = useUiStore((s) => s.toast)
  const eventos = useTimelineStore((s) => s.eventos.filter((e) => e.contactId === deal?.contactId))
  const orcamentosDoDeal = useBillingStore((s) => s.orcamentos.filter((q) => q.dealId === dealId))
  const conversa = useInboxStore((s) => s.conversas.find((c) => c.contactId === deal?.contactId))

  const [aba, setAba] = useState('timeline')
  const [modalPerda, setModalPerda] = useState(false)
  const [motivoPerda, setMotivoPerda] = useState('Preço acima do orçamento')
  const [notaContato, setNotaContato] = useState('')
  const [sugestaoFollowUp, setSugestaoFollowUp] = useState(false)

  if (!deal) {
    return (
      <div className="p-8">
        <p className="text-ink-muted">Negociação não encontrada.</p>
        <Link to="/crm" className="text-brand-600">Voltar ao funil</Link>
      </div>
    )
  }

  const contato = contatoById(deal.contactId)!
  const autor = profById(profissionalId)?.nome ?? 'Equipe'
  const ativa = !['fechado', 'perdido'].includes(deal.etapa)

  const cadeiaAtribuicao = [
    { icone: Megaphone, label: contato.campanha ? `Campanha "${contato.campanha}"` : contato.origem },
    { icone: MousePointerClick, label: contato.origem === 'Instagram Ads' ? 'Anúncio' : contato.origem === 'Indicação' ? 'Indicação' : 'Pesquisa' },
    { icone: UserPlus, label: 'Lead' },
    { icone: MessageCircle, label: 'Conversa' },
    { icone: CalendarCheck, label: 'Avaliação' },
    { icone: Wallet, label: 'Receita' },
  ]
  const etapaIdx = etapasFunil.findIndex((e) => e.id === deal.etapa)
  const atribuicaoAtiva = deal.etapa === 'fechado' ? 6 : etapaIdx >= 3 ? 5 : etapaIdx >= 1 ? 4 : 3

  return (
    <div className="mx-auto max-w-[1150px] p-6">
      <button onClick={() => navigate('/crm')} className="mb-4 flex items-center gap-1.5 text-[12.5px] font-medium text-ink-muted hover:text-ink">
        <ArrowLeft size={14} /> Funil comercial
      </button>

      {/* Cabeçalho */}
      <div className="card p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Avatar nome={contato.nome} cor={contato.avatarColor} size={52} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-[20px] font-semibold text-ink">{deal.titulo}</h1>
                {deal.temperatura === 'quente' && <Flame size={16} className="text-orange-500" />}
              </div>
              <div className="mt-1 flex items-center gap-2 text-[12px] text-ink-muted">
                <StatusPill status={deal.etapa === 'fechado' ? 'aceito' : deal.etapa === 'perdido' ? 'vencido' : 'aberta'} label={nomeEtapa(deal.etapa)} />
                <span>Responsável: {profById(deal.responsavelId)?.nome}</span>
                <span>·</span>
                <button onClick={() => navigate(`/pacientes/${contato.id}`)} className="font-medium text-brand-600 hover:text-brand-700">
                  Ver perfil 360°
                </button>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display text-[26px] font-semibold text-ink">{brl(deal.valor)}</p>
            <p className="text-[11.5px] text-ink-muted">{deal.probabilidade}% de probabilidade · {deal.procedimentos.join(' + ')}</p>
          </div>
        </div>

        {/* Cadeia de atribuição */}
        <div className="mt-4 flex items-center gap-1 overflow-x-auto rounded-xl bg-canvas px-3 py-2.5">
          <span className="mr-1 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Atribuição</span>
          {cadeiaAtribuicao.map((c, i) => (
            <span key={i} className="flex shrink-0 items-center gap-1">
              <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10.5px] font-medium ${i < atribuicaoAtiva ? 'bg-brand-100 text-brand-800' : 'bg-black/5 text-ink-faint'}`}>
                <c.icone size={10} /> {c.label}
              </span>
              {i < cadeiaAtribuicao.length - 1 && <ChevronRight size={10} className="text-ink-faint" />}
            </span>
          ))}
        </div>

        {ativa && (
          <div className="mt-4 flex items-center gap-2">
            <button onClick={() => { marcarGanho(deal.id, autor); toast({ titulo: 'Negociação ganha 🎉', descricao: 'Funil e dashboard atualizados.', tipo: 'sucesso' }) }} className="btn-primary">
              <Trophy size={13} /> Marcar como ganha
            </button>
            <button onClick={() => setModalPerda(true)} className="btn-secondary text-red-600 hover:border-red-200">
              <XCircle size={13} /> Marcar como perdida
            </button>
            <button
              onClick={() => {
                if (orcamentosDoDeal[0]) navigate(`/orcamentos/${orcamentosDoDeal[0].id}`)
                else toast({ titulo: 'Nenhum orçamento vinculado ainda', descricao: 'Crie a partir do editor de orçamento.', tipo: 'info' })
              }}
              className="btn-secondary"
            >
              <FileText size={13} /> {orcamentosDoDeal.length > 0 ? 'Abrir orçamento' : 'Criar orçamento'}
            </button>
            <div className="flex-1" />
            {deal.proximaAcao && (
              <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-[11.5px] font-medium text-amber-800">
                Próxima ação: {deal.proximaAcao.descricao} · {fmtDataHora(deal.proximaAcao.em)}
              </span>
            )}
          </div>
        )}
        {deal.motivoPerda && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-700">Motivo da perda: {deal.motivoPerda} · Lead entrará no fluxo de remarketing automaticamente.</p>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-5">
        <div className="col-span-2">
          <Tabs
            tabs={[
              { id: 'timeline', label: 'Timeline', badge: eventos.length },
              { id: 'atividades', label: 'Atividades', badge: deal.atividades.length },
              { id: 'conversas', label: 'Conversas' },
              { id: 'orcamentos', label: 'Orçamentos', badge: orcamentosDoDeal.length },
            ]}
            ativa={aba}
            onMudar={setAba}
            className="mb-4"
          />

          {aba === 'timeline' && (
            <div className="card p-5">
              <Timeline eventos={eventos} comFiltro />
            </div>
          )}

          {aba === 'atividades' && (
            <div className="card p-5">
              <div className="mb-4 flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Registrar contato ou nota (ex.: 'Liguei, pediu retorno na sexta')"
                  value={notaContato}
                  onChange={(e) => setNotaContato(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && notaContato.trim()) {
                      registrarAtividade(deal.id, 'contato', notaContato.trim(), autor)
                      useTimelineStore.getState().addEvento(deal.contactId, 'tarefa', 'Contato registrado', notaContato.trim())
                      setNotaContato('')
                      toast({ titulo: 'Contato registrado', descricao: 'Entrou na timeline da negociação e do paciente.', tipo: 'sucesso' })
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (!notaContato.trim()) return
                    registrarAtividade(deal.id, 'contato', notaContato.trim(), autor)
                    useTimelineStore.getState().addEvento(deal.contactId, 'tarefa', 'Contato registrado', notaContato.trim())
                    setNotaContato('')
                    toast({ titulo: 'Contato registrado', descricao: 'Entrou na timeline da negociação e do paciente.', tipo: 'sucesso' })
                  }}
                  className="btn-primary"
                >
                  <Plus size={14} /> Registrar
                </button>
              </div>
              <div className="space-y-3">
                {[...deal.atividades].reverse().map((a) => (
                  <div key={a.id} className="flex gap-3">
                    <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${a.tipo === 'etapa' ? 'bg-brand-500' : a.tipo === 'sistema' ? 'bg-ai-500' : 'bg-ink-faint'}`} />
                    <div>
                      <p className="text-[12.5px] text-ink">{a.descricao}</p>
                      <p className="text-[10.5px] text-ink-faint">{a.autor} · {fmtRelativa(a.em)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {aba === 'conversas' && (
            <div className="card p-5">
              {conversa ? (
                <>
                  <div className="mb-3 max-h-80 space-y-2 overflow-y-auto rounded-xl bg-canvas p-4">
                    {conversa.mensagens.slice(-6).map((m) => (
                      <div key={m.id} className={`flex ${m.autor === 'contato' ? 'justify-start' : 'justify-end'}`}>
                        <p className={`max-w-[75%] rounded-xl px-3 py-1.5 text-[12px] ${m.autor === 'contato' ? 'bg-white' : m.autor === 'sistema' ? 'bg-black/5 text-ink-muted' : 'bg-brand-600 text-white'}`}>
                          {m.tipo === 'audio' ? '🎙 Áudio (transcrito pela IA)' : m.texto}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate('/inbox')} className="btn-secondary w-full">Abrir conversa completa na caixa de entrada</button>
                </>
              ) : (
                <p className="py-6 text-center text-[12.5px] text-ink-muted">Nenhuma conversa vinculada.</p>
              )}
            </div>
          )}

          {aba === 'orcamentos' && (
            <div className="card p-5">
              {orcamentosDoDeal.length > 0 ? (
                orcamentosDoDeal.map((q) => (
                  <button key={q.id} onClick={() => navigate(`/orcamentos/${q.id}`)} className="flex w-full items-center gap-3 rounded-xl border border-line p-3.5 text-left hover:border-brand-300">
                    <FileText size={16} className="text-ink-muted" />
                    <span className="flex-1">
                      <span className="block text-[13px] font-medium text-ink">Orçamento V{q.versao} — {q.itens[0]?.descricao}</span>
                      <span className="block text-[11px] text-ink-muted">Validade {q.validadeDias} dias · {q.parcelamento.entradaPct}% entrada + {q.parcelamento.parcelas}x</span>
                    </span>
                    <StatusPill status={q.status} />
                  </button>
                ))
              ) : (
                <p className="py-6 text-center text-[12.5px] text-ink-muted">Nenhum orçamento criado para esta negociação.</p>
              )}
            </div>
          )}
        </div>

        {/* Painel lateral */}
        <div className="space-y-4">
          <div className="card p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Follow-up com IA</p>
            {sugestaoFollowUp ? (
              <AISuggestion
                titulo="Mensagem de follow-up sugerida"
                compacto
                labelAprovar="Enviar por WhatsApp"
                onAprovar={() => {
                  if (conversa) useInboxStore.getState().addMensagemEquipe(conversa.id, followUpIA(contato.nome, deal), autor)
                  registrarAtividade(deal.id, 'followup', 'Follow-up enviado por WhatsApp (rascunho da IA aprovado)', autor)
                  setSugestaoFollowUp(false)
                  toast({ titulo: 'Follow-up enviado', descricao: 'Mensagem entregue no WhatsApp e registrada na negociação.', tipo: 'sucesso' })
                }}
                onEditar={() => toast({ titulo: 'Edição habilitada', descricao: 'Ajuste o texto antes de enviar (demonstração).', tipo: 'info' })}
                onDescartar={() => setSugestaoFollowUp(false)}
              >
                {followUpIA(contato.nome, deal)}
              </AISuggestion>
            ) : (
              <button onClick={() => setSugestaoFollowUp(true)} className="btn-ai w-full">
                <Sparkles size={13} /> Sugerir follow-up
              </button>
            )}
            <p className="mt-2 text-[10.5px] leading-relaxed text-ink-faint">A IA considera etapa do funil, tempo parado e histórico da conversa.</p>
          </div>

          <div className="card p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Detalhes</p>
            <dl className="space-y-2 text-[12px]">
              <div className="flex justify-between"><dt className="text-ink-muted">Origem</dt><dd className="font-medium text-ink">{contato.origem}</dd></div>
              {contato.campanha && <div className="flex justify-between"><dt className="text-ink-muted">Campanha</dt><dd className="font-medium text-ink">{contato.campanha}</dd></div>}
              <div className="flex justify-between"><dt className="text-ink-muted">Criada</dt><dd className="font-medium text-ink">{fmtRelativa(deal.criadoEm)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Última atualização</dt><dd className="font-medium text-ink">{fmtRelativa(deal.atualizadoEm)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Interesse</dt><dd className="font-medium text-ink">{contato.interesse}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-muted">Telefone</dt><dd className="font-medium text-ink">{contato.telefone}</dd></div>
            </dl>
          </div>

          <button onClick={() => toast({ titulo: 'Ligação registrada', descricao: 'Registro adicionado às atividades.', tipo: 'info' })} className="btn-secondary w-full">
            <Phone size={13} /> Registrar ligação
          </button>
        </div>
      </div>

      {/* Modal de perda */}
      <Modal aberto={modalPerda} onFechar={() => setModalPerda(false)} titulo="Marcar como perdida">
        <p className="mb-3 text-[12.5px] text-ink-muted">O motivo alimenta o relatório de perdas e o fluxo de remarketing.</p>
        <div className="space-y-2">
          {['Preço acima do orçamento', 'Sem retorno / esfriou', 'Fechou com concorrente', 'Adiou decisão', 'Contraindicação clínica'].map((m) => (
            <label key={m} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-[12.5px] ${motivoPerda === m ? 'border-brand-500 bg-brand-50' : 'border-line'}`}>
              <input type="radio" checked={motivoPerda === m} onChange={() => setMotivoPerda(m)} className="accent-brand-600" />
              {m}
            </label>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => setModalPerda(false)} className="btn-secondary">Cancelar</button>
          <button
            onClick={() => {
              marcarPerdido(deal.id, motivoPerda, autor)
              setModalPerda(false)
              toast({ titulo: 'Negociação marcada como perdida', descricao: 'Motivo registrado · lead entrará em remarketing em 60 dias.', tipo: 'info' })
            }}
            className="btn-danger"
          >
            Confirmar perda
          </button>
        </div>
      </Modal>
    </div>
  )
}

function followUpIA(nome: string, deal: { procedimentos: string[]; etapa: string }) {
  const primeiro = nome.split(' ')[0]
  if (deal.etapa === 'plano-apresentado')
    return `Oi, ${primeiro}! Passando para saber se ficou alguma dúvida sobre o plano de ${deal.procedimentos[0].toLowerCase()} que apresentamos 😊 Consegui uma condição nova este mês: entrada reduzida + 12x sem juros. Quer que eu te mande a simulação?`
  return `Oi, ${primeiro}, tudo bem? 😊 Vi que conversamos sobre ${deal.procedimentos[0].toLowerCase()} e queria saber se posso te ajudar com o próximo passo — temos horários de avaliação esta semana. Posso reservar um pra você?`
}
