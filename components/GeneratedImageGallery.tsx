'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { GeneratedImage } from '@/types'
import { DownloadModal } from './DownloadModal'

interface GeneratedImageGalleryProps {
    images: GeneratedImage[]
    isLoading?: boolean
    onImageClick?: (image: GeneratedImage) => void
}

const outputTypeLabels: Record<string, string> = {
    front: 'Manequim - Frente',
    back: 'Manequim - Costas',
    real_situation_front_male: 'Situação Real (Masculino) - Frente',
    real_situation_back_male: 'Situação Real (Masculino) - Costas',
    real_situation_front_female: 'Situação Real (Feminino) - Frente',
    real_situation_back_female: 'Situação Real (Feminino) - Costas',
}

const getViewLabel = (outputType: string): string => {
    if (outputType.includes('front')) return 'Frente'
    if (outputType.includes('back')) return 'Costas'
    return outputType
}

const getGroupLabel = (outputType: string): string => {
    if (outputType === 'front' || outputType === 'back') return 'Manequim'
    if (outputType.includes('male') && !outputType.includes('female')) return 'Situação Real - Masculino'
    if (outputType.includes('female')) return 'Situação Real - Feminino'
    return 'Situação Real'
}

export default function GeneratedImageGallery({
    images,
    isLoading = false,
    onImageClick,
}: GeneratedImageGalleryProps) {
    const [downloadModal, setDownloadModal] = useState<{
        isOpen: boolean
        imageUrl: string
    }>({
        isOpen: false,
        imageUrl: '',
    })

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Gerando Imagens...
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2].map(i => (
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

    // Group images by type (mannequin, real_male, real_female)
    const groupedImages: Record<string, GeneratedImage[]> = {}
    images.forEach(image => {
        const group = getGroupLabel(image.output_type)
        if (!groupedImages[group]) {
            groupedImages[group] = []
        }
        groupedImages[group].push(image)
    })

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Imagens Geradas
                </h3>
                <p className="text-gray-600">
                    {images.length} {images.length === 1 ? 'imagem gerada' : 'imagens geradas'} com sucesso
                </p>
            </div>

            {Object.entries(groupedImages).map(([groupLabel, groupImages]) => (
                <div key={groupLabel} className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-700 border-b-2 border-purple-200 pb-2">
                        {groupLabel}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-6">
                        {groupImages.map(image => (
                            <div
                                key={image.id}
                                onClick={() => onImageClick?.(image)}
                                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                            >
                                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                    <img
                                        src={image.generated_url}
                                        alt={`${outputTypeLabels[image.output_type]}`}
                                        className="w-full h-full object-cover"
                                    />

                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setDownloadModal({
                                                    isOpen: true,
                                                    imageUrl: image.generated_url,
                                                })
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-purple-600 rounded-full p-3 hover:bg-purple-600 hover:text-white"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                                            {getViewLabel(image.output_type)}
                                        </span>
                                        {image.generation_time_ms && (
                                            <span className="text-xs text-gray-500">
                                                {(image.generation_time_ms / 1000).toFixed(1)}s
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <DownloadModal
                imageUrl={downloadModal.imageUrl}
                isOpen={downloadModal.isOpen}
                onClose={() => setDownloadModal({ isOpen: false, imageUrl: '' })}
            />
        </div>
    )
}
