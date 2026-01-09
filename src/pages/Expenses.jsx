import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plane, Utensils, Home as HomeIcon, DollarSign, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer'
import { getGroupExpenses } from '@/services/groups'
import { getExpenseById } from '@/services/expenses'
import { useGroup } from '@/context/GroupContext'
import { useCurrency } from '@/context/CurrencyContext'

const Expenses = () => {
  const navigate = useNavigate()
  const { currentGroupId } = useGroup()
  const { displayCurrency, convertAmount, formatAmount } = useCurrency()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExpense, setSelectedExpense] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (currentGroupId) {
      loadExpenses()
    } else {
      setLoading(false)
      setError('Aucun groupe sélectionné')
    }
  }, [searchQuery, currentGroupId, displayCurrency])

  const loadExpenses = async () => {
    if (!currentGroupId) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await getGroupExpenses(currentGroupId, searchQuery)
      setExpenses(data.expenses)
    } catch (err) {
      console.error('Error loading expenses:', err)
      setError(err.message || 'Erreur lors du chargement des dépenses')
    } finally {
      setLoading(false)
    }
  }

  const handleExpenseClick = async (expense) => {
    try {
      setLoadingDetails(true)
      const details = await getExpenseById(expense.id)
      
      // Formater les données pour le drawer
      const formattedExpense = {
        ...expense,
        date: new Date(details.date),
        paidBy: details.paidBy.name,
        sharedWith: details.shares.reduce((acc, share) => {
          acc[share.userId] = share.amount
          return acc
        }, {}),
        shares: details.shares,
      }
      
      setSelectedExpense(formattedExpense)
    } catch (err) {
      console.error('Error loading expense details:', err)
      setError(err.message || 'Erreur lors du chargement des détails')
    } finally {
      setLoadingDetails(false)
    }
  }

  // Données mockées (supprimées)
  const mockExpenses = [
    {
      id: 1,
      title: 'Vol Paris-Tunis',
      category: 'travel',
      paidBy: 'Mohamed',
      amount: 450.00,
      date: new Date('2026-01-05'),
      sharedWith: {
        mohamed: 0,
        lassad: 225,
        youssef: 225,
      },
    },
    {
      id: 2,
      title: 'Courses supermarché',
      category: 'food',
      paidBy: 'Lassad',
      amount: 120.50,
      date: new Date('2026-01-03'),
      sharedWith: {
        mohamed: 40.17,
        lassad: 40.17,
        youssef: 40.16,
      },
    },
    {
      id: 3,
      title: 'Loyer janvier',
      category: 'rent',
      paidBy: 'Youssef',
      amount: 800.00,
      date: new Date('2026-01-01'),
      sharedWith: {
        mohamed: 266.67,
        lassad: 266.67,
        youssef: 266.66,
      },
    },
  ]

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'travel':
        return <Plane size={20} className="text-gray-600" />
      case 'food':
        return <Utensils size={20} className="text-gray-600" />
      case 'rent':
        return <HomeIcon size={20} className="text-gray-600" />
      default:
        return <DollarSign size={20} className="text-gray-600" />
    }
  }

  // Grouper par mois
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date)
    const monthKey = date.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    })
    if (!acc[monthKey]) {
      acc[monthKey] = []
    }
    acc[monthKey].push(expense)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* En-tête avec recherche */}
      <div className="sticky top-0 bg-white border-b z-10 px-4 py-4">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Dépenses</h1>
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une dépense..."
            className="pl-10 rounded-2xl"
          />
        </div>
      </div>

      {/* Liste des dépenses groupées par mois */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          </div>
        ) : error ? (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-6">
              <p className="text-red-700 mb-4 font-medium">{error}</p>
              <Button onClick={loadExpenses} variant="outline">
                Réessayer
              </Button>
            </CardContent>
          </Card>
        ) : Object.keys(groupedExpenses).length === 0 ? (
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center text-gray-700">
              Aucune dépense trouvée
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedExpenses).map(([month, monthExpenses]) => (
          <div key={month} className="mb-6">
            <h2 className="text-base font-bold text-slate-700 uppercase mb-4">
              {month}
            </h2>
            <div className="space-y-2">
              {monthExpenses.map((expense) => (
                <Card
                  key={expense.id}
                  className="rounded-2xl cursor-pointer hover:border-gray-300 transition-colors bg-gray-50"
                  onClick={() => handleExpenseClick(expense)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                  {/* Icône catégorie */}
                  <div className="flex-shrink-0">
                    {getCategoryIcon(expense.category)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-base text-foreground">{expense.title}</div>
                    <div className="text-base text-slate-700 mt-1">
                      Payé par {expense.paidBy.name}
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="text-xl font-bold text-foreground">
                    {formatAmount(convertAmount(expense.amount, 'EUR', displayCurrency), displayCurrency)}
                  </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          ))
        )}
      </div>

      {/* Drawer de détails */}
      <Drawer open={!!selectedExpense} onOpenChange={(open) => !open && setSelectedExpense(null)}>
        <DrawerContent className="max-w-md mx-auto max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Détails de la dépense</DrawerTitle>
            <DrawerClose />
          </DrawerHeader>
          
          {loadingDetails ? (
            <div className="px-4 py-6 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            </div>
          ) : selectedExpense ? (
            <div className="px-4 py-6 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {selectedExpense.title}
                </h3>
                <div className="text-gray-700">
                  Payé par {selectedExpense.paidBy} le{' '}
                  {selectedExpense.date.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                <div className="text-2xl font-bold mt-2">
                  {formatAmount(convertAmount(selectedExpense.amount, 'EUR', displayCurrency), displayCurrency)}
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-700 uppercase mb-4">
                  Répartition
                </h4>
                <div className="space-y-3">
                  {selectedExpense.shares && selectedExpense.shares.length > 0 ? (
                    selectedExpense.shares.map((share) => (
                      <Card key={share.userId} className="rounded-2xl bg-gray-50">
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
                              {share.initial}
                            </div>
                            <div>
                              <div className="font-medium">
                                {share.name}
                              </div>
                              {share.amount === 0 && (
                                <div className="text-xs text-gray-700">
                                  Exclu du partage
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-xl font-bold text-foreground">
                            {formatAmount(convertAmount(share.amount, 'EUR', displayCurrency), displayCurrency)}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-gray-700 text-center py-4">
                      Aucune répartition disponible
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default Expenses
