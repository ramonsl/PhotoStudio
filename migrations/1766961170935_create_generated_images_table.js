/**
 * Migration: create_generated_images_table
 * Created: 2025-12-28T22:32:50.935Z
 */

async function up(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS generated_images (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      original_photo_url TEXT NOT NULL,
      generated_url TEXT NOT NULL,
      output_type VARCHAR(50) NOT NULL,
      prompt_used TEXT NOT NULL,
      product_description TEXT,
      model_api VARCHAR(100) DEFAULT 'gemini',
      generation_time_ms INTEGER,
      created_at TIMESTAMP DEFAULT NOW(),
      metadata JSONB
    )
  `)

  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_generated_images_created_at 
    ON generated_images(created_at DESC)
  `)

  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_generated_images_output_type 
    ON generated_images(output_type)
  `)
}

async function down(db) {
  await db.query('DROP TABLE IF EXISTS generated_images')
}

module.exports = { up, down }
