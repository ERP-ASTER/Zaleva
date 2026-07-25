import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  MessageCircle,
  CalendarPlus,
  FileText,
  Lock,
  AlertTriangle,
  Pill,
  HeartPulse,
  Stethoscope,
  FileSignature,
  Wallet,
  Camera,
  Plus,
  Eye,
  Smartphone,
} from 'lucide-react'
import { contatoById, contatos } from '@/data/contacts'
import { unidades, profById } from '@/data/team'
import { fichaById } from '@/data/clinical'
import { useSessionStore } from '@/stores/useSessionStore'
import { useTimelineStore } from '@/stores/useTimelineStore'
import { useCrmStore, nomeEtapa } from '@/stores/useCrmStore'
import { useAgendaStore } from '@/stores/useAgendaStore'
import { useBillingStore } from '@/stores/useBillingStore'
import { useClinicalStore } from '@/stores/useClinicalStore'
import { usePostOpStore } from '@/stores/usePostOpStore'
import { useInboxStore } from '@/stores/useInboxStore'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { Tabs } from '@/components/ui/Tabs'
import { Timeline } from '@/components/ui/Timeline'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { MedicalDocModal, type DocView } from '@/components/modules/MedicalDoc'
import { useUiStore } from '@/stores/useUiStore'
import type { ClinicalDoc, PhotoRecord } from '@/data/types'
import { brl, fmtData, fmtDataHora, fmtRelativa, diaPosOp, fmtHora } from '@/lib/format'

