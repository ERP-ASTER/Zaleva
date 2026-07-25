# Módulos e telas

> 16 áreas navegáveis. Cada seção lista: rota · arquivos · o que a tela faz · simulações interativas.

## §1 Login (`/login` — `pages/Login.tsx`)
Painel de marca Zaleva + login fake (qualquer credencial) em 2 etapas: credenciais → seleção de unidade (Toledo/Eldorado) e papel (define a Home). Sessão persiste em `sessionStorage` (`useSessionStore` com `persist`).

## §2 Central de trabalho (`/` — `pages/Home.tsx`)
Home adaptada ao papel ativo (Médico/Recepção/Comercial/Gestor), com `AlertaCritico` compartilhado (Carla). Médico: próximo paciente + agenda do dia + pós-ops. Recepção: fila com ações de status + confirmações + aniversariantes. Comercial: meta com barra de progresso + follow-ups + conversas sem resposta. Gestor: KPIs + pontos de atenção + time. **Trocar papel no avatar muda a tela ao vivo.**

## §3 Caixa de entrada (`/inbox` — `pages/Inbox.tsx`)
3 colunas: filas/filtros (canal + status) · conversa estilo WhatsApp · painel do contato (etapa do funil, próxima ação, ações rápidas). Simulações: enviar mensagem → resposta automática do contato com "digitando..."; conversa da **Fernanda** atendida por IA ao vivo com botão **"Assumir conversa"** (handoff); "Sugerir resposta com IA" (`sugestoesIA` em `useInboxStore`); áudios com transcrição expansível; tags de intenção.

## §4 Marketing & Aquisição (`/marketing` — `pages/Marketing.tsx` · `useMarketingStore` · `data/marketing.ts`)
5 abas:
1. **Visão geral** — CPL/custo por agendamento/ROAS, funil de atribuição (mesma fonte `campanhas` de `billing.ts`), leads por canal (recharts), análise da IA.
2. **Campanhas** — tabela com pausar/ativar/duplicar; detalhe com criativo (gradiente + `LutherLogo`), UTM, mini-funil e leads reais do CRM.
3. **Origens & Landing pages** — conversão por canal derivada dos contatos; toggle de agendamento online; testar formulário.
4. **Site do consultório** — status/SSL/visitas (sparkline), páginas editáveis com **publicação simulada**, pré-visualização do site, feed de atualizações, blog alimentado pelo Estúdio.
5. **Estúdio de conteúdo IA** — pipeline Ideia → Rascunho IA → Em revisão → Agendado → Publicado; fluxo "Criar conteúdo com IA" (temas justificados → rascunho → Aprovar/Editar/Descartar → canais Blog/Instagram/Facebook → **automação publica em ~4s** com toast + notificação + selo de revisão do responsável técnico).

## §5 CRM comercial (`/crm` + `/crm/:dealId` — `Crm.tsx` · `DealDetail.tsx`)
Kanban de 9 etapas com **drag & drop** (HTML5) que atualiza o estado global (reflete nos dashboards), totais por coluna, indicador "dias parado" (>7 em vermelho), filtros. Detalhe: cadeia de atribuição visual, abas Timeline/Atividades/Conversas/Orçamentos, registrar contato, ganho/perdido com motivo, follow-up sugerido pela IA enviável ao WhatsApp.

## §6 Pacientes (`/pacientes` + `/pacientes/:id` — `Patients.tsx` · `Patient360.tsx`)
Lista com busca/filtros e LTV dourado. **Paciente 360°** (tela mais importante): header com LTV e indicação, 10 abas — Resumo, **Timeline** (agregadora, filtrável), Conversas, Agendamentos, Prontuário 🔒, **Fotos** 🔒 (arquivo clínico com badge "App" quando capturada pelo App do médico; `data/photos.ts`), Orçamentos & Contratos, Financeiro, Pós-atendimento, Documentos (com visualizador de papel timbrado). 🔒 = bloqueada para papel Comercial (LGPD). Ricardo = demonstração de 18 meses de relacionamento.

## §7 Agenda & Recepção (`/agenda` — `Agenda.tsx`)
Grade semana/dia (7h–19h) com cores por tipo, **arrastar para reagendar**, clique em slot vazio cria agendamento, detalhe com avanço de status. Painel lateral **Fila do dia** com progresso, check-in → em atendimento → finalizado e registro de no-show.

