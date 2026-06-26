import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useGroups } from '../../hooks/useGroups'
import { createGroup, joinGroupByCode } from '../../lib/groups'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function GroupsPanel() {
  const { user, profile } = useAuth()
  const { groups, loading } = useGroups(profile?.groups)

  const [tab, setTab] = useState('list')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(null)

  const reset = () => {
    setName('')
    setCode('')
    setError('')
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await createGroup(user, name)
      reset()
      setTab('list')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleJoin = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await joinGroupByCode(user, code)
      reset()
      setTab('list')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const copyCode = async (c) => {
    try {
      await navigator.clipboard.writeText(c)
      setCopied(c)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      /* clipboard no disponible */
    }
  }

  return (
    <section className="glass rounded-[28px] p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-600 text-ink">Tus grupos</h2>
        <div className="glass rounded-full p-1 flex gap-1 text-xs">
          <TabBtn active={tab === 'create'} onClick={() => { setTab('create'); reset() }}>
            Crear
          </TabBtn>
          <TabBtn active={tab === 'join'} onClick={() => { setTab('join'); reset() }}>
            Unirme
          </TabBtn>
        </div>
      </div>

      {tab === 'create' && (
        <form onSubmit={handleCreate} className="space-y-3 animate-fade-up">
          <Input
            id="group-name"
            label="Nombre del grupo"
            placeholder="Ej. Comercial RK Palanca"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {error && <p className="text-sm text-optionA">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" loading={busy} className="flex-1">Crear grupo</Button>
            <Button variant="ghost" onClick={() => setTab('list')}>Cancelar</Button>
          </div>
        </form>
      )}

      {tab === 'join' && (
        <form onSubmit={handleJoin} className="space-y-3 animate-fade-up">
          <Input
            id="group-code"
            label="Código del grupo"
            placeholder="Ej. K7P2QM"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="font-mono tracking-widest uppercase"
            maxLength={6}
            required
          />
          {error && <p className="text-sm text-optionA">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" loading={busy} className="flex-1">Unirme</Button>
            <Button variant="ghost" onClick={() => setTab('list')}>Cancelar</Button>
          </div>
        </form>
      )}

      {tab === 'list' && (
        <div className="space-y-2">
          {loading && <p className="text-sm text-ink-faint">Cargando grupos…</p>}

          {!loading && groups.length === 0 && (
            <div className="text-center py-6">
              <p className="text-ink-muted text-sm mb-1">Aún no estás en ningún grupo.</p>
              <p className="text-ink-faint text-xs">
                Crea uno y comparte el código, o únete con el de un compañero.
              </p>
            </div>
          )}

          {groups.map((g) => {
            const isAdmin = g.adminId === user.uid
            const count = g.members?.length || 1
            return (
              <div
                key={g.id}
                className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-ink font-500 truncate">{g.name}</p>
                  <p className="text-ink-faint text-xs">
                    {count} miembro{count !== 1 ? 's' : ''}{isAdmin && ' · admin'}
                  </p>
                </div>
                <button
                  onClick={() => copyCode(g.membersCode)}
                  className="font-mono text-xs tracking-widest text-optionB hover:text-ink transition-colors shrink-0"
                  title="Copiar código"
                >
                  {copied === g.membersCode ? '¡copiado!' : g.membersCode}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

function TabBtn({ active, children, ...props }) {
  return (
    <button
      className={
        'rounded-full px-3 py-1.5 font-500 transition-all ' +
        (active ? 'bg-white/15 text-ink' : 'text-ink-faint hover:text-ink-muted')
      }
      {...props}
    >
      {children}
    </button>
  )
}
