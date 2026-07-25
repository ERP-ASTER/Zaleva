import type { Journey, JourneyStep, JourneyStepStatus, JourneyStepTipo } from './types'
import { diasAtras, emDias } from './dates'

let s = 0
const st = (
  tipo: JourneyStepTipo,
  titulo: string,
  previstoEm: string,
  status: JourneyStepStatus,
  extras: Partial<JourneyStep> = {},
): JourneyStep => ({ id: `js-${++s}`, tipo, titulo, previstoEm, status, ...extras })

/** Gera os passos padrão da jornada pós-operatória a partir do dia do procedimento (offset em dias). */
export const passosPadraoPosOp = (diaCirurgia: number): JourneyStep[] => [
  st('orientacoes', 'Envio de orientações pós-operatórias', emDias(diaCirurgia, 18), diaCirurgia <= 0 ? 'concluido' : 'pendente', diaCirurgia <= 0 ? { concluidoEm: emDias(diaCirurgia, 18) } : {}),
  st('checkin', 'Check-in de bem-estar (D+1)', emDias(diaCirurgia + 1, 9), 'pendente'),
  st('foto', 'Solicitação de foto de evolução (D+7)', emDias(diaCirurgia + 7, 10), 'pendente'),
  st('retorno', 'Retorno presencial (D+30)', emDias(diaCirurgia + 30, 9), 'pendente'),
  st('nps', 'Pesquisa de satisfação — NPS (D+40)', emDias(diaCirurgia + 40, 10), 'pendente'),
  st('avaliacao-publica', 'Convite para avaliação pública (D+45)', emDias(diaCirurgia + 45, 10), 'pendente'),
]

