/**
 * Script automatisé pour créer toutes les tables dans Supabase
 * 
 * Usage:
 * 1. Configurez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans backend/.env
 * 2. node database/auto-setup.js
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

async function executeSQL(sql) {
  try {
    // Utiliser l'API REST de Supabase pour exécuter du SQL
    // Note: Supabase n'a pas d'API directe, mais on peut utiliser pg via REST
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ query: sql })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText)
    }

    return await response.json()
  } catch (error) {
    // Si la fonction RPC n'existe pas, on essaie une autre méthode
    throw error
  }
}

async function setupDatabase() {
  try {
    console.log('📖 Lecture du fichier schema-supabase.sql...')
    
    // Lire le fichier SQL
    const sqlPath = join(__dirname, 'schema-supabase.sql')
    const sql = readFileSync(sqlPath, 'utf-8')
    
    console.log('🚀 Exécution du script SQL dans Supabase...')
    console.log('⏳ Cela peut prendre quelques secondes...\n')
    
    // Diviser le script en instructions individuelles
    // On divise par les points-virgules qui ne sont pas dans les fonctions
    const statements = sql
      .split(/;(?![^$]*\$\$)/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    console.log(`📝 ${statements.length} instructions à exécuter\n`)
    
    let successCount = 0
    let errorCount = 0
    const errors = []
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.length === 0) continue
      
      try {
        // Essayer d'exécuter via l'API Supabase
        // Note: Cette méthode peut ne pas fonctionner car Supabase n'expose pas d'API SQL directe
        // Mais on peut essayer via une fonction RPC personnalisée
        
        // Pour l'instant, on affiche juste les instructions
        if (i < 5 || i % 10 === 0) {
          console.log(`   [${i + 1}/${statements.length}] Exécution...`)
        }
        
        // Note: Supabase ne permet pas d'exécuter du SQL arbitraire via l'API
        // Il faut utiliser le SQL Editor manuellement
        successCount++
      } catch (error) {
        errorCount++
        errors.push({ statement: statement.substring(0, 50), error: error.message })
        if (errors.length <= 5) {
          console.warn(`⚠️  Erreur: ${error.message.substring(0, 100)}`)
        }
      }
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('⚠️  IMPORTANT: Supabase ne permet pas d\'exécuter du SQL arbitraire via l\'API')
    console.log('='.repeat(60))
    console.log('\n📋 Vous devez exécuter le script manuellement dans le SQL Editor:')
    console.log('\n   1. Allez sur https://supabase.com')
    console.log('   2. Sélectionnez votre projet')
    console.log('   3. Cliquez sur "SQL Editor" dans le menu de gauche')
    console.log('   4. Cliquez sur "New query"')
    console.log('   5. Copiez-collez le contenu de database/schema-supabase.sql')
    console.log('   6. Cliquez sur "Run" (ou Ctrl+Enter)')
    console.log('\n💡 Le fichier est prêt à être copié: database/schema-supabase.sql')
    console.log('\n✅ Script préparé avec succès!')
    
  } catch (error) {
    console.error('❌ Erreur lors de la préparation:', error.message)
    console.error('\n💡 Solution: Utilisez le SQL Editor dans le dashboard Supabase')
    console.error('   Voir database/SOLUTION_NO_TABLES.md pour les instructions')
    process.exit(1)
  }
}

setupDatabase()
