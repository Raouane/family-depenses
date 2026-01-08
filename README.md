# FamilySplit - Application de Partage de Frais

Une application PWA mobile-first pour gérer le partage de frais en famille, construite avec React, Vite, Tailwind CSS et shadcn/ui.

## 🚀 Installation

1. Installez les dépendances :
```bash
npm install
```

2. Lancez le serveur de développement :
```bash
npm run dev
```

3. Ouvrez votre navigateur à l'adresse affichée (généralement `http://localhost:5173`)

## 📱 Fonctionnalités

- **Dashboard** : Vue d'ensemble du solde total et répartition par membre
- **Ajout de dépense** : Formulaire complet avec calcul automatique des parts
- **Historique** : Liste chronologique des dépenses avec détails
- **Navigation** : Interface mobile-first avec barre de navigation fixe

## 🛠️ Technologies

- React 18
- Vite
- Tailwind CSS
- shadcn/ui (composants UI)
- React Router
- Lucide React (icônes)
- PostgreSQL (base de données)

## 📦 Build pour production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`.

## 🗄️ Base de données

Le script SQL pour créer la base de données PostgreSQL se trouve dans `database/schema.sql`.

Voir [database/README.md](database/README.md) pour les instructions d'installation et d'utilisation.

## 🔧 Backend API

Le backend Express/TypeScript se trouve dans le dossier `backend/`.

### Installation du backend

1. Installer les dépendances :
```bash
cd backend
npm install
```

2. Configurer les variables d'environnement :
```bash
cp env.example .env
```

Puis éditer `.env` avec vos paramètres de base de données.

3. Démarrer le serveur :
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

Voir [backend/README.md](backend/README.md) pour plus de détails.

## 🚀 Démarrage complet

1. **Base de données** : Créer et configurer PostgreSQL (voir `database/README.md`)
2. **Backend** : Démarrer le serveur API (voir `backend/README.md`)
3. **Frontend** : Démarrer l'application React :
```bash
npm run dev
```
