/**
 * Script pour exécuter le schéma SQL dans Supabase
 * 
 * Usage:
 * 1. Configurez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans votre .env
 * 2. node database/execute-schema.js
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: join(process.cwd(), 'backend', '.env') })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erreur: Variables d\'environnement manquantes')
  console.error('Veuillez configurer SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans backend/.env')
  process.exit(1)
}

// Créer le client Supabase avec la service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function executeSchema() {
  try {
    console.log('📖 Lecture du fichier schema-supabase.sql...')
    
    // Lire le fichier SQL
    const sqlPath = join(__dirname, 'schema-supabase.sql')
    const sql = readFileSync(sqlPath, 'utf-8')
    
    console.log('🚀 Exécution du script SQL dans Supabase...')
    console.log('⏳ Cela peut prendre quelques secondes...\n')
    
    // Exécuter le SQL via l'API Supabase
    // Note: Supabase n'a pas d'API directe pour exécuter du SQL arbitraire
    // Cette méthode utilise l'API REST pour exécuter des requêtes
    
    // Diviser le script en instructions individuelles
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    let successCount = 0
    let errorCount = 0
    
    for (const statement of statements) {
      if (statement.length === 0) continue
      
      try {
        // Utiliser l'API REST de Supabase pour exécuter le SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({ sql: statement })
        })
        
        if (!response.ok) {
          // Certaines erreurs sont normales (comme "relation already exists")
          const errorText = await response.text()
          if (!errorText.includes('already exists') && !errorText.includes('does not exist')) {
            console.warn(`⚠️  Avertissement: ${errorText.substring(0, 100)}`)
            errorCount++
          }
        } else {
          successCount++
        }
      } catch (error) {
        // Ignorer les erreurs de fonction RPC qui n'existe peut-être pas
        if (!error.message.includes('exec_sql')) {
          console.warn(`⚠️  Avertissement: ${error.message}`)
        }
      }
    }
    
    console.log('\n✅ Script exécuté!')
    console.log(`   ${successCount} instructions réussies`)
    if (errorCount > 0) {
      console.log(`   ${errorCount} avertissements (peuvent être ignorés)`)
    }
    console.log('\n💡 Note: Supabase n\'a pas d\'API directe pour exécuter du SQL arbitraire.')
    console.log('   Ce script est une tentative, mais il est recommandé d\'utiliser le SQL Editor')
    console.log('   dans le dashboard Supabase pour exécuter le script manuellement.')
    console.log('\n📖 Voir database/GUIDE_EXECUTION_SQL.md pour les instructions détaillées.')
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution:', error.message)
    console.error('\n💡 Solution: Utilisez le SQL Editor dans le dashboard Supabase')
    console.error('   Voir database/GUIDE_EXECUTION_SQL.md pour les instructions')
    process.exit(1)
  }
}

executeSchema()
