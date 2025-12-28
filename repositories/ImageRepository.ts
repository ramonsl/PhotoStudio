import { query } from '@/lib/db'
import { GeneratedImage, CreateGeneratedImageInput } from '@/types'

export class ImageRepository {
    async saveGeneratedImage(input: CreateGeneratedImageInput): Promise<GeneratedImage> {
        const result = await query(
            `INSERT INTO generated_images 
       (original_photo_url, generated_url, output_type, prompt_used, product_description, model_api, generation_time_ms, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
            [
                input.original_photo_url,
                input.generated_url,
                input.output_type,
                input.prompt_used,
                input.product_description || null,
                input.model_api || 'gemini',
                input.generation_time_ms || null,
                input.metadata ? JSON.stringify(input.metadata) : null,
            ]
        )
        return result.rows[0]
    }

    async getImageById(id: string): Promise<GeneratedImage | null> {
        const result = await query(
            'SELECT * FROM generated_images WHERE id = $1',
            [id]
        )
        return result.rows[0] || null
    }

    async getImagesByOriginal(originalPhotoUrl: string): Promise<GeneratedImage[]> {
        const result = await query(
            'SELECT * FROM generated_images WHERE original_photo_url = $1 ORDER BY created_at DESC',
            [originalPhotoUrl]
        )
        return result.rows
    }

    async getRecentGenerations(limit: number = 20, offset: number = 0): Promise<{
        data: GeneratedImage[]
        total: number
    }> {
        const countResult = await query('SELECT COUNT(*) FROM generated_images')
        const total = parseInt(countResult.rows[0].count)

        const result = await query(
            'SELECT * FROM generated_images ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        )

        return {
            data: result.rows,
            total,
        }
    }
}

export const imageRepository = new ImageRepository()
