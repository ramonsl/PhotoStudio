export interface ImageFormat {
    name: string
    width: number
    height: number
    fit: 'cover' | 'contain' | 'fill'
}

export const IMAGE_FORMATS: Record<string, ImageFormat> = {
    'instagram-story': {
        name: 'Instagram Story',
        width: 1080,
        height: 1920,
        fit: 'cover',
    },
    'instagram-post': {
        name: 'Instagram Post',
        width: 1080,
        height: 1080,
        fit: 'cover',
    },
    'instagram-portrait': {
        name: 'Instagram Retrato',
        width: 1080,
        height: 1350,
        fit: 'cover',
    },
    mercadolivre: {
        name: 'Mercado Livre',
        width: 1200,
        height: 1200,
        fit: 'contain',
    },
    shopee: {
        name: 'Shopee',
        width: 1024,
        height: 1024,
        fit: 'contain',
    },
    amazon: {
        name: 'Amazon',
        width: 2000,
        height: 2000,
        fit: 'contain',
    },
}
