import { FileSignature, CheckCircle2, ShieldCheck } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { StatusPill } from '@/components/ui/StatusPill'
import type { DocStatus } from '@/data/types'
import { contatoById } from '@/data/contacts'
import { profById, unidades } from '@/data/team'
import { fmtData, fmtHora } from '@/lib/format'

/**
 * Logomarca fictícia da Clínica M. Luther — retrato estilizado de Martinho
 * Lutero (boina de estudioso e toga), em silhueta dourada sobre fundo escuro.
 */
export function LutherLogo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="Clínica M. Luther">
      <circle cx="24" cy="24" r="23" fill="#07332C" stroke="#CCA84A" strokeWidth="1.5" />
      {/* Toga / ombros */}
      <path d="M9 41c2.5-8 8.5-11.5 15-11.5S36.5 33 39 41a23 23 0 0 1-30 0Z" fill="#DCC272" />
      {/* Colarinho branco */}
      <path d="M21 30.5h6l-3 5.5-3-5.5Z" fill="#FAFAF8" />
      {/* Rosto */}
      <circle cx="24" cy="21.5" r="7.2" fill="#DCC272" />
      {/* Boina de estudioso (flat cap) */}
      <path d="M10.5 15.5c1.8-4.2 7-6.8 13.5-6.8s11.7 2.6 13.5 6.8c.3.8-.3 1.4-1.2 1.4h-24.6c-.9 0-1.5-.6-1.2-1.4Z" fill="#041F1B" />
      <rect x="16.2" y="15.9" width="15.6" height="2.4" rx="1.2" fill="#041F1B" />
    </svg>
  )
}

export interface DocView {
  id: string
  kind: 'prescricao' | 'atestado' | 'exames' | 'outro'
  titulo: string
  contactId: string
  profissionalId: string
  status: DocStatus
  em: string
  linhas: { t: string; d?: string }[]
  rodape?: string
}

/**
 * Visualizador do documento exatamente como será/foi enviado ao paciente —
 * papel timbrado da Clínica M. Luther, corpo do documento e bloco de assinatura.
 */
export function MedicalDocModal({
  doc,
  onFechar,
  onAssinar,
}: {
  doc: DocView | null
  onFechar: () => void
  onAssinar?: (id: string) => void
}) {
  if (!doc) return null
  const contato = contatoById(doc.contactId)
  const prof = profById(doc.profissionalId)
  const unidade = unidades.find((u) => u.id === contato?.unidadeId) ?? unidades[0]
  const assinado = ['assinado', 'enviado'].includes(doc.status)

  return (
    <Modal aberto={!!doc} onFechar={onFechar} larguraMax="max-w-xl">
      <div className="flex items-center justify-between pb-3 pr-6">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
          {assinado ? 'Documento enviado ao paciente' : 'Pré-visualização — como o paciente receberá'}
        </p>
        <StatusPill status={doc.status} />
      </div>

      {/* Papel timbrado */}
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-card">
        <div className="flex items-center gap-3.5 border-b-2 border-gold-300 bg-gradient-to-r from-brand-950 to-brand-900 px-6 py-4">
          <LutherLogo size={46} />
          <div className="flex-1">
            <p className="font-display text-[17px] font-semibold tracking-wide text-white">Clínica M. Luther</p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gold-200/80">Cirurgia Plástica & Estética</p>
          </div>
          <div className="text-right text-[9.5px] leading-relaxed text-white/60">
            <p>{unidade.nome}</p>
            <p>{unidade.endereco}</p>
          </div>
        </div>

        <div className="p-6">
          <p className="text-center font-display text-[16px] font-semibold uppercase tracking-wide text-ink">
            {doc.kind === 'prescricao' ? 'Prescrição Médica' : doc.kind === 'atestado' ? 'Atestado Médico' : doc.kind === 'exames' ? 'Solicitação de Exames' : doc.titulo}
          </p>

          <div className="mt-4 flex justify-between rounded-lg bg-canvas px-4 py-2.5 text-[11.5px]">
            <span><span className="text-ink-muted">Paciente:</span> <strong className="text-ink">{contato?.nome}</strong>{contato ? ` · ${contato.idade} anos` : ''}</span>
            <span className="text-ink-muted">{fmtData(doc.em)} às {fmtHora(doc.em)}</span>
          </div>

          <div className="mt-5 min-h-[120px] space-y-3.5">
            {doc.linhas.map((l, i) => (
              <div key={i} className="flex gap-2.5">
                {doc.kind !== 'atestado' && <span className="mt-0.5 text-[12px] font-semibold text-brand-700">{i + 1}.</span>}
                <div>
                  <p className="text-[13px] font-medium leading-relaxed text-ink">{l.t}</p>
                  {l.d && <p className="text-[11.5px] italic text-ink-muted">{l.d}</p>}
                </div>
              </div>
            ))}
          </div>

          {doc.rodape && <p className="mt-4 rounded-lg bg-canvas px-3 py-2 text-[10.5px] leading-relaxed text-ink-muted">{doc.rodape}</p>}

          {/* Bloco de assinatura */}
          <div className="mt-7 flex items-end justify-between border-t border-dashed border-line pt-4">
            <div className="text-[9.5px] leading-relaxed text-ink-faint">
              <p>Documento eletrônico gerado pela plataforma Zaleva.</p>
              <p>Validação: zaleva.app/validar · código {doc.id.toUpperCase()}</p>
            </div>
            <div className="text-center">
              {assinado ? (
                <>
                  <p className="font-display text-[15px] italic text-brand-800" style={{ fontFamily: 'Fraunces Variable, serif' }}>
                    {prof?.nome}
                  </p>
                  <div className="mx-auto mt-0.5 h-px w-44 bg-ink/30" />
                  <p className="mt-1 text-[10.5px] font-medium text-ink-soft">{prof?.nome} · {prof?.registro}</p>
                  <p className="flex items-center justify-center gap-1 text-[9.5px] text-emerald-600">
                    <ShieldCheck size={10} /> Assinado digitalmente — ICP-Brasil (simulado)
                  </p>
                </>
              ) : (
                <>
                  <div className="mx-auto h-px w-44 bg-ink/20" />
                  <p className="mt-1 text-[10.5px] text-ink-muted">{prof?.nome} · {prof?.registro}</p>
                  <p className="text-[9.5px] text-ink-faint">aguardando assinatura digital</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {!assinado && onAssinar && (
          <button onClick={() => onAssinar(doc.id)} className="btn-primary flex-1 py-2.5">
            <FileSignature size={14} /> Assinar com certificado digital e enviar ao paciente
          </button>
        )}
        {assinado && (
          <p className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-50 py-2.5 text-[12px] font-medium text-emerald-700">
            <CheckCircle2 size={14} /> Disponível no portal do paciente e enviado por WhatsApp
          </p>
        )}
        <button onClick={onFechar} className="btn-secondary">Fechar</button>
      </div>
    </Modal>
  )
}
