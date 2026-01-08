import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, UserCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login, register, error: authError } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    initial: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        navigate('/')
      } else {
        if (!formData.name.trim() || !formData.initial.trim()) {
          setError('Tous les champs sont requis')
          return
        }
        if (formData.initial.length !== 1) {
          setError('L\'initiale doit être un seul caractère')
          return
        }
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.initial.toUpperCase()
        )
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {isLogin ? 'Connexion' : 'Inscription'}
          </CardTitle>
          <p className="text-sm text-gray-700 mt-2">
            {isLogin
              ? 'Connectez-vous à votre compte'
              : 'Créez un nouveau compte pour commencer'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label htmlFor="name" className="text-gray-800">Nom</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="initial" className="text-gray-800">Initiale</Label>
                  <Input
                    id="initial"
                    type="text"
                    placeholder="M"
                    maxLength={1}
                    value={formData.initial}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        initial: e.target.value.toUpperCase(),
                      })
                    }
                    className="mt-2"
                    required={!isLogin}
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email" className="text-gray-800">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-800">Mot de passe</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {(error || authError) && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-700 font-medium">
                  {error || authError}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? 'Chargement...'
                : isLogin
                ? 'Se connecter'
                : 'Créer un compte'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError(null)
                setFormData({ name: '', email: '', password: '', initial: '' })
              }}
              className="text-sm text-primary hover:underline font-medium"
            >
              {isLogin
                ? "Pas encore de compte ? S'inscrire"
                : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
