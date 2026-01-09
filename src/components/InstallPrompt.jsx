import { useState, useEffect } from 'react'
import { X, Download, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Vérifier si l'app est installée sur iOS
    if (window.navigator.standalone === true) {
      setIsInstalled(true)
      return
    }

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      // Empêcher l'affichage automatique du prompt
      e.preventDefault()
      // Stocker l'événement pour l'utiliser plus tard
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Vérifier si le prompt a déjà été refusé (dans localStorage)
    const promptDismissed = localStorage.getItem('pwa-install-prompt-dismissed')
    if (promptDismissed) {
      const dismissedDate = new Date(promptDismissed)
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
      // Réafficher après 7 jours
      if (daysSinceDismissed < 7) {
        setShowPrompt(false)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Si pas de prompt disponible, afficher les instructions
      showInstallInstructions()
      return
    }

    // Afficher le prompt d'installation
    deferredPrompt.prompt()

    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('✅ L\'utilisateur a accepté l\'installation')
      setShowPrompt(false)
      setIsInstalled(true)
    } else {
      console.log('❌ L\'utilisateur a refusé l\'installation')
      // Sauvegarder le refus pour ne pas réafficher immédiatement
      localStorage.setItem('pwa-install-prompt-dismissed', new Date().toISOString())
    }

    // Réinitialiser le prompt
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-prompt-dismissed', new Date().toISOString())
  }

  const showInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)

    let message = ''
    if (isIOS) {
      message = 'Pour installer l\'app sur iOS :\n1. Appuyez sur le bouton Partager\n2. Sélectionnez "Sur l\'écran d\'accueil"'
    } else if (isAndroid) {
      message = 'Pour installer l\'app sur Android :\n1. Appuyez sur le menu (⋮)\n2. Sélectionnez "Ajouter à l\'écran d\'accueil"'
    } else {
      message = 'Pour installer l\'app :\nUtilisez le menu de votre navigateur pour "Installer l\'application"'
    }

    alert(message)
  }

  // Ne pas afficher si déjà installée ou si le prompt n'est pas disponible
  if (isInstalled || !showPrompt) {
    return null
  }

  return (
    <Card className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md mx-4 shadow-2xl border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-base text-gray-900 mb-1">
              Installer FamilySplit
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              Installez l'application sur votre téléphone pour un accès rapide et une meilleure expérience !
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleInstallClick}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Installer
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default InstallPrompt
