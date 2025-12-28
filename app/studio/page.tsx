'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Camera, ArrowLeft, Sparkles } from 'lucide-react'
import ImageUploadZone from '@/components/ImageUploadZone'
import OutputTypeSelector, { OutputType } from '@/components/OutputTypeSelector'
import GeneratedImageGallery from '@/components/GeneratedImageGallery'
import { GeneratedImage } from '@/types'

interface UploadedFile {
    id: string
    filename: string
    url: string
    size: number
    type: string
}

export default function StudioPage() {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [selectedOutputTypes, setSelectedOutputTypes] = useState<OutputType[]>([])
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const canGenerate = uploadedFiles.length > 0 &&
        selectedOutputTypes.length > 0

    const handleGenerate = async () => {
        if (!canGenerate) return

        setIsGenerating(true)
        setError(null)

        try {
            const response = await fetch('/api/generate-studio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageUrls: uploadedFiles.map(f => f.url),
                    outputTypes: selectedOutputTypes,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Falha ao gerar imagens')
            }

            setGeneratedImages(data.images)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Voltar</span>
                        </Link>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <div className="flex items-center gap-2">
                            <Camera className="w-6 h-6 text-purple-600" />
                            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Photo Studio
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-bold mb-4 text-gray-800">
                        Gere Fotos Profissionais de Produtos
                    </h2>
                    <p className="text-lg text-gray-600">
                        Faça upload da foto do produto e selecione os tipos de visualização desejados
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Step 1: Upload */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                1
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                Upload das Fotos
                            </h3>
                        </div>
                        <ImageUploadZone onFilesUploaded={setUploadedFiles} maxFiles={2} />
                    </div>

                    {/* Step 2: Output Types */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                2
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                Tipos de Visualização
                            </h3>
                        </div>
                        <OutputTypeSelector
                            selectedTypes={selectedOutputTypes}
                            onSelectionChange={setSelectedOutputTypes}
                            maxSelections={3}
                        />
                    </div>

                    {/* Generate Button */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleGenerate}
                            disabled={!canGenerate || isGenerating}
                            className={`
                flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300
                ${canGenerate && !isGenerating
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-2xl hover:scale-105'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }
              `}
                        >
                            {isGenerating ? (
                                <>
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    Gerando Imagens...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-6 h-6" />
                                    Gerar Imagens
                                </>
                            )}
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl">
                            <p className="font-semibold">Erro ao gerar imagens:</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Generated Images */}
                    {(generatedImages.length > 0 || isGenerating) && (
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <GeneratedImageGallery
                                images={generatedImages}
                                isLoading={isGenerating}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
