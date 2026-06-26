import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { authError } from '../../lib/authErrors'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function AuthScreen() {
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth()
  const [mode, setMode] = useState('login')
  const [displayName, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isRegister = mode === 'register'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) await registerWithEmail(email, password, displayName)
      else await loginWithEmail(email, password)
    } catch (err) {
      setError(authError(err))
    } finally {
      setLoading(false)
    }
  }

  const google = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
    } catch (err) {
      setError(authError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm animate-fade-up">
        <header className="text-center mb-8">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-faint mb-2">
            Un dilema al día
          </p>
          <h1 className="font-display text-[34px] font-700 tracking-[-0.02em] text-ink">
            El Dilema Diario
          </h1>
        </header>

        <div className="glass rounded-[28px] p-6">
          <h2 className="font-display text-xl font-600 text-ink mb-1">
            {isRegister ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}
          </h2>
          <p className="text-ink-muted text-sm mb-5">
            {isRegister ? 'Tardas menos de lo que crees.' : 'Entra para votar el dilema de hoy.'}
          </p>

          <form onSubmit={submit} className="space-y-3">
            {isRegister && (
              <Input
                id="name"
                label="Nombre"
                placeholder="Cómo quieres que te llamen"
                value={displayName}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            )}
            <Input
              id="email"
              label="Correo"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              id="password"
              label="Contraseña"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              minLength={6}
              required
            />

            {error && (
              <p className="glass-a text-sm text-ink rounded-2xl px-4 py-3">{error}</p>
            )}

            <Button type="submit" loading={loading} className="w-full">
              {isRegister ? 'Crear cuenta' : 'Entrar'}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-ink-faint">o</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <Button variant="ghost" onClick={google} loading={loading} className="w-full">
            <GoogleIcon /> Continuar con Google
          </Button>
        </div>

        <p className="text-center text-sm text-ink-muted mt-6">
          {isRegister ? '¿Ya tienes cuenta?' : '¿Primera vez por aquí?'}{' '}
          <button
            onClick={() => {
              setMode(isRegister ? 'login' : 'register')
              setError('')
            }}
            className="text-ink font-600 underline-offset-4 hover:underline"
          >
            {isRegister ? 'Inicia sesión' : 'Crea una cuenta'}
          </button>
        </p>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  )
}
