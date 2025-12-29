'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Camera, ArrowLeft, Sparkles, Mail } from 'lucide-react'
import ImageUploadZone from '@/components/ImageUploadZone'
import OutputTypeSelector, { OutputType } from '@/components/OutputTypeSelector'
import GeneratedImageGallery from '@/components/GeneratedImageGallery'
import FeedbackModal from '@/components/FeedbackModal'
import { GeneratedImage } from '@/types'

interface UploadedFile {
    id: string
    filename: string
    url: string
    size: number
    type: string
}

export default function StudioPage() {
    const [email, setEmail] = useState('')
    const [userId, setUserId] = useState<number | null>(null)
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [selectedOutputTypes, setSelectedOutputTypes] = useState<OutputType[]>([])
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [feedbackModal, setFeedbackModal] = useState<{
        isOpen: boolean
        generationId: string
        outputType: string
        imageUrl: string
    } | null>(null)

    const canGenerate = email.trim() !== '' &&
        uploadedFiles.length > 0 &&
        selectedOutputTypes.length > 0

    const handleEmailSubmit = async () => {
        if (!email.trim()) return

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase() }),
            })

            const data = await response.json()

            if (response.ok) {
                setUserId(data.user.id)
            } else {
                setError(data.error || 'Erro ao processar email')
            }
        } catch (err: any) {
            setError('Erro ao processar email')
        }
    }

    const handleGenerate = async () => {
        if (!canGenerate) return

        // Ensure user is registered
        if (!userId) {
            await handleEmailSubmit()
            if (!userId) return
        }

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
                    userId,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Falha ao gerar imagens')
            }

            setGeneratedImages(data.images)

            // Open feedback modal for the first generated image
            if (data.images.length > 0 && userId) {
                const firstImage = data.images[0]
                setFeedbackModal({
                    isOpen: true,
                    generationId: firstImage.id,
                    outputType: firstImage.output_type,
                    imageUrl: firstImage.generated_url,
                })
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleImageClick = (image: GeneratedImage) => {
        if (userId) {
            setFeedbackModal({
                isOpen: true,
                generationId: image.id,
                outputType: image.output_type,
                imageUrl: image.generated_url,
            })
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
                            Voltar
                        </Link>
                        <div className="flex items-center gap-2">
                            <Camera className="w-8 h-8 text-purple-600" />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Photo Studio
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Intro */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-3 text-gray-800">
                            Crie Fotos Profissionais com IA
                        </h2>
                        <p className="text-gray-600">
                            Envie fotos do seu produto e gere imagens profissionais automaticamente.
                            Sem necessidade de descrição, a IA analisa a imagem diretamente.
                        </p>
                    </div>

                    {/* Email Input */}
                    {!userId && (
                        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border border-gray-100">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                        Primeiro, informe seu email
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Precisamos do seu email para entrar em contato e coletar feedback sobre as imagens geradas.
                                    </p>
                                    <div className="flex gap-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
                                            placeholder="seu@email.com"
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                        />
                                        <button
                                            onClick={handleEmailSubmit}
                                            disabled={!email.trim()}
                                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Continuar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {userId && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-green-900">Email confirmado: {email}</p>
                                <p className="text-xs text-green-700">Agora você pode gerar suas imagens!</p>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Upload */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                Faça Upload das Fotos do Produto
                            </h3>
                        </div>
                        <ImageUploadZone
                            onFilesUploaded={setUploadedFiles}
                            maxFiles={2}
                        />
                    </div>

                    {/* Step 2: Select Output Types */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                Selecione os Tipos de Saída
                            </h3>
                        </div>
                        <OutputTypeSelector
                            selectedTypes={selectedOutputTypes}
                            onSelectionChange={setSelectedOutputTypes}
                        />
                    </div>

                    {/* Generate Button */}
                    <div className="flex flex-col items-center gap-4 mb-8">
                        {error && (
                            <div className="w-full bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}
                        <button
                            onClick={handleGenerate}
                            disabled={!canGenerate || isGenerating}
                            className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Gerando Imagens...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Gerar Imagens Profissionais
                                </>
                            )}
                        </button>
                        {!userId && (
                            <p className="text-sm text-gray-500">
                                💡 Informe seu email acima para começar
                            </p>
                        )}
                        {userId && !canGenerate && (
                            <p className="text-sm text-gray-500">
                                💡 Faça upload de fotos e selecione os tipos de saída
                            </p>
                        )}
                    </div>

                    {/* Generated Images */}
                    {generatedImages.length > 0 && (
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <h3 className="text-2xl font-bold mb-6 text-gray-800">
                                Imagens Geradas
                            </h3>
                            <GeneratedImageGallery
                                images={generatedImages}
                                onImageClick={handleImageClick}
                            />
                            <p className="text-sm text-gray-500 mt-4 text-center">
                                💡 Clique em uma imagem para dar feedback
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Feedback Modal */}
            {feedbackModal && userId && (
                <FeedbackModal
                    isOpen={feedbackModal.isOpen}
                    onClose={() => setFeedbackModal(null)}
                    generationId={feedbackModal.generationId}
                    outputType={feedbackModal.outputType}
                    userId={userId}
                    imageUrl={feedbackModal.imageUrl}
                />
            )}
        </div>
    )
}
