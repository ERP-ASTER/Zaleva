import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import {
  Megaphone,
  Wallet,
  Target,
  MousePointerClick,
  Pause,
  Play,
  Copy,
  ChevronRight,
  Globe,
  ShieldCheck,
  Sparkles,
  Instagram,
  Facebook,
  Newspaper,
  PenLine,
  Rocket,
  CalendarClock,
  CheckCircle2,
  Link2,
  ToggleLeft,
  ToggleRight,
  FormInput,
  Users,
  Eye,
} from 'lucide-react'
import { campanhas } from '@/data/billing'
import {
  campanhasExtras,
  leadsPorCanalMes,
  visitasSemanaisSite,
  temasSugeridos,
  type Conteudo,
  type ConteudoStatus,
  type CanalConteudo,
  type PaginaSite,
  type TemaSugerido,
} from '@/data/marketing'
import { useMarketingStore } from '@/stores/useMarketingStore'
import { useUiStore } from '@/stores/useUiStore'
import { contatos } from '@/data/contacts'
import type { CampanhaStat } from '@/data/types'
import { Stat } from '@/components/ui/Stat'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { AISuggestion, AIPensando, AIChip } from '@/components/ui/AISuggestion'
import { LutherLogo } from '@/components/modules/MedicalDoc'
import { PageHeader } from '@/components/layout/PageHeader'
import { brl, fmtMes, fmtRelativa, fmtData } from '@/lib/format'

const tooltipStyle = {
  borderRadius: 10,
  border: '1px solid #E8E7E2',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  fontSize: 12,
  fontFamily: 'inherit',
}

const pillConteudo: Record<ConteudoStatus, { status: string; label: string }> = {
  ideia: { status: 'pendente', label: 'Ideia' },
  'rascunho-ia': { status: 'gerado-ia', label: 'Rascunho IA' },
  'em-revisao': { status: 'em-revisao', label: 'Em revisão' },
  agendado: { status: 'enviado', label: 'Agendado' },
  publicado: { status: 'assinado', label: 'Publicado' },
}

const iconeCanal: Record<CanalConteudo, typeof Instagram> = { Blog: Newspaper, Instagram: Instagram, Facebook: Facebook }

export default function Marketing() {
  const [aba, setAba] = useState('visao')
  return (
    <div className="mx-auto max-w-[1200px] p-6">
      <PageHeader
        titulo="Marketing & Aquisição"
        subtitulo="Da campanha à receita — atribuição completa, site do consultório e conteúdo com IA publicado automaticamente"
      />
      <Tabs
        className="mb-5"
        ativa={aba}
        onMudar={setAba}
        tabs={[
          { id: 'visao', label: 'Visão geral' },
          { id: 'campanhas', label: 'Campanhas', badge: campanhas.length },
          { id: 'origens', label: 'Origens & Landing pages' },
          { id: 'site', label: 'Site do consultório' },
          { id: 'estudio', label: 'Estúdio de conteúdo IA', icone: <Sparkles size={12} /> },
        ]}
      />
      {aba === 'visao' && <VisaoGeral />}
      {aba === 'campanhas' && <CampanhasTab />}
      {aba === 'origens' && <OrigensTab />}
      {aba === 'site' && <SiteTab />}
      {aba === 'estudio' && <EstudioTab />}
    </div>
  )
}

