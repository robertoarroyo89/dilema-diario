import { useState } from 'react'
import { writeBatch, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import { useGroups } from '../hooks/useGroups'
import { todayKey } from '../lib/date'
import globales from '../data/dilemas_globales.json'
import inmobiliarios from '../data/dilemas_inmobiliarios.json'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

function addDays(startStr, n) {
  const d = new Date(`${startStr}T12:00:00`)
  d.setDate(d.getDate() + n)
  return todayKey(d)
}

// Sube un array de dilemas en lotes de 450 (límite de Firestore: 500).
async function subir({ items, type, groupId, start, onProgress }) {
  let written = 0
  for (let i = 0; i < items.length; i += 450) {
    const batch = writeBatch(db)
    const slice = items.slice(i, i + 450)
    slice.forEach((d, j) => {
      const idx = i + j
      const date = addDays(start, idx)
      const id = type === 'group' ? `${groupId}_${date}` : `global_${date}`
      batch.set(doc(db, 'dilemmas', id), {
        type,
        groupId: type === 'group' ? groupId : null,
        question: d.question,
        optionA: d.optionA,
        optionB: d.optionB,
        dateToShow: date,
      })
    })
    await batch.commit()
    written += slice.length
    onProgress(written, items.length)
  }
}

export default function AdminImport() {
  const { user, profile } = useAuth()
  const { groups } = useGroups(profile?.groups)
  const [start, setStart] = useState(todayKey())
  const [groupId, setGroupId] = useState('')
  const [copied, setCopied] = useState(false)
  const [busyG, setBusyG] = useState(false)
  const [busyI, setBusyI] = useState(false)
  const [msg, setMsg] = useState('')

  const copyUid = async () => {
    try {
      await navigator.clipboard.writeText(user.uid)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  const run = async (which) => {
    setMsg('')
    const setBusy = which === 'group' ? setBusyI : setBusyG
    setBusy(true)
    try {
      const items = which === 'group' ? inmobiliarios : globales
      await subir({
        items,
        type: which,
        groupId,
        start,
        onProgress: (w, t) => setMsg(`Subiendo ${which === 'group' ? 'inmobiliarios' : 'globales'}… ${w}/${t}`),
      })
      setMsg(`✓ Listo: ${items.length} dilemas ${which === 'group' ? 'inmobiliarios' : 'globales'} subidos desde ${start}.`)
    } catch (e) {
      setMsg(`✗ Error: ${e.code === 'permission-denied' ? 'sin permisos. ¿Pusiste tu UID en las reglas y las publicaste?' : e.message}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Tu UID, para las reglas */}
      <section className="glass rounded-[28px] p-6">
        <h2 className="font-display text-lg font-600 text-ink mb-1">Tu UID</h2>
        <p className="text-ink-muted text-sm mb-3">
          Cópialo y pégalo en <span className="font-mono">firestore.rules</span> (donde
          pone <span className="font-mono">PON_AQUI_TU_UID</span>), luego publica las reglas
          en Firebase. Sin esto, los globales no te dejarán subir.
        </p>
        <button
          onClick={copyUid}
          className="glass w-full rounded-2xl px-4 py-3 font-mono text-sm text-optionB break-all text-left"
        >
          {copied ? '¡copiado!' : user.uid}
        </button>
      </section>

      {/* Importador */}
      <section className="glass rounded-[28px] p-6 space-y-4">
        <h2 className="font-display text-lg font-600 text-ink">Importar dilemas</h2>

        <Input
          id="start"
          label="Fecha del primer dilema"
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <div>
          <span className="mb-2 block text-xs font-500 uppercase tracking-wider text-ink-faint">
            Grupo para los inmobiliarios
          </span>
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="glass w-full rounded-2xl px-4 py-3.5 text-ink focus:outline-none"
          >
            <option value="" className="bg-canvas">— elige un grupo —</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id} className="bg-canvas">
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-1">
          <Button onClick={() => run('global')} loading={busyG} disabled={busyI}>
            Subir 365 globales
          </Button>
          <Button
            variant="ghost"
            onClick={() => run('group')}
            loading={busyI}
            disabled={busyG || !groupId}
          >
            Subir 150 inmobiliarios al grupo
          </Button>
        </div>

        {msg && (
          <p className={`text-sm rounded-2xl px-4 py-3 ${msg.startsWith('✗') ? 'glass-a text-ink' : 'glass text-ink-muted'}`}>
            {msg}
          </p>
        )}
      </section>
    </div>
  )
}
