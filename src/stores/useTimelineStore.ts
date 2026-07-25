import { create } from 'zustand'
import type { TimelineEvent, TimelineTipo } from '@/data/types'
import { eventosIniciais } from '@/data/timeline'
import { uid } from '@/lib/ids'

interface TimelineState {
  eventos: TimelineEvent[]
  addEvento: (contactId: string, tipo: TimelineTipo, titulo: string, descricao?: string, rota?: string) => void
}

export const useTimelineStore = create<TimelineState>((set) => ({
  eventos: eventosIniciais,
  addEvento: (contactId, tipo, titulo, descricao, rota) =>
    set((s) => ({
      eventos: [
        { id: uid('tl'), contactId, tipo, titulo, descricao, rota, em: new Date().toISOString() },
        ...s.eventos,
      ],
    })),
}))
