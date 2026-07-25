import { useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  PartyPopper,
  FileSignature,
  CircleDollarSign,
  CalendarDays,
  ClipboardCheck,
  HeartPulse,
  KanbanSquare,
  ArrowRight,
  Package,
} from 'lucide-react'
import { useBillingStore } from '@/stores/useBillingStore'
import { useInboxStore } from '@/stores/useInboxStore'
import { useUiStore } from '@/stores/useUiStore'
import { useSessionStore } from '@/stores/useSessionStore'
import { contatoById } from '@/data/contacts'
import { profById } from '@/data/team'
import { catalogo, pacotes } from '@/data/catalog'
import { aceitarOrcamento, totalOrcamento, type ItemCascata } from '@/lib/cascade'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { Modal } from '@/components/ui/Modal'
import { LutherLogo } from '@/components/modules/MedicalDoc'
import { brl, fmtData } from '@/lib/format'

const iconesCascata: Record<ItemCascata['icone'], typeof FileSignature> = {
  contrato: FileSignature,
  pagamento: CircleDollarSign,
  agendamento: CalendarDays,
  checklist: ClipboardCheck,
  jornada: HeartPulse,
  crm: KanbanSquare,
}

export default function QuoteEditor() {
  const { quoteId } = useParams()
  const navigate = useNavigate()
  const quote = useBillingStore((s) => s.orcamentos.find((q) => q.id === quoteId))
  const { atualizarOrcamento } = useBillingStore()
  const toast = useUiStore((s) => s.toast)
  const profissionalId = useSessionStore((s) => s.profissionalId)
  const [cascata, setCascata] = useState<ItemCascata[] | null>(null)
  const [catalogoAberto, setCatalogoAberto] = useState(false)

  const total = useMemo(() => (quote ? totalOrcamento(quote.itens, quote.descontoPct) : 0), [quote])

  if (!quote) {
    return (
      <div className="p-8">
        <p className="text-ink-muted">Orçamento não encontrado.</p>
        <Link to="/crm" className="text-brand-600">Voltar ao CRM</Link>
      </div>
    )
  }

  const contato = contatoById(quote.contactId)!
  const editavel = quote.status === 'rascunho'
  const entrada = Math.round((total * quote.parcelamento.entradaPct) / 100)
  const valorParcela = Math.round((total - entrada) / quote.parcelamento.parcelas)

  const enviarWhatsApp = () => {
    atualizarOrcamento(quote.id, { status: 'enviado', enviadoEm: new Date().toISOString() })
    const conversa = useInboxStore.getState().conversas.find((c) => c.contactId === quote.contactId)
    if (conversa) {
      useInboxStore.getState().addMensagemEquipe(
        conversa.id,
        `📋 ${contato.nome.split(' ')[0]}, seu plano de tratamento está pronto! Orçamento ${quote.itens[0]?.descricao} — ${brl(total)} (entrada de ${quote.parcelamento.entradaPct}% + ${quote.parcelamento.parcelas}x de ${brl(valorParcela)}). Veja os detalhes e aceite pelo link seguro: mluther.zaleva.app/orc/${quote.id}`,
        profById(profissionalId)?.nome ?? 'Equipe',
      )
    }
    toast({ titulo: 'Orçamento enviado por WhatsApp', descricao: 'A mensagem já aparece na conversa da paciente. Abertura será rastreada.', tipo: 'sucesso' })
  }

  const aceitar = () => {
    const itens = aceitarOrcamento(quote.id)
    setCascata(itens)
  }

  return (
    <div className="mx-auto max-w-[1150px] p-6">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-[12.5px] font-medium text-ink-muted hover:text-ink">
        <ArrowLeft size={14} /> Voltar
      </button>

      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar nome={contato.nome} cor={contato.avatarColor} size={44} />
          <div>
            <h1 className="font-display text-[20px] font-semibold text-ink">Orçamento — {contato.nome}</h1>
            <p className="text-[12px] text-ink-muted">
              Versão {quote.versao} · criado em {fmtData(quote.criadoEm)} · validade de {quote.validadeDias} dias
            </p>
          </div>
          <StatusPill status={quote.status} className="ml-2" />
        </div>
        <div className="flex gap-2">
          {quote.status === 'rascunho' && (
            <button onClick={enviarWhatsApp} className="btn-primary">
              <Send size={13} /> Enviar por WhatsApp
            </button>
          )}
          {['enviado', 'visualizado'].includes(quote.status) && (
            <button onClick={aceitar} className="btn bg-gold-500 text-white hover:bg-gold-600">
              <PartyPopper size={14} /> Marcar como aceito
            </button>
          )}
          {quote.status === 'aceito' && (
            <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-[12px] font-semibold text-emerald-700">
              <PartyPopper size={14} /> Aceito {quote.aceitoEm ? `em ${fmtData(quote.aceitoEm)}` : ''} — cascata executada
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Editor */}
        <div className="col-span-3 space-y-4">
          <div className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[13px] font-semibold text-ink">Itens do plano</p>
              {editavel && (
                <button onClick={() => setCatalogoAberto(true)} className="btn-secondary py-1.5 text-[11.5px]">
                  <Plus size={13} /> Adicionar do catálogo
                </button>
              )}
            </div>
            <div className="space-y-2">
              {quote.itens.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-line px-4 py-3">
                  <span className="flex-1 text-[13px] font-medium text-ink">{item.descricao}</span>
                  <span className={`text-[13px] font-semibold ${item.valor < 0 ? 'text-emerald-600' : 'text-ink'}`}>{brl(item.valor)}</span>
                  {editavel && quote.itens.length > 1 && (
                    <button
                      onClick={() => atualizarOrcamento(quote.id, { itens: quote.itens.filter((_, j) => j !== i) })}
                      className="rounded-md p-1 text-ink-faint hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-line pt-3.5">
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-ink-muted">Subtotal</span>
                <span className="font-medium text-ink">{brl(quote.itens.reduce((a, i) => a + i.valor, 0))}</span>
              </div>
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-ink-muted">Desconto</span>
                <span className="flex items-center gap-2">
                  {editavel ? (
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={quote.descontoPct}
                      onChange={(e) => atualizarOrcamento(quote.id, { descontoPct: Number(e.target.value) })}
                      className="input w-16 py-1 text-right text-[12px]"
                    />
                  ) : (
                    <span className="font-medium text-ink">{quote.descontoPct}</span>
                  )}
                  <span className="text-ink-muted">%</span>
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-2.5">
                <span className="text-[13px] font-semibold text-ink">Total</span>
                <span className="font-display text-[22px] font-semibold text-gold-700">{brl(total)}</span>
              </div>
            </div>
          </div>

          {/* Simulador de parcelamento */}
          <div className="card p-5">
            <p className="mb-3 text-[13px] font-semibold text-ink">Simulador de condições</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-[11.5px] text-ink-muted">Entrada ({quote.parcelamento.entradaPct}%)</label>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={5}
                  disabled={!editavel}
                  value={quote.parcelamento.entradaPct}
                  onChange={(e) => atualizarOrcamento(quote.id, { parcelamento: { ...quote.parcelamento, entradaPct: Number(e.target.value) } })}
                  className="w-full accent-brand-600"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11.5px] text-ink-muted">Parcelas ({quote.parcelamento.parcelas}x)</label>
                <input
                  type="range"
                  min={1}
                  max={12}
                  disabled={!editavel}
                  value={quote.parcelamento.parcelas}
                  onChange={(e) => atualizarOrcamento(quote.id, { parcelamento: { ...quote.parcelamento, parcelas: Number(e.target.value) } })}
                  className="w-full accent-brand-600"
                />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-canvas p-3 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Entrada</p>
                <p className="mt-0.5 text-[15px] font-bold text-ink">{brl(entrada)}</p>
              </div>
              <div className="rounded-xl bg-canvas p-3 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">{quote.parcelamento.parcelas}x de</p>
                <p className="mt-0.5 text-[15px] font-bold text-ink">{brl(valorParcela)}</p>
              </div>
              <div className="rounded-xl border border-gold-200 bg-gold-50 p-3 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gold-700">Total</p>
                <p className="mt-0.5 text-[15px] font-bold text-gold-700">{brl(total)}</p>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-ink-faint">Condições: {quote.condicoes}</p>
          </div>
        </div>

        {/* Preview do documento */}
        <div className="col-span-2">
          <div className="sticky top-6 overflow-hidden rounded-2xl border border-line bg-white shadow-raised">
            <div className="flex items-center gap-3 bg-brand-950 px-6 py-5 text-white">
              <LutherLogo size={40} />
              <div>
                <p className="font-display text-[18px] font-semibold tracking-wide">Clínica M. Luther</p>
                <p className="text-[10.5px] uppercase tracking-[0.18em] text-white/50">Cirurgia Plástica & Estética</p>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Proposta de plano de tratamento</p>
                <p className="mt-1 font-display text-[16px] font-semibold text-ink">{contato.nome}</p>
                <p className="text-[11px] text-ink-muted">Elaborado por Dr. Renato Somensi · CRM 2469-MS</p>
              </div>
              <div className="space-y-1.5 border-y border-dashed border-line py-3">
                {quote.itens.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-[12px]">
                    <span className="text-ink-soft">{i.descricao}</span>
                    <span className="font-medium text-ink">{brl(i.valor)}</span>
                  </div>
                ))}
                {quote.descontoPct > 0 && (
                  <div className="flex justify-between text-[12px] text-emerald-600">
                    <span>Desconto pacote</span>
                    <span>−{quote.descontoPct}%</span>
                  </div>
                )}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-ink-faint">Investimento total</p>
                  <p className="font-display text-[24px] font-semibold text-brand-700">{brl(total)}</p>
                </div>
                <p className="text-right text-[10.5px] leading-snug text-ink-muted">
                  Entrada {brl(entrada)}<br />+ {quote.parcelamento.parcelas}x {brl(valorParcela)}
                </p>
              </div>
              <p className="rounded-lg bg-canvas p-2.5 text-[10px] leading-relaxed text-ink-muted">
                Inclui honorários da equipe, taxas hospitalares, anestesista e acompanhamento pós-operatório de 12 meses com jornada digital Zaleva. Validade: {quote.validadeDias} dias.
              </p>
              <div className="flex items-center justify-between border-t border-line pt-3">
                <p className="text-[9.5px] text-ink-faint">Documento gerado pela plataforma Zaleva</p>
                <p className="font-display text-[11px] font-semibold text-brand-700">zaleva</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Catálogo */}
      <Modal aberto={catalogoAberto} onFechar={() => setCatalogoAberto(false)} titulo="Adicionar do catálogo" larguraMax="max-w-xl">
        <p className="mb-3 flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint"><Package size={12} /> Pacotes com desconto</p>
        <div className="mb-4 space-y-2">
          {pacotes.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                const novos = p.itens.map((cid) => {
                  const c = catalogo.find((x) => x.id === cid)!
                  return { catalogId: c.id, descricao: c.nome, valor: c.valorBase }
                })
                atualizarOrcamento(quote.id, { itens: [...quote.itens, ...novos], descontoPct: p.descontoPct })
                setCatalogoAberto(false)
                toast({ titulo: `Pacote "${p.nome}" adicionado`, descricao: `Desconto de ${p.descontoPct}% aplicado automaticamente.`, tipo: 'sucesso' })
              }}
              className="flex w-full items-center justify-between rounded-xl border border-gold-200 bg-gold-50/50 p-3.5 text-left hover:border-gold-300"
            >
              <span>
                <span className="block text-[12.5px] font-semibold text-ink">{p.nome}</span>
                <span className="block text-[11px] text-ink-muted">{p.itens.map((i) => catalogo.find((c) => c.id === i)?.nome).join(' + ')}</span>
              </span>
              <span className="rounded-full bg-gold-100 px-2 py-1 text-[11px] font-bold text-gold-700">−{p.descontoPct}%</span>
            </button>
          ))}
        </div>
        <p className="mb-2 text-[11.5px] font-semibold uppercase tracking-wide text-ink-faint">Itens avulsos</p>
        <div className="space-y-1.5">
          {catalogo.filter((c) => c.categoria !== 'consulta').map((c) => (
            <button
              key={c.id}
              onClick={() => {
                atualizarOrcamento(quote.id, { itens: [...quote.itens, { catalogId: c.id, descricao: c.nome, valor: c.valorBase }] })
                setCatalogoAberto(false)
              }}
              className="flex w-full items-center justify-between rounded-lg border border-line px-3.5 py-2.5 text-left hover:border-brand-300"
            >
              <span className="text-[12.5px] text-ink">{c.nome}</span>
              <span className="text-[12.5px] font-semibold text-ink">{brl(c.valorBase)}</span>
            </button>
          ))}
        </div>
      </Modal>

      {/* Modal da cascata — clímax da Jornada 1 */}
      <Modal aberto={!!cascata} onFechar={() => setCascata(null)} titulo={
        <span className="flex items-center gap-2"><PartyPopper size={20} className="text-gold-500" /> Orçamento aceito — veja o que o Zaleva criou automaticamente</span>
      } larguraMax="max-w-xl">
        <p className="mb-4 text-[12.5px] leading-relaxed text-ink-muted">
          Um único clique disparou toda a esteira operacional. Nenhuma etapa depende de alguém lembrar de fazer:
        </p>
        <div className="space-y-2">
          {cascata?.map((item, i) => {
            const Icone = iconesCascata[item.icone]
            return (
              <button
                key={i}
                onClick={() => {
                  setCascata(null)
                  navigate(item.rota)
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-line p-3.5 text-left transition-all hover:border-brand-300 hover:shadow-card animate-fade-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icone size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-ink">{item.titulo}</span>
                  <span className="block text-[11.5px] text-ink-muted">{item.descricao}</span>
                </span>
                <ArrowRight size={14} className="shrink-0 text-ink-faint" />
              </button>
            )
          })}
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={() => { setCascata(null); navigate(`/pacientes/${quote.contactId}`) }} className="btn-primary flex-1">
            Ver timeline da paciente
          </button>
          <button onClick={() => { setCascata(null); navigate('/dashboards') }} className="btn-secondary flex-1">
            Ver reflexo no dashboard
          </button>
        </div>
      </Modal>
    </div>
  )
}
