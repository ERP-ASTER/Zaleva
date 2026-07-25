import { addMonths } from 'date-fns'
import { uid } from './ids'
import { emDias } from '@/data/dates'
import { contatoById } from '@/data/contacts'
import { useBillingStore } from '@/stores/useBillingStore'
import { useCrmStore } from '@/stores/useCrmStore'
import { useAgendaStore } from '@/stores/useAgendaStore'
import { usePostOpStore } from '@/stores/usePostOpStore'
import { useTimelineStore } from '@/stores/useTimelineStore'
import { useInboxStore } from '@/stores/useInboxStore'
import { passosPadraoPosOp } from '@/data/postop'
import type { Contract, Installment, Journey } from '@/data/types'

export interface ItemCascata {
  icone: 'contrato' | 'pagamento' | 'agendamento' | 'checklist' | 'jornada' | 'crm'
  titulo: string
  descricao: string
  rota: string
}

export const totalOrcamento = (itens: { valor: number }[], descontoPct: number) => {
  const bruto = itens.reduce((acc, i) => acc + i.valor, 0)
  return Math.round(bruto * (1 - descontoPct / 100))
}

/**
 * Clímax da Jornada 1: aceite do orçamento dispara a cascata automática —
 * contrato + parcelas + agendamento cirúrgico + checklist pré-op + jornada de pós.
 */
export function aceitarOrcamento(quoteId: string): ItemCascata[] {
  const billing = useBillingStore.getState()
  const quote = billing.orcamentos.find((q) => q.id === quoteId)
  if (!quote || quote.status === 'aceito') return []

  const contato = contatoById(quote.contactId)
  const nome = contato?.nome ?? 'Paciente'
  const valor = totalOrcamento(quote.itens, quote.descontoPct)
  const procedimentoPrincipal = quote.itens[0]?.descricao ?? 'Procedimento'
  const agora = new Date().toISOString()
  const timeline = useTimelineStore.getState()

  // 1. Orçamento aceito
  billing.atualizarOrcamento(quoteId, { status: 'aceito', aceitoEm: agora })
  timeline.addEvento(quote.contactId, 'orcamento', `Orçamento aceito — R$ ${valor.toLocaleString('pt-BR')}`, procedimentoPrincipal, `/orcamentos/${quoteId}`)

  // 2. Contrato
  const contratoId = uid('contr')
  const contrato: Contract = {
    id: contratoId,
    contactId: quote.contactId,
    quoteId,
    titulo: `Contrato de prestação de serviços — ${procedimentoPrincipal}`,
    valor,
    status: 'enviado',
    criadoEm: agora,
    trilha: [
      { evento: 'Contrato gerado automaticamente após aceite do orçamento', em: agora },
      { evento: 'Enviado por WhatsApp — link seguro de assinatura', em: agora },
    ],
    termos: [
      { nome: `Termo de consentimento — ${procedimentoPrincipal}`, assinado: false },
      { nome: 'Termo de anestesia', assinado: false },
    ],
  }
  billing.addContrato(contrato)
  timeline.addEvento(quote.contactId, 'contrato', 'Contrato gerado e enviado para assinatura', 'Link seguro enviado por WhatsApp', '/contratos')

  // 3. Parcelas
  const entrada = Math.round((valor * quote.parcelamento.entradaPct) / 100)
  const restante = valor - entrada
  const valorParcela = Math.round(restante / quote.parcelamento.parcelas)
  const novasParcelas: Installment[] = [
    {
      id: uid('par'),
      contactId: quote.contactId,
      contractId: contratoId,
      descricao: `Entrada (${quote.parcelamento.entradaPct}%)`,
      valor: entrada,
      vencimento: emDias(3),
      status: 'aberto',
    },
    ...Array.from({ length: quote.parcelamento.parcelas }, (_, i) => ({
      id: uid('par'),
      contactId: quote.contactId,
      contractId: contratoId,
      descricao: `Parcela ${i + 1}/${quote.parcelamento.parcelas}`,
      valor: valorParcela,
      vencimento: addMonths(new Date(), i + 1).toISOString(),
      status: 'aberto' as const,
    })),
  ]
  billing.addParcelas(novasParcelas)

  // 4. Agendamento do procedimento (D+21, centro cirúrgico)
  useAgendaStore.getState().criarAgendamento({
    contactId: quote.contactId,
    profissionalId: 'prof-otavio',
    tipo: 'procedimento',
    titulo: procedimentoPrincipal,
    inicio: emDias(21, 7, 30),
    duracaoMin: 180,
    unidadeId: contato?.unidadeId ?? 'un-toledo',
  })

  // 5. Jornada de pós-atendimento (inclui checklist pré-op nos passos)
  const jornada: Journey = {
    id: uid('jn'),
    contactId: quote.contactId,
    procedimento: procedimentoPrincipal,
    procedimentoEm: emDias(21, 7, 30),
    risco: 'baixo',
    steps: passosPadraoPosOp(21),
  }
  usePostOpStore.getState().addJornada(jornada)
  timeline.addEvento(quote.contactId, 'procedimento', 'Jornada pré e pós-operatória ativada', 'Checklist pré-op + acompanhamento automatizado de 45 dias', '/pos-atendimento')

  // 6. CRM → fechado
  const deal = quote.dealId ? useCrmStore.getState().negociacoes.find((d) => d.id === quote.dealId) : undefined
  if (quote.dealId) useCrmStore.getState().marcarGanho(quote.dealId, 'Automação Zaleva')

  // 7. Mensagem no WhatsApp do paciente
  const conversa = useInboxStore.getState().conversas.find((c) => c.contactId === quote.contactId)
  if (conversa) {
    useInboxStore
      .getState()
      .addMensagemSistema(conversa.id, `Orçamento aceito 🎉 Contrato, parcelas e agendamento gerados automaticamente`)
  }

  return [
    { icone: 'contrato', titulo: 'Contrato gerado e enviado', descricao: `${nome} recebeu o link seguro de assinatura por WhatsApp`, rota: '/contratos' },
    { icone: 'pagamento', titulo: `${1 + quote.parcelamento.parcelas} parcelas geradas`, descricao: `Entrada de R$ ${entrada.toLocaleString('pt-BR')} + ${quote.parcelamento.parcelas}x de R$ ${valorParcela.toLocaleString('pt-BR')}`, rota: `/pacientes/${quote.contactId}` },
    { icone: 'agendamento', titulo: 'Procedimento agendado', descricao: `${procedimentoPrincipal} — daqui a 3 semanas, Centro Cirúrgico`, rota: '/agenda' },
    { icone: 'checklist', titulo: 'Checklist pré-operatório criado', descricao: 'Exames, termos e liberações a acompanhar', rota: '/pos-atendimento' },
    { icone: 'jornada', titulo: 'Jornada de acompanhamento ativada', descricao: 'Orientações → check-in 24h → foto D+7 → retorno D+30 → NPS', rota: '/pos-atendimento' },
    ...(deal ? [{ icone: 'crm' as const, titulo: 'Negociação marcada como ganha', descricao: `Funil atualizado — receita de R$ ${valor.toLocaleString('pt-BR')} atribuída à campanha`, rota: `/crm/${deal.id}` }] : []),
  ]
}
