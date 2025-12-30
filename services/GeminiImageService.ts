import { logger } from '@/lib/logger'

export type OutputType = 'front' | 'back' | 'real_situation_front_male' | 'real_situation_back_male' | 'real_situation_front_female' | 'real_situation_back_female'


interface GenerationResult {
    imageUrl: string
    prompt: string
    generationTimeMs: number
    tokens?: {
        prompt: number
        candidates: number
        total: number
    }
    cost?: {
        input: number
        output: number
        total: number
    }
}

export class GeminiImageService {
    private buildPrompt(outputType: OutputType, hasReferenceImage: boolean): string {
        if (!hasReferenceImage) {
            return 'Please provide a reference image of the clothing item.'
        }

        const basePrompts = {
            front: `Extract the clothing item from the reference image and place it on a professional white mannequin in a studio setting, front view. Create a photorealistic product photography with white seamless background, soft diffused lighting, centered composition, high resolution 8k quality. The clothing should be perfectly fitted on the mannequin, showing all details clearly with clean and minimalist aesthetic.`,

            back: `Extract the clothing item from the reference image and place it on a professional white mannequin in a studio setting, back view. Create a photorealistic product photography with white seamless background, soft diffused lighting, centered composition, high resolution 8k quality. The clothing should be perfectly fitted on the mannequin, showing the back details clearly with clean and minimalist aesthetic.`,

            real_situation_front_male: `Extract the clothing item from the reference image and showcase it as the main focus being worn by a MALE model in a natural lifestyle setting, FRONT VIEW. THE PRODUCT MUST BE THE MAIN SUBJECT - use close-up or medium shot composition that highlights the clothing details, texture, and fit. The male model should be partially visible or in a neutral pose to complement the product without distracting from it. Create a photorealistic product-focused lifestyle photography with natural environment, soft natural lighting, product-centric composition, high quality 8k resolution, clean and professional aesthetic that emphasizes the clothing item above all else.`,

            real_situation_back_male: `Extract the clothing item from the reference image and showcase it as the main focus being worn by a MALE model in a natural lifestyle setting, BACK VIEW. THE PRODUCT MUST BE THE MAIN SUBJECT - use close-up or medium shot composition that highlights the clothing details, texture, and fit from behind. The male model should be partially visible or in a neutral pose to complement the product without distracting from it. Create a photorealistic product-focused lifestyle photography with natural environment, soft natural lighting, product-centric composition, high quality 8k resolution, clean and professional aesthetic that emphasizes the clothing item above all else.`,

            real_situation_front_female: `Extract the clothing item from the reference image and showcase it as the main focus being worn by a FEMALE model in a natural lifestyle setting, FRONT VIEW. THE PRODUCT MUST BE THE MAIN SUBJECT - use close-up or medium shot composition that highlights the clothing details, texture, and fit. The female model should be partially visible or in a neutral pose to complement the product without distracting from it. Create a photorealistic product-focused lifestyle photography with natural environment, soft natural lighting, product-centric composition, high quality 8k resolution, clean and professional aesthetic that emphasizes the clothing item above all else.`,

            real_situation_back_female: `Extract the clothing item from the reference image and showcase it as the main focus being worn by a FEMALE model in a natural lifestyle setting, BACK VIEW. THE PRODUCT MUST BE THE MAIN SUBJECT - use close-up or medium shot composition that highlights the clothing details, texture, and fit from behind. The female model should be partially visible or in a neutral pose to complement the product without distracting from it. Create a photorealistic product-focused lifestyle photography with natural environment, soft natural lighting, product-centric composition, high quality 8k resolution, clean and professional aesthetic that emphasizes the clothing item above all else.`,
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

            // Extract usage metadata for cost tracking
            const usageMetadata = data.usageMetadata || {}
            const promptTokens = usageMetadata.promptTokenCount || 0
            const candidatesTokens = usageMetadata.candidatesTokenCount || 0
            const totalTokens = usageMetadata.totalTokenCount || 0

            // Calculate approximate cost (Gemini 2.5 Flash: $0.30/1M input, $2.50/1M output)
            const inputCost = (promptTokens / 1_000_000) * 0.30
            const outputCost = (candidatesTokens / 1_000_000) * 2.50
            const totalCost = inputCost + outputCost

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
                tokens: {
                    prompt: promptTokens,
                    candidates: candidatesTokens,
                    total: totalTokens,
                },
                cost: {
                    input: `$${inputCost.toFixed(6)}`,
                    output: `$${outputCost.toFixed(6)}`,
                    total: `$${totalCost.toFixed(6)}`,
                },
            })

            return {
                imageUrl,
                prompt,
                generationTimeMs,
                tokens: {
                    prompt: promptTokens,
                    candidates: candidatesTokens,
                    total: totalTokens,
                },
                cost: {
                    input: inputCost,
                    output: outputCost,
                    total: totalCost,
                },
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
        requests: Array<{
            outputType: OutputType
            referenceImageBase64: string
        }>
    ): Promise<GenerationResult[]> {
        logger.info('Generating multiple images with reference', {
            requestCount: requests.length,
        })

        const results = await Promise.all(
            requests.map(req =>
                this.generateImage(req.outputType, req.referenceImageBase64)
            )
        )

        return results
    }
}

export const geminiImageService = new GeminiImageService()
