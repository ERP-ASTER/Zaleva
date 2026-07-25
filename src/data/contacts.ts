import type { Contact, Origem } from './types'
import { diasAtras, mesesAtras } from './dates'

const cores = ['#0F6B5C', '#155E63', '#7C4DE0', '#9D174D', '#B45309', '#0E7490', '#4338CA', '#BE185D', '#15803D', '#A16207']

const semAcento = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '')

let i = 0
const c = (
  id: string,
  nome: string,
  tipo: 'lead' | 'paciente',
  idade: number,
  origem: Origem,
  criadoEm: string,
  extras: Partial<Contact> = {},
): Contact => ({
  id,
  nome,
  tipo,
  idade,
  telefone: `(11) 9${String(7100 + i * 37).padStart(4, '0')}-${String(1000 + i * 211).slice(0, 4)}`,
  email: `${semAcento(nome.split(' ')[0])}.${semAcento(nome.split(' ').slice(-1)[0])}@email.com`,
  cidade: 'Toledo, PR',
  origem,
  tags: [],
  unidadeId: i++ % 3 === 2 ? 'un-eldorado' : 'un-toledo',
  avatarColor: cores[i % cores.length],
  criadoEm,
  ltv: 0,
  ...extras,
})

export const contatos: Contact[] = [
  // ─── Personas âncora ───────────────────────────────────────────────────────
  c('ct-mariana', 'Mariana Duarte', 'lead', 34, 'Instagram Ads', diasAtras(6, 14), {
    campanha: 'Rino Verão',
    interesse: 'Rinoplastia',
    profissao: 'Arquiteta',
    tags: ['Rinoplastia', 'Alta intenção', 'Primeira cirurgia'],
    avatarColor: '#9D174D',
  }),
  c('ct-carla', 'Carla Menezes', 'paciente', 41, 'Google', mesesAtras(4, 3), {
    interesse: 'Abdominoplastia',
    profissao: 'Advogada',
    tags: ['Pós-operatório', 'Abdominoplastia'],
    ltv: 33400,
    avatarColor: '#B45309',
  }),
  c('ct-ricardo', 'Ricardo Tavares', 'paciente', 52, 'Indicação', mesesAtras(18, 8), {
    indicadoPorId: 'ct-helena',
    interesse: 'Rejuvenescimento',
    profissao: 'Empresário',
    tags: ['Recorrente', 'VIP', 'Blefaroplastia', 'Toxina'],
    ltv: 21600,
    avatarColor: '#155E63',
  }),

  // ─── Leads no funil ────────────────────────────────────────────────────────
  c('ct-fernanda', 'Fernanda Sales', 'lead', 29, 'Instagram Ads', diasAtras(1, 9), { campanha: 'Rino Verão', interesse: 'Rinoplastia', tags: ['Novo'] }),
  c('ct-juliana', 'Juliana Prado', 'lead', 37, 'Google', diasAtras(2, 16), { interesse: 'Mamoplastia', tags: ['Pesquisando'] }),
  c('ct-amanda', 'Amanda Cardim', 'lead', 31, 'Instagram Ads', diasAtras(3, 11), { campanha: 'Verão sem Culotes', interesse: 'Lipo HD', tags: ['Alta intenção'] }),
  c('ct-priscila', 'Priscila Nunes', 'lead', 44, 'Site', diasAtras(4, 10), { interesse: 'Abdominoplastia', tags: ['Aguardando retorno'] }),
  c('ct-tatiane', 'Tatiane Moraes', 'lead', 26, 'Instagram Ads', diasAtras(9, 15), { campanha: 'Rino Verão', interesse: 'Rinoplastia', tags: ['Sensível a preço'] }),
  c('ct-gustavo', 'Gustavo Lira', 'lead', 39, 'Google', diasAtras(12, 13), { interesse: 'Blefaroplastia', tags: ['Executivo'] }),
  c('ct-larissa', 'Larissa Fontoura', 'lead', 33, 'Indicação', diasAtras(7, 10), { indicadoPorId: 'ct-carla', interesse: 'Mamoplastia', tags: ['Indicação quente'] }),
  c('ct-vanessa', 'Vanessa Rios', 'lead', 36, 'Instagram Ads', diasAtras(15, 17), { campanha: 'Mommy Makeover', interesse: 'Mommy Makeover', tags: ['Pós-gestação'] }),
  c('ct-isabela', 'Isabela Quintana', 'lead', 28, 'Site', diasAtras(18, 9), { interesse: 'Preenchimento', tags: ['Injetáveis'] }),
  c('ct-rodrigo', 'Rodrigo Bastos', 'lead', 47, 'Google', diasAtras(21, 14), { interesse: 'Lipo HD', tags: ['Remarketing'] }),
  c('ct-camilaf', 'Camila Farias', 'lead', 30, 'Instagram Ads', diasAtras(25, 12), { campanha: 'Rino Verão', interesse: 'Rinoplastia', tags: ['Sem resposta'] }),

  // ─── Pacientes ativos ──────────────────────────────────────────────────────
  c('ct-helena', 'Helena Vasquez', 'paciente', 48, 'Google', mesesAtras(22, 5), { interesse: 'Rejuvenescimento', tags: ['Recorrente', 'Toxina'], ltv: 9800 }),
  c('ct-beatriz', 'Beatriz Mont’Alverne', 'paciente', 35, 'Instagram Ads', mesesAtras(6, 12), { campanha: 'Mamo dos Sonhos', interesse: 'Mamoplastia', tags: ['Pós-operatório'], ltv: 29200 }),
  c('ct-sofia', 'Sofia Linhares', 'paciente', 27, 'Indicação', mesesAtras(3, 20), { indicadoPorId: 'ct-ricardo', interesse: 'Rinoplastia', tags: ['Pós-operatório'], ltv: 35800 }),
  c('ct-marcos', 'Marcos Vinícius Leal', 'paciente', 45, 'Site', mesesAtras(8, 11), { interesse: 'Blefaroplastia', tags: ['Pós-operatório'], ltv: 15600 }),
  c('ct-luana', 'Luana Castelo', 'paciente', 38, 'Instagram Ads', mesesAtras(5, 9), { campanha: 'Verão sem Culotes', interesse: 'Lipo HD', tags: ['Pós-operatório'], ltv: 41200 }),
  c('ct-renato', 'Ernesto Peixoto', 'paciente', 55, 'Google', mesesAtras(11, 2), { interesse: 'Blefaroplastia', tags: ['Retorno pendente'], ltv: 14800 }),
  c('ct-claudia', 'Cláudia Werneck', 'paciente', 50, 'Indicação', mesesAtras(14, 18), { indicadoPorId: 'ct-helena', interesse: 'Toxina', tags: ['Recorrente'], ltv: 8400 }),
  c('ct-daniela', 'Daniela Sabino', 'paciente', 32, 'Instagram Ads', mesesAtras(2, 7), { campanha: 'Mommy Makeover', interesse: 'Abdominoplastia', tags: ['Pré-operatório'], ltv: 31000 }),
  c('ct-elisa', 'Elisa Drummond', 'paciente', 42, 'Site', mesesAtras(9, 25), { interesse: 'Preenchimento', tags: ['Injetáveis', 'Recorrente'], ltv: 12400 }),
  c('ct-flavio', 'Flávio Arruda', 'paciente', 60, 'Google', mesesAtras(16, 4), { interesse: 'Blefaroplastia', tags: ['Inadimplente'], ltv: 16200 }),
  c('ct-gabriela', 'Gabriela Pontes', 'paciente', 25, 'Instagram Ads', mesesAtras(1, 22), { campanha: 'Rino Verão', interesse: 'Rinoplastia', tags: ['Pré-operatório'], ltv: 36500 }),
  c('ct-mirella', 'Mirella Zampieri', 'paciente', 46, 'Indicação', mesesAtras(7, 14), { indicadoPorId: 'ct-claudia', interesse: 'Toxina', tags: ['Recorrente'], ltv: 6800 }),
  c('ct-otaviop', 'Otávio Portela', 'paciente', 41, 'Site', mesesAtras(10, 30), { interesse: 'Lipo HD', tags: [], ltv: 39600 }),
  c('ct-paula', 'Paula Sertório', 'paciente', 37, 'Google', mesesAtras(12, 12), { interesse: 'Mamoplastia', tags: ['NPS Promotora'], ltv: 27800 }),
  c('ct-queila', 'Queila Antunes', 'paciente', 53, 'Indicação', mesesAtras(20, 9), { indicadoPorId: 'ct-ricardo', interesse: 'Toxina', tags: ['Recorrente'], ltv: 11200 }),
  c('ct-sandra', 'Sandra Loyola', 'paciente', 49, 'Google', mesesAtras(15, 21), { interesse: 'Abdominoplastia', tags: [], ltv: 30400 }),
  c('ct-thais', 'Thaís Bergamo', 'paciente', 29, 'Instagram Ads', mesesAtras(4, 16), { campanha: 'Mamo dos Sonhos', interesse: 'Mamoplastia', tags: ['Pós-operatório'], ltv: 28900 }),
  c('ct-viviane', 'Viviane Sardinha', 'paciente', 34, 'Site', mesesAtras(6, 6), { interesse: 'Preenchimento', tags: ['Injetáveis'], ltv: 3200 }),
  c('ct-wesley', 'Wesley Bandeira', 'paciente', 43, 'Google', mesesAtras(13, 10), { interesse: 'Lipo HD', tags: [], ltv: 37400 }),
  c('ct-yasmin', 'Yasmin Villaverde', 'paciente', 31, 'Instagram Ads', mesesAtras(3, 2), { campanha: 'Rino Verão', interesse: 'Rinoplastia', tags: ['Pós-operatório'], ltv: 33100 }),
  c('ct-zilda', 'Zilda Napoli', 'paciente', 58, 'Indicação', mesesAtras(17, 13), { indicadoPorId: 'ct-helena', interesse: 'Blefaroplastia', tags: [], ltv: 15900 }),
  c('ct-heitor', 'Heitor Salviano', 'lead', 35, 'Site', diasAtras(5, 19), { interesse: 'Toxina', tags: ['Injetáveis'] }),
]

export const contatoById = (id?: string) => contatos.find((ct) => ct.id === id)
