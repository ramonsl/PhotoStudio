export interface GeneratedImage {
    id: string
    original_photo_url: string
    generated_url: string
    output_type: 'front' | 'back' | 'real_situation'
    prompt_used: string
    product_description?: string
    model_api: string
    generation_time_ms?: number
    created_at: Date
    metadata?: Record<string, any>
}

export interface CreateGeneratedImageInput {
    original_photo_url: string
    generated_url: string
    output_type: 'front' | 'back' | 'real_situation'
    prompt_used: string
    product_description?: string
    model_api?: string
    generation_time_ms?: number
    metadata?: Record<string, any>
}

export interface ImageGenerationRequest {
    imageUrls: string[]
    outputTypes: ('front' | 'back' | 'real_situation')[]
    productDescription?: string
}

export interface ImageGenerationResponse {
    success: boolean
    images: GeneratedImage[]
    error?: string
}
