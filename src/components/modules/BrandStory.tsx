import { Sparkles } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'

/** Modal institucional — a história e o propósito da marca Zaleva. */
export function BrandStoryModal({ aberto, onFechar }: { aberto: boolean; onFechar: () => void }) {
  return (
    <Modal aberto={aberto} onFechar={onFechar} larguraMax="max-w-xl">
      {/* Cabeçalho de marca */}
      <div className="-mx-6 -mt-6 mb-6 rounded-t-2xl bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 px-8 py-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 font-display text-[28px] font-bold text-white shadow-raised">
          Z
        </span>
        <h2 className="mt-4 font-display text-[28px] font-semibold tracking-wide text-white">Zaleva</h2>
        <p className="mt-1 font-display text-[15px] italic text-gold-300">Cuidado que gera valor</p>
      </div>

      <div className="space-y-4 px-1 text-[13.5px] leading-relaxed text-ink-soft">
        <p>
          Zaleva nasce de <em className="font-display font-semibold not-italic text-brand-700">Tsaleach</em>, termo hebraico associado
          às ideias de <strong className="text-ink">sucesso, prosperidade, avanço e realização</strong>.
        </p>
        <p>
          A palavra foi adaptada para criar uma marca de grafia simples, sonoridade contemporânea e pronúncia mais natural em
          português, preservando a essência de sua origem.
        </p>
        <p>
          A terminação de Zaleva também remete intuitivamente a <strong className="text-ink">valor</strong> e{' '}
          <strong className="text-ink">elevação</strong>, conceitos que reforçam o propósito da marca: promover crescimento a partir
          de experiências melhores.
        </p>
        <p>
          Para a Zaleva, a prosperidade é tanto o resultado financeiro para o profissional quanto o valor que a clínica gera para o
          paciente ao oferecer para ambos uma jornada fluida e confiável.
        </p>

        <div className="rounded-xl border border-gold-200 bg-gradient-to-r from-gold-50 to-white p-4">
          <p className="flex gap-2 text-[13.5px] leading-relaxed text-ink">
            <Sparkles size={15} className="mt-0.5 shrink-0 text-gold-500" />
            <span>
              Assim, a marca traduz uma convicção central: <strong>o sucesso da clínica é a melhor experiência do paciente e dos profissionais.</strong>
            </span>
          </p>
        </div>

        <p className="pt-1 text-center font-display text-[15px] font-semibold text-brand-800">
          Zaleva — Cuidado que gera valor.
        </p>
      </div>
    </Modal>
  )
}
