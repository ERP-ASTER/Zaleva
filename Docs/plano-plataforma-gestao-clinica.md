# Plano de Produto — Plataforma Integrada de Gestão Clínica

## 1. Visão geral

A plataforma é concebida como um sistema integrado para gestão completa da jornada do paciente, conectando marketing, CRM, atendimento, operação clínica, financeiro, faturamento, relacionamento e inteligência artificial.

O produto não se limita a agenda, prontuário ou gestão administrativa. Sua proposta central é unificar, em uma única plataforma, todo o fluxo entre o primeiro contato do potencial paciente e o acompanhamento posterior ao atendimento ou procedimento.

A jornada principal pode ser representada da seguinte forma:

```text
Visitante
→ Lead
→ Atendimento omnichannel
→ Qualificação
→ Agendamento
→ Consulta
→ Plano de tratamento
→ Orçamento
→ Negociação
→ Contrato e pagamento
→ Procedimento
→ Pós-atendimento
→ Satisfação
→ Recorrência, indicação ou remarketing
```

O objetivo inicial é construir uma aplicação frontend com dados mockados, capaz de demonstrar a visão do produto, seus principais módulos, telas, fluxos e diferenciais, sem aprofundamento inicial em regras de negócio, integrações reais ou backend.

---

## 2. Proposta de valor

A proposta de valor da plataforma é integrar áreas que normalmente funcionam em sistemas separados:

- Marketing e aquisição de pacientes.
- CRM comercial.
- Atendimento por WhatsApp e outros canais.
- Agendamento e recepção.
- Prontuário eletrônico.
- Consulta assistida por inteligência artificial.
- Orçamentos, contratos e planos de tratamento.
- Financeiro, faturamento e convênios.
- Estoque e operação.
- Pós-atendimento e satisfação.
- Portal e aplicativo do paciente.
- Indicadores gerenciais.

O principal diferencial é a continuidade dos processos.

Uma conversa pode originar um lead. O lead pode gerar um agendamento. A consulta pode gerar um plano de tratamento. O plano pode gerar um orçamento e uma negociação. O fechamento pode gerar contrato, parcelas, agendamentos e reserva de materiais. O procedimento pode iniciar uma jornada automatizada de acompanhamento, satisfação, recorrência e indicação.

---

## 3. Princípios de produto

A plataforma deve seguir os seguintes princípios:

1. **Jornada única do paciente**  
   O histórico comercial, assistencial, financeiro e de relacionamento deve permanecer conectado.

2. **Informação contextual**  
   Cada tela deve apresentar apenas as informações e ações relevantes para a atividade atual.

3. **Poucos cliques**  
   Processos recorrentes devem ser executados com o menor número possível de etapas.

4. **IA como copiloto**  
   A inteligência artificial deve auxiliar, resumir, sugerir e automatizar, mantendo ações sensíveis sob supervisão humana.

5. **Automação com retaguarda humana**  
   O atendimento automatizado deve transferir a interação para um colaborador sempre que necessário.

6. **Visão longitudinal do paciente**  
   O paciente deve ser acompanhado desde a captação até o pós-atendimento e a recorrência.

7. **Integração entre áreas**  
   Eventos comerciais, clínicos, operacionais e financeiros devem produzir efeitos conectados.

8. **Segurança e rastreabilidade**  
   Informações, decisões, alterações, acessos e ações automatizadas devem ser auditáveis.

9. **Navegação orientada por perfil**  
   Médico, recepcionista, comercial, financeiro e gestor devem possuir experiências de uso adequadas às suas responsabilidades.

10. **Arquitetura preparada para evolução**  
    O frontend demonstrativo deve representar conceitos compatíveis com uma futura aplicação real, modular e integrável.

---

## 4. Organização macro da plataforma

A plataforma é organizada em sete áreas principais.

| Área | Finalidade |
|---|---|
| Central de Trabalho | Resumo operacional, alertas e atividades do dia |
| Relacionamento e CRM | Marketing, leads, atendimento, vendas e pós-atendimento |
| Atendimento Clínico | Agenda, pacientes, prontuário, consultas e procedimentos |
| Experiência do Paciente | Portal, comunicação, satisfação e suporte |
| Financeiro e Faturamento | Contas, pagamentos, notas, DRE, TISS e convênios |
| Operações | Estoque, equipe, salas, recursos e tarefas |
| Gestão e Configurações | Dashboards, integrações, permissões, automações e auditoria |

---

## 5. Estrutura de navegação

```text
Visão geral

RELACIONAMENTO
├── Marketing
├── Caixa de entrada
├── Leads
├── CRM comercial
├── Campanhas
├── Automações
└── Pós-atendimento

ATENDIMENTO
├── Agenda
├── Recepção
├── Pacientes
├── Prontuário
├── Consultas
├── Procedimentos
├── Teleconsulta
├── Prescrições
└── Documentos clínicos

FINANCEIRO
├── Visão financeira
├── Contas a receber
├── Contas a pagar
├── Conciliação bancária
├── Notas fiscais
├── DRE
├── Inadimplência
└── Repasse profissional

FATURAMENTO
├── Convênios
├── Autorizações
├── Guias TISS
├── Lotes
├── Glosas
├── Repasse de convênios
└── SUS

OPERAÇÕES
├── Estoque
├── Compras
├── Salas e recursos
├── Equipamentos
├── Tarefas
├── Equipe
└── Chat interno

GESTÃO
├── Indicadores
├── Relatórios
├── Central de IA
├── Integrações
├── Permissões
├── Auditoria
└── Configurações
```