export default function Patient360() {
  const { id } = useParams()
  const navigate = useNavigate()
  const papel = useSessionStore((s) => s.papel)
  const contato = contatoById(id)

  const eventos = useTimelineStore((s) => s.eventos.filter((e) => e.contactId === id))
  const deals = useCrmStore((s) => s.negociacoes.filter((d) => d.contactId === id))
  const agendamentos = useAgendaStore((s) => s.agendamentos.filter((a) => a.contactId === id).sort((a, b) => b.inicio.localeCompare(a.inicio)))
  const orcamentos = useBillingStore((s) => s.orcamentos.filter((q) => q.contactId === id))
  const contratos = useBillingStore((s) => s.contratos.filter((c) => c.contactId === id))
  const parcelas = useBillingStore((s) => s.parcelas.filter((p) => p.contactId === id))
  const consultas = useClinicalStore((s) => s.consultas.filter((e) => e.contactId === id))
  const prescricoes = useClinicalStore((s) => s.prescricoes.filter((p) => p.contactId === id))
  const documentos = useClinicalStore((s) => s.documentos.filter((d) => d.contactId === id))
  const jornadas = usePostOpStore((s) => s.jornadas.filter((j) => j.contactId === id))
  const conversas = useInboxStore((s) => s.conversas.filter((c) => c.contactId === id))
  const fotos = useClinicalStore((s) => s.fotos.filter((f) => f.contactId === id))
  const addFoto = useClinicalStore((s) => s.addFoto)
  const assinarDocumento = useClinicalStore((s) => s.assinarDocumento)
  const toast = useUiStore((s) => s.toast)

  const [aba, setAba] = useState('resumo')
  const [fotoSel, setFotoSel] = useState<PhotoRecord | null>(null)
  const [docSel, setDocSel] = useState<string | null>(null)

  // Segurança simulada: perfil Comercial não acessa abas clínicas
  useEffect(() => {
    if (papel === 'comercial' && (aba === 'prontuario' || aba === 'fotos')) setAba('resumo')
  }, [papel, aba])

  if (!contato) {
    return (
      <div className="p-8">
        <p className="text-ink-muted">Contato não encontrado.</p>
        <Link to="/pacientes" className="text-brand-600">Voltar</Link>
      </div>
    )
  }

  const ficha = fichaById(contato.id)
  const clinicoBloqueado = papel === 'comercial'
  const proximoAg = agendamentos.filter((a) => new Date(a.inicio) >= new Date() && !['cancelado'].includes(a.status)).sort((a, b) => a.inicio.localeCompare(b.inicio))[0]
  const dealAtiva = deals.find((d) => !['fechado', 'perdido'].includes(d.etapa))
  const saldoAberto = parcelas.filter((p) => p.status !== 'pago').reduce((a, p) => a + p.valor, 0)
  const vencidas = parcelas.filter((p) => p.status === 'vencido')
  const ultimaConversa = conversas[0]
  const indicadoPor = contato.indicadoPorId ? contatoById(contato.indicadoPorId) : undefined

  return (
    <div className="mx-auto max-w-[1150px] p-6">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-[12.5px] font-medium text-ink-muted hover:text-ink">
        <ArrowLeft size={14} /> Voltar
      </button>

      {/* Header */}
      <div className="card p-5">
        <div className="flex items-start gap-4">
          <Avatar nome={contato.nome} cor={contato.avatarColor} size={64} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-[22px] font-semibold text-ink">{contato.nome}</h1>
              <StatusPill status={contato.tipo} />
              {ficha.alertas.length > 0 && !clinicoBloqueado && (
                <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10.5px] font-medium text-red-700">
                  <AlertTriangle size={10} /> {ficha.alertas[0]}
                </span>
              )}
            </div>
            <p className="mt-1 text-[12.5px] text-ink-muted">
              {contato.idade} anos{contato.profissao ? ` · ${contato.profissao}` : ''} · {contato.telefone} · {unidades.find((u) => u.id === contato.unidadeId)?.nome}
            </p>
            <p className="mt-0.5 text-[12px] text-ink-muted">
              Origem: <span className="font-medium text-ink-soft">{contato.origem}{contato.campanha ? ` — ${contato.campanha}` : ''}</span>
              {indicadoPor && (
                <>
                  {' '}· Indicação de{' '}
                  <Link to={`/pacientes/${indicadoPor.id}`} className="font-medium text-brand-600 hover:underline">{indicadoPor.nome}</Link>
                </>
              )}
              {' '}· Cliente desde {fmtData(contato.criadoEm)}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {contato.tags.map((t) => (
                <span key={t} className="rounded-full bg-black/5 px-2 py-0.5 text-[10.5px] text-ink-soft">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2.5">
            {contato.ltv > 0 && (
              <div className="rounded-xl border border-gold-200 bg-gradient-to-br from-gold-50 to-white px-4 py-2 text-right">
                <p className="text-[9.5px] font-semibold uppercase tracking-wide text-gold-700">LTV</p>
                <p className="font-display text-[19px] font-semibold leading-tight text-gold-700">{brl(contato.ltv)}</p>
              </div>
            )}
            <div className="flex gap-1.5">
              <button onClick={() => navigate('/inbox')} className="btn-secondary px-2.5 py-1.5" title="Enviar mensagem"><MessageCircle size={14} /></button>
              <button onClick={() => navigate('/agenda')} className="btn-secondary px-2.5 py-1.5" title="Agendar"><CalendarPlus size={14} /></button>
              <button onClick={() => navigate(orcamentos[0] ? `/orcamentos/${orcamentos[0].id}` : '/orcamentos/qt-mariana')} className="btn-secondary px-2.5 py-1.5" title="Orçamento"><FileText size={14} /></button>
            </div>
          </div>
        </div>
      </div>

      <Tabs
        className="mt-5 mb-5"
        ativa={aba}
        onMudar={setAba}
        tabs={[
          { id: 'resumo', label: 'Resumo' },
          { id: 'timeline', label: 'Timeline', badge: eventos.length },
          { id: 'conversas', label: 'Conversas', badge: conversas.length },
          { id: 'agendamentos', label: 'Agendamentos', badge: agendamentos.length },
          {
            id: 'prontuario',
            label: 'Prontuário',
            bloqueada: clinicoBloqueado,
            icone: clinicoBloqueado ? <Lock size={11} /> : undefined,
            tooltip: clinicoBloqueado
              ? 'Acesso restrito: seu perfil (Comercial) não possui permissão para dados clínicos. A segregação entre dados clínicos e comerciais é auditada — LGPD.'
              : undefined,
          },
          {
            id: 'fotos',
            label: 'Fotos',
            badge: fotos.length,
            bloqueada: clinicoBloqueado,
            icone: clinicoBloqueado ? <Lock size={11} /> : <Camera size={12} />,
            tooltip: clinicoBloqueado
              ? 'Acesso restrito: fotos clínicas são dados sensíveis, indisponíveis para o perfil Comercial — LGPD.'
              : undefined,
          },
          { id: 'orcamentos', label: 'Orçamentos & Contratos', badge: orcamentos.length + contratos.length },
          { id: 'financeiro', label: 'Financeiro' },
          { id: 'pos', label: 'Pós-atendimento', badge: jornadas.length },
          { id: 'documentos', label: 'Documentos', badge: documentos.length },
        ]}
      />

      {/* ─── RESUMO ─── */}
      {aba === 'resumo' && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Próximo agendamento</p>
            {proximoAg ? (
              <>
                <p className="text-[13.5px] font-semibold text-ink">{proximoAg.titulo}</p>
                <p className="mt-0.5 text-[12px] text-ink-muted">{fmtDataHora(proximoAg.inicio)} · {profById(proximoAg.profissionalId)?.nome}</p>
                <div className="mt-2"><StatusPill status={proximoAg.status} /></div>
              </>
            ) : (
              <p className="text-[12.5px] text-ink-muted">Nenhum agendamento futuro. <button onClick={() => navigate('/agenda')} className="text-brand-600">Agendar agora</button></p>
            )}
          </div>

          <div className="card p-4">
            <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Negociação / plano ativo</p>
            {dealAtiva ? (
              <>
                <p className="text-[13.5px] font-semibold text-ink">{dealAtiva.procedimentos.join(' + ')}</p>
                <p className="mt-0.5 text-[12px] text-ink-muted">{nomeEtapa(dealAtiva.etapa)} · {dealAtiva.probabilidade}% · <span className="font-semibold text-ink">{brl(dealAtiva.valor)}</span></p>
                <button onClick={() => navigate(`/crm/${dealAtiva.id}`)} className="mt-2 text-[11.5px] font-medium text-brand-600 hover:text-brand-700">Abrir negociação →</button>
              </>
            ) : jornadas[0] ? (
              <>
                <p className="text-[13.5px] font-semibold text-ink">{jornadas[0].procedimento}</p>
                <p className="mt-0.5 text-[12px] text-ink-muted">Pós-operatório {diaPosOp(jornadas[0].procedimentoEm)}</p>
                <div className="mt-2"><StatusPill status={jornadas[0].risco} /></div>
              </>
            ) : (
              <p className="text-[12.5px] text-ink-muted">Nenhum plano ativo no momento.</p>
            )}
          </div>

          <div className="card p-4">
            <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Saldo financeiro</p>
            {parcelas.length > 0 ? (
              <>
                <p className={`text-[13.5px] font-semibold ${vencidas.length ? 'text-red-600' : 'text-ink'}`}>{saldoAberto > 0 ? brl(saldoAberto) + ' em aberto' : 'Tudo quitado'}</p>
                <p className="mt-0.5 text-[12px] text-ink-muted">
                  {parcelas.filter((p) => p.status === 'pago').length} pagas · {parcelas.filter((p) => p.status === 'aberto').length} a vencer
                  {vencidas.length > 0 && <span className="font-medium text-red-600"> · {vencidas.length} vencida</span>}
                </p>
                <button onClick={() => setAba('financeiro')} className="mt-2 text-[11.5px] font-medium text-brand-600 hover:text-brand-700">Ver extrato →</button>
              </>
            ) : (
              <p className="text-[12.5px] text-ink-muted">Sem lançamentos financeiros.</p>
            )}
          </div>

          <div className="card p-4">
            <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Última conversa</p>
            {ultimaConversa ? (
              <>
                <p className="truncate text-[12.5px] text-ink">"{ultimaConversa.mensagens[ultimaConversa.mensagens.length - 1]?.texto || 'Áudio'}"</p>
                <p className="mt-0.5 text-[11.5px] text-ink-muted">{fmtRelativa(ultimaConversa.mensagens[ultimaConversa.mensagens.length - 1]?.em ?? '')} · {ultimaConversa.canal}</p>
                <button onClick={() => navigate('/inbox')} className="mt-2 text-[11.5px] font-medium text-brand-600 hover:text-brand-700">Abrir conversa →</button>
              </>
            ) : (
              <p className="text-[12.5px] text-ink-muted">Nenhuma conversa registrada.</p>
            )}
          </div>

          {!clinicoBloqueado && (
            <div className="card p-4">
              <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Resumo clínico</p>
              {ficha.alergias.length + ficha.condicoes.length > 0 ? (
                <div className="space-y-1 text-[12px]">
                  {ficha.alergias.length > 0 && <p className="text-red-700"><strong>Alergias:</strong> {ficha.alergias.join(', ')}</p>}
                  {ficha.condicoes.length > 0 && <p className="text-ink-soft"><strong>Condições:</strong> {ficha.condicoes.join(', ')}</p>}
                  {ficha.medicamentos.length > 0 && <p className="text-ink-soft"><strong>Em uso:</strong> {ficha.medicamentos.join(', ')}</p>}
                </div>
              ) : (
                <p className="text-[12.5px] text-ink-muted">Sem registros clínicos relevantes.</p>
              )}
            </div>
          )}

          <div className="card p-4">
            <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Alertas e pendências</p>
            <div className="space-y-1.5 text-[12px]">
              {jornadas.some((j) => j.steps.some((s) => s.status === 'critico')) && (
                <p className="flex items-center gap-1.5 text-red-700"><AlertTriangle size={12} /> Check-in crítico no pós-operatório</p>
              )}
              {vencidas.length > 0 && <p className="flex items-center gap-1.5 text-amber-700"><Wallet size={12} /> Parcela vencida há {Math.abs(Math.round((Date.now() - new Date(vencidas[0].vencimento).getTime()) / 86400000))} dias</p>}
              {contratos.some((c) => c.status === 'enviado') && <p className="flex items-center gap-1.5 text-sky-700"><FileSignature size={12} /> Contrato aguardando assinatura</p>}
              {!jornadas.some((j) => j.steps.some((s) => s.status === 'critico')) && vencidas.length === 0 && !contratos.some((c) => c.status === 'enviado') && (
                <p className="text-ink-muted">Nenhuma pendência ativa. 🎉</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TIMELINE ─── */}
      {aba === 'timeline' && (
        <div className="card p-6">
          <p className="mb-4 text-[12px] text-ink-muted">
            Todos os eventos — comerciais, clínicos, financeiros e de relacionamento — em uma única linha do tempo.
            {contato.id === 'ct-ricardo' && <span className="font-medium text-ink-soft"> 18 meses de relacionamento contínuo: da indicação à recorrência.</span>}
          </p>
          <Timeline eventos={eventos} comFiltro />
        </div>
      )}

      {/* ─── CONVERSAS ─── */}
      {aba === 'conversas' && (
        <div className="card p-5">
          {conversas.length ? (
            conversas.map((c) => (
              <button key={c.id} onClick={() => navigate('/inbox')} className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-canvas">
                <MessageCircle size={16} className="text-ink-muted" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-medium capitalize text-ink">{c.canal} · {c.intencao}</span>
                  <span className="block truncate text-[11.5px] text-ink-muted">{c.mensagens[c.mensagens.length - 1]?.texto || 'Áudio'}</span>
                </span>
                <StatusPill status={c.status} />
              </button>
            ))
          ) : (
            <EmptyState titulo="Nenhuma conversa" descricao="As conversas de WhatsApp, Instagram e site aparecem aqui." />
          )}
        </div>
      )}

      {/* ─── AGENDAMENTOS ─── */}
      {aba === 'agendamentos' && (
        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-canvas text-[10.5px] font-semibold uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-2.5">Data</th>
                <th className="px-4 py-2.5">Atendimento</th>
                <th className="px-4 py-2.5">Profissional</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.map((a) => (
                <tr key={a.id} className="border-b border-line/60 last:border-0">
                  <td className="px-4 py-2.5 text-[12px] text-ink">{fmtData(a.inicio)} <span className="text-ink-muted">{fmtHora(a.inicio)}</span></td>
                  <td className="px-4 py-2.5 text-[12.5px] font-medium text-ink">{a.titulo}</td>
                  <td className="px-4 py-2.5 text-[12px] text-ink-soft">{profById(a.profissionalId)?.nome}</td>
                  <td className="px-4 py-2.5"><StatusPill status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── PRONTUÁRIO ─── */}
      {aba === 'prontuario' && !clinicoBloqueado && (
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-4">
            <div className="card p-4">
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-red-600"><AlertTriangle size={12} /> Alergias</p>
              {ficha.alergias.length ? ficha.alergias.map((a) => <p key={a} className="text-[12.5px] font-medium text-ink">{a}</p>) : <p className="text-[12px] text-ink-muted">Nenhuma conhecida</p>}
            </div>
            <div className="card p-4">
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint"><HeartPulse size={12} /> Condições ativas</p>
              {ficha.condicoes.length ? ficha.condicoes.map((c) => <p key={c} className="text-[12.5px] text-ink">{c}</p>) : <p className="text-[12px] text-ink-muted">Nenhuma</p>}
            </div>
            <div className="card p-4">
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint"><Pill size={12} /> Medicamentos em uso</p>
              {ficha.medicamentos.length ? ficha.medicamentos.map((m) => <p key={m} className="text-[12.5px] text-ink">{m}</p>) : <p className="text-[12px] text-ink-muted">Nenhum</p>}
            </div>
            <div className="card p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Antecedentes</p>
              {ficha.antecedentes.map((a) => <p key={a} className="text-[12px] text-ink-soft">• {a}</p>)}
            </div>
          </div>
          <div className="col-span-2 space-y-4">
            {consultas.length ? (
              [...consultas].sort((a, b) => b.em.localeCompare(a.em)).map((e) => (
                <div key={e.id} className="card p-5">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink"><Stethoscope size={14} className="text-brand-600" /> {e.tipo}</p>
                    <div className="flex items-center gap-2">
                      {e.aiAssistida && <span className="rounded-full bg-ai-100 px-2 py-0.5 text-[10px] font-medium text-ai-700">✦ Apoio de IA — revisada pelo médico</span>}
                      <StatusPill status={e.status} />
                    </div>
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-ink-muted">{fmtDataHora(e.em)} · {profById(e.profissionalId)?.nome}</p>
                  {e.status === 'aberta' ? (
                    <button onClick={() => navigate(`/consulta/${e.id}`)} className="btn-primary mt-3">Abrir consulta</button>
                  ) : (
                    <div className="mt-3 space-y-2 text-[12.5px] leading-relaxed">
                      {e.motivo && <p><strong className="text-ink-soft">Motivo:</strong> {e.motivo}</p>}
                      {e.anamnese && <p><strong className="text-ink-soft">Anamnese:</strong> {e.anamnese}</p>}
                      {e.avaliacao && <p><strong className="text-ink-soft">Avaliação:</strong> {e.avaliacao}</p>}
                      {e.conduta && <p><strong className="text-ink-soft">Conduta:</strong> {e.conduta}</p>}
                      {e.cids.length > 0 && (
                        <p className="flex flex-wrap gap-1 pt-1">
                          {e.cids.map((c) => (
                            <span key={c.codigo} className="rounded-md bg-black/5 px-1.5 py-0.5 text-[10.5px] font-medium text-ink-soft">{c.codigo} — {c.descricao}</span>
                          ))}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="card"><EmptyState titulo="Sem consultas registradas" /></div>
            )}
            {prescricoes.length > 0 && (
              <div className="card p-5">
                <p className="mb-3 text-[13px] font-semibold text-ink">Prescrições</p>
                {prescricoes.map((p) => (
                  <div key={p.id} className="mb-2 flex items-center justify-between rounded-lg border border-line px-3 py-2">
                    <span className="text-[12.5px] text-ink">{p.titulo}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-ink-muted">{fmtData(p.em)}</span>
                      <StatusPill status={p.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── ORÇAMENTOS & CONTRATOS ─── */}
      {aba === 'orcamentos' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5">
            <p className="mb-3 text-[13px] font-semibold text-ink">Orçamentos</p>
            {orcamentos.length ? (
              orcamentos.map((q) => (
                <button key={q.id} onClick={() => navigate(`/orcamentos/${q.id}`)} className="mb-2 flex w-full items-center justify-between rounded-xl border border-line p-3.5 text-left hover:border-brand-300">
                  <span>
                    <span className="block text-[12.5px] font-medium text-ink">V{q.versao} — {q.itens[0]?.descricao}</span>
                    <span className="block text-[11px] text-ink-muted">{fmtData(q.criadoEm)} · validade {q.validadeDias} dias</span>
                  </span>
                  <StatusPill status={q.status} />
                </button>
              ))
            ) : (
              <EmptyState titulo="Nenhum orçamento" />
            )}
          </div>
          <div className="card p-5">
            <p className="mb-3 text-[13px] font-semibold text-ink">Contratos</p>
            {contratos.length ? (
              contratos.map((c) => (
                <button key={c.id} onClick={() => navigate('/contratos')} className="mb-2 flex w-full items-center justify-between rounded-xl border border-line p-3.5 text-left hover:border-brand-300">
                  <span>
                    <span className="block text-[12.5px] font-medium text-ink">{c.titulo}</span>
                    <span className="block text-[11px] text-ink-muted">{brl(c.valor)} · {fmtData(c.criadoEm)}</span>
                  </span>
                  <StatusPill status={c.status} />
                </button>
              ))
            ) : (
              <EmptyState titulo="Nenhum contrato" />
            )}
          </div>
        </div>
      )}

      {/* ─── FINANCEIRO ─── */}
      {aba === 'financeiro' && (
        <div className="card overflow-hidden">
          {parcelas.length ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line bg-canvas text-[10.5px] font-semibold uppercase tracking-wide text-ink-muted">
                  <th className="px-4 py-2.5">Descrição</th>
                  <th className="px-4 py-2.5">Vencimento</th>
                  <th className="px-4 py-2.5">Forma</th>
                  <th className="px-4 py-2.5 text-right">Valor</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...parcelas].sort((a, b) => a.vencimento.localeCompare(b.vencimento)).map((p) => (
                  <tr key={p.id} className="border-b border-line/60 last:border-0">
                    <td className="px-4 py-2.5 text-[12.5px] text-ink">{p.descricao}</td>
                    <td className="px-4 py-2.5 text-[12px] text-ink-soft">{fmtData(p.vencimento)}</td>
                    <td className="px-4 py-2.5 text-[12px] text-ink-muted">{p.forma ?? '—'}</td>
                    <td className="px-4 py-2.5 text-right text-[12.5px] font-semibold text-ink">{brl(p.valor)}</td>
                    <td className="px-4 py-2.5"><StatusPill status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState titulo="Sem lançamentos financeiros" />
          )}
        </div>
      )}

      {/* ─── PÓS-ATENDIMENTO ─── */}
      {aba === 'pos' && (
        <div className="space-y-4">
          {jornadas.length ? (
            jornadas.map((j) => (
              <div key={j.id} className="card p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[13.5px] font-semibold text-ink">{j.procedimento} · {diaPosOp(j.procedimentoEm)}</p>
                  <StatusPill status={j.risco} />
                </div>
                <div className="mt-4 space-y-0">
                  {j.steps.map((s, i) => (
                    <div key={s.id} className="relative flex gap-3 pb-4">
                      {i < j.steps.length - 1 && <span className="absolute left-[7px] top-5 h-full w-px bg-line" />}
                      <span className={`relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${s.status === 'concluido' ? 'border-emerald-500 bg-emerald-500' : s.status === 'critico' ? 'border-red-500 bg-red-500 animate-pulse-soft' : s.status === 'aguardando' ? 'border-amber-400 bg-amber-100' : 'border-line bg-white'}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-[12.5px] font-medium ${s.status === 'critico' ? 'text-red-700' : 'text-ink'}`}>{s.titulo}</p>
                        {s.resposta && <p className={`mt-0.5 text-[11.5px] ${s.status === 'critico' ? 'text-red-600' : 'text-ink-muted'}`}>{s.resposta}</p>}
                      </div>
                      <span className="shrink-0 text-[10.5px] text-ink-faint">{fmtData(s.previstoEm)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="card"><EmptyState titulo="Nenhuma jornada de acompanhamento" descricao="Jornadas são ativadas automaticamente após procedimentos." /></div>
          )}
        </div>
      )}

      {/* ─── FOTOS ─── */}
      {aba === 'fotos' && !clinicoBloqueado && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[12.5px] text-ink-muted">
              Arquivo clínico de imagens — pré-op, planejamento e evolução. Fotos capturadas pelo <span className="font-medium text-ink-soft">App do médico</span> sincronizam aqui automaticamente.
            </p>
            <button
              onClick={() => {
                addFoto(contato.id, 'Nova foto de evolução', 'evolucao')
                toast({ titulo: 'Foto adicionada ao arquivo', descricao: 'Registrada na timeline com autor, data e finalidade (auditável).', tipo: 'sucesso' })
              }}
              className="btn-primary py-1.5 text-[11.5px]"
            >
              <Plus size={13} /> Adicionar foto
            </button>
          </div>
          {fotos.length ? (
            <div className="grid grid-cols-4 gap-3">
              {[...fotos].sort((a, b) => b.em.localeCompare(a.em)).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFotoSel(f)}
                  className="group overflow-hidden rounded-xl border border-line text-left transition-all hover:shadow-raised"
                >
                  <div className="relative flex aspect-[4/3] items-center justify-center" style={{ background: f.gradiente }}>
                    <Camera size={22} className="text-white/70 transition-transform group-hover:scale-110" />
                    {f.origem === 'app-medico' && (
                      <span className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-black/35 px-1.5 py-0.5 text-[8.5px] font-medium text-white backdrop-blur">
                        <Smartphone size={8} /> App
                      </span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-[11.5px] font-medium text-ink">{f.titulo}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <StatusPill
                        status={f.categoria === 'pre-op' ? 'aberta' : f.categoria === 'pos-op' ? 'concluido' : f.categoria === 'planejamento' ? 'gerado-ia' : 'checkin'}
                        label={{ 'pre-op': 'Pré-op', 'pos-op': 'Pós-op', evolucao: 'Evolução', planejamento: 'Planejamento' }[f.categoria]}
                      />
                      <span className="text-[9.5px] text-ink-faint">{fmtData(f.em)}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState icone={<Camera size={26} />} titulo="Nenhuma foto no arquivo" descricao="Adicione pelo consultório ou capture pelo App do médico." />
          )}
        </div>
      )}

      {/* ─── DOCUMENTOS ─── */}
      {aba === 'documentos' && (
        <div className="card p-5">
          {documentos.length ? (
            documentos.map((d) => (
              <button
                key={d.id}
                onClick={() => setDocSel(d.id)}
                className="mb-2 flex w-full items-center gap-3 rounded-xl border border-line px-3.5 py-2.5 text-left transition-colors hover:border-brand-300"
              >
                <FileText size={15} className="text-ink-muted" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-medium text-ink">{d.titulo}</span>
                  <span className="block text-[10.5px] capitalize text-ink-muted">{d.tipo} · {fmtData(d.em)}</span>
                </span>
                <StatusPill status={d.status} />
                <span className="flex items-center gap-1 text-[11px] font-medium text-brand-600"><Eye size={12} /> Visualizar</span>
              </button>
            ))
          ) : (
            <EmptyState titulo="Nenhum documento" />
          )}
        </div>
      )}

      {/* Visualizador de foto */}
      <Modal aberto={!!fotoSel} onFechar={() => setFotoSel(null)} titulo={fotoSel?.titulo} larguraMax="max-w-2xl">
        {fotoSel && (
          <>
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl" style={{ background: fotoSel.gradiente }}>
              <Camera size={44} className="text-white/60" />
              <span className="absolute bottom-3 left-3 rounded-full bg-black/35 px-2.5 py-1 text-[10px] text-white backdrop-blur">
                Imagem ilustrativa — protótipo sem fotos reais
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[12px] text-ink-muted">
              <span>
                {contato.nome} · {fmtData(fotoSel.em)} ·{' '}
                {fotoSel.origem === 'app-medico' ? 'capturada pelo App do médico' : 'adicionada no consultório'}
              </span>
              <span className="text-[10.5px] text-ink-faint">Acesso registrado no log de auditoria</span>
            </div>
          </>
        )}
      </Modal>

      {/* Visualizador de documento */}
      <MedicalDocModal
        doc={docToView(documentos.find((d) => d.id === docSel), contato.id)}
        onFechar={() => setDocSel(null)}
        onAssinar={(idDoc) => {
          assinarDocumento(idDoc)
          toast({ titulo: 'Documento assinado e enviado', descricao: 'Disponível no portal do paciente.', tipo: 'sucesso' })
        }}
      />
    </div>
  )
}

/** Adapta um ClinicalDoc para o visualizador de papel timbrado. */
function docToView(d: ClinicalDoc | undefined, contactId: string): DocView | null {
  if (!d) return null
  const linhasPadrao: Record<string, { t: string; d?: string }[]> = {
    termo: [{ t: 'Termo de consentimento livre e esclarecido, lido, compreendido e assinado pelo paciente, arquivado com trilha de auditoria.' }],
    orientacoes: [{ t: 'Orientações personalizadas entregues ao paciente pelo portal e por WhatsApp.' }],
    exames: [{ t: 'Solicitação de exames vinculada ao prontuário.' }],
    contrato: [{ t: 'Instrumento contratual — visualize a versão completa na Central de Contratos.' }],
    orcamento: [{ t: 'Proposta de plano de tratamento — visualize no Editor de Orçamento.' }],
    prescricao: [{ t: 'Prescrição médica arquivada.' }],
    atestado: [{ t: 'Atestado médico arquivado.' }],
  }
  return {
    id: d.id,
    kind: d.tipo === 'atestado' ? 'atestado' : d.tipo === 'prescricao' ? 'prescricao' : d.tipo === 'exames' ? 'exames' : 'outro',
    titulo: d.titulo,
    contactId,
    profissionalId: d.profissionalId ?? 'prof-otavio',
    status: d.status,
    em: d.em,
    linhas: d.linhas ?? linhasPadrao[d.tipo] ?? [{ t: d.titulo }],
  }
}
