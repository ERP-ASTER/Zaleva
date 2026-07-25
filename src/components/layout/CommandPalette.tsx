import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, User, KanbanSquare, LayoutDashboard, CalendarDays, Inbox, HeartPulse, FileSignature, Smartphone } from 'lucide-react'
import { useUiStore } from '@/stores/useUiStore'
import { contatos } from '@/data/contacts'
import { useCrmStore } from '@/stores/useCrmStore'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'

const telas = [
  { rota: '/', label: 'Central de trabalho', icone: LayoutDashboard },
  { rota: '/inbox', label: 'Caixa de entrada', icone: Inbox },
  { rota: '/crm', label: 'CRM comercial (Kanban)', icone: KanbanSquare },
  { rota: '/marketing', label: 'Marketing & Aquisição', icone: KanbanSquare },
  { rota: '/agenda', label: 'Agenda & Recepção', icone: CalendarDays },
  { rota: '/pacientes', label: 'Pacientes', icone: User },
  { rota: '/pos-atendimento', label: 'Pós-atendimento & Jornadas', icone: HeartPulse },
  { rota: '/contratos', label: 'Contratos & Assinatura', icone: FileSignature },
  { rota: '/dashboards', label: 'Dashboards', icone: LayoutDashboard },
  { rota: '/portal', label: 'Portal do paciente', icone: Smartphone },
  { rota: '/app-medico', label: 'App do médico', icone: Smartphone },
]

export function CommandPalette() {
  const { cmdAberto, setCmdAberto } = useUiStore()
  const [busca, setBusca] = useState('')
  const navigate = useNavigate()
  const deals = useCrmStore((s) => s.negociacoes)

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdAberto(!cmdAberto)
      }
      if (e.key === 'Escape') setCmdAberto(false)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [cmdAberto, setCmdAberto])

  useEffect(() => {
    if (!cmdAberto) setBusca('')
  }, [cmdAberto])

  const q = busca.trim().toLowerCase()
  const resultados = useMemo(() => {
    const pessoas = q
      ? contatos.filter((c) => c.nome.toLowerCase().includes(q) || c.interesse?.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q))).slice(0, 6)
      : contatos.slice(0, 4)
    const negs = q ? deals.filter((d) => d.titulo.toLowerCase().includes(q)).slice(0, 4) : []
    const tls = q ? telas.filter((t) => t.label.toLowerCase().includes(q)) : telas
    return { pessoas, negs, tls }
  }, [q, deals])

  if (!cmdAberto) return null

  const ir = (rota: string) => {
    setCmdAberto(false)
    navigate(rota)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh]">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-fade-in" onClick={() => setCmdAberto(false)} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-surface shadow-overlay animate-fade-up">
        <div className="flex items-center gap-2.5 border-b border-line px-4">
          <Search size={16} className="text-ink-faint" />
          <input
            autoFocus
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Busque pacientes, leads, negociações ou telas..."
            className="w-full bg-transparent py-3.5 text-[14px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-ink-muted">ESC</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {resultados.pessoas.length > 0 && (
            <>
              <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Pessoas</p>
              {resultados.pessoas.map((c) => (
                <button key={c.id} onClick={() => ir(`/pacientes/${c.id}`)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-canvas">
                  <Avatar nome={c.nome} cor={c.avatarColor} size={26} />
                  <span className="flex-1 text-left text-[13px] text-ink">{c.nome}</span>
                  <span className="text-[11px] text-ink-muted">{c.interesse}</span>
                  <StatusPill status={c.tipo} />
                </button>
              ))}
            </>
          )}
          {resultados.negs.length > 0 && (
            <>
              <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Negociações</p>
              {resultados.negs.map((d) => (
                <button key={d.id} onClick={() => ir(`/crm/${d.id}`)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-canvas">
                  <KanbanSquare size={15} className="text-ink-muted" />
                  <span className="flex-1 text-left text-[13px] text-ink">{d.titulo}</span>
                  <span className="text-[11px] font-medium text-ink-muted">R$ {(d.valor / 1000).toFixed(0)} mil</span>
                </button>
              ))}
            </>
          )}
          <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Telas</p>
          {resultados.tls.map((t) => (
            <button key={t.rota} onClick={() => ir(t.rota)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-canvas">
              <t.icone size={15} className="text-ink-muted" />
              <span className="text-[13px] text-ink">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
