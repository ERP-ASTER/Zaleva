import type { ClinicalRecord, Encounter, Prescription, ClinicalDoc } from './types'
import { diasAtras, mesesAtras, emDias } from './dates'

// ─── Resumo clínico por paciente ───────────────────────────────────────────
export const fichasClinicas: ClinicalRecord[] = [
  {
    contactId: 'ct-mariana',
    alergias: ['Dipirona'],
    condicoes: ['Rinite alérgica leve'],
    medicamentos: ['Anticoncepcional oral (Drospirenona)'],
    antecedentes: ['Nega cirurgias prévias', 'Nega tabagismo', 'Atividade física regular'],
    alertas: ['Alergia a dipirona — atenção na prescrição'],
  },
  {
    contactId: 'ct-carla',
    alergias: [],
    condicoes: ['Hipotireoidismo compensado'],
    medicamentos: ['Levotiroxina 75mcg'],
    antecedentes: ['2 gestações (partos cesáreos)', 'Abdominoplastia realizada ontem'],
    alertas: ['Pós-operatório imediato — D+1 abdominoplastia'],
  },
  {
    contactId: 'ct-ricardo',
    alergias: ['Penicilina'],
    condicoes: ['Hipertensão arterial controlada'],
    medicamentos: ['Losartana 50mg', 'Rosuvastatina 10mg'],
    antecedentes: ['Blefaroplastia superior (há 14 meses)', 'Aplicações semestrais de toxina'],
    alertas: ['Alergia a penicilina'],
  },
  {
    contactId: 'ct-gabriela',
    alergias: [],
    condicoes: [],
    medicamentos: [],
    antecedentes: ['Nega comorbidades'],
    alertas: ['Cirurgia agendada — exames pré-op validados'],
  },
  {
    contactId: 'ct-gustavo',
    alergias: [],
    condicoes: ['Dislipidemia'],
    medicamentos: ['Atorvastatina 20mg'],
    antecedentes: ['Nega cirurgias prévias'],
    alertas: [],
  },
]

export const fichaById = (contactId: string): ClinicalRecord =>
  fichasClinicas.find((f) => f.contactId === contactId) ?? {
    contactId,
    alergias: [],
    condicoes: [],
    medicamentos: [],
    antecedentes: [],
    alertas: [],
  }

// ─── Consultas (encounters) ────────────────────────────────────────────────
export const consultas: Encounter[] = [
  {
    id: 'enc-mariana',
    contactId: 'ct-mariana',
    appointmentId: 'ap-4',
    profissionalId: 'prof-otavio',
    tipo: 'Avaliação — Rinoplastia',
    em: emDias(0, 10),
    status: 'aberta',
    cids: [],
  },
  {
    id: 'enc-gustavo',
    contactId: 'ct-gustavo',
    profissionalId: 'prof-otavio',
    tipo: 'Teleconsulta — Avaliação blefaroplastia',
    em: emDias(0, 11, 30),
    status: 'aberta',
    cids: [],
  },
  {
    id: 'enc-carla-pre',
    contactId: 'ct-carla',
    profissionalId: 'prof-otavio',
    tipo: 'Consulta pré-operatória',
    em: mesesAtras(1, 20),
    status: 'finalizada',
    motivo: 'Avaliação pré-operatória — abdominoplastia.',
    anamnese: 'Paciente 41 anos, 2 gestações prévias com diástase de retos abdominais. Hipotireoidismo compensado em uso de levotiroxina. Exames laboratoriais e risco cirúrgico (ASA I) liberados.',
    exameFisico: 'Flacidez cutânea infraumbilical moderada, diástase palpável de ~4cm. Sem hérnias.',
    avaliacao: 'Candidata adequada à abdominoplastia clássica com plicatura.',
    conduta: 'Confirmada cirurgia. Orientações pré-operatórias entregues. Jejum de 8h.',
    cids: [{ codigo: 'M62.0', descricao: 'Diástase de músculo' }],
  },
  {
    id: 'enc-ricardo-blefaro',
    contactId: 'ct-ricardo',
    profissionalId: 'prof-otavio',
    tipo: 'Avaliação — Blefaroplastia',
    em: mesesAtras(15, 10),
    status: 'finalizada',
    motivo: 'Dermatocálase palpebral superior com queixa estética e peso ocular ao fim do dia.',
    anamnese: 'Paciente 51 anos à época, hipertenso controlado. Sem uso de anticoagulantes.',
    exameFisico: 'Excesso cutâneo palpebral superior bilateral, sem ptose verdadeira.',
    avaliacao: 'Indicação clara de blefaroplastia superior bilateral.',
    conduta: 'Programada blefaroplastia superior. Solicitados exames pré-operatórios.',
    cids: [{ codigo: 'H02.3', descricao: 'Dermatocálase' }],
  },
  {
    id: 'enc-sofia-rino',
    contactId: 'ct-sofia',
    profissionalId: 'prof-bruno',
    tipo: 'Retorno pós-operatório D+25',
    em: emDias(0, 8),
    status: 'finalizada',
    motivo: 'Retorno programado de rinoplastia.',
    avaliacao: 'Evolução excelente. Edema residual dentro do esperado para D+25.',
    conduta: 'Mantidas orientações. Liberado exercício leve. Óculos apenas após D+45.',
    cids: [],
    aiAssistida: true,
  },
]

