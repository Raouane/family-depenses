import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Loader2, CheckCircle2, History } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getGroupSummary } from '@/services/groups'
import { createSettlement } from '@/services/settlements'
import { useGroup } from '@/context/GroupContext'
import { useAuth } from '@/context/AuthContext'

const Home = () => {
  const navigate = useNavigate()
  const { currentGroupId } = useGroup()
  const { user: currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userBalance, setUserBalance] = useState(0)
  const [userBalanceStatus, setUserBalanceStatus] = useState('settled')
  const [users, setUsers] = useState([])
  const [owedTo, setOwedTo] = useState(null) // Personne à qui l'utilisateur doit
  const [owedFrom, setOwedFrom] = useState([]) // Personnes qui doivent à l'utilisateur
  const [settlementDialogOpen, setSettlementDialogOpen] = useState(false)
  const [selectedBrother, setSelectedBrother] = useState(null)
  const [settlementAmount, setSettlementAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [settlementNotes, setSettlementNotes] = useState('')
  const [creatingSettlement, setCreatingSettlement] = useState(false)

  useEffect(() => {
    if (currentGroupId) {
      loadSummary()
    } else {
      setLoading(false)
      setError('Aucun groupe sélectionné. Veuillez sélectionner un groupe dans la page Groupes.')
    }
  }, [currentGroupId])

  const loadSummary = async () => {
    if (!currentGroupId || !currentUser) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await getGroupSummary(currentGroupId)
      
      // Normaliser l'ID de l'utilisateur actuel pour les comparaisons
      const currentUserIdStr = String(currentUser.id).toLowerCase().trim()
      
      // Trouver le solde de l'utilisateur actuel (comparaison robuste)
      // D'abord par ID, puis par email si l'ID ne correspond pas (fallback)
      const currentUserEmail = currentUser.email?.toLowerCase().trim()
      
      let currentUserData = data.users.find(user => {
        const userId = String(user.userId).toLowerCase().trim()
        return currentUserIdStr === userId
      })
      
      // Si pas trouvé par ID, essayer par email (plus sûr que le nom, unique)
      if (!currentUserData && currentUserEmail) {
        const availableEmailsDetailed = data.users.map(u => ({
          email: u.email,
          emailType: typeof u.email,
          emailNormalized: u.email ? String(u.email).toLowerCase().trim() : null,
          name: u.name,
          userId: u.userId
        }))
        console.log('🔍 Recherche par email:', {
          currentUserEmail: currentUserEmail,
          currentUserEmailType: typeof currentUserEmail,
          availableEmailsDetailed: availableEmailsDetailed
        })
        currentUserData = data.users.find(user => {
          const userEmail = user.email ? String(user.email).toLowerCase().trim() : ''
          const matches = currentUserEmail === userEmail
          if (matches) {
            console.log('✅ Match trouvé par email:', {
              userEmail: userEmail,
              currentUserEmail: currentUserEmail,
              userId: user.userId,
              name: user.name
            })
          } else if (user.email) {
            // Log pour voir pourquoi ça ne correspond pas
            console.log('🔍 Comparaison email:', {
              userEmail: userEmail,
              currentUserEmail: currentUserEmail,
              exactMatch: userEmail === currentUserEmail,
              userEmailLength: userEmail.length,
              currentUserEmailLength: currentUserEmail.length
            })
          }
          return matches
        })
        if (currentUserData) {
          console.warn('⚠️ Utilisateur trouvé par email (IDs incohérents):', {
            currentUserId: currentUserIdStr,
            foundUserId: currentUserData.userId,
            email: currentUserData.email,
            name: currentUserData.name,
            balance: currentUserData.balance
          })
        } else {
          console.warn('❌ Aucun utilisateur trouvé par email, essai par nom:', {
            searchedEmail: currentUserEmail,
            currentUserName: currentUser.name,
            availableEmailsDetailed: availableEmailsDetailed
          })
          // Fallback supplémentaire : essayer par nom si l'email ne correspond pas
          if (currentUser.name) {
            const currentUserName = String(currentUser.name).toLowerCase().trim()
            currentUserData = data.users.find(user => {
              const userName = String(user.name || '').toLowerCase().trim()
              return currentUserName === userName
            })
            if (currentUserData) {
              console.warn('⚠️ Utilisateur trouvé par nom (emails et IDs incohérents):', {
                currentUserId: currentUserIdStr,
                currentUserEmail: currentUserEmail,
                foundUserId: currentUserData.userId,
                foundEmail: currentUserData.email,
                name: currentUserData.name,
                balance: currentUserData.balance
              })
            }
          }
        }
      }
      
      if (currentUserData) {
        setUserBalance(currentUserData.balance)
        setUserBalanceStatus(currentUserData.status)
        
        // Calculer à qui l'utilisateur doit ou qui lui doit
        if (currentUserData.balance < 0) {
          // L'utilisateur doit de l'argent - trouver qui a un solde positif
          const creditors = data.users
            .filter(user => {
              const userId = String(user.userId).toLowerCase().trim()
              return userId !== currentUserIdStr && user.balance > 0
            })
            .sort((a, b) => b.balance - a.balance) // Trier par solde décroissant
          
          // Le créancier principal est celui avec le plus grand solde positif
          if (creditors.length > 0) {
            setOwedTo({
              name: creditors[0].name,
              amount: Math.abs(currentUserData.balance)
            })
          } else {
            setOwedTo(null)
          }
          setOwedFrom([])
        } else if (currentUserData.balance > 0) {
          // L'utilisateur doit recevoir de l'argent
          const debtors = data.users
            .filter(user => {
              const userId = String(user.userId).toLowerCase().trim()
              return userId !== currentUserIdStr && user.balance < 0
            })
            .map(user => ({
              name: user.name,
              amount: Math.abs(user.balance)
            }))
          setOwedFrom(debtors)
          setOwedTo(null)
        } else {
          setOwedTo(null)
          setOwedFrom([])
        }
      } else {
        console.warn('⚠️ Utilisateur actuel non trouvé dans les données du groupe', {
          currentUserId: currentUserIdStr,
          availableUserIds: data.users.map(u => ({
            id: String(u.userId).toLowerCase().trim(),
            name: u.name
          }))
        })
        // Si l'utilisateur n'est pas trouvé, on suppose qu'il n'a pas de solde
        setUserBalance(0)
        setUserBalanceStatus('settled')
        setOwedTo(null)
        setOwedFrom([])
      }
      
      // Filtrer les autres utilisateurs (pas l'utilisateur actuel) et ceux avec solde = 0
      // Utiliser l'email pour le filtrage (plus sûr que le nom, unique)
      
      const brothers = data.users
        .filter(user => {
          // Exclure l'utilisateur actuel (comparaison robuste avec conversion en string)
          const userIdStr = String(user.userId).toLowerCase().trim()
          const userEmailStr = String(user.email || '').toLowerCase().trim()
          
          // Comparaison par ID d'abord, puis par email si l'ID ne correspond pas
          const isNotCurrentUserById = currentUserIdStr !== userIdStr
          const isNotCurrentUserByEmail = !currentUserEmail || currentUserEmail !== userEmailStr
          const isNotCurrentUser = isNotCurrentUserById && (currentUserData ? true : isNotCurrentUserByEmail)
          
          // Exclure les soldes à zéro (avec tolérance pour arrondis)
          const hasNonZeroBalance = Math.abs(user.balance) > 0.01
          
          return isNotCurrentUser && hasNonZeroBalance
        })
        .map(user => ({
          id: user.userId,
          name: user.name,
          initial: user.initial,
          amount: Math.abs(user.balance),
          type: user.status === 'receive' ? 'receive' : 'pay',
          balance: user.balance, // Garder le solde original
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

  const handleOpenSettlementDialog = (brother) => {
    setSelectedBrother(brother)
    // Utiliser le solde absolu actuel comme montant suggéré
    // L'utilisateur peut modifier ce montant s'il veut payer partiellement
    const suggestedAmount = Math.abs(brother.balance || brother.amount)
    setSettlementAmount(suggestedAmount.toFixed(2))
    setPaymentMethod('cash')
    setSettlementNotes('')
    setSettlementDialogOpen(true)
  }

  const handleCreateSettlement = async () => {
    if (!selectedBrother || !currentGroupId || !currentUser) return

    try {
      setCreatingSettlement(true)
      
      // Déterminer qui paie et qui reçoit en fonction du type du brother
      // Si le brother.type === 'pay', cela signifie qu'il doit payer, donc il est le payeur (fromUserId)
      // Si le brother.type === 'receive', cela signifie qu'il doit recevoir, donc il est le bénéficiaire (toUserId)
      let fromUserId, toUserId
      
      if (selectedBrother.type === 'pay') {
        // Le brother doit payer → il paie à l'utilisateur actuel
        fromUserId = selectedBrother.id
        toUserId = currentUser.id
      } else {
        // Le brother doit recevoir → l'utilisateur actuel paie au brother
        fromUserId = currentUser.id
        toUserId = selectedBrother.id
      }

      // Valider que le montant ne dépasse pas le solde actuel
      const settlementAmountNum = parseFloat(settlementAmount)
      const maxAmount = Math.abs(selectedBrother.balance || selectedBrother.amount)
      
      if (settlementAmountNum <= 0) {
        throw new Error('Le montant doit être supérieur à 0')
      }
      
      if (settlementAmountNum > maxAmount) {
        const confirmMessage = `Le montant (${settlementAmountNum.toFixed(2)} €) dépasse le solde actuel (${maxAmount.toFixed(2)} €). Voulez-vous continuer ?`
        if (!window.confirm(confirmMessage)) {
          return
        }
      }

      await createSettlement({
        groupId: currentGroupId,
        fromUserId,
        toUserId,
        amount: settlementAmountNum,
        paymentMethod,
        notes: settlementNotes || null,
      })

      // Recharger les données
      await loadSummary()
      
      // Fermer le dialog
      setSettlementDialogOpen(false)
      setSelectedBrother(null)
      setSettlementAmount('')
      setPaymentMethod('cash')
      setSettlementNotes('')
    } catch (error) {
      console.error('Erreur lors de la création du règlement:', error)
      alert(error.message || 'Erreur lors de la création du règlement')
    } finally {
      setCreatingSettlement(false)
    }
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

  if (error) {
    return (
      <div className="px-4 py-6 pb-24">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Salut Mohamed 👋</h1>
        </div>
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-700 mb-4 font-medium">{error}</p>
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
          Salut {currentUser?.name || 'Utilisateur'} 👋
        </h1>
        <p className="text-base text-slate-700 mt-2 font-medium">Voici votre résumé financier</p>
      </div>

      {/* Carte solde personnel */}
      <Card className={`bg-gradient-to-br ${
        userBalanceStatus === 'receive' 
          ? 'from-green-600 to-green-700' 
          : userBalanceStatus === 'pay'
          ? 'from-red-600 to-red-700'
          : 'from-gray-600 to-gray-700'
      } border-0 mb-6 shadow-lg`}>
        <CardContent className="p-6">
          <div className="text-white text-base font-semibold mb-3">
            {userBalanceStatus === 'receive' 
              ? 'On vous doit' 
              : userBalanceStatus === 'pay'
              ? 'Vous devez'
              : 'Votre solde'}
          </div>
          <div className="text-white text-5xl font-bold mb-3">
            {Math.abs(userBalance).toLocaleString('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} €
          </div>
          <div className="text-white text-sm font-medium">
            {userBalanceStatus === 'settled' 
              ? 'Compte équilibré' 
              : userBalanceStatus === 'pay' && owedTo
              ? `Vous devez payer à ${owedTo.name}`
              : userBalanceStatus === 'receive' && owedFrom.length > 0
              ? `${owedFrom.length === 1 ? owedFrom[0].name : `${owedFrom.length} personnes`} ${owedFrom.length === 1 ? 'vous doit' : 'vous doivent'}`
              : `En date du ${currentDate}`}
          </div>
        </CardContent>
      </Card>

      {/* Section Résumé par frère */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">
            Résumé par frère
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/settlements')}
            className="text-gray-600 hover:text-gray-900"
          >
            <History className="h-4 w-4 mr-2" />
            Historique
          </Button>
          {userBalanceStatus === 'pay' && owedTo && (
            <div className="text-sm text-red-600 font-medium">
              → Vous devez payer à {owedTo.name}
            </div>
          )}
          {userBalanceStatus === 'receive' && owedFrom.length > 0 && (
            <div className="text-sm text-green-600 font-medium">
              → {owedFrom.length === 1 ? owedFrom[0].name : `${owedFrom.length} personnes`} {owedFrom.length === 1 ? 'vous doit' : 'vous doivent'}
            </div>
          )}
        </div>
        
        {users.length === 0 ? (
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center text-gray-700">
              Tous les comptes sont équilibrés
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {users.map((brother) => {
              // Déterminer si c'est la personne à qui l'utilisateur doit
              const isOwedTo = userBalanceStatus === 'pay' && owedTo && brother.name === owedTo.name
              // Déterminer si on peut créer un règlement (si l'utilisateur doit payer ou recevoir)
              const canSettle = (userBalanceStatus === 'pay' && brother.type === 'receive') || 
                               (userBalanceStatus === 'receive' && brother.type === 'pay')
              
              return (
              <Card key={brother.id} className={`rounded-2xl ${isOwedTo ? 'bg-red-50 border-2 border-red-300' : 'bg-gray-50'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 ${
                      isOwedTo ? 'bg-red-600' : 'bg-gray-600'
                    }`}>
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
                        {brother.type === 'receive' 
                          ? userBalanceStatus === 'pay' && owedTo && brother.name === owedTo.name
                            ? 'Vous devez payer à cette personne'
                            : 'Doit recevoir de l\'argent'
                          : isOwedTo
                          ? 'Vous devez payer à cette personne'
                          : 'Doit payer de l\'argent'}
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
                  </div>
                  
                  {/* Bouton Marquer comme payé */}
                  {canSettle && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <Button
                        onClick={() => handleOpenSettlementDialog(brother)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Marquer comme payé
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              )
            })}
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

      {/* Dialog de règlement */}
      <Dialog open={settlementDialogOpen} onOpenChange={setSettlementDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enregistrer un règlement</DialogTitle>
            <DialogDescription>
              {selectedBrother && (
                <>
                  {userBalanceStatus === 'pay' 
                    ? `Vous allez enregistrer que vous avez payé ${selectedBrother.amount.toFixed(2)} € à ${selectedBrother.name}`
                    : `Vous allez enregistrer que ${selectedBrother.name} vous a payé ${selectedBrother.amount.toFixed(2)} €`}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Montant (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={settlementAmount}
                onChange={(e) => {
                  const value = e.target.value
                  // Permettre la saisie libre mais valider à la soumission
                  setSettlementAmount(value)
                }}
                placeholder="0.00"
              />
              {selectedBrother && (
                <p className="text-xs text-gray-500">
                  Solde actuel : {Math.abs(selectedBrother.balance || selectedBrother.amount).toFixed(2)} €
                  {parseFloat(settlementAmount) > Math.abs(selectedBrother.balance || selectedBrother.amount) && (
                    <span className="text-red-500 ml-2">⚠️ Montant supérieur au solde</span>
                  )}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentMethod">Méthode de paiement</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Sélectionner une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Espèces</SelectItem>
                  <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                  <SelectItem value="card">Carte bancaire</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Input
                id="notes"
                value={settlementNotes}
                onChange={(e) => setSettlementNotes(e.target.value)}
                placeholder="Ajouter une note..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSettlementDialogOpen(false)}
              disabled={creatingSettlement}
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreateSettlement}
              disabled={creatingSettlement || !settlementAmount || parseFloat(settlementAmount) <= 0}
            >
              {creatingSettlement ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Home
