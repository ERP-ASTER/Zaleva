import { create } from 'zustand'
import type { Encounter, Prescription, ClinicalDoc, DocStatus, PhotoRecord, FotoCategoria } from '@/data/types'
import {
  consultas as consultasIniciais,
  prescricoes as prescricoesIniciais,
  documentos as documentosIniciais,
  transcricaoMariana,
  rascunhoIAMariana,
} from '@/data/clinical'
import { fotosIniciais, gradientesFoto } from '@/data/photos'
import { uid } from '@/lib/ids'
import { useTimelineStore } from './useTimelineStore'

export type FaseConsulta = 'idle' | 'consentimento' | 'transcrevendo' | 'estruturando' | 'rascunho' | 'aprovada'

export interface RascunhoEvolucao {
  motivo: string
  anamnese: string
  exameFisico: string
  avaliacao: string
  conduta: string
}

interface ClinicalState {
  consultas: Encounter[]
  prescricoes: Prescription[]
  documentos: ClinicalDoc[]

  // Estado da consulta assistida (uma por vez — demo)
  fase: FaseConsulta
  falasVisiveis: number
  rascunho: RascunhoEvolucao | null
  cidsSelecionados: string[]
  logIA: { em: string; acao: string }[]

  iniciarConsentimento: () => void
  iniciarTranscricao: () => void
  avancarTranscricao: () => void
  estruturarComIA: () => void
  editarRascunho: (campo: keyof RascunhoEvolucao, valor: string) => void
  toggleCid: (codigo: string) => void
  aprovarEvolucao: (encounterId: string) => void
  descartarRascunho: () => void
  resetConsulta: () => void

  criarPrescricao: (p: Omit<Prescription, 'id' | 'em' | 'status'> & { status?: DocStatus }) => string
  assinarPrescricao: (id: string) => void
  addDocumento: (d: Omit<ClinicalDoc, 'id' | 'em'>) => string
  assinarDocumento: (id: string) => void
  registrarLogIA: (acao: string) => void

  // Arquivo de fotos clínicas
  fotos: PhotoRecord[]
  addFoto: (contactId: string, titulo: string, categoria: FotoCategoria, origem?: PhotoRecord['origem']) => void
}

