'use client'

import { Download, Loader2 } from 'lucide-react'
import { GeneratedImage } from '@/types'

interface GeneratedImageGalleryProps {
    images: GeneratedImage[]
    isLoading?: boolean
    onImageClick?: (image: GeneratedImage) => void
}

const outputTypeLabels: Record<string, string> = {
    front: 'Frente',
    back: 'Costa',
    real_situation: 'Situação Real',
}

export default function GeneratedImageGallery({
    images,
    isLoading = false,
    onImageClick,
}: GeneratedImageGalleryProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Gerando Imagens...
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (images.length === 0) {
        return null
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Imagens Geradas
                </h3>
                <p className="text-gray-600">
                    {images.length} {images.length === 1 ? 'imagem gerada' : 'imagens geradas'} com sucesso
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {images.map(image => (
                    <div
                        key={image.id}
                        onClick={() => onImageClick?.(image)}
                        className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                    >
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                            <img
                                src={image.generated_url}
                                alt={`${outputTypeLabels[image.output_type]} - ${image.product_description}`}
                                className="w-full h-full object-cover"
                            />

                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                <a
                                    href={image.generated_url}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-purple-600 rounded-full p-3 hover:bg-purple-600 hover:text-white"
                                >
                                    <Download className="w-5 h-5" />
                                </a>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                                    {outputTypeLabels[image.output_type]}
                                </span>
                                {image.generation_time_ms && (
                                    <span className="text-xs text-gray-500">
                                        {(image.generation_time_ms / 1000).toFixed(1)}s
                                    </span>
                                )}
                            </div>

                            {image.product_description && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {image.product_description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
