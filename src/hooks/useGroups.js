import { useEffect, useState } from 'react'
import { collection, query, where, documentId, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

// Dada la lista de IDs de grupo del perfil, devuelve los docs de grupo en vivo.
// Firestore permite hasta 30 IDs en una cláusula 'in' (suficiente para el MVP).
export function useGroups(groupIds = []) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  const key = (groupIds || []).join(',') // dependencia estable

  useEffect(() => {
    const ids = key ? key.split(',') : []
    if (ids.length === 0) {
      setGroups([])
      setLoading(false)
      return
    }
    setLoading(true)
    const q = query(collection(db, 'groups'), where(documentId(), 'in', ids.slice(0, 30)))
    return onSnapshot(q, (snap) => {
      setGroups(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [key])

  return { groups, loading }
}
