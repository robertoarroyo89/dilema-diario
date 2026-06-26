import { useAuth } from '../hooks/useAuth'
import { useGroups } from '../hooks/useGroups'
import { useGroupDilemmas } from '../hooks/useDilemmas'
import DilemmaCard from '../components/DilemmaCard'
import GroupsPanel from '../components/groups/GroupsPanel'

export default function GroupsFeed() {
  const { profile } = useAuth()
  const { groups } = useGroups(profile?.groups)
  const { dilemmas, loading } = useGroupDilemmas(profile?.groups)

  // Mapa id → nombre para mostrar de qué grupo es cada dilema
  const nameById = Object.fromEntries(groups.map((g) => [g.id, g.name]))

  return (
    <div className="space-y-4">
      {/* Dilemas de grupo de hoy */}
      {loading ? (
        <div className="flex justify-center py-10">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
        </div>
      ) : dilemmas.length > 0 ? (
        dilemmas.map((d) => (
          <DilemmaCard key={d.id} dilemma={{ ...d, groupName: nameById[d.groupId] }} />
        ))
      ) : (
        <div className="glass rounded-[28px] p-6 text-center">
          <p className="text-ink font-500">Sin dilemas de grupo para hoy</p>
          <p className="text-ink-faint text-sm mt-1">
            {profile?.groups?.length
              ? 'Cuando programes uno con la fecha de hoy, saldrá aquí.'
              : 'Únete a un grupo o crea uno para empezar.'}
          </p>
        </div>
      )}

      {/* Gestión de grupos */}
      <GroupsPanel />
    </div>
  )
}
