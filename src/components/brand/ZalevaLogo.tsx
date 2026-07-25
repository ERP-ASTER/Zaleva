import { useId } from 'react'

/**
 * Identidade visual Zaleva — derivações do conceito de marca oficial:
 * monograma "Z" em petróleo com swoosh ascendente (gradiente teal→dourado),
 * seta e ponto dourados. Variantes: colorida (fundos claros) e negativa
 * (marca clara sobre fundos escuros/verdes).
 */

export const CORES_MARCA = {
  petroleo: '#17505E',
  dourado: '#C9A24B',
  claro: '#FAFAF8',
}

interface MarkProps {
  size?: number
  /** true = versão negativa (traço claro) para fundos escuros */
  negativa?: boolean
  /** cor do "furo" do ponto central (casar com o fundo onde a marca está aplicada) */
  fundoAnel?: string
  className?: string
}

/** Monograma "Z" — símbolo isolado da marca. */
export function ZalevaMark({ size = 40, negativa = false, fundoAnel, className }: MarkProps) {
  const gid = useId()
  const corZ = negativa ? CORES_MARCA.claro : CORES_MARCA.petroleo
  const anel = fundoAnel ?? (negativa ? '#07332C' : CORES_MARCA.claro)
  return (
    <svg
      width={size}
      height={size * (132 / 128)}
      viewBox="0 0 128 132"
      fill="none"
      className={className}
      aria-label="Zaleva"
      role="img"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="1" x2="1" y2="0">
          {negativa ? (
            <>
              <stop offset="0" stopColor="#4FB3C1" />
              <stop offset="0.55" stopColor="#8CC7A1" />
              <stop offset="1" stopColor="#DFC06B" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#2E7D8C" />
              <stop offset="0.55" stopColor="#5FA98E" />
              <stop offset="1" stopColor={CORES_MARCA.dourado} />
            </>
          )}
        </linearGradient>
      </defs>
      {/* Z — dois ganchos e diagonal, terminais arredondados */}
      <path
        d="M26 46 C14 34 22 18 40 18 L84 18 C99 18 104 30 95 40 L40 100 C31 110 36 122 51 122 L88 122 C103 122 111 108 101 97"
        stroke={corZ}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Swoosh ascendente (crescimento) */}
      <path
        d="M22 114 C40 112 54 100 64 76 C72 57 86 38 100 22"
        stroke={`url(#${gid})`}
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Seta dourada */}
      <path d="M112 9 L107.3 22.1 L99.5 15.3 Z" fill={negativa ? '#DFC06B' : CORES_MARCA.dourado} />
      {/* Ponto de valor no cruzamento */}
      <circle cx="67" cy="70" r="5.5" fill={negativa ? '#DFC06B' : CORES_MARCA.dourado} stroke={anel} strokeWidth="3" />
    </svg>
  )
}

/** Lockup horizontal — símbolo + nome. Para cabeçalhos e barras. */
export function ZalevaWordmark({
  negativa = false,
  size = 30,
  fundoAnel,
  className = '',
}: MarkProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <ZalevaMark size={size} negativa={negativa} fundoAnel={fundoAnel} />
      <span
        className="font-display font-medium tracking-wide"
        style={{ color: negativa ? CORES_MARCA.claro : CORES_MARCA.petroleo, fontSize: size * 0.72 }}
      >
        Zaleva
      </span>
    </span>
  )
}

/** Lockup vertical completo — símbolo + nome + filete + tagline (conceito integral). */
export function ZalevaLockup({
  negativa = false,
  size = 96,
  fundoAnel,
  className = '',
}: MarkProps) {
  const corTexto = negativa ? CORES_MARCA.claro : CORES_MARCA.petroleo
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <ZalevaMark size={size} negativa={negativa} fundoAnel={fundoAnel} />
      <p
        className="mt-3 font-display font-medium leading-none tracking-wide"
        style={{ color: corTexto, fontSize: size * 0.44 }}
      >
        Zaleva
      </p>
      <span className="mt-3 h-px w-9" style={{ background: negativa ? '#DFC06B' : CORES_MARCA.dourado }} />
      <p
        className="mt-2 font-medium uppercase"
        style={{ color: negativa ? 'rgba(250,250,248,0.75)' : '#5A6B70', fontSize: Math.max(8, size * 0.105), letterSpacing: '0.28em' }}
      >
        Cuidado que gera valor
      </p>
    </div>
  )
}
