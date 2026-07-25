import { useState } from 'react'
import { FileSignature, CheckCircle2, Clock, Link2, ShieldCheck } from 'lucide-react'
import { useBillingStore } from '@/stores/useBillingStore'
import { useUiStore } from '@/stores/useUiStore'
import { useTimelineStore } from '@/stores/useTimelineStore'
import { contatoById } from '@/data/contacts'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { LutherLogo } from '@/components/modules/MedicalDoc'
import { PageHeader } from '@/components/layout/PageHeader'
import { brl, fmtData, fmtRelativa } from '@/lib/format'

export default function Contracts() {
  const { contratos, assinarContrato } = useBillingStore()
  const toast = useUiStore((s) => s.toast)
  const [selecionadoId, setSelecionadoId] = useState(contratos[0]?.id)
  const contrato = contratos.find((c) => c.id === selecionadoId) ?? contratos[0]
  const contato = contrato ? contatoById(contrato.contactId) : undefined

  return (
    <div className="mx-auto max-w-[1150px] p-6">
      <PageHeader
        titulo="Contratos & assinatura"
        subtitulo={`${contratos.filter((c) => c.status === 'assinado').length} assinados · ${contratos.filter((c) => c.status === 'enviado').length} aguardando assinatura · trilha completa de cada documento`}
      />

      <div className="grid grid-cols-5 gap-5">
        {/* Lista */}
        <div className="col-span-2 space-y-2">
          {contratos.map((c) => {
            const ct = contatoById(c.contactId)!
            return (
              <button
                key={c.id}
                onClick={() => setSelecionadoId(c.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${contrato?.id === c.id ? 'border-brand-400 bg-brand-50/50 shadow-card' : 'border-line bg-surface hover:border-ink-faint'}`}
              >
                <Avatar nome={ct.nome} cor={ct.avatarColor} size={34} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-semibold text-ink">{ct.nome}</span>
                  <span className="block truncate text-[11px] text-ink-muted">{c.titulo.replace('Contrato de prestação de serviços — ', '')}</span>
                  <span className="block text-[11px] font-medium text-ink-soft">{brl(c.valor)}</span>
                </span>
                <StatusPill status={c.status} />
              </button>
            )
          })}
        </div>

        {/* Viewer */}
        {contrato && contato && (
          <div className="col-span-3 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
              <div className="flex items-center justify-between bg-brand-950 px-6 py-4 text-white">
                <div className="flex items-center gap-3">
                  <LutherLogo size={36} />
                  <div>
                    <p className="font-display text-[15px] font-semibold">Clínica M. Luther</p>
                    <p className="text-[9.5px] uppercase tracking-[0.18em] text-white/50">Contrato de prestação de serviços</p>
                  </div>
                </div>
                <StatusPill status={contrato.status} />
              </div>
              <div className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4 text-[12px]">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Contratante</p>
                    <p className="mt-0.5 font-medium text-ink">{contato.nome}</p>
                    <p className="text-ink-muted">{contato.telefone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Objeto</p>
                    <p className="mt-0.5 font-medium text-ink">{contrato.titulo.replace('Contrato de prestação de serviços — ', '')}</p>
                    <p className="font-semibold text-gold-700">{brl(contrato.valor)}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-canvas p-4 text-[11.5px] leading-relaxed text-ink-soft">
                  <p className="mb-2 font-semibold text-ink">Cláusula 1ª — Do objeto</p>
                  <p>O presente contrato tem por objeto a prestação de serviços médicos especializados, incluindo procedimento cirúrgico, equipe, estrutura hospitalar e acompanhamento pós-operatório de 12 (doze) meses...</p>
                  <p className="mb-2 mt-3 font-semibold text-ink">Cláusula 2ª — Do investimento</p>
                  <p>O valor total de {brl(contrato.valor)}, conforme condições de pagamento pactuadas no plano de tratamento vinculado...</p>
                  <p className="mt-2 text-ink-faint">[ documento demonstrativo — 6 páginas ]</p>
                </div>

                {/* Termos vinculados */}
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Termos de consentimento vinculados</p>
                  <div className="space-y-1.5">
                    {contrato.termos.map((t) => (
                      <div key={t.nome} className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
                        <span className="text-[12px] text-ink">{t.nome}</span>
                        {t.assinado ? (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600"><CheckCircle2 size={12} /> Assinado</span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600"><Clock size={12} /> Pendente</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {contrato.status !== 'assinado' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        assinarContrato(contrato.id)
                        useTimelineStore.getState().addEvento(contrato.contactId, 'contrato', 'Contrato assinado eletronicamente', 'Assinado via link seguro · termos de consentimento incluídos', '/contratos')
                        toast({ titulo: 'Contrato assinado (simulação)', descricao: `${contato.nome} assinou via link seguro. Timeline atualizada.`, tipo: 'sucesso' })
                      }}
                      className="btn-primary flex-1"
                    >
                      <FileSignature size={14} /> Simular assinatura do paciente
                    </button>
                    <button
                      onClick={() => toast({ titulo: 'Link reenviado', descricao: 'Novo link seguro de assinatura enviado por WhatsApp.', tipo: 'info' })}
                      className="btn-secondary"
                    >
                      <Link2 size={13} /> Reenviar link
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Trilha de assinatura */}
            <div className="card p-5">
              <p className="mb-3 flex items-center gap-1.5 text-[13px] font-semibold text-ink"><ShieldCheck size={14} className="text-brand-600" /> Trilha de auditoria</p>
              <div className="space-y-0">
                {contrato.trilha.map((t, i) => (
                  <div key={i} className="relative flex gap-3 pb-4">
                    {i < contrato.trilha.length - 1 && <span className="absolute left-[5px] top-4 h-full w-px bg-line" />}
                    <span className="relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-brand-500 bg-white" />
                    <div>
                      <p className="text-[12.5px] text-ink">{t.evento}</p>
                      <p className="text-[10.5px] text-ink-faint">{fmtRelativa(t.em)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {contrato.assinadoEm && (
                <p className="mt-1 rounded-lg bg-emerald-50 px-3 py-2 text-[11.5px] text-emerald-700">
                  Assinado em {fmtData(contrato.assinadoEm)} · hash do documento e IP registrados para validade jurídica (simulado)
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
