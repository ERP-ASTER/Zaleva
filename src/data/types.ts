// ─── Sessão ──────────────────────────────────────────────────────────────────
export type Papel = 'medico' | 'recepcao' | 'comercial' | 'gestor'

export interface Unit {
  id: string
  nome: string
  endereco: string
}

export interface Professional {
  id: string
  nome: string
  papel: 'cirurgiao' | 'dermatologista' | 'recepcao' | 'comercial' | 'gestor'
  especialidade?: string
  registro?: string
  cor: string // cor da agenda
  avatarColor: string
}

// ─── Pessoas ─────────────────────────────────────────────────────────────────
export type Origem = 'Instagram Ads' | 'Google' | 'Indicação' | 'Site'

export interface Contact {
  id: string
  nome: string
  tipo: 'lead' | 'paciente'
  idade: number
  telefone: string
  email?: string
  cidade: string
  profissao?: string
  origem: Origem
  campanha?: string
  indicadoPorId?: string
  tags: string[]
  unidadeId: string
  avatarColor: string
  criadoEm: string
  ltv: number
  interesse?: string
}

// ─── Conversas ───────────────────────────────────────────────────────────────
export type Canal = 'whatsapp' | 'instagram' | 'site'
export type ConversaStatus = 'nova' | 'ia' | 'em-atendimento' | 'aguardando' | 'resolvida'

export interface Message {
  id: string
  autor: 'contato' | 'equipe' | 'ia' | 'sistema'
  tipo: 'texto' | 'audio' | 'documento'
  texto: string
  transcricao?: string
  duracaoAudio?: string
  docNome?: string
  em: string
  autorNome?: string
}

export interface Conversation {
  id: string
  contactId: string
  canal: Canal
  status: ConversaStatus
  atendenteId?: string // 'ia' quando agente de IA
  naoLidas: number
  intencao?: string
  mensagens: Message[]
}

// ─── Comercial ───────────────────────────────────────────────────────────────
export type DealStage =
  | 'novo'
  | 'em-atendimento'
  | 'qualificado'
  | 'avaliacao-agendada'
  | 'avaliacao-realizada'
  | 'plano-apresentado'
  | 'em-negociacao'
  | 'fechado'
  | 'perdido'

export interface DealActivity {
  id: string
  tipo: 'contato' | 'nota' | 'etapa' | 'orcamento' | 'followup' | 'sistema'
  descricao: string
  em: string
  autor: string
}

export interface Deal {
  id: string
  contactId: string
  titulo: string
  procedimentos: string[]
  valor: number
  probabilidade: number
  temperatura: 'quente' | 'morno' | 'frio'
  responsavelId: string
  etapa: DealStage
  criadoEm: string
  atualizadoEm: string
  proximaAcao?: { descricao: string; em: string }
  motivoPerda?: string
  atividades: DealActivity[]
}

// ─── Agenda ──────────────────────────────────────────────────────────────────
export type AppointmentStatus =
  | 'pre-agendado'
  | 'aguardando-confirmacao'
  | 'confirmado'
  | 'checkin'
  | 'em-atendimento'
  | 'finalizado'
  | 'cancelado'
  | 'no-show'

export type AppointmentTipo = 'avaliacao' | 'retorno' | 'procedimento' | 'teleconsulta' | 'injetavel'

export interface Appointment {
  id: string
  contactId: string
  profissionalId: string
  unidadeId: string
  tipo: AppointmentTipo
  titulo: string
  inicio: string
  duracaoMin: number
  status: AppointmentStatus
  sala?: string
  observacao?: string
  encounterId?: string
}

// ─── Clínico ─────────────────────────────────────────────────────────────────
export interface ClinicalRecord {
  contactId: string
  alergias: string[]
  condicoes: string[]
  medicamentos: string[]
  antecedentes: string[]
  alertas: string[]
}

export type DocStatus =
  | 'rascunho'
  | 'gerado-ia'
  | 'em-revisao'
  | 'revisado'
  | 'assinado'
  | 'enviado'
  | 'cancelado'

export interface Encounter {
  id: string
  contactId: string
  appointmentId?: string
  profissionalId: string
  tipo: string
  em: string
  status: 'aberta' | 'finalizada'
  motivo?: string
  anamnese?: string
  exameFisico?: string
  avaliacao?: string
  conduta?: string
  cids: { codigo: string; descricao: string }[]
  aiAssistida?: boolean
}

export interface Prescription {
  id: string
  contactId: string
  encounterId?: string
  profissionalId: string
  titulo: string
  itens: { medicamento: string; posologia: string }[]
  status: DocStatus
  em: string
}

