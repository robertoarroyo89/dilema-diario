import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'

const AuthContext = createContext(null)

// Crea el doc users/{uid} la primera vez (o lo completa si faltaba)
async function ensureUserDoc(user, displayName) {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email,
      displayName: displayName || user.displayName || user.email.split('@')[0],
      groups: [],
      createdAt: serverTimestamp(),
    })
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // usuario de Firebase Auth
  const [profile, setProfile] = useState(null) // doc de Firestore (displayName, groups)
  const [loading, setLoading] = useState(true)

  // Escucha el estado de Auth
  useEffect(() => {
    return onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser)
      if (fbUser) await ensureUserDoc(fbUser)
      else setProfile(null)
      setLoading(false)
    })
  }, [])

  // Suscripción en tiempo real al perfil de Firestore (refleja grupos al instante)
  useEffect(() => {
    if (!user) return
    return onSnapshot(doc(db, 'users', user.uid), (snap) => {
      setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    })
  }, [user])

  // ---- Acciones ----
  const registerWithEmail = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) await updateProfile(cred.user, { displayName })
    await ensureUserDoc(cred.user, displayName)
    return cred.user
  }

  const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider)
    await ensureUserDoc(cred.user)
    return cred.user
  }

  const logout = () => signOut(auth)

  const value = {
    user,
    profile,
    loading,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