// ─── Prescrições e documentos ──────────────────────────────────────────────
export const prescricoes: Prescription[] = [
  {
    id: 'rx-carla-pos',
    contactId: 'ct-carla',
    profissionalId: 'prof-otavio',
    titulo: 'Prescrição pós-operatória — Abdominoplastia',
    itens: [
      { medicamento: 'Cefalexina 500mg', posologia: '1 comprimido de 6/6h por 7 dias' },
      { medicamento: 'Paracetamol 750mg', posologia: '1 comprimido de 6/6h se dor' },
      { medicamento: 'Enoxaparina 40mg', posologia: '1 aplicação subcutânea ao dia por 5 dias' },
    ],
    status: 'assinado',
    em: diasAtras(1, 12),
  },
  {
    id: 'rx-ricardo-toxina',
    contactId: 'ct-ricardo',
    profissionalId: 'prof-camila',
    titulo: 'Orientações pós-toxina',
    itens: [{ medicamento: 'Orientações', posologia: 'Não deitar por 4h. Não massagear a região por 24h.' }],
    status: 'enviado',
    em: mesesAtras(6, 12),
  },
]

export const documentos: ClinicalDoc[] = [
  { id: 'doc-carla-rx', contactId: 'ct-carla', tipo: 'prescricao', titulo: 'Prescrição pós-operatória', status: 'assinado', em: diasAtras(1, 12) },
  { id: 'doc-carla-orient', contactId: 'ct-carla', tipo: 'orientacoes', titulo: 'Orientações pós-abdominoplastia', status: 'enviado', em: diasAtras(1, 13) },
  { id: 'doc-carla-termo', contactId: 'ct-carla', tipo: 'termo', titulo: 'Termo de consentimento — Abdominoplastia', status: 'assinado', em: mesesAtras(1, 22) },
  { id: 'doc-carla-atestado', contactId: 'ct-carla', tipo: 'atestado', titulo: 'Atestado — afastamento 15 dias', status: 'assinado', em: diasAtras(1, 12) },
  { id: 'doc-ricardo-termo', contactId: 'ct-ricardo', tipo: 'termo', titulo: 'Termo de consentimento — Blefaroplastia', status: 'assinado', em: mesesAtras(14, 2) },
  { id: 'doc-gabriela-termo', contactId: 'ct-gabriela', tipo: 'termo', titulo: 'Termo de consentimento — Rinoplastia', status: 'assinado', em: diasAtras(4, 17) },
  { id: 'doc-gabriela-exames', contactId: 'ct-gabriela', tipo: 'exames', titulo: 'Exames pré-operatórios', status: 'revisado', em: diasAtras(6, 9) },
  { id: 'doc-mariana-form', contactId: 'ct-mariana', tipo: 'orientacoes', titulo: 'Formulário pré-consulta (respondido)', status: 'enviado', em: diasAtras(5, 9) },
]

// ─── Script da consulta assistida (Mariana) ────────────────────────────────
export interface FalaTranscricao {
  quem: 'medico' | 'paciente'
  texto: string
}

