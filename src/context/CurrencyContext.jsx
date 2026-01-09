import { createContext, useContext, useState, useEffect } from 'react'
import { getExchangeRate } from '@/services/settings'

const CurrencyContext = createContext()

export function CurrencyProvider({ children }) {
  const [displayCurrency, setDisplayCurrency] = useState(() => {
    // Restaurer depuis localStorage
    return localStorage.getItem('displayCurrency') || 'EUR'
  })
  const [exchangeRate, setExchangeRate] = useState(3.45)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExchangeRate()
  }, [])

  const loadExchangeRate = async () => {
    try {
      const rate = await getExchangeRate()
      setExchangeRate(rate)
    } catch (error) {
      // Use default rate if loading fails
      console.warn('Error loading exchange rate, using default:', error)
      setExchangeRate(3.45)
    } finally {
      setLoading(false)
    }
  }

  const switchCurrency = (currency) => {
    setDisplayCurrency(currency)
    localStorage.setItem('displayCurrency', currency)
  }

  const convertAmount = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) {
      return amount
    }
    
    if (fromCurrency === 'EUR' && toCurrency === 'TND') {
      return amount * exchangeRate
    }
    
    if (fromCurrency === 'TND' && toCurrency === 'EUR') {
      return amount / exchangeRate
    }
    
    return amount
  }

  const formatAmount = (amount, currency) => {
    return amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + (currency === 'EUR' ? ' €' : ' TND')
  }

  return (
    <CurrencyContext.Provider
      value={{
        displayCurrency,
        exchangeRate,
        loading,
        switchCurrency,
        convertAmount,
        formatAmount,
        refreshRate: loadExchangeRate,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}
