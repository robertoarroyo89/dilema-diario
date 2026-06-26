import { doc, setDoc, increment, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

// Registra el voto del usuario y actualiza los contadores agregados.
//
// IMPORTANTE: el orden importa por las reglas de seguridad. La regla de
// `results` exige que el voto del usuario YA exista (hasVoted). Por eso
// escribimos primero el voto y después incrementamos el contador.
//
// Tradeoff conocido (MVP): no es atómico. Si el segundo write fallara, el voto
// quedaría registrado pero sin sumar al contador. Para integridad total, este
// incremento debería vivir en una Cloud Function disparada por el voto.
export async function castVote(user, dilemmaId, option) {
  if (!['A', 'B'].includes(option)) throw new Error('Opción no válida.')

  const voteRef = doc(db, 'votes', `${dilemmaId}_${user.uid}`)
  const resultsRef = doc(db, 'results', dilemmaId)

  // 1) El voto (id determinista → impide doble voto; inmutable por reglas)
  await setDoc(voteRef, {
    dilemmaId,
    userId: user.uid,
    selectedOption: option,
    createdAt: serverTimestamp(),
  })

  // 2) El contador (merge:true crea el doc la primera vez)
  await setDoc(
    resultsRef,
    {
      countA: increment(option === 'A' ? 1 : 0),
      countB: increment(option === 'B' ? 1 : 0),
    },
    { merge: true }
  )
}
