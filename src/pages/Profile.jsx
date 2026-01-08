import { useState, useEffect } from 'react'
import { User, Mail, Edit2, Save, X, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getUserProfile, updateUserProfile } from '@/services/users'
import { useAuth } from '@/context/AuthContext'

const Profile = () => {
  const { user: currentUser, logout } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    initial: '',
  })

  useEffect(() => {
    if (currentUser) {
      loadProfile()
    }
  }, [currentUser])

  const loadProfile = async () => {
    if (!currentUser) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await getUserProfile(currentUser.id)
      setUser(data)
      setFormData({
        name: data.name,
        email: data.email,
        initial: data.initial,
      })
    } catch (err) {
      console.error('Error loading profile:', err)
      setError(err.message || 'Erreur lors du chargement du profil')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Le nom est requis')
      return
    }
    if (!formData.email.trim()) {
      setError('L\'email est requis')
      return
    }
    if (!formData.initial.trim() || formData.initial.length !== 1) {
      setError('L\'initiale doit être un seul caractère')
      return
    }

    try {
      setSaving(true)
      setError(null)
      if (!currentUser) return
      
      const updated = await updateUserProfile(currentUser.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        initial: formData.initial.trim().toUpperCase(),
      })
      setUser(updated)
      setEditing(false)
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.message || 'Erreur lors de la mise à jour du profil')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        initial: user.initial,
      })
    }
    setEditing(false)
    setError(null)
  }

  if (loading) {
    return (
      <div className="px-4 py-6 pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-gray-700">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="px-4 py-6 pb-24">
        <Card className="border-destructive">
          <CardContent className="p-6">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadProfile} variant="outline">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Profil</h1>

      {/* Carte profil */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Informations personnelles</CardTitle>
            {!editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Modifier
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="initial">Initiale</Label>
                <Input
                  id="initial"
                  value={formData.initial}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().slice(0, 1)
                    setFormData({ ...formData, initial: value })
                  }}
                  maxLength={1}
                  className="mt-2"
                  placeholder="M"
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1"
                >
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold text-2xl">
                  {user?.initial || 'U'}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{user?.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-gray-700">
                    <Mail size={16} />
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t space-y-3">
                <div>
                  <Label className="text-base font-semibold text-slate-700">Membre depuis</Label>
                  <p className="mt-2 text-base text-foreground font-medium">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })
                      : '-'}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Section paramètres */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-gray-800">Paramètres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Notifications</h4>
              <p className="text-sm text-gray-700">
                Recevoir des notifications pour les nouvelles dépenses
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Bientôt disponible
            </Button>
          </div>
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
              <h4 className="font-semibold text-base text-foreground">Version</h4>
              <p className="text-base text-slate-700 mt-1 font-medium">1.0.0</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile
