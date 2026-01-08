import { useLocation, useNavigate } from 'react-router-dom'
import { Home, DollarSign, Users, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const Layout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  // Ne pas afficher la navigation sur les pages d'authentification
  if (location.pathname === '/login' || 
      location.pathname === '/forgot-password' || 
      location.pathname === '/reset-password') {
    return <>{children}</>
  }

  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/expenses', icon: DollarSign, label: 'Dépenses' },
    { path: '/groups', icon: Users, label: 'Groupes' },
    { path: '/profile', icon: User, label: 'Profil' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50 pb-20 safe-area-bottom">
      <main className="max-w-md mx-auto bg-white min-h-screen">
        {children}
      </main>
      
      {/* Barre de navigation fixe en bas */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          {navItems.map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive(path)
                  ? 'text-gray-700'
                  : 'text-gray-400'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default Layout
