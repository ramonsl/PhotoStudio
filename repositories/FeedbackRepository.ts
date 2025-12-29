import { query } from '@/lib/db'
import { logger } from '@/lib/logger'

export interface Feedback {
    id: number
    user_id: number
    generation_id: string
    output_type: string
    rating?: number
    what_worked?: string
    what_to_improve?: string
    met_needs?: string
    additional_comments?: string
    created_at: Date
}

export interface CreateFeedbackData {
    userId: number
    generationId: string
    outputType: string
    rating?: number
    whatWorked?: string
    whatToImprove?: string
    metNeeds?: string
    additionalComments?: string
}

export class FeedbackRepository {
    async create(data: CreateFeedbackData): Promise<Feedback> {
        try {
            const result = await query(
                `INSERT INTO feedbacks (
                    user_id, generation_id, output_type, rating,
                    what_worked, what_to_improve, met_needs, additional_comments
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *`,
                [
                    data.userId,
                    data.generationId,
                    data.outputType,
                    data.rating || null,
                    data.whatWorked || null,
                    data.whatToImprove || null,
                    data.metNeeds || null,
                    data.additionalComments || null,
                ]
            )

            logger.info('Feedback created', {
                feedbackId: result.rows[0].id,
                userId: data.userId,
                generationId: data.generationId,
            })

            return result.rows[0]
        } catch (error: any) {
            logger.error('Error creating feedback', {
                userId: data.userId,
                error: error.message,
            })
            throw error
        }
    }

    async findByGenerationId(generationId: string): Promise<Feedback[]> {
        try {
            const result = await query(
                'SELECT * FROM feedbacks WHERE generation_id = $1 ORDER BY created_at DESC',
                [generationId]
            )
            return result.rows
        } catch (error: any) {
            logger.error('Error finding feedbacks', { generationId, error: error.message })
            throw error
        }
    }

    async findByUserId(userId: number, limit: number = 10): Promise<Feedback[]> {
        try {
            const result = await query(
                'SELECT * FROM feedbacks WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
                [userId, limit]
            )
            return result.rows
        } catch (error: any) {
            logger.error('Error finding user feedbacks', { userId, error: error.message })
            throw error
        }
    }
}

export const feedbackRepository = new FeedbackRepository()
