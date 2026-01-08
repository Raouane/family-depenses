import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getGroupSummary } from '@/services/groups'
import { useGroup } from '@/context/GroupContext'

const Home = () => {
  const navigate = useNavigate()
  const { currentGroupId } = useGroup()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalBalance, setTotalBalance] = useState(0)
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (currentGroupId) {
      loadSummary()
    } else {
      setLoading(false)
      setError('Aucun groupe sélectionné. Veuillez sélectionner un groupe dans la page Groupes.')
    }
  }, [currentGroupId])

  const loadSummary = async () => {
    if (!currentGroupId) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await getGroupSummary(currentGroupId)
      setTotalBalance(data.totalBalance)
      
      // Filtrer l'utilisateur actuel (Mohamed) et formater les autres
      const brothers = data.users
        .filter(user => user.balance !== 0)
        .map(user => ({
          id: user.userId,
          name: user.name,
          initial: user.initial,
          amount: Math.abs(user.balance),
          type: user.status === 'receive' ? 'receive' : 'pay',
        }))
      
      setUsers(brothers)
    } catch (err) {
      console.error('Error loading summary:', err)
      setError(err.message || 'Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  if (loading) {
    return (
      <div className="px-4 py-6 pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6 pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Salut Mohamed 👋</h1>
        </div>
        <Card className="border-destructive">
          <CardContent className="p-6">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadSummary} variant="outline">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 pb-24">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Salut Mohamed 👋
        </h1>
        <p className="text-base text-slate-700 mt-2 font-medium">Voici votre résumé financier</p>
      </div>

      {/* Carte solde total */}
      <Card className="bg-gradient-to-br from-primary to-primary-dark border-0 mb-6 shadow-lg">
        <CardContent className="p-6">
          <div className="text-white text-base font-semibold mb-3">Solde total du groupe</div>
          <div className="text-white text-5xl font-bold mb-3">
            {totalBalance.toLocaleString('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} €
          </div>
          <div className="text-white text-sm font-medium">
            En date du {currentDate}
          </div>
        </CardContent>
      </Card>

      {/* Section Résumé par frère */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-foreground">
          Résumé par frère
        </h2>
        
        {users.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Tous les comptes sont équilibrés
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {users.map((brother) => (
            <Card key={brother.id} className="rounded-2xl">
              <CardContent className="p-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                {brother.initial}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="font-semibold text-base text-foreground">{brother.name}</div>
                <div
                  className={`text-base font-medium mt-1 ${
                    brother.type === 'receive' ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {brother.type === 'receive' ? 'Doit recevoir' : 'Doit payer'}
                </div>
              </div>

              {/* Montant */}
              <div
                className={`text-xl font-bold ${
                  brother.type === 'receive' ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {brother.type === 'receive' ? '+' : '-'}
                {brother.amount.toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} €
              </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bouton flottant */}
      <Button
        onClick={() => navigate('/add-expense')}
        size="icon"
        className="fixed bottom-24 right-1/2 translate-x-1/2 w-14 h-14 rounded-full shadow-lg z-40"
        style={{ maxWidth: 'calc(28rem - 2rem)' }}
      >
        <Plus size={24} />
      </Button>
    </div>
  )
}

export default Home
