import { useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from 'recharts'
import { Target, Wallet, Star, Users, Clock, Repeat, CalendarCheck } from 'lucide-react'
import { useCrmStore, etapasFunil } from '@/stores/useCrmStore'
import { useBillingStore } from '@/stores/useBillingStore'
import { historicoFinanceiro, campanhas, motivosPerda } from '@/data/billing'
import { contatoById } from '@/data/contacts'
import { Stat } from '@/components/ui/Stat'
import { Tabs } from '@/components/ui/Tabs'
import { PageHeader } from '@/components/layout/PageHeader'
import { brl, fmtMes, pct } from '@/lib/format'

const CORES = ['#0F6B5C', '#3FA48D', '#CCA84A', '#155E63', '#8B5CF6', '#9D174D', '#B45309']

const tooltipStyle = {
  borderRadius: 10,
  border: '1px solid #E8E7E2',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  fontSize: 12,
  fontFamily: 'inherit',
}

const fmtMil = (v: number) => `${Math.round(v / 1000)}k`

export default function Dashboards() {
  const [aba, setAba] = useState('comercial')
  return (
    <div className="mx-auto max-w-[1200px] p-6">
      <PageHeader titulo="Dashboards" subtitulo="Indicadores ao vivo — refletem cada mudança feita no CRM, na agenda e no financeiro durante a demonstração" />
      <Tabs
        className="mb-5"
        ativa={aba}
        onMudar={setAba}
        tabs={[
          { id: 'comercial', label: 'Comercial' },
          { id: 'financeiro', label: 'Financeiro' },
          { id: 'executivo', label: 'Executivo' },
        ]}
      />
      {aba === 'comercial' && <DashComercial />}
      {aba === 'financeiro' && <DashFinanceiro />}
      {aba === 'executivo' && <DashExecutivo />}
    </div>
  )
}

// ─── COMERCIAL ───────────────────────────────────────────────────────────────
function DashComercial() {
  const negociacoes = useCrmStore((s) => s.negociacoes)

  const funil = useMemo(
    () =>
      etapasFunil
        .filter((e) => e.id !== 'perdido')
        .map((e) => ({
          etapa: e.nome,
          negociacoes: negociacoes.filter((d) => d.etapa === e.id).length,
          valor: negociacoes.filter((d) => d.etapa === e.id).reduce((a, d) => a + d.valor, 0),
        })),
    [negociacoes],
  )

  const porOrigem = useMemo(() => {
    const mapa: Record<string, number> = {}
    negociacoes.forEach((d) => {
      const origem = contatoById(d.contactId)?.origem ?? 'Outro'
      mapa[origem] = (mapa[origem] ?? 0) + 1
    })
    return Object.entries(mapa).map(([origem, leads]) => ({ origem, leads }))
  }, [negociacoes])

  const fechadas = negociacoes.filter((d) => d.etapa === 'fechado')
  const perdidas = negociacoes.filter((d) => d.etapa === 'perdido')
  const taxaFechamento = fechadas.length + perdidas.length > 0 ? (fechadas.length / (fechadas.length + perdidas.length)) * 100 : 0

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        <Stat label="Funil ativo" valor={brl(negociacoes.filter((d) => !['fechado', 'perdido'].includes(d.etapa)).reduce((a, d) => a + d.valor, 0))} sufixo={`${negociacoes.filter((d) => !['fechado', 'perdido'].includes(d.etapa)).length} negociações`} icone={<Target size={15} />} />
        <Stat label="Fechadas (mês)" valor={brl(fechadas.reduce((a, d) => a + d.valor, 0))} dourado sufixo={`${fechadas.length} contrato(s)`} icone={<Wallet size={15} />} />
        <Stat label="Taxa de fechamento" valor={pct(taxaFechamento)} sufixo="ganhas ÷ decididas" delta="+6 p.p. vs mês anterior" icone={<Target size={15} />} />
        <Stat label="Tempo de 1ª resposta" valor="4 min" sufixo="mediana omnichannel" delta="−38% com agente de IA" icone={<Clock size={15} />} />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="mb-1 text-[13px] font-semibold text-ink">Funil por etapa</p>
          <p className="mb-4 text-[11px] text-ink-muted">Espelho exato do Kanban — mova um card e veja o gráfico mudar</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={funil} layout="vertical" margin={{ left: 30, right: 16 }}>
              <CartesianGrid horizontal={false} stroke="#EFEEE9" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#8E8E96' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="etapa" width={128} tick={{ fontSize: 11, fill: '#52525B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number, nome) => (nome === 'valor' ? brl(v) : v)} />
              <Bar dataKey="negociacoes" name="Negociações" fill="#0F6B5C" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <p className="mb-1 text-[13px] font-semibold text-ink">Leads por origem</p>
          <p className="mb-4 text-[11px] text-ink-muted">Negociações ativas + decididas por canal de aquisição</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={porOrigem} margin={{ right: 16 }}>
              <CartesianGrid vertical={false} stroke="#EFEEE9" />
              <XAxis dataKey="origem" tick={{ fontSize: 11, fill: '#52525B' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8E8E96' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="leads" name="Negociações" radius={[6, 6, 0, 0]} barSize={42}>
                {porOrigem.map((_, i) => (
                  <Cell key={i} fill={CORES[i % CORES.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="card col-span-2 p-5">
          <p className="mb-1 text-[13px] font-semibold text-ink">Atribuição completa — campanha → receita</p>
          <p className="mb-3 text-[11px] text-ink-muted">Cada real investido rastreado até o contrato fechado</p>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                <th className="py-2">Campanha</th>
                <th className="py-2 text-right">Invest.</th>
                <th className="py-2 text-right">Leads</th>
                <th className="py-2 text-right">Agend.</th>
                <th className="py-2 text-right">Fechados</th>
                <th className="py-2 text-right">Receita</th>
                <th className="py-2 text-right">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {campanhas.map((c) => (
                <tr key={c.id} className="border-b border-line/50 text-[12px] last:border-0">
                  <td className="py-2 font-medium text-ink">{c.nome}<span className="ml-1.5 text-[10px] text-ink-faint">{c.canal}</span></td>
                  <td className="py-2 text-right text-ink-muted">{c.investimento ? brl(c.investimento) : '—'}</td>
                  <td className="py-2 text-right text-ink-soft">{c.leads}</td>
                  <td className="py-2 text-right text-ink-soft">{c.agendamentos}</td>
                  <td className="py-2 text-right text-ink-soft">{c.fechamentos}</td>
                  <td className="py-2 text-right font-semibold text-gold-700">{brl(c.receita)}</td>
                  <td className="py-2 text-right font-semibold text-brand-700">{c.investimento ? `${(c.receita / c.investimento).toFixed(1)}x` : '∞'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card p-5">
          <p className="mb-3 text-[13px] font-semibold text-ink">Motivos de perda</p>
          {motivosPerda.map((m) => {
            const max = Math.max(...motivosPerda.map((x) => x.qtd))
            return (
              <div key={m.motivo} className="mb-2.5">
                <div className="flex justify-between text-[11.5px]">
                  <span className="text-ink-soft">{m.motivo}</span>
                  <span className="font-semibold text-ink">{m.qtd}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/5">
                  <div className="h-full rounded-full bg-red-400/70" style={{ width: `${(m.qtd / max) * 100}%` }} />
                </div>
              </div>
            )
          })}
          <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-ink-muted">
            💡 <strong>Insight da IA:</strong> "Preço" lidera as perdas — negociações com simulador de parcelamento apresentado convertem 22% mais.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── FINANCEIRO ──────────────────────────────────────────────────────────────
function DashFinanceiro() {
  const parcelas = useBillingStore((s) => s.parcelas)
  const dados = historicoFinanceiro.map((m) => ({
    mes: fmtMes(m.mes),
    Prevista: m.receitaPrevista,
    Realizada: m.receitaRealizada,
    Despesas: m.despesas,
  }))

  const aReceber = parcelas.filter((p) => p.status === 'aberto').reduce((a, p) => a + p.valor, 0)
  const vencidas = parcelas.filter((p) => p.status === 'vencido').reduce((a, p) => a + p.valor, 0)
  const mesAtual = historicoFinanceiro[historicoFinanceiro.length - 1]

  const porProfissional = [
    { nome: 'Dr. Renato', receita: 128400 },
    { nome: 'Dra. Letícia', receita: 96200 },
    { nome: 'Dr. Bruno', receita: 81900 },
    { nome: 'Dra. Camila', receita: 28100 },
  ]
  const porProcedimento = [
    { nome: 'Lipo HD', receita: 114000 },
    { nome: 'Rinoplastia', receita: 106500 },
    { nome: 'Abdominoplastia', receita: 64700 },
    { nome: 'Mamoplastia', receita: 57400 },
    { nome: 'Blefaroplastia', receita: 30000 },
    { nome: 'Injetáveis', receita: 22000 },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        <Stat label="Receita do mês (parcial)" valor={brl(mesAtual.receitaRealizada)} sufixo={`meta ${brl(mesAtual.receitaPrevista)}`} dourado icone={<Wallet size={15} />} />
        <Stat label="A receber" valor={brl(aReceber)} sufixo={`${parcelas.filter((p) => p.status === 'aberto').length} parcelas`} icone={<CalendarCheck size={15} />} />
        <Stat label="Inadimplência" valor={brl(vencidas)} sufixo="0,9% da carteira" deltaBom={false} delta="1 paciente em cobrança" icone={<Clock size={15} />} />
        <Stat label="Ticket médio cirúrgico" valor={brl(31600)} delta="+8% no semestre" icone={<Target size={15} />} />
      </div>

      <div className="card p-5">
        <p className="mb-1 text-[13px] font-semibold text-ink">Receita prevista × realizada — últimos 6 meses</p>
        <p className="mb-4 text-[11px] text-ink-muted">O mês atual está em andamento (parcial)</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={dados} margin={{ right: 16 }}>
            <CartesianGrid vertical={false} stroke="#EFEEE9" />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#52525B' }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtMil} tick={{ fontSize: 11, fill: '#8E8E96' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => brl(v)} />
            <Legend wrapperStyle={{ fontSize: 11.5 }} />
            <Bar dataKey="Prevista" fill="#D5EDE6" radius={[5, 5, 0, 0]} barSize={22} />
            <Bar dataKey="Realizada" fill="#0F6B5C" radius={[5, 5, 0, 0]} barSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="mb-4 text-[13px] font-semibold text-ink">Receita por profissional (semestre)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={porProfissional} layout="vertical" margin={{ left: 20, right: 30 }}>
              <CartesianGrid horizontal={false} stroke="#EFEEE9" />
              <XAxis type="number" tickFormatter={fmtMil} tick={{ fontSize: 11, fill: '#8E8E96' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="nome" width={90} tick={{ fontSize: 11.5, fill: '#52525B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => brl(v)} />
              <Bar dataKey="receita" name="Receita" fill="#155E63" radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <p className="mb-4 text-[13px] font-semibold text-ink">Receita por procedimento (semestre)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={porProcedimento} layout="vertical" margin={{ left: 20, right: 30 }}>
              <CartesianGrid horizontal={false} stroke="#EFEEE9" />
              <XAxis type="number" tickFormatter={fmtMil} tick={{ fontSize: 11, fill: '#8E8E96' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="nome" width={100} tick={{ fontSize: 11.5, fill: '#52525B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => brl(v)} />
              <Bar dataKey="receita" name="Receita" fill="#CCA84A" radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// ─── EXECUTIVO ───────────────────────────────────────────────────────────────
function DashExecutivo() {
  const negociacoes = useCrmStore((s) => s.negociacoes)
  const dados = historicoFinanceiro.map((m) => ({
    mes: fmtMes(m.mes),
    NPS: m.nps,
    'Novos pacientes': m.novosPacientes,
    Consultas: m.consultas,
  }))
  const mesAtual = historicoFinanceiro[historicoFinanceiro.length - 1]
  const resultado = mesAtual.receitaRealizada - mesAtual.despesas

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        <Stat label="Resultado do mês (parcial)" valor={brl(resultado)} dourado delta="margem de 48%" icone={<Wallet size={15} />} />
        <Stat label="NPS" valor={String(mesAtual.nps)} delta="+13 pontos em 6 meses" icone={<Star size={15} />} />
        <Stat label="Ocupação da agenda" valor="78%" sufixo="capacidade semanal" delta="+5 p.p." icone={<CalendarCheck size={15} />} />
        <Stat label="Recorrência" valor="34%" sufixo="pacientes com 2+ procedimentos" delta="programa de indicação ativo" icone={<Repeat size={15} />} />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="mb-1 text-[13px] font-semibold text-ink">Evolução do NPS</p>
          <p className="mb-4 text-[11px] text-ink-muted">Impacto direto das jornadas de pós-atendimento automatizadas</p>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={dados} margin={{ right: 16 }}>
              <CartesianGrid vertical={false} stroke="#EFEEE9" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#52525B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#8E8E96' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="NPS" stroke="#0F6B5C" strokeWidth={2.5} dot={{ r: 3.5, fill: '#0F6B5C' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <p className="mb-1 text-[13px] font-semibold text-ink">Crescimento — novos pacientes e consultas</p>
          <p className="mb-4 text-[11px] text-ink-muted">Aquisição alimentada pelo funil de marketing integrado</p>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={dados} margin={{ right: 16 }}>
              <CartesianGrid vertical={false} stroke="#EFEEE9" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#52525B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8E8E96' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11.5 }} />
              <Line type="monotone" dataKey="Consultas" stroke="#155E63" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Novos pacientes" stroke="#CCA84A" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5">
        <p className="mb-3 text-[13px] font-semibold text-ink">A jornada integrada em números — este mês</p>
        <div className="grid grid-cols-7 gap-2">
          {[
            { label: 'Leads', valor: '58', icone: Users },
            { label: 'Conversas', valor: '173', icone: Users },
            { label: 'Avaliações', valor: '31', icone: CalendarCheck },
            { label: 'Planos', valor: '14', icone: Target },
            { label: 'Contratos', valor: String(negociacoes.filter((d) => d.etapa === 'fechado').length + 2), icone: Wallet },
            { label: 'Procedimentos', valor: '6', icone: CalendarCheck },
            { label: 'Indicações', valor: '4', icone: Repeat },
          ].map((e, i) => (
            <div key={e.label} className="relative rounded-xl bg-canvas p-3 text-center">
              <p className="font-display text-[19px] font-semibold text-brand-700">{e.valor}</p>
              <p className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">{e.label}</p>
              {i < 6 && <span className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 text-ink-faint">→</span>}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-ink-muted">Do primeiro clique ao paciente que indica: cada etapa conectada é conversão que não se perde.</p>
      </div>
    </div>
  )
}
