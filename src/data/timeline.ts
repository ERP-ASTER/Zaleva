import type { TimelineEvent, TimelineTipo } from './types'
import { diasAtras, horasAtras, mesesAtras, emDias } from './dates'

let t = 0
const ev = (
  contactId: string,
  tipo: TimelineTipo,
  titulo: string,
  em: string,
  descricao?: string,
  rota?: string,
): TimelineEvent => ({ id: `tl-${++t}`, contactId, tipo, titulo, em, descricao, rota })

export const eventosIniciais: TimelineEvent[] = [
  // ─── Mariana — 6 dias de jornada (lead → avaliação de hoje) ────────────────
  ev('ct-mariana', 'lead', 'Lead criado — campanha "Rino Verão"', diasAtras(6, 14, 12), 'Origem: Instagram Ads · Anúncio "Seu perfil, sua confiança"', '/crm/dl-mariana'),
  ev('ct-mariana', 'conversa', 'Primeira conversa no WhatsApp', diasAtras(6, 14, 12), 'IA iniciou o atendimento e coletou informações', '/inbox'),
  ev('ct-mariana', 'conversa', 'Atendimento transferido para Diego Antunes', diasAtras(6, 14, 30), 'IA detectou intenção comercial e transferiu'),
  ev('ct-mariana', 'agendamento', 'Avaliação agendada — Dr. Renato Somensi', diasAtras(6, 14, 45), 'Unidade Toledo · Consultório 2', '/agenda'),
  ev('ct-mariana', 'documento', 'Formulário pré-consulta respondido', diasAtras(5, 9, 10), 'Alergia a dipirona informada'),
  ev('ct-mariana', 'tarefa', 'Lembrete de consulta enviado e confirmado', diasAtras(1, 10), 'Confirmação automática via WhatsApp'),
  ev('ct-mariana', 'conversa', 'Dúvida sobre tempo de recuperação', horasAtras(2, 14), 'Aguardando resposta da equipe', '/inbox'),

  // ─── Carla — 4 meses (lead → cirurgia → pós crítico) ───────────────────────
  ev('ct-carla', 'lead', 'Lead criado — pesquisa Google', mesesAtras(4, 3), 'Buscou "abdominoplastia melhor cirurgião SP"'),
  ev('ct-carla', 'conversa', 'Primeira conversa no WhatsApp', mesesAtras(4, 3)),
  ev('ct-carla', 'agendamento', 'Avaliação agendada — Dr. Renato Somensi', mesesAtras(4, 5)),
  ev('ct-carla', 'consulta', 'Avaliação realizada — indicação de abdominoplastia', mesesAtras(3, 12), 'Diástase de 4cm confirmada · caso favorável'),
  ev('ct-carla', 'orcamento', 'Orçamento apresentado — R$ 32.700', mesesAtras(3, 14), 'Entrada 30% + 6x sem juros'),
  ev('ct-carla', 'contrato', 'Contrato assinado eletronicamente', mesesAtras(1, 25), 'Assinado às 14h32 via link seguro', '/contratos'),
  ev('ct-carla', 'pagamento', 'Entrada recebida — R$ 9.810 (Pix)', mesesAtras(1, 26)),
  ev('ct-carla', 'consulta', 'Consulta pré-operatória realizada', mesesAtras(1, 20), 'Exames validados · risco cirúrgico ASA I liberado'),
  ev('ct-carla', 'procedimento', 'Abdominoplastia realizada', diasAtras(1, 7, 30), 'Centro Cirúrgico Toledo · sem intercorrências · Dr. Renato Somensi'),
  ev('ct-carla', 'documento', 'Prescrição e orientações pós-op enviadas', diasAtras(1, 12), 'Recebidas no portal da paciente'),
  ev('ct-carla', 'checkin', 'Check-in D+1 respondido — dor 8/10', horasAtras(3, 55), 'Resposta acima do limiar esperado', '/pos-atendimento'),
  ev('ct-carla', 'alerta', '⚠ Alerta crítico — dor intensa no D+1', horasAtras(3, 54), 'Equipe do Dr. Renato notificada com prioridade', '/pos-atendimento'),

  // ─── Ricardo — 18 meses de relacionamento ──────────────────────────────────
  ev('ct-ricardo', 'lead', 'Chegou por indicação de Helena Vasquez', mesesAtras(18, 8), 'Programa de indicação'),
  ev('ct-ricardo', 'conversa', 'Primeiro contato — interesse em blefaroplastia', mesesAtras(18, 9)),
  ev('ct-ricardo', 'agendamento', 'Avaliação agendada — Dr. Renato Somensi', mesesAtras(18, 12)),
  ev('ct-ricardo', 'consulta', 'Avaliação — indicação de blefaroplastia superior', mesesAtras(15, 10), 'Dermatocálase bilateral · CID H02.3'),
  ev('ct-ricardo', 'orcamento', 'Orçamento aceito — R$ 15.000', mesesAtras(15, 4)),
  ev('ct-ricardo', 'contrato', 'Contrato assinado presencialmente', mesesAtras(15, 3), undefined, '/contratos'),
  ev('ct-ricardo', 'pagamento', 'Pagamento à vista — R$ 15.000', mesesAtras(14, 5)),
  ev('ct-ricardo', 'procedimento', 'Blefaroplastia superior realizada', mesesAtras(14, 2), 'Sem intercorrências'),
  ev('ct-ricardo', 'checkin', 'Check-in D+1 — dor 2/10', mesesAtras(14, 1)),
  ev('ct-ricardo', 'consulta', 'Retorno D+30 — cicatrização excelente', mesesAtras(13, 4)),
  ev('ct-ricardo', 'nps', 'NPS 10 — promotor', mesesAtras(12, 20), '"Resultado natural, equipe excepcional"'),
  ev('ct-ricardo', 'conversa', 'Indicou a sobrinha Sofia Linhares', mesesAtras(3, 20), 'Programa de indicação · Sofia fechou rinoplastia'),
  ev('ct-ricardo', 'procedimento', 'Toxina botulínica — 1ª aplicação', mesesAtras(12, 10), 'Dra. Camila Iwata'),
  ev('ct-ricardo', 'pagamento', 'Pagamento toxina — R$ 2.200', mesesAtras(12, 10)),
  ev('ct-ricardo', 'procedimento', 'Toxina botulínica — 2ª aplicação', mesesAtras(6, 12), 'Dra. Camila Iwata'),
  ev('ct-ricardo', 'pagamento', 'Pagamento toxina — R$ 2.200', mesesAtras(6, 12)),
  ev('ct-ricardo', 'conversa', 'Solicitou agendamento da aplicação semestral', diasAtras(8, 9, 40), 'Proatividade do paciente — fidelizado', '/inbox'),
  ev('ct-ricardo', 'agendamento', 'Toxina agendada — amanhã, 14h', diasAtras(8, 10, 5), 'Dra. Camila Iwata · Toledo', '/agenda'),
  ev('ct-ricardo', 'tarefa', 'Interesse em lifting facial registrado', diasAtras(8, 10, 15), 'Avaliação agendada para a próxima semana'),

  // ─── Gabriela — fechamento recente (espelho da cascata) ────────────────────
  ev('ct-gabriela', 'lead', 'Lead criado — campanha "Rino Verão"', diasAtras(38, 12)),
  ev('ct-gabriela', 'consulta', 'Avaliação realizada — Dr. Renato', diasAtras(20, 10)),
  ev('ct-gabriela', 'orcamento', 'Orçamento V2 aceito — R$ 36.500', diasAtras(5, 14), undefined, '/orcamentos/qt-gabriela'),
  ev('ct-gabriela', 'contrato', 'Contrato assinado eletronicamente', diasAtras(4, 16), 'Cascata automática: parcelas + cirurgia + checklist + jornada', '/contratos'),
  ev('ct-gabriela', 'pagamento', 'Entrada recebida — R$ 10.950 (Pix)', diasAtras(4, 17)),
  ev('ct-gabriela', 'agendamento', 'Rinoplastia agendada', diasAtras(4, 16, 30), 'Centro Cirúrgico · daqui a 3 dias', '/agenda'),

  // ─── Sofia — pós-op tranquilo ──────────────────────────────────────────────
  ev('ct-sofia', 'lead', 'Chegou por indicação de Ricardo Tavares', mesesAtras(3, 20)),
  ev('ct-sofia', 'procedimento', 'Rinoplastia realizada — Dr. Bruno Rezende', diasAtras(25, 7, 30)),
  ev('ct-sofia', 'checkin', 'Check-in D+1 — dor 3/10', diasAtras(24, 9, 20)),
  ev('ct-sofia', 'consulta', 'Retorno D+25 — evolução excelente', diasAtras(0, 8, 30), 'Consulta com apoio de IA — revisada e aprovada'),
]