## §8 Consulta assistida por IA (`/consulta/:encounterId` — `Consultation.tsx`)
3 painéis: resumo clínico fixo (alergias em destaque) · área da consulta · assistente. Fluxo-chave: consentimento (CFM 2.454/2026) → transcrição progressiva (script da Mariana) → IA estrutura rascunho em 5 campos editáveis → CIDs em chips selecionáveis → **aprovação grava no prontuário** com selo → pedido de exames (rascunho → assinatura digital) → retorno agendado → encaminhar ao comercial (abre orçamento). Log de IA auditável (modal do histórico).

## §9 Documentos médicos (modais — `components/modules/MedicalDoc.tsx` + `DocShortcuts.tsx`)
`DocShortcuts` (embutido na Consulta e na Teleconsulta): emitir **Prescrição** ou **Atestado** a qualquer momento; rascunho gerado por IA respeita alergias da ficha. `MedicalDocModal`: papel timbrado da Clínica M. Luther com `LutherLogo`, corpo, assinatura cursiva + selo ICP-Brasil ao assinar, e aviso "como o paciente receberá". Também usado na aba Documentos do 360°.

## §10 Orçamentos (`/orcamentos/:quoteId` — `QuoteEditor.tsx` · `lib/cascade.ts`)
Editor com catálogo + pacotes com desconto, simulador de entrada/parcelas (sliders), preview do documento com marca. **Enviar por WhatsApp** insere mensagem na conversa real. **"Marcar como aceito"** dispara `aceitarOrcamento()` — a cascata: contrato + parcelas + cirurgia agendada + checklist + jornada de pós + deal ganho, apresentada no modal **"O que o Zaleva criou automaticamente"** (clímax da Jornada 1).

## §11 Contratos (`/contratos` — `Contracts.tsx`)
Lista + viewer com papel timbrado, termos de consentimento vinculados, **trilha de auditoria** e simulação de assinatura eletrônica do paciente.

## §12 Pós-atendimento (`/pos-atendimento` — `PostOp.tsx`)
Duas abas: **Pacientes em acompanhamento** (cards com D+, barra de etapas, card crítico da Carla com "Ligar/antecipar retorno" → resolve alerta, limpa sino, notifica paciente no WhatsApp e registra na timeline) e **Construtor de jornada** (canvas read-only do fluxo automatizado com ramo de alerta).

## §13 Teleconsulta (`/teleconsulta` — `Teleconsult.tsx`)
Sala de espera (teste de dispositivos + consentimento) → chamada com vídeo fake "AO VIVO", controles, transcrição da IA progressiva, rascunho de evolução em construção, chat lateral e `DocShortcuts`. Encerrar registra no prontuário. Teaser "em breve: novas experiências".

## §14 Portal do paciente (`/portal` — `Portal.tsx`)
Moldura mobile, visão da Mariana: próximos compromissos com **check-in digital** (reflete na fila da recepção), preparação, documentos/prescrições assinados, parcelas com **Pix simulado**, assistente que responde só o administrativo — **pergunta de sintoma é encaminhada à equipe** (teste com "Estou com dor, é normal?").

## §15 App do médico (`/app-medico` — `DoctorApp.tsx`)
Moldura mobile, 5 abas: **Hoje** (alerta da Carla + próximo paciente com ação + agenda), **Indicadores** (KPIs + barras de receita 6m), **Câmera** (visor clínico; capturar **sincroniza a foto ao arquivo do paciente** com badge "App" e link para o 360°), **Chat** (chat interno da equipe — `useChatInternoStore` no mesmo arquivo: 4 conversas com vínculo 📎 a registros, não-lidas, resposta simulada) e **Alertas** (notificações globais).

## §16 Dashboards (`/dashboards` — `Dashboards.tsx`)
Abas Comercial (funil = espelho do Kanban ao vivo, leads por origem, atribuição campanha→receita com ROAS, motivos de perda), Financeiro (prevista × realizada 6m, a receber/inadimplência das parcelas reais, receita por profissional/procedimento) e Executivo (NPS, crescimento, régua da jornada integrada).

## Itens de menu "em breve" (conceituais, bloqueados)
Financeiro completo · Faturamento TISS · Estoque · Chat interno (versão web) · Configurações.
