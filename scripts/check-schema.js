require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

async function checkSchema() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    })

    try {
        console.log('🔍 Checking generated_images schema...\n')

        const result = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'generated_images'
            ORDER BY ordinal_position
        `)

        console.log('Columns in generated_images:')
        console.log('─'.repeat(60))
        result.rows.forEach(row => {
            console.log(`${row.column_name.padEnd(25)} ${row.data_type.padEnd(20)} ${row.is_nullable}`)
        })
        console.log('─'.repeat(60))
        console.log(`Total columns: ${result.rows.length}`)
    } catch (error) {
        console.error('❌ Error:', error.message)
    } finally {
        await pool.end()
    }
}

checkSchema()
