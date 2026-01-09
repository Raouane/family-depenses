import { useState, useEffect, useMemo } from 'react'
import { Loader2, Calendar, CreditCard, Filter, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getGroupSettlements } from '@/services/settlements'
import { useGroup } from '@/context/GroupContext'
import { useAuth } from '@/context/AuthContext'

const Settlements = () => {
  const { currentGroupId } = useGroup()
  const { user: currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [allSettlements, setAllSettlements] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')

  useEffect(() => {
    if (currentGroupId) {
      loadSettlements()
    } else {
      setLoading(false)
      setError('Aucun groupe sélectionné. Veuillez sélectionner un groupe dans la page Groupes.')
    }
  }, [currentGroupId])

  const loadSettlements = async () => {
    if (!currentGroupId) return

    try {
      setLoading(true)
      setError(null)
      const data = await getGroupSettlements(currentGroupId)
      setAllSettlements(data)
    } catch (err) {
      console.error('Error loading settlements:', err)
      setError(err.message || 'Erreur lors du chargement de l\'historique')
    } finally {
      setLoading(false)
    }
  }

  // Extraire les années et mois disponibles
  const { availableYears, availableMonths } = useMemo(() => {
    const years = new Set()
    const months = new Set()
    
    allSettlements.forEach(settlement => {
      const date = new Date(settlement.createdAt)
      const year = date.getFullYear()
      const month = date.getMonth() + 1 // 1-12
      years.add(year)
      months.add(`${year}-${month.toString().padStart(2, '0')}`)
    })
    
    return {
      availableYears: Array.from(years).sort((a, b) => b - a),
      availableMonths: Array.from(months).sort((a, b) => b.localeCompare(a))
    }
  }, [allSettlements])

  // Filtrer les règlements selon le mois et l'année sélectionnés
  const filteredSettlements = useMemo(() => {
    if (selectedMonth === 'all' && selectedYear === 'all') {
      return allSettlements
    }

    return allSettlements.filter(settlement => {
      const date = new Date(settlement.createdAt)
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      if (selectedYear !== 'all' && year !== parseInt(selectedYear)) {
        return false
      }

      if (selectedMonth !== 'all') {
        const [monthYear, monthNum] = selectedMonth.split('-')
        if (year !== parseInt(monthYear) || month !== parseInt(monthNum)) {
          return false
        }
      }

      return true
    })
  }, [allSettlements, selectedMonth, selectedYear])

  const getMonthLabel = (monthKey) => {
    if (monthKey === 'all') return 'Tous les mois'
    const [year, month] = monthKey.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, 1)
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  }

  const resetFilters = () => {
    setSelectedMonth('all')
    setSelectedYear('all')
  }


  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPaymentMethodLabel = (method) => {
    const methods = {
      cash: 'Espèces',
      bank_transfer: 'Virement bancaire',
      card: 'Carte bancaire',
      paypal: 'PayPal',
      other: 'Autre'
    }
    return methods[method] || method
  }

  if (loading) {
    return (
      <div className="px-4 py-6 pb-24 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-gray-700">Chargement de l'historique...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6 pb-24">
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-700 mb-4 font-medium">{error}</p>
            <Button onClick={loadSettlements} variant="outline">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Historique des paiements</h1>
        <p className="text-base text-slate-700 mt-2 font-medium">
          Tous les règlements enregistrés dans ce groupe
        </p>
      </div>

      {/* Filtres */}
      {allSettlements.length > 0 && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Filtrer par :</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Année</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les années" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les années</SelectItem>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Mois</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les mois" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les mois</SelectItem>
                    {availableMonths.map(month => (
                      <SelectItem key={month} value={month}>
                        {getMonthLabel(month)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(selectedMonth !== 'all' || selectedYear !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="mt-3 w-full text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Réinitialiser les filtres
              </Button>
            )}
            <div className="mt-3 text-xs text-gray-500">
              {filteredSettlements.length} règlement{filteredSettlements.length > 1 ? 's' : ''} trouvé{filteredSettlements.length > 1 ? 's' : ''}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredSettlements.length === 0 ? (
        <Card className="bg-gray-50">
          <CardContent className="p-6 text-center text-gray-700">
            {allSettlements.length === 0 ? (
              <>
                <p className="mb-2">Aucun règlement enregistré</p>
                <p className="text-sm text-gray-500">
                  Les règlements apparaîtront ici une fois qu'ils auront été créés
                </p>
              </>
            ) : (
              <>
                <p className="mb-2">Aucun règlement trouvé</p>
                <p className="text-sm text-gray-500">
                  Aucun règlement ne correspond aux filtres sélectionnés
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="mt-3"
                >
                  Réinitialiser les filtres
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSettlements.map((settlement) => {
            const isFromCurrentUser = settlement.fromUser.userId === currentUser?.id
            const isToCurrentUser = settlement.toUser.userId === currentUser?.id

            return (
              <Card key={settlement.id} className="rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      {/* En-tête avec les utilisateurs */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${
                          isFromCurrentUser ? 'bg-red-600' : 'bg-gray-600'
                        }`}>
                          {settlement.fromUser.initial}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-base">
                            {isFromCurrentUser ? 'Vous' : settlement.fromUser.name} 
                            {' → '}
                            {isToCurrentUser ? 'Vous' : settlement.toUser.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {isFromCurrentUser 
                              ? `Vous avez payé ${settlement.toUser.name}`
                              : isToCurrentUser
                              ? `${settlement.fromUser.name} vous a payé`
                              : `${settlement.fromUser.name} a payé ${settlement.toUser.name}`}
                          </div>
                        </div>
                      </div>

                      {/* Montant */}
                      <div className="mb-3">
                        <div className={`text-2xl font-bold ${
                          isToCurrentUser ? 'text-green-700' : isFromCurrentUser ? 'text-red-700' : 'text-gray-700'
                        }`}>
                          {isToCurrentUser ? '+' : isFromCurrentUser ? '-' : ''}
                          {settlement.amount.toLocaleString('fr-FR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })} €
                        </div>
                      </div>

                      {/* Détails */}
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(settlement.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span>{getPaymentMethodLabel(settlement.paymentMethod)}</span>
                        </div>
                        {settlement.notes && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-gray-700 italic">"{settlement.notes}"</p>
                          </div>
                        )}
                        {settlement.createdBy.userId !== settlement.fromUser.userId && (
                          <div className="text-xs text-gray-500 mt-2">
                            Enregistré par {settlement.createdBy.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Settlements
