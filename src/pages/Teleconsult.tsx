import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  PhoneOff,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Send,
  Rocket,
  ShieldCheck,
} from 'lucide-react'
import { useUiStore } from '@/stores/useUiStore'
import { useTimelineStore } from '@/stores/useTimelineStore'
import { contatoById } from '@/data/contacts'
import { profById } from '@/data/team'
import { Avatar } from '@/components/ui/Avatar'
import { AIChip } from '@/components/ui/AISuggestion'
import { DocShortcuts } from '@/components/modules/DocShortcuts'
import { fmtHora } from '@/lib/format'

const CONTATO_ID = 'ct-gustavo'
const PROF_ID = 'prof-otavio'

export default function Teleconsult() {
  const navigate = useNavigate()
  const toast = useUiStore((s) => s.toast)
  const [fase, setFase] = useState<'espera' | 'chamada' | 'encerrada'>('espera')
  const [mic, setMic] = useState(true)
  const [cam, setCam] = useState(true)
  const [chat, setChat] = useState<{ autor: string; texto: string; em: string }[]>([
    { autor: 'Gustavo Lira', texto: 'Boa tarde, doutor! Consegui entrar certinho.', em: new Date().toISOString() },
  ])
  const [msgChat, setMsgChat] = useState('')
  const [duracao, setDuracao] = useState(0)
  const [transcricao, setTranscricao] = useState<string[]>([])

  const contato = contatoById(CONTATO_ID)!
  const prof = profById(PROF_ID)!

  const falas = [
    'Dr. Renato: Boa tarde, Gustavo! Como vai? Me conta o que te incomoda nas pálpebras.',
    'Gustavo: No fim do dia sinto peso nos olhos, e nas fotos pareço sempre cansado...',
    'Dr. Renato: Entendo. Aproxime um pouco a câmera, por favor... Consigo ver um excesso de pele palpebral superior bilateral.',
    'Gustavo: E isso resolve com cirurgia? Como é a recuperação?',
    'Dr. Renato: Sim, a blefaroplastia superior resolve muito bem. São 7 a 10 dias de recuperação social...',
  ]

  useEffect(() => {
    if (fase !== 'chamada') return
    const t = setInterval(() => setDuracao((d) => d + 1), 1000)
    return () => clearInterval(t)
  }, [fase])

  useEffect(() => {
    if (fase !== 'chamada') return
    if (transcricao.length >= falas.length) return
    const t = setTimeout(() => setTranscricao((prev) => [...prev, falas[prev.length]]), 3500)
    return () => clearTimeout(t)
  }, [fase, transcricao])

  const encerrar = () => {
    setFase('encerrada')
    useTimelineStore.getState().addEvento(CONTATO_ID, 'consulta', 'Teleconsulta realizada — avaliação de blefaroplastia', `${Math.max(1, Math.round(duracao / 60))} min · transcrição arquivada · evolução em rascunho para revisão`, '/pacientes/ct-gustavo')
    toast({ titulo: 'Teleconsulta encerrada', descricao: 'Registro criado no prontuário com a transcrição e o rascunho da evolução.', tipo: 'sucesso' })
  }

  if (fase === 'espera') {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="mb-5 rounded-xl border border-ai-200 bg-gradient-to-r from-ai-50 to-white p-3.5 text-[12px] text-ai-700">
          <Rocket size={13} className="mr-1.5 inline" />
          <strong>Em breve:</strong> novas experiências de teleconsulta — este módulo evoluirá com uma proposta disruptiva de atendimento remoto.
        </div>
        <div className="card overflow-hidden">
          <div className="border-b border-line bg-canvas px-6 py-4">
            <h1 className="font-display text-[18px] font-semibold text-ink">Sala de espera virtual</h1>
            <p className="text-[12px] text-ink-muted">Teleconsulta — Avaliação de blefaroplastia · {contato.nome} · hoje às 11h30</p>
          </div>
          <div className="grid grid-cols-2 gap-6 p-6">
            <div>
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-ink">
                {cam ? (
                  <>
                    <Avatar nome={prof.nome} cor={prof.avatarColor} foto={prof.foto} size={72} />
                    <span className="absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">Sua câmera (prévia)</span>
                  </>
                ) : (
                  <VideoOff size={28} className="text-white/40" />
                )}
              </div>
              <div className="mt-3 flex justify-center gap-2">
                <button onClick={() => setMic(!mic)} className={`rounded-full p-3 ${mic ? 'bg-black/5 text-ink' : 'bg-red-100 text-red-600'}`}>
                  {mic ? <Mic size={16} /> : <MicOff size={16} />}
                </button>
                <button onClick={() => setCam(!cam)} className={`rounded-full p-3 ${cam ? 'bg-black/5 text-ink' : 'bg-red-100 text-red-600'}`}>
                  {cam ? <Video size={16} /> : <VideoOff size={16} />}
                </button>
              </div>
              <div className="mt-3 space-y-1.5 text-[12px]">
                <p className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 size={13} /> Câmera detectada — Full HD</p>
                <p className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 size={13} /> Microfone detectado — nível ok</p>
                <p className="flex items-center gap-1.5 text-emerald-600"><CheckCircle2 size={13} /> Conexão estável — 48 Mbps</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 rounded-xl bg-canvas p-3.5">
                <Avatar nome={contato.nome} cor={contato.avatarColor} size={40} />
                <div>
                  <p className="text-[13px] font-semibold text-ink">{contato.nome} está na sala de espera</p>
                  <p className="text-[11.5px] text-ink-muted">Entrou há 2 minutos · dispositivos testados ✓</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-line p-4">
                <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink"><ShieldCheck size={14} className="text-brand-600" /> Consentimento da teleconsulta</p>
                <ul className="mt-2 space-y-1 text-[11.5px] leading-relaxed text-ink-soft">
                  <li>✓ Paciente aceitou os termos do atendimento remoto</li>
                  <li>✓ Autorizou gravação e transcrição pela IA</li>
                  <li>✓ Link seguro de uso único validado</li>
                </ul>
              </div>
              <div className="flex-1" />
              <button onClick={() => setFase('chamada')} className="btn-primary mt-4 w-full py-3">
                <Video size={15} /> Iniciar teleconsulta
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (fase === 'encerrada') {
    return (
      <div className="mx-auto max-w-lg p-6 pt-16 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600"><CheckCircle2 size={26} /></span>
        <h1 className="mt-4 font-display text-[20px] font-semibold text-ink">Teleconsulta encerrada</h1>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-ink-muted">
          A transcrição foi arquivada e a evolução em rascunho aguarda sua revisão no prontuário do paciente. A negociação no CRM foi atualizada automaticamente.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => navigate('/pacientes/ct-gustavo')} className="btn-primary">Abrir prontuário do Gustavo</button>
          <button onClick={() => navigate('/agenda')} className="btn-secondary">Voltar à agenda</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-ink">
      {/* Vídeo */}
      <div className="relative flex min-w-0 flex-1 flex-col p-4">
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900">
          <div className="text-center">
            <Avatar nome={contato.nome} cor={contato.avatarColor} size={110} className="mx-auto ring-4 ring-white/10" />
            <p className="mt-3 text-[15px] font-medium text-white">{contato.nome}</p>
          </div>
          <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-red-500/90 px-2.5 py-1 text-[11px] font-semibold text-white">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-white" /> AO VIVO · {Math.floor(duracao / 60)}:{String(duracao % 60).padStart(2, '0')}
          </span>
          <span className="absolute right-4 top-4 rounded-full bg-black/40 px-2.5 py-1 text-[10.5px] text-white/80">Criptografia ponta a ponta</span>
          {/* Miniatura do médico */}
          <div className="absolute bottom-4 right-4 flex h-28 w-44 items-center justify-center rounded-xl bg-zinc-950 ring-1 ring-white/15">
            {cam ? <Avatar nome={prof.nome} cor={prof.avatarColor} foto={prof.foto} size={48} /> : <VideoOff size={20} className="text-white/40" />}
            <span className="absolute bottom-1.5 left-2 text-[9.5px] text-white/70">{prof.nome}</span>
          </div>
        </div>
        {/* Controles */}
        <div className="flex items-center justify-center gap-3 py-4">
          <button onClick={() => setMic(!mic)} className={`rounded-full p-3.5 transition-colors ${mic ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white'}`}>
            {mic ? <Mic size={18} /> : <MicOff size={18} />}
          </button>
          <button onClick={() => setCam(!cam)} className={`rounded-full p-3.5 transition-colors ${cam ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white'}`}>
            {cam ? <Video size={18} /> : <VideoOff size={18} />}
          </button>
          <button onClick={() => toast({ titulo: 'Compartilhamento de tela', descricao: 'Disponível na versão completa.', tipo: 'info' })} className="rounded-full bg-white/10 p-3.5 text-white hover:bg-white/20">
            <MonitorUp size={18} />
          </button>
          <button onClick={encerrar} className="flex items-center gap-2 rounded-full bg-red-500 px-6 py-3.5 text-[13px] font-semibold text-white hover:bg-red-600">
            <PhoneOff size={17} /> Encerrar
          </button>
        </div>
      </div>

      {/* Painel lateral: chat + IA */}
      <div className="flex w-[320px] shrink-0 flex-col border-l border-white/10 bg-surface">
        <div className="border-b border-line p-4">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ai-700"><Sparkles size={13} /> Assistente da consulta <AIChip className="ml-auto">transcrevendo</AIChip></p>
          <div className="mt-3 max-h-48 space-y-1.5 overflow-y-auto">
            {transcricao.map((f, i) => (
              <p key={i} className="text-[11.5px] leading-relaxed text-ink-soft animate-fade-up">{f}</p>
            ))}
            {transcricao.length < falas.length && (
              <p className="flex items-center gap-1 text-[11px] text-ink-faint">
                <span className="h-1 w-1 animate-bounce rounded-full bg-ink-faint" />
                <span className="h-1 w-1 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: '150ms' }} />
                <span className="h-1 w-1 animate-bounce rounded-full bg-ink-faint" style={{ animationDelay: '300ms' }} />
              </p>
            )}
          </div>
          {transcricao.length >= 3 && (
            <div className="mt-3 rounded-lg border border-dashed border-ai-300 bg-ai-50 p-2.5 animate-fade-up">
              <p className="text-[10.5px] font-semibold text-ai-700">Rascunho em construção</p>
              <p className="mt-1 text-[11px] leading-snug text-ink-soft">Queixa: peso palpebral vespertino + aspecto cansado. Achado: dermatocálase superior bilateral. Hipótese: indicação de blefaroplastia superior.</p>
            </div>
          )}
        </div>
        <div className="border-b border-line p-3">
          <DocShortcuts contactId={CONTATO_ID} profissionalId={PROF_ID} compacto />
        </div>

        <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5 text-[12px] font-semibold text-ink">
          <MessageCircle size={13} /> Chat da consulta
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {chat.map((m, i) => (
            <div key={i} className={`${m.autor.startsWith('Dr') ? 'text-right' : ''}`}>
              <p className={`inline-block max-w-[85%] rounded-xl px-3 py-1.5 text-left text-[12px] ${m.autor.startsWith('Dr') ? 'bg-brand-600 text-white' : 'bg-canvas text-ink'}`}>{m.texto}</p>
              <p className="mt-0.5 text-[9.5px] text-ink-faint">{m.autor} · {fmtHora(m.em)}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2 border-t border-line p-3">
          <input
            className="input flex-1 py-2"
            placeholder="Mensagem ou link de arquivo..."
            value={msgChat}
            onChange={(e) => setMsgChat(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && msgChat.trim()) {
                setChat((c) => [...c, { autor: prof.nome, texto: msgChat.trim(), em: new Date().toISOString() }])
                setMsgChat('')
              }
            }}
          />
          <button
            onClick={() => {
              if (!msgChat.trim()) return
              setChat((c) => [...c, { autor: prof.nome, texto: msgChat.trim(), em: new Date().toISOString() }])
              setMsgChat('')
            }}
            className="btn-primary px-3"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
