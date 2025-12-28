import { NextRequest, NextResponse } from 'next/server'
import { geminiImageService, OutputType } from '@/services/GeminiImageService'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { imageUrls, outputTypes } = body

        // Validation
        if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
            return NextResponse.json(
                { error: 'imageUrls is required and must be a non-empty array' },
                { status: 400 }
            )
        }

        if (!outputTypes || !Array.isArray(outputTypes) || outputTypes.length === 0) {
            return NextResponse.json(
                { error: 'outputTypes is required and must be a non-empty array' },
                { status: 400 }
            )
        }

        if (outputTypes.length > 3) {
            return NextResponse.json(
                { error: 'Maximum 3 output types allowed' },
                { status: 400 }
            )
        }

        const validOutputTypes: OutputType[] = ['front', 'back', 'real_situation']
        for (const type of outputTypes) {
            if (!validOutputTypes.includes(type)) {
                return NextResponse.json(
                    { error: `Invalid output type: ${type}` },
                    { status: 400 }
                )
            }
        }

        logger.info('Starting image generation with reference image', {
            imageUrls,
            outputTypes,
        })

        // Fetch the first uploaded image and convert to base64
        const imageUrl = imageUrls[0]
        let referenceImageBase64: string

        try {
            // Check if it's a local file or external URL
            const isLocalFile = imageUrl.startsWith('/uploads/')

            if (isLocalFile) {
                // Read local file
                const fs = await import('fs/promises')
                const path = await import('path')
                const filePath = path.join(process.cwd(), 'public', imageUrl)
                const imageBuffer = await fs.readFile(filePath)
                referenceImageBase64 = imageBuffer.toString('base64')
            } else {
                // Fetch external URL
                const imageResponse = await fetch(imageUrl)
                if (!imageResponse.ok) {
                    throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
                }
                const imageBuffer = await imageResponse.arrayBuffer()
                referenceImageBase64 = Buffer.from(imageBuffer).toString('base64')
            }

            logger.info('Image converted to base64', {
                imageUrl,
                base64Length: referenceImageBase64.length,
            })
        } catch (error: any) {
            logger.error('Error loading reference image', { error: error.message })
            return NextResponse.json(
                { error: `Failed to load reference image: ${error.message}` },
                { status: 400 }
            )
        }

        // Generate images using the reference image
        const results = await geminiImageService.generateMultipleImages(
            outputTypes,
            referenceImageBase64
        )

        // Format results for display (without saving to database)
        const images = results.map((result, index) => ({
            id: `temp-${Date.now()}-${index}`,
            original_photo_url: imageUrls[0],
            generated_url: result.imageUrl,
            output_type: outputTypes[index],
            prompt_used: result.prompt,
            product_description: 'Generated from reference image',
            model_api: 'gemini-2.5-flash-image',
            generation_time_ms: result.generationTimeMs,
            created_at: new Date().toISOString(),
        }))

        logger.info('Images generated successfully', {
            count: images.length,
        })

        return NextResponse.json({
            success: true,
            images,
        })
    } catch (error: any) {
        logger.error('Error generating images', { error: error.message })
        return NextResponse.json(
            { error: error.message || 'Failed to generate images' },
            { status: 500 }
        )
    }
}
