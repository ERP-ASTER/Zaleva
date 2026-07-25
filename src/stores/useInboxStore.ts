import { create } from 'zustand'
import type { Conversation, Message } from '@/data/types'
import { conversas as conversasIniciais } from '@/data/conversations'
import { uid } from '@/lib/ids'
import { useTimelineStore } from './useTimelineStore'
import { contatoById } from '@/data/contacts'

/** Respostas automáticas do "contato" após a equipe enviar mensagem (simulação). */
const respostasAutomaticas: Record<string, string[]> = {
  'cv-mariana': [
    'Perfeito, obrigada! Já estou me organizando por aqui 😊',
    'Combinado! Até já 💚',
  ],
  'cv-fernanda': ['ahh legal! vou ver aqui e te respondo', 'obrigada!!'],
  'cv-amanda': ['Aaah que ótimo!! Pode ser essa semana ainda?', 'Perfeito!'],
  'cv-carla': ['Obrigada pelo cuidado 🙏 Fico no aguardo.', 'Está bem, obrigada.'],
  default: ['Entendi, obrigada pelo retorno!', 'Perfeito 😊', 'Combinado!'],
}

/** Sugestões de resposta da IA por conversa (contextuais). */
export const sugestoesIA: Record<string, string> = {
  'cv-mariana':
    'Oi, Mariana! Ótima pergunta 😊 Em geral, o retorno ao trabalho acontece entre 7 e 10 dias — o Dr. Renato vai detalhar tudo na sua avaliação de hoje às 10h. Qualquer dúvida antes disso, estou por aqui!',
  'cv-amanda':
    'Oi, Amanda! Que bom que gostou do resultado 😍 Para agendar sua avaliação de Lipo HD é bem simples: temos horários esta semana com o Dr. Bruno (Eldorado) e a Dra. Letícia (Toledo). A consulta custa R$ 700, abatidos se você fechar o procedimento. Qual unidade prefere?',
  'cv-gustavo':
    'Bom dia, Gustavo! A teleconsulta funciona assim: você recebe um link seguro, testa câmera e microfone na sala de espera virtual e conversa com o Dr. Renato por vídeo (±40 min). Tenho horário amanhã às 7h30 ou quinta às 19h. Qual prefere?',
  'cv-rodrigo':
    'Oi, Rodrigo! Que bom te ver por aqui de novo 😊 Sim! Este mês temos condição especial para Lipo HD: entrada de 20% + 12x sem juros. Posso agendar uma reavaliação rápida com o Dr. Bruno para atualizar seu plano?',
  default:
    'Olá! Obrigado pela mensagem 😊 Posso te ajudar com informações sobre procedimentos, valores e agendamento de avaliação. O que você gostaria de saber?',
}

interface InboxState {
  conversas: Conversation[]
  selecionadaId?: string
  digitando: Record<string, boolean> // conversaId → contato digitando
  selecionar: (id: string) => void
  enviarMensagem: (conversaId: string, texto: string, autorNome: string) => void
  assumirConversa: (conversaId: string, atendenteId: string, atendenteNome: string) => void
  resolverConversa: (conversaId: string) => void
  addMensagemSistema: (conversaId: string, texto: string) => void
  addMensagemEquipe: (conversaId: string, texto: string, autorNome: string) => void
}

const novaMsg = (autor: Message['autor'], texto: string, extras: Partial<Message> = {}): Message => ({
  id: uid('msg'),
  autor,
  tipo: 'texto',
  texto,
  em: new Date().toISOString(),
  ...extras,
})

export const useInboxStore = create<InboxState>((set, get) => ({
  conversas: conversasIniciais,
  selecionadaId: undefined,
  digitando: {},

  selecionar: (id) =>
    set((s) => ({
      selecionadaId: id,
      conversas: s.conversas.map((c) => (c.id === id ? { ...c, naoLidas: 0 } : c)),
    })),

  enviarMensagem: (conversaId, texto, autorNome) => {
    set((s) => ({
      conversas: s.conversas.map((c) =>
        c.id === conversaId
          ? {
              ...c,
              status: c.status === 'nova' || c.status === 'ia' ? 'em-atendimento' : c.status,
              mensagens: [...c.mensagens, novaMsg('equipe', texto, { autorNome })],
            }
          : c,
      ),
    }))

    // Simula "digitando..." e resposta automática do contato
    const respostas = respostasAutomaticas[conversaId] ?? respostasAutomaticas.default
    const jaRespondidas = get().conversas.find((c) => c.id === conversaId)?.mensagens.filter((m) => m.autor === 'contato').length ?? 0
    const resposta = respostas[Math.min(jaRespondidas % respostas.length, respostas.length - 1)]

    setTimeout(() => set((s) => ({ digitando: { ...s.digitando, [conversaId]: true } })), 900)
    setTimeout(() => {
      set((s) => ({
        digitando: { ...s.digitando, [conversaId]: false },
        conversas: s.conversas.map((c) =>
          c.id === conversaId ? { ...c, mensagens: [...c.mensagens, novaMsg('contato', resposta)] } : c,
        ),
      }))
    }, 2400)
  },

  assumirConversa: (conversaId, atendenteId, atendenteNome) => {
    set((s) => ({
      conversas: s.conversas.map((c) =>
        c.id === conversaId
          ? {
              ...c,
              status: 'em-atendimento',
              atendenteId,
              mensagens: [
                ...c.mensagens,
                novaMsg('sistema', `${atendenteNome} assumiu a conversa (transferida pela IA)`),
              ],
            }
          : c,
      ),
    }))
    const conversa = get().conversas.find((c) => c.id === conversaId)
    if (conversa) {
      const contato = contatoById(conversa.contactId)
      useTimelineStore
        .getState()
        .addEvento(conversa.contactId, 'conversa', `Atendimento transferido da IA para ${atendenteNome}`, `Conversa de ${contato?.nome ?? 'contato'} assumida por humano`)
    }
  },

  resolverConversa: (conversaId) =>
    set((s) => ({
      conversas: s.conversas.map((c) => (c.id === conversaId ? { ...c, status: 'resolvida' } : c)),
    })),

  addMensagemSistema: (conversaId, texto) =>
    set((s) => ({
      conversas: s.conversas.map((c) =>
        c.id === conversaId ? { ...c, mensagens: [...c.mensagens, novaMsg('sistema', texto)] } : c,
      ),
    })),

  addMensagemEquipe: (conversaId, texto, autorNome) =>
    set((s) => ({
      conversas: s.conversas.map((c) =>
        c.id === conversaId ? { ...c, mensagens: [...c.mensagens, novaMsg('equipe', texto, { autorNome })] } : c,
      ),
    })),
}))
