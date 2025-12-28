import { logger } from '@/lib/logger'

export type OutputType = 'front' | 'back' | 'real_situation'

interface GenerationResult {
    imageUrl: string
    prompt: string
    generationTimeMs: number
}

export class GeminiImageService {
    private buildPrompt(outputType: OutputType, hasReferenceImage: boolean): string {
        if (!hasReferenceImage) {
            return 'Please provide a reference image of the clothing item.'
        }

        const basePrompts = {
            front: `Extract the clothing item from the reference image and place it on a professional white mannequin in a studio setting, front view. Create a photorealistic product photography with white seamless background, soft diffused lighting, centered composition, high resolution 8k quality. The clothing should be perfectly fitted on the mannequin, showing all details clearly with clean and minimalist aesthetic.`,

            back: `Extract the clothing item from the reference image and place it on a professional white mannequin in a studio setting, back view. Create a photorealistic product photography with white seamless background, soft diffused lighting, centered composition, high resolution 8k quality. The clothing should be perfectly fitted on the mannequin, showing the back details clearly with clean and minimalist aesthetic.`,

            real_situation: `Extract the clothing item from the reference image and show it being worn by a real person (model) in a natural lifestyle setting. The clothing should look natural and well-fitted on the person. Create a photorealistic lifestyle photography with casual outdoor environment, natural lighting, candid pose, high quality 8k resolution, authentic and relatable, modern fashion photography style.`,
        }

        return basePrompts[outputType]
    }

    async generateImage(
        outputType: OutputType,
        referenceImageBase64: string
    ): Promise<GenerationResult> {
        const startTime = Date.now()

        try {
            if (!referenceImageBase64) {
                throw new Error('Reference image is required')
            }

            const prompt = this.buildPrompt(outputType, true)

            logger.info(`Generating ${outputType} image with reference`, {
                hasReferenceImage: !!referenceImageBase64,
            })

            // Use v1beta endpoint directly with fetch for gemini-2.5-flash-image
            const apiKey = process.env.GEMINI_API_KEY
            if (!apiKey) {
                throw new Error('GEMINI_API_KEY is not set')
            }

            const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent'

            const requestBody = {
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: referenceImageBase64,
                            },
                        },
                    ],
                }],
            }

            logger.info('Calling Gemini 2.5 Flash Image via v1beta', {
                endpoint,
                prompt: prompt.substring(0, 100),
                hasImage: true,
            })

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey,
                },
                body: JSON.stringify(requestBody),
            })

            if (!response.ok) {
                const errorText = await response.text()
                logger.error('Gemini API error', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorText,
                })
                throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`)
            }

            const data = await response.json()

            // Extract the generated image from the response
            const candidates = data.candidates
            if (!candidates || candidates.length === 0) {
                logger.error('No candidates in response', { data })
                throw new Error('No image generated - empty response')
            }

            const parts = candidates[0]?.content?.parts
            if (!parts || parts.length === 0) {
                logger.error('No parts in candidate', { candidates })
                throw new Error('No image data in response')
            }

            // Find the image part
            const imagePart = parts.find((part: any) => part.inline_data || part.inlineData)
            if (!imagePart) {
                logger.error('No image data found', { parts })
                throw new Error('No image data found in response')
            }

            // Handle both snake_case and camelCase
            const imageData = imagePart.inline_data || imagePart.inlineData
            if (!imageData || !imageData.data) {
                logger.error('No image data in part', { imagePart })
                throw new Error('No image data found in response part')
            }

            const imageUrl = `data:${imageData.mime_type || imageData.mimeType || 'image/png'};base64,${imageData.data}`

            const generationTimeMs = Date.now() - startTime

            logger.info(`Image generated successfully with Gemini 2.5 Flash Image`, {
                outputType,
                generationTimeMs,
                mimeType: imageData.mime_type || imageData.mimeType,
            })

            return {
                imageUrl,
                prompt,
                generationTimeMs,
            }
        } catch (error: any) {
            logger.error('Error generating image', {
                outputType,
                error: error.message,
                stack: error.stack,
            })
            throw new Error(`Failed to generate ${outputType} image: ${error.message}`)
        }
    }

    async generateMultipleImages(
        outputTypes: OutputType[],
        referenceImageBase64: string
    ): Promise<GenerationResult[]> {
        logger.info('Generating multiple images with reference', {
            outputTypes,
            hasReferenceImage: !!referenceImageBase64,
        })

        const results = await Promise.all(
            outputTypes.map(type =>
                this.generateImage(type, referenceImageBase64)
            )
        )

        return results
    }
}

export const geminiImageService = new GeminiImageService()
