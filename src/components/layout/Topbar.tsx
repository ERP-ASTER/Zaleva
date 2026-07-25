import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Sparkles, Bell, ChevronDown, Building2, LogOut, Check } from 'lucide-react'
import { useSessionStore } from '@/stores/useSessionStore'
import { useUiStore } from '@/stores/useUiStore'
import { unidades, profById } from '@/data/team'
import type { Papel } from '@/data/types'
import { Avatar } from '@/components/ui/Avatar'
import { fmtAtras } from '@/lib/format'

const papeis: { id: Papel; label: string }[] = [
  { id: 'medico', label: 'Médico' },
  { id: 'recepcao', label: 'Recepção' },
  { id: 'comercial', label: 'Comercial' },
  { id: 'gestor', label: 'Gestor' },
]

function useCliqueFora(fechar: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) fechar()
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [fechar])
  return ref
}

export function Topbar() {
  const navigate = useNavigate()
  const { papel, setPapel, unidadeId, setUnidade, profissionalId, logout } = useSessionStore()
  const { setCmdAberto, notificacoes, marcarLida, marcarTodasLidas, toast } = useUiStore()
  const [menuAberto, setMenuAberto] = useState<'criar' | 'ia' | 'sino' | 'perfil' | null>(null)
  const ref = useCliqueFora(() => setMenuAberto(null))

  const prof = profById(profissionalId)
  const unidade = unidades.find((u) => u.id === unidadeId)
  const naoLidas = notificacoes.filter((n) => !n.lida).length

  const criar = (oQue: string, rota?: string) => {
    setMenuAberto(null)
    if (rota) navigate(rota)
    else toast({ titulo: `${oQue} — disponível na versão completa`, tipo: 'info' })
  }

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-5" ref={ref}>
      {/* Busca global */}
      <button
        onClick={() => setCmdAberto(true)}
        className="flex w-72 items-center gap-2 rounded-lg border border-line bg-canvas px-3 py-1.5 text-[12.5px] text-ink-faint transition-colors hover:border-ink-faint"
      >
        <Search size={14} />
        Buscar pacientes, leads, telas...
        <kbd className="ml-auto rounded border border-line bg-white px-1.5 py-px text-[10px] font-medium text-ink-muted">⌘K</kbd>
      </button>

      <div className="flex-1" />

      {/* + Criar */}
      <div className="relative">
        <button onClick={() => setMenuAberto(menuAberto === 'criar' ? null : 'criar')} className="btn-primary py-1.5">
          <Plus size={14} /> Criar
        </button>
        {menuAberto === 'criar' && (
          <div className="absolute right-0 top-11 w-52 rounded-xl border border-line bg-surface p-1.5 shadow-raised animate-fade-up">
            {[
              { label: 'Novo agendamento', rota: '/agenda' },
              { label: 'Novo lead', rota: '/crm' },
              { label: 'Novo orçamento', rota: '/orcamentos/qt-mariana' },
              { label: 'Nova tarefa' },
              { label: 'Novo paciente' },
            ].map((o) => (
              <button
                key={o.label}
                onClick={() => criar(o.label, o.rota)}
                className="block w-full rounded-lg px-3 py-2 text-left text-[12.5px] text-ink hover:bg-canvas"
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Assistente IA */}
      <div className="relative">
        <button
          onClick={() => setMenuAberto(menuAberto === 'ia' ? null : 'ia')}
          className="btn border border-ai-200 bg-ai-50 px-3 py-1.5 text-[12.5px] font-medium text-ai-700 hover:bg-ai-100"
        >
          <Sparkles size={14} /> Assistente
        </button>
        {menuAberto === 'ia' && (
          <div className="absolute right-0 top-11 w-96 rounded-xl border border-line bg-surface p-4 shadow-raised animate-fade-up">
            <p className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold text-ai-700">
              <Sparkles size={13} /> Assistente Zaleva
            </p>
            <p className="mb-3 text-[11.5px] text-ink-muted">Pergunte sobre indicadores, pacientes e pendências. Exemplos do que a IA responde no contexto atual:</p>
            <div className="space-y-2">
              <div className="rounded-lg bg-canvas p-2.5 text-[12px]">
                <p className="font-medium text-ink">"Como está a agenda de hoje?"</p>
                <p className="mt-1 text-ink-muted">11 atendimentos hoje: 2 finalizados, 1 em andamento, 1 check-in feito. Destaque: avaliação da Mariana Duarte (lead quente, Rino Verão) às 10h.</p>
              </div>
              <div className="rounded-lg bg-canvas p-2.5 text-[12px]">
                <p className="font-medium text-ink">"Algum paciente precisa de atenção?"</p>
                <p className="mt-1 text-ink-muted">Sim — Carla Menezes (D+1 de abdominoplastia) reportou dor 8/10 no check-in. Alerta crítico ativo aguardando ação da equipe.</p>
              </div>
              <div className="rounded-lg bg-canvas p-2.5 text-[12px]">
                <p className="font-medium text-ink">"Qual a previsão de fechamento do mês?"</p>
                <p className="mt-1 text-ink-muted">Receita realizada de R$ 187 mil (55% da meta). Funil tem R$ 264 mil em negociações ativas — 2 com fechamento provável esta semana.</p>
              </div>
            </div>
            <p className="mt-3 border-t border-line pt-2 text-[10.5px] text-ink-faint">Respostas simuladas para demonstração · toda consulta fica registrada em log</p>
          </div>
        )}
      </div>

      {/* Notificações */}
      <div className="relative">
        <button
          onClick={() => setMenuAberto(menuAberto === 'sino' ? null : 'sino')}
          className="relative rounded-lg p-2 text-ink-soft hover:bg-black/5"
          aria-label="Alertas"
        >
          <Bell size={17} />
          {naoLidas > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9.5px] font-bold text-white">
              {naoLidas}
            </span>
          )}
        </button>
        {menuAberto === 'sino' && (
          <div className="absolute right-0 top-11 w-[380px] rounded-xl border border-line bg-surface shadow-raised animate-fade-up">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <p className="text-[12.5px] font-semibold text-ink">Alertas</p>
              <button onClick={marcarTodasLidas} className="text-[11px] font-medium text-brand-600 hover:text-brand-700">
                Marcar todas como lidas
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-1.5">
              {notificacoes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    marcarLida(n.id)
                    setMenuAberto(null)
                    if (n.rota) navigate(n.rota)
                  }}
                  className={`block w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-canvas ${!n.lida ? '' : 'opacity-55'}`}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        n.tipo === 'critico' ? 'bg-red-500 animate-pulse-soft' : n.tipo === 'comercial' ? 'bg-gold-400' : n.tipo === 'financeiro' ? 'bg-amber-500' : n.tipo === 'clinico' ? 'bg-brand-500' : 'bg-sky-400'
                      } ${n.lida ? 'opacity-30' : ''}`}
                    />
                    <span className="min-w-0">
                      <span className="block text-[12.5px] font-medium leading-snug text-ink">{n.titulo}</span>
                      <span className="mt-0.5 block text-[11.5px] leading-snug text-ink-muted">{n.descricao}</span>
                      <span className="mt-0.5 block text-[10.5px] text-ink-faint">{fmtAtras(n.em)}</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Perfil / troca de papel */}
      <div className="relative">
        <button
          onClick={() => setMenuAberto(menuAberto === 'perfil' ? null : 'perfil')}
          className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-black/5"
        >
          <Avatar nome={prof?.nome ?? 'Usuário'} cor={prof?.avatarColor} size={30} />
          <span className="text-left">
            <span className="block max-w-[130px] truncate text-[12px] font-semibold leading-tight text-ink">{prof?.nome}</span>
            <span className="block text-[10.5px] leading-tight text-ink-muted">
              {papeis.find((p) => p.id === papel)?.label} · {unidade?.nome.replace('M. Luther ', '')}
            </span>
          </span>
          <ChevronDown size={13} className="text-ink-faint" />
        </button>
        {menuAberto === 'perfil' && (
          <div className="absolute right-0 top-11 w-64 rounded-xl border border-line bg-surface p-1.5 shadow-raised animate-fade-up">
            <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Ver como (troca de papel)</p>
            {papeis.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPapel(p.id)
                  setMenuAberto(null)
                  navigate('/')
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[12.5px] text-ink hover:bg-canvas"
              >
                <span className="flex items-center gap-2">
                  <Avatar nome={profById(papelDefault(p.id))?.nome ?? ''} cor={profById(papelDefault(p.id))?.avatarColor} size={22} />
                  {p.label} — {profById(papelDefault(p.id))?.nome.split(' ').slice(0, 2).join(' ')}
                </span>
                {papel === p.id && <Check size={14} className="text-brand-600" />}
              </button>
            ))}
            <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Unidade</p>
            {unidades.map((u) => (
              <button
                key={u.id}
                onClick={() => setUnidade(u.id)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[12.5px] text-ink hover:bg-canvas"
              >
                <span className="flex items-center gap-2">
                  <Building2 size={14} className="text-ink-muted" /> {u.nome}
                </span>
                {unidadeId === u.id && <Check size={14} className="text-brand-600" />}
              </button>
            ))}
            <div className="mt-1 border-t border-line pt-1">
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] text-ink hover:bg-canvas"
              >
                <LogOut size={14} className="text-ink-muted" /> Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function papelDefault(p: Papel): string {
  return { medico: 'prof-otavio', recepcao: 'prof-patricia', comercial: 'prof-diego', gestor: 'prof-renata' }[p]
}