// ─── 1. VISÃO GERAL ──────────────────────────────────────────────────────────
function VisaoGeral() {
  const totais = useMemo(() => {
    const investimento = campanhas.reduce((a, cp) => a + cp.investimento, 0)
    const leads = campanhas.reduce((a, cp) => a + cp.leads, 0)
    const agendamentos = campanhas.reduce((a, cp) => a + cp.agendamentos, 0)
    const fechamentos = campanhas.reduce((a, cp) => a + cp.fechamentos, 0)
    const receita = campanhas.reduce((a, cp) => a + cp.receita, 0)
    return { investimento, leads, agendamentos, fechamentos, receita }
  }, [])

  const dadosCanal = leadsPorCanalMes.map((m) => ({ ...m, mes: fmtMes(m.mes) }))

  const funil = [
    { etapa: 'Leads', valor: totais.leads, icone: Users },
    { etapa: 'Conversas', valor: Math.round(totais.leads * 0.86), icone: MousePointerClick },
    { etapa: 'Avaliações', valor: totais.agendamentos, icone: CalendarClock },
    { etapa: 'Fechamentos', valor: totais.fechamentos, icone: Target },
  ]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        <Stat label="Investimento (período)" valor={brl(totais.investimento)} sufixo="todas as campanhas" icone={<Wallet size={15} />} />
        <Stat label="Custo por lead" valor={brl(Math.round(totais.investimento / totais.leads))} sufixo={`${totais.leads} leads`} icone={<Users size={15} />} />
        <Stat label="Custo por agendamento" valor={brl(Math.round(totais.investimento / totais.agendamentos))} sufixo={`${totais.agendamentos} avaliações`} icone={<CalendarClock size={15} />} />
        <Stat label="ROAS geral" valor={`${(totais.receita / totais.investimento).toFixed(1)}x`} sufixo={brl(totais.receita) + ' em receita'} dourado icone={<Rocket size={15} />} />
      </div>

      {/* Funil de atribuição */}
      <div className="card p-5">
        <p className="mb-1 text-[13px] font-semibold text-ink">Funil de aquisição — atribuição de ponta a ponta</p>
        <p className="mb-4 text-[11px] text-ink-muted">Os mesmos números da tabela de atribuição do Dashboard comercial — uma única fonte de verdade</p>
        <div className="flex items-center gap-2">
          {funil.map((f, i) => (
            <div key={f.etapa} className="flex flex-1 items-center gap-2">
              <div className="flex-1 rounded-xl bg-canvas p-3.5 text-center">
                <f.icone size={15} className="mx-auto text-brand-600" />
                <p className="mt-1 font-display text-[20px] font-semibold text-ink">{f.valor}</p>
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">{f.etapa}</p>
                {i > 0 && (
                  <p className="mt-0.5 text-[10px] font-semibold text-brand-600">
                    {Math.round((f.valor / funil[i - 1].valor) * 100)}% do anterior
                  </p>
                )}
              </div>
              {i < funil.length - 1 && <ChevronRight size={16} className="shrink-0 text-ink-faint" />}
            </div>
          ))}
          <ChevronRight size={16} className="shrink-0 text-ink-faint" />
          <div className="flex-1 rounded-xl border border-gold-200 bg-gradient-to-br from-gold-50 to-white p-3.5 text-center">
            <Wallet size={15} className="mx-auto text-gold-500" />
            <p className="mt-1 font-display text-[20px] font-semibold text-gold-700">{brl(campanhas.reduce((a, cp) => a + cp.receita, 0))}</p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-gold-700">Receita atribuída</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="card col-span-2 p-5">
          <p className="mb-1 text-[13px] font-semibold text-ink">Leads por canal — últimos 6 meses</p>
          <p className="mb-4 text-[11px] text-ink-muted">Instagram lidera volume; Indicação lidera conversão</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dadosCanal} margin={{ right: 16 }}>
              <CartesianGrid vertical={false} stroke="#EFEEE9" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#52525B' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#8E8E96' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11.5 }} />
              <Bar dataKey="Instagram Ads" stackId="a" fill="#0F6B5C" />
              <Bar dataKey="Google" stackId="a" fill="#3FA48D" />
              <Bar dataKey="Site" stackId="a" fill="#CCA84A" />
              <Bar dataKey="Indicação" stackId="a" fill="#155E63" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <AISuggestion titulo="Análise da IA — onde investir" compacto className="h-fit">
          <ul className="space-y-2 text-[12px] leading-relaxed">
            <li>📈 <strong>"Rino Verão"</strong> tem o melhor ROAS pago (11,2x). Sugestão: +30% de verba mantém CPL abaixo de R$ 350.</li>
            <li>🤝 <strong>Indicação</strong> converte 50% dos leads em fechamento — vale ativar a campanha de indicação pós-NPS para os 3 promotores recentes.</li>
            <li>⚠️ <strong>"Mamo dos Sonhos"</strong> está pausada com funil aberto: 2 leads quentes sem campanha de remarketing ativa.</li>
          </ul>
          <p className="mt-2 border-t border-ai-200 pt-2 text-[10px] text-ink-faint">Sugestões — nenhuma alteração de verba é feita sem aprovação humana.</p>
        </AISuggestion>
      </div>
    </div>
  )
}

