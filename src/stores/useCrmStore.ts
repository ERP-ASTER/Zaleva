import { create } from 'zustand'
import type { Deal, DealStage } from '@/data/types'
import { negociacoes as dealsIniciais } from '@/data/deals'
import { uid } from '@/lib/ids'
import { useTimelineStore } from './useTimelineStore'

export const etapasFunil: { id: DealStage; nome: string }[] = [
  { id: 'novo', nome: 'Novo lead' },
  { id: 'em-atendimento', nome: 'Em atendimento' },
  { id: 'qualificado', nome: 'Qualificado' },
  { id: 'avaliacao-agendada', nome: 'Avaliação agendada' },
  { id: 'avaliacao-realizada', nome: 'Avaliação realizada' },
  { id: 'plano-apresentado', nome: 'Plano apresentado' },
  { id: 'em-negociacao', nome: 'Em negociação' },
  { id: 'fechado', nome: 'Fechado' },
  { id: 'perdido', nome: 'Perdido' },
]

export const nomeEtapa = (id: DealStage) => etapasFunil.find((e) => e.id === id)?.nome ?? id

interface CrmState {
  negociacoes: Deal[]
  moverEtapa: (dealId: string, etapa: DealStage, autor: string) => void
  registrarAtividade: (dealId: string, tipo: 'contato' | 'nota' | 'followup', descricao: string, autor: string) => void
  marcarPerdido: (dealId: string, motivo: string, autor: string) => void
  marcarGanho: (dealId: string, autor: string) => void
}

export const useCrmStore = create<CrmState>((set) => ({
  negociacoes: dealsIniciais,

  moverEtapa: (dealId, etapa, autor) =>
    set((s) => {
      const deal = s.negociacoes.find((d) => d.id === dealId)
      if (deal && deal.etapa !== etapa) {
        useTimelineStore.getState().addEvento(deal.contactId, 'tarefa', `Negociação movida para "${nomeEtapa(etapa)}"`, deal.titulo, `/crm/${dealId}`)
      }
      return {
        negociacoes: s.negociacoes.map((d) =>
          d.id === dealId
            ? {
                ...d,
                etapa,
                probabilidade: etapa === 'fechado' ? 100 : etapa === 'perdido' ? 0 : d.probabilidade,
                atualizadoEm: new Date().toISOString(),
                atividades: [
                  ...d.atividades,
                  { id: uid('da'), tipo: 'etapa' as const, descricao: `Movida para "${nomeEtapa(etapa)}"`, em: new Date().toISOString(), autor },
                ],
              }
            : d,
        ),
      }
    }),

  registrarAtividade: (dealId, tipo, descricao, autor) =>
    set((s) => ({
      negociacoes: s.negociacoes.map((d) =>
        d.id === dealId
          ? {
              ...d,
              atualizadoEm: new Date().toISOString(),
              atividades: [...d.atividades, { id: uid('da'), tipo, descricao, em: new Date().toISOString(), autor }],
            }
          : d,
      ),
    })),

  marcarPerdido: (dealId, motivo, autor) =>
    set((s) => {
      const deal = s.negociacoes.find((d) => d.id === dealId)
      if (deal) useTimelineStore.getState().addEvento(deal.contactId, 'tarefa', 'Negociação marcada como perdida', `Motivo: ${motivo}`)
      return {
        negociacoes: s.negociacoes.map((d) =>
          d.id === dealId
            ? {
                ...d,
                etapa: 'perdido' as DealStage,
                probabilidade: 0,
                motivoPerda: motivo,
                atualizadoEm: new Date().toISOString(),
                atividades: [
                  ...d.atividades,
                  { id: uid('da'), tipo: 'etapa' as const, descricao: `Marcada como perdida — ${motivo}`, em: new Date().toISOString(), autor },
                ],
              }
            : d,
        ),
      }
    }),

  marcarGanho: (dealId, autor) =>
    set((s) => {
      const deal = s.negociacoes.find((d) => d.id === dealId)
      if (deal) useTimelineStore.getState().addEvento(deal.contactId, 'tarefa', 'Negociação marcada como ganha 🎉', deal.titulo, `/crm/${dealId}`)
      return {
        negociacoes: s.negociacoes.map((d) =>
          d.id === dealId
            ? {
                ...d,
                etapa: 'fechado' as DealStage,
                probabilidade: 100,
                atualizadoEm: new Date().toISOString(),
                atividades: [
                  ...d.atividades,
                  { id: uid('da'), tipo: 'etapa' as const, descricao: 'Marcada como ganha 🎉', em: new Date().toISOString(), autor },
                ],
              }
            : d,
        ),
      }
    }),
}))
