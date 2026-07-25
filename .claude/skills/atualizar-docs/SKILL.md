---
name: atualizar-docs
description: Atualiza a documentação viva do projeto (Docs/) após qualquer mudança de código — contexto, CHANGELOG e índice de referências. Deve ser executada automaticamente ao final de toda atualização, sem que o usuário peça. Use também ANTES de implementar, para consultar o índice e localizar contexto e arquivos afetados.
---

# Documentação viva do Zaleva

## Antes de implementar (consulta)

1. Leia `Docs/INDEX.md` — o mapa feature → código → documento.
2. Abra o(s) documento(s) de contexto da área afetada em `Docs/contexto/` para entender padrões, regras de consistência e arquivos envolvidos.
3. Consulte `Docs/contexto/dados-e-stores.md` sempre que a mudança tocar mocks, stores ou personas (regras de consistência entre telas).

## Depois de implementar (registro — SEMPRE, sem o usuário pedir)

1. **CHANGELOG**: adicione entrada no TOPO de `Docs/CHANGELOG.md`:
   ```
   ## AAAA-MM-DD · Título curto da mudança
   - O que mudou (bullets objetivos, arquivos novos entre crases)
   - Docs: <documentos de contexto atualizados>
   ```
2. **Documentos de contexto**: atualize as seções afetadas (tabela em `Docs/INDEX.md` diz qual documento corresponde a cada tipo de mudança):
   - Nova tela/rota/simulação → `contexto/modulos.md` (+ linha no mapa do INDEX)
   - Novo tipo/mock/store/regra de consistência → `contexto/dados-e-stores.md`
   - Mudança de marca/persona → `contexto/visao-geral.md`
   - Mudança de stack/token/padrão → `contexto/arquitetura.md`
   - Mudança no fluxo de demo → `contexto/jornadas-demo.md`
3. **INDEX**: se surgiu módulo/rota/documento novo, atualize as tabelas de `Docs/INDEX.md`.
4. **README.md**: atualize apenas se a mudança afetar o roteiro de demonstração.

## Regras

- Documentação em pt-BR, tom objetivo, sem duplicar o que o código já diz — documente decisões, mapas e regras.
- Nunca editar `Docs/plano-plataforma-gestao-clinica.md` nem `Docs/spec-prototipo.md` (históricos).
- A atualização de docs entra **no mesmo commit** da mudança de código.
- Após documentar, siga para a skill `deploy` (push + publicação automáticos).
