import { createContext, useContext, useState, useEffect } from 'react'
import { getUserGroups } from '@/services/groups'

const GroupContext = createContext()

export function GroupProvider({ children }) {
  const [currentGroupId, setCurrentGroupId] = useState(() => {
    // Restaurer depuis localStorage au démarrage
    return localStorage.getItem('currentGroupId')
  })
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié (token présent)
    const token = localStorage.getItem('auth_token')
    if (token) {
      loadGroups()
    } else {
      setLoading(false)
    }
  }, [])

  const loadGroups = async () => {
    try {
      setLoading(true)
      const data = await getUserGroups()
      setGroups(data.groups)
      
      // Si pas de groupe actif et qu'il y a des groupes, sélectionner le premier
      if (!currentGroupId && data.groups.length > 0) {
        const firstGroupId = data.groups[0].id
        setCurrentGroupId(firstGroupId)
        localStorage.setItem('currentGroupId', firstGroupId)
      } else if (currentGroupId) {
        // Vérifier que le groupe sauvegardé existe toujours
        const saved = localStorage.getItem('currentGroupId')
        if (saved && data.groups.some(g => g.id === saved)) {
          setCurrentGroupId(saved)
        } else if (data.groups.length > 0) {
          // Si le groupe sauvegardé n'existe plus, prendre le premier
          const firstGroupId = data.groups[0].id
          setCurrentGroupId(firstGroupId)
          localStorage.setItem('currentGroupId', firstGroupId)
        }
      }
    } catch (error) {
      console.error('Error loading groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectGroup = (groupId) => {
    setCurrentGroupId(groupId)
    localStorage.setItem('currentGroupId', groupId)
  }

  const refreshGroups = () => {
    loadGroups()
  }

  return (
    <GroupContext.Provider
      value={{
        currentGroupId,
        groups,
        loading,
        selectGroup,
        refreshGroups,
      }}
    >
      {children}
    </GroupContext.Provider>
  )
}

export function useGroup() {
  const context = useContext(GroupContext)
  if (!context) {
    throw new Error('useGroup must be used within GroupProvider')
  }
  return context
}
