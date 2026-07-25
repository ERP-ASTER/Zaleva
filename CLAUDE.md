# Zaleva — protótipo de plataforma de gestão da jornada do paciente

Frontend puro (React 18 + Vite + TS + Tailwind + zustand), dados 100% mockados em pt-BR. Clínica fictícia **M. Luther** (Dr. Renato Somensi), plataforma **Zaleva**. Sem backend; IA simulada. `npm run dev` · `npm run build`.

## 📇 Documentação viva — fluxo OBRIGATÓRIO em toda atualização

**Antes de implementar qualquer pedido de mudança:** consulte `Docs/INDEX.md` (mapa feature → código → documento) e o documento de contexto da área em `Docs/contexto/`.

**Depois de implementar (automaticamente, sem o usuário pedir):**
1. Atualizar a documentação viva — skill `atualizar-docs` (`Docs/CHANGELOG.md` sempre; documentos de contexto e `Docs/INDEX.md` conforme a mudança)
2. Commit + push + deploy — skill `deploy` (o usuário testa online; autorização permanente)

## Regras do projeto

- **Consistência entre telas**: mesmos dados/stores alimentam kanban, dashboards e marketing — nunca duplicar números (ver `Docs/contexto/dados-e-stores.md`).
- **IA supervisionada**: todo output de IA usa `AISuggestion` com Aprovar/Editar/Descartar; nada entra em registro sem aprovação.
- **Datas** sempre relativas a `new Date()` via `src/data/dates.ts`.
- **Ids históricos não mudam** (`prof-otavio` = Dr. Renato Somensi; `ct-mariana`/`ct-carla`/`ct-ricardo` = personas âncora).
- Novas rotas: registrar em `App.tsx`, `Sidebar.tsx` e `CommandPalette.tsx`.
- Segredos de deploy: só em `.env.deploy` (gitignorado). NUNCA commitar, logar ou copiar para outro arquivo.
- Docs históricos intocáveis: `Docs/plano-plataforma-gestao-clinica.md`, `Docs/spec-prototipo.md`.

## Produção

- Repo: https://github.com/ERP-ASTER/Zaleva (branch `main`)
- Deploy: Cloudflare Pages → **https://zaleva.pages.dev** (`npx wrangler pages deploy dist --project-name=zaleva`)
