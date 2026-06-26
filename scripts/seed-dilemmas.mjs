// ============================================================================
//  Importador de dilemas a Firestore (Admin SDK)
// ----------------------------------------------------------------------------
//  Uso:
//    node scripts/seed-dilemmas.mjs --start 2026-06-27 --group <GROUP_ID>
//
//    --start  Fecha del primer dilema (YYYY-MM-DD). Por defecto, hoy.
//             A cada dilema se le asigna un día consecutivo a partir de aquí.
//    --group  ID del grupo donde cargar los dilemas INMOBILIARIOS. Si no se
//             pasa, solo se suben los GLOBALES (los inmobiliarios necesitan un
//             grupo de destino: créalo en la app y copia su id).
//
//  Requiere serviceAccountKey.json en la raíz (Firebase Console → Configuración
//  del proyecto → Cuentas de servicio → Generar nueva clave privada).
//  Ese archivo NO debe subirse al repo (ya está en .gitignore).
//
//  Es idempotente: usa ids deterministas por fecha, así que volver a ejecutarlo
//  sobrescribe los mismos documentos en vez de duplicarlos.
// ============================================================================
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import admin from 'firebase-admin'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function arg(name, def = null) {
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def
}

function fmt(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
// T12:00:00 evita saltos por cambio de hora
const addDays = (startStr, n) => {
  const d = new Date(`${startStr}T12:00:00`)
  d.setDate(d.getDate() + n)
  return fmt(d)
}
const loadJson = async (rel) => JSON.parse(await readFile(path.join(root, rel), 'utf8'))

async function main() {
  const start = arg('start', fmt(new Date()))
  const groupId = arg('group', null)

  const sa = JSON.parse(await readFile(path.join(root, 'serviceAccountKey.json'), 'utf8'))
  admin.initializeApp({ credential: admin.credential.cert(sa) })
  const db = admin.firestore()

  const globales = await loadJson('src/data/dilemas_globales.json')
  const inmo = await loadJson('src/data/dilemas_inmobiliarios.json')

  // Escritura por lotes (máx. 500 por batch en Firestore; usamos 450 de margen)
  let batch = db.batch()
  let pending = 0
  let total = 0
  const queue = async (ref, data) => {
    batch.set(ref, data)
    pending++
    total++
    if (pending >= 450) {
      await batch.commit()
      batch = db.batch()
      pending = 0
    }
  }

  // Globales
  for (let i = 0; i < globales.length; i++) {
    const d = globales[i]
    const date = addDays(start, i)
    await queue(db.collection('dilemmas').doc(`global_${date}`), {
      type: 'global',
      groupId: null,
      question: d.question,
      optionA: d.optionA,
      optionB: d.optionB,
      dateToShow: date,
    })
  }

  // Inmobiliarios (solo si hay grupo de destino)
  if (groupId) {
    for (let i = 0; i < inmo.length; i++) {
      const d = inmo[i]
      const date = addDays(start, i)
      await queue(db.collection('dilemmas').doc(`${groupId}_${date}`), {
        type: 'group',
        groupId,
        question: d.question,
        optionA: d.optionA,
        optionB: d.optionB,
        dateToShow: date,
      })
    }
  } else {
    console.log('⚠  Sin --group: se omiten los dilemas inmobiliarios.')
  }

  if (pending > 0) await batch.commit()

  console.log(
    `✓ ${total} dilemas subidos. Inicio: ${start}${groupId ? ` · grupo: ${groupId}` : ''}`
  )
  process.exit(0)
}

main().catch((e) => {
  console.error('✗ Error:', e.message)
  process.exit(1)
})
