import { create } from 'zustand'
import type { Journey } from '@/data/types'
import { jornadas as jornadasIniciais } from '@/data/postop'
import { useTimelineStore } from './useTimelineStore'
import { useUiStore } from './useUiStore'
import { useInboxStore } from './useInboxStore'

interface PostOpState {
  jornadas: Journey[]
  addJornada: (j: Journey) => void
  resolverAlerta: (journeyId: string, acao: string, autorNome: string) => void
}

export const usePostOpStore = create<PostOpState>((set, get) => ({
  jornadas: jornadasIniciais,

  addJornada: (j) => set((s) => ({ jornadas: [j, ...s.jornadas] })),

  resolverAlerta: (journeyId, acao, autorNome) => {
    const jornada = get().jornadas.find((j) => j.id === journeyId)
    if (!jornada) return

    set((s) => ({
      jornadas: s.jornadas.map((j) =>
        j.id === journeyId
          ? {
              ...j,
              risco: 'medio' as const,
              alertaResolvido: true,
              steps: j.steps.map((st) =>
                st.status === 'critico'
                  ? { ...st, status: 'concluido' as const, resposta: `${st.resposta ?? ''} · Resolvido: ${acao}` }
                  : st,
              ),
            }
          : j,
      ),
    }))

    useTimelineStore
      .getState()
      .addEvento(jornada.contactId, 'alerta', `Alerta crítico resolvido — ${acao}`, `Ação registrada por ${autorNome}`, '/pos-atendimento')

    // Marca a notificação crítica como lida
    const notif = useUiStore.getState().notificacoes.find((n) => n.tipo === 'critico' && !n.lida)
    if (notif) useUiStore.getState().marcarLida(notif.id)

    // Mensagem de acompanhamento na conversa da paciente
    if (jornada.contactId === 'ct-carla') {
      useInboxStore
        .getState()
        .addMensagemEquipe(
          'cv-carla',
          `Carla, aqui é da equipe do Dr. Renato. Recebemos seu check-in e já agimos: ${acao}. Ajustamos sua analgesia e seu retorno foi antecipado para amanhã às 9h. Qualquer piora, ligue imediatamente para (11) 99999-0000. Estamos com você! 💚`,
          autorNome,
        )
    }

    useUiStore.getState().toast({
      titulo: 'Alerta resolvido',
      descricao: 'Ação registrada na timeline da paciente e retorno antecipado.',
      tipo: 'sucesso',
    })
  },
}))
