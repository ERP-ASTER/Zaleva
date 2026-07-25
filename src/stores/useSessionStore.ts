import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Papel } from '@/data/types'
import { papelPadraoProf } from '@/data/team'

interface SessionState {
  logado: boolean
  papel: Papel
  unidadeId: string
  profissionalId: string
  login: (papel: Papel, unidadeId: string) => void
  setPapel: (papel: Papel) => void
  setUnidade: (unidadeId: string) => void
  logout: () => void
}

/**
 * Sessão persiste no sessionStorage (sobrevive a F5 durante a demo);
 * os DADOS ficam em memória e resetam no refresh — comportamento aceito na spec.
 */
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      logado: false,
      papel: 'medico',
      unidadeId: 'un-toledo',
      profissionalId: 'prof-otavio',
      login: (papel, unidadeId) => set({ logado: true, papel, unidadeId, profissionalId: papelPadraoProf[papel] }),
      setPapel: (papel) => set({ papel, profissionalId: papelPadraoProf[papel] }),
      setUnidade: (unidadeId) => set({ unidadeId }),
      logout: () => set({ logado: false }),
    }),
    { name: 'zaleva-sessao', storage: createJSONStorage(() => sessionStorage) },
  ),
)
