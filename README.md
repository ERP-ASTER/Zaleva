# Zaleva — Protótipo "Jornada 360° do Paciente"

> **Cuidado e resultado avançam juntos.**
> Frontend demonstrativo com dados mockados (Clínica M. Luther, fictícia). Sem backend, sem persistência — recarregar a página reseta o estado.

## Rodando

```bash
npm install
npm run dev
```

Abra http://localhost:5173 — **qualquer credencial funciona** no login. Escolha unidade e papel (a Home muda por papel; troque a qualquer momento pelo avatar no topo).

O menu **Modo demo** (rodapé da sidebar) tem atalhos para as 3 jornadas e o reset dos dados.

---

## As 3 jornadas roteirizadas

### Jornada 1 — Lead até fechamento (Mariana Duarte)

1. **Caixa de entrada** → conversa da *Fernanda Sales* mostra a **IA atendendo ao vivo** → clique **"Assumir conversa"** (handoff IA → humano).
2. Na conversa da **Mariana**, use **"Sugerir resposta com IA"** → Aprovar (a "paciente" responde sozinha depois de alguns segundos).
3. **CRM comercial** → Mariana está em *Avaliação agendada*; arraste cards entre colunas (os totais e o dashboard mudam juntos).
4. **Agenda** → avaliação da Mariana hoje às 10h → na *Fila do dia*, faça **check-in → iniciar atendimento**.
5. No card da agenda, **Abrir consulta** → Jornada 2 (consulta assistida).
6. Depois da consulta, **"Encaminhar ao comercial"** abre o **orçamento** pré-montado → **Enviar por WhatsApp** (aparece na conversa dela) → **Marcar como aceito**.
7. 💥 **Clímax:** modal *"O que foi criado automaticamente"* — contrato, parcelas, cirurgia agendada, checklist e jornada de pós, com links. Termine em **Dashboards** (a receita da Mariana já está no funil fechado).

### Jornada 2 — Consulta assistida por IA

1. **Agenda** → consulta da Mariana → **Abrir consulta**.
2. **Iniciar consulta assistida** → banner de **consentimento** → transcrição aparece progressivamente (médico × paciente).
3. **Estruturar evolução com IA** → rascunho em blocos lilás (Motivo/Anamnese/Exame/Avaliação/Conduta) → **edite um campo** → selecione os **CIDs sugeridos** → **Revisar e aprovar**.
4. Evolução gravada com selo *"Elaborada com apoio de IA — revisada e aprovada pelo médico"* (CFM 2.454/2026) + log auditável (ícone de histórico no topo).
5. **Gerar pedido de exames** (rascunho da IA) → **Assinar com certificado digital** → abra o **Portal do paciente**: o documento está lá, na aba Docs.

### Jornada 3 — Pós-operatório crítico (Carla Menezes)

1. Papel **Médico** → a Home mostra o **alerta vermelho**: Carla, D+1 de abdominoplastia, **dor 8/10** no check-in automático (veja também o sino 🔔).
2. **Pós-atendimento** → card vermelho da Carla → **"Ligar / antecipar retorno"** → escolha a ação.
3. O alerta é resolvido: sino limpo, mensagem enviada no WhatsApp da Carla, evento na **timeline do Paciente 360°** dela.
4. Na aba **Construtor de jornada**, mostre o fluxo automatizado (check-in 24h → alerta se crítico → foto D+7 → retorno → NPS → avaliação pública).

---

## Outros pontos fortes para a demo

- **Paciente 360° do Ricardo Tavares** (`Pacientes → Ricardo`): 18 meses de relacionamento em uma timeline só — blefaro, toxina semestral, indicações, LTV.
- **Permissões (LGPD):** troque para o papel **Comercial** e abra qualquer Paciente 360° — a aba *Prontuário* aparece **bloqueada com cadeado**.
- **Busca global:** `Ctrl/⌘ + K` busca pacientes, negociações e telas.
- **Portal do paciente** (moldura de celular): check-in digital, parcelas com Pix simulado e assistente que **recusa perguntas clínicas** e encaminha à equipe (teste "Estou com dor, é normal?").
- **Teleconsulta:** sala de espera com teste de dispositivos → chamada com transcrição da IA ao vivo → encerramento registra no prontuário.
- **Documentos durante a consulta:** atalhos de **Prescrição** e **Atestado** disponíveis a qualquer momento da consulta e da teleconsulta (painel do assistente) — o rascunho abre no papel timbrado da Clínica M. Luther exatamente como o paciente receberá; assinar envia ao portal.
- **Arquivo de fotos:** aba **Fotos** no Paciente 360° (pré-op, marcação, evolução) — bloqueada para o papel Comercial, como o Prontuário.
- **App do médico** (moldura de celular): agenda do dia, indicadores, notificações push, a **câmera clínica** — capture uma foto e veja-a aparecer na hora na aba Fotos do paciente selecionado — e o **chat interno da equipe**, com conversas e canais vinculados a pacientes e registros (toque no clipe para abrir o registro).

- **Marketing & Aquisição** (menu ativado): visão geral com CPL/CAC/ROAS e funil de atribuição, campanhas com pausar/ativar e detalhe (criativo, UTM, leads reais do CRM), origens e landing pages com toggle de agendamento online, **Site do consultório** (status, visitas, edição e publicação simulada de páginas, blog) e **Estúdio de conteúdo IA** — a IA escreve, você aprova, a automação publica no blog/Instagram/Facebook com selo de revisão do responsável técnico.

## Stack

React 18 · Vite · TypeScript · Tailwind CSS · Zustand · React Router · Recharts · date-fns (pt-BR) · lucide-react. Sem chamadas de rede; toda a "IA" é simulada com respostas pré-escritas e delays.
