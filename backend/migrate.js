import pg from 'pg'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const { Pool } = pg

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL n\'est pas défini dans le fichier .env')
    console.error('   Assurez-vous que le fichier backend/.env contient votre URL Supabase')
    process.exit(1)
  }

  if (databaseUrl.includes('[PROJECT-REF]')) {
    console.error('❌ DATABASE_URL contient encore [PROJECT-REF]')
    console.error('   Remplacez [PROJECT-REF] par la référence de votre projet Supabase')
    console.error('   Exemple: db.lqdfioptcptinnxqshrj.supabase.co')
    process.exit(1)
  }

  console.log('🔄 Connexion à Supabase...')
  
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    // Tester la connexion
    await pool.query('SELECT NOW()')
    console.log('✅ Connecté à Supabase avec succès!')

    // Lire le fichier SQL
    const sqlPath = path.join(__dirname, '..', 'database', 'schema-supabase.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')

    console.log('📝 Exécution du script SQL...')
    console.log('   (Cela peut prendre quelques secondes)')

    // Exécuter le script SQL
    await pool.query(sql)

    console.log('✅ Migration terminée avec succès!')
    console.log('')
    console.log('📊 Vérification des tables créées...')

    // Vérifier les tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `)

    console.log('   Tables créées:')
    tablesResult.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`)
    })

    // Vérifier les données d'exemple
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users')
    const groupsResult = await pool.query('SELECT COUNT(*) as count FROM groups')
    
    console.log('')
    console.log('📦 Données d\'exemple:')
    console.log(`   Utilisateurs: ${usersResult.rows[0].count}`)
    console.log(`   Groupes: ${groupsResult.rows[0].count}`)

    console.log('')
    console.log('🎉 Tout est prêt! Vous pouvez maintenant redémarrer le backend.')

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error.message)
    
    if (error.code === 'ENOTFOUND') {
      console.error('   Vérifiez que l\'URL de connexion Supabase est correcte')
      console.error('   Vérifiez votre connexion internet')
    } else if (error.code === '28P01') {
      console.error('   Erreur d\'authentification - vérifiez le mot de passe dans DATABASE_URL')
    } else {
      console.error('   Détails:', error.message)
    }
    
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runMigration()
