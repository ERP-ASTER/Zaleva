import type { Quote, Contract, Installment, MesFinanceiro, CampanhaStat } from './types'
import { diasAtras, mesesAtras, emDias, emMeses } from './dates'
import { startOfMonth, subMonths } from 'date-fns'

// ─── Orçamentos ────────────────────────────────────────────────────────────
export const orcamentos: Quote[] = [
  {
    id: 'qt-mariana',
    contactId: 'ct-mariana',
    dealId: 'dl-mariana',
    versao: 1,
    itens: [
      { catalogId: 'cat-rino', descricao: 'Rinoplastia estruturada + septoplastia', valor: 34000 },
      { catalogId: 'cat-avaliacao', descricao: 'Consulta de avaliação (abatida no fechamento)', valor: -700 },
    ],
    descontoPct: 0,
    condicoes: 'Entrada de 30% + saldo em até 10x sem juros no cartão. Inclui taxas hospitalares, anestesista e acompanhamento pós-operatório de 12 meses.',
    parcelamento: { entradaPct: 30, parcelas: 10 },
    validadeDias: 15,
    status: 'rascunho',
    criadoEm: emDias(0, 11),
  },
  {
    id: 'qt-tatiane',
    contactId: 'ct-tatiane',
    dealId: 'dl-tatiane',
    versao: 2,
    itens: [{ catalogId: 'cat-rino', descricao: 'Rinoplastia estruturada', valor: 29000 }],
    descontoPct: 0,
    condicoes: 'Entrada de 20% + 10x sem juros.',
    parcelamento: { entradaPct: 20, parcelas: 10 },
    validadeDias: 30,
    status: 'enviado',
    criadoEm: diasAtras(8, 16),
    enviadoEm: diasAtras(8, 17),
  },
  {
    id: 'qt-gabriela',
    contactId: 'ct-gabriela',
    dealId: 'dl-gabriela',
    versao: 2,
    itens: [{ catalogId: 'cat-rino', descricao: 'Rinoplastia estruturada', valor: 36500 }],
    descontoPct: 0,
    condicoes: 'Entrada de 30% + 8x sem juros.',
    parcelamento: { entradaPct: 30, parcelas: 8 },
    validadeDias: 15,
    status: 'aceito',
    criadoEm: diasAtras(7, 10),
    enviadoEm: diasAtras(6, 9),
    aceitoEm: diasAtras(5, 14),
  },
  {
    id: 'qt-vanessa',
    contactId: 'ct-vanessa',
    dealId: 'dl-vanessa',
    versao: 1,
    itens: [
      { catalogId: 'cat-abdomino', descricao: 'Abdominoplastia', valor: 32000 },
      { catalogId: 'cat-mamo', descricao: 'Mamoplastia de aumento', valor: 28500 },
    ],
    descontoPct: 10,
    condicoes: 'Pacote Mommy Makeover — 10% de desconto no combo. Entrada 30% + 12x.',
    parcelamento: { entradaPct: 30, parcelas: 12 },
    validadeDias: 30,
    status: 'rascunho',
    criadoEm: diasAtras(2, 10),
  },
]

