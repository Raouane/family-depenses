import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createExpense } from '@/services/expenses'
import { getGroupUsers } from '@/services/groups'
import { useGroup } from '@/context/GroupContext'

const AddExpense = () => {
  const navigate = useNavigate()
  const { currentGroupId } = useGroup()
  const [amount, setAmount] = useState('0.00')
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [paidBy, setPaidBy] = useState('')
  const [members, setMembers] = useState([])
  const [sharedWith, setSharedWith] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingMembers, setLoadingMembers] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (currentGroupId) {
      loadMembers()
    } else {
      setError('Aucun groupe sélectionné. Veuillez sélectionner un groupe.')
      setLoadingMembers(false)
    }
  }, [currentGroupId])

  const loadMembers = async () => {
    try {
      setLoadingMembers(true)
      const data = await getGroupUsers(currentGroupId)
      setMembers(data.members || [])
      
      // Initialiser sharedWith avec tous les membres cochés
      const initialShared = {}
      data.members.forEach(member => {
        initialShared[member.id] = true
      })
      setSharedWith(initialShared)
      
      // Définir le premier membre comme payeur par défaut
      if (data.members.length > 0) {
        setPaidBy(data.members[0].id)
      }
    } catch (err) {
      console.error('Error loading members:', err)
      setError('Erreur lors du chargement des membres')
    } finally {
      setLoadingMembers(false)
    }
  }

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9.,]/g, '')
    setAmount(value)
  }

  const toggleMember = (memberId) => {
    setSharedWith((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }))
  }

  const selectedCount = Object.values(sharedWith).filter(Boolean).length
  const amountNum = parseFloat(amount.replace(',', '.')) || 0
  const shareAmount = selectedCount > 0 ? amountNum / selectedCount : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!title.trim()) {
      setError('Le titre est requis')
      return
    }
    
    const amountNum = parseFloat(amount.replace(',', '.'))
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Le montant doit être un nombre positif')
      return
    }
    
    const participantIds = Object.entries(sharedWith)
      .filter(([_, selected]) => selected)
      .map(([memberId]) => memberId)
    
    if (participantIds.length === 0) {
      setError('Au moins un participant doit être sélectionné')
      return
    }
    
    if (!paidBy) {
      setError('Veuillez sélectionner qui a payé')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const expenseData = {
        groupId: currentGroupId,
        title: title.trim(),
        amount: amountNum,
        date: date,
        paidByUserId: paidBy,
        participantIds: participantIds,
      }
      
      // Ne pas inclure category si null (pour éviter les erreurs de validation)
      // TODO: Ajouter sélection de catégorie
      
      await createExpense(expenseData)
      
      // Rediriger vers la page d'accueil
      navigate('/')
    } catch (err) {
      console.error('Error creating expense:', err)
      setError(err.message || 'Erreur lors de la création de la dépense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* En-tête avec retour */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-4 py-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="-ml-2"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Nouvelle dépense</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-6">
        {/* Champ montant très large */}
        <div className="mb-8">
          <Input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="w-full text-5xl font-bold text-center border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-auto py-0"
          />
          <div className="text-center text-muted-foreground text-lg mt-2">€</div>
        </div>

        {/* Formulaire */}
        <div className="space-y-4 mb-6">
          {/* Titre */}
          <div>
            <label className="block text-base font-semibold text-foreground mb-3">
              Titre de la dépense
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Courses du week-end"
              className="rounded-2xl"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-base font-semibold text-foreground mb-3">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-2xl"
            />
          </div>

          {/* Payé par */}
          <div>
            <label className="block text-base font-semibold text-foreground mb-3">
              Payé par
            </label>
            {loadingMembers ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
              </div>
            ) : (
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="Sélectionner un membre" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Section Partager avec */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            Partager avec
          </h2>
          
          {loadingMembers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            </div>
          ) : members.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Aucun membre dans ce groupe
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
              <Card key={member.id} className="rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
                        {member.initial}
                      </div>
                      <span className="font-semibold text-base text-foreground">{member.name}</span>
                    </div>

                    {/* Switch */}
                    <Switch
                      checked={sharedWith[member.id]}
                      onCheckedChange={() => toggleMember(member.id)}
                    />
                  </div>

                  {/* Montant de la part */}
                  {sharedWith[member.id] && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-base text-slate-700 font-medium">
                        Sa part :{' '}
                        <span className="font-bold text-foreground text-lg">
                          {shareAmount.toLocaleString('fr-FR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })} €
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </div>

        {/* Bouton photo */}
        <Button
          type="button"
          variant="outline"
          className="w-full py-6 rounded-2xl border-2 border-dashed"
        >
          <Camera size={20} className="mr-2" />
          Ajouter une photo du ticket
        </Button>

        {/* Message d'erreur */}
        {error && (
          <div className="mt-4 p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Bouton valider */}
        <Button
          type="submit"
          className="w-full mt-6 py-6 rounded-2xl"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Ajout en cours...
            </>
          ) : (
            'Ajouter la dépense'
          )}
        </Button>
      </form>
    </div>
  )
}

export default AddExpense
