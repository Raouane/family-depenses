# Résolution de l'erreur EADDRINUSE (Port 3000 occupé)

## 🚨 Le problème

L'erreur `EADDRINUSE` signifie qu'un autre processus utilise déjà le port 3000.

## ✅ Solutions rapides

### Solution 1 : Script PowerShell (Recommandé)

Exécutez simplement :
```powershell
.\kill-port-3000.ps1
```

Ce script va automatiquement :
- Trouver le processus qui utilise le port 3000
- L'arrêter proprement
- Vous informer du résultat

### Solution 2 : Commande manuelle

```powershell
# Trouver le processus
netstat -ano | findstr :3000

# Arrêter le processus (remplacez PID par le numéro trouvé)
taskkill /PID [PID] /F
```

### Solution 3 : Arrêter tous les processus Node

```powershell
taskkill /F /IM node.exe
```

⚠️ **Attention** : Cela arrêtera TOUTES les instances de Node.js en cours.

## 🔧 Configuration des ports

### Backend (Express)
- **Port par défaut** : 3000
- **Configuration** : `backend/.env` → `PORT=3000`
- **Changer le port** : Modifiez `PORT=3001` dans `backend/.env`

### Frontend (Vite)
- **Port par défaut** : 5173
- **Configuration** : Pas de conflit avec le backend ✅

## 📝 Fichier .env recommandé

Créez `backend/.env` avec :
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://...
NODE_ENV=development
```

## 🛡️ Prévention

Le backend a maintenant une gestion d'erreur améliorée qui :
- Détecte automatiquement si le port est occupé
- Affiche des instructions claires pour résoudre le problème
- Suggère d'utiliser un autre port si nécessaire

## 💡 Astuce

Si vous travaillez sur plusieurs projets en même temps, utilisez des ports différents :
- Projet 1 : PORT=3000
- Projet 2 : PORT=3001
- Projet 3 : PORT=3002