// ─── Contratos ─────────────────────────────────────────────────────────────
export const contratos: Contract[] = [
  {
    id: 'contr-carla',
    contactId: 'ct-carla',
    titulo: 'Contrato de prestação de serviços — Abdominoplastia',
    valor: 32700,
    status: 'assinado',
    criadoEm: mesesAtras(1, 24),
    assinadoEm: mesesAtras(1, 25),
    trilha: [
      { evento: 'Contrato gerado a partir do orçamento aceito', em: mesesAtras(1, 24) },
      { evento: 'Enviado por WhatsApp — link seguro', em: mesesAtras(1, 24) },
      { evento: 'Visualizado pela paciente', em: mesesAtras(1, 25) },
      { evento: 'Assinado eletronicamente às 14h32 via link seguro', em: mesesAtras(1, 25) },
    ],
    termos: [
      { nome: 'Termo de consentimento — Abdominoplastia', assinado: true },
      { nome: 'Termo de anestesia', assinado: true },
      { nome: 'Autorização de uso de imagem (opcional)', assinado: false },
    ],
  },
  {
    id: 'contr-gabriela',
    contactId: 'ct-gabriela',
    quoteId: 'qt-gabriela',
    titulo: 'Contrato de prestação de serviços — Rinoplastia',
    valor: 36500,
    status: 'assinado',
    criadoEm: diasAtras(5, 14),
    assinadoEm: diasAtras(4, 16),
    trilha: [
      { evento: 'Contrato gerado automaticamente após aceite do orçamento', em: diasAtras(5, 14) },
      { evento: 'Enviado por WhatsApp — link seguro', em: diasAtras(5, 14) },
      { evento: 'Assinado eletronicamente às 16h04 via link seguro', em: diasAtras(4, 16) },
    ],
    termos: [
      { nome: 'Termo de consentimento — Rinoplastia', assinado: true },
      { nome: 'Termo de anestesia', assinado: true },
    ],
  },
  {
    id: 'contr-daniela',
    contactId: 'ct-daniela',
    titulo: 'Contrato de prestação de serviços — Abdominoplastia',
    valor: 31000,
    status: 'enviado',
    criadoEm: diasAtras(3, 11),
    trilha: [
      { evento: 'Contrato gerado a partir do orçamento aceito', em: diasAtras(3, 11) },
      { evento: 'Enviado por e-mail e WhatsApp', em: diasAtras(3, 11) },
      { evento: 'Visualizado pela paciente', em: diasAtras(2, 20) },
    ],
    termos: [
      { nome: 'Termo de consentimento — Abdominoplastia', assinado: false },
      { nome: 'Termo de anestesia', assinado: false },
    ],
  },
  {
    id: 'contr-ricardo',
    contactId: 'ct-ricardo',
    titulo: 'Contrato — Blefaroplastia superior',
    valor: 15000,
    status: 'assinado',
    criadoEm: mesesAtras(15, 2),
    assinadoEm: mesesAtras(15, 3),
    trilha: [
      { evento: 'Contrato gerado', em: mesesAtras(15, 2) },
      { evento: 'Assinado presencialmente na clínica', em: mesesAtras(15, 3) },
    ],
    termos: [{ nome: 'Termo de consentimento — Blefaroplastia', assinado: true }],
  },
]

// ─── Parcelas ──────────────────────────────────────────────────────────────
export const parcelas: Installment[] = [
  // Carla — abdominoplastia 32.700 (entrada + 6x)
  { id: 'par-carla-0', contactId: 'ct-carla', contractId: 'contr-carla', descricao: 'Entrada (30%)', valor: 9810, vencimento: mesesAtras(1, 26), status: 'pago', pagoEm: mesesAtras(1, 26), forma: 'Pix' },
  { id: 'par-carla-1', contactId: 'ct-carla', contractId: 'contr-carla', descricao: 'Parcela 1/6', valor: 3815, vencimento: diasAtras(2), status: 'pago', pagoEm: diasAtras(2), forma: 'Cartão' },
  { id: 'par-carla-2', contactId: 'ct-carla', contractId: 'contr-carla', descricao: 'Parcela 2/6', valor: 3815, vencimento: emMeses(1), status: 'aberto' },
  { id: 'par-carla-3', contactId: 'ct-carla', contractId: 'contr-carla', descricao: 'Parcela 3/6', valor: 3815, vencimento: emMeses(2), status: 'aberto' },
  // Gabriela — rino 36.500 (entrada + 8x)
  { id: 'par-gabi-0', contactId: 'ct-gabriela', contractId: 'contr-gabriela', descricao: 'Entrada (30%)', valor: 10950, vencimento: diasAtras(4), status: 'pago', pagoEm: diasAtras(4), forma: 'Pix' },
  { id: 'par-gabi-1', contactId: 'ct-gabriela', contractId: 'contr-gabriela', descricao: 'Parcela 1/8', valor: 3194, vencimento: emMeses(1), status: 'aberto' },
  { id: 'par-gabi-2', contactId: 'ct-gabriela', contractId: 'contr-gabriela', descricao: 'Parcela 2/8', valor: 3194, vencimento: emMeses(2), status: 'aberto' },
  // Flávio — inadimplente
  { id: 'par-flavio-1', contactId: 'ct-flavio', descricao: 'Blefaroplastia — Parcela 5/6', valor: 2700, vencimento: diasAtras(9), status: 'vencido' },
  { id: 'par-flavio-2', contactId: 'ct-flavio', descricao: 'Blefaroplastia — Parcela 6/6', valor: 2700, vencimento: emMeses(1, 2), status: 'aberto' },
  // Ricardo — tudo quitado (histórico)
  { id: 'par-ricardo-1', contactId: 'ct-ricardo', contractId: 'contr-ricardo', descricao: 'Blefaroplastia — à vista', valor: 15000, vencimento: mesesAtras(14, 5), status: 'pago', pagoEm: mesesAtras(14, 5), forma: 'Transferência' },
  { id: 'par-ricardo-2', contactId: 'ct-ricardo', descricao: 'Toxina botulínica', valor: 2200, vencimento: mesesAtras(12, 10), status: 'pago', pagoEm: mesesAtras(12, 10), forma: 'Cartão' },
  { id: 'par-ricardo-3', contactId: 'ct-ricardo', descricao: 'Toxina botulínica', valor: 2200, vencimento: mesesAtras(6, 12), status: 'pago', pagoEm: mesesAtras(6, 12), forma: 'Cartão' },
  { id: 'par-ricardo-4', contactId: 'ct-ricardo', descricao: 'Toxina botulínica — aplicação de amanhã', valor: 2200, vencimento: emDias(1), status: 'aberto' },
  // Daniela — aguardando assinatura
  { id: 'par-daniela-0', contactId: 'ct-daniela', contractId: 'contr-daniela', descricao: 'Entrada (30%) — após assinatura', valor: 9300, vencimento: emDias(3), status: 'aberto' },
]

