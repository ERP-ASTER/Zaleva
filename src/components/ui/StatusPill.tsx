/** Mapa único de status → cor, usado em todo o app (consistência visual). */

const estilos: Record<string, { bg: string; text: string; dot?: string; label: string }> = {
  // Agendamentos
  'pre-agendado': { bg: 'bg-zinc-100', text: 'text-zinc-600', label: 'Pré-agendado' },
  'aguardando-confirmacao': { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Aguardando confirmação' },
  confirmado: { bg: 'bg-sky-50', text: 'text-sky-700', label: 'Confirmado' },
  checkin: { bg: 'bg-brand-50', text: 'text-brand-700', label: 'Check-in feito' },
  'em-atendimento': { bg: 'bg-brand-100', text: 'text-brand-800', dot: 'bg-brand-500 animate-pulse-soft', label: 'Em atendimento' },
  finalizado: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Finalizado' },
  cancelado: { bg: 'bg-zinc-100', text: 'text-zinc-500', label: 'Cancelado' },
  'no-show': { bg: 'bg-red-50', text: 'text-red-700', label: 'Não compareceu' },

  // Conversas
  nova: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Nova' },
  ia: { bg: 'bg-ai-100', text: 'text-ai-700', dot: 'bg-ai-500 animate-pulse-soft', label: 'IA atendendo' },
  aguardando: { bg: 'bg-zinc-100', text: 'text-zinc-600', label: 'Aguardando' },
  resolvida: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Resolvida' },

  // Documentos
  rascunho: { bg: 'bg-zinc-100', text: 'text-zinc-600', label: 'Rascunho' },
  'gerado-ia': { bg: 'bg-ai-100', text: 'text-ai-700', label: 'Gerado por IA' },
  'em-revisao': { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Em revisão' },
  revisado: { bg: 'bg-sky-50', text: 'text-sky-700', label: 'Revisado' },
  assinado: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Assinado' },
  enviado: { bg: 'bg-sky-50', text: 'text-sky-700', label: 'Enviado' },
  visualizado: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Visualizado' },
  aceito: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Aceito' },
  recusado: { bg: 'bg-red-50', text: 'text-red-700', label: 'Recusado' },
  expirado: { bg: 'bg-zinc-100', text: 'text-zinc-500', label: 'Expirado' },

  // Financeiro
  pago: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Pago' },
  aberto: { bg: 'bg-sky-50', text: 'text-sky-700', label: 'Em aberto' },
  vencido: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', label: 'Vencido' },

  // Jornadas
  concluido: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Concluído' },
  pendente: { bg: 'bg-zinc-100', text: 'text-zinc-600', label: 'Pendente' },
  critico: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500 animate-pulse-soft', label: 'Crítico' },

  // Temperatura / risco
  quente: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500', label: 'Quente' },
  morno: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Morno' },
  frio: { bg: 'bg-sky-50', text: 'text-sky-600', label: 'Frio' },
  baixo: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Risco baixo' },
  medio: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Risco médio' },
  alto: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500 animate-pulse-soft', label: 'Risco alto' },

  // Genéricos
  lead: { bg: 'bg-ai-100', text: 'text-ai-700', label: 'Lead' },
  paciente: { bg: 'bg-brand-50', text: 'text-brand-700', label: 'Paciente' },
  aberta: { bg: 'bg-sky-50', text: 'text-sky-700', label: 'Em aberto' },
  finalizada: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Finalizada' },
}

export function StatusPill({ status, label, className = '' }: { status: string; label?: string; className?: string }) {
  const s = estilos[status] ?? { bg: 'bg-zinc-100', text: 'text-zinc-600', label: status }
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${s.bg} ${s.text} ${className}`}>
      {s.dot && <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />}
      {label ?? s.label}
    </span>
  )
}
