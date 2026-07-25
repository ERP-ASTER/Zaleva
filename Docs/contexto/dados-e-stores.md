# Dados mockados e stores

## Fonte única de tipos
`src/data/types.ts` — Contact, Conversation/Message, Deal/DealStage, Appointment/AppointmentStatus, ClinicalRecord, Encounter, Prescription, ClinicalDoc (com `linhas` para o visualizador), Quote/Contract/Installment, ProcedureRecord, Journey/JourneyStep, TimelineEvent, AppNotification, CatalogItem/Pacote, MesFinanceiro, CampanhaStat, PhotoRecord. Tipos exclusivos de marketing em `src/data/marketing.ts`.

## Datas
`src/data/dates.ts` — TODAS as datas mockadas são relativas a `new Date()`: `emDias(n, h, m)`, `diasAtras`, `mesesAtras`, `horasAtras`, `minutosAtras`, `emMeses`, `diaDaSemana`. A demo nunca parece velha.

## Volumes
~35 contatos · 15 conversas · 13 negociações (9 etapas do funil) · ~40 agendamentos na semana corrente · 7 jornadas de pós-op · 18 fotos clínicas · 7 campanhas · 7 conteúdos no pipeline do Estúdio · 6 meses de histórico financeiro · catálogo com valores realistas (Rino R$ 34k, Mamo R$ 28,5k, Lipo HD R$ 38k, Abdomino R$ 32k, Blefaro R$ 15k, Toxina R$ 2,2k...).

## Stores (zustand, em memória)

| Store | Responsabilidade | Ações-chave |
|---|---|---|
| `useSessionStore` | papel, unidade, login (persist em sessionStorage) | `login`, `setPapel`, `setUnidade` |
| `useUiStore` | toasts, notificações (sino), painel contextual, ⌘K | `toast`, `addNotificacao`, `abrirContexto` |
| `useTimelineStore` | **agregador central de eventos** | `addEvento(contactId, tipo, titulo, ...)` |
| `useInboxStore` | conversas, respostas automáticas, handoff IA, sugestões | `enviarMensagem`, `assumirConversa`, `addMensagemEquipe` |
| `useCrmStore` | funil (`etapasFunil`), drag&drop, ganho/perdido | `moverEtapa`, `marcarGanho`, `marcarPerdido` |
| `useAgendaStore` | agendamentos, fila, status (`proximoStatus`/`labelAcaoStatus`) | `avancarStatus`, `reagendar`, `criarAgendamento` |
| `useClinicalStore` | consultas, consulta assistida (fases), prescrições, documentos, **fotos** | `aprovarEvolucao`, `criarPrescricao`, `assinarDocumento`, `addFoto` |
| `useBillingStore` | orçamentos, contratos, parcelas | `atualizarOrcamento`, `assinarContrato`, `pagarParcela` |
| `usePostOpStore` | jornadas de pós-op, alerta crítico | `resolverAlerta` (limpa sino + WhatsApp + timeline) |
| `useMarketingStore` | campanhas (status), site (páginas/feed), pipeline de conteúdo | `aprovarEPublicar` (automação de publicação), `publicarPagina`, `toggleCampanha` |
| `useChatInternoStore` | chat interno da equipe (definida em `DoctorApp.tsx`) | `enviar` (resposta simulada), `marcarLida` |

## Cascata do aceite (`src/lib/cascade.ts`)
`aceitarOrcamento(quoteId)` executa em sequência: quote aceito → contrato criado/enviado → entrada + N parcelas → cirurgia agendada (D+21, centro cirúrgico) → jornada pré/pós ativada (`passosPadraoPosOp`) → deal marcado ganho → mensagem no WhatsApp → retorna `ItemCascata[]` para o modal. É o clímax da Jornada 1.

## Regras de consistência (verificar a cada mudança)

1. **Kanban ↔ Dashboards ↔ Marketing**: funil e receitas leem as MESMAS stores/fontes (`useCrmStore`, `campanhas` de `billing.ts`). Nunca duplicar números.
2. **Personas**: Mariana/Carla/Ricardo têm ids fixos (`ct-mariana`, `ct-carla`, `ct-ricardo`) referenciados em conversas, deals, agenda, clínico, billing, postop, timeline, fotos e chat interno — alterar um exige revisar os demais.
3. **Ids históricos**: `prof-otavio` = Dr. Renato Somensi; `un-toledo`/`un-eldorado` = unidades. Não renomear ids, apenas os campos de exibição.
4. **Alergia da Mariana (dipirona)**: usada nos alertas de segurança (consulta, prescrição, chat interno). Manter coerente.
5. Toda ação de usuário relevante → `addEvento` na timeline + `toast`; eventos críticos também no sino.
