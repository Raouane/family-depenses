# 🔧 Résoudre l'erreur "Port 3000 déjà utilisé"

## ⚠️ Erreur

```
Error: listen EADDRINUSE: address already in use :::3000
```

Le port 3000 est déjà utilisé par un autre processus.

## ✅ Solutions

### Solution 1 : Trouver et tuer le processus (Recommandé)

#### Étape 1 : Trouver le processus

Dans PowerShell, exécutez :

```powershell
netstat -ano | findstr :3000
```

Vous verrez quelque chose comme :
```
TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       12345
```

Le dernier nombre (12345) est le **PID** (Process ID).

#### Étape 2 : Tuer le processus

Remplacez `12345` par le PID que vous avez trouvé :

```powershell
taskkill /PID 12345 /F
```

#### Étape 3 : Relancer le backend

```powershell
cd backend
npm run dev
```

### Solution 2 : Tuer tous les processus Node.js

Si plusieurs processus Node.js tournent :

```powershell
taskkill /IM node.exe /F
```

⚠️ **Attention** : Cela tuera **tous** les processus Node.js en cours d'exécution.

### Solution 3 : Changer le port (Alternative)

Si vous ne pouvez pas tuer le processus, changez le port du backend :

#### Modifier `backend/.env`

```env
PORT=3001
```

#### Modifier `src/services/api.js` (frontend)

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api')
```

#### Modifier `.env` (frontend)

```env
VITE_API_URL=http://localhost:3001/api
```

## 🔍 Vérification

Après avoir tué le processus, vérifiez que le port est libre :

```powershell
netstat -ano | findstr :3000
```

Si rien n'apparaît, le port est libre.

## ✅ Relancer le backend

```powershell
cd backend
npm run dev
```

Le serveur devrait maintenant démarrer sans erreur.
