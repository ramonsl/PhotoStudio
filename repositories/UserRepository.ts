import { query } from '@/lib/db'
import { logger } from '@/lib/logger'

export interface User {
    id: number
    email: string
    created_at: Date
}

export class UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        try {
            const result = await query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            )
            return result.rows[0] || null
        } catch (error: any) {
            logger.error('Error finding user by email', { email, error: error.message })
            throw error
        }
    }

    async create(email: string): Promise<User> {
        try {
            const result = await query(
                'INSERT INTO users (email) VALUES ($1) RETURNING *',
                [email]
            )
            logger.info('User created', { email, userId: result.rows[0].id })
            return result.rows[0]
        } catch (error: any) {
            logger.error('Error creating user', { email, error: error.message })
            throw error
        }
    }

    async findOrCreate(email: string): Promise<User> {
        const existing = await this.findByEmail(email)
        if (existing) {
            return existing
        }
        return await this.create(email)
    }
}

export const userRepository = new UserRepository()
