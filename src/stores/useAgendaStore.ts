import { create } from 'zustand'
import type { Appointment, AppointmentStatus, AppointmentTipo } from '@/data/types'
import { agendamentos as agendaInicial } from '@/data/agenda'
import { uid } from '@/lib/ids'
import { useTimelineStore } from './useTimelineStore'
import { contatoById } from '@/data/contacts'

export const proximoStatus: Partial<Record<AppointmentStatus, AppointmentStatus>> = {
  'pre-agendado': 'aguardando-confirmacao',
  'aguardando-confirmacao': 'confirmado',
  confirmado: 'checkin',
  checkin: 'em-atendimento',
  'em-atendimento': 'finalizado',
}

export const labelAcaoStatus: Partial<Record<AppointmentStatus, string>> = {
  'pre-agendado': 'Solicitar confirmação',
  'aguardando-confirmacao': 'Confirmar',
  confirmado: 'Fazer check-in',
  checkin: 'Iniciar atendimento',
  'em-atendimento': 'Finalizar',
}

interface AgendaState {
  agendamentos: Appointment[]
  setStatus: (id: string, status: AppointmentStatus) => void
  avancarStatus: (id: string) => void
  reagendar: (id: string, novoInicio: string) => void
  criarAgendamento: (dados: {
    contactId: string
    profissionalId: string
    tipo: AppointmentTipo
    titulo: string
    inicio: string
    duracaoMin: number
    unidadeId: string
  }) => void
}

export const useAgendaStore = create<AgendaState>((set) => ({
  agendamentos: agendaInicial,

  setStatus: (id, status) =>
    set((s) => {
      const ap = s.agendamentos.find((a) => a.id === id)
      if (ap && status === 'checkin') {
        useTimelineStore.getState().addEvento(ap.contactId, 'agendamento', 'Check-in realizado na recepção', ap.titulo, '/agenda')
      }
      if (ap && status === 'finalizado') {
        useTimelineStore.getState().addEvento(ap.contactId, 'agendamento', 'Atendimento finalizado', ap.titulo)
      }
      return { agendamentos: s.agendamentos.map((a) => (a.id === id ? { ...a, status } : a)) }
    }),

  avancarStatus: (id) =>
    set((s) => {
      const ap = s.agendamentos.find((a) => a.id === id)
      if (!ap) return s
      const prox = proximoStatus[ap.status]
      if (!prox) return s
      if (prox === 'checkin') {
        useTimelineStore.getState().addEvento(ap.contactId, 'agendamento', 'Check-in realizado na recepção', ap.titulo, '/agenda')
      }
      return { agendamentos: s.agendamentos.map((a) => (a.id === id ? { ...a, status: prox } : a)) }
    }),

  reagendar: (id, novoInicio) =>
    set((s) => {
      const ap = s.agendamentos.find((a) => a.id === id)
      if (ap) {
        const contato = contatoById(ap.contactId)
        useTimelineStore.getState().addEvento(ap.contactId, 'agendamento', 'Agendamento remarcado', `${ap.titulo} — ${contato?.nome ?? ''}`, '/agenda')
      }
      return { agendamentos: s.agendamentos.map((a) => (a.id === id ? { ...a, inicio: novoInicio } : a)) }
    }),

  criarAgendamento: (dados) =>
    set((s) => {
      useTimelineStore.getState().addEvento(dados.contactId, 'agendamento', 'Novo agendamento criado', dados.titulo, '/agenda')
      return {
        agendamentos: [
          ...s.agendamentos,
          { id: uid('ap'), status: 'pre-agendado' as AppointmentStatus, ...dados },
        ],
      }
    }),
}))
