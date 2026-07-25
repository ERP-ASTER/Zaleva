# Build, repositório e deploy

## Build
- `npm run build` = `tsc --noEmit && vite build` → saída em `dist/`
- SPA fallback: `public/_redirects` (`/* /index.html 200`) — obrigatório para rotas diretas no Cloudflare Pages

## Repositório
- GitHub: **https://github.com/ERP-ASTER/Zaleva** (branch `main`)
- Credenciais: git credential manager do Windows (usuário ERP-ASTER) — nada de tokens no repo

## Hospedagem
- **Cloudflare Pages**, projeto `zaleva` → https://zaleva.pages.dev
- Deploy direto (wrangler), sem integração git no Cloudflare: `npx wrangler pages deploy dist --project-name=zaleva`
- Credenciais: arquivo local **`.env.deploy`** (gitignorado, NUNCA commitar) com `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`

## Fluxo automático pós-atualização (sem pedir permissão)
Após QUALQUER mudança de código aceita pelo usuário:
1. Atualizar documentação viva (`Docs/`) + `Docs/CHANGELOG.md` + `Docs/INDEX.md` se necessário — ver `.claude/skills/atualizar-docs/SKILL.md`
2. `npm run build` (garante tsc + bundle ok)
3. `git add -A && git commit` (mensagem descritiva em pt-BR) e `git push origin main`
4. Deploy: ver `.claude/skills/deploy/SKILL.md` (carrega `.env.deploy` e roda o wrangler)
5. Informar a URL de produção no resumo final

> Exceção: se o usuário disser explicitamente para não publicar, pular 3–4.