export interface ClinicalDoc {
  id: string
  contactId: string
  tipo: 'prescricao' | 'exames' | 'atestado' | 'orientacoes' | 'termo' | 'contrato' | 'orcamento'
  titulo: string
  status: DocStatus
  em: string
  profissionalId?: string
  /** Conteúdo exibido no visualizador de documento */
  linhas?: { t: string; d?: string }[]
}

// ─── Arquivo de fotos clínicas ───────────────────────────────────────────────
export type FotoCategoria = 'pre-op' | 'pos-op' | 'evolucao' | 'planejamento'

export interface PhotoRecord {
  id: string
  contactId: string
  titulo: string
  categoria: FotoCategoria
  em: string
  /** Gradiente ilustrativo (protótipo não usa fotos reais) */
  gradiente: string
  origem?: 'consultorio' | 'app-medico' | 'portal-paciente'
}

// ─── Orçamentos e contratos ──────────────────────────────────────────────────
export interface QuoteItem {
  catalogId: string
  descricao: string
  valor: number
}

export type QuoteStatus = 'rascunho' | 'enviado' | 'visualizado' | 'aceito' | 'recusado' | 'expirado'

export interface Quote {
  id: string
  contactId: string
  dealId?: string
  versao: number
  itens: QuoteItem[]
  descontoPct: number
  condicoes: string
  parcelamento: { entradaPct: number; parcelas: number }
  validadeDias: number
  status: QuoteStatus
  criadoEm: string
  enviadoEm?: string
  aceitoEm?: string
}

export interface Contract {
  id: string
  contactId: string
  quoteId?: string
  titulo: string
  valor: number
  status: 'rascunho' | 'enviado' | 'assinado'
  criadoEm: string
  assinadoEm?: string
  trilha: { evento: string; em: string }[]
  termos: { nome: string; assinado: boolean }[]
}

export interface Installment {
  id: string
  contactId: string
  contractId?: string
  descricao: string
  valor: number
  vencimento: string
  status: 'pago' | 'aberto' | 'vencido'
  pagoEm?: string
  forma?: string
}

// ─── Procedimentos e pós ─────────────────────────────────────────────────────
export interface ProcedureRecord {
  id: string
  contactId: string
  catalogId: string
  nome: string
  em: string
  profissionalId: string
  status: 'planejado' | 'realizado'
  checklist: { item: string; ok: boolean }[]
  journeyId?: string
}

export type JourneyStepTipo = 'orientacoes' | 'checkin' | 'foto' | 'retorno' | 'nps' | 'avaliacao-publica'
export type JourneyStepStatus = 'concluido' | 'aguardando' | 'pendente' | 'critico'

export interface JourneyStep {
  id: string
  tipo: JourneyStepTipo
  titulo: string
  previstoEm: string
  status: JourneyStepStatus
  resposta?: string
  notaDor?: number
  concluidoEm?: string
}

export interface Journey {
  id: string
  contactId: string
  procedimento: string
  procedimentoEm: string
  risco: 'baixo' | 'medio' | 'alto'
  alertaResolvido?: boolean
  steps: JourneyStep[]
}

// ─── Timeline (agregador central) ────────────────────────────────────────────
export type TimelineTipo =
  | 'lead'
  | 'conversa'
  | 'agendamento'
  | 'consulta'
  | 'orcamento'
  | 'contrato'
  | 'pagamento'
  | 'procedimento'
  | 'checkin'
  | 'alerta'
  | 'nps'
  | 'documento'
  | 'tarefa'

export interface TimelineEvent {
  id: string
  contactId: string
  tipo: TimelineTipo
  titulo: string
  descricao?: string
  em: string
  rota?: string
}

// ─── Notificações ────────────────────────────────────────────────────────────
export interface AppNotification {
  id: string
  tipo: 'critico' | 'clinico' | 'comercial' | 'financeiro' | 'info'
  titulo: string
  descricao: string
  em: string
  lida: boolean
  rota?: string
}

// ─── Catálogo ────────────────────────────────────────────────────────────────
export interface CatalogItem {
  id: string
  nome: string
  categoria: 'cirurgico' | 'injetavel' | 'consulta'
  valorBase: number
  duracaoMin: number
}

export interface Pacote {
  id: string
  nome: string
  itens: string[] // catalogIds
  descontoPct: number
}

// ─── Dashboards (histórico de 6 meses) ───────────────────────────────────────
export interface MesFinanceiro {
  mes: string // ISO do 1º dia
  receitaPrevista: number
  receitaRealizada: number
  despesas: number
  consultas: number
  procedimentos: number
  novosPacientes: number
  nps: number
}

export interface CampanhaStat {
  id: string
  nome: string
  canal: Origem
  investimento: number
  leads: number
  agendamentos: number
  fechamentos: number
  receita: number
}
