export interface UploadedFile {
    id: string
    filename: string
    url: string
    size: number
    type: string
}

export interface PhotoSet {
    front: UploadedFile | null
    back: UploadedFile | null
}

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
    user_id?: number
    prompt_tokens?: number
    candidates_tokens?: number
    total_tokens?: number
    input_cost_usd?: number
    output_cost_usd?: number
    total_cost_usd?: number
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
    user_id?: number
    prompt_tokens?: number
    candidates_tokens?: number
    total_tokens?: number
    input_cost_usd?: number
    output_cost_usd?: number
    total_cost_usd?: number
}

export interface ImageGenerationRequest {
    frontImageUrl: string
    backImageUrl?: string
    outputTypes: ('front' | 'back' | 'real_situation')[]
    productDescription?: string
    userId?: number
}

export interface ImageGenerationResponse {
    success: boolean
    images: GeneratedImage[]
    error?: string
}
