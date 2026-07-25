import { useState } from 'react'
import { FilePlus2, Stethoscope, Eye } from 'lucide-react'
import { useClinicalStore } from '@/stores/useClinicalStore'
import { useUiStore } from '@/stores/useUiStore'
import { contatoById } from '@/data/contacts'
import { fichaById } from '@/data/clinical'
import { StatusPill } from '@/components/ui/StatusPill'
import { MedicalDocModal, type DocView } from './MedicalDoc'
import { fmtHora } from '@/lib/format'

type Sel = { kind: 'rx' | 'doc'; id: string } | null

/**
 * Atalhos para emitir prescrição/atestado a qualquer momento da consulta ou
 * teleconsulta, com visualização do documento como o paciente o receberá.
 */
export function DocShortcuts({
  contactId,
  profissionalId,
  encounterId,
  compacto = false,
}: {
  contactId: string
  profissionalId: string
  encounterId?: string
  compacto?: boolean
}) {
  const { prescricoes, documentos, criarPrescricao, assinarPrescricao, addDocumento, assinarDocumento, registrarLogIA } = useClinicalStore()
  const toast = useUiStore((s) => s.toast)
  const [sel, setSel] = useState<Sel>(null)
  const contato = contatoById(contactId)!
  const ficha = fichaById(contactId)

  // Documentos emitidos nesta sessão/para este paciente (recentes primeiro)
  const emitidos = [
    ...prescricoes
      .filter((p) => p.contactId === contactId && (!encounterId || !p.encounterId || p.encounterId === encounterId))
      .map((p) => ({ kind: 'rx' as const, id: p.id, titulo: p.titulo, status: p.status, em: p.em })),
    ...documentos
      .filter((d) => d.contactId === contactId && d.tipo === 'atestado')
      .map((d) => ({ kind: 'doc' as const, id: d.id, titulo: d.titulo, status: d.status, em: d.em })),
  ].sort((a, b) => b.em.localeCompare(a.em))

  const emitirPrescricao = () => {
    const alergica = ficha.alergias.some((a) => a.toLowerCase().includes('dipirona'))
    const id = criarPrescricao({
      contactId,
      encounterId,
      profissionalId,
      titulo: 'Prescrição médica',
      itens: [
        {
          medicamento: 'Paracetamol 750mg',
          posologia: `1 comprimido a cada 6 horas, se dor${alergica ? ' (alternativa segura — alergia a dipirona registrada na ficha)' : ''}`,
        },
        { medicamento: 'Ondansetrona 4mg', posologia: '1 comprimido a cada 8 horas, se náuseas' },
      ],
    })
    registrarLogIA('IA preparou rascunho de prescrição — pendente de revisão e assinatura')
    toast({ titulo: 'Rascunho de prescrição gerado', descricao: 'Revise o documento e assine para enviar ao paciente.', tipo: 'ia' })
    setSel({ kind: 'rx', id })
  }

  const emitirAtestado = () => {
    const agora = new Date()
    const id = addDocumento({
      contactId,
      tipo: 'atestado',
      titulo: 'Atestado médico — comparecimento',
      status: 'gerado-ia',
      profissionalId,
      linhas: [
        {
          t: `Atesto, para os devidos fins, que ${contato.nome} esteve sob meus cuidados profissionais nesta data, no período das ${fmtHora(new Date(agora.getTime() - 40 * 60000).toISOString())} às ${fmtHora(agora.toISOString())}, necessitando de afastamento de suas atividades laborais por 1 (um) dia.`,
        },
      ],
    })
    registrarLogIA('IA preparou rascunho de atestado — pendente de revisão e assinatura')
    toast({ titulo: 'Rascunho de atestado gerado', descricao: 'Revise o documento e assine para enviar ao paciente.', tipo: 'ia' })
    setSel({ kind: 'doc', id })
  }

  // Deriva a visualização do estado atual (reflete assinatura na hora)
  let docView: DocView | null = null
  if (sel?.kind === 'rx') {
    const p = prescricoes.find((x) => x.id === sel.id)
    if (p) {
      docView = {
        id: p.id,
        kind: p.titulo.toLowerCase().includes('exame') ? 'exames' : 'prescricao',
        titulo: p.titulo,
        contactId: p.contactId,
        profissionalId: p.profissionalId,
        status: p.status,
        em: p.em,
        linhas: p.itens.map((i) => ({ t: i.medicamento, d: i.posologia })),
        rodape: 'Uso conforme orientação médica. Em caso de reação inesperada, suspenda o uso e contate a clínica imediatamente.',
      }
    }
  } else if (sel?.kind === 'doc') {
    const d = documentos.find((x) => x.id === sel.id)
    if (d) {
      docView = {
        id: d.id,
        kind: d.tipo === 'atestado' ? 'atestado' : 'outro',
        titulo: d.titulo,
        contactId: d.contactId,
        profissionalId: d.profissionalId ?? profissionalId,
        status: d.status,
        em: d.em,
        linhas: d.linhas ?? [{ t: d.titulo }],
      }
    }
  }

  return (
    <div className={compacto ? '' : 'rounded-xl bg-canvas p-3'}>
      <p className="mb-2 flex items-center gap-1 text-[11px] font-semibold text-ink-soft">
        <FilePlus2 size={11} /> Documentos da consulta
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        <button onClick={emitirPrescricao} className="btn-secondary justify-center bg-white py-1.5 text-[11px]">
          <Stethoscope size={11} /> Prescrição
        </button>
        <button onClick={emitirAtestado} className="btn-secondary justify-center bg-white py-1.5 text-[11px]">
          <FilePlus2 size={11} /> Atestado
        </button>
      </div>

      {emitidos.length > 0 && (
        <div className="mt-2.5 space-y-1.5">
          {emitidos.map((e) => (
            <button
              key={e.id}
              onClick={() => setSel({ kind: e.kind, id: e.id })}
              className="flex w-full items-center gap-2 rounded-lg border border-line bg-white px-2.5 py-2 text-left transition-colors hover:border-brand-300"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11.5px] font-medium text-ink">{e.titulo}</span>
                <span className="block text-[9.5px] text-ink-faint">{fmtHora(e.em)}</span>
              </span>
              <StatusPill status={e.status} />
              <Eye size={12} className="shrink-0 text-brand-600" />
            </button>
          ))}
        </div>
      )}

      <MedicalDocModal
        doc={docView}
        onFechar={() => setSel(null)}
        onAssinar={(id) => {
          if (sel?.kind === 'rx') assinarPrescricao(id)
          else assinarDocumento(id)
          toast({ titulo: 'Documento assinado e enviado', descricao: `${contato.nome.split(' ')[0]} recebeu no portal e por WhatsApp.`, tipo: 'sucesso' })
        }}
      />
    </div>
  )
}