// ─── 2. CAMPANHAS ────────────────────────────────────────────────────────────
function CampanhasTab() {
  const { statusCampanhas, toggleCampanha } = useMarketingStore()
  const toast = useUiStore((s) => s.toast)
  const [detalhe, setDetalhe] = useState<CampanhaStat | null>(null)

  return (
    <>
      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line bg-canvas text-[10.5px] font-semibold uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-2.5">Campanha</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5 text-right">Invest.</th>
              <th className="px-4 py-2.5 text-right">Leads</th>
              <th className="px-4 py-2.5 text-right">CPL</th>
              <th className="px-4 py-2.5 text-right">Fechados</th>
              <th className="px-4 py-2.5 text-right">Receita</th>
              <th className="px-4 py-2.5 text-right">ROAS</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {campanhas.map((cp) => {
              const extra = campanhasExtras[cp.id]
              const status = statusCampanhas[cp.id]
              return (
                <tr key={cp.id} className="cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-canvas" onClick={() => setDetalhe(cp)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="h-8 w-8 shrink-0 rounded-lg" style={{ background: extra.gradiente }} />
                      <div>
                        <p className="text-[12.5px] font-semibold text-ink">{cp.nome}</p>
                        <p className="text-[10.5px] text-ink-muted">{cp.canal} · {extra.periodo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={status === 'ativa' ? 'concluido' : 'aguardando-confirmacao'} label={status === 'ativa' ? '● Ativa' : 'Pausada'} />
                  </td>
                  <td className="px-4 py-3 text-right text-[12px] text-ink-muted">{cp.investimento ? brl(cp.investimento) : '—'}</td>
                  <td className="px-4 py-3 text-right text-[12px] text-ink-soft">{cp.leads}</td>
                  <td className="px-4 py-3 text-right text-[12px] text-ink-soft">{cp.investimento ? brl(Math.round(cp.investimento / cp.leads)) : '—'}</td>
                  <td className="px-4 py-3 text-right text-[12px] text-ink-soft">{cp.fechamentos}</td>
                  <td className="px-4 py-3 text-right text-[12.5px] font-semibold text-gold-700">{brl(cp.receita)}</td>
                  <td className="px-4 py-3 text-right text-[12.5px] font-semibold text-brand-700">{cp.investimento ? `${(cp.receita / cp.investimento).toFixed(1)}x` : '∞'}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleCampanha(cp.id, cp.nome)}
                        title={status === 'ativa' ? 'Pausar' : 'Reativar'}
                        className="rounded-lg p-1.5 text-ink-muted hover:bg-black/5 hover:text-ink"
                      >
                        {status === 'ativa' ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      <button
                        onClick={() => toast({ titulo: 'Campanha duplicada (rascunho)', descricao: `"${cp.nome} — cópia" criada para edição de público e verba.`, tipo: 'info' })}
                        title="Duplicar"
                        className="rounded-lg p-1.5 text-ink-muted hover:bg-black/5 hover:text-ink"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Detalhe da campanha */}
      <Modal aberto={!!detalhe} onFechar={() => setDetalhe(null)} larguraMax="max-w-2xl" titulo={detalhe?.nome}>
        {detalhe && <DetalheCampanha campanha={detalhe} />}
      </Modal>
    </>
  )
}

function DetalheCampanha({ campanha }: { campanha: CampanhaStat }) {
  const navigate = useNavigate()
  const extra = campanhasExtras[campanha.id]
  const leadsDaCampanha = contatos
    .filter((ct) => ct.campanha === campanha.nome || (!ct.campanha && ct.origem === campanha.canal))
    .slice(0, 6)

  return (
    <div className="space-y-4">
      {/* Criativo */}
      <div className="flex items-end justify-between overflow-hidden rounded-xl p-5" style={{ background: extra.gradiente }}>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70">{campanha.canal} · anúncio principal</p>
          <p className="mt-1 max-w-sm font-display text-[18px] font-semibold leading-snug text-white">{extra.headline}</p>
        </div>
        <LutherLogo size={38} />
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-canvas px-3 py-2 text-[10.5px] text-ink-muted">
        <Link2 size={11} className="shrink-0" />
        <code className="truncate">{extra.utm}</code>
      </div>

      {/* Mini funil */}
      <div className="grid grid-cols-5 gap-2 text-center">
        {[
          { l: 'Invest.', v: campanha.investimento ? brl(campanha.investimento) : '—' },
          { l: 'Leads', v: String(campanha.leads) },
          { l: 'Agendamentos', v: String(campanha.agendamentos) },
          { l: 'Fechados', v: String(campanha.fechamentos) },
          { l: 'Receita', v: brl(campanha.receita), dourado: true },
        ].map((k) => (
          <div key={k.l} className={`rounded-xl p-2.5 ${k.dourado ? 'border border-gold-200 bg-gold-50' : 'bg-canvas'}`}>
            <p className={`truncate text-[13px] font-bold ${k.dourado ? 'text-gold-700' : 'text-ink'}`}>{k.v}</p>
            <p className="text-[9px] font-medium uppercase tracking-wide text-ink-muted">{k.l}</p>
          </div>
        ))}
      </div>

      {/* Leads reais */}
      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Leads desta campanha no CRM</p>
        <div className="space-y-1.5">
          {leadsDaCampanha.map((ct) => (
            <button
              key={ct.id}
              onClick={() => navigate(`/pacientes/${ct.id}`)}
              className="flex w-full items-center gap-2.5 rounded-lg border border-line px-3 py-2 text-left hover:border-brand-300"
            >
              <Avatar nome={ct.nome} cor={ct.avatarColor} size={26} />
              <span className="flex-1 text-[12px] font-medium text-ink">{ct.nome}</span>
              <span className="text-[11px] text-ink-muted">{ct.interesse}</span>
              <StatusPill status={ct.tipo} />
            </button>
          ))}
        </div>
        <p className="mt-2 text-[10.5px] text-ink-faint">Atribuição contínua: cada lead carrega origem, campanha e UTM até o contrato — e a receita retorna a este painel.</p>
      </div>
    </div>
  )
}

// ─── 3. ORIGENS & LANDING PAGES ──────────────────────────────────────────────
function OrigensTab() {
  const { landingPages, toggleAgendamentoOnline } = useMarketingStore()
  const toast = useUiStore((s) => s.toast)

  const origens = useMemo(() => {
    const canais = ['Instagram Ads', 'Google', 'Indicação', 'Site'] as const
    return canais.map((canal) => {
      const doCanal = contatos.filter((ct) => ct.origem === canal)
      const pacientes = doCanal.filter((ct) => ct.tipo === 'paciente').length
      return { canal, total: doCanal.length, pacientes, conversao: doCanal.length ? Math.round((pacientes / doCanal.length) * 100) : 0 }
    })
  }, [])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {origens.map((o) => (
          <div key={o.canal} className="card p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{o.canal}</p>
            <p className="mt-1.5 font-display text-[22px] font-semibold text-ink">{o.total}</p>
            <p className="text-[11px] text-ink-muted">contatos na base</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/5">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${o.conversao}%` }} />
            </div>
            <p className="mt-1 text-[10.5px] font-medium text-brand-700">{o.conversao}% viraram pacientes</p>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-ink">Landing pages & formulários de captação</p>
            <p className="text-[11px] text-ink-muted">Cada formulário cria o lead direto no CRM, já com origem, campanha e UTM</p>
          </div>
          <button
            onClick={() => toast({ titulo: 'Lead de teste criado no CRM', descricao: 'Formulário validado: os campos chegam mapeados em "Novo lead" com a origem correta.', tipo: 'sucesso' })}
            className="btn-secondary py-1.5 text-[11.5px]"
          >
            <FormInput size={13} /> Testar formulário
          </button>
        </div>
        <div className="space-y-2">
          {landingPages.map((lp) => (
            <div key={lp.id} className="flex items-center gap-4 rounded-xl border border-line px-4 py-3">
              <Globe size={16} className="shrink-0 text-ink-muted" />
              <div className="min-w-0 flex-1">
                <p className="text-[12.5px] font-semibold text-ink">{lp.nome}</p>
                <p className="text-[10.5px] text-ink-muted">{lp.url}</p>
              </div>
              <div className="text-right">
                <p className="text-[12.5px] font-semibold text-ink">{lp.visitantes.toLocaleString('pt-BR')}</p>
                <p className="text-[9.5px] uppercase tracking-wide text-ink-faint">visitantes</p>
              </div>
              <div className="text-right">
                <p className="text-[12.5px] font-semibold text-ink">{lp.leads}</p>
                <p className="text-[9.5px] uppercase tracking-wide text-ink-faint">leads</p>
              </div>
              <div className="text-right">
                <p className="text-[12.5px] font-semibold text-brand-700">{((lp.leads / lp.visitantes) * 100).toFixed(1)}%</p>
                <p className="text-[9.5px] uppercase tracking-wide text-ink-faint">conversão</p>
              </div>
              <button
                onClick={() => {
                  toggleAgendamentoOnline(lp.id)
                  toast({
                    titulo: lp.agendamentoOnline ? 'Agendamento online desativado' : 'Agendamento online ativado',
                    descricao: `${lp.nome}: o visitante ${lp.agendamentoOnline ? 'volta a preencher o formulário' : 'agora agenda direto na agenda da clínica'}.`,
                    tipo: 'info',
                  })
                }}
                className="flex items-center gap-1.5 text-[11px] font-medium"
                title="Agendamento online direto na agenda"
              >
                {lp.agendamentoOnline ? (
                  <><ToggleRight size={22} className="text-brand-600" /> <span className="text-brand-700">Agenda online</span></>
                ) : (
                  <><ToggleLeft size={22} className="text-ink-faint" /> <span className="text-ink-muted">Só formulário</span></>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── 4. SITE DO CONSULTÓRIO ──────────────────────────────────────────────────
function SiteTab() {
  const { paginas, atualizacoesSite, salvarPagina, publicarPagina, conteudos } = useMarketingStore()
  const [editando, setEditando] = useState<PaginaSite | null>(null)
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const maxVisitas = Math.max(...visitasSemanaisSite)
  const artigosPublicados = conteudos.filter((cnt) => cnt.status === 'publicado' && cnt.canais.includes('Blog'))

  return (
    <div className="grid grid-cols-3 gap-5">
      <div className="col-span-2 space-y-5">
        {/* Status */}
        <div className="card flex items-center gap-6 p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Globe size={18} /></span>
            <div>
              <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-soft" /> clinicamluther.com.br
              </p>
              <p className="text-[11px] text-ink-muted">Online · SSL válido até 12/2026 · hospedagem gerenciada Zaleva</p>
            </div>
          </div>
          <div className="ml-auto flex items-end gap-1" title="Visitas semanais (12 semanas)">
            {visitasSemanaisSite.map((v, i) => (
              <span key={i} className={`w-2 rounded-t-sm ${i === visitasSemanaisSite.length - 1 ? 'bg-gold-400' : 'bg-brand-400/70'}`} style={{ height: (v / maxVisitas) * 40 + 6 }} />
            ))}
          </div>
          <div className="text-right">
            <p className="font-display text-[18px] font-semibold text-ink">{visitasSemanaisSite[visitasSemanaisSite.length - 1]}</p>
            <p className="text-[10px] uppercase tracking-wide text-ink-muted">visitas na semana</p>
            <p className="text-[10.5px] font-medium text-emerald-600">+18% vs mês anterior</p>
          </div>
        </div>

        {/* Páginas */}
        <div className="card p-5">
          <p className="mb-1 text-[13px] font-semibold text-ink">Páginas do site</p>
          <p className="mb-3 text-[11px] text-ink-muted">Edite o conteúdo e publique sem depender de agência — clique para editar</p>
          <div className="space-y-1.5">
            {paginas.map((pg) => (
              <button
                key={pg.id}
                onClick={() => {
                  setEditando(pg)
                  setTitulo(pg.titulo)
                  setDescricao(pg.descricao)
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-line px-4 py-2.5 text-left transition-colors hover:border-brand-300"
              >
                <PenLine size={14} className="shrink-0 text-ink-muted" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-semibold text-ink">{pg.nome} <span className="font-normal text-ink-faint">{pg.rota}</span></span>
                  <span className="block truncate text-[11px] text-ink-muted">{pg.titulo}</span>
                </span>
                <span className="text-[10px] text-ink-faint">atualizada {fmtRelativa(pg.atualizadaEm)}</span>
                <StatusPill status={pg.status === 'publicada' ? 'assinado' : 'rascunho'} label={pg.status === 'publicada' ? 'Publicada' : 'Rascunho'} />
              </button>
            ))}
          </div>
        </div>

        {/* Blog (conexão com o Estúdio) */}
        <div className="card p-5">
          <p className="mb-1 flex items-center gap-1.5 text-[13px] font-semibold text-ink"><Newspaper size={14} className="text-brand-600" /> Blog — alimentado pelo Estúdio de conteúdo IA</p>
          <p className="mb-3 text-[11px] text-ink-muted">Artigos aprovados no Estúdio entram aqui automaticamente</p>
          {artigosPublicados.length ? (
            <div className="grid grid-cols-2 gap-3">
              {artigosPublicados.map((cnt) => (
                <div key={cnt.id} className="overflow-hidden rounded-xl border border-line">
                  <div className="h-16" style={{ background: cnt.gradiente }} />
                  <div className="p-3">
                    <p className="text-[12px] font-semibold leading-snug text-ink">{cnt.tema}</p>
                    <p className="mt-1 flex items-center gap-1 text-[10px] text-ink-muted">
                      <ShieldCheck size={10} className="text-brand-600" /> Revisado pelo responsável técnico · {cnt.publicadoEm ? fmtData(cnt.publicadoEm) : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-ink-muted">Nenhum artigo publicado ainda.</p>
          )}
        </div>
      </div>

      {/* Preview + feed */}
      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl border border-line shadow-card">
          <div className="flex items-center gap-1.5 border-b border-line bg-canvas px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-red-400" /><span className="h-2 w-2 rounded-full bg-amber-400" /><span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="ml-2 flex-1 truncate rounded bg-white px-2 py-0.5 text-[9.5px] text-ink-muted">clinicamluther.com.br</span>
          </div>
          <div className="bg-brand-950 p-5 text-center text-white">
            <div className="mx-auto w-fit"><LutherLogo size={40} /></div>
            <p className="mt-2 font-display text-[15px] font-semibold">Clínica M. Luther</p>
            <p className="text-[8.5px] uppercase tracking-[0.2em] text-gold-200/80">Cirurgia Plástica & Estética</p>
            <button className="mt-3 rounded-full bg-gold-400 px-4 py-1.5 text-[10px] font-bold text-brand-950">Agende sua avaliação</button>
          </div>
          <div className="space-y-1.5 bg-white p-3">
            {['Rinoplastia estruturada', 'Mommy Makeover', 'Lipo HD'].map((s) => (
              <div key={s} className="rounded-lg bg-canvas px-2.5 py-1.5 text-[10px] font-medium text-ink-soft">{s}</div>
            ))}
            <p className="pt-1 text-center text-[8.5px] text-ink-faint">Pré-visualização do site institucional (mock)</p>
          </div>
        </div>

        <div className="card p-4">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Últimas atualizações</p>
          <div className="space-y-2.5">
            {atualizacoesSite.slice(0, 6).map((a, i) => (
              <div key={i} className="flex gap-2">
                <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-brand-500" />
                <div>
                  <p className="text-[11.5px] leading-snug text-ink">{a.texto}</p>
                  <p className="text-[9.5px] text-ink-faint">{fmtRelativa(a.em)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Editor de página */}
      <Modal aberto={!!editando} onFechar={() => setEditando(null)} titulo={editando ? `Editar página — ${editando.nome}` : ''}>
        {editando && (
          <div className="space-y-3.5">
            <div>
              <label className="mb-1 block text-[11.5px] font-medium text-ink-soft">Título da página (SEO)</label>
              <input className="input" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-[11.5px] font-medium text-ink-soft">Descrição / texto principal</label>
              <textarea className="input min-h-[100px] resize-y" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            </div>
            <p className="rounded-lg bg-canvas px-3 py-2 text-[10.5px] leading-relaxed text-ink-muted">
              Na versão completa: editor visual de seções, galeria de imagens, SEO assistido por IA e histórico de versões.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  salvarPagina(editando.id, titulo, descricao)
                  publicarPagina(editando.id)
                  setEditando(null)
                }}
                className="btn-primary flex-1"
              >
                <Rocket size={13} /> Publicar alterações no site
              </button>
              <button
                onClick={() => {
                  salvarPagina(editando.id, titulo, descricao)
                  setEditando(null)
                  useUiStore.getState().toast({ titulo: 'Rascunho salvo', descricao: 'As alterações ficam salvas sem ir ao ar.', tipo: 'info' })
                }}
                className="btn-secondary"
              >
                Salvar rascunho
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

// ─── 5. ESTÚDIO DE CONTEÚDO IA ───────────────────────────────────────────────
const colunasPipeline: { id: ConteudoStatus; nome: string }[] = [
  { id: 'ideia', nome: 'Ideias' },
  { id: 'rascunho-ia', nome: 'Rascunho da IA' },
  { id: 'em-revisao', nome: 'Em revisão' },
  { id: 'agendado', nome: 'Agendado' },
  { id: 'publicado', nome: 'Publicado' },
]

function EstudioTab() {
  const { conteudos } = useMarketingStore()
  const [criarAberto, setCriarAberto] = useState(false)
  const [detalhe, setDetalhe] = useState<string | null>(null)
  const conteudoDetalhe = conteudos.find((cnt) => cnt.id === detalhe) ?? null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="max-w-2xl text-[12.5px] leading-relaxed text-ink-muted">
          A IA produz o conteúdo, <strong className="text-ink-soft">você aprova</strong>, a automação publica no blog e nas redes — com selo de revisão do responsável técnico (publicidade médica CFM). Nada vai ao ar sem aprovação.
        </p>
        <button onClick={() => setCriarAberto(true)} className="btn-ai shrink-0">
          <Sparkles size={14} /> Criar conteúdo com IA
        </button>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-5 gap-3">
        {colunasPipeline.map((col) => {
          const itens = conteudos.filter((cnt) => cnt.status === col.id)
          return (
            <div key={col.id} className="rounded-xl bg-black/[0.03] p-2.5">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-soft">{col.nome}</p>
                <span className="rounded-full bg-black/5 px-1.5 text-[10px] font-semibold text-ink-muted">{itens.length}</span>
              </div>
              <div className="space-y-2">
                {itens.map((cnt) => (
                  <button
                    key={cnt.id}
                    onClick={() => setDetalhe(cnt.id)}
                    className="w-full overflow-hidden rounded-xl border border-line bg-surface text-left shadow-card transition-all hover:shadow-raised animate-fade-up"
                  >
                    <div className="h-9" style={{ background: cnt.gradiente }} />
                    <div className="p-2.5">
                      <p className="text-[11.5px] font-semibold leading-snug text-ink">{cnt.tema}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[9.5px] capitalize text-ink-muted">{cnt.formato}</span>
                        <span className="flex gap-1">
                          {cnt.canais.map((cn) => {
                            const Icone = iconeCanal[cn]
                            return <Icone key={cn} size={10} className="text-ink-muted" />
                          })}
                        </span>
                      </div>
                      {cnt.status === 'agendado' && cnt.publicarEm && (
                        <p className="mt-1 flex items-center gap-1 text-[9px] font-medium text-sky-700"><CalendarClock size={9} /> publica {fmtData(cnt.publicarEm)}</p>
                      )}
                      {cnt.status === 'publicado' && cnt.publicadoEm && (
                        <p className="mt-1 flex items-center gap-1 text-[9px] font-medium text-emerald-600"><CheckCircle2 size={9} /> no ar · {fmtRelativa(cnt.publicadoEm)}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <ModalCriarConteudo aberto={criarAberto} onFechar={() => setCriarAberto(false)} />
      <ModalDetalheConteudo conteudo={conteudoDetalhe} onFechar={() => setDetalhe(null)} />
    </div>
  )
}

function ModalCriarConteudo({ aberto, onFechar }: { aberto: boolean; onFechar: () => void }) {
  const { criarConteudo, aprovarEPublicar } = useMarketingStore()
  const [fase, setFase] = useState<'tema' | 'gerando' | 'rascunho' | 'publicar'>('tema')
  const [tema, setTema] = useState<TemaSugerido | null>(null)
  const [corpo, setCorpo] = useState('')
  const [editandoCorpo, setEditandoCorpo] = useState(false)
  const [canais, setCanais] = useState<CanalConteudo[]>(['Blog', 'Instagram'])
  const [idCriado, setIdCriado] = useState<string | null>(null)

  const reset = () => {
    setFase('tema')
    setTema(null)
    setCorpo('')
    setEditandoCorpo(false)
    setCanais(['Blog', 'Instagram'])
    setIdCriado(null)
  }

  const gerar = (t: TemaSugerido) => {
    setTema(t)
    setFase('gerando')
    setTimeout(() => {
      setCorpo(t.corpo)
      setFase('rascunho')
    }, 1500)
  }

  const toggleCanal = (cn: CanalConteudo) =>
    setCanais((prev) => (prev.includes(cn) ? prev.filter((x) => x !== cn) : [...prev, cn]))

  return (
    <Modal aberto={aberto} onFechar={() => { onFechar(); reset() }} titulo="Criar conteúdo com IA" larguraMax="max-w-xl">
      {fase === 'tema' && (
        <>
          <p className="mb-3 text-[12px] text-ink-muted">
            A IA sugere temas com base nas campanhas ativas, nas dúvidas mais frequentes do WhatsApp e na agenda da clínica:
          </p>
          <div className="space-y-2">
            {temasSugeridos.map((t) => (
              <button key={t.id} onClick={() => gerar(t)} className="w-full rounded-xl border border-line p-3.5 text-left transition-all hover:border-ai-300 hover:bg-ai-50/40">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-semibold text-ink">{t.titulo}</p>
                  <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[10px] capitalize text-ink-soft">{t.formato}</span>
                </div>
                <p className="mt-1 flex items-start gap-1 text-[11px] leading-snug text-ai-700">
                  <Sparkles size={10} className="mt-0.5 shrink-0" /> {t.justificativa}
                </p>
              </button>
            ))}
          </div>
        </>
      )}

      {fase === 'gerando' && <AIPensando texto={`IA escrevendo "${tema?.titulo}"`} />}

      {fase === 'rascunho' && tema && (
        <AISuggestion
          titulo={`Rascunho — ${tema.titulo}`}
          labelAprovar="Aprovar e escolher canais"
          onAprovar={() => setFase('publicar')}
          onEditar={() => setEditandoCorpo(true)}
          onDescartar={() => { onFechar(); reset() }}
        >
          {editandoCorpo ? (
            <textarea className="input min-h-[220px] w-full resize-y bg-white text-[12.5px]" value={corpo} onChange={(e) => setCorpo(e.target.value)} />
          ) : (
            <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap font-sans text-[12.5px] leading-relaxed">{corpo}</pre>
          )}
        </AISuggestion>
      )}

      {fase === 'publicar' && tema && (
        <div className="space-y-4">
          <p className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-[12px] font-medium text-emerald-700">
            <ShieldCheck size={13} /> Conteúdo aprovado pelo responsável técnico — pronto para a automação
          </p>
          <div>
            <p className="mb-2 text-[11.5px] font-semibold text-ink-soft">Publicar automaticamente em:</p>
            <div className="flex gap-2">
              {(['Blog', 'Instagram', 'Facebook'] as CanalConteudo[]).map((cn) => {
                const Icone = iconeCanal[cn]
                const ativo = canais.includes(cn)
                return (
                  <button
                    key={cn}
                    onClick={() => toggleCanal(cn)}
                    className={`flex flex-1 flex-col items-center gap-1 rounded-xl border p-3 transition-all ${ativo ? 'border-brand-500 bg-brand-50' : 'border-line hover:border-ink-faint'}`}
                  >
                    <Icone size={17} className={ativo ? 'text-brand-700' : 'text-ink-muted'} />
                    <span className={`text-[11px] font-medium ${ativo ? 'text-brand-800' : 'text-ink-muted'}`}>{cn}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <button
            disabled={canais.length === 0}
            onClick={() => {
              const id = idCriado ?? criarConteudo(tema.titulo, tema.formato, corpo)
              setIdCriado(id)
              aprovarEPublicar(id, canais, 0)
              onFechar()
              reset()
            }}
            className="btn-primary w-full py-2.5"
          >
            <Rocket size={14} /> Ativar automação de publicação
          </button>
          <p className="text-center text-[10px] text-ink-faint">A publicação sai com o selo "elaborado com IA — revisado pelo responsável técnico".</p>
        </div>
      )}
    </Modal>
  )
}

function ModalDetalheConteudo({ conteudo, onFechar }: { conteudo: Conteudo | null; onFechar: () => void }) {
  const { gerarRascunho, aprovarEPublicar } = useMarketingStore()
  const [canais, setCanais] = useState<CanalConteudo[]>(['Blog', 'Instagram'])
  if (!conteudo) return null
  const pill = pillConteudo[conteudo.status]

  const toggleCanal = (cn: CanalConteudo) =>
    setCanais((prev) => (prev.includes(cn) ? prev.filter((x) => x !== cn) : [...prev, cn]))

  return (
    <Modal aberto={!!conteudo} onFechar={onFechar} larguraMax="max-w-xl" titulo={conteudo.tema}>
      <div className="mb-3 flex items-center gap-2">
        <StatusPill status={pill.status} label={pill.label} />
        <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10.5px] capitalize text-ink-soft">{conteudo.formato}</span>
        {conteudo.canais.map((cn) => {
          const Icone = iconeCanal[cn]
          return (
            <span key={cn} className="flex items-center gap-1 rounded-full bg-black/5 px-2 py-0.5 text-[10.5px] text-ink-soft">
              <Icone size={10} /> {cn}
            </span>
          )
        })}
        {['rascunho-ia', 'em-revisao'].includes(conteudo.status) && <AIChip className="ml-auto" />}
      </div>

      <div className={`rounded-xl p-4 ${['rascunho-ia', 'em-revisao'].includes(conteudo.status) ? 'border border-dashed border-ai-300 bg-ai-50/60' : 'bg-canvas'}`}>
        <pre className="max-h-72 overflow-y-auto whitespace-pre-wrap font-sans text-[12.5px] leading-relaxed text-ink">{conteudo.corpo}</pre>
      </div>

      {conteudo.status === 'publicado' && (
        <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-[11.5px] font-medium text-emerald-700">
          <ShieldCheck size={13} /> Publicado com selo: elaborado com IA — revisado e aprovado pelo responsável técnico.
        </p>
      )}

      {conteudo.status === 'ideia' && (
        <button onClick={() => { gerarRascunho(conteudo.id) }} className="btn-ai mt-4 w-full py-2.5">
          <Sparkles size={14} /> Gerar rascunho completo com IA
        </button>
      )}

      {['rascunho-ia', 'em-revisao'].includes(conteudo.status) && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            {(['Blog', 'Instagram', 'Facebook'] as CanalConteudo[]).map((cn) => {
              const Icone = iconeCanal[cn]
              const ativo = canais.includes(cn)
              return (
                <button key={cn} onClick={() => toggleCanal(cn)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-[11.5px] font-medium transition-all ${ativo ? 'border-brand-500 bg-brand-50 text-brand-800' : 'border-line text-ink-muted'}`}>
                  <Icone size={13} /> {cn}
                </button>
              )
            })}
          </div>
          <button
            disabled={canais.length === 0}
            onClick={() => {
              aprovarEPublicar(conteudo.id, canais, 0)
              onFechar()
            }}
            className="btn-primary w-full py-2.5"
          >
            <Rocket size={14} /> Aprovar e ativar automação de publicação
          </button>
        </div>
      )}

      {conteudo.status === 'agendado' && conteudo.publicarEm && (
        <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-sky-50 px-3 py-2 text-[11.5px] font-medium text-sky-700">
          <CalendarClock size={13} /> Agendado para {fmtData(conteudo.publicarEm)} — a automação publicará sem intervenção manual.
        </p>
      )}
    </Modal>
  )
}
