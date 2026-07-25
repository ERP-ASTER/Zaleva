import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Mic,
  AlertTriangle,
  Pill,
  HeartPulse,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileSignature,
  History,
  Square,
  CalendarPlus,
  Send,
} from 'lucide-react'
import { useClinicalStore, type RascunhoEvolucao } from '@/stores/useClinicalStore'
import { useUiStore } from '@/stores/useUiStore'
import { useAgendaStore } from '@/stores/useAgendaStore'
import { contatoById } from '@/data/contacts'
import { profById } from '@/data/team'
import {
  fichaById,
  transcricaoMariana,
  cidsSugeridosMariana,
  prescricaoSugeridaMariana,
  respostasIAConsulta,
} from '@/data/clinical'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { AISuggestion, AIChip, AIPensando } from '@/components/ui/AISuggestion'
import { DocShortcuts } from '@/components/modules/DocShortcuts'
import { Modal } from '@/components/ui/Modal'
import { emDias } from '@/data/dates'
import { fmtHora, fmtRelativa } from '@/lib/format'

const camposEvolucao: { id: keyof RascunhoEvolucao; label: string }[] = [
  { id: 'motivo', label: 'Motivo da consulta' },
  { id: 'anamnese', label: 'Anamnese' },
  { id: 'exameFisico', label: 'Exame físico' },
  { id: 'avaliacao', label: 'Avaliação' },
  { id: 'conduta', label: 'Conduta e plano' },
]

