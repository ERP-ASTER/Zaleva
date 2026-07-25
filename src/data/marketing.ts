import { diasAtras, emDias, horasAtras, mesesAtras } from './dates'
import { campanhas } from './billing'
import { startOfMonth, subMonths } from 'date-fns'

// ─── Tipos do módulo de Marketing ───────────────────────────────────────────
export type CampanhaStatus = 'ativa' | 'pausada' | 'encerrada'

export interface CampanhaExtra {
  status: CampanhaStatus
  periodo: string
  headline: string
  gradiente: string
  utm: string
}

export interface LandingPage {
  id: string
  nome: string
  url: string
  visitantes: number
  leads: number
  agendamentoOnline: boolean
  campanhaId?: string
}

export interface PaginaSite {
  id: string
  nome: string
  rota: string
  status: 'publicada' | 'rascunho'
  atualizadaEm: string
  titulo: string
  descricao: string
}

export type ConteudoStatus = 'ideia' | 'rascunho-ia' | 'em-revisao' | 'agendado' | 'publicado'
export type CanalConteudo = 'Blog' | 'Instagram' | 'Facebook'
export type FormatoConteudo = 'artigo' | 'post' | 'story'

export interface Conteudo {
  id: string
  tema: string
  formato: FormatoConteudo
  status: ConteudoStatus
  criadoEm: string
  publicadoEm?: string
  publicarEm?: string
  canais: CanalConteudo[]
  corpo: string
  gradiente: string
}

export interface TemaSugerido {
  id: string
  titulo: string
  formato: FormatoConteudo
  justificativa: string
  corpo: string
}

// ─── Campanhas: extras visuais/estado (números vêm de billing.campanhas) ────
export const campanhasExtras: Record<string, CampanhaExtra> = {
  'cp-rino-verao': {
    status: 'ativa',
    periodo: 'últimos 90 dias',
    headline: 'Seu perfil, sua confiança — Rinoplastia estruturada',
    gradiente: 'linear-gradient(135deg, #0F6B5C 0%, #3FA48D 60%, #CCA84A 110%)',
    utm: 'utm_source=instagram&utm_medium=paid&utm_campaign=rino-verao',
  },
  'cp-mommy': {
    status: 'ativa',
    periodo: 'últimos 60 dias',
    headline: 'Mommy Makeover — de volta a se sentir você',
    gradiente: 'linear-gradient(135deg, #9D174D 0%, #DB5C8F 70%, #F5EDD4 115%)',
    utm: 'utm_source=instagram&utm_medium=paid&utm_campaign=mommy-makeover',
  },
  'cp-mamo': {
    status: 'pausada',
    periodo: 'encerrou há 15 dias',
    headline: 'Mamo dos Sonhos — naturalidade em primeiro lugar',
    gradiente: 'linear-gradient(135deg, #155E63 0%, #38A8C5 70%, #C7E9F1 115%)',
    utm: 'utm_source=instagram&utm_medium=paid&utm_campaign=mamo-dos-sonhos',
  },
  'cp-culotes': {
    status: 'ativa',
    periodo: 'últimos 45 dias',
    headline: 'Lipo HD — definição que o treino não alcança',
    gradiente: 'linear-gradient(135deg, #7C5B28 0%, #CCA84A 65%, #F5EDD4 115%)',
    utm: 'utm_source=instagram&utm_medium=paid&utm_campaign=verao-sem-culotes',
  },
  'cp-google': {
    status: 'ativa',
    periodo: 'sempre ativa',
    headline: 'Pesquisa Google — marca + procedimentos',
    gradiente: 'linear-gradient(135deg, #26272B 0%, #52525B 70%, #B8B8BF 115%)',
    utm: 'utm_source=google&utm_medium=cpc&utm_campaign=search-marca',
  },
  'cp-indicacao': {
    status: 'ativa',
    periodo: 'programa contínuo',
    headline: 'Programa de Indicação — pacientes que indicam pacientes',
    gradiente: 'linear-gradient(135deg, #07332C 0%, #0F6B5C 70%, #A9DBCD 115%)',
    utm: 'utm_source=indicacao&utm_medium=referral&utm_campaign=programa-indicacao',
  },
  'cp-site': {
    status: 'ativa',
    periodo: 'orgânico contínuo',
    headline: 'Site / Blog — tráfego orgânico',
    gradiente: 'linear-gradient(135deg, #4338CA 0%, #8B5CF6 70%, #DBCEF2 115%)',
    utm: 'utm_source=site&utm_medium=organic',
  },
}