O site comercial, o portal do paciente e o futuro aplicativo devem funcionar como aplicações externas conectadas ao mesmo ecossistema.

---

# 6. Módulos da plataforma

## 6.1 Central de Trabalho

A Central de Trabalho é a página inicial da aplicação. Seu conteúdo deve variar conforme o perfil do usuário.

### Funcionalidades

- Resumo do dia.
- Próximas consultas e procedimentos.
- Pacientes aguardando atendimento.
- Leads aguardando resposta.
- Orçamentos pendentes.
- Contratos aguardando assinatura.
- Tarefas e compromissos.
- Alertas clínicos e operacionais.
- Contas vencidas ou próximas do vencimento.
- Materiais com estoque crítico.
- Mensagens sem resposta.
- Alertas de pós-procedimento.
- Atalhos para ações frequentes.

### Principais telas

- Dashboard pessoal.
- Agenda resumida.
- Central de pendências.
- Central de alertas.
- Fila de atendimento.
- Painel de indicadores rápidos.

### Exemplos de perfis

**Médico**

- Próximo paciente.
- Consultas do dia.
- Prontuários pendentes.
- Resultados de exames.
- Retornos atrasados.
- Alertas clínicos.

**Recepção**

- Pacientes aguardando.
- Agendamentos não confirmados.
- Mensagens sem resposta.
- Lista de espera.
- Pendências cadastrais.

**Comercial**

- Novos leads.
- Oportunidades sem próxima ação.
- Orçamentos aguardando resposta.
- Contratos pendentes.
- Metas e conversões.

**Financeiro**

- Contas vencidas.
- Conciliações pendentes.
- Recebimentos do dia.
- Pagamentos próximos.
- Notas fiscais pendentes.

---

## 6.2 Marketing e Aquisição

Este módulo conecta os canais de aquisição ao CRM e permite medir o resultado comercial das campanhas.

### Funcionalidades

- Cadastro de origens e campanhas.
- Integração com Meta, Google, site e landing pages.
- Formulários de captação.
- Agendamento online.
- Rastreamento de UTMs.
- Identificação da origem do lead.
- Gestão de parceiros e indicações.
- Segmentação de públicos.
- Públicos de remarketing.
- Relatórios por canal.
- Custo por lead.
- Custo por agendamento.
- Custo por aquisição.
- Receita e margem por campanha.
- Histórico de conversões.

### Principais telas

- Dashboard de marketing.
- Lista de campanhas.
- Detalhes da campanha.
- Relatório de atribuição.
- Gestão de origens.
- Formulários e landing pages.
- Parceiros e indicadores.
- Segmentos de público.
- Configuração de integrações.

### Cadeia de atribuição

```text
Campanha
→ Anúncio
→ Lead
→ Conversa
→ Agendamento
→ Consulta
→ Orçamento
→ Contrato
→ Receita
→ Recorrência
```

---

## 6.3 Caixa de Entrada Omnichannel

A Caixa de Entrada é a central operacional de comunicação com leads e pacientes.

### Funcionalidades

- WhatsApp integrado.
- Mensagens de redes sociais.
- Chat do site.
- E-mail.
- Distribuição de atendimentos.
- Filas por equipe.
- Agente de IA.
- Transferência para humano.
- Respostas rápidas.
- Templates de mensagens.
- Transcrição de áudios.
- Resumo automático da conversa.
- Identificação automática do contato.
- SLA de atendimento.
- Classificação de intenção.
- Tags e categorias.
- Histórico completo.
- Criação de tarefas.
- Criação de lead ou paciente.
- Agendamento durante a conversa.
- Envio de orçamento e documentos.

### Principais telas

- Caixa de entrada.
- Lista de conversas.
- Fila de atendimento.
- Conversa ativa.
- Painel lateral do contato.
- Configuração do agente de IA.
- Biblioteca de respostas.
- Relatório de atendimento.

### Estrutura visual sugerida

**Coluna esquerda**

- Filas.
- Canais.
- Filtros.
- Atendentes.
- Conversas.

**Área central**

- Histórico da conversa.
- Campo de resposta.
- Áudios.
- Anexos.
- Templates.
- Sugestões da IA.

**Painel lateral**

- Identificação do contato.
- Etapa do funil.
- Responsável.
- Agendamentos.
- Negociações.
- Pendências.
- Próximas ações.
- Timeline resumida.

### Ações possíveis da IA

- Identificar o assunto.
- Responder perguntas administrativas.
- Coletar informações iniciais.
- Consultar horários disponíveis.
- Sugerir agendamento.
- Detectar intenção comercial.
- Identificar urgência.
- Resumir a conversa.
- Encaminhar para a equipe adequada.
- Criar registros e tarefas.
- Sugerir respostas ao colaborador.

---

## 6.4 CRM de Leads e Pacientes

O CRM deve manter um cadastro unificado e permitir que um contato evolua de visitante ou lead para paciente sem perda do histórico.

### Funcionalidades

- Cadastro unificado de pessoas.
- Leads, pacientes, responsáveis e contatos relacionados.
- Tags, interesses e segmentos.
- Origem e campanha.
- Preferências de contato.
- Consentimentos.
- Timeline de relacionamento.
- Último e próximo contato.
- Alertas de inatividade.
- Detecção de duplicidades.
- Mesclagem de cadastros.
- Relacionamentos familiares.
- Histórico de conversas.
- Histórico de agendamentos.
- Histórico comercial.
- Histórico financeiro.
- Histórico clínico conforme permissão.

### Principais telas

- Lista de contatos.
- Lista de leads.
- Lista de pacientes.
- Perfil 360°.
- Segmentação.
- Duplicidades.
- Histórico de relacionamento.
- Consentimentos e privacidade.

