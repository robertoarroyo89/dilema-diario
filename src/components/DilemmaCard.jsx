import { useAuth } from '../hooks/useAuth'
import { useDilemmaVote } from '../hooks/useDilemmaVote'

const nf = new Intl.NumberFormat('es-ES')

// Clases literales por opción (Tailwind necesita verlas completas)
const STYLES = {
  A: {
    text: 'text-optionA',
    chip: 'glass-a',
    border: 'border-optionA-ring',
    fillChosen: 'bg-optionA-ring',
    fillSoft: 'bg-optionA-tint',
  },
  B: {
    text: 'text-optionB',
    chip: 'glass-b',
    border: 'border-optionB-ring',
    fillChosen: 'bg-optionB-ring',
    fillSoft: 'bg-optionB-tint',
  },
}

export default function DilemmaCard({ dilemma }) {
  const { user } = useAuth()
  const { loading, voted, selectedOption, pctA, pctB, total, voting, error, submit } =
    useDilemmaVote(dilemma.id, user)

  const eyebrow =
    dilemma.type === 'group' ? dilemma.groupName || 'Dilema de grupo' : 'Dilema global'

  return (
    <article className="glass rounded-[28px] p-6 animate-fade-up">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
          {eyebrow}
        </p>
        {voted && (
          <span className="font-mono text-[11px] text-ink-faint">
            {nf.format(total)} voto{total !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Pregunta */}
      <h2 className="font-display text-[22px] font-600 tracking-[-0.01em] text-ink leading-snug mb-6">
        {dilemma.question}
      </h2>

      {loading ? (
        <div className="space-y-3">
          <div className="h-16 rounded-2xl bg-white/5 animate-pulse" />
          <div className="h-16 rounded-2xl bg-white/5 animate-pulse" />
        </div>
      ) : !voted ? (
        // ---- PRE-VOTO ----
        <>
          <div className="space-y-3">
            <OptionButton letter="A" color="A" disabled={voting} onClick={() => submit('A')}>
              {dilemma.optionA}
            </OptionButton>
            <OptionButton letter="B" color="B" disabled={voting} onClick={() => submit('B')}>
              {dilemma.optionB}
            </OptionButton>
          </div>

          {error && <p className="text-sm text-optionA mt-3">{error}</p>}

          <p className="flex items-center justify-center gap-1.5 text-ink-faint text-xs mt-5">
            <LockIcon /> Los resultados se desbloquean al votar
          </p>
        </>
      ) : (
        // ---- POST-VOTO ----
        <div className="space-y-3 animate-spring">
          <ResultRow letter="A" color="A" label={dilemma.optionA} pct={pctA} chosen={selectedOption === 'A'} />
          <ResultRow letter="B" color="B" label={dilemma.optionB} pct={pctB} chosen={selectedOption === 'B'} />
        </div>
      )}
    </article>
  )
}

function OptionButton({ letter, color, children, ...props }) {
  const s = STYLES[color]
  return (
    <button
      className={`group w-full text-left rounded-2xl ${s.chip} px-4 py-4 flex items-center gap-3 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none`}
      {...props}
    >
      <span
        className={`font-mono text-sm font-600 ${s.text} h-8 w-8 shrink-0 grid place-items-center rounded-full border ${s.border}`}
      >
        {letter}
      </span>
      <span className="text-ink leading-snug">{children}</span>
    </button>
  )
}

function ResultRow({ letter, color, label, pct, chosen }) {
  const s = STYLES[color]
  return (
    <div
      className={`relative overflow-hidden rounded-2xl glass border ${
        chosen ? s.border : 'border-white/10'
      }`}
    >
      <div
        className={`absolute inset-y-0 left-0 origin-left animate-bar-grow ${
          chosen ? s.fillChosen : s.fillSoft
        }`}
        style={{ width: `${pct}%` }}
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-3 px-4 py-4">
        <span
          className={`font-mono text-sm font-600 ${s.text} h-8 w-8 shrink-0 grid place-items-center rounded-full border ${s.border}`}
        >
          {letter}
        </span>
        <span className={`flex-1 leading-snug ${chosen ? 'text-ink' : 'text-ink-muted'}`}>
          {label}
          {chosen && (
            <span className="ml-2 align-middle font-mono text-[10px] uppercase tracking-wider text-ink-faint">
              · tu voto
            </span>
          )}
        </span>
        <span className={`font-mono text-lg font-600 ${chosen ? s.text : 'text-ink-muted'}`}>
          {pct}%
        </span>
      </div>
    </div>
  )
}

function LockIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
