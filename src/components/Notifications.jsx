import { useState, useEffect } from 'react'
import { Bell, X, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '@/services/notifications'
import { useAuth } from '@/context/AuthContext'

const Notifications = () => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [markingAll, setMarkingAll] = useState(false)
  const [backendAvailable, setBackendAvailable] = useState(true)

  useEffect(() => {
    if (user && open) {
      loadNotifications()
    }
  }, [user, open])

  useEffect(() => {
    if (user && backendAvailable) {
      loadUnreadCount()
      // Rafraîchir le compteur toutes les 30 secondes seulement si le backend est disponible
      const interval = setInterval(() => {
        if (backendAvailable) {
          loadUnreadCount()
        }
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [user, backendAvailable])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await getNotifications(50)
      setNotifications(data)
      setBackendAvailable(true)
    } catch (err) {
      // Ne pas logger les erreurs de connexion
      if (err.isConnectionError || (err.message && (err.message.includes('Failed to fetch') || err.message.includes('ERR_CONNECTION_REFUSED') || err.message.includes('Backend non disponible')))) {
        setBackendAvailable(false)
        return
      }
      console.error('Error loading notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadCount()
      setUnreadCount(count)
      setBackendAvailable(true) // Backend est disponible
    } catch (err) {
      // Ne pas logger les erreurs de connexion (backend non démarré)
      if (err.isConnectionError || (err.message && (err.message.includes('Failed to fetch') || err.message.includes('ERR_CONNECTION_REFUSED') || err.message.includes('Backend non disponible')))) {
        setBackendAvailable(false) // Marquer le backend comme indisponible
        // Ne pas logger pour éviter le spam
        return
      }
      // Pour les autres erreurs (401, 500, etc.), on peut logger
      console.error('Error loading unread count:', err)
      setBackendAvailable(true) // Garder le backend comme disponible pour les erreurs d'auth
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId)
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ))
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true)
      await markAllAsRead()
      setNotifications(notifications.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Error marking all as read:', err)
    } finally {
      setMarkingAll(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'À l\'instant'
    if (minutes < 60) return `Il y a ${minutes} min`
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  const unreadNotifications = notifications.filter(n => !n.is_read)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={24} className="text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadNotifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={markingAll}
                  className="text-xs"
                >
                  {markingAll ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                      En cours...
                    </>
                  ) : (
                    <>
                      <Check className="mr-1 h-3 w-3" />
                      Tout marquer comme lu
                    </>
                  )}
                </Button>
              )}
            </DialogTitle>
            <DialogDescription>
              {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Aucune notification non lue'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto -mx-6 px-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Aucune notification</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-colors ${
                      notification.is_read 
                        ? 'bg-white border-gray-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                    onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{notification.title}</h4>
                            {!notification.is_read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{notification.group_name}</span>
                            <span>•</span>
                            <span>{formatDate(notification.created_at)}</span>
                          </div>
                        </div>
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkAsRead(notification.id)
                            }}
                            className="flex-shrink-0"
                          >
                            <X size={16} />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Notifications