### Paciente 360°

A tela do paciente deve concentrar todas as informações relevantes, separadas por abas e permissões.

```text
Resumo
Timeline
Conversas
Agendamentos
Prontuário
Consultas
Plano de tratamento
Orçamentos
Contratos
Procedimentos
Financeiro
Documentos
Pós-atendimento
Satisfação
Tickets
Consentimentos
Auditoria
```

O sistema deve separar adequadamente informações clínicas, comerciais e administrativas. Um colaborador comercial pode consultar informações necessárias à negociação sem acessar conteúdos clínicos restritos.

---

## 6.5 CRM Comercial e Negociação

Este módulo gerencia oportunidades, orçamentos, follow-ups e conversões.

### Funcionalidades

- Funis configuráveis.
- Etapas por especialidade ou tipo de serviço.
- Kanban de oportunidades.
- Qualificação de leads.
- Procedimentos de interesse.
- Valor potencial.
- Probabilidade de fechamento.
- Responsável comercial.
- Próxima ação.
- Histórico de contatos.
- Registro de objeções.
- Orçamentos e propostas.
- Descontos e condições.
- Parcelamentos.
- Aprovação de descontos.
- Follow-ups.
- Motivos de perda.
- Metas comerciais.
- Forecast.
- Relatórios por colaborador, origem e serviço.

### Principais telas

- Kanban comercial.
- Lista de oportunidades.
- Detalhes da negociação.
- Editor de orçamento.
- Simulador comercial.
- Agenda de follow-ups.
- Central de aprovações.
- Dashboard comercial.
- Relatório de perdas.

### Exemplo de funil

```text
Novo lead
→ Em atendimento
→ Qualificado
→ Consulta agendada
→ Consulta realizada
→ Plano apresentado
→ Em negociação
→ Contrato enviado
→ Fechado
→ Perdido
```

---

## 6.6 Orçamentos, Contratos e Planos de Tratamento

Este módulo conecta a avaliação médica, a negociação comercial e a execução dos procedimentos.

### Funcionalidades

- Orçamentos com múltiplos itens.
- Pacotes de procedimentos.
- Planos de tratamento por etapas.
- Versões e revisões.
- Descontos.
- Aprovações.
- Condições de pagamento.
- Parcelamentos.
- Validade do orçamento.
- Contratos.
- Assinatura eletrônica.
- Termos de consentimento.
- Biblioteca de modelos.
- Conversão do orçamento em contrato.
- Conversão do contrato em parcelas.
- Conversão do plano em agendamentos.
- Checklists pré-procedimento.
- Reserva de sala.
- Reserva de materiais.
- Histórico de envio, abertura e assinatura.

### Principais telas

- Lista de orçamentos.
- Editor de orçamento.
- Comparador de versões.
- Plano de tratamento.
- Assistente de fechamento.
- Central de contratos.
- Central de assinaturas.
- Biblioteca de documentos.
- Pendências contratuais.

### Automação após fechamento

```text
Contrato assinado
+ Termos de consentimento
+ Contas a receber
+ Agendamentos
+ Checklist pré-procedimento
+ Reserva de sala
+ Reserva de materiais
+ Jornada de acompanhamento
```

---

## 6.7 Agenda e Recepção

A agenda deve atender profissionais, unidades, salas, equipamentos, procedimentos e teleconsultas.

### Funcionalidades

- Visão diária, semanal e mensal.
- Agenda por profissional.
- Agenda por unidade.
- Agenda por sala.
- Agenda por equipamento.
- Agendamentos recorrentes.
- Bloqueios de agenda.
- Confirmação automática.
- Lembretes.
- Reagendamento.
- Cancelamento.
- Lista de espera.
- Encaixes.
- Check-in digital.
- Fila de atendimento.
- Controle de atrasos.
- Registro de no-show.
- Agendamento online.
- Regras de disponibilidade.
- Duração por tipo de atendimento.
- Identificação de conflitos.

### Principais telas

- Agenda médica.
- Agenda por recursos.
- Editor de agendamento.
- Gestão de disponibilidade.
- Lista de espera.
- Recepção.
- Fila do dia.
- Histórico do agendamento.
- Relatório de faltas e cancelamentos.

### Status do agendamento

```text
Pré-agendado
Aguardando confirmação
Confirmado
Check-in realizado
Aguardando atendimento
Em atendimento
Finalizado
Cancelado
Não compareceu
Reagendado
```

---

## 6.8 Prontuário Eletrônico

O prontuário deve organizar informações clínicas de forma longitudinal, estruturada e auditável.

### Funcionalidades

- Histórico clínico.
- Anamnese.
- Evoluções.
- Antecedentes.
- Alergias.
- Medicamentos em uso.
- Diagnósticos.
- Hipóteses diagnósticas.
- Problemas ativos.
- Exames.
- Resultados.
- Imagens.
- Fotografias clínicas.
- Anexos.
- Prescrições.
- Solicitações de exames.
- Atestados.
- Relatórios.
- Laudos.
- Modelos por especialidade.
- Assinatura digital.
- Comparação de evolução.
- Alertas clínicos.
- Histórico de alterações.
- Exportação de documentos.

### Principais telas

- Prontuário do paciente.
- Resumo clínico.
- Timeline clínica.
- Formulário de anamnese.
- Registro de evolução.
- Central de exames.
- Central de documentos.
- Problemas ativos.
- Medicamentos e alergias.
- Histórico de prescrições.

### Estrutura da tela de consulta

**Painel esquerdo — Resumo clínico**

