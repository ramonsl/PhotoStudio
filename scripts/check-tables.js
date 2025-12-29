require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

async function checkTables() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    })

    try {
        console.log('🔍 Checking database tables...\n')

        const result = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        `)

        console.log('Tables in database:')
        console.log('─'.repeat(40))
        result.rows.forEach(row => {
            console.log(`  ${row.table_name}`)
        })
        console.log('─'.repeat(40))
        console.log(`Total tables: ${result.rows.length}\n`)

        // Check if users table exists
        const hasUsers = result.rows.some(row => row.table_name === 'users')
        const hasFeedbacks = result.rows.some(row => row.table_name === 'feedbacks')

        if (!hasUsers) {
            console.log('❌ Table "users" NOT FOUND')
        } else {
            console.log('✅ Table "users" exists')
        }

        if (!hasFeedbacks) {
            console.log('❌ Table "feedbacks" NOT FOUND')
        } else {
            console.log('✅ Table "feedbacks" exists')
        }

    } catch (error) {
        console.error('❌ Error:', error.message)
    } finally {
        await pool.end()
    }
}

checkTables()
