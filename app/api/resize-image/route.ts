import { NextRequest, NextResponse } from 'next/server'
import { imageResizeService } from '@/services/ImageResizeService'
import { IMAGE_FORMATS } from '@/types/imageFormats'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { imageUrl, format } = body

        // Validation
        if (!imageUrl || typeof imageUrl !== 'string') {
            return NextResponse.json(
                { error: 'imageUrl is required and must be a string' },
                { status: 400 }
            )
        }

        if (!format || typeof format !== 'string') {
            return NextResponse.json(
                { error: 'format is required and must be a string' },
                { status: 400 }
            )
        }

        if (!IMAGE_FORMATS[format]) {
            return NextResponse.json(
                {
                    error: `Invalid format: ${format}`,
                    availableFormats: Object.keys(IMAGE_FORMATS),
                },
                { status: 400 }
            )
        }

        logger.info('Resize image request', {
            imageUrl,
            format,
        })

        // Resize image
        const resizedImage = await imageResizeService.downloadAndResize(imageUrl, format)

        // Return image as downloadable file
        return new NextResponse(new Uint8Array(resizedImage), {
            headers: {
                'Content-Type': 'image/jpeg',
                'Content-Disposition': `attachment; filename="${format}.jpg"`,
                'Content-Length': resizedImage.length.toString(),
            },
        })
    } catch (error: any) {
        logger.error('Error in resize-image API', {
            error: error.message,
            stack: error.stack,
        })

        return NextResponse.json(
            { error: 'Failed to resize image', details: error.message },
            { status: 500 }
        )
    }
}