export const jornadas: Journey[] = [
  // ─── Carla — D+1 abdominoplastia, resposta crítica ─────────────────────────
  {
    id: 'jn-carla',
    contactId: 'ct-carla',
    procedimento: 'Abdominoplastia',
    procedimentoEm: diasAtras(1, 7, 30),
    risco: 'alto',
    alertaResolvido: false,
    steps: [
      st('orientacoes', 'Envio de orientações pós-operatórias', diasAtras(1, 18), 'concluido', { concluidoEm: diasAtras(1, 18) }),
      st('checkin', 'Check-in de bem-estar (D+1)', diasAtras(0, 9), 'critico', {
        concluidoEm: diasAtras(0, 9, 40),
        resposta: 'Estou com bastante dor hoje, diria que 8. A medicação não está resolvendo muito.',
        notaDor: 8,
      }),
      st('foto', 'Solicitação de foto de evolução (D+7)', emDias(6, 10), 'pendente'),
      st('retorno', 'Retorno presencial (D+30)', emDias(29, 9), 'pendente'),
      st('nps', 'Pesquisa de satisfação — NPS (D+40)', emDias(39, 10), 'pendente'),
      st('avaliacao-publica', 'Convite para avaliação pública (D+45)', emDias(44, 10), 'pendente'),
    ],
  },
  // ─── Sofia — D+25 rinoplastia, evolução ótima ─────────────────────────────
  {
    id: 'jn-sofia',
    contactId: 'ct-sofia',
    procedimento: 'Rinoplastia estruturada',
    procedimentoEm: diasAtras(25, 7, 30),
    risco: 'baixo',
    steps: [
      st('orientacoes', 'Envio de orientações pós-operatórias', diasAtras(25, 18), 'concluido', { concluidoEm: diasAtras(25, 18) }),
      st('checkin', 'Check-in de bem-estar (D+1)', diasAtras(24, 9), 'concluido', { concluidoEm: diasAtras(24, 9, 20), resposta: 'Dor 3/10, bem controlada com a medicação.', notaDor: 3 }),
      st('foto', 'Solicitação de foto de evolução (D+7)', diasAtras(18, 10), 'concluido', { concluidoEm: diasAtras(18, 11), resposta: 'Foto recebida — edema dentro do esperado.' }),
      st('retorno', 'Retorno presencial (D+25 — antecipado)', diasAtras(0, 8), 'concluido', { concluidoEm: diasAtras(0, 8, 30) }),
      st('nps', 'Pesquisa de satisfação — NPS (D+40)', emDias(15, 10), 'pendente'),
      st('avaliacao-publica', 'Convite para avaliação pública (D+45)', emDias(20, 10), 'pendente'),
    ],
  },
  // ─── Thaís — D+45 mamoplastia, NPS aguardando resposta ────────────────────
  {
    id: 'jn-thais',
    contactId: 'ct-thais',
    procedimento: 'Mamoplastia de aumento',
    procedimentoEm: diasAtras(45, 7, 30),
    risco: 'baixo',
    steps: [
      st('orientacoes', 'Envio de orientações pós-operatórias', diasAtras(45, 18), 'concluido', { concluidoEm: diasAtras(45, 18) }),
      st('checkin', 'Check-in de bem-estar (D+1)', diasAtras(44, 9), 'concluido', { concluidoEm: diasAtras(44, 10), resposta: 'Dor 4/10, controlada.', notaDor: 4 }),
      st('foto', 'Solicitação de foto de evolução (D+7)', diasAtras(38, 10), 'concluido', { concluidoEm: diasAtras(38, 12) }),
      st('retorno', 'Retorno presencial (D+30)', diasAtras(15, 9), 'concluido', { concluidoEm: diasAtras(15, 9, 30) }),
      st('nps', 'Pesquisa de satisfação — NPS', diasAtras(2, 10), 'aguardando', { resposta: 'Enviada — aguardando resposta' }),
      st('avaliacao-publica', 'Convite para avaliação pública', emDias(3, 10), 'pendente'),
    ],
  },
  // ─── Luana — D+40 lipo HD ─────────────────────────────────────────────────
  {
    id: 'jn-luana',
    contactId: 'ct-luana',
    procedimento: 'Lipoaspiração HD',
    procedimentoEm: diasAtras(40, 7, 30),
    risco: 'baixo',
    steps: [
      st('orientacoes', 'Envio de orientações pós-operatórias', diasAtras(40, 18), 'concluido', { concluidoEm: diasAtras(40, 18) }),
      st('checkin', 'Check-in de bem-estar (D+1)', diasAtras(39, 9), 'concluido', { concluidoEm: diasAtras(39, 9, 15), resposta: 'Dor 5/10 — orientada sobre drenagem.', notaDor: 5 }),
      st('foto', 'Solicitação de foto de evolução (D+7)', diasAtras(33, 10), 'concluido', { concluidoEm: diasAtras(33, 14) }),
      st('retorno', 'Retorno presencial (D+40)', diasAtras(2, 10), 'concluido', { concluidoEm: diasAtras(2, 10, 30) }),
      st('nps', 'Pesquisa de satisfação — NPS', emDias(1, 10), 'pendente'),
      st('avaliacao-publica', 'Convite para avaliação pública', emDias(6, 10), 'pendente'),
    ],
  },
  // ─── Beatriz — D+60 mamoplastia, faltou ao retorno (risco médio) ──────────
  {
    id: 'jn-beatriz',
    contactId: 'ct-beatriz',
    procedimento: 'Mamoplastia de aumento',
    procedimentoEm: diasAtras(60, 7, 30),
    risco: 'medio',
    steps: [
      st('orientacoes', 'Envio de orientações pós-operatórias', diasAtras(60, 18), 'concluido', { concluidoEm: diasAtras(60, 18) }),
      st('checkin', 'Check-in de bem-estar (D+1)', diasAtras(59, 9), 'concluido', { concluidoEm: diasAtras(59, 9, 45), resposta: 'Dor 4/10.', notaDor: 4 }),
      st('foto', 'Solicitação de foto de evolução (D+7)', diasAtras(53, 10), 'concluido', { concluidoEm: diasAtras(53, 16) }),
      st('retorno', 'Retorno presencial (D+60)', diasAtras(2, 15), 'aguardando', { resposta: '⚠ Não compareceu ao retorno — reagendamento pendente' }),
      st('nps', 'Pesquisa de satisfação — NPS', emDias(5, 10), 'pendente'),
      st('avaliacao-publica', 'Convite para avaliação pública', emDias(10, 10), 'pendente'),
    ],
  },
  // ─── Yasmin — D+80 rinoplastia, fase final ────────────────────────────────
  {
    id: 'jn-yasmin',
    contactId: 'ct-yasmin',
    procedimento: 'Rinoplastia estruturada',
    procedimentoEm: diasAtras(80, 7, 30),
    risco: 'baixo',
    steps: [
      st('orientacoes', 'Envio de orientações pós-operatórias', diasAtras(80, 18), 'concluido', { concluidoEm: diasAtras(80, 18) }),
      st('checkin', 'Check-in de bem-estar (D+1)', diasAtras(79, 9), 'concluido', { concluidoEm: diasAtras(79, 9, 30), resposta: 'Dor 2/10.', notaDor: 2 }),
      st('foto', 'Solicitação de foto de evolução (D+7)', diasAtras(73, 10), 'concluido', { concluidoEm: diasAtras(73, 10, 30) }),
      st('retorno', 'Retorno presencial (D+30)', diasAtras(50, 9), 'concluido', { concluidoEm: diasAtras(50, 9, 30) }),
      st('nps', 'Pesquisa de satisfação — NPS', diasAtras(40, 10), 'concluido', { concluidoEm: diasAtras(40, 12), resposta: 'NPS 10 — "Equipe impecável do início ao fim!"' }),
      st('avaliacao-publica', 'Convite para avaliação pública', diasAtras(35, 10), 'concluido', { concluidoEm: diasAtras(34, 9), resposta: 'Avaliação 5★ publicada no Google' }),
    ],
  },
  // ─── Marcos — blefaroplastia, acompanhamento longo ────────────────────────
  {
    id: 'jn-marcos',
    contactId: 'ct-marcos',
    procedimento: 'Blefaroplastia superior',
    procedimentoEm: diasAtras(90, 7, 30),
    risco: 'baixo',
    steps: [
      st('orientacoes', 'Envio de orientações pós-operatórias', diasAtras(90, 18), 'concluido', { concluidoEm: diasAtras(90, 18) }),
      st('checkin', 'Check-in de bem-estar (D+1)', diasAtras(89, 9), 'concluido', { concluidoEm: diasAtras(89, 9, 10), resposta: 'Dor 2/10.', notaDor: 2 }),
      st('foto', 'Solicitação de foto de evolução (D+7)', diasAtras(83, 10), 'concluido', { concluidoEm: diasAtras(83, 11) }),
      st('retorno', 'Retorno presencial (D+90)', diasAtras(0, 8, 40), 'concluido', { concluidoEm: diasAtras(0, 9, 10) }),
      st('nps', 'Pesquisa de satisfação — NPS', emDias(2, 10), 'pendente'),
      st('avaliacao-publica', 'Convite para avaliação pública', emDias(7, 10), 'pendente'),
    ],
  },
]
