import { create } from 'zustand'
import type { AppNotification } from '@/data/types'
import { notificacoesIniciais } from '@/data/notifications'
import { uid } from '@/lib/ids'

export interface Toast {
  id: string
  titulo: string
  descricao?: string
  tipo: 'sucesso' | 'info' | 'alerta' | 'ia'
}

interface UiState {
  toasts: Toast[]
  toast: (t: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void

  contextContactId?: string
  abrirContexto: (contactId: string) => void
  fecharContexto: () => void

  cmdAberto: boolean
  setCmdAberto: (v: boolean) => void

  notificacoes: AppNotification[]
  marcarLida: (id: string) => void
  marcarTodasLidas: () => void
  addNotificacao: (n: Omit<AppNotification, 'id' | 'lida'>) => void
  removerNotificacao: (id: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  toasts: [],
  toast: (t) => {
    const id = uid('toast')
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), 4200)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),

  contextContactId: undefined,
  abrirContexto: (contactId) => set({ contextContactId: contactId }),
  fecharContexto: () => set({ contextContactId: undefined }),

  cmdAberto: false,
  setCmdAberto: (v) => set({ cmdAberto: v }),

  notificacoes: notificacoesIniciais,
  marcarLida: (id) => set((s) => ({ notificacoes: s.notificacoes.map((n) => (n.id === id ? { ...n, lida: true } : n)) })),
  marcarTodasLidas: () => set((s) => ({ notificacoes: s.notificacoes.map((n) => ({ ...n, lida: true })) })),
  addNotificacao: (n) => set((s) => ({ notificacoes: [{ ...n, id: uid('nt'), lida: false }, ...s.notificacoes] })),
  removerNotificacao: (id) => set((s) => ({ notificacoes: s.notificacoes.filter((n) => n.id !== id) })),
}))
