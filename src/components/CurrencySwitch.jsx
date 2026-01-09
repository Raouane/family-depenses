import { Button } from '@/components/ui/button'
import { useCurrency } from '@/context/CurrencyContext'

const CurrencySwitch = () => {
  const { displayCurrency, switchCurrency } = useCurrency()

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
      <Button
        type="button"
        variant={displayCurrency === 'EUR' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchCurrency('EUR')}
        className="rounded-full"
      >
        EUR
      </Button>
      <Button
        type="button"
        variant={displayCurrency === 'TND' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchCurrency('TND')}
        className="rounded-full"
      >
        TND
      </Button>
    </div>
  )
}

export default CurrencySwitch
