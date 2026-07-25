import { iniciais } from '@/lib/format'

export function Avatar({
  nome,
  cor,
  foto,
  size = 36,
  className = '',
}: {
  nome: string
  cor?: string
  /** URL de foto real (ex.: profissionais). Sem foto, cai nas iniciais coloridas. */
  foto?: string
  size?: number
  className?: string
}) {
  if (foto) {
    return (
      <img
        src={foto}
        alt={nome}
        className={`shrink-0 select-none rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className={`flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{
        width: size,
        height: size,
        background: cor ?? '#0F6B5C',
        fontSize: Math.max(10, size * 0.36),
      }}
      aria-hidden
    >
      {iniciais(nome)}
    </div>
  )
}
