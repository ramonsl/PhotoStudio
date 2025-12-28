const fs = require('fs')
const path = require('path')

const migrationName = process.argv[2]

if (!migrationName) {
    console.error('Please provide a migration name: npm run migrate:create -- migration_name')
    process.exit(1)
}

const timestamp = Date.now()
const filename = `${timestamp}_${migrationName}.js`
const migrationsDir = path.join(__dirname, '..', 'migrations')

if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true })
}

const template = `/**
 * Migration: ${migrationName}
 * Created: ${new Date().toISOString()}
 */

async function up(db) {
  // Write your migration here
  // Example:
  // await db.query(\`
  //   CREATE TABLE IF NOT EXISTS example (
  //     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  //     name VARCHAR(255) NOT NULL,
  //     created_at TIMESTAMP DEFAULT NOW()
  //   )
  // \`)
}

async function down(db) {
  // Write rollback logic here
  // Example:
  // await db.query('DROP TABLE IF EXISTS example')
}

module.exports = { up, down }
`

const filepath = path.join(migrationsDir, filename)
fs.writeFileSync(filepath, template)

console.log(`✅ Migration created: ${filename}`)
console.log(`📝 Edit the file at: ${filepath}`)
