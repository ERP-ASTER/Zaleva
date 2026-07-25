# Arquitetura

## Stack

React 18 · Vite 5 · TypeScript (strict) · Tailwind CSS 3 · zustand 4 · react-router-dom 6 · recharts 2 · date-fns 3 (pt-BR) · lucide-react · @fontsource-variable (Inter + Fraunces). **Sem chamadas de rede** — IA simulada com `setTimeout` (500–1500ms) e textos pré-escritos.

Comandos: `npm run dev` (porta 5173) · `npm run build` (= `tsc --noEmit && vite build`).

## Estrutura de pastas

```
src/
├── data/          # mocks tipados — types.ts é a fonte de todos os tipos de domínio
│   ├── dates.ts   # helpers de data SEMPRE relativos a new Date() (emDias, diasAtras, mesesAtras...)
│   ├── types.ts, catalog.ts, team.ts, contacts.ts, conversations.ts, deals.ts,
│   ├── agenda.ts, clinical.ts, billing.ts, postop.ts, timeline.ts, notifications.ts,
│   └── photos.ts, marketing.ts
├── stores/        # zustand, estado em memória (refresh reseta; sessão persiste em sessionStorage)
│   ├── useSessionStore (persist) · useUiStore (toasts, ⌘K, painel contextual, notificações)
│   ├── useInboxStore · useCrmStore · useAgendaStore · useClinicalStore (inclui fotos)
│   ├── useBillingStore · usePostOpStore · useTimelineStore (agregador central)
│   └── useMarketingStore
├── lib/           # format.ts (brl, datas pt-BR) · ids.ts (uid) · cascade.ts (cascata do aceite)
├── components/
│   ├── layout/    # AppShell, Sidebar, Topbar, ContextPanel, CommandPalette (⌘K), PageHeader
│   ├── ui/        # Avatar, StatusPill, Stat, Tabs, Modal, Timeline, Toasts, EmptyState,
│   │              # AISuggestion/AIChip/AIPensando (padrão visual de IA)
│   └── modules/   # MedicalDoc (LutherLogo + visualizador de documento) · DocShortcuts
└── pages/         # 1 arquivo por rota (subcomponentes no mesmo arquivo quando exclusivos)
```

## Design system

- **Tokens** em `tailwind.config.js`: `brand` (esmeralda, base `#0F6B5C`), `gold` (destaques de receita/LTV **apenas**), `canvas #FAFAF8`, `ink` (grafite), `line`, `ai` (lilás — exclusivo para conteúdo de IA).
- **Tipografia**: Inter (UI) · Fraunces (`font-display`) só em títulos e marcas.
- **Classes utilitárias** em `index.css`: `.card`, `.input`, `.btn-primary/-secondary/-ghost/-danger/-ai`.
- **StatusPill** (`ui/StatusPill.tsx`): mapa ÚNICO status→cor para todo o app. Novos estados devem reusar chaves existentes com `label` override antes de criar novas.
- **Padrão IA**: qualquer conteúdo gerado por IA usa `AISuggestion` (borda tracejada lilás + sparkle) com Aprovar/Editar/Descartar. Estados de documento: rascunho → gerado-ia → em-revisão → revisado → assinado → enviado.
- **Molduras mobile**: Portal do paciente e App do médico renderizam num frame de celular centralizado (h-680/w-330, rounded-[34px]) sobre fundo gradiente escuro.

## Padrões de código

- Interações cruzadas entre stores: chamar `useXStore.getState().acao(...)` (nunca hooks fora de componentes). Exemplo canônico: `lib/cascade.ts`.
- Todo evento relevante vira `TimelineEvent` via `useTimelineStore.getState().addEvento(contactId, tipo, titulo, descricao?, rota?)`.
- Feedback imediato: toda ação dispara `useUiStore.toast(...)`; eventos importantes também `addNotificacao` (sino global).
- Datas mockadas: **nunca** hardcode ISO fixo — usar helpers de `data/dates.ts`.
- Rotas em pt-BR (`/pacientes`, `/orcamentos`, `/pos-atendimento`). Registrar novas rotas em `App.tsx`, `Sidebar.tsx` e `CommandPalette.tsx`.