// ─── Histórico financeiro (6 meses) ────────────────────────────────────────
const mesISO = (atras: number) => startOfMonth(subMonths(new Date(), atras)).toISOString()

export const historicoFinanceiro: MesFinanceiro[] = [
  { mes: mesISO(5), receitaPrevista: 265000, receitaRealizada: 248200, despesas: 152000, consultas: 74, procedimentos: 9, novosPacientes: 11, nps: 68 },
  { mes: mesISO(4), receitaPrevista: 280000, receitaRealizada: 291400, despesas: 158000, consultas: 82, procedimentos: 11, novosPacientes: 14, nps: 71 },
  { mes: mesISO(3), receitaPrevista: 295000, receitaRealizada: 276800, despesas: 149500, consultas: 79, procedimentos: 10, novosPacientes: 12, nps: 74 },
  { mes: mesISO(2), receitaPrevista: 300000, receitaRealizada: 318900, despesas: 161200, consultas: 88, procedimentos: 12, novosPacientes: 16, nps: 76 },
  { mes: mesISO(1), receitaPrevista: 320000, receitaRealizada: 334600, despesas: 165800, consultas: 91, procedimentos: 13, novosPacientes: 15, nps: 79 },
  { mes: mesISO(0), receitaPrevista: 340000, receitaRealizada: 187300, despesas: 96400, consultas: 47, procedimentos: 6, novosPacientes: 9, nps: 81 },
]

// ─── Campanhas (atribuição) ────────────────────────────────────────────────
export const campanhas: CampanhaStat[] = [
  { id: 'cp-rino-verao', nome: 'Rino Verão', canal: 'Instagram Ads', investimento: 12400, leads: 38, agendamentos: 14, fechamentos: 4, receita: 139000 },
  { id: 'cp-mommy', nome: 'Mommy Makeover', canal: 'Instagram Ads', investimento: 8600, leads: 21, agendamentos: 8, fechamentos: 2, receita: 63200 },
  { id: 'cp-mamo', nome: 'Mamo dos Sonhos', canal: 'Instagram Ads', investimento: 7200, leads: 19, agendamentos: 7, fechamentos: 3, receita: 86600 },
  { id: 'cp-culotes', nome: 'Verão sem Culotes', canal: 'Instagram Ads', investimento: 9800, leads: 24, agendamentos: 9, fechamentos: 3, receita: 118600 },
  { id: 'cp-google', nome: 'Pesquisa Google — Marca + Procedimentos', canal: 'Google', investimento: 11200, leads: 42, agendamentos: 17, fechamentos: 5, receita: 152800 },
  { id: 'cp-indicacao', nome: 'Programa de Indicação', canal: 'Indicação', investimento: 2400, leads: 12, agendamentos: 9, fechamentos: 6, receita: 128400 },
  { id: 'cp-site', nome: 'Site / Orgânico', canal: 'Site', investimento: 0, leads: 17, agendamentos: 6, fechamentos: 2, receita: 47600 },
]

export const motivosPerda = [
  { motivo: 'Preço acima do orçamento', qtd: 9 },
  { motivo: 'Sem retorno / esfriou', qtd: 7 },
  { motivo: 'Fechou com concorrente', qtd: 4 },
  { motivo: 'Adiou decisão', qtd: 6 },
  { motivo: 'Contraindicação clínica', qtd: 2 },
]
