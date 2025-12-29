exports.up = async function (db) {
  // Adicionar user_id na tabela generated_images
  await db.query(`
        ALTER TABLE generated_images
        ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
    `)

  // Adicionar colunas de custo na tabela generated_images
  await db.query(`
        ALTER TABLE generated_images
        ADD COLUMN IF NOT EXISTS prompt_tokens INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS candidates_tokens INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS total_tokens INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS input_cost_usd DECIMAL(10, 6) DEFAULT 0,
        ADD COLUMN IF NOT EXISTS output_cost_usd DECIMAL(10, 6) DEFAULT 0,
        ADD COLUMN IF NOT EXISTS total_cost_usd DECIMAL(10, 6) DEFAULT 0
    `)

  // Criar índices
  await db.query(`
        CREATE INDEX IF NOT EXISTS idx_generated_images_user_id 
        ON generated_images(user_id)
    `)

  await db.query(`
        CREATE INDEX IF NOT EXISTS idx_generated_images_created_at 
        ON generated_images(created_at)
    `)

  console.log('✅ Colunas user_id e custo adicionadas à tabela generated_images')
}

exports.down = async function (db) {
  await db.query(`
        ALTER TABLE generated_images
        DROP COLUMN IF EXISTS user_id,
        DROP COLUMN IF EXISTS prompt_tokens,
        DROP COLUMN IF EXISTS candidates_tokens,
        DROP COLUMN IF EXISTS total_tokens,
        DROP COLUMN IF EXISTS input_cost_usd,
        DROP COLUMN IF EXISTS output_cost_usd,
        DROP COLUMN IF EXISTS total_cost_usd
    `)

  await db.query(`
        DROP INDEX IF EXISTS idx_generated_images_user_id
    `)

  await db.query(`
        DROP INDEX IF EXISTS idx_generated_images_created_at
    `)

  console.log('✅ Colunas user_id e custo removidas da tabela generated_images')
}