export default function Consultation() {
  const { encounterId } = useParams()
  const navigate = useNavigate()
  const toast = useUiStore((s) => s.toast)
  const {
    consultas,
    fase,
    falasVisiveis,
    rascunho,
    cidsSelecionados,
    logIA,
    iniciarConsentimento,
    iniciarTranscricao,
    avancarTranscricao,
    estruturarComIA,
    editarRascunho,
    toggleCid,
    aprovarEvolucao,
    descartarRascunho,
    prescricoes,
    criarPrescricao,
    assinarPrescricao,
    registrarLogIA,
  } = useClinicalStore()

  const encounter = consultas.find((e) => e.id === encounterId)
  const [editando, setEditando] = useState<string | null>(null)
  const [rxId, setRxId] = useState<string | null>(null)
  const [modalLog, setModalLog] = useState(false)
  const [retornoAgendado, setRetornoAgendado] = useState(false)
  const fimTranscricaoRef = useRef<HTMLDivElement>(null)

  const transcricaoCompleta = falasVisiveis >= transcricaoMariana.length

  // Transcrição progressiva
  useEffect(() => {
    if (fase !== 'transcrevendo' || transcricaoCompleta) return
    const t = setInterval(() => avancarTranscricao(), 1500)
    return () => clearInterval(t)
  }, [fase, transcricaoCompleta, avancarTranscricao])

  useEffect(() => {
    fimTranscricaoRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [falasVisiveis])

  if (!encounter) {
    return (
      <div className="p-8">
        <p className="text-ink-muted">Consulta não encontrada.</p>
        <Link to="/agenda" className="text-brand-600">Voltar à agenda</Link>
      </div>
    )
  }

  const contato = contatoById(encounter.contactId)!
  const ficha = fichaById(encounter.contactId)
  const prof = profById(encounter.profissionalId)
  const rx = prescricoes.find((p) => p.id === rxId)
  const consultaFinalizada = encounter.status === 'finalizada'

  const gerarPrescricao = () => {
    const id = criarPrescricao({
      contactId: encounter.contactId,
      encounterId: encounter.id,
      profissionalId: encounter.profissionalId,
      titulo: prescricaoSugeridaMariana.titulo,
      itens: prescricaoSugeridaMariana.itens,
    })
    setRxId(id)
    registrarLogIA('IA gerou rascunho de solicitação de exames pré-operatórios')
    toast({ titulo: 'Rascunho de exames gerado', descricao: 'Revise e assine para liberar ao paciente.', tipo: 'ia' })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 border-b border-line bg-surface px-6 py-3">
        <button onClick={() => navigate('/agenda')} className="rounded-lg p-1.5 text-ink-muted hover:bg-black/5"><ArrowLeft size={16} /></button>
        <Avatar nome={contato.nome} cor={contato.avatarColor} size={36} />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-ink">{contato.nome} <span className="font-normal text-ink-muted">· {contato.idade} anos</span></p>
          <p className="text-[11.5px] text-ink-muted">{encounter.tipo} · {prof?.nome} · hoje às {fmtHora(encounter.em)}</p>
        </div>
        {consultaFinalizada || fase === 'aprovada' ? (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11.5px] font-semibold text-emerald-700">
            <ShieldCheck size={13} /> Evolução registrada no prontuário
          </span>
        ) : fase === 'idle' ? (
          <button onClick={iniciarConsentimento} className="btn-ai">
            <Sparkles size={14} /> Iniciar consulta assistida
          </button>
        ) : fase === 'transcrevendo' ? (
          <span className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-[11.5px] font-semibold text-red-600">
            <span className="h-2 w-2 animate-pulse-soft rounded-full bg-red-500" /> Gravando e transcrevendo
          </span>
        ) : null}
        <button onClick={() => setModalLog(true)} className="btn-ghost px-2.5" title="Log da assistência de IA">
          <History size={15} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* ─── Esquerda: resumo clínico ─── */}
        <div className="w-[250px] shrink-0 space-y-3 overflow-y-auto border-r border-line bg-surface p-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Resumo clínico</p>
          <div className="rounded-xl border border-red-100 bg-red-50/60 p-3">
            <p className="mb-1 flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wide text-red-600"><AlertTriangle size={11} /> Alergias</p>
            {ficha.alergias.length ? ficha.alergias.map((a) => <p key={a} className="text-[12.5px] font-semibold text-red-800">{a}</p>) : <p className="text-[11.5px] text-ink-muted">Nenhuma conhecida</p>}
          </div>
          <div className="rounded-xl bg-canvas p-3">
            <p className="mb-1 flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint"><HeartPulse size={11} /> Condições</p>
            {ficha.condicoes.length ? ficha.condicoes.map((c) => <p key={c} className="text-[12px] text-ink">{c}</p>) : <p className="text-[11.5px] text-ink-muted">Nenhuma</p>}
          </div>
          <div className="rounded-xl bg-canvas p-3">
            <p className="mb-1 flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint"><Pill size={11} /> Medicamentos</p>
            {ficha.medicamentos.length ? ficha.medicamentos.map((m) => <p key={m} className="text-[12px] text-ink">{m}</p>) : <p className="text-[11.5px] text-ink-muted">Nenhum</p>}
          </div>
          <div className="rounded-xl bg-canvas p-3">
            <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Antecedentes</p>
            {ficha.antecedentes.map((a) => <p key={a} className="text-[11.5px] leading-relaxed text-ink-soft">• {a}</p>)}
          </div>
          <div className="rounded-xl bg-canvas p-3">
            <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">Contexto comercial</p>
            <p className="text-[11.5px] leading-relaxed text-ink-soft">Lead da campanha "{contato.campanha}" · avaliação de {contato.interesse?.toLowerCase()} · orçamento em rascunho aguardando esta consulta.</p>
          </div>
          <button onClick={() => navigate(`/pacientes/${contato.id}`)} className="btn-secondary w-full text-[11.5px]">Perfil 360° completo</button>
        </div>

        {/* ─── Centro: evolução ─── */}
        <div className="min-w-0 flex-1 overflow-y-auto p-6">
          {fase === 'consentimento' && (
            <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-card animate-fade-up">
              <div className="flex items-center gap-2 text-brand-700">
                <ShieldCheck size={18} />
                <p className="font-display text-[16px] font-semibold">Consentimento do paciente</p>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
                A consulta assistida grava e transcreve a conversa para apoiar o registro clínico. Confirme que a paciente <strong>{contato.nome}</strong> foi informada e consentiu com:
              </p>
              <ul className="mt-3 space-y-1.5 text-[12.5px] text-ink-soft">
                <li className="flex gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-600" /> Gravação e transcrição do áudio da consulta</li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-600" /> Uso de IA para estruturar o rascunho da evolução</li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-600" /> Revisão e aprovação final exclusivamente pelo médico</li>
              </ul>
              <p className="mt-3 rounded-lg bg-canvas px-3 py-2 text-[11px] leading-relaxed text-ink-muted">
                O consentimento fica registrado no prontuário com data, hora e responsável (Resolução CFM nº 2.454/2026).
              </p>
              <button onClick={iniciarTranscricao} className="btn-primary mt-4 w-full py-2.5">
                <Mic size={14} /> Consentimento registrado — iniciar transcrição
              </button>
            </div>
          )}

          {fase === 'idle' && !consultaFinalizada && (
            <div className="mx-auto max-w-lg pt-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ai-100 text-ai-600"><Sparkles size={24} /></span>
              <p className="mt-4 font-display text-[18px] font-semibold text-ink">Consulta pronta para começar</p>
              <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-ink-muted">
                Inicie a consulta assistida: a IA transcreve a conversa em tempo real e prepara o rascunho da evolução para a sua revisão. Você também pode registrar manualmente.
              </p>
              <div className="mt-5 flex justify-center gap-2">
                <button onClick={iniciarConsentimento} className="btn-ai"><Sparkles size={14} /> Iniciar consulta assistida</button>
                <button onClick={() => toast({ titulo: 'Registro manual', descricao: 'Na versão completa, o formulário estruturado abre aqui.', tipo: 'info' })} className="btn-secondary">Registrar manualmente</button>
              </div>
            </div>
          )}

          {(fase === 'transcrevendo' || fase === 'estruturando') && (
            <div className="mx-auto max-w-2xl">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display text-[16px] font-semibold text-ink">Transcrição em tempo real</p>
                {fase === 'transcrevendo' && transcricaoCompleta && (
                  <button onClick={estruturarComIA} className="btn-ai animate-fade-up">
                    <Sparkles size={14} /> Estruturar evolução com IA
                  </button>
                )}
                {fase === 'transcrevendo' && !transcricaoCompleta && (
                  <button onClick={estruturarComIA} className="btn-secondary">
                    <Square size={12} /> Encerrar e estruturar
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {transcricaoMariana.slice(0, falasVisiveis).map((f, i) => (
                  <div key={i} className={`flex gap-3 animate-fade-up ${f.quem === 'medico' ? '' : 'flex-row-reverse'}`}>
                    <Avatar nome={f.quem === "medico" ? prof?.nome ?? "Médico" : contato.nome} cor={f.quem === "medico" ? prof?.avatarColor : contato.avatarColor} foto={f.quem === "medico" ? prof?.foto : undefined} size={28} />
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${f.quem === 'medico' ? 'rounded-tl-md bg-surface shadow-card' : 'rounded-tr-md bg-brand-50'}`}>
                      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">{f.quem === 'medico' ? prof?.nome : contato.nome}</p>
                      <p className="text-[13px] leading-relaxed text-ink">{f.texto}</p>
                    </div>
                  </div>
                ))}
                {!transcricaoCompleta && fase === 'transcrevendo' && (
                  <div className="flex items-center gap-2 pl-10 text-[11.5px] text-ink-faint">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: '300ms' }} />
                    transcrevendo...
                  </div>
                )}
                {fase === 'estruturando' && <AIPensando texto="IA estruturando a evolução clínica a partir da transcrição" />}
                <div ref={fimTranscricaoRef} />
              </div>
            </div>
          )}

          {fase === 'rascunho' && rascunho && (
            <div className="mx-auto max-w-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-display text-[16px] font-semibold text-ink">Evolução — rascunho da IA</p>
                  <p className="text-[11.5px] text-ink-muted">Revise cada campo. Nada é gravado no prontuário sem a sua aprovação.</p>
                </div>
                <AIChip>Rascunho gerado por IA</AIChip>
              </div>

              <div className="space-y-3">
                {camposEvolucao.map((campo) => (
                  <div key={campo.id} className="rounded-xl border border-dashed border-ai-300 bg-ai-50/70 p-4">
                    <div className="mb-1.5 flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-ai-700">{campo.label}</p>
                      <button onClick={() => setEditando(editando === campo.id ? null : campo.id)} className="text-[11px] font-medium text-ai-700 hover:underline">
                        {editando === campo.id ? 'Concluir edição' : 'Editar'}
                      </button>
                    </div>
                    {editando === campo.id ? (
                      <textarea
                        autoFocus
                        className="input min-h-[80px] resize-y bg-white text-[13px]"
                        value={rascunho[campo.id]}
                        onChange={(e) => editarRascunho(campo.id, e.target.value)}
                      />
                    ) : (
                      <p className="text-[13px] leading-relaxed text-ink">{rascunho[campo.id]}</p>
                    )}
                  </div>
                ))}

                {/* CIDs sugeridos */}
                <div className="rounded-xl border border-dashed border-ai-300 bg-ai-50/70 p-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ai-700">CID-10 sugeridos — selecione os aplicáveis</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cidsSugeridosMariana.map((c) => (
                      <button
                        key={c.codigo}
                        onClick={() => toggleCid(c.codigo)}
                        className={`rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-all ${
                          cidsSelecionados.includes(c.codigo)
                            ? 'border-brand-600 bg-brand-600 text-white'
                            : 'border-ai-200 bg-white text-ink-soft hover:border-ai-300'
                        }`}
                      >
                        {c.codigo} · {c.descricao}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      aprovarEvolucao(encounter.id)
                      toast({ titulo: 'Evolução aprovada e registrada', descricao: 'Gravada no prontuário com selo de revisão médica e log auditável.', tipo: 'sucesso' })
                    }}
                    className="btn-primary flex-1 py-2.5"
                  >
                    <ShieldCheck size={14} /> Revisar e aprovar — gravar no prontuário
                  </button>
                  <button onClick={descartarRascunho} className="btn-secondary">Descartar rascunho</button>
                </div>
              </div>
            </div>
          )}

          {(fase === 'aprovada' || consultaFinalizada) && (
            <div className="mx-auto max-w-2xl">
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 animate-fade-up">
                <p className="flex items-center gap-2 text-[12.5px] font-semibold text-emerald-800">
                  <ShieldCheck size={15} /> Evolução elaborada com apoio de IA — revisada e aprovada por {prof?.nome} ({prof?.registro})
                </p>
                <p className="mt-1 text-[11px] text-emerald-700/80">Registro auditável · consentimento arquivado · Resolução CFM nº 2.454/2026</p>
              </div>

              <div className="card space-y-3.5 p-5">
                {camposEvolucao.map((campo) => {
                  const valor = (encounter as unknown as Record<string, string | undefined>)[campo.id] ?? rascunho?.[campo.id]
                  if (!valor) return null
                  return (
                    <div key={campo.id}>
                      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">{campo.label}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-ink">{valor}</p>
                    </div>
                  )
                })}
                {encounter.cids.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 border-t border-line pt-3">
                    {encounter.cids.map((c) => (
                      <span key={c.codigo} className="rounded-md bg-black/5 px-2 py-1 text-[11px] font-medium text-ink-soft">{c.codigo} — {c.descricao}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Próximos passos */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                {!rx ? (
                  <button onClick={gerarPrescricao} className="btn-ai justify-start p-4 text-left">
                    <Sparkles size={15} />
                    <span>
                      <span className="block text-[12.5px] font-semibold">Gerar pedido de exames pré-op</span>
                      <span className="block text-[10.5px] opacity-75">Rascunho da IA → revisão → assinatura</span>
                    </span>
                  </button>
                ) : (
                  <div className={`rounded-xl border p-4 ${rx.status === 'assinado' ? 'border-emerald-200 bg-emerald-50/50' : 'border-dashed border-ai-300 bg-ai-50'}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-[12.5px] font-semibold text-ink">{rx.titulo}</p>
                      <StatusPill status={rx.status} />
                    </div>
                    <ul className="mt-2 space-y-0.5 text-[11.5px] text-ink-soft">
                      {rx.itens.map((i) => (
                        <li key={i.medicamento}>• {i.medicamento}</li>
                      ))}
                    </ul>
                    {rx.status !== 'assinado' ? (
                      <button
                        onClick={() => {
                          assinarPrescricao(rx.id)
                          toast({ titulo: 'Documento assinado digitalmente', descricao: 'Certificado ICP-Brasil (simulado). Disponível no portal da paciente.', tipo: 'sucesso' })
                        }}
                        className="btn-primary mt-3 w-full"
                      >
                        <FileSignature size={13} /> Assinar com certificado digital
                      </button>
                    ) : (
                      <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        <CheckCircle2 size={12} /> Enviado ao portal da paciente
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => {
                    if (retornoAgendado) return
                    useAgendaStore.getState().criarAgendamento({
                      contactId: contato.id,
                      profissionalId: encounter.profissionalId,
                      tipo: 'retorno',
                      titulo: 'Retorno — revisão de exames pré-op',
                      inicio: emDias(14, 10),
                      duracaoMin: 30,
                      unidadeId: contato.unidadeId,
                    })
                    setRetornoAgendado(true)
                    toast({ titulo: 'Retorno agendado', descricao: 'Daqui a 14 dias, às 10h — revisão dos exames.', tipo: 'sucesso' })
                  }}
                  className={`justify-start p-4 text-left ${retornoAgendado ? 'btn-secondary opacity-60' : 'btn-secondary'}`}
                >
                  <CalendarPlus size={15} className="text-brand-600" />
                  <span>
                    <span className="block text-[12.5px] font-semibold">{retornoAgendado ? 'Retorno agendado ✓' : 'Agendar retorno com exames'}</span>
                    <span className="block text-[10.5px] text-ink-muted">Sugestão: daqui a 14 dias</span>
                  </span>
                </button>
              </div>

              <button
                onClick={() => navigate('/orcamentos/qt-mariana')}
                className="btn-primary mt-3 w-full justify-between py-3"
              >
                <span className="flex items-center gap-2"><Send size={14} /> Encaminhar ao comercial — montar plano de tratamento</span>
                <span className="text-[11px] opacity-80">Orçamento pré-preenchido com a conduta →</span>
              </button>
            </div>
          )}
        </div>

        {/* ─── Direita: assistente ─── */}
        <div className="w-[280px] shrink-0 space-y-3 overflow-y-auto border-l border-line bg-surface p-4">
          <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-ai-700"><Sparkles size={11} /> Assistente clínico</p>

          {ficha.alergias.length > 0 && (fase === 'rascunho' || fase === 'aprovada' || fase === 'transcrevendo') && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 animate-fade-up">
              <p className="flex items-center gap-1 text-[11px] font-bold text-red-700"><AlertTriangle size={11} /> Alerta de segurança</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-red-800">{respostasIAConsulta.alergia}</p>
            </div>
          )}

          {(fase === 'rascunho' || fase === 'aprovada' || consultaFinalizada) && (
            <div className="rounded-xl border border-dashed border-ai-200 bg-ai-50/60 p-3">
              <p className="text-[11px] font-semibold text-ai-700">Resumo da consulta</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">{respostasIAConsulta.resumo}</p>
            </div>
          )}

          {fase === 'transcrevendo' && (
            <div className="rounded-xl bg-canvas p-3">
              <p className="text-[11px] font-semibold text-ink-soft">Sugestões de perguntas</p>
              <ul className="mt-1.5 space-y-1.5 text-[11.5px] leading-snug text-ink-muted">
                <li>• Já teve sangramento nasal recorrente?</li>
                <li>• Usa descongestionante com frequência?</li>
                <li>• Expectativa estética: mudança sutil ou marcante?</li>
              </ul>
            </div>
          )}

          <DocShortcuts contactId={encounter.contactId} profissionalId={encounter.profissionalId} encounterId={encounter.id} />

          <div className="rounded-xl bg-canvas p-3">
            <p className="text-[11px] font-semibold text-ink-soft">Como funciona</p>
            <ol className="mt-1.5 list-inside list-decimal space-y-1 text-[11px] leading-snug text-ink-muted">
              <li>Consentimento registrado</li>
              <li>Transcrição em tempo real</li>
              <li>IA estrutura rascunho</li>
              <li>Médico revisa e edita</li>
              <li>Aprovação grava no prontuário</li>
              <li>Documentos gerados e assinados</li>
            </ol>
          </div>

          <div className="rounded-xl bg-canvas p-3">
            <p className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold text-ink-soft"><History size={11} /> Log de IA desta consulta</p>
            {logIA.length === 0 ? (
              <p className="text-[11px] text-ink-faint">Nenhuma ação de IA registrada ainda.</p>
            ) : (
              <div className="space-y-1.5">
                {logIA.map((l, i) => (
                  <p key={i} className="text-[10.5px] leading-snug text-ink-muted">
                    <span className="font-medium text-ink-soft">{fmtHora(l.em)}</span> — {l.acao}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Log completo */}
      <Modal aberto={modalLog} onFechar={() => setModalLog(false)} titulo="Log auditável da assistência de IA">
        <p className="mb-3 text-[12px] text-ink-muted">Toda interação da IA é registrada com autor, horário e desfecho — exigência de auditoria e rastreabilidade.</p>
        {logIA.length === 0 ? (
          <p className="rounded-lg bg-canvas p-4 text-center text-[12px] text-ink-muted">Nenhum evento registrado nesta sessão.</p>
        ) : (
          <div className="space-y-2">
            {logIA.map((l, i) => (
              <div key={i} className="flex gap-3 rounded-lg bg-canvas px-3 py-2">
                <span className="shrink-0 text-[11px] font-semibold text-ink-soft">{fmtRelativa(l.em)}</span>
                <span className="text-[11.5px] text-ink">{l.acao}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
