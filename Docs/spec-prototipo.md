# Spec — Protótipo "Jornada 360° do Paciente"

Frontend puro com dados mockados para demonstração a médicos (cirurgião plástico e colegas de outras especialidades). Sem backend, sem autenticação real, sem persistência em servidor. O objetivo é vender a **tese do produto**: cada evento avança a jornada do paciente — marketing → conversa → CRM → agenda → consulta → orçamento → contrato → procedimento → pós-atendimento → recorrência — tudo conectado à gestão.

**Dor a demonstrar:** os sistemas atuais tratam o paciente como "mero agendamento". Aqui, o mesmo registro evolui de lead a paciente sem perder histórico comercial, clínico e financeiro.

---

## 1. Stack e arquitetura

- **React 18 + Vite + TypeScript + Tailwind CSS**
- **react-router-dom** para rotas
- **Zustand** para estado global em memória (as interações simuladas mutam esse estado; refresh reseta — aceitável)
- **lucide-react** para ícones, **recharts** para gráficos, **date-fns** (locale pt-BR) para datas
- Dados mockados em `/src/data/*.ts`, tipados, importados pelas stores
- Sem chamadas de rede. "IA" é simulada com respostas pré-escritas e delays artificiais (500–1500ms com indicador de digitação/processamento)
- Idioma: **100% pt-BR**, incluindo datas, moeda (R$) e nomes
- Desktop-first (1280px+). Não investir em mobile, exceto o Portal do Paciente, que deve parecer um app mobile (renderizar em moldura de celular centralizada)

### Estrutura sugerida

```text
src/
├── data/            # mocks tipados (pacientes, conversas, negociações, agenda, financeiro...)
├── stores/          # zustand: useJourneyStore, useInboxStore, useAgendaStore...
├── components/
│   ├── layout/      # AppShell, Sidebar, Topbar, ContextPanel
│   ├── ui/          # Badge, Card, Timeline, StatusPill, Avatar, KanbanCard, AIChip...
│   └── modules/     # componentes por tela
├── pages/           # uma pasta por rota
└── lib/             # formatadores, helpers de simulação de IA
```

---

## 2. Design system

O padrão visual deve **encantar um cirurgião plástico**: estética premium, limpa, sofisticada — sensação de "sistema operacional de atendimento", não de ERP hospitalar. Porém **specialty-agnostic**: nada no design (só no conteúdo) deve amarrar à plástica.

