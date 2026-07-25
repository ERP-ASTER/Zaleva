import { format, formatDistanceToNow, isToday, isYesterday, differenceInCalendarDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: v % 1 === 0 ? 0 : 2 })

export const brlFull = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })

export const fmtData = (iso: string) => format(new Date(iso), 'dd/MM/yyyy', { locale: ptBR })
export const fmtDataCurta = (iso: string) => format(new Date(iso), "dd 'de' MMM", { locale: ptBR })
export const fmtDataLonga = (iso: string) => format(new Date(iso), "EEEE, dd 'de' MMMM", { locale: ptBR })
export const fmtHora = (iso: string) => format(new Date(iso), 'HH:mm', { locale: ptBR })
export const fmtDataHora = (iso: string) => format(new Date(iso), "dd/MM 'às' HH:mm", { locale: ptBR })
export const fmtMes = (iso: string) => format(new Date(iso), 'MMM', { locale: ptBR })

export const fmtRelativa = (iso: string) => {
  const d = new Date(iso)
  if (isToday(d)) return `hoje às ${format(d, 'HH:mm')}`
  if (isYesterday(d)) return `ontem às ${format(d, 'HH:mm')}`
  // Eventos com mais de ~10 meses mostram o ano (timelines longas, ex.: Ricardo)
  if (Date.now() - d.getTime() > 300 * 86400_000) return format(d, "dd/MM/yy", { locale: ptBR })
  return format(d, "dd/MM 'às' HH:mm", { locale: ptBR })
}

export const fmtAtras = (iso: string) =>
  formatDistanceToNow(new Date(iso), { locale: ptBR, addSuffix: true })

export const diasDesde = (iso: string) => differenceInCalendarDays(new Date(), new Date(iso))

export const diaPosOp = (iso: string) => {
  const d = differenceInCalendarDays(new Date(), new Date(iso))
  return d >= 0 ? `D+${d}` : `D${d}`
}

export const iniciais = (nome: string) =>
  nome
    .split(' ')
    .filter((p) => p.length > 2 || p === p.toUpperCase())
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

export const primeiroNome = (nome: string) => nome.split(' ')[0]

export const pct = (v: number) => `${Math.round(v)}%`