- Alergias.
- Condições ativas.
- Medicamentos.
- Últimos atendimentos.
- Exames recentes.
- Alertas.

**Área central — Registro da consulta**

- Motivo da consulta.
- Anamnese.
- Exame físico.
- Avaliação.
- Conduta.
- Plano de acompanhamento.

**Painel direito — Assistente clínico**

- Transcrição.
- Resumo.
- Sugestões.
- CID.
- TUSS.
- Prescrição.
- Exames.
- Documentos.
- Pendências.

---

## 6.9 Consulta Assistida por Inteligência Artificial

A consulta assistida deve funcionar como um modo de trabalho dentro do prontuário.

### Funcionalidades

- Gravação mediante consentimento.
- Transcrição em tempo real.
- Identificação de interlocutores.
- Resumo automático.
- Estruturação da evolução.
- Extração de sintomas.
- Extração de antecedentes.
- Sugestão de perguntas.
- Sugestão de hipóteses.
- Sugestão de CID.
- Sugestão de TUSS.
- Prescrição assistida.
- Solicitação de exames.
- Alertas de alergia.
- Alertas de interação medicamentosa.
- Geração de orientações.
- Geração de documentos.
- Registro do uso da IA.
- Revisão e confirmação médica.

### Principais telas

- Modo de consulta assistida.
- Painel de transcrição.
- Resumo clínico gerado.
- Sugestões da IA.
- Revisão da evolução.
- Codificação assistida.
- Editor de prescrição.
- Log da assistência de IA.

### Fluxo da consulta

```text
Iniciar consulta
→ Ativar transcrição
→ Registrar a conversa
→ Estruturar informações
→ Apresentar sugestões
→ Revisar evolução
→ Selecionar conduta
→ Gerar prescrição e documentos
→ Confirmar
→ Registrar no prontuário
```

Nenhuma sugestão clínica deve ser incorporada definitivamente ao prontuário sem revisão e confirmação do profissional responsável.

---

## 6.10 Prescrições e Documentos Médicos

### Funcionalidades

- Prescrição simples.
- Prescrição especial.
- Medicamentos favoritos.
- Posologias padronizadas.
- Templates.
- Solicitação de exames.
- Atestados.
- Declarações.
- Laudos.
- Relatórios.
- Encaminhamentos.
- Orientações ao paciente.
- Assinatura digital.
- Envio seguro.
- Validação do documento.
- Histórico de versões.
- Cancelamento e substituição.
- Registro de autoria.

### Principais telas

- Editor de prescrição.
- Biblioteca de medicamentos.
- Modelos pessoais.
- Gerador de documentos.
- Central de assinatura.
- Histórico de documentos.
- Página de validação.

### Estados de documento

```text
Rascunho
Gerado por IA
Em revisão
Revisado
Assinado
Enviado
Cancelado
Substituído
```

---

## 6.11 Procedimentos e Jornada Assistencial

Este módulo organiza tratamentos, cirurgias e procedimentos que envolvem múltiplas etapas.

### Funcionalidades

- Planejamento do procedimento.
- Etapas do tratamento.
- Checklists.
- Exames obrigatórios.
- Liberações.
- Termos de consentimento.
- Reserva de sala.
- Reserva de equipe.
- Reserva de equipamentos.
- Materiais previstos.
- Kits de materiais.
- Registro de lote e validade.
- Fotografias clínicas.
- Registro do procedimento.
- Consumo real de materiais.
- Orientações pós-procedimento.
- Retornos programados.
- Intercorrências.
- Evolução clínica.
- Comparação de resultados.

### Principais telas

- Plano assistencial.
- Timeline do tratamento.
- Checklist operacional.
- Pendências do paciente.
- Agenda do procedimento.
- Kit de materiais.
- Registro do procedimento.
- Plano de alta.
- Retornos.
- Intercorrências.

### Exemplo de jornada

```text
Avaliação
→ Exames
→ Liberação
→ Consentimentos
→ Pagamento
→ Procedimento
→ Retorno em 24 horas
→ Retorno em 7 dias
→ Retorno em 30 dias
→ Pesquisa de satisfação
```

---

## 6.12 Pós-Atendimento e Sucesso do Paciente

O módulo de pós-atendimento acompanha o paciente após consultas, procedimentos ou tratamentos.

### Funcionalidades

- Jornadas automatizadas.
- Check-ins pós-procedimento.
- Questionários de evolução.
- Alertas por respostas críticas.
- Controle de retornos.
- NPS.
- Pesquisas de satisfação.
- Solicitação de avaliação pública.
- Reativação de pacientes.
- Campanhas de relacionamento.
- Campanhas de aniversário.
- Programas de indicação.
- Registro de intercorrências.
- Segmentação para remarketing.
- Conteúdos personalizados.
- Monitoramento de abandono de tratamento.

### Principais telas

- Construtor de jornadas.
- Pacientes em acompanhamento.
- Check-ins enviados.
- Respostas críticas.
- Dashboard de satisfação.
- Campanhas de reativação.
- Indicações.
- Ocorrências.
- Segmentos de remarketing.

### Exemplo de automação

```text
Procedimento concluído
→ Enviar orientações
→ Perguntar evolução após 24 horas
→ Alertar a equipe em caso de resposta crítica
→ Solicitar foto após 7 dias
→ Confirmar retorno
→ Aplicar pesquisa de satisfação
→ Solicitar avaliação pública
→ Criar campanha de acompanhamento futuro
```

---

## 6.13 Teleconsulta

### Funcionalidades

