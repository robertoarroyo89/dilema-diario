import { useGlobalDilemma } from '../hooks/useDilemmas'
import DilemmaCard from '../components/DilemmaCard'

// Dilema de muestra: solo se enseña si hoy no hay ninguno programado, para que
// puedas probar la mecánica antes de importar el contenido real.
const DEMO_DILEMMA = {
  id: 'demo-001',
  type: 'global',
  question: '¿Preferirías saber la fecha exacta de tu muerte, o la causa, pero nunca ambas?',
  optionA: 'La fecha',
  optionB: 'La causa',
}

export default function GlobalFeed() {
  const { dilemma, loading } = useGlobalDilemma()

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
      </div>
    )
  }

  if (dilemma) return <DilemmaCard dilemma={dilemma} />

  // Sin dilema para hoy → estado vacío + tarjeta demo
  return (
    <div className="space-y-4">
      <div className="glass rounded-[28px] p-6 text-center">
        <p className="text-ink font-500">Hoy todavía no hay dilema global</p>
        <p className="text-ink-faint text-sm mt-1">
          Aparecerá en cuanto importes el contenido con la fecha de hoy.
        </p>
      </div>
      <p className="text-center font-mono text-[11px] uppercase tracking-widest text-ink-faint">
        Mientras tanto · prueba la mecánica
      </p>
      <DilemmaCard dilemma={DEMO_DILEMMA} />
    </div>
  )
}
