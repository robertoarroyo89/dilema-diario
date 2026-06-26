// Clave de día en formato YYYY-MM-DD (hora local). El dilema "de hoy" se busca
// por igualdad con este valor, así evitamos líos de zonas horarias y horas.
export function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
