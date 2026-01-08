# FamilySplit Backend API

Backend API Express/TypeScript pour l'application FamilySplit.

## Installation

1. Installer les dépendances :
```bash
cd backend
npm install
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env
```

Puis éditer `.env` avec vos paramètres de base de données :
```
DATABASE_URL=postgresql://username:password@localhost:5432/familysplit
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

3. S'assurer que PostgreSQL est démarré et que la base de données existe (voir `../database/README.md`)

## Démarrage

### Mode développement
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### Mode production
```bash
npm run build
npm start
```

## Endpoints API

### Groups

- `GET /api/groups/:groupId/summary` - Résumé financier d'un groupe
- `GET /api/groups/:groupId/expenses` - Liste des dépenses d'un groupe (query param `search` optionnel)

### Expenses

- `GET /api/expenses/:id` - Détails d'une dépense avec répartition
- `POST /api/expenses` - Créer une nouvelle dépense

Body pour POST `/api/expenses`:
```json
{
  "groupId": "uuid",
  "title": "string",
  "amount": 123.45,
  "date": "2026-01-08",
  "paidByUserId": "uuid",
  "category": "string (optionnel)",
  "receiptImageUrl": "string (optionnel)",
  "participantIds": ["uuid1", "uuid2"]
}
```

## Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── connection.ts    # Pool PostgreSQL
│   │   └── queries.ts       # Fonctions SQL
│   ├── routes/
│   │   ├── groups.ts        # Routes groupes
│   │   ├── expenses.ts      # Routes dépenses
│   │   └── index.ts         # Router principal
│   └── index.ts             # Point d'entrée
├── .env                     # Variables d'environnement (non versionné)
├── .env.example             # Template
└── package.json
```
