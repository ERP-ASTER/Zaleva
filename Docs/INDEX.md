# 📇 ÍNDICE — Documentação viva do projeto Zaleva

> **Este arquivo é o ponto de entrada obrigatório.** Antes de implementar qualquer atualização, consulte este índice para localizar a documentação de contexto e os arquivos-fonte afetados. Após implementar, atualize a documentação correspondente, o [CHANGELOG](CHANGELOG.md) e este índice (se a estrutura mudou) — automaticamente, sem que o usuário precise pedir. Workflow completo: `.claude/skills/atualizar-docs/SKILL.md`.

## Documentos de contexto

| Documento | Conteúdo | Atualizar quando... |
|---|---|---|
| [contexto/visao-geral.md](contexto/visao-geral.md) | Produto, tese, marca, clínica fictícia, personas âncora | mudar marca, personas, posicionamento |
| [contexto/arquitetura.md](contexto/arquitetura.md) | Stack, estrutura de pastas, design system, padrões | mudar stack, tokens, componentes base, convenções |
| [contexto/modulos.md](contexto/modulos.md) | Todas as telas/rotas com arquivos e simulações | criar/alterar tela, rota, modal ou simulação |
| [contexto/dados-e-stores.md](contexto/dados-e-stores.md) | Entidades, mocks, stores zustand, regras de consistência | mudar tipos, dados mockados, stores ou cascatas |
| [contexto/jornadas-demo.md](contexto/jornadas-demo.md) | As 3 jornadas roteirizadas + momentos fortes de demo | mudar fluxo de demonstração |
| [contexto/deploy.md](contexto/deploy.md) | Build, GitHub, Cloudflare Pages, automação de publicação | mudar pipeline de build/deploy |
| [CHANGELOG.md](CHANGELOG.md) | Registro vivo de cada atualização implementada | **sempre**, a cada mudança |

## Documentos originais (não editar — histórico)

- [plano-plataforma-gestao-clinica.md](plano-plataforma-gestao-clinica.md) — plano de produto completo (visão da plataforma)
- [spec-prototipo.md](spec-prototipo.md) — spec original do protótipo (restrições de implementação)

## Mapa feature → código → documento

| Área | Rotas | Código principal | Documento |
|---|---|---|---|
| Login / sessão | `/login` | `src/pages/Login.tsx` · `src/stores/useSessionStore.ts` | modulos.md §1 |
| Central de trabalho (Home por papel) | `/` | `src/pages/Home.tsx` | modulos.md §2 |
| Caixa de entrada omnichannel | `/inbox` | `src/pages/Inbox.tsx` · `useInboxStore` · `data/conversations.ts` | modulos.md §3 |
| Marketing & Aquisição | `/marketing` | `src/pages/Marketing.tsx` · `useMarketingStore` · `data/marketing.ts` | modulos.md §4 |
| CRM comercial | `/crm`, `/crm/:dealId` | `src/pages/Crm.tsx` · `DealDetail.tsx` · `useCrmStore` · `data/deals.ts` | modulos.md §5 |
| Pacientes / Paciente 360° | `/pacientes`, `/pacientes/:id` | `Patients.tsx` · `Patient360.tsx` · `data/contacts.ts` | modulos.md §6 |
| Agenda & Recepção | `/agenda` | `src/pages/Agenda.tsx` · `useAgendaStore` · `data/agenda.ts` | modulos.md §7 |
| Consulta assistida por IA | `/consulta/:encounterId` | `Consultation.tsx` · `useClinicalStore` · `data/clinical.ts` | modulos.md §8 |
| Documentos médicos (prescrição/atestado) | (modais) | `components/modules/MedicalDoc.tsx` · `DocShortcuts.tsx` | modulos.md §9 |
| Orçamentos + cascata do aceite | `/orcamentos/:quoteId` | `QuoteEditor.tsx` · `lib/cascade.ts` · `useBillingStore` | modulos.md §10 |
| Contratos & assinatura | `/contratos` | `Contracts.tsx` · `data/billing.ts` | modulos.md §11 |
| Pós-atendimento & jornadas | `/pos-atendimento` | `PostOp.tsx` · `usePostOpStore` · `data/postop.ts` | modulos.md §12 |
| Teleconsulta | `/teleconsulta` | `Teleconsult.tsx` | modulos.md §13 |
| Portal do paciente | `/portal` | `Portal.tsx` | modulos.md §14 |
| App do médico (agenda, câmera, chat interno) | `/app-medico` | `DoctorApp.tsx` (inclui `useChatInternoStore`) | modulos.md §15 |
| Dashboards | `/dashboards` | `Dashboards.tsx` · `data/billing.ts` | modulos.md §16 |
| Layout global (sidebar, topbar, ⌘K, painel contextual) | — | `components/layout/*` · `useUiStore` | arquitetura.md |
| Timeline agregadora | — | `components/ui/Timeline.tsx` · `useTimelineStore` · `data/timeline.ts` | dados-e-stores.md |
| Fotos clínicas | (aba 360° + app) | `data/photos.ts` · `useClinicalStore.fotos` | modulos.md §6/§15 |

## Regras de ouro (nunca quebrar)

1. **Consistência entre telas**: mesma entidade = mesmos números em qualquer módulo (kanban ↔ dashboard ↔ marketing).
2. **IA sempre supervisionada**: todo output de IA passa por Aprovar/Editar/Descartar com tratamento visual distinto.
3. **Datas relativas** a `new Date()` (`src/data/dates.ts`) — a demo nunca envelhece.
4. **pt-BR 100%** — inclusive moeda e datas.
5. Após cada atualização: **docs → changelog → commit → push → deploy** (ver `.claude/skills/deploy/SKILL.md`), sem pedir permissão.