- Sala de vídeo.
- Sala de espera.
- Teste de câmera e microfone.
- Consentimento.
- Link seguro.
- Chat.
- Envio de arquivos.
- Compartilhamento de tela.
- Transcrição.
- Consulta assistida por IA.
- Prescrição.
- Solicitação de exames.
- Assinatura de documentos.
- Registro no prontuário.
- Controle de presença.
- Histórico da sessão.

### Principais telas

- Pré-consulta.
- Sala de espera.
- Teleconsulta.
- Painel de transcrição.
- Documentos da consulta.
- Encerramento.
- Histórico de teleconsultas.

---

## 6.14 Portal e Aplicativo do Paciente

O portal deve oferecer autonomia ao paciente e reduzir demandas operacionais da equipe.

### Funcionalidades

- Login seguro.
- Próximos agendamentos.
- Agendamento online.
- Reagendamento.
- Cancelamento.
- Check-in.
- Formulários pré-consulta.
- Histórico de atendimentos.
- Prescrições.
- Documentos.
- Resultados de exames.
- Plano de tratamento.
- Contratos.
- Consentimentos.
- Parcelas e pagamentos.
- Orientações.
- Teleconsulta.
- Tickets.
- Assistente de IA.
- Preferências de comunicação.
- Consentimentos de privacidade.
- Notificações.

### Principais telas

- Home do paciente.
- Agenda.
- Check-in.
- Minha saúde.
- Tratamentos.
- Documentos.
- Exames.
- Financeiro.
- Teleconsulta.
- Central de ajuda.
- Chat.
- Privacidade.

O assistente do paciente deve responder com base em conteúdo institucional aprovado, orientações registradas, documentos autorizados e informações administrativas. Questões clínicas sensíveis devem ser encaminhadas ao profissional responsável.

---

## 6.15 Tickets e Atendimento ao Paciente

### Funcionalidades

- Abertura de tickets.
- Classificação automática.
- Categorias.
- Prioridade.
- SLA.
- Filas por equipe.
- Encaminhamento.
- Respostas assistidas por IA.
- Vinculação ao paciente.
- Vinculação ao prontuário.
- Escalonamento clínico.
- Histórico.
- Avaliação do atendimento.

### Principais telas

- Caixa de tickets.
- Novo ticket.
- Detalhes do ticket.
- Filas.
- Editor de resposta.
- Escalonamento.
- Relatório de SLA.

### Categorias sugeridas

- Dúvida administrativa.
- Agendamento.
- Financeiro.
- Orientação pós-procedimento.
- Solicitação de documento.
- Sintoma ou intercorrência.
- Reclamação.
- Privacidade e dados pessoais.

---

## 6.16 Financeiro

### Funcionalidades

- Contas a receber.
- Contas a pagar.
- Parcelamentos.
- Recebimentos por contrato.
- Extrato do paciente.
- Pix.
- Cartão.
- Boleto.
- Dinheiro.
- Links de pagamento.
- Conciliação bancária.
- Fluxo de caixa.
- Regime de caixa.
- Regime de competência.
- Centros de custo.
- Plano de contas.
- Categorias.
- DRE.
- Inadimplência.
- Cobranças.
- Reembolsos.
- Estornos.
- Créditos.
- Comissões.
- Repasses.
- Fechamento de caixa.
- Notas fiscais.
- Indicadores financeiros.

### Principais telas

- Dashboard financeiro.
- Contas a receber.
- Contas a pagar.
- Extrato do paciente.
- Baixa de pagamento.
- Conciliação.
- Fluxo de caixa.
- DRE.
- Inadimplência.
- Repasse profissional.
- Fechamento de caixa.
- Notas fiscais.

### Integração com os processos

```text
Consulta particular
→ Conta a receber

Contrato
→ Parcelas

Procedimento
→ Receita e consumo de estoque

Convênio
→ Conta a receber da operadora

Compra
→ Conta a pagar e entrada no estoque

Cancelamento
→ Estorno, devolução ou crédito
```

---

## 6.17 Faturamento, Convênios, TISS e SUS

Este módulo deve ser separado do financeiro, embora integrado a ele.

### Funcionalidades

- Cadastro de convênios.
- Cadastro de planos.
- Elegibilidade.
- Autorizações.
- Guias.
- Procedimentos executados.
- Formação de lotes.
- Envio.
- Protocolos.
- Retornos.
- Glosas.
- Recursos de glosa.
- Tabelas TUSS.
- Regras de cobrança.
- Contratos com operadoras.
- Repasse ao profissional.
- Produção SUS.
- Pendências de documentação.
- Autorizações a vencer.
- Procedimentos não faturados.
- Valores apresentados.
- Valores glosados.
- Valores recebidos.
- Rentabilidade por operadora.
- Rentabilidade por procedimento.

### Principais telas

- Operadoras.
- Planos.
- Elegibilidade.
- Central de autorizações.
- Editor de guias.
- Lotes.
- Transmissões.
- Processamento de retornos.
- Central de glosas.
- Contestação.
- Tabelas TUSS.
- Produção SUS.
- Dashboard de convênios.

O motor de faturamento deve ser concebido como componente versionável, preparado para atualização de padrões, tabelas, terminologias e regras de comunicação.

---

## 6.18 Estoque, Materiais e Compras

### Funcionalidades

- Medicamentos.
- Insumos.
- Materiais.
- Lotes.
- Validade.
- Localização física.
- Almoxarifados.
- Entradas.
- Saídas.
- Consumo por procedimento.
- Kits de procedimentos.
- Estoque mínimo.
- Alertas.
- Inventário.
- Solicitações de compra.
- Cotações.
- Pedidos.
- Fornecedores.
- Rastreabilidade.
- Perdas.
- Descartes.
- Ajustes.
- Reserva de materiais.
- Baixa automática.

