import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowUpRight } from 'lucide-react'
import { contatos } from '@/data/contacts'
import { unidades } from '@/data/team'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { PageHeader } from '@/components/layout/PageHeader'
import { useUiStore } from '@/stores/useUiStore'
import { brl, fmtData } from '@/lib/format'

export default function Patients() {
  const navigate = useNavigate()
  const abrirContexto = useUiStore((s) => s.abrirContexto)
  const [busca, setBusca] = useState('')
  const [tipo, setTipo] = useState<'todos' | 'lead' | 'paciente'>('todos')
  const [origem, setOrigem] = useState('todas')

  const lista = useMemo(
    () =>
      contatos
        .filter((c) => (tipo === 'todos' ? true : c.tipo === tipo))
        .filter((c) => (origem === 'todas' ? true : c.origem === origem))
        .filter((c) => c.nome.toLowerCase().includes(busca.toLowerCase()) || c.interesse?.toLowerCase().includes(busca.toLowerCase()))
        .sort((a, b) => b.ltv - a.ltv),
    [busca, tipo, origem],
  )

  return (
    <div className="mx-auto max-w-[1150px] p-6">
      <PageHeader
        titulo="Pacientes e leads"
        subtitulo={`${contatos.filter((c) => c.tipo === 'paciente').length} pacientes · ${contatos.filter((c) => c.tipo === 'lead').length} leads · cadastro unificado, sem perda de histórico`}
      />

      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input className="input pl-9" placeholder="Buscar por nome ou interesse..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <div className="flex gap-1">
          {(['todos', 'lead', 'paciente'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={`rounded-lg px-3 py-2 text-[12px] font-medium capitalize transition-colors ${tipo === t ? 'bg-ink text-white' : 'bg-black/5 text-ink-soft hover:bg-black/10'}`}
            >
              {t === 'todos' ? 'Todos' : t === 'lead' ? 'Leads' : 'Pacientes'}
            </button>
          ))}
        </div>
        <select className="input w-auto" value={origem} onChange={(e) => setOrigem(e.target.value)}>
          <option value="todas">Todas as origens</option>
          <option>Instagram Ads</option>
          <option>Google</option>
          <option>Indicação</option>
          <option>Site</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line bg-canvas text-[10.5px] font-semibold uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-2.5">Nome</th>
              <th className="px-4 py-2.5">Tipo</th>
              <th className="px-4 py-2.5">Interesse</th>
              <th className="px-4 py-2.5">Origem</th>
              <th className="px-4 py-2.5">Unidade</th>
              <th className="px-4 py-2.5">Desde</th>
              <th className="px-4 py-2.5 text-right">LTV</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {lista.map((c) => (
              <tr key={c.id} className="cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-canvas" onClick={() => navigate(`/pacientes/${c.id}`)}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar nome={c.nome} cor={c.avatarColor} size={30} />
                    <div>
                      <p className="text-[12.5px] font-medium text-ink">{c.nome}</p>
                      <p className="text-[10.5px] text-ink-muted">{c.idade} anos{c.profissao ? ` · ${c.profissao}` : ''}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5"><StatusPill status={c.tipo} /></td>
                <td className="px-4 py-2.5 text-[12px] text-ink-soft">{c.interesse}</td>
                <td className="px-4 py-2.5 text-[12px] text-ink-soft">{c.origem}</td>
                <td className="px-4 py-2.5 text-[12px] text-ink-soft">{unidades.find((u) => u.id === c.unidadeId)?.nome.replace('M. Luther ', '')}</td>
                <td className="px-4 py-2.5 text-[12px] text-ink-muted">{fmtData(c.criadoEm)}</td>
                <td className={`px-4 py-2.5 text-right text-[12.5px] font-semibold ${c.ltv > 0 ? 'text-gold-700' : 'text-ink-faint'}`}>{c.ltv > 0 ? brl(c.ltv) : '—'}</td>
                <td className="px-4 py-2.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      abrirContexto(c.id)
                    }}
                    className="rounded-lg p-1.5 text-ink-faint hover:bg-black/5 hover:text-ink"
                    title="Painel rápido"
                  >
                    <ArrowUpRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
