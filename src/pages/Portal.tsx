import { useEffect, useRef, useState } from 'react'
import {
  Home,
  CalendarDays,
  FileText,
  Wallet,
  MessageCircle,
  Video,
  CheckCircle2,
  Send,
  Sparkles,
  Bell,
  ChevronRight,
} from 'lucide-react'
import { useAgendaStore } from '@/stores/useAgendaStore'
import { useBillingStore } from '@/stores/useBillingStore'
import { useClinicalStore } from '@/stores/useClinicalStore'
import { useUiStore } from '@/stores/useUiStore'
import { contatoById } from '@/data/contacts'
import { profById } from '@/data/team'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { brl, fmtData, fmtDataHora, fmtHora, primeiroNome } from '@/lib/format'

const PACIENTE_ID = 'ct-mariana'

type AbaPortal = 'inicio' | 'agenda' | 'docs' | 'financeiro' | 'chat'

export default function Portal() {
  const [aba, setAba] = useState<AbaPortal>('inicio')
  const contato = contatoById(PACIENTE_ID)!

  return (
    <div className="flex min-h-full items-center justify-center bg-gradient-to-br from-brand-950 via-ink to-brand-900 p-8">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
        {/* Texto de contexto da demo */}
        <div className="hidden max-w-sm text-white lg:block">
          <p className="font-display text-[26px] font-semibold leading-tight">A experiência da paciente, na palma da mão.</p>
          <p className="mt-3 text-[13.5px] leading-relaxed text-white/60">
            Este é o portal como <strong className="text-white/90">Mariana Duarte</strong> o vê: agendamentos, orientações personalizadas, documentos assinados, parcelas e um assistente que sabe o limite entre o administrativo e o clínico.
          </p>
          <ul className="mt-5 space-y-2 text-[12.5px] text-white/70">
            <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold-300" /> Menos ligações para a recepção — autonomia com segurança</li>
            <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold-300" /> Documentos e prescrições chegam na hora, assinados</li>
            <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-gold-300" /> Perguntas de sintoma são encaminhadas à equipe — teste no chat</li>
          </ul>
        </div>

        {/* Moldura do celular */}
        <div className="rounded-[42px] bg-zinc-900 p-2.5 shadow-overlay ring-1 ring-white/20">
          <div className="relative flex h-[680px] w-[330px] flex-col overflow-hidden rounded-[34px] bg-canvas">
            {/* Notch */}
            <div className="absolute left-1/2 top-2 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-zinc-900" />

            {/* Header */}
            <div className="bg-brand-950 px-5 pb-4 pt-10 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">Clínica M. Luther</p>
                  <p className="font-display text-[17px] font-semibold">Olá, {primeiroNome(contato.nome)} 👋</p>
                </div>
                <div className="relative">
                  <Bell size={17} className="text-white/70" />
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-gold-300" />
                </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {aba === 'inicio' && <PortalInicio onIr={setAba} />}
              {aba === 'agenda' && <PortalAgenda />}
              {aba === 'docs' && <PortalDocs />}
              {aba === 'financeiro' && <PortalFinanceiro />}
              {aba === 'chat' && <PortalChat />}
            </div>

            {/* Bottom nav */}
            <div className="flex items-center justify-around border-t border-line bg-surface px-2 py-2.5">
              {(
                [
                  ['inicio', Home, 'Início'],
                  ['agenda', CalendarDays, 'Agenda'],
                  ['docs', FileText, 'Docs'],
                  ['financeiro', Wallet, 'Financeiro'],
                  ['chat', MessageCircle, 'Assistente'],
                ] as const
              ).map(([id, Icone, label]) => (
                <button key={id} onClick={() => setAba(id)} className={`flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1 ${aba === id ? 'text-brand-700' : 'text-ink-faint'}`}>
                  <Icone size={17} />
                  <span className="text-[8.5px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PortalInicio({ onIr }: { onIr: (aba: AbaPortal) => void }) {
  const proximos = useAgendaStore((s) =>
    s.agendamentos
      .filter((a) => a.contactId === PACIENTE_ID && new Date(a.inicio) >= new Date(new Date().setHours(0, 0, 0, 0)) && a.status !== 'cancelado')
      .sort((x, y) => x.inicio.localeCompare(y.inicio)),
  )
  const parcelas = useBillingStore((s) => s.parcelas.filter((p) => p.contactId === PACIENTE_ID && p.status !== 'pago'))

  return (
    <div className="space-y-4 p-4">
      {proximos[0] && (
        <div className="rounded-2xl bg-brand-600 p-4 text-white shadow-card">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/60">Próximo compromisso</p>
          <p className="mt-1 font-display text-[15px] font-semibold leading-snug">{proximos[0].titulo}</p>
          <p className="mt-0.5 text-[12px] text-white/80">{fmtDataHora(proximos[0].inicio)} · {profById(proximos[0].profissionalId)?.nome}</p>
          <p className="text-[11px] text-white/60">M. Luther Toledo · Av. Maripá, 2410</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => onIr('agenda')} className="flex-1 rounded-lg bg-white/15 py-2 text-[11.5px] font-semibold backdrop-blur hover:bg-white/25">Fazer check-in</button>
            <button onClick={() => onIr('agenda')} className="rounded-lg bg-white/15 px-3 py-2 text-[11.5px] font-medium hover:bg-white/25">Remarcar</button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-line bg-surface p-4">
        <p className="mb-2 text-[12px] font-semibold text-ink">Sua preparação para a avaliação</p>
        {[
          { t: 'Formulário de saúde', ok: true },
          { t: 'Documento com foto', ok: true },
          { t: 'Lista de medicamentos em uso', ok: false },
        ].map((i) => (
          <div key={i.t} className="flex items-center gap-2 py-1">
            <CheckCircle2 size={14} className={i.ok ? 'text-emerald-500' : 'text-ink-faint'} />
            <span className={`text-[12px] ${i.ok ? 'text-ink-muted line-through' : 'text-ink'}`}>{i.t}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gold-200 bg-gold-50/60 p-4">
        <p className="text-[12px] font-semibold text-gold-800">Orientações pré-consulta</p>
        <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">
          Venha sem maquiagem na região do nariz e traga fotos antigas de perfil, se tiver. Isso ajuda o Dr. Renato a entender sua expectativa. 😊
        </p>
      </div>

      {parcelas.length > 0 && (
        <button onClick={() => onIr('financeiro')} className="flex w-full items-center justify-between rounded-2xl border border-line bg-surface p-4 text-left">
          <span>
            <span className="block text-[12px] font-semibold text-ink">Financeiro</span>
            <span className="block text-[11px] text-ink-muted">{parcelas.length} lançamento(s) em aberto</span>
          </span>
          <ChevronRight size={15} className="text-ink-faint" />
        </button>
      )}

      <button className="flex w-full items-center gap-3 rounded-2xl border border-ai-200 bg-ai-50 p-4 text-left" onClick={() => onIr('chat')}>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ai-100 text-ai-600"><Sparkles size={16} /></span>
        <span>
          <span className="block text-[12px] font-semibold text-ai-700">Assistente M. Luther</span>
          <span className="block text-[11px] text-ink-muted">Tire dúvidas sobre horários, preparo e documentos</span>
        </span>
      </button>
    </div>
  )
}

function PortalAgenda() {
  const toast = useUiStore((s) => s.toast)
  const agendamentos = useAgendaStore((s) =>
    s.agendamentos.filter((a) => a.contactId === PACIENTE_ID).sort((x, y) => x.inicio.localeCompare(y.inicio)),
  )
  return (
    <div className="space-y-3 p-4">
      <p className="font-display text-[15px] font-semibold text-ink">Meus agendamentos</p>
      {agendamentos.map((a) => (
        <div key={a.id} className="rounded-2xl border border-line bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="text-[12.5px] font-semibold text-ink">{a.titulo}</p>
            <StatusPill status={a.status} />
          </div>
          <p className="mt-1 text-[11.5px] text-ink-muted">{fmtData(a.inicio)} às {fmtHora(a.inicio)} · {profById(a.profissionalId)?.nome}</p>
          {['confirmado', 'aguardando-confirmacao', 'pre-agendado'].includes(a.status) && (
            <div className="mt-2.5 flex gap-2">
              <button
                onClick={() => {
                  useAgendaStore.getState().setStatus(a.id, 'checkin')
                  toast({ titulo: 'Check-in realizado pelo portal', descricao: 'A recepção já sabe que a Mariana chegou — veja a fila do dia.', tipo: 'sucesso' })
                }}
                className="flex-1 rounded-lg bg-brand-600 py-2 text-[11.5px] font-semibold text-white"
              >
                Check-in digital
              </button>
              <button onClick={() => toast({ titulo: 'Remarcação solicitada', descricao: 'A equipe confirmará o novo horário em instantes.', tipo: 'info' })} className="rounded-lg border border-line px-3 py-2 text-[11.5px] font-medium text-ink-soft">
                Remarcar
              </button>
            </div>
          )}
          {a.tipo === 'teleconsulta' && (
            <button className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-ai-100 py-2 text-[11.5px] font-semibold text-ai-700">
              <Video size={13} /> Entrar na sala virtual
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

function PortalDocs() {
  const documentos = useClinicalStore((s) => s.documentos.filter((d) => d.contactId === PACIENTE_ID))
  const prescricoes = useClinicalStore((s) => s.prescricoes.filter((p) => p.contactId === PACIENTE_ID))
  return (
    <div className="space-y-3 p-4">
      <p className="font-display text-[15px] font-semibold text-ink">Documentos e prescrições</p>
      {prescricoes.length === 0 && documentos.length === 0 && (
        <p className="rounded-2xl border border-line bg-surface p-4 text-[12px] text-ink-muted">
          Seus documentos aparecerão aqui após a consulta — prescrições, pedidos de exame e orientações, todos assinados digitalmente.
        </p>
      )}
      {prescricoes.map((p) => (
        <div key={p.id} className="rounded-2xl border border-line bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="text-[12.5px] font-semibold text-ink">{p.titulo}</p>
            <StatusPill status={p.status} />
          </div>
          <ul className="mt-2 space-y-0.5 text-[11.5px] text-ink-soft">
            {p.itens.map((i) => (
              <li key={i.medicamento}>• {i.medicamento}</li>
            ))}
          </ul>
          {p.status === 'assinado' && (
            <p className="mt-2 flex items-center gap-1 text-[10.5px] text-emerald-600"><CheckCircle2 size={11} /> Assinado digitalmente · válido em qualquer laboratório</p>
          )}
        </div>
      ))}
      {documentos.map((d) => (
        <div key={d.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5">
          <FileText size={16} className="text-ink-muted" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-medium text-ink">{d.titulo}</span>
            <span className="block text-[10.5px] text-ink-muted">{fmtData(d.em)}</span>
          </span>
          <StatusPill status={d.status} />
        </div>
      ))}
    </div>
  )
}

function PortalFinanceiro() {
  const toast = useUiStore((s) => s.toast)
  const { parcelas, pagarParcela } = useBillingStore()
  const minhas = parcelas.filter((p) => p.contactId === PACIENTE_ID).sort((a, b) => a.vencimento.localeCompare(b.vencimento))
  return (
    <div className="space-y-3 p-4">
      <p className="font-display text-[15px] font-semibold text-ink">Financeiro</p>
      {minhas.length === 0 && (
        <p className="rounded-2xl border border-line bg-surface p-4 text-[12px] text-ink-muted">
          Nenhum lançamento por enquanto. Quando seu plano de tratamento for fechado, as parcelas aparecem aqui com pagamento por Pix ou cartão em 1 toque.
        </p>
      )}
      {minhas.map((p) => (
        <div key={p.id} className="rounded-2xl border border-line bg-surface p-4">
          <div className="flex items-center justify-between">
            <p className="text-[12.5px] font-semibold text-ink">{p.descricao}</p>
            <StatusPill status={p.status} />
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-[11px] text-ink-muted">Vencimento {fmtData(p.vencimento)}</p>
            <p className="text-[14px] font-bold text-ink">{brl(p.valor)}</p>
          </div>
          {p.status !== 'pago' && (
            <button
              onClick={() => {
                pagarParcela(p.id)
                toast({ titulo: 'Pagamento confirmado (Pix simulado)', descricao: 'Recibo disponível em Documentos · financeiro da clínica atualizado.', tipo: 'sucesso' })
              }}
              className="mt-2.5 w-full rounded-lg bg-brand-600 py-2 text-[11.5px] font-semibold text-white"
            >
              Pagar com Pix
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

function PortalChat() {
  const [mensagens, setMensagens] = useState<{ autor: 'ia' | 'paciente'; texto: string }[]>([
    { autor: 'ia', texto: 'Oi, Mariana! 💚 Sou a assistente da Clínica M. Luther. Posso ajudar com horários, preparo para a consulta, documentos e pagamentos. O que você precisa?' },
  ])
  const [texto, setTexto] = useState('')
  const [digitando, setDigitando] = useState(false)
  const fimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens, digitando])

  const responder = (pergunta: string) => {
    const p = pergunta.toLowerCase()
    if (/(dor|sangr|febre|inchaç|sintoma|enjoo|mal[- ]estar)/.test(p)) {
      return '⚠️ Percebi que sua mensagem envolve um sintoma. Por segurança, não posso orientar questões clínicas — já encaminhei sua mensagem para a equipe do Dr. Renato com prioridade, e alguém falará com você em instantes. Se for urgência, ligue (11) 99999-0000.'
    }
    if (/(hor[aá]rio|quando|agend|consulta|remarcar)/.test(p)) {
      return 'Sua avaliação com o Dr. Renato Somensi é hoje às 10h, na unidade Toledo (Av. Maripá, 2410 — estacionamento com valet). Quer fazer o check-in digital ou remarcar?'
    }
    if (/(pagar|parcela|valor|preço|pix|boleto)/.test(p)) {
      return 'Você pode ver valores e pagar parcelas na aba Financeiro deste app, por Pix ou cartão. Após o fechamento do seu plano, todas as parcelas ficam disponíveis lá com recibo automático. 😊'
    }
    if (/(preparo|jejum|maquiagem|levar|documento)/.test(p)) {
      return 'Para a avaliação: venha sem maquiagem na região do nariz, traga um documento com foto e, se tiver, fotos antigas de perfil. Não precisa de jejum! 😊'
    }
    return 'Boa pergunta! Sobre isso, o ideal é confirmar com a equipe — já registrei sua dúvida e a recepção responde por aqui em instantes. Posso ajudar com mais alguma coisa administrativa?'
  }

  const enviar = (t?: string) => {
    const msg = (t ?? texto).trim()
    if (!msg) return
    setMensagens((m) => [...m, { autor: 'paciente', texto: msg }])
    setTexto('')
    setDigitando(true)
    setTimeout(() => {
      setDigitando(false)
      setMensagens((m) => [...m, { autor: 'ia', texto: responder(msg) }])
    }, 1300)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
        {mensagens.map((m, i) => (
          <div key={i} className={`flex ${m.autor === 'paciente' ? 'justify-end' : 'justify-start'} animate-fade-up`}>
            <p className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[12px] leading-relaxed ${m.autor === 'paciente' ? 'rounded-br-md bg-brand-600 text-white' : 'rounded-bl-md border border-line bg-surface text-ink'}`}>
              {m.texto}
            </p>
          </div>
        ))}
        {digitando && (
          <div className="flex items-center gap-1 pl-2">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        <div ref={fimRef} />
      </div>
      <div className="border-t border-line p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {['Qual o horário da minha consulta?', 'Preciso de algum preparo?', 'Estou com dor, é normal?'].map((s) => (
            <button key={s} onClick={() => enviar(s)} className="rounded-full border border-line bg-surface px-2.5 py-1 text-[10px] text-ink-soft hover:border-brand-300">
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="input flex-1 py-2 text-[12px]"
            placeholder="Escreva sua dúvida..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviar()}
          />
          <button onClick={() => enviar()} className="btn-primary px-3"><Send size={14} /></button>
        </div>
      </div>
    </div>
  )
}
