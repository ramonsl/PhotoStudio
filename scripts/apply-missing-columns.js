require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

async function applyMissingColumns() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    })

    try {
        console.log('🔧 Applying missing columns to generated_images...')

        // Add user_id if not exists
        await pool.query(`
            ALTER TABLE generated_images
            ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
        `)
        console.log('✅ user_id column added')

        // Create index
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_generated_images_user_id 
            ON generated_images(user_id)
        `)
        console.log('✅ Index on user_id created')

        console.log('✨ All columns applied successfully!')
    } catch (error) {
        console.error('❌ Error applying columns:', error.message)
        throw error
    } finally {
        await pool.end()
    }
}

applyMissingColumns()
