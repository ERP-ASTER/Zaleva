# CHANGELOG — registro vivo de atualizações

> Cada atualização implementada é registrada aqui automaticamente (mais recente no topo), com referência aos documentos de contexto afetados. Formato: data · título · o que mudou · docs atualizados.

## 2026-07-25 · Documentação viva + publicação (GitHub + Cloudflare)
- Criada a documentação viva em `Docs/` (INDEX, contexto/*, CHANGELOG) e as skills `atualizar-docs` e `deploy`
- `CLAUDE.md` com o fluxo automático: docs → commit → push → deploy após cada atualização
- `public/_redirects` para SPA no Cloudflare Pages
- Repositório publicado em github.com/ERP-ASTER/Zaleva · deploy em zaleva.pages.dev
- Docs: todos (criação inicial)

## 2026-07-25 · Menu Marketing ativado
- Nova rota `/marketing` com 5 abas: Visão geral (CPL/CAC/ROAS + funil de atribuição), Campanhas (pausar/ativar + detalhe com leads reais), Origens & Landing pages, **Site do consultório** (edição/publicação simulada + blog) e **Estúdio de conteúdo IA** (pipeline + automação de publicação Blog/Instagram/Facebook com selo de revisão)
- Novos: `data/marketing.ts`, `useMarketingStore`, `pages/Marketing.tsx`
- Docs: modulos.md §4, dados-e-stores.md

## 2026-07-25 · Chat interno no App do médico
- Aba **Chat** no `/app-medico`: 4 conversas da equipe com vínculo 📎 a registros, não-lidas, resposta simulada (`useChatInternoStore`)
- Docs: modulos.md §15

## 2026-07-25 · Rebranding + documentos + fotos + App do médico
- Dr. Renato Somensi (CRM 2469-MS) · Clínica M. Luther · unidades Toledo e Eldorado (todos os mocks)
- `MedicalDoc.tsx`: `LutherLogo` (logomarca Martinho Lutero) + visualizador de papel timbrado; `DocShortcuts` na Consulta e Teleconsulta (prescrição/atestado a qualquer momento)
- Aba **Fotos** no Paciente 360° (bloqueada p/ Comercial) + `data/photos.ts`
- **App do médico** (`/app-medico`): Hoje, Indicadores, Câmera (foto sincroniza ao 360°), Alertas
- Docs: visao-geral.md, modulos.md §6/§9/§15

## 2026-07-24 · Protótipo inicial completo
- 14 telas da spec, 3 jornadas roteirizadas, design system esmeralda/dourado, dados mockados interligados, cascata do aceite, modo demo, README
- Base: `Docs/plano-plataforma-gestao-clinica.md` + `Docs/spec-prototipo.md`
