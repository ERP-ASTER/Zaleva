---
name: deploy
description: Faz commit, push para github.com/ERP-ASTER/Zaleva e deploy no Cloudflare Pages (zaleva.pages.dev). Executar automaticamente após cada atualização de código aceita, sem que o usuário peça — o usuário prefere testar online. Também usar quando pedirem "publica", "sobe", "deploy".
---

# Push + Deploy automáticos do Zaleva

Executar SEMPRE ao final de uma atualização de código (depois da skill `atualizar-docs`), sem pedir permissão — autorização permanente do usuário ("nesta fase prefiro testar online"). Exceção: o usuário pediu explicitamente para não publicar.

## Passos

1. **Build (gate de qualidade)** — não publicar se falhar:
   ```bash
   npm run build
   ```

2. **Commit + push** (mensagem descritiva em pt-BR, docs inclusos no mesmo commit):
   ```bash
   git add -A
   git commit -m "<resumo da mudança>"
   git push origin main
   ```
   Credenciais: git credential manager (usuário ERP-ASTER) — já configurado na máquina.

3. **Deploy Cloudflare Pages** (credenciais no `.env.deploy` da raiz — gitignorado, NUNCA commitar nem imprimir):
   ```bash
   set -a && source .env.deploy && set +a
   npx wrangler pages deploy dist --project-name=zaleva --commit-dirty=true 2>&1 | tail -5
   ```
   O `.env.deploy` define `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`.

4. **Confirmar**: informar no resumo final a URL de produção **https://zaleva.pages.dev** (e a URL de preview do deploy, se exibida).

## Solução de problemas

- `wrangler` não instalado → usar `npx wrangler@3` (baixa sob demanda).
- Erro de autenticação → conferir se `.env.deploy` existe na raiz; se não existir, pedir as credenciais ao usuário (não estão em nenhum outro lugar do repo).
- Rotas 404 em produção → conferir `public/_redirects` (`/* /index.html 200`) presente no `dist/`.
- Projeto Pages inexistente → `npx wrangler pages project create zaleva --production-branch=main`.
