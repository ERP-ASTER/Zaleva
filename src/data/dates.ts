import { addDays, addMonths, setHours, setMinutes, startOfWeek, subDays, subMonths } from 'date-fns'

/** Datas sempre relativas a `new Date()` para a demo nunca parecer velha. */

export const agora = () => new Date().toISOString()

export const emDias = (dias: number, hora = 9, min = 0) =>
  setMinutes(setHours(addDays(new Date(), dias), hora), min).toISOString()

export const diasAtras = (dias: number, hora = 10, min = 0) =>
  setMinutes(setHours(subDays(new Date(), dias), hora), min).toISOString()

export const mesesAtras = (meses: number, dia = 15, hora = 10) => {
  const d = subMonths(new Date(), meses)
  d.setDate(Math.min(dia, 28))
  return setMinutes(setHours(d, hora), 0).toISOString()
}

export const emMeses = (meses: number, dia = 10) => {
  const d = addMonths(new Date(), meses)
  d.setDate(Math.min(dia, 28))
  return setMinutes(setHours(d, 10), 0).toISOString()
}

/** Dia da semana atual: 0 = segunda-feira desta semana. */
export const diaDaSemana = (offsetSegunda: number, hora = 9, min = 0) => {
  const seg = startOfWeek(new Date(), { weekStartsOn: 1 })
  return setMinutes(setHours(addDays(seg, offsetSegunda), hora), min).toISOString()
}

export const horasAtras = (horas: number, min = 0) => {
  const d = new Date(Date.now() - horas * 3600_000 - min * 60_000)
  return d.toISOString()
}

export const minutosAtras = (min: number) => new Date(Date.now() - min * 60_000).toISOString()
