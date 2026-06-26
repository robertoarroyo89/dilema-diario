import { useEffect, useState } from 'react'
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { todayKey } from '../lib/date'

// El dilema global de hoy (type 'global' + dateToShow == hoy).
// NOTA: Firestore pedirá crear un índice compuesto (type, dateToShow) la primera
// vez; te dará un enlace en la consola para crearlo con un clic.
export function useGlobalDilemma() {
  const [dilemma, setDilemma] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'dilemmas'),
      where('type', '==', 'global'),
      where('dateToShow', '==', todayKey()),
      limit(1)
    )
    return onSnapshot(
      q,
      (snap) => {
        setDilemma(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() })
        setLoading(false)
      },
      () => setLoading(false)
    )
  }, [])

  return { dilemma, loading }
}

// Los dilemas de hoy de los grupos del usuario (type 'group' + groupId in [...] + hoy).
// También requiere un índice compuesto (type, groupId, dateToShow).
export function useGroupDilemmas(groupIds = []) {
  const [dilemmas, setDilemmas] = useState([])
  const [loading, setLoading] = useState(true)
  const key = (groupIds || []).join(',')

  useEffect(() => {
    const ids = key ? key.split(',') : []
    if (ids.length === 0) {
      setDilemmas([])
      setLoading(false)
      return
    }
    setLoading(true)
    const q = query(
      collection(db, 'dilemmas'),
      where('type', '==', 'group'),
      where('groupId', 'in', ids.slice(0, 30)),
      where('dateToShow', '==', todayKey())
    )
    return onSnapshot(
      q,
      (snap) => {
        setDilemmas(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false)
    )
  }, [key])

  return { dilemmas, loading }
}