- **Paleta:** neutros quentes (fundo #FAFAF8 / superfícies brancas), texto em cinza-grafite profundo, **um acento único elegante** (sugestão: verde-esmeralda profundo `#0F6B5C` ou azul-petróleo `#155E63`) + dourado suave apenas para highlights de valor/receita. Evitar azul-hospital genérico.
- **Tipografia:** Inter (UI) + uma serifada elegante (ex.: Fraunces ou Lora) apenas em títulos de página e no Portal do Paciente.
- **Componentes recorrentes obrigatórios:**
  - **Timeline vertical** — componente central do produto, usado no Paciente 360°, negociação e pós-atendimento. Eventos com ícone por tipo (conversa, agendamento, consulta, orçamento, pagamento, alerta).
  - **StatusPill** — estados coloridos consistentes em todo o app.
  - **ContextPanel** — painel lateral direito deslizante com resumo do paciente/lead, acessível de qualquer tela sem navegar.
  - **AIChip / AISuggestion** — todo conteúdo gerado por IA tem tratamento visual distinto (borda tracejada ou fundo lilás suave + ícone sparkle + rótulo "Sugestão da IA") e botões **Aprovar / Editar / Descartar**. Nada de IA entra no registro sem aprovação explícita — isso é tese de produto e argumento regulatório (CFM 2.454/2026).
  - Diferenciação visual clara entre **Rascunho → Revisado → Assinado** em documentos.
- **Layout global:** sidebar escura estreita com módulos agrupados (Relacionamento / Atendimento / Gestão), topbar com busca global (⌘K, funcional sobre os mocks), botão "+ Criar", sino de alertas com badge, avatar com **troca de papel** (Médico / Recepção / Comercial / Gestor) que altera a Home.
- Microinterações: transições suaves, skeletons ao "carregar", toasts de confirmação após ações.

---

## 3. Modelo de dados mockados

Clínica fictícia: **"Clínica Aurí"** — cirurgia plástica e estética, 2 unidades (Jardins e Moema), 3 cirurgiões + 1 dermatologista (para sinalizar multi-especialidade), 2 recepcionistas, 1 comercial, 1 gestora.

Volume mínimo para parecer vivo:

- **~35 contatos** (mix de leads e pacientes) com nomes brasileiros fictícios variados, fotos via avatares gerados (iniciais coloridas — não usar fotos reais), origem (Instagram Ads, Google, Indicação, Site), tags.
- **Procedimentos com valores realistas:** Rinoplastia (R$ 28–38 mil), Mamoplastia de aumento (R$ 25–32 mil), Lipo HD (R$ 30–45 mil), Abdominoplastia (R$ 28–40 mil), Blefaroplastia (R$ 12–18 mil), Toxina botulínica (R$ 1,8–2,6 mil), Preenchimento (R$ 2–4 mil). Consulta de avaliação R$ 600–800.
- **~15 conversas** na caixa de entrada (WhatsApp/Instagram/Site) em estágios variados, incluindo 2 em atendimento pela IA.
- **~12 negociações** distribuídas no funil, com valores, probabilidade e próxima ação.
- **Agenda da semana atual** (~40 eventos: avaliações, retornos, procedimentos, teleconsultas) — gerar datas relativas a `new Date()` para a demo nunca parecer velha.
- **6–8 pacientes em pós-operatório** com jornadas em andamento, sendo **1 com resposta crítica** (dor fora do esperado) gerando alerta.
- Histórico financeiro de ~6 meses para os dashboards (receita, funil, origem de leads, inadimplência leve).

### Personas-chave da demo (dados ricos, consistentes entre todas as telas)

1. **Mariana Duarte, 34** — lead do Instagram interessada em rinoplastia. Percorre a Jornada 1 inteira: conversa → qualificação → avaliação agendada → consulta → orçamento → fechamento.
2. **Carla Menezes, 41** — paciente no D+1 de abdominoplastia. Responde check-in com dor 8/10 → alerta crítico → equipe age. Jornada 3.
3. **Ricardo Tavares, 52** — paciente recorrente (blefaro + toxina), timeline longa de 18 meses, demonstra recorrência e LTV no Paciente 360°.

Entidades mínimas: `Contact` (lead|paciente, com origem/campanha), `Conversation`+`Message`, `Deal` (funil, itens, valor, probabilidade), `Appointment` (status: pré-agendado → confirmado → check-in → em atendimento → finalizado / no-show), `Encounter` (consulta com anamnese/evolução), `Quote` (itens, versões, status), `Contract`, `Procedure`+`JourneyStep` (pós), `Payment`/`Installment`, `TimelineEvent` (agregador central — tudo vira evento na timeline do contato).

---

## 4. Telas (14)

### 4.1 Login + seleção de unidade
Tela elegante de marca (logo Aurí), login fake (qualquer valor entra), seleção de unidade e de papel. Define a Home.

### 4.2 Home — Central de Trabalho (por papel)
Cards adaptados ao papel ativo. **Médico:** próximo paciente, agenda do dia, pendências de prontuário, pós-ops em acompanhamento, alerta da Carla. **Comercial:** leads sem resposta, orçamentos a vencer, follow-ups do dia, meta do mês com progresso. **Recepção:** fila do dia, confirmações pendentes, aniversariantes. **Gestor:** mini-KPIs + atalhos aos dashboards. Trocar papel no avatar muda a tela ao vivo — momento forte da demo.

### 4.3 Caixa de Entrada Omnichannel
3 colunas: filas/filtros (canal, status, atendente, IA) | conversa (estilo WhatsApp, com áudios exibindo transcrição) | ContextPanel do contato (etapa do funil, próxima ação, botões: criar lead, agendar, transferir).
**Simulações:** responder mensagem (resposta automática do "paciente" após delay); conversa atendida por IA com botão **"Assumir conversa"** (handoff); chip de IA sugerindo resposta com base no contexto; classificação de intenção por tags.

### 4.4 CRM Comercial — Kanban
Funil: Novo lead → Em atendimento → Qualificado → Avaliação agendada → Avaliação realizada → Plano apresentado → Em negociação → Fechado / Perdido. Cards com foto, procedimento de interesse, valor, temperatura, dias parado (>7 dias em vermelho), próxima ação.
**Simulações:** drag & drop entre colunas atualiza o estado global (reflete no dashboard); clicar abre a negociação; filtros por responsável/procedimento/origem; totais por coluna no header.

### 4.5 Detalhe da Negociação
Cabeçalho com valor, probabilidade, responsável, origem (com atribuição: Campanha "Rino Verão" → Anúncio → Lead → Receita). Abas: Timeline, Conversas (embed da caixa de entrada), Orçamentos, Tarefas. Painel de próxima ação com follow-up agendado.
**Simulações:** registrar contato (entra na timeline), marcar como ganho/perdido com motivo, IA sugere mensagem de follow-up (Aprovar/Editar/Descartar).

### 4.6 Paciente 360° — tela mais importante do protótipo
Header: foto, idade, tags, origem, LTV, unidade, botões rápidos (mensagem, agendar, orçamento).
Abas: **Resumo** (cards: próximo agendamento, plano de tratamento ativo, saldo financeiro, última conversa, alertas) | **Timeline** (todos os eventos de todos os módulos, filtráveis por tipo — o coração da tese) | Conversas | Agendamentos | Prontuário | Orçamentos & Contratos | Financeiro | Pós-atendimento | Documentos.
Usar Ricardo Tavares para demonstrar: 18 meses de relacionamento contínuo em uma tela só.
**Permissões simuladas:** no papel Comercial, aba Prontuário aparece bloqueada com cadeado e tooltip explicando segregação clínica × comercial — argumento de LGPD na demo.

### 4.7 Agenda + Recepção
Visão semana/dia por profissional, com cores por tipo (avaliação, retorno, procedimento, teleconsulta) e camadas por sala. Painel lateral "Fila do dia" com status ao vivo.
**Simulações:** arrastar evento para reagendar; check-in na fila muda status (pré-agendado → confirmado → check-in → em atendimento → finalizado) com reflexo visual; criar agendamento pelo slot vazio; indicador de no-show.

### 4.8 Consulta Assistida por IA (dentro do prontuário)
Layout em 3 áreas: **esquerda** resumo clínico fixo (alergias, condições, medicamentos, últimas consultas) | **centro** evolução da consulta | **direita** assistente.
**Simulação-chave da demo:** botão "Iniciar consulta assistida" → banner de consentimento do paciente → transcrição aparece progressivamente (script pré-escrito da consulta da Mariana sobre rinoplastia) → IA estrutura em Motivo/Anamnese/Exame físico/Avaliação/Conduta como **rascunho** → médico revisa, edita um campo, **aprova** → evolução gravada com selo "Elaborada com apoio de IA — revisada e aprovada pelo médico" + entrada no log. Sugestões de CID ficam como chips aprováveis. Gerar prescrição e pedido de exames pré-preenchidos (rascunho → assinado com um clique simulando certificado digital).

### 4.9 Editor de Orçamento
Itens do catálogo com valores, pacotes (ex.: "Rino + Blefaro" com desconto), condições de parcelamento com simulador, validade, versões. Preview do documento com a marca da clínica.
**Simulações:** montar orçamento da Mariana, enviar por WhatsApp (aparece na conversa dela), e **"Marcar como aceito"** dispara a cascata: contrato criado + parcelas geradas + agendamento do procedimento + checklist pré-op + jornada de pós ativada — mostrar modal "O que foi criado automaticamente" com links. Esse é o clímax da Jornada 1.

### 4.10 Contratos & Assinatura
Lista de documentos com estados (rascunho/enviado/assinado), viewer do contrato, trilha de assinatura simulada (paciente assinou às 14h32 via link seguro), termos de consentimento vinculados ao procedimento.

### 4.11 Pós-atendimento & Jornadas
Duas visões: **construtor de jornada** (canvas read-only mostrando o fluxo: procedimento concluído → orientações → check-in 24h → alerta se crítico → foto D+7 → retorno D+30 → NPS → avaliação pública) e **pacientes em acompanhamento** (lista com dia do pós-op, último check-in, risco).
**Simulação-chave:** Carla responde check-in com dor 8/10 → card fica vermelho → alerta aparece no sino global e na Home do médico → botão "Ligar / Antecipar retorno" resolve o alerta e registra na timeline. Jornada 3.

### 4.12 Teleconsulta
Sala de vídeo simulada (grid com vídeo fake — avatar/imagem estática com indicador "ao vivo", controles de mic/câmera/tela), sala de espera com teste de dispositivos e consentimento, chat lateral, e o **mesmo assistente de IA da consulta presencial** embutido (transcrição + evolução em rascunho). Encerrar gera registro no prontuário. Deixar visível um teaser "Em breve: novas experiências de teleconsulta" (o módulo evoluirá com ideia disruptiva).

### 4.13 Portal do Paciente (moldura mobile)
Como a Mariana vê: próximos agendamentos, orientações pré/pós-op personalizadas, documentos e prescrições, parcelas com botão de pagamento (simulado), assistente que responde só dúvidas administrativas e orientações registradas pelo médico — se perguntarem sintoma, encaminha para a equipe (mostrar essa resposta na demo).

### 4.14 Dashboards (Comercial + Financeiro + Executivo em abas)
**Comercial:** leads por origem, tempo de primeira resposta, conversão por etapa do funil, receita por campanha (atribuição completa: campanha → receita), motivos de perda, ranking de atendentes. **Financeiro:** receita prevista × realizada, contas a receber, inadimplência, ticket médio, receita por profissional e por procedimento. **Executivo:** visão consolidada com NPS, ocupação de agenda e recorrência. Gráficos recharts com os 6 meses de mock — números devem ser **consistentes** com os dados das outras telas (as 12 negociações do kanban devem bater com o funil do dashboard).

---

## 5. Jornadas de demonstração

O protótipo deve suportar estas 3 narrativas de ponta a ponta sem becos sem saída (todo link/botão do caminho funciona):

1. **Lead → Fechamento (Mariana):** Caixa de entrada (IA atende → humano assume) → lead qualificado no CRM → avaliação agendada → check-in na recepção → consulta assistida por IA → orçamento enviado → aceito → cascata automática → dashboard reflete a receita.
2. **Consulta assistida (qualquer paciente da agenda):** agenda → prontuário → transcrição → rascunho IA → revisão → aprovação → prescrição assinada → paciente recebe no portal.
3. **Pós-op crítico (Carla):** jornada ativa → check-in D+1 com dor 8/10 → alerta global → médico age → resolução na timeline → NPS ao final.

Incluir um item de menu discreto **"Modo demo"** com atalhos que resetam o estado e pulam direto para o início de cada jornada.

---

## 6. Fora de escopo (não construir)

TISS, convênios, glosas e SUS (produto focado em clínica particular). Estoque/compras. Financeiro completo (contas a pagar, DRE, conciliação). Chat interno da equipe. Configurações reais, integrações reais, backend, autenticação real, i18n, mobile responsivo (exceto moldura do portal), testes automatizados. Nenhuma biblioteca de UI pesada (Material, Ant) — Tailwind puro + componentes próprios.

---

## 7. Critérios de qualidade

- As 3 jornadas completáveis sem erro no console e sem link morto no caminho.
- Dados consistentes entre telas (mesmo paciente = mesmos dados em qualquer módulo; totais do kanban = funil do dashboard).
- Toda saída de IA passa por Aprovar/Editar/Descartar e fica visualmente distinta antes e depois da aprovação.
- Troca de papel altera Home e permissões visíveis.
- Estética premium e coesa — esta demo precisa impressionar médicos acostumados a sistemas datados.
- `npm install && npm run dev` funcionando de primeira; README curto com as 3 jornadas roteirizadas para quem for apresentar.
