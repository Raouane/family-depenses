# 📋 Instructions pour configurer Render

## 📄 Fichier à copier-coller

Le fichier `COPIER_COLLER_RENDER.txt` contient toutes les variables d'environnement nécessaires.

## 🔧 Étapes dans Render

### Option 1 : Utiliser "Add from .env" (Recommandé)

1. Allez dans Render → Web Service → **Environment**
2. Cliquez sur **"Add from .env"**
3. Ouvrez le fichier `COPIER_COLLER_RENDER.txt`
4. **Copiez tout le contenu** (Ctrl+A puis Ctrl+C)
5. **Collez** dans la zone de texte de Render (Ctrl+V)
6. Cliquez sur **"Save Changes"**

### Option 2 : Ajouter manuellement

Si "Add from .env" ne fonctionne pas, ajoutez chaque variable une par une :

1. Cliquez sur **"Add Environment Variable"**
2. Pour chaque ligne du fichier, ajoutez :
   - **Key** = partie avant le `=`
   - **Value** = partie après le `=`
3. Répétez pour les 6 variables
4. Cliquez sur **"Save Changes"**

## ⚠️ Important

- **Remplacez** `[MOT_DE_PASSE]` dans `DATABASE_URL` par votre vrai mot de passe si nécessaire
- Le fichier utilise déjà le mot de passe encodé : `Papa1930%2AMaman1951%2A`
- Si votre mot de passe est différent, mettez à jour `DATABASE_URL`

## ✅ Après configuration

1. **Redéployez** : Manual Deploy → Deploy latest commit
2. Attendez que le build se termine
3. Testez votre application
