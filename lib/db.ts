import { Pool, PoolClient } from 'pg'
import { logger } from '@/lib/logger'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
})

export async function query(text: string, params?: any[]) {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    logger.info('Executed query', { text, duration, rows: res.rowCount })
    return res
}

export async function getClient(): Promise<PoolClient> {
    const client = await pool.connect()
    return client
}

export default pool
