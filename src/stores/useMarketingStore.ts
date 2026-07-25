import { create } from 'zustand'
import {
  campanhasExtras,
  landingPagesIniciais,
  paginasSiteIniciais,
  conteudosIniciais,
  gradientesConteudo,
  type CampanhaStatus,
  type LandingPage,
  type PaginaSite,
  type Conteudo,
  type CanalConteudo,
  type FormatoConteudo,
} from '@/data/marketing'
import { uid } from '@/lib/ids'
import { useUiStore } from './useUiStore'

interface MarketingState {
  statusCampanhas: Record<string, CampanhaStatus>
  landingPages: LandingPage[]
  paginas: PaginaSite[]
  atualizacoesSite: { texto: string; em: string }[]
  conteudos: Conteudo[]

  toggleCampanha: (id: string, nome: string) => void
  toggleAgendamentoOnline: (lpId: string) => void
  salvarPagina: (id: string, titulo: string, descricao: string) => void
  publicarPagina: (id: string) => void

  criarConteudo: (tema: string, formato: FormatoConteudo, corpo: string) => string
  aprovarEPublicar: (id: string, canais: CanalConteudo[], agendarDias: number) => void
  gerarRascunho: (id: string) => void
}

export const useMarketingStore = create<MarketingState>((set, get) => ({
  statusCampanhas: Object.fromEntries(Object.entries(campanhasExtras).map(([id, e]) => [id, e.status])),
  landingPages: landingPagesIniciais,
  paginas: paginasSiteIniciais,
  atualizacoesSite: [
    { texto: 'Artigo "Cuidados no pós-operatório de mamoplastia" publicado no blog (automação do Estúdio IA)', em: conteudosIniciais[0].publicadoEm! },
    { texto: 'Página "Procedimentos" atualizada — incluída a Lipo HD', em: paginasSiteIniciais[2].atualizadaEm },
  ],
  conteudos: conteudosIniciais,

  toggleCampanha: (id, nome) => {
    const atual = get().statusCampanhas[id]
    const novo: CampanhaStatus = atual === 'ativa' ? 'pausada' : 'ativa'
    set((s) => ({ statusCampanhas: { ...s.statusCampanhas, [id]: novo } }))
    useUiStore.getState().toast({
      titulo: novo === 'ativa' ? `Campanha "${nome}" reativada` : `Campanha "${nome}" pausada`,
      descricao: novo === 'ativa' ? 'Anúncios voltam a veicular em até 30 min (simulado).' : 'A veiculação dos anúncios foi interrompida (simulado).',
      tipo: 'info',
    })
  },

  toggleAgendamentoOnline: (lpId) =>
    set((s) => ({
      landingPages: s.landingPages.map((lp) => (lp.id === lpId ? { ...lp, agendamentoOnline: !lp.agendamentoOnline } : lp)),
    })),

  salvarPagina: (id, titulo, descricao) =>
    set((s) => ({
      paginas: s.paginas.map((p) => (p.id === id ? { ...p, titulo, descricao, status: 'rascunho' as const } : p)),
    })),

  publicarPagina: (id) => {
    const pagina = get().paginas.find((p) => p.id === id)
    set((s) => ({
      paginas: s.paginas.map((p) =>
        p.id === id ? { ...p, status: 'publicada' as const, atualizadaEm: new Date().toISOString() } : p,
      ),
      atualizacoesSite: [
        { texto: `Página "${pagina?.nome}" publicada no site`, em: new Date().toISOString() },
        ...s.atualizacoesSite,
      ],
    }))
    useUiStore.getState().toast({
      titulo: 'Alterações publicadas no site',
      descricao: `A página "${pagina?.nome}" já está no ar em clinicamluther.com.br (simulado).`,
      tipo: 'sucesso',
    })
  },

  criarConteudo: (tema, formato, corpo) => {
    const id = uid('cnt')
    set((s) => ({
      conteudos: [
        {
          id,
          tema,
          formato,
          status: 'rascunho-ia' as const,
          criadoEm: new Date().toISOString(),
          corpo,
          canais: [],
          gradiente: gradientesConteudo[s.conteudos.length % gradientesConteudo.length],
        },
        ...s.conteudos,
      ],
    }))
    return id
  },

  gerarRascunho: (id) => {
    set((s) => ({
      conteudos: s.conteudos.map((cnt) => (cnt.id === id ? { ...cnt, status: 'rascunho-ia' as const } : cnt)),
    }))
    useUiStore.getState().toast({
      titulo: 'Rascunho gerado pela IA',
      descricao: 'Revise e aprove antes de agendar a publicação.',
      tipo: 'ia',
    })
  },

  /**
   * Aprovação humana → agendamento → publicação AUTOMÁTICA (simulada em ~4s):
   * o item muda sozinho para "publicado", dispara toast e notificação no sino,
   * e entra no feed de atualizações do site quando o Blog está entre os canais.
   */
  aprovarEPublicar: (id, canais, agendarDias) => {
    const agora = new Date()
    const publicarEm = new Date(agora.getTime() + agendarDias * 86400_000).toISOString()
    set((s) => ({
      conteudos: s.conteudos.map((cnt) =>
        cnt.id === id ? { ...cnt, status: 'agendado' as const, canais, publicarEm } : cnt,
      ),
    }))
    const conteudo = get().conteudos.find((cnt) => cnt.id === id)
    useUiStore.getState().toast({
      titulo: 'Conteúdo aprovado e agendado',
      descricao: `Publicação automática em ${canais.join(' + ')} ${agendarDias === 0 ? 'em instantes' : `em ${agendarDias} dia(s)`}.`,
      tipo: 'sucesso',
    })

    // Automação: na demo, mesmo agendamentos futuros "publicam" após alguns segundos
    setTimeout(() => {
      set((s) => ({
        conteudos: s.conteudos.map((cnt) =>
          cnt.id === id ? { ...cnt, status: 'publicado' as const, publicadoEm: new Date().toISOString() } : cnt,
        ),
        atualizacoesSite: canais.includes('Blog')
          ? [{ texto: `Artigo "${conteudo?.tema}" publicado no blog pela automação do Estúdio IA`, em: new Date().toISOString() }, ...s.atualizacoesSite]
          : s.atualizacoesSite,
      }))
      useUiStore.getState().toast({
        titulo: 'Publicado automaticamente 🚀',
        descricao: `"${conteudo?.tema}" está no ar em ${canais.join(', ')}.`,
        tipo: 'sucesso',
      })
      useUiStore.getState().addNotificacao({
        tipo: 'info',
        titulo: 'Conteúdo publicado pela automação',
        descricao: `"${conteudo?.tema}" foi publicado em ${canais.join(', ')} com selo de revisão do responsável técnico.`,
        em: new Date().toISOString(),
        rota: '/marketing',
      })
    }, 4000)
  },
}))
