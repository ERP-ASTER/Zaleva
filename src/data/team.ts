import type { Professional, Unit } from './types'

export const unidades: Unit[] = [
  { id: 'un-toledo', nome: 'M. Luther Toledo', endereco: 'Av. Maripá, 2410 — Centro, Toledo' },
  { id: 'un-eldorado', nome: 'M. Luther Eldorado', endereco: 'Av. Brasil, 890 — Centro, Eldorado' },
]

export const equipe: Professional[] = [
  { id: 'prof-otavio', nome: 'Dr. Renato Somensi', papel: 'cirurgiao', especialidade: 'Cirurgia Plástica', registro: 'CRM 2469-MS', cor: '#0F6B5C', avatarColor: '#0F6B5C', foto: '/avatars/dr-renato.jpg' },
  { id: 'prof-leticia', nome: 'Dra. Letícia Fontes', papel: 'cirurgiao', especialidade: 'Cirurgia Plástica', registro: 'CRM-MS 128.774', cor: '#155E63', avatarColor: '#155E63' },
  { id: 'prof-bruno', nome: 'Dr. Bruno Rezende', papel: 'cirurgiao', especialidade: 'Cirurgia Plástica', registro: 'CRM-MS 134.918', cor: '#7C5B28', avatarColor: '#7C5B28' },
  { id: 'prof-camila', nome: 'Dra. Camila Iwata', papel: 'dermatologista', especialidade: 'Dermatologia', registro: 'CRM-MS 141.203', cor: '#8B5CF6', avatarColor: '#6636C4' },
  { id: 'prof-patricia', nome: 'Patrícia Lemos', papel: 'recepcao', avatarColor: '#B45309', cor: '#B45309' },
  { id: 'prof-suelen', nome: 'Suelen Barros', papel: 'recepcao', avatarColor: '#0E7490', cor: '#0E7490' },
  { id: 'prof-diego', nome: 'Diego Antunes', papel: 'comercial', avatarColor: '#9D174D', cor: '#9D174D' },
  { id: 'prof-renata', nome: 'Renata Vilaça', papel: 'gestor', avatarColor: '#1E3A8A', cor: '#1E3A8A' },
]

export const profById = (id?: string) => equipe.find((p) => p.id === id)

export const papelPadraoProf: Record<string, string> = {
  medico: 'prof-otavio',
  recepcao: 'prof-patricia',
  comercial: 'prof-diego',
  gestor: 'prof-renata',
}
