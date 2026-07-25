import type { Appointment, AppointmentStatus, AppointmentTipo } from './types'
import { emDias } from './dates'

let n = 0
const ap = (
  contactId: string,
  profissionalId: string,
  tipo: AppointmentTipo,
  titulo: string,
  inicio: string,
  duracaoMin: number,
  status: AppointmentStatus,
  extras: Partial<Appointment> = {},
): Appointment => ({
  id: `ap-${++n}`,
  contactId,
  profissionalId,
  unidadeId: 'un-toledo',
  tipo,
  titulo,
  inicio,
  duracaoMin,
  status,
  ...extras,
})

export const agendamentos: Appointment[] = [
  // ─── HOJE ──────────────────────────────────────────────────────────────────
  ap('ct-sofia', 'prof-otavio', 'retorno', 'Retorno pós-op — Rinoplastia D+25', emDias(0, 8, 0), 30, 'finalizado', { sala: 'Consultório 2' }),
  ap('ct-marcos', 'prof-otavio', 'retorno', 'Retorno pós-op — Blefaroplastia', emDias(0, 8, 40), 30, 'finalizado', { sala: 'Consultório 2' }),
  ap('ct-thais', 'prof-leticia', 'retorno', 'Retorno pós-op — Mamoplastia D+45', emDias(0, 9, 0), 30, 'em-atendimento', { sala: 'Consultório 3' }),
  ap('ct-mariana', 'prof-otavio', 'avaliacao', 'Avaliação — Rinoplastia', emDias(0, 10, 0), 50, 'confirmado', { sala: 'Consultório 2', observacao: 'Primeira cirurgia. Formulário pré-consulta preenchido.', encounterId: 'enc-mariana' }),
  ap('ct-gustavo', 'prof-otavio', 'teleconsulta', 'Teleconsulta — Avaliação blefaroplastia', emDias(0, 11, 30), 40, 'confirmado', { encounterId: 'enc-gustavo' }),
  ap('ct-elisa', 'prof-camila', 'injetavel', 'Preenchimento — manutenção', emDias(0, 10, 30), 50, 'checkin', { sala: 'Sala de Procedimentos' }),
  ap('ct-queila', 'prof-camila', 'injetavel', 'Toxina botulínica — full face', emDias(0, 13, 30), 40, 'confirmado', { sala: 'Sala de Procedimentos' }),
  ap('ct-daniela', 'prof-leticia', 'avaliacao', 'Consulta pré-operatória — Abdominoplastia', emDias(0, 14, 0), 50, 'confirmado', { sala: 'Consultório 3' }),
  ap('ct-mirella', 'prof-camila', 'injetavel', 'Toxina botulínica — reaplicação', emDias(0, 15, 0), 40, 'aguardando-confirmacao', { sala: 'Sala de Procedimentos' }),
  ap('ct-viviane', 'prof-camila', 'injetavel', 'Preenchimento labial', emDias(0, 16, 0), 50, 'pre-agendado', { sala: 'Sala de Procedimentos', unidadeId: 'un-eldorado' }),
  ap('ct-renato', 'prof-bruno', 'retorno', 'Retorno anual — Blefaroplastia', emDias(0, 16, 30), 30, 'aguardando-confirmacao', { sala: 'Consultório 4' }),

  // ─── Ontem / dias anteriores desta semana ─────────────────────────────────
  ap('ct-carla', 'prof-otavio', 'procedimento', 'Abdominoplastia', emDias(-1, 7, 30), 210, 'finalizado', { sala: 'Centro Cirúrgico', observacao: 'Procedimento sem intercorrências. Alta no mesmo dia.' }),
  ap('ct-helena', 'prof-camila', 'injetavel', 'Toxina botulínica', emDias(-1, 14, 0), 40, 'no-show', { sala: 'Sala de Procedimentos', observacao: 'Reagendado a pedido da paciente.' }),
  ap('ct-yasmin', 'prof-bruno', 'retorno', 'Retorno pós-op — Rinoplastia D+80', emDias(-1, 9, 0), 30, 'finalizado', { sala: 'Consultório 4' }),
  ap('ct-luana', 'prof-bruno', 'retorno', 'Retorno pós-op — Lipo HD D+40', emDias(-2, 10, 0), 30, 'finalizado', { sala: 'Consultório 4' }),
  ap('ct-paula', 'prof-leticia', 'retorno', 'Retorno anual — Mamoplastia', emDias(-2, 11, 0), 30, 'finalizado', { sala: 'Consultório 3' }),
  ap('ct-beatriz', 'prof-leticia', 'retorno', 'Retorno pós-op — Mamoplastia D+60', emDias(-2, 15, 0), 30, 'no-show', { sala: 'Consultório 3', observacao: 'Não compareceu — reagendar.' }),
  ap('ct-otaviop', 'prof-bruno', 'avaliacao', 'Consulta de revisão — Lipo HD', emDias(-3, 16, 0), 50, 'finalizado', { sala: 'Consultório 4', unidadeId: 'un-eldorado' }),
  ap('ct-claudia', 'prof-camila', 'injetavel', 'Toxina botulínica', emDias(-3, 10, 30), 40, 'finalizado', { sala: 'Sala de Procedimentos' }),
  ap('ct-zilda', 'prof-otavio', 'avaliacao', 'Avaliação — Blefaroplastia', emDias(-3, 14, 0), 50, 'finalizado', { sala: 'Consultório 2' }),

  // ─── Amanhã e próximos dias ────────────────────────────────────────────────
  ap('ct-ricardo', 'prof-camila', 'injetavel', 'Toxina botulínica — aplicação semestral', emDias(1, 14, 0), 40, 'confirmado', { sala: 'Sala de Procedimentos' }),
  ap('ct-carla', 'prof-otavio', 'retorno', 'Retorno pós-op — Abdominoplastia D+2', emDias(1, 9, 0), 30, 'confirmado', { sala: 'Consultório 2' }),
  ap('ct-helena', 'prof-camila', 'injetavel', 'Toxina botulínica (reagendado)', emDias(2, 10, 0), 40, 'confirmado', { sala: 'Sala de Procedimentos' }),
  ap('ct-vanessa', 'prof-leticia', 'avaliacao', 'Avaliação — Mommy Makeover', emDias(2, 9, 0), 60, 'confirmado', { sala: 'Consultório 3' }),
  ap('ct-gabriela', 'prof-otavio', 'procedimento', 'Rinoplastia estruturada', emDias(3, 7, 30), 180, 'confirmado', { sala: 'Centro Cirúrgico', observacao: 'Checklist pré-op em andamento. Exames ok.' }),
  ap('ct-sandra', 'prof-bruno', 'avaliacao', 'Avaliação — Abdominoplastia secundária', emDias(1, 11, 0), 50, 'aguardando-confirmacao', { sala: 'Consultório 4', unidadeId: 'un-eldorado' }),
  ap('ct-wesley', 'prof-bruno', 'retorno', 'Retorno pós-op — Lipo HD D+90', emDias(2, 14, 30), 30, 'pre-agendado', { sala: 'Consultório 4', unidadeId: 'un-eldorado' }),
  ap('ct-juliana', 'prof-leticia', 'avaliacao', 'Avaliação — Mamoplastia', emDias(3, 10, 0), 50, 'pre-agendado', { sala: 'Consultório 3' }),
  ap('ct-flavio', 'prof-otavio', 'retorno', 'Retorno anual — Blefaroplastia', emDias(3, 15, 0), 30, 'aguardando-confirmacao', { sala: 'Consultório 2' }),
  ap('ct-daniela', 'prof-leticia', 'procedimento', 'Abdominoplastia', emDias(4, 7, 30), 210, 'pre-agendado', { sala: 'Centro Cirúrgico', observacao: 'Aguardando resultado de exames pré-operatórios.' }),
  ap('ct-larissa', 'prof-leticia', 'avaliacao', 'Avaliação — Mamoplastia (indicação)', emDias(4, 14, 0), 50, 'pre-agendado', { sala: 'Consultório 3' }),
  ap('ct-heitor', 'prof-camila', 'avaliacao', 'Avaliação — Toxina primeira vez', emDias(4, 16, 0), 40, 'pre-agendado', { sala: 'Sala de Procedimentos', unidadeId: 'un-eldorado' }),
  ap('ct-isabela', 'prof-camila', 'injetavel', 'Preenchimento labial', emDias(5, 9, 0), 50, 'pre-agendado', { sala: 'Sala de Procedimentos' }),
  ap('ct-sofia', 'prof-otavio', 'retorno', 'Retorno pós-op — Rinoplastia D+30', emDias(5, 8, 30), 30, 'pre-agendado', { sala: 'Consultório 2' }),
  ap('ct-marcos', 'prof-bruno', 'teleconsulta', 'Teleconsulta — acompanhamento', emDias(5, 11, 0), 30, 'pre-agendado'),
  ap('ct-paula', 'prof-camila', 'injetavel', 'Toxina botulínica — primeira aplicação', emDias(6, 10, 0), 40, 'pre-agendado', { sala: 'Sala de Procedimentos' }),
  ap('ct-thais', 'prof-leticia', 'retorno', 'Retorno pós-op — Mamoplastia D+52', emDias(6, 9, 30), 30, 'pre-agendado', { sala: 'Consultório 3' }),
  ap('ct-ricardo', 'prof-otavio', 'avaliacao', 'Consulta — avaliação de lifting facial', emDias(6, 15, 0), 50, 'pre-agendado', { sala: 'Consultório 2', observacao: 'Interesse manifestado na última visita.' }),
  ap('ct-luana', 'prof-bruno', 'retorno', 'Retorno pós-op — Lipo HD D+45', emDias(7, 10, 30), 30, 'pre-agendado', { sala: 'Consultório 4', unidadeId: 'un-eldorado' }),
  ap('ct-gabriela', 'prof-otavio', 'retorno', 'Retorno pós-op — Rinoplastia D+1', emDias(4, 8, 0), 30, 'pre-agendado', { sala: 'Consultório 2' }),
]
