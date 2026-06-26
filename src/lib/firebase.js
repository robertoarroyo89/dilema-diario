// Inicialización central de Firebase. Lee la config desde variables de entorno
// (ver .env.example). En Vercel, configúralas en Project Settings → Environment Variables.
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Aviso temprano si falta config (evita errores opacos en producción)
if (!firebaseConfig.apiKey) {
  console.warn(
    '[Firebase] Falta configuración. Copia .env.example a .env y rellena las claves VITE_FIREBASE_*'
  )
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
export default app
