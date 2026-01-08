# 🔐 Fonctionnalité "Mot de passe oublié"

## ✅ Fonctionnalités ajoutées

### Backend

1. **POST `/api/auth/forgot-password`** :
   - Demande une réinitialisation de mot de passe
   - Génère un token de réinitialisation (valide 1 heure)
   - En développement, retourne le token dans la réponse

2. **POST `/api/auth/reset-password`** :
   - Réinitialise le mot de passe avec un token
   - Vérifie que le token est valide et non expiré
   - Hash le nouveau mot de passe avec bcrypt

### Frontend

1. **Page `/forgot-password`** :
   - Formulaire pour entrer l'email
   - En développement, affiche le token généré
   - Lien vers la page de réinitialisation

2. **Page `/reset-password`** :
   - Formulaire pour définir un nouveau mot de passe
   - Récupère le token depuis l'URL (`?token=...`)
   - Confirmation du mot de passe
   - Redirection automatique vers la connexion après succès

3. **Page Login** :
   - Lien "Mot de passe oublié ?" ajouté

## 🔧 Utilisation

### Pour l'utilisateur

1. Sur la page de connexion, cliquez sur **"Mot de passe oublié ?"**
2. Entrez votre email
3. En développement, copiez le token affiché
4. Allez sur `/reset-password?token=[VOTRE_TOKEN]`
5. Entrez votre nouveau mot de passe
6. Vous êtes redirigé vers la connexion

### En production

En production, vous devrez :
1. Configurer un service d'email (SendGrid, Mailgun, etc.)
2. Envoyer un email avec le lien : `https://votre-site.com/reset-password?token=[TOKEN]`
3. Retirer l'affichage du token dans la réponse

## 📝 Exemple de lien de réinitialisation

```
https://family-depenses.onrender.com/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ⚠️ Notes importantes

- Le token expire après **1 heure**
- Le token ne peut être utilisé qu'**une seule fois** (après réinitialisation, il devient invalide)
- En développement, le token est affiché pour faciliter les tests
- En production, configurez l'envoi d'email pour envoyer le lien automatiquement

## 🔒 Sécurité

- ✅ Les tokens sont signés avec JWT_SECRET
- ✅ Les tokens expirent après 1 heure
- ✅ Les mots de passe sont hashés avec bcrypt
- ✅ Le système ne révèle pas si un email existe ou non (sécurité)
