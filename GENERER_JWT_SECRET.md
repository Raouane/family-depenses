# 🔑 Comment générer un JWT_SECRET

## ⚠️ Important

Le `JWT_SECRET` n'est **PAS** un token JWT. C'est une **clé secrète** utilisée pour **signer** et **vérifier** les tokens JWT.

## 🎯 Méthodes pour générer un JWT_SECRET

### Méthode 1 : Node.js (Recommandé)

Ouvrez un terminal et exécutez :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Cela générera une chaîne aléatoire de 128 caractères (64 bytes en hexadécimal).

### Méthode 2 : PowerShell (Windows)

```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Méthode 3 : En ligne (moins sécurisé)

Vous pouvez utiliser un générateur en ligne comme :
- https://generate-secret.vercel.app/64
- https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx

**⚠️ Attention** : Ne partagez jamais votre secret généré publiquement !

### Méthode 4 : OpenSSL (si installé)

```bash
openssl rand -hex 64
```

## 📋 Exemple de JWT_SECRET généré

Un exemple de secret généré ressemblera à :
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
```

## ✅ Configuration

### Backend local (`backend/.env`)

```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2
```

### Render (Web Service → Environment)

Ajoutez la variable :
- **Key** : `JWT_SECRET`
- **Value** : (collez votre secret généré)

## 🔒 Sécurité

- ✅ Utilisez un secret **long** (au moins 64 caractères)
- ✅ Utilisez un secret **aléatoire** (pas de mots de passe simples)
- ✅ Utilisez un secret **différent** en production et en développement
- ❌ **NE JAMAIS** commiter le secret dans Git
- ❌ **NE JAMAIS** partager le secret publiquement

## 📝 Note

Le `JWT_SECRET` est utilisé par le backend pour :
- **Signer** les tokens JWT lors de la connexion/inscription
- **Vérifier** les tokens JWT dans le middleware d'authentification

Les tokens JWT eux-mêmes sont générés automatiquement par le backend et retournés au frontend lors de la connexion/inscription.
