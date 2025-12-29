const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const isProduction = process.argv[2] === 'production'

// Load environment variables only if .env.local exists (local dev)
// In production (Railway), DATABASE_URL is already in environment
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath })
}

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not set in environment variables')
    process.exit(1)
}


const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
})

async function runMigrations() {
    const client = await pool.connect()

    try {
        console.log(`🚀 Running migrations in ${isProduction ? 'PRODUCTION' : 'TEST'} mode...`)

        // Create migrations table if not exists
        await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `)

        // Get executed migrations
        const { rows: executedMigrations } = await client.query(
            'SELECT name FROM migrations ORDER BY id'
        )
        const executedNames = executedMigrations.map(m => m.name)

        // Get migration files
        const migrationsDir = path.join(__dirname, '..', 'migrations')

        if (!fs.existsSync(migrationsDir)) {
            console.log('📁 No migrations directory found. Creating...')
            fs.mkdirSync(migrationsDir, { recursive: true })
            console.log('✅ Migrations directory created')
            return
        }

        const files = fs.readdirSync(migrationsDir)
            .filter(f => f.endsWith('.js'))
            .sort()

        if (files.length === 0) {
            console.log('📝 No migration files found')
            return
        }

        // Run pending migrations
        let executedCount = 0

        for (const file of files) {
            if (executedNames.includes(file)) {
                console.log(`⏭️  Skipping ${file} (already executed)`)
                continue
            }

            console.log(`▶️  Running ${file}...`)

            const migration = require(path.join(migrationsDir, file))

            await client.query('BEGIN')

            try {
                await migration.up(client)
                await client.query('INSERT INTO migrations (name) VALUES ($1)', [file])
                await client.query('COMMIT')

                console.log(`✅ ${file} executed successfully`)
                executedCount++
            } catch (error) {
                await client.query('ROLLBACK')
                console.error(`❌ Error executing ${file}:`, error.message)
                throw error
            }
        }

        if (executedCount === 0) {
            console.log('✨ All migrations are up to date')
        } else {
            console.log(`\n✅ Successfully executed ${executedCount} migration(s)`)
        }

    } catch (error) {
        console.error('❌ Migration failed:', error)
        process.exit(1)
    } finally {
        client.release()
        await pool.end()
    }
}

runMigrations()
