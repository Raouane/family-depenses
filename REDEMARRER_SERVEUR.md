# 🔄 Redémarrer le serveur pour charger les variables .env

## ⚠️ Problème

Vous avez toujours l'erreur même après avoir mis à jour le fichier `.env`.

**Cause** : Vite ne charge les variables d'environnement qu'au **démarrage**. Si vous modifiez le `.env` pendant que le serveur tourne, il faut le redémarrer.

## ✅ Solution : Redémarrer le serveur

### Méthode 1 : Via le terminal

1. **Arrêtez le serveur** :
   - Dans le terminal où `npm run dev` tourne, appuyez sur **Ctrl+C**
   - Attendez que le serveur s'arrête complètement

2. **Relancez le serveur** :
   ```bash
   npm run dev
   ```

3. **Vérifiez** :
   - L'erreur devrait disparaître
   - L'application devrait se charger

### Méthode 2 : Via l'IDE

Si vous utilisez un terminal intégré dans votre IDE :

1. Arrêtez le processus en cours
2. Relancez la commande `npm run dev`

## 🔍 Vérification

Après redémarrage, vérifiez dans la console du navigateur :
- ✅ Plus d'erreur "Variables d'environnement Supabase manquantes"
- ✅ L'application se charge normalement

## 📝 Note importante

**À chaque modification du fichier `.env`**, vous devez redémarrer le serveur pour que les changements soient pris en compte.

## 🐛 Si l'erreur persiste après redémarrage

1. Vérifiez que le fichier `.env` est bien à la **racine du projet** (même niveau que `package.json`)
2. Vérifiez qu'il n'y a pas d'espaces avant/après les `=` dans le fichier `.env`
3. Vérifiez que les variables commencent bien par `VITE_`
4. Videz le cache du navigateur (Ctrl+Shift+R ou Cmd+Shift+R)