// ─── Leads por canal — últimos 6 meses (soma ≈ totais de billing.campanhas) ─
const mesISO = (atras: number) => startOfMonth(subMonths(new Date(), atras)).toISOString()

export const leadsPorCanalMes = [
  { mes: mesISO(5), 'Instagram Ads': 14, Google: 6, Site: 2, 'Indicação': 1 },
  { mes: mesISO(4), 'Instagram Ads': 16, Google: 7, Site: 3, 'Indicação': 2 },
  { mes: mesISO(3), 'Instagram Ads': 17, Google: 7, Site: 3, 'Indicação': 2 },
  { mes: mesISO(2), 'Instagram Ads': 19, Google: 8, Site: 3, 'Indicação': 2 },
  { mes: mesISO(1), 'Instagram Ads': 20, Google: 8, Site: 3, 'Indicação': 3 },
  { mes: mesISO(0), 'Instagram Ads': 16, Google: 6, Site: 3, 'Indicação': 2 },
]

// ─── Landing pages e formulários ─────────────────────────────────────────────
export const landingPagesIniciais: LandingPage[] = [
  { id: 'lp-rino', nome: 'Rinoplastia — Agende sua avaliação', url: 'clinicamluther.com.br/rinoplastia', visitantes: 2840, leads: 38, agendamentoOnline: true, campanhaId: 'cp-rino-verao' },
  { id: 'lp-mommy', nome: 'Mommy Makeover — Guia completo', url: 'clinicamluther.com.br/mommy-makeover', visitantes: 1560, leads: 21, agendamentoOnline: true, campanhaId: 'cp-mommy' },
  { id: 'lp-lipo', nome: 'Lipo HD — Avaliação com simulação', url: 'clinicamluther.com.br/lipo-hd', visitantes: 1920, leads: 24, agendamentoOnline: false, campanhaId: 'cp-culotes' },
  { id: 'lp-injetaveis', nome: 'Toxina & Preenchimento — Agenda expressa', url: 'clinicamluther.com.br/injetaveis', visitantes: 980, leads: 12, agendamentoOnline: true },
]

// ─── Site do consultório ─────────────────────────────────────────────────────
export const paginasSiteIniciais: PaginaSite[] = [
  {
    id: 'pg-home',
    nome: 'Home',
    rota: '/',
    status: 'publicada',
    atualizadaEm: diasAtras(12, 15),
    titulo: 'Clínica M. Luther — Cirurgia Plástica em Toledo e Eldorado',
    descricao: 'Excelência em cirurgia plástica e estética, com acompanhamento completo da jornada de cada paciente.',
  },
  {
    id: 'pg-equipe',
    nome: 'Equipe',
    rota: '/equipe',
    status: 'publicada',
    atualizadaEm: mesesAtras(2, 8),
    titulo: 'Nossa equipe',
    descricao: 'Dr. Renato Somensi (CRM 2469-MS) e time de especialistas em cirurgia plástica e dermatologia.',
  },
  {
    id: 'pg-procedimentos',
    nome: 'Procedimentos',
    rota: '/procedimentos',
    status: 'publicada',
    atualizadaEm: diasAtras(20, 10),
    titulo: 'Procedimentos',
    descricao: 'Rinoplastia, mamoplastia, abdominoplastia, lipo HD, blefaroplastia e protocolos injetáveis.',
  },
  {
    id: 'pg-blog',
    nome: 'Blog',
    rota: '/blog',
    status: 'publicada',
    atualizadaEm: diasAtras(3, 9),
    titulo: 'Blog M. Luther',
    descricao: 'Conteúdo educativo revisado pela equipe médica — atualizado pelo Estúdio de conteúdo IA.',
  },
  {
    id: 'pg-contato',
    nome: 'Contato & Unidades',
    rota: '/contato',
    status: 'rascunho',
    atualizadaEm: horasAtras(28),
    titulo: 'Fale com a gente',
    descricao: 'Unidades Toledo e Eldorado · WhatsApp, telefone e agendamento online. (Novo endereço de Eldorado em revisão.)',
  },
]

