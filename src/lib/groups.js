import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  limit,
  arrayUnion,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// Alfabeto sin caracteres ambiguos (sin O/0, I/1, etc.) para códigos legibles
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateCode(len = 6) {
  let code = ''
  for (let i = 0; i < len; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  }
  return code
}

// Crea un grupo nuevo; el creador queda como admin y primer miembro.
export async function createGroup(user, name) {
  const cleanName = name.trim()
  if (!cleanName) throw new Error('Ponle un nombre al grupo.')

  const code = generateCode()
  const groupRef = await addDoc(collection(db, 'groups'), {
    name: cleanName,
    membersCode: code,
    adminId: user.uid,
    members: [user.uid],
    createdAt: serverTimestamp(),
  })

  // Añade el grupo al perfil del usuario
  await updateDoc(doc(db, 'users', user.uid), {
    groups: arrayUnion(groupRef.id),
  })

  return { id: groupRef.id, code }
}

// Une al usuario a un grupo a partir de su código.
export async function joinGroupByCode(user, rawCode) {
  const code = rawCode.trim().toUpperCase()
  if (!code) throw new Error('Introduce un código.')

  const snap = await getDocs(
    query(collection(db, 'groups'), where('membersCode', '==', code), limit(1))
  )
  if (snap.empty) throw new Error('Ese código no existe.')

  const groupDoc = snap.docs[0]
  const data = groupDoc.data()
  if (data.members?.includes(user.uid)) {
    throw new Error('Ya formas parte de este grupo.')
  }

  await updateDoc(groupDoc.ref, { members: arrayUnion(user.uid) })
  await updateDoc(doc(db, 'users', user.uid), { groups: arrayUnion(groupDoc.id) })

  return { id: groupDoc.id, name: data.name }
}
