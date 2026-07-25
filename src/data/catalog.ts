import type { CatalogItem, Pacote } from './types'

export const catalogo: CatalogItem[] = [
  { id: 'cat-rino', nome: 'Rinoplastia estruturada', categoria: 'cirurgico', valorBase: 34000, duracaoMin: 180 },
  { id: 'cat-mamo', nome: 'Mamoplastia de aumento', categoria: 'cirurgico', valorBase: 28500, duracaoMin: 150 },
  { id: 'cat-lipo', nome: 'Lipoaspiração HD', categoria: 'cirurgico', valorBase: 38000, duracaoMin: 240 },
  { id: 'cat-abdomino', nome: 'Abdominoplastia', categoria: 'cirurgico', valorBase: 32000, duracaoMin: 210 },
  { id: 'cat-blefaro', nome: 'Blefaroplastia superior', categoria: 'cirurgico', valorBase: 15000, duracaoMin: 120 },
  { id: 'cat-toxina', nome: 'Toxina botulínica (full face)', categoria: 'injetavel', valorBase: 2200, duracaoMin: 40 },
  { id: 'cat-preench', nome: 'Preenchimento com ácido hialurônico', categoria: 'injetavel', valorBase: 3200, duracaoMin: 50 },
  { id: 'cat-avaliacao', nome: 'Consulta de avaliação', categoria: 'consulta', valorBase: 700, duracaoMin: 50 },
  { id: 'cat-retorno', nome: 'Consulta de retorno', categoria: 'consulta', valorBase: 0, duracaoMin: 30 },
]

export const pacotes: Pacote[] = [
  { id: 'pac-rino-blefaro', nome: 'Harmonização do olhar — Rino + Blefaro', itens: ['cat-rino', 'cat-blefaro'], descontoPct: 8 },
  { id: 'pac-mommy', nome: 'Mommy Makeover — Abdomino + Mamo', itens: ['cat-abdomino', 'cat-mamo'], descontoPct: 10 },
  { id: 'pac-refresh', nome: 'Refresh — Toxina + Preenchimento', itens: ['cat-toxina', 'cat-preench'], descontoPct: 12 },
]

export const catalogoById = (id: string) => catalogo.find((c) => c.id === id)