export const useClinicalStore = create<ClinicalState>((set, get) => ({
  consultas: consultasIniciais,
  prescricoes: prescricoesIniciais,
  documentos: documentosIniciais,

  fase: 'idle',
  falasVisiveis: 0,
  rascunho: null,
  cidsSelecionados: [],
  logIA: [],

  iniciarConsentimento: () => set({ fase: 'consentimento' }),

  iniciarTranscricao: () => {
    set({ fase: 'transcrevendo', falasVisiveis: 0 })
    get().registrarLogIA('Consentimento do paciente registrado — transcrição iniciada')
  },

  avancarTranscricao: () =>
    set((s) => ({
      falasVisiveis: Math.min(s.falasVisiveis + 1, transcricaoMariana.length),
    })),

  estruturarComIA: () => {
    set({ fase: 'estruturando' })
    get().registrarLogIA('IA estruturou a evolução em rascunho a partir da transcrição')
    setTimeout(() => {
      set({ fase: 'rascunho', rascunho: { ...rascunhoIAMariana } })
    }, 1400)
  },

  editarRascunho: (campo, valor) =>
    set((s) => (s.rascunho ? { rascunho: { ...s.rascunho, [campo]: valor } } : s)),

  toggleCid: (codigo) =>
    set((s) => ({
      cidsSelecionados: s.cidsSelecionados.includes(codigo)
        ? s.cidsSelecionados.filter((c) => c !== codigo)
        : [...s.cidsSelecionados, codigo],
    })),

  aprovarEvolucao: (encounterId) => {
    const { rascunho, cidsSelecionados } = get()
    if (!rascunho) return
    set((s) => ({
      fase: 'aprovada',
      consultas: s.consultas.map((e) =>
        e.id === encounterId
          ? {
              ...e,
              status: 'finalizada' as const,
              aiAssistida: true,
              ...rascunho,
              cids: cidsSelecionados.map((c) => ({
                codigo: c,
                descricao:
                  { 'M95.0': 'Deformidade adquirida do nariz', 'J34.2': 'Desvio do septo nasal', 'J30.4': 'Rinite alérgica não especificada' }[c] ?? c,
              })),
            }
          : e,
      ),
    }))
    get().registrarLogIA('Evolução revisada e APROVADA pelo médico responsável')
    const enc = get().consultas.find((e) => e.id === encounterId)
    if (enc) {
      useTimelineStore
        .getState()
        .addEvento(enc.contactId, 'consulta', `${enc.tipo} — evolução registrada`, 'Elaborada com apoio de IA — revisada e aprovada pelo médico', '/consulta/' + encounterId)
    }
  },

  descartarRascunho: () => {
    set({ rascunho: null, fase: 'transcrevendo' })
    get().registrarLogIA('Rascunho da IA descartado pelo médico')
  },

  resetConsulta: () => set({ fase: 'idle', falasVisiveis: 0, rascunho: null, cidsSelecionados: [], logIA: [] }),

  criarPrescricao: (p) => {
    const id = uid('rx')
    set((s) => ({
      prescricoes: [...s.prescricoes, { ...p, id, status: p.status ?? 'gerado-ia', em: new Date().toISOString() }],
    }))
    return id
  },

  assinarPrescricao: (id) => {
    set((s) => ({
      prescricoes: s.prescricoes.map((p) => (p.id === id ? { ...p, status: 'assinado' as DocStatus } : p)),
    }))
    const rx = get().prescricoes.find((p) => p.id === id)
    if (rx) {
      set((s) => ({
        documentos: [
          ...s.documentos,
          { id: uid('doc'), contactId: rx.contactId, tipo: 'exames', titulo: rx.titulo, status: 'assinado', em: new Date().toISOString() },
        ],
      }))
      useTimelineStore.getState().addEvento(rx.contactId, 'documento', `Documento assinado digitalmente: ${rx.titulo}`, 'Certificado digital ICP-Brasil (simulado) · disponível no portal do paciente')
    }
  },

  addDocumento: (d) => {
    const id = uid('doc')
    set((s) => ({ documentos: [...s.documentos, { ...d, id, em: new Date().toISOString() }] }))
    return id
  },

  assinarDocumento: (id) => {
    set((s) => ({
      documentos: s.documentos.map((d) => (d.id === id ? { ...d, status: 'assinado' as DocStatus } : d)),
    }))
    const doc = get().documentos.find((d) => d.id === id)
    if (doc) {
      useTimelineStore
        .getState()
        .addEvento(doc.contactId, 'documento', `Documento assinado digitalmente: ${doc.titulo}`, 'Certificado digital ICP-Brasil (simulado) · disponível no portal do paciente')
    }
  },

  registrarLogIA: (acao) => set((s) => ({ logIA: [...s.logIA, { em: new Date().toISOString(), acao }] })),

  // ─── Fotos clínicas ────────────────────────────────────────────────────────
  fotos: fotosIniciais,
  addFoto: (contactId, titulo, categoria, origem = 'consultorio') => {
    set((s) => ({
      fotos: [
        {
          id: uid('ft'),
          contactId,
          titulo,
          categoria,
          em: new Date().toISOString(),
          gradiente: gradientesFoto[Math.floor(s.fotos.length % gradientesFoto.length)],
          origem,
        },
        ...s.fotos,
      ],
    }))
    useTimelineStore
      .getState()
      .addEvento(contactId, 'documento', `Foto clínica adicionada: ${titulo}`, origem === 'app-medico' ? 'Capturada pelo App do médico e sincronizada ao arquivo' : 'Adicionada ao arquivo de fotos')
  },
}))
