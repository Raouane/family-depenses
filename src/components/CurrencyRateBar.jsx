import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Check } from 'lucide-react'
import { getExchangeRate, updateExchangeRate } from '@/services/settings'

const CurrencyRateBar = () => {
  const [rate, setRate] = useState('3.45')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadRate()
  }, [])

  const loadRate = async () => {
    try {
      setLoading(true)
      const currentRate = await getExchangeRate()
      setRate(currentRate.toString())
    } catch (error) {
      // Use default rate if loading fails
      console.warn('Error loading exchange rate, using default:', error)
      setRate('3.45')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    const rateNum = parseFloat(rate)
    if (isNaN(rateNum) || rateNum <= 0) {
      alert('Le taux doit être un nombre positif')
      return
    }

    try {
      setSaving(true)
      await updateExchangeRate(rateNum)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving exchange rate:', error)
      alert('Erreur lors de la sauvegarde du taux')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-gray-700 font-medium">Taux actuel :</span>
        {isEditing ? (
          <>
            <span className="text-gray-700">1€ =</span>
            <Input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-20 h-7 text-center text-sm"
              step="0.01"
              min="0.01"
            />
            <span className="text-gray-700">TND</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              disabled={saving}
              className="h-7 px-2"
            >
              {saving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsEditing(false)
                loadRate()
              }}
              className="h-7 px-2"
            >
              Annuler
            </Button>
          </>
        ) : (
          <>
            <span className="text-blue-700 font-bold">1€ = {rate} TND</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-7 px-2 text-blue-600 hover:text-blue-700"
            >
              Modifier
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default CurrencyRateBar
