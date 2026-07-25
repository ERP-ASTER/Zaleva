import { useState } from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { ContextPanel } from './ContextPanel'
import { CommandPalette } from './CommandPalette'
import { Toasts } from '@/components/ui/Toasts'
import { Modal } from '@/components/ui/Modal'
import { useSessionStore } from '@/stores/useSessionStore'
import { MessageCircle, Stethoscope, HeartPulse, RotateCcw } from 'lucide-react'

export function AppShell() {
  const logado = useSessionStore((s) => s.logado)
  const [demoAberto, setDemoAberto] = useState(false)
  const navigate = useNavigate()

  if (!logado) return <Navigate to="/login" replace />

  const jornadas = [
    {
      icone: <MessageCircle size={18} className="text-brand-600" />,
      titulo: 'Jornada 1 — Lead até fechamento (Mariana)',
      descricao: 'Caixa de entrada → CRM → avaliação → consulta com IA → orçamento aceito → cascata automática → dashboard.',
      rota: '/inbox',
      papel: 'comercial' as const,
    },
    {
      icone: <Stethoscope size={18} className="text-brand-600" />,
      titulo: 'Jornada 2 — Consulta assistida por IA',
      descricao: 'Agenda → check-in → prontuário → transcrição → rascunho da IA → revisão → aprovação → prescrição assinada.',
      rota: '/agenda',
      papel: 'medico' as const,
    },
    {
      icone: <HeartPulse size={18} className="text-red-500" />,
      titulo: 'Jornada 3 — Pós-operatório crítico (Carla)',
      descricao: 'Check-in D+1 com dor 8/10 → alerta global → equipe age → resolução registrada na timeline.',
      rota: '/pos-atendimento',
      papel: 'medico' as const,
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onAbrirDemo={() => setDemoAberto(true)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <ContextPanel />
      <CommandPalette />
      <Toasts />

      <Modal aberto={demoAberto} onFechar={() => setDemoAberto(false)} titulo="Modo demo — jornadas roteirizadas" larguraMax="max-w-xl">
        <p className="mb-4 text-[12.5px] text-ink-muted">
          Três narrativas de ponta a ponta para apresentação. Cada atalho troca para o papel adequado e leva ao início da jornada.
        </p>
        <div className="space-y-2.5">
          {jornadas.map((j) => (
            <button
              key={j.titulo}
              onClick={() => {
                useSessionStore.getState().setPapel(j.papel)
                setDemoAberto(false)
                navigate(j.rota)
              }}
              className="flex w-full items-start gap-3 rounded-xl border border-line p-4 text-left transition-all hover:border-brand-300 hover:shadow-card"
            >
              <span className="mt-0.5">{j.icone}</span>
              <span>
                <span className="block text-[13.5px] font-semibold text-ink">{j.titulo}</span>
                <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-muted">{j.descricao}</span>
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => window.location.assign('/')}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line py-2.5 text-[12.5px] font-medium text-ink-muted hover:border-ink-faint hover:text-ink"
        >
          <RotateCcw size={13} /> Reiniciar dados da demonstração
        </button>
      </Modal>
    </div>
  )
}