### Principais telas

- Catálogo de itens.
- Estoque por lote.
- Movimentações.
- Kits.
- Alertas.
- Inventário.
- Requisições.
- Cotações.
- Pedidos.
- Fornecedores.
- Histórico do item.

---

## 6.19 Equipe, Tarefas e Comunicação Interna

### Funcionalidades

- Chat individual.
- Chat por equipe.
- Canais.
- Conversas vinculadas a registros.
- Tarefas.
- Kanban.
- Comentários.
- Menções.
- Notificações.
- Escalas.
- Protocolos internos.
- Histórico auditável.
- Aprovações.
- Passagem de responsabilidade.
- Resumos operacionais.
- Indicadores de produtividade.

### Principais telas

- Chat interno.
- Canais.
- Conversa contextual.
- Lista de tarefas.
- Kanban.
- Agenda da equipe.
- Central de aprovações.
- Biblioteca de protocolos.
- Histórico de comunicação.

As conversas podem ser vinculadas a:

```text
Paciente
Negociação
Consulta
Procedimento
Ticket
Conta financeira
Autorização de convênio
Compra
```

---

## 6.20 Analytics e Inteligência de Gestão

A plataforma deve oferecer dashboards diferentes conforme a finalidade.

### Dashboard executivo

- Receita.
- Resultado.
- Fluxo de caixa.
- Quantidade de pacientes.
- Consultas.
- Procedimentos.
- Ticket médio.
- Conversão comercial.
- Ocupação da agenda.
- Satisfação.
- Inadimplência.

### Dashboard comercial

- Leads por origem.
- Tempo da primeira resposta.
- Taxa de agendamento.
- Comparecimento.
- Conversão após consulta.
- Orçamentos enviados.
- Taxa de fechamento.
- Motivos de perda.
- Receita por campanha.
- Desempenho por atendente.
- Forecast.

### Dashboard clínico-operacional

- Consultas por profissional.
- Tempo médio de atendimento.
- Atrasos.
- Retornos.
- Procedimentos.
- Intercorrências.
- Pendências de prontuário.
- Pacientes em acompanhamento.
- Ocupação de salas.
- Uso de equipamentos.

### Dashboard financeiro

- Receita prevista e realizada.
- Contas a receber.
- Inadimplência.
- Contas a pagar.
- Fluxo de caixa.
- DRE.
- Receita por profissional.
- Receita por procedimento.
- Margem por procedimento.
- Receita particular e por convênio.

### Dashboard de relacionamento

- NPS.
- Reclamações.
- Tempo de resolução.
- Avaliações públicas.
- Pacientes reativados.
- Indicações.
- Recorrência.
- Abandono de tratamento.
- Desempenho das jornadas.

---

# 7. Assistente de Inteligência Artificial Transversal

A inteligência artificial deve estar disponível em toda a plataforma como um copiloto contextual.

## 7.1 Padrão de funcionamento

```text
Perguntar
→ Sugerir
→ Gerar rascunho
→ Revisar
→ Confirmar
→ Executar
→ Registrar no log
```

## 7.2 Aplicações por módulo

| Contexto | Aplicações |
|---|---|
| Caixa de entrada | Resumir conversas e sugerir respostas |
| CRM | Identificar próximas ações e risco de perda |
| Marketing | Analisar campanhas e sugerir segmentos |
| Agenda | Encontrar horários e sugerir encaixes |
| Consulta | Transcrever e estruturar a evolução |
| Prontuário | Localizar informações no histórico |
| Prescrição | Preparar rascunhos para revisão |
| Comercial | Criar orçamentos e follow-ups |
| Financeiro | Explicar variações e inadimplência |
| TISS | Identificar inconsistências |
| Estoque | Prever falta de materiais |
| Gestão | Responder perguntas sobre indicadores |
| Portal | Responder dúvidas administrativas |
| Tickets | Classificar, priorizar e sugerir respostas |

## 7.3 Estados de interação da IA

A interface deve diferenciar claramente:

- Informação consultada.
- Sugestão.
- Rascunho.
- Recomendação.
- Decisão humana.
- Ação executada.
- Registro auditável.

---

# 8. Entidades Centrais

Mesmo em uma aplicação frontend com dados mockados, a estrutura deve simular objetos coerentes.

## 8.1 Pessoas

```text
Pessoa
├── Lead
├── Paciente
├── Responsável
├── Contato relacionado
└── Profissional
```

## 8.2 Jornada

```text
Jornada
├── Conversa
├── Oportunidade
├── Agendamento
├── Consulta
├── Plano de tratamento
├── Orçamento
├── Contrato
├── Procedimento
├── Pós-atendimento
└── Ticket
```

## 8.3 Clínico

```text
Clínico
├── Prontuário
├── Evolução
├── Diagnóstico
├── Prescrição
├── Exame
├── Documento
├── Consentimento
└── Intercorrência
```

## 8.4 Financeiro

```text
Financeiro
├── Conta a receber
├── Conta a pagar
├── Pagamento
├── Nota fiscal
├── Repasse
├── Guia
├── Lote
└── Glosa
```

## 8.5 Operacional

```text
Operacional
├── Unidade
├── Sala
├── Equipamento
├── Produto
├── Lote
├── Tarefa
├── Mensagem
└── Checklist
```

A Timeline do Paciente deve reunir eventos de múltiplos módulos, respeitando as permissões de cada perfil.

---

# 9. Governança, Segurança e Auditoria

