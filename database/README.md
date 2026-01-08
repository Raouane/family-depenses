# Base de données FamilySplit

## Installation

### Prérequis
- PostgreSQL 12 ou supérieur

### Étapes

1. Créer la base de données :
```sql
CREATE DATABASE familysplit;
```

2. Se connecter à la base de données :
```bash
psql -U votre_utilisateur -d familysplit
```

3. Exécuter le script SQL :
```bash
psql -U votre_utilisateur -d familysplit -f schema.sql
```

Ou depuis psql :
```sql
\i schema.sql
```

## Structure de la base de données

### Tables principales

- **users** : Utilisateurs de l'application
- **groups** : Groupes de partage de frais
- **user_groups** : Liaison many-to-many entre utilisateurs et groupes
- **expenses** : Dépenses enregistrées
- **expense_shares** : Répartition des dépenses entre utilisateurs

### Vues et fonctions

- **user_balances** : Vue calculant les soldes de chaque utilisateur par groupe
- **get_group_summary()** : Fonction retournant le résumé financier d'un groupe
- **calculate_expense_shares()** : Fonction pour calculer automatiquement les parts

## Utilisation

### Obtenir le résumé d'un groupe

```sql
SELECT * FROM get_group_summary('660e8400-e29b-41d4-a716-446655440000');
```

### Voir les soldes des utilisateurs

```sql
SELECT * FROM user_balances WHERE group_id = '660e8400-e29b-41d4-a716-446655440000';
```

### Créer une dépense avec répartition

```sql
-- 1. Insérer la dépense
INSERT INTO expenses (group_id, title, amount, date, paid_by_user_id, category)
VALUES (
    '660e8400-e29b-41d4-a716-446655440000',
    'Courses supermarché',
    120.50,
    '2026-01-03',
    '550e8400-e29b-41d4-a716-446655440001',
    'food'
) RETURNING id;

-- 2. Calculer les parts (remplacer l'ID de la dépense)
SELECT calculate_expense_shares(
    'ID_DE_LA_DEPENSE',
    120.50,
    ARRAY[
        '550e8400-e29b-41d4-a716-446655440000'::UUID,
        '550e8400-e29b-41d4-a716-446655440001'::UUID,
        '550e8400-e29b-41d4-a716-446655440002'::UUID
    ]
);
```

## Notes

- Les UUIDs dans les données d'exemple sont à remplacer par de vrais UUIDs générés par votre application
- La fonction `calculate_expense_shares` peut être appelée depuis votre backend après l'insertion d'une dépense
- La vue `user_balances` est mise à jour automatiquement à chaque modification des dépenses
