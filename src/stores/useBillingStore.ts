import { create } from 'zustand'
import type { Quote, Contract, Installment } from '@/data/types'
import { orcamentos as orcamentosIniciais, contratos as contratosIniciais, parcelas as parcelasIniciais } from '@/data/billing'

interface BillingState {
  orcamentos: Quote[]
  contratos: Contract[]
  parcelas: Installment[]
  atualizarOrcamento: (id: string, patch: Partial<Quote>) => void
  addContrato: (c: Contract) => void
  addParcelas: (p: Installment[]) => void
  assinarContrato: (id: string) => void
  pagarParcela: (id: string) => void
}

export const useBillingStore = create<BillingState>((set) => ({
  orcamentos: orcamentosIniciais,
  contratos: contratosIniciais,
  parcelas: parcelasIniciais,

  atualizarOrcamento: (id, patch) =>
    set((s) => ({ orcamentos: s.orcamentos.map((q) => (q.id === id ? { ...q, ...patch } : q)) })),

  addContrato: (c) => set((s) => ({ contratos: [c, ...s.contratos] })),

  addParcelas: (p) => set((s) => ({ parcelas: [...s.parcelas, ...p] })),

  assinarContrato: (id) =>
    set((s) => ({
      contratos: s.contratos.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'assinado' as const,
              assinadoEm: new Date().toISOString(),
              termos: c.termos.map((t) => ({ ...t, assinado: true })),
              trilha: [...c.trilha, { evento: 'Assinado eletronicamente via link seguro', em: new Date().toISOString() }],
            }
          : c,
      ),
    })),

  pagarParcela: (id) =>
    set((s) => ({
      parcelas: s.parcelas.map((p) =>
        p.id === id ? { ...p, status: 'pago' as const, pagoEm: new Date().toISOString(), forma: p.forma ?? 'Pix' } : p,
      ),
    })),
}))
