import { useUiStore } from '@/stores/useUiStore'
import { CheckCircle2, Info, AlertTriangle, Sparkles, X } from 'lucide-react'

const icones = {
  sucesso: <CheckCircle2 size={16} className="text-emerald-500" />,
  info: <Info size={16} className="text-sky-500" />,
  alerta: <AlertTriangle size={16} className="text-red-500" />,
  ia: <Sparkles size={16} className="text-ai-600" />,
}

export function Toasts() {
  const { toasts, removeToast } = useUiStore()
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex items-start gap-2.5 rounded-xl border border-line bg-surface p-3.5 shadow-raised animate-fade-up">
          {icones[t.tipo]}
          <div className="min-w-0 flex-1">
            <p className="text-[12.5px] font-semibold text-ink">{t.titulo}</p>
            {t.descricao && <p className="mt-0.5 text-[11.5px] leading-snug text-ink-muted">{t.descricao}</p>}
          </div>
          <button onClick={() => removeToast(t.id)} className="text-ink-faint hover:text-ink" aria-label="Fechar">
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}
