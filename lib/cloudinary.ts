import { v2 as cloudinary } from 'cloudinary'
import { logger } from '@/lib/logger'

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dmqf55xzl',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Validate configuration
if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    logger.warn('Cloudinary credentials not configured. Image uploads will fail.')
}

export default cloudinary