A plataforma deve representar desde o protótipo os principais conceitos de segurança e governança.

### Funcionalidades

- Perfis e permissões granulares.
- Separação entre dados clínicos e comerciais.
- Autenticação multifator.
- Auditoria de acesso.
- Auditoria de alterações.
- Auditoria de exportações.
- Consentimentos.
- Preferências de comunicação.
- Registro de finalidade.
- Versionamento de documentos.
- Assinatura digital.
- Gestão de incidentes.
- Exportação de prontuário.
- Retenção de dados.
- Controle de acesso emergencial.
- Logs de ações da IA.
- Histórico de integrações.
- Sessões e dispositivos.
- Bloqueio de acesso.

### Principais telas

- Usuários e perfis.
- Matriz de permissões.
- Consentimentos.
- Logs de acesso.
- Logs de alterações.
- Central de auditoria.
- Incidentes.
- Sessões ativas.
- Configurações de segurança.

---

# 10. Recursos Físicos e Qualidade

## 10.1 Recursos físicos

- Unidades.
- Salas.
- Equipamentos.
- Disponibilidade.
- Manutenção.
- Calibração.
- Bloqueios.
- Checklists de abertura.
- Checklists de fechamento.

## 10.2 Gestão profissional

- Produção.
- Comissões.
- Repasses.
- Escalas.
- Metas.
- Credenciamentos.
- Certificações.
- Documentos profissionais.

## 10.3 Qualidade e risco

- Intercorrências.
- Reclamações.
- Eventos adversos.
- Planos de ação.
- Pendências clínicas.
- Protocolos.
- Não conformidades.
- Indicadores de qualidade.

---

# 11. Interoperabilidade e Integrações Futuras

A plataforma deve estar preparada para integração com:

- WhatsApp.
- Meta.
- Google.
- Sites e landing pages.
- E-mail.
- Plataformas de assinatura.
- Bancos.
- Meios de pagamento.
- Emissão de notas fiscais.
- Operadoras de saúde.
- Sistemas TISS.
- Sistemas públicos.
- Laboratórios.
- Sistemas de imagem.
- Farmácias.
- Prescrição eletrônica.
- Sistemas contábeis.
- Calendários externos.
- Plataformas de telemedicina.
- Padrões de interoperabilidade clínica.
- Repositórios nacionais de dados em saúde.

O protótipo deve representar visualmente integrações, estados de sincronização, falhas, permissões e históricos, mesmo sem realizar conexões reais.

---

# 12. Jornadas Prioritárias para Demonstração

O frontend demonstrativo deve priorizar três histórias completas.

## 12.1 Jornada 1 — Lead até Fechamento

```text
Lead chega por campanha
→ IA inicia atendimento no WhatsApp
→ Colaborador assume a conversa
→ Lead é qualificado
→ Consulta é agendada
→ Lembrete é enviado
→ Paciente comparece
→ Médico cria plano de tratamento
→ Comercial envia orçamento
→ Follow-up é realizado
→ Paciente aceita
→ Contrato é assinado
→ Parcelas e procedimentos são gerados
```

## 12.2 Jornada 2 — Consulta Assistida por IA

```text
Paciente faz check-in
→ Médico abre o prontuário
→ Consulta o resumo clínico
→ Ativa a transcrição
→ IA organiza o conteúdo
→ Médico revisa a evolução
→ Seleciona CID e TUSS sugeridos
→ Gera prescrição e exames
→ Assina documentos
→ Agenda o retorno
→ Paciente recebe os documentos no portal
```

## 12.3 Jornada 3 — Procedimento e Pós-Atendimento

```text
Equipe verifica checklist
→ Confirma documentos e pagamento
→ Reserva materiais
→ Registra procedimento
→ Estoque é baixado
→ Orientações são enviadas
→ Paciente recebe check-in após 24 horas
→ Resposta crítica gera alerta
→ Retorno é realizado
→ NPS é coletado
→ Paciente entra em campanha de relacionamento
```

---

# 13. Escopo Inicial do Frontend Mockado

## 13.1 Telas prioritárias

1. Login.
2. Seleção de unidade.
3. Dashboard geral.
4. Caixa de entrada omnichannel.
5. Perfil lateral do lead.
6. Kanban comercial.
7. Detalhes da negociação.
8. Editor de orçamento.
9. Agenda médica.
10. Recepção e fila do dia.
11. Paciente 360°.
12. Prontuário eletrônico.
13. Consulta assistida por IA.
14. Editor de prescrição.
15. Plano de tratamento.
16. Procedimentos.
17. Jornada de pós-atendimento.
18. Portal do paciente.
19. Dashboard comercial.
20. Dashboard financeiro.

## 13.2 Telas complementares

- Contratos e assinatura.
- Contas a receber.
- Conciliação.
- TISS e glosas.
- Estoque.
- Tickets.
- Central de automações.
- Chat interno.
- Integrações.
- Perfis e permissões.
- Auditoria.

---

# 14. Recorte Recomendado para o Primeiro Protótipo

O primeiro protótipo deve concentrar-se no diferencial principal do produto:

```text
Caixa de entrada
→ CRM
→ Agenda
→ Paciente 360°
→ Consulta assistida
→ Plano e orçamento
→ Contrato
→ Pós-atendimento
```

Os módulos financeiro, faturamento, estoque e gestão devem aparecer no mapa de navegação e em telas conceituais, mas não precisam possuir fluxos completos na primeira demonstração.

---

# 15. Diretrizes de Interface

A plataforma deve transmitir a sensação de um sistema operacional de atendimento, e não de um ERP tradicional.

### Diretrizes

