import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stethoscope, ConciergeBell, Briefcase, LineChart, Building2, ArrowRight, Sparkles } from 'lucide-react'
import { useSessionStore } from '@/stores/useSessionStore'
import { unidades } from '@/data/team'
import type { Papel } from '@/data/types'

const papeis: { id: Papel; label: string; desc: string; icone: typeof Stethoscope }[] = [
  { id: 'medico', label: 'Médico', desc: 'Agenda, prontuário e consulta assistida', icone: Stethoscope },
  { id: 'recepcao', label: 'Recepção', desc: 'Fila do dia, confirmações e check-in', icone: ConciergeBell },
  { id: 'comercial', label: 'Comercial', desc: 'Leads, funil e orçamentos', icone: Briefcase },
  { id: 'gestor', label: 'Gestor', desc: 'Indicadores e visão executiva', icone: LineChart },
]

export default function Login() {
  const navigate = useNavigate()
  const login = useSessionStore((s) => s.login)
  const [email, setEmail] = useState('renato.somensi@mluther.med.br')
  const [senha, setSenha] = useState('••••••••')
  const [etapa, setEtapa] = useState<'credenciais' | 'contexto'>('credenciais')
  const [papel, setPapel] = useState<Papel>('medico')
  const [unidade, setUnidade] = useState('un-toledo')

  const entrar = () => {
    login(papel, unidade)
    navigate('/')
  }

  return (
    <div className="flex min-h-screen">
      {/* Painel de marca */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-brand-950 p-12 lg:flex">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 font-display text-xl font-bold text-white">Z</span>
          <span className="font-display text-2xl font-semibold tracking-wide text-white">Zaleva</span>
        </div>
        <div className="relative">
          <p className="font-display text-[34px] font-medium leading-tight text-white">
            Cuidado e resultado
            <br />
            avançam <em className="text-gold-300">juntos</em>.
          </p>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/60">
            A plataforma que acompanha a jornada completa do paciente — do primeiro contato à recorrência — com inteligência artificial em cada etapa.
          </p>
          <div className="mt-8 flex items-center gap-2 text-[12px] text-white/50">
            <Sparkles size={14} className="text-gold-300" />
            Marketing · Conversa · CRM · Agenda · Consulta · Contrato · Pós-atendimento
          </div>
        </div>
        <p className="relative text-[11px] text-white/30">Protótipo demonstrativo — todos os dados são fictícios</p>
      </div>

      {/* Formulário */}
      <div className="flex flex-1 items-center justify-center bg-canvas p-8">
        <div className="w-full max-w-sm animate-fade-up">
          {etapa === 'credenciais' ? (
            <>
              <h1 className="font-display text-[24px] font-semibold text-ink">Bem-vindo de volta</h1>
              <p className="mt-1 text-[13px] text-ink-muted">Entre para acessar a Clínica M. Luther</p>
              <div className="mt-7 space-y-3.5">
                <div>
                  <label className="mb-1 block text-[11.5px] font-medium text-ink-soft">E-mail</label>
                  <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-[11.5px] font-medium text-ink-soft">Senha</label>
                  <input className="input" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
                </div>
                <button onClick={() => setEtapa('contexto')} className="btn-primary w-full py-2.5">
                  Continuar <ArrowRight size={14} />
                </button>
                <p className="text-center text-[11px] text-ink-faint">Demonstração: qualquer credencial funciona</p>
              </div>
            </>
          ) : (
            <>
              <h1 className="font-display text-[24px] font-semibold text-ink">Como você vai trabalhar hoje?</h1>
              <p className="mt-1 text-[13px] text-ink-muted">O Zaleva adapta a experiência ao seu papel</p>

              <p className="mb-2 mt-6 text-[11.5px] font-medium text-ink-soft">Unidade</p>
              <div className="grid grid-cols-2 gap-2">
                {unidades.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setUnidade(u.id)}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-all ${
                      unidade === u.id ? 'border-brand-500 bg-brand-50 shadow-card' : 'border-line bg-surface hover:border-ink-faint'
                    }`}
                  >
                    <Building2 size={16} className={unidade === u.id ? 'text-brand-600' : 'text-ink-faint'} />
                    <span className="text-[12.5px] font-medium text-ink">{u.nome}</span>
                  </button>
                ))}
              </div>

              <p className="mb-2 mt-5 text-[11.5px] font-medium text-ink-soft">Papel</p>
              <div className="space-y-2">
                {papeis.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPapel(p.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                      papel === p.id ? 'border-brand-500 bg-brand-50 shadow-card' : 'border-line bg-surface hover:border-ink-faint'
                    }`}
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${papel === p.id ? 'bg-brand-600 text-white' : 'bg-black/5 text-ink-muted'}`}>
                      <p.icone size={17} />
                    </span>
                    <span>
                      <span className="block text-[13px] font-semibold text-ink">{p.label}</span>
                      <span className="block text-[11.5px] text-ink-muted">{p.desc}</span>
                    </span>
                  </button>
                ))}
              </div>

              <button onClick={entrar} className="btn-primary mt-5 w-full py-2.5">
                Entrar na plataforma <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
