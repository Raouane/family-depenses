import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase nécessite SSL même en développement
  ssl: process.env.DATABASE_URL?.includes('supabase') 
    ? { rejectUnauthorized: false } 
    : process.env.NODE_ENV === 'production' 
      ? { rejectUnauthorized: false } 
      : false,
})

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database')
})

pool.on('error', (err: Error) => {
  console.error('❌ Unexpected error on idle client', err)
  process.exit(-1)
})

export default pool
