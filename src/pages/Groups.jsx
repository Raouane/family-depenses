import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users, Check, Loader2, UserPlus, UserMinus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer'
import { getUserGroups, getGroupDetails, createGroup, addUserToGroup, removeUserFromGroup } from '@/services/groups'
import { useGroup } from '@/context/GroupContext'

const Groups = () => {
  const navigate = useNavigate()
  const { currentGroupId, selectGroup, refreshGroups } = useGroup()
  const [groups, setGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDescription, setNewGroupDescription] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getUserGroups()
      setGroups(data.groups)
      await refreshGroups()
    } catch (err) {
      console.error('Error loading groups:', err)
      setError(err.message || 'Erreur lors du chargement des groupes')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    if (!newGroupName.trim()) {
      setError('Le nom du groupe est requis')
      return
    }

    try {
      setCreating(true)
      setError(null)
      await createGroup({
        name: newGroupName.trim(),
        description: newGroupDescription.trim() || null,
      })
      setCreateDialogOpen(false)
      setNewGroupName('')
      setNewGroupDescription('')
      await loadGroups()
    } catch (err) {
      console.error('Error creating group:', err)
      setError(err.message || 'Erreur lors de la création du groupe')
    } finally {
      setCreating(false)
    }
  }

  const handleGroupClick = async (groupId) => {
    try {
      const details = await getGroupDetails(groupId)
      setSelectedGroup(details)
    } catch (err) {
      console.error('Error loading group details:', err)
    }
  }

  const handleSelectGroup = (groupId) => {
    selectGroup(groupId)
    navigate('/')
  }

  if (loading) {
    return (
      <div className="px-4 py-6 pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 pb-24">
      {/* En-tête */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Groupes</h1>
          <p className="text-base text-slate-700 mt-2 font-medium">Gérez vos groupes de partage</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="rounded-full">
              <Plus size={20} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau groupe</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGroup}>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">Nom du groupe *</Label>
                  <Input
                    id="name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Ex: Famille, Coloc, Amis..."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (optionnel)</Label>
                  <Input
                    id="description"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="Description du groupe"
                    className="mt-2"
                  />
                </div>
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCreateDialogOpen(false)
                    setNewGroupName('')
                    setNewGroupDescription('')
                    setError(null)
                  }}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    'Créer'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des groupes */}
      {error && !loading && (
        <Card className="border-destructive mb-4">
          <CardContent className="p-6">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadGroups} variant="outline">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      {groups.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Aucun groupe</h3>
            <p className="text-muted-foreground mb-4">
              Créez votre premier groupe pour commencer à partager les dépenses
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Créer un groupe
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => (
            <Card
              key={group.id}
              className={`cursor-pointer transition-colors ${
                currentGroupId === group.id
                  ? 'border-gray-400 bg-gray-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleGroupClick(group.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Users size={24} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        {group.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {group.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{group.memberCount} membre{group.memberCount > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentGroupId === group.id && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Check size={20} />
                        <span className="text-sm font-medium">Actif</span>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectGroup(group.id)
                      }}
                    >
                      {currentGroupId === group.id ? 'Sélectionné' : 'Sélectionner'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Drawer détails du groupe */}
      <Drawer open={!!selectedGroup} onOpenChange={(open) => !open && setSelectedGroup(null)}>
        <DrawerContent className="max-w-md mx-auto max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Détails du groupe</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
          
          {selectedGroup && (
            <div className="px-4 py-6 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{selectedGroup.name}</h3>
                {selectedGroup.description && (
                  <p className="text-muted-foreground">{selectedGroup.description}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Créé le {new Date(selectedGroup.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-700 uppercase mb-4">
                  Membres ({selectedGroup.members.length})
                </h4>
                <div className="space-y-2">
                  {selectedGroup.members.map((member) => (
                    <Card key={member.id} className="rounded-xl">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
                            {member.initial}
                          </div>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-slate-600 font-medium">{member.email}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button
                  className="w-full"
                  onClick={() => {
                    handleSelectGroup(selectedGroup.id)
                    setSelectedGroup(null)
                  }}
                >
                  {currentGroupId === selectedGroup.id ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Groupe actif
                    </>
                  ) : (
                    'Sélectionner ce groupe'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default Groups
