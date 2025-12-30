import { NextRequest, NextResponse } from 'next/server'
import { geminiImageService, OutputType } from '@/services/GeminiImageService'
import { logger } from '@/lib/logger'
import cloudinary from '@/lib/cloudinary'
import { imageRepository } from '@/repositories/ImageRepository'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { frontImageUrl, backImageUrl, outputTypes, userId } = body

        // Validation
        if (!frontImageUrl || typeof frontImageUrl !== 'string') {
            return NextResponse.json(
                { error: 'frontImageUrl is required and must be a string' },
                { status: 400 }
            )
        }

        if (!outputTypes || !Array.isArray(outputTypes) || outputTypes.length === 0) {
            return NextResponse.json(
                { error: 'outputTypes is required and must be a non-empty array' },
                { status: 400 }
            )
        }

        // Validate that back photo exists if trying to generate back images
        const backOutputTypes = outputTypes.filter((type: string) => type.includes('back'))
        if (backOutputTypes.length > 0 && !backImageUrl) {
            return NextResponse.json(
                { error: 'backImageUrl is required to generate back view images. Please upload a back photo.' },
                { status: 400 }
            )
        }

        logger.info('Starting image generation with reference images', {
            frontImageUrl,
            backImageUrl,
            outputTypes,
            userId,
        })

        // Prepare requests with correct photo for each output type
        const imageRequests = await Promise.all(
            outputTypes.map(async (outputType: OutputType) => {
                // Determine which photo to use based on output type
                const isBackView = outputType.includes('back')
                const imageUrl = isBackView ? backImageUrl : frontImageUrl

                if (!imageUrl) {
                    throw new Error(`Missing ${isBackView ? 'back' : 'front'} photo for output type: ${outputType}`)
                }

                try {
                    // Fetch and convert to base64
                    const imageResponse = await fetch(imageUrl)
                    if (!imageResponse.ok) {
                        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
                    }
                    const imageBuffer = await imageResponse.arrayBuffer()
                    const referenceImageBase64 = Buffer.from(imageBuffer).toString('base64')

                    logger.info('Image converted to base64', {
                        outputType,
                        imageUrl,
                        base64Length: referenceImageBase64.length,
                    })

                    return {
                        outputType,
                        referenceImageBase64,
                        originalUrl: imageUrl,
                    }
                } catch (error: any) {
                    logger.error('Error loading reference image', {
                        outputType,
                        imageUrl,
                        error: error.message,
                    })
                    throw new Error(`Failed to load ${isBackView ? 'back' : 'front'} image: ${error.message}`)
                }
            })
        )

        // Generate images using the reference images
        const results = await geminiImageService.generateMultipleImages(
            imageRequests.map(req => ({
                outputType: req.outputType,
                referenceImageBase64: req.referenceImageBase64,
            }))
        )

        // Upload generated images to Cloudinary
        const images = await Promise.all(
            results.map(async (result: any, index: number) => {
                try {
                    // Extract base64 data from data URL
                    const base64Data = result.imageUrl.split(',')[1]
                    const buffer = Buffer.from(base64Data, 'base64')

                    // Upload to Cloudinary
                    const uploadResult = await new Promise<any>((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            {
                                folder: 'photostudio/generated',
                                resource_type: 'image',
                                transformation: [
                                    { quality: 'auto', fetch_format: 'auto' }
                                ]
                            },
                            (error, result) => {
                                if (error) reject(error)
                                else resolve(result)
                            }
                        )

                        uploadStream.end(buffer)
                    })

                    logger.info('Generated image uploaded to Cloudinary', {
                        outputType: outputTypes[index],
                        cloudinary_url: uploadResult.secure_url,
                    })

                    return {
                        id: `temp-${Date.now()}-${index}`,
                        original_photo_url: imageRequests[index].originalUrl,
                        generated_url: uploadResult.secure_url,
                        output_type: imageRequests[index].outputType,
                        prompt_used: result.prompt,
                        product_description: 'Generated from reference image',
                        model_api: 'gemini-2.5-flash-image',
                        generation_time_ms: result.generationTimeMs,
                        created_at: new Date().toISOString(),
                        cloudinary_id: uploadResult.public_id,
                        user_id: userId,
                        tokens: result.tokens,
                        cost: result.cost,
                    }
                } catch (error: any) {
                    logger.error('Error uploading generated image to Cloudinary', {
                        error: error.message,
                        outputType: outputTypes[index],
                    })
                    // Return with data URL if Cloudinary upload fails
                    return {
                        id: `temp-${Date.now()}-${index}`,
                        original_photo_url: imageRequests[index].originalUrl,
                        generated_url: result.imageUrl,
                        output_type: imageRequests[index].outputType,
                        prompt_used: result.prompt,
                        product_description: 'Generated from reference image',
                        model_api: 'gemini-2.5-flash-image',
                        generation_time_ms: result.generationTimeMs,
                        created_at: new Date().toISOString(),
                        user_id: userId,
                        tokens: result.tokens,
                        cost: result.cost,
                    }
                }
            })
        )

        // Save to database
        const savedImages = await Promise.all(
            images.map(async (image: any) => {
                try {
                    const saved = await imageRepository.saveGeneratedImage({
                        original_photo_url: image.original_photo_url,
                        generated_url: image.generated_url,
                        output_type: image.output_type as 'front' | 'back' | 'real_situation',
                        prompt_used: image.prompt_used,
                        product_description: image.product_description,
                        model_api: image.model_api,
                        generation_time_ms: image.generation_time_ms,
                        user_id: image.user_id,
                        prompt_tokens: image.tokens?.prompt,
                        candidates_tokens: image.tokens?.candidates,
                        total_tokens: image.tokens?.total,
                        input_cost_usd: image.cost?.input,
                        output_cost_usd: image.cost?.output,
                        total_cost_usd: image.cost?.total,
                    })

                    logger.info('Image saved to database', {
                        id: saved.id,
                        output_type: saved.output_type,
                        total_cost: image.cost?.total,
                    })

                    return saved
                } catch (error: any) {
                    logger.error('Error saving image to database', {
                        error: error.message,
                        output_type: image.output_type,
                    })
                    // Return original image if save fails
                    return image
                }
            })
        )

        logger.info('Images generated and saved successfully', {
            count: savedImages.length,
        })

        return NextResponse.json({
            success: true,
            images: savedImages,
        })
    } catch (error: any) {
        logger.error('Error generating images', { error: error.message })
        return NextResponse.json(
            { error: `Failed to generate images: ${error.message}` },
            { status: 500 }
        )
    }
}
