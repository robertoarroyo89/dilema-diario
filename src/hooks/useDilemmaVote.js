import { useEffect, useMemo, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { castVote } from '../lib/votes'

// Gestiona un único dilema: si el usuario votó, qué votó, y los resultados.
// Los resultados SOLO se suscriben una vez existe el voto (las reglas bloquean
// la lectura antes de votar, así que ni lo intentamos).
export function useDilemmaVote(dilemmaId, user) {
  const [vote, setVote] = useState(undefined) // undefined = cargando, null = sin votar
  const [results, setResults] = useState(null)
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState('')

  // Suscripción al voto propio
  useEffect(() => {
    if (!user || !dilemmaId) return
    return onSnapshot(
      doc(db, 'votes', `${dilemmaId}_${user.uid}`),
      (snap) => setVote(snap.exists() ? snap.data() : null),
      () => setVote(null)
    )
  }, [user, dilemmaId])

  // Una vez votado, suscripción a los resultados en tiempo real
  useEffect(() => {
    if (!vote || !dilemmaId) return
    return onSnapshot(
      doc(db, 'results', dilemmaId),
      (snap) => setResults(snap.exists() ? snap.data() : { countA: 0, countB: 0 }),
      () => setResults({ countA: 0, countB: 0 })
    )
  }, [vote, dilemmaId])

  const submit = async (option) => {
    if (voting || vote) return
    setVoting(true)
    setError('')
    try {
      await castVote(user, dilemmaId, option)
      // El snapshot del voto se actualizará solo y disparará la revelación
    } catch (e) {
      setError('No se pudo registrar tu voto. Inténtalo de nuevo.')
    } finally {
      setVoting(false)
    }
  }

  // Porcentajes (pctB = 100 - pctA para que siempre sumen 100)
  const { pctA, pctB, total } = useMemo(() => {
    const a = results?.countA || 0
    const b = results?.countB || 0
    const t = a + b
    const pa = t ? Math.round((a / t) * 100) : 0
    return { pctA: pa, pctB: t ? 100 - pa : 0, total: t }
  }, [results])

  return {
    loading: vote === undefined,
    voted: !!vote,
    selectedOption: vote?.selectedOption || null,
    results,
    pctA,
    pctB,
    total,
    voting,
    error,
    submit,
  }
}
