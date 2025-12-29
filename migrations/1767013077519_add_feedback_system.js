exports.up = async function (db) {
  // Criar tabela de usuários (para armazenar emails)
  await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `)

  // Criar tabela de feedbacks
  await db.query(`
        CREATE TABLE IF NOT EXISTS feedbacks (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            generation_id VARCHAR(100) NOT NULL,
            output_type VARCHAR(50) NOT NULL,
            rating INTEGER CHECK (rating >= 1 AND rating <= 5),
            what_worked TEXT,
            what_to_improve TEXT,
            met_needs VARCHAR(50),
            additional_comments TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `)

  // Criar índices
  await db.query(`
        CREATE INDEX IF NOT EXISTS idx_feedbacks_user_id ON feedbacks(user_id)
    `)

  await db.query(`
        CREATE INDEX IF NOT EXISTS idx_feedbacks_generation_id ON feedbacks(generation_id)
    `)

  await db.query(`
        CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at)
    `)

  console.log('✅ Tabelas users e feedbacks criadas com sucesso')
}

exports.down = async function (db) {
  await db.query('DROP TABLE IF EXISTS feedbacks CASCADE')
  await db.query('DROP TABLE IF EXISTS users CASCADE')
  console.log('✅ Tabelas users e feedbacks removidas')
}
