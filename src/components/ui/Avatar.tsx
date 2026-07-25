import { iniciais } from '@/lib/format'

export function Avatar({
  nome,
  cor,
  size = 36,
  className = '',
}: {
  nome: string
  cor?: string
  size?: number
  className?: string
}) {
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