export const visitasSemanaisSite = [420, 480, 455, 530, 610, 585, 640, 702, 688, 745, 810, 861]

// ─── Pipeline de conteúdo ────────────────────────────────────────────────────
export const gradientesConteudo = [
  'linear-gradient(135deg, #0F6B5C, #A9DBCD)',
  'linear-gradient(135deg, #9D174D, #F8D7E5)',
  'linear-gradient(135deg, #155E63, #C7E9F1)',
  'linear-gradient(135deg, #7C5B28, #F5EDD4)',
  'linear-gradient(135deg, #4338CA, #DBCEF2)',
]

let c = 0
const ct = (
  tema: string,
  formato: FormatoConteudo,
  status: ConteudoStatus,
  criadoEm: string,
  corpo: string,
  extras: Partial<Conteudo> = {},
): Conteudo => ({
  id: `cnt-${++c}`,
  tema,
  formato,
  status,
  criadoEm,
  corpo,
  canais: [],
  gradiente: gradientesConteudo[c % gradientesConteudo.length],
  ...extras,
})

export const conteudosIniciais: Conteudo[] = [
  ct(
    'Cuidados no pós-operatório de mamoplastia',
    'artigo',
    'publicado',
    diasAtras(9, 10),
    'A recuperação da mamoplastia de aumento costuma ser mais tranquila do que a maioria das pacientes imagina. Nos primeiros dias, o desconforto é controlado com analgesia simples... [artigo completo de 900 palavras: repouso, sutiã cirúrgico, retorno ao exercício, sinais de alerta]',
    { publicadoEm: diasAtras(7, 9), canais: ['Blog', 'Instagram'] },
  ),
  ct(
    'Antes e depois: o que a ética médica permite publicar',
    'post',
    'publicado',
    diasAtras(5, 14),
    'Você já se perguntou por que clínicas sérias não postam "antes e depois" de qualquer jeito? 🧐 A publicidade médica tem regras — e isso protege você. No nosso blog, explicamos o que o CFM permite e como avaliar resultados com segurança. Link na bio! #cirurgiaplastica #etica',
    { publicadoEm: diasAtras(3, 9), canais: ['Instagram', 'Facebook'] },
  ),
  ct(
    'Especial Dia das Mães — Mommy Makeover',
    'post',
    'agendado',
    diasAtras(1, 16),
    'Ser mãe transforma tudo — inclusive a relação com o próprio corpo. 💛 Neste Dia das Mães, conheça o Mommy Makeover: abdominoplastia + mamoplastia em um único tempo cirúrgico, com plano de recuperação pensado para a rotina de quem cuida de todo mundo. Agende sua avaliação.',
    { publicarEm: emDias(2, 10), canais: ['Instagram', 'Facebook'] },
  ),
  ct(
    'Recuperação da Lipo HD: semana a semana',
    'artigo',
    'em-revisao',
    horasAtras(20),
    'RASCUNHO (IA): A lipoaspiração de alta definição exige um pós-operatório disciplinado para preservar o contorno conquistado em cirurgia. Semana 1: repouso relativo e cinta compressiva 24h... Semana 2: drenagens linfáticas... Semana 4: liberação gradual do treino... [aguardando revisão do Dr. Renato]',
  ),
  ct(
    'Verão e cirurgia plástica: mitos e verdades',
    'post',
    'rascunho-ia',
    horasAtras(3),
    '"Não se pode operar no verão" — será? ☀️ MITO (com ressalvas): o que importa é a proteção solar rigorosa da cicatriz e evitar exposição direta nos primeiros meses. A época ideal é a que cabe na SUA rotina de recuperação. Quer entender o melhor momento para o seu caso? Agende uma avaliação. #mitoseverdades',
  ),
  ct(
    'Perguntas frequentes sobre anestesia em cirurgia plástica',
    'artigo',
    'ideia',
    horasAtras(2),
    'Sugestão de estrutura (IA): 1) Tipos de anestesia usados em cirurgia plástica; 2) O papel do anestesista e a avaliação pré-anestésica; 3) Jejum e medicações; 4) Mitos comuns ("anestesia geral é perigosa?"); 5) Como a clínica monitora a segurança.',
  ),
  ct(
    'Skincare no pós-blefaroplastia',
    'story',
    'ideia',
    horasAtras(1),
    'Sugestão de roteiro (IA): 3 stories — (1) o que usar na região dos olhos nas primeiras semanas, (2) o que evitar (retinóides, ácidos), (3) CTA para avaliação com a Dra. Camila.',
  ),
]