export const transcricaoMariana: FalaTranscricao[] = [
  { quem: 'medico', texto: 'Bom dia, Mariana! Seja muito bem-vinda. Me conta: o que te trouxe até aqui?' },
  { quem: 'paciente', texto: 'Bom dia, doutor! Então… desde a adolescência eu me incomodo com o meu nariz. Acho ele largo e tem uma giba que me incomoda muito nas fotos de perfil.' },
  { quem: 'medico', texto: 'Entendi. Além da questão estética, você tem alguma dificuldade para respirar? Ronco, nariz entupido com frequência?' },
  { quem: 'paciente', texto: 'Tenho rinite, e sinto que o lado esquerdo entope mais, principalmente à noite.' },
  { quem: 'medico', texto: 'Certo. Você já fez alguma cirurgia antes? Usa alguma medicação? Tem alguma alergia?' },
  { quem: 'paciente', texto: 'Nunca operei nada. Só tomo anticoncepcional. E sou alérgica a dipirona.' },
  { quem: 'medico', texto: 'Anotado. Fuma? Pratica atividade física?' },
  { quem: 'paciente', texto: 'Não fumo. Faço musculação três vezes por semana.' },
  { quem: 'medico', texto: 'Ótimo. Vou examinar agora... Percebo o dorso com giba osteocartilaginosa discreta, a ponta um pouco caída e um desvio leve de septo à esquerda — que explica essa obstrução noturna.' },
  { quem: 'paciente', texto: 'E dá pra resolver a respiração junto com a parte estética?' },
  { quem: 'medico', texto: 'Dá, e é exatamente o que eu recomendo: uma rinoplastia estruturada com septoplastia no mesmo tempo cirúrgico. A gente melhora o contorno do dorso, refina a ponta e corrige o septo.' },
  { quem: 'paciente', texto: 'Que ótimo! E a recuperação, como é? Trabalho com clientes...' },
  { quem: 'medico', texto: 'Você vai usar um splint nasal por 7 dias. Entre 7 e 10 dias já dá para retomar o trabalho. Exercício físico, depois de 30 dias. O resultado refinado vem ao longo de 12 meses, mas em 3 meses você já se vê muito bem.' },
  { quem: 'paciente', texto: 'Perfeito. Quero muito fazer!' },
  { quem: 'medico', texto: 'Vou pedir seus exames pré-operatórios e a equipe comercial te apresenta o plano ainda hoje, combinado?' },
]

export const rascunhoIAMariana = {
  motivo: 'Insatisfação estética com o nariz (dorso largo e giba) associada a obstrução nasal noturna à esquerda.',
  anamnese:
    'Paciente de 34 anos, sem cirurgias prévias. Rinite alérgica; obstrução nasal predominante à esquerda, pior no período noturno. Em uso de anticoncepcional oral. Alergia a dipirona. Nega tabagismo; pratica musculação 3x/semana.',
  exameFisico:
    'Dorso nasal com giba osteocartilaginosa discreta. Ponta nasal com leve queda. Desvio septal à esquerda, compatível com a queixa obstrutiva.',
  avaliacao:
    'Candidata à rinoplastia estruturada com septoplastia associada, com objetivo funcional e estético. Sem contraindicações identificadas na avaliação inicial.',
  conduta:
    'Indicada rinoplastia estruturada + septoplastia em tempo único. Solicitados exames pré-operatórios. Encaminhada à equipe comercial para apresentação do plano de tratamento. Retorno com exames.',
}

export const cidsSugeridosMariana = [
  { codigo: 'M95.0', descricao: 'Deformidade adquirida do nariz' },
  { codigo: 'J34.2', descricao: 'Desvio do septo nasal' },
  { codigo: 'J30.4', descricao: 'Rinite alérgica não especificada' },
]

export const prescricaoSugeridaMariana = {
  titulo: 'Solicitação de exames pré-operatórios',
  itens: [
    { medicamento: 'Hemograma completo', posologia: 'Pré-operatório' },
    { medicamento: 'Coagulograma (TP, TTPA)', posologia: 'Pré-operatório' },
    { medicamento: 'Glicemia de jejum', posologia: 'Pré-operatório' },
    { medicamento: 'ECG com laudo', posologia: 'Pré-operatório' },
    { medicamento: 'Tomografia de face (cortes finos)', posologia: 'Planejamento cirúrgico' },
  ],
}

export const respostasIAConsulta: Record<string, string> = {
  alergia:
    'Atenção: a paciente refere alergia a Dipirona (registrada na ficha). Sugestão de analgesia alternativa: Paracetamol 750mg 6/6h.',
  resumo:
    'Paciente 34a, primeira cirurgia, deseja rinoplastia por queixa estética (giba, dorso largo) + obstrução nasal E. Exame: giba discreta, ponta caída, desvio septal E. Plano: rino estruturada + septoplastia.',
}
