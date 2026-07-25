import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { BrandStoryModal } from '@/components/modules/BrandStory'
import {
  Home,
  Inbox,
  KanbanSquare,
  CalendarDays,
  Users,
  HeartPulse,
  Video,
  FileSignature,
  BarChart3,
  Megaphone,
  Wallet,
  Receipt,
  Boxes,
  MessagesSquare,
  Settings,
  Smartphone,
  TabletSmartphone,
  PlayCircle,
  Lock,
  Gem,
} from 'lucide-react'
import { useUiStore } from '@/stores/useUiStore'
import { useInboxStore } from '@/stores/useInboxStore'

interface Item {
  rota?: string
  label: string
  icone: typeof Home
  badge?: number
  emBreve?: boolean
}

export function Sidebar({ onAbrirDemo }: { onAbrirDemo: () => void }) {
  const navigate = useNavigate()
  const [marcaAberta, setMarcaAberta] = useState(false)
  const naoLidas = useInboxStore((s) => s.conversas.reduce((acc, c) => acc + c.naoLidas, 0))
  const notifCriticas = useUiStore((s) => s.notificacoes.filter((n) => !n.lida && n.tipo === 'critico').length)

  const grupos: { titulo: string; itens: Item[] }[] = [
    {
      titulo: 'Relacionamento',
      itens: [
        { rota: '/inbox', label: 'Caixa de entrada', icone: Inbox, badge: naoLidas },
        { rota: '/crm', label: 'CRM comercial', icone: KanbanSquare },
        { rota: '/marketing', label: 'Marketing', icone: Megaphone },
      ],
    },
    {
      titulo: 'Atendimento',
      itens: [
        { rota: '/agenda', label: 'Agenda & Recepção', icone: CalendarDays },
        { rota: '/pacientes', label: 'Pacientes', icone: Users },
        { rota: '/pos-atendimento', label: 'Pós-atendimento', icone: HeartPulse, badge: notifCriticas },
        { rota: '/teleconsulta', label: 'Teleconsulta', icone: Video },
      ],
    },
    {
      titulo: 'Gestão',
      itens: [
        { rota: '/contratos', label: 'Contratos', icone: FileSignature },
        { rota: '/dashboards', label: 'Dashboards', icone: BarChart3 },
        { label: 'Financeiro', icone: Wallet, emBreve: true },
        { label: 'Faturamento TISS', icone: Receipt, emBreve: true },
        { label: 'Estoque', icone: Boxes, emBreve: true },
        { label: 'Chat interno', icone: MessagesSquare, emBreve: true },
        { label: 'Configurações', icone: Settings, emBreve: true },
      ],
    },
  ]

  return (
    <aside className="flex h-screen w-[218px] shrink-0 flex-col bg-brand-950 text-white/80">
      {/* Logo */}
      <button onClick={() => navigate('/')} className="flex items-center gap-2.5 px-5 pb-5 pt-6 text-left">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-display text-[17px] font-bold text-white">
          Z
        </span>
        <span>
          <span className="block font-display text-[16px] font-semibold leading-none tracking-wide text-white">Zaleva</span>
          <span className="mt-0.5 block text-[9.5px] uppercase tracking-[0.14em] text-white/40">Clínica M. Luther</span>
        </span>
      </button>

      {/* Visão geral */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-none">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium transition-colors ${
              isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <Home size={15} /> Central de trabalho
        </NavLink>

        {grupos.map((g) => (
          <div key={g.titulo} className="mt-5">
            <p className="px-2.5 pb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white/35">{g.titulo}</p>
            <div className="space-y-0.5">
              {g.itens.map((item) =>
                item.emBreve ? (
                  <div
                    key={item.label}
                    title="Disponível na versão completa"
                    className="flex cursor-not-allowed items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] text-white/30"
                  >
                    <item.icone size={15} />
                    <span className="flex-1">{item.label}</span>
                    <Lock size={10} className="text-white/20" />
                  </div>
                ) : (
                  <NavLink
                    key={item.rota}
                    to={item.rota!}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium transition-colors ${
                        isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <item.icone size={15} />
                    <span className="flex-1">{item.label}</span>
                    {!!item.badge && (
                      <span className="rounded-full bg-red-500 px-1.5 py-px text-[10px] font-bold text-white">{item.badge}</span>
                    )}
                  </NavLink>
                ),
              )}
            </div>
          </div>
        ))}

        <div className="mt-5 border-t border-white/10 pt-4">
          <NavLink
            to="/portal"
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium transition-colors ${
                isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Smartphone size={15} /> Portal do paciente
          </NavLink>
          <NavLink
            to="/app-medico"
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium transition-colors ${
                isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <TabletSmartphone size={15} /> App do médico
          </NavLink>
          <button
            onClick={onAbrirDemo}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white"
          >
            <PlayCircle size={15} /> Modo demo
          </button>
          <button
            onClick={() => setMarcaAberta(true)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Gem size={15} /> Sobre a marca
          </button>
        </div>
      </nav>

      <p className="px-5 pb-4 text-[9.5px] leading-relaxed text-white/25">
        Protótipo demonstrativo · dados fictícios
      </p>

      <BrandStoryModal aberto={marcaAberta} onFechar={() => setMarcaAberta(false)} />
    </aside>
  )
}