// ─── Temas sugeridos pela IA (para o fluxo "Criar conteúdo") ─────────────────
export const temasSugeridos: TemaSugerido[] = [
  {
    id: 'tm-rino-mitos',
    titulo: '5 mitos sobre rinoplastia que ainda confundem pacientes',
    formato: 'post',
    justificativa: 'A campanha "Rino Verão" é sua maior fonte de leads — conteúdo educativo aumenta a conversão do funil em andamento.',
    corpo:
      '5 MITOS SOBRE RINOPLASTIA 👃✨\n\n1️⃣ "Vai ficar com cara de operado" — a rinoplastia estruturada preserva a identidade do rosto.\n2️⃣ "A recuperação é longuíssima" — em 7 a 10 dias a maioria retoma o trabalho.\n3️⃣ "É só estética" — muitas vezes corrigimos a respiração no mesmo procedimento.\n4️⃣ "Qualquer idade serve" — há momento certo, avaliado caso a caso.\n5️⃣ "O resultado é imediato" — o refinamento final vem ao longo de 12 meses.\n\nFicou com dúvida? Agende sua avaliação — link na bio. 💚\n#rinoplastia #cirurgiaplastica #toledo',
  },
  {
    id: 'tm-abdomino-recuperacao',
    titulo: 'Recuperação da abdominoplastia: o que esperar semana a semana',
    formato: 'artigo',
    justificativa: 'Alto volume de dúvidas sobre pós-operatório nas conversas do WhatsApp — conteúdo reduz demanda da recepção.',
    corpo:
      'A abdominoplastia é uma das cirurgias com recuperação mais estruturada — e saber o que esperar em cada fase reduz a ansiedade e melhora o resultado.\n\nSemana 1: repouso com tronco levemente fletido, dreno e curativos monitorados pela equipe (nosso acompanhamento digital faz check-ins diários)...\n\nSemana 2-3: retirada de pontos, início das drenagens linfáticas...\n\nSemana 4-6: caminhadas liberadas, cinta em tempo parcial...\n\n[artigo completo de ~1.200 palavras com orientações revisadas pela equipe médica]',
  },
  {
    id: 'tm-toxina-quando',
    titulo: 'Toxina botulínica: qual o momento certo de começar?',
    formato: 'post',
    justificativa: 'A Dra. Camila tem agenda ociosa às sextas — conteúdo de injetáveis converte rápido para avaliação.',
    corpo:
      'TOXINA: EXISTE IDADE CERTA? 🤔\n\nNão existe "idade mínima mágica" — existe indicação. A toxina pode ser preventiva (suavizar linhas dinâmicas antes que marquem) ou corretiva.\n\nO que avaliamos na consulta:\n✔️ Padrão de contração muscular\n✔️ Qualidade da pele\n✔️ Expectativa realista\n\nAplicação em ambiente médico, com produto original rastreado. Agende com a Dra. Camila Iwata. 💉✨\n#toxinabotulinica #harmonizacao',
  },
  {
    id: 'tm-escolher-cirurgiao',
    titulo: 'Como escolher seu cirurgião plástico com segurança',
    formato: 'artigo',
    justificativa: 'Conteúdo de fundo de funil — fortalece autoridade da marca e melhora SEO para "cirurgião plástico Toledo".',
    corpo:
      'Escolher quem vai conduzir a sua cirurgia é a decisão mais importante de toda a jornada. Veja os critérios objetivos:\n\n1. Registro e título de especialista (verifique o CRM e a SBCP)...\n2. Estrutura hospitalar e equipe de anestesia...\n3. Acompanhamento pós-operatório estruturado — pergunte COMO você será acompanhada depois da cirurgia...\n4. Coerência entre expectativa e proposta...\n\n[artigo completo com checklist para download]',
  },
]
