import type { PhotoRecord, FotoCategoria } from './types'
import { diasAtras, mesesAtras } from './dates'

export const gradientesFoto = [
  'linear-gradient(135deg, #0F6B5C 0%, #3FA48D 55%, #A9DBCD 100%)',
  'linear-gradient(135deg, #155E63 0%, #4A9096 60%, #B9DCDE 100%)',
  'linear-gradient(135deg, #7C5B28 0%, #CCA84A 60%, #F5EDD4 100%)',
  'linear-gradient(135deg, #4338CA 0%, #8B5CF6 60%, #DBCEF2 100%)',
  'linear-gradient(135deg, #9D174D 0%, #DB5C8F 60%, #F8D7E5 100%)',
  'linear-gradient(135deg, #0E7490 0%, #38A8C5 60%, #C7E9F1 100%)',
]

let f = 0
const ft = (
  contactId: string,
  titulo: string,
  categoria: FotoCategoria,
  em: string,
  origem: PhotoRecord['origem'] = 'consultorio',
): PhotoRecord => ({
  id: `ft-${++f}`,
  contactId,
  titulo,
  categoria,
  em,
  gradiente: gradientesFoto[f % gradientesFoto.length],
  origem,
})

export const fotosIniciais: PhotoRecord[] = [
  // Carla — abdominoplastia (ontem)
  ft('ct-carla', 'Pré-op — frente', 'pre-op', mesesAtras(1, 20)),
  ft('ct-carla', 'Pré-op — perfil direito', 'pre-op', mesesAtras(1, 20)),
  ft('ct-carla', 'Pré-op — perfil esquerdo', 'pre-op', mesesAtras(1, 20)),
  ft('ct-carla', 'Marcação cirúrgica', 'planejamento', diasAtras(1, 7)),
  ft('ct-carla', 'Pós-imediato — centro cirúrgico', 'pos-op', diasAtras(1, 11), 'app-medico'),

  // Sofia — rinoplastia D+25
  ft('ct-sofia', 'Pré-op — frente', 'pre-op', diasAtras(40, 10)),
  ft('ct-sofia', 'Pré-op — perfil', 'pre-op', diasAtras(40, 10)),
  ft('ct-sofia', 'D+7 — retirada do splint', 'evolucao', diasAtras(18, 11), 'app-medico'),
  ft('ct-sofia', 'D+25 — retorno', 'evolucao', diasAtras(0, 8, 30), 'app-medico'),

  // Yasmin — rinoplastia D+80
  ft('ct-yasmin', 'Pré-op — frente', 'pre-op', diasAtras(95, 9)),
  ft('ct-yasmin', 'D+30 — comparativo', 'evolucao', diasAtras(50, 9)),
  ft('ct-yasmin', 'D+80 — resultado parcial', 'evolucao', diasAtras(1, 9)),

  // Ricardo — blefaroplastia
  ft('ct-ricardo', 'Pré-op — olhar frontal', 'pre-op', mesesAtras(15, 8)),
  ft('ct-ricardo', 'D+30 — comparativo', 'evolucao', mesesAtras(13, 4)),
  ft('ct-ricardo', 'Resultado 1 ano', 'evolucao', mesesAtras(2, 6)),

  // Luana — lipo HD D+40
  ft('ct-luana', 'Pré-op — frente', 'pre-op', diasAtras(55, 14)),
  ft('ct-luana', 'D+40 — evolução', 'evolucao', diasAtras(2, 10), 'app-medico'),

  // Mariana — avaliação de hoje (planejamento)
  ft('ct-mariana', 'Avaliação — perfil direito', 'planejamento', diasAtras(0, 10), 'app-medico'),
]
