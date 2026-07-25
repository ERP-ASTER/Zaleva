# Visão geral — Zaleva

## O produto

**Zaleva** (aportuguesamento de *Tsaleach*, hebraico para "sucesso/prosperar") é uma plataforma integrada de gestão da jornada do paciente. Tese: **"cuidado e resultado avançam juntos"** — cada evento avança a jornada (marketing → conversa → CRM → agenda → consulta → orçamento → contrato → procedimento → pós-atendimento → recorrência), tudo conectado à gestão.

Este repositório é o **protótipo demonstrativo**: frontend puro (sem backend), dados 100% mockados, IA simulada com respostas pré-escritas e delays. Objetivo: encantar médicos em demonstração. Refresh reseta os dados (estado em memória); a sessão de login persiste em `sessionStorage`.

## Dor que o produto ataca

Sistemas atuais tratam o paciente como "mero agendamento". No Zaleva, o mesmo registro evolui de lead a paciente sem perder histórico comercial, clínico e financeiro — a **Timeline** é o coração da tese.

## Marca e cenário fictício

| Item | Valor |
|---|---|
| Plataforma | **Zaleva** (logo "Z" esmeralda, fonte display Fraunces) |
| Clínica cliente | **Clínica M. Luther** — cirurgia plástica & estética |
| Logomarca da clínica | Retrato estilizado de Martinho Lutero (SVG em `MedicalDoc.tsx` → `LutherLogo`) |
| Unidades | **Toledo** (principal) e **Eldorado** |
| Site fictício | clinicamluther.com.br |
| Médico principal | **Dr. Renato Somensi · CRM 2469-MS** (id `prof-otavio` — id histórico, exibe nome novo) |
| Equipe | Dra. Letícia Fontes, Dr. Bruno Rezende (cirurgiões), Dra. Camila Iwata (dermato), Patrícia/Suelen (recepção), Diego Antunes (comercial), Renata Vilaça (gestora) |

## Papéis de usuário (troca ao vivo pelo avatar)

`medico` · `recepcao` · `comercial` · `gestor` — a Home muda por papel; o papel Comercial tem as abas clínicas (Prontuário, Fotos) **bloqueadas com cadeado** (argumento LGPD).

## Personas âncora (dados consistentes em TODAS as telas)

1. **Mariana Duarte, 34** (`ct-mariana`) — lead do Instagram (campanha "Rino Verão"), rinoplastia. Percorre a Jornada 1 completa. Alergia a dipirona (usada nos alertas de segurança da IA).
2. **Carla Menezes, 41** (`ct-carla`) — D+1 de abdominoplastia; check-in com dor 8/10 dispara o alerta crítico da Jornada 3. LTV R$ 33,4 mil.
3. **Ricardo Tavares, 52** (`ct-ricardo`) — recorrente (blefaro + toxina semestral), 18 meses de timeline, LTV R$ 21,6 mil, origem indicação.

## Princípios inegociáveis do protótipo

- IA como copiloto: **nada entra em registro sem aprovação humana** (Aprovar/Editar/Descartar) — referências CFM 2.454/2026 (consulta assistida) e publicidade médica CFM (conteúdo de marketing).
- Estética premium (paleta esmeralda `#0F6B5C` + dourado para valores), specialty-agnostic no design, conteúdo de cirurgia plástica.
- Sem becos sem saída nas 3 jornadas de demo.
