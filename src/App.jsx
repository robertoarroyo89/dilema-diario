import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import AuthScreen from './components/auth/AuthScreen'
import TabBar from './components/ui/TabBar'
import Button from './components/ui/Button'
import GlobalFeed from './pages/GlobalFeed'
import GroupsFeed from './pages/GroupsFeed'

export default function App() {
  const { user, profile, loading, logout } = useAuth()

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
      </main>
    )
  }

  if (!user) return <AuthScreen />

  const name = profile?.displayName || user.displayName || 'tú'

  return (
    <>
      <main className="min-h-screen px-5 py-8 pb-28">
        <div className="w-full max-w-md mx-auto space-y-5">
          <header className="flex items-center justify-between animate-fade-up">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
                Hola, {name}
              </p>
              <h1 className="font-display text-[26px] font-700 tracking-[-0.02em] text-ink">
                El Dilema Diario
              </h1>
            </div>
            <Button variant="danger" onClick={logout}>Salir</Button>
          </header>

          <Routes>
            <Route path="/" element={<GlobalFeed />} />
            <Route path="/grupos" element={<GroupsFeed />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <TabBar />
    </>
  )
}