- Pesquisa global sempre disponível.
- Atalhos para ações frequentes.
- Ações importantes em até dois ou três cliques.
- Painel lateral contextual.
- Timeline como componente recorrente.
- Formulários progressivos.
- Poucos campos inicialmente visíveis.
- Atalhos de teclado.
- IA discreta e contextual.
- Estados claramente identificáveis.
- Diferenciação entre sugestão, rascunho e documento confirmado.
- Navegação adaptada ao perfil.
- Responsividade.
- Consistência visual.
- Acessibilidade.
- Feedback imediato das ações.
- Histórico visível.
- Filtros persistentes.
- Visões em lista, cards, timeline e Kanban.

### Estrutura visual sugerida

```text
Cabeçalho
├── Pesquisa global
├── Criar
├── Assistente de IA
├── Alertas
└── Usuário

Menu lateral
└── Módulos

Área central
└── Fluxo de trabalho atual

Painel lateral contextual
├── Paciente ou lead
├── Agendamento
├── Alertas
├── Pendências
└── Próximas ações
```

---

# 16. Componentes Reutilizáveis

O frontend deve possuir uma biblioteca de componentes consistentes.

### Componentes principais

- Card de paciente.
- Card de lead.
- Card de oportunidade.
- Timeline.
- Kanban.
- Tabela com filtros.
- Calendário.
- Painel lateral.
- Modal de ação rápida.
- Editor de mensagens.
- Chat.
- Formulário dinâmico.
- Checklist.
- Indicador de status.
- Badge de prioridade.
- Alerta clínico.
- Alerta operacional.
- Bloco de assinatura.
- Visualizador de documento.
- Editor de orçamento.
- Editor de prescrição.
- Gráfico de indicadores.
- Assistente de IA.
- Log de auditoria.
- Seletor de unidade.
- Seletor de profissional.
- Seletor de paciente.
- Campo de pesquisa global.

---

# 17. Dados Mockados Recomendados

O protótipo deve utilizar dados fictícios coerentes e interligados.

### Cenários sugeridos

- Lead proveniente de campanha do Instagram.
- Lead proveniente do Google.
- Paciente indicado por outro paciente.
- Consulta particular.
- Consulta por convênio.
- Procedimento com múltiplas etapas.
- Orçamento aguardando resposta.
- Contrato pendente de assinatura.
- Paciente inadimplente.
- Paciente em pós-procedimento.
- Ticket com possível intercorrência.
- Guia com glosa.
- Material com estoque baixo.
- Profissional com agenda próxima da capacidade.

### Características dos dados

- Nomes fictícios.
- Documentos inválidos ou mascarados.
- Endereços genéricos.
- Informações clínicas inventadas.
- Histórico suficiente para demonstrar timelines.
- Status variados.
- Valores coerentes.
- Datas distribuídas.
- Diferentes canais de origem.
- Diferentes perfis de usuários.

---

# 18. Perfis de Usuário

## 18.1 Gestor

- Acesso a indicadores.
- Configurações.
- Financeiro.
- Comercial.
- Auditoria.
- Equipe.
- Operações.

## 18.2 Médico

- Agenda.
- Pacientes.
- Prontuário.
- Consulta.
- Prescrição.
- Procedimentos.
- Teleconsulta.
- Alertas clínicos.

## 18.3 Recepção

- Caixa de entrada.
- Agenda.
- Recepção.
- Cadastro.
- Documentos administrativos.
- Tickets.
- Cobranças autorizadas.

## 18.4 Comercial

- Leads.
- CRM.
- Orçamentos.
- Negociações.
- Contratos.
- Follow-ups.
- Indicadores comerciais.

## 18.5 Financeiro

- Contas.
- Recebimentos.
- Pagamentos.
- Conciliação.
- DRE.
- Notas.
- Repasses.

## 18.6 Faturamento

- Convênios.
- Autorizações.
- Guias.
- Lotes.
- Glosas.
- Repasses.

## 18.7 Estoque e Operações

- Materiais.
- Movimentações.
- Inventário.
- Compras.
- Salas.
- Equipamentos.
- Checklists.

---

# 19. Posicionamento do Produto

A plataforma pode ser posicionada como:

> Uma plataforma integrada de gestão da jornada do paciente, unindo crescimento, cuidado, relacionamento e gestão em um único ambiente assistido por inteligência artificial.

## Quatro núcleos do produto

```text
1. CRESCIMENTO
Marketing + Omnichannel + CRM + Comercial

2. CUIDADO
Agenda + Prontuário + Consulta + Procedimentos + Telemedicina

3. RELACIONAMENTO
Portal + Pós-atendimento + Satisfação + Remarketing + Tickets

4. GESTÃO
Financeiro + Faturamento + Estoque + Equipe + Analytics
```

## Camadas transversais

```text
Inteligência artificial
Integrações
Automação de processos
Segurança e privacidade
Auditoria
Interoperabilidade
```

---

# 20. Síntese

O produto deve ser estruturado em torno de uma única jornada integrada.

```text
Marketing
→ Atendimento
→ CRM
→ Agendamento
→ Consulta
→ Plano de tratamento
→ Orçamento
→ Contrato
→ Financeiro
→ Procedimento
→ Pós-atendimento
→ Satisfação
→ Recorrência
```

O primeiro protótipo deve demonstrar principalmente a conexão entre aquisição, atendimento, CRM, agenda, prontuário, consulta assistida, negociação e relacionamento posterior.

O valor percebido não estará apenas na quantidade de módulos, mas na capacidade de transformar eventos de uma área em ações automáticas e contextualizadas nas demais áreas da plataforma.
