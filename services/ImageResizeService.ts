import sharp from 'sharp'
import { logger } from '@/lib/logger'
import { IMAGE_FORMATS } from '@/types/imageFormats'
import type { ImageFormat } from '@/types/imageFormats'

export { IMAGE_FORMATS }
export type { ImageFormat }

class ImageResizeService {
    async downloadAndResize(imageUrl: string, formatKey: string): Promise<Buffer> {
        const format = IMAGE_FORMATS[formatKey]
        if (!format) {
            throw new Error(`Invalid format: ${formatKey}`)
        }

        logger.info('Starting image resize', {
            imageUrl,
            format: format.name,
            dimensions: `${format.width}x${format.height}`,
        })

        try {
            // Download image from Cloudinary
            const response = await fetch(imageUrl)
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`)
            }

            const arrayBuffer = await response.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            logger.info('Image downloaded', {
                originalSize: buffer.length,
            })

            // Resize with Sharp
            const resized = await sharp(buffer)
                .resize(format.width, format.height, {
                    fit: format.fit,
                    background: { r: 255, g: 255, b: 255, alpha: 1 },
                })
                .jpeg({ quality: 95, mozjpeg: true })
                .toBuffer()

            logger.info('Image resized successfully', {
                format: format.name,
                dimensions: `${format.width}x${format.height}`,
                originalSize: buffer.length,
                resizedSize: resized.length,
                compression: `${((1 - resized.length / buffer.length) * 100).toFixed(1)}%`,
            })

            return resized
        } catch (error: any) {
            logger.error('Error resizing image', {
                error: error.message,
                format: format.name,
            })
            throw error
        }
    }
}

export const imageResizeService = new ImageResizeService()
