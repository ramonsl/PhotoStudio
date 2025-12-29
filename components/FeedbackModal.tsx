'use client'

import { useState } from 'react'
import { X, Star } from 'lucide-react'

interface FeedbackModalProps {
    isOpen: boolean
    onClose: () => void
    generationId: string
    outputType: string
    userId: number
    imageUrl: string
}

export default function FeedbackModal({
    isOpen,
    onClose,
    generationId,
    outputType,
    userId,
    imageUrl,
}: FeedbackModalProps) {
    const [rating, setRating] = useState(0)
    const [metNeeds, setMetNeeds] = useState('')
    const [whatWorked, setWhatWorked] = useState('')
    const [whatToImprove, setWhatToImprove] = useState('')
    const [additionalComments, setAdditionalComments] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/feedbacks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    generationId,
                    outputType,
                    rating: rating || undefined,
                    metNeeds,
                    whatWorked,
                    whatToImprove,
                    additionalComments,
                }),
            })

            if (response.ok) {
                setSubmitted(true)
                setTimeout(() => {
                    onClose()
                    // Reset form
                    setRating(0)
                    setMetNeeds('')
                    setWhatWorked('')
                    setWhatToImprove('')
                    setAdditionalComments('')
                    setSubmitted(false)
                }, 2000)
            }
        } catch (error) {
            console.error('Error submitting feedback:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const outputTypeLabels: Record<string, string> = {
        front: 'Frente',
        back: 'Costa',
        real_situation: 'Situação Real',
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {submitted ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Obrigado pelo Feedback!</h3>
                        <p className="text-gray-600">Sua opinião é muito importante para nós.</p>
                    </div>
                ) : (
                    <>
                        <div className="p-6 border-b flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">Como ficou a imagem?</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Tipo: {outputTypeLabels[outputType] || outputType}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Preview da imagem */}
                            <div className="flex justify-center">
                                <img
                                    src={imageUrl}
                                    alt="Imagem gerada"
                                    className="max-w-xs rounded-lg shadow-lg"
                                />
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Avaliação Geral (opcional)
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Atendeu a necessidade? */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    A imagem atendeu sua necessidade? *
                                </label>
                                <div className="flex gap-3">
                                    {['Sim', 'Parcialmente', 'Não'].map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => setMetNeeds(option)}
                                            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${metNeeds === option
                                                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* O que ficou bom */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    O que ficou bom?
                                </label>
                                <textarea
                                    value={whatWorked}
                                    onChange={(e) => setWhatWorked(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                    placeholder="Ex: A iluminação ficou perfeita, o produto está bem posicionado..."
                                />
                            </div>

                            {/* O que gostaria de mudar */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    O que gostaria de mudar?
                                </label>
                                <textarea
                                    value={whatToImprove}
                                    onChange={(e) => setWhatToImprove(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                    placeholder="Ex: O fundo poderia ser mais neutro, o produto está muito pequeno..."
                                />
                            </div>

                            {/* Comentários adicionais */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comentários adicionais
                                </label>
                                <textarea
                                    value={additionalComments}
                                    onChange={(e) => setAdditionalComments(e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                    placeholder="Qualquer outra observação..."
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Pular
                                </button>
                                <button
                                    type="submit"
                                    disabled={!metNeeds || isSubmitting}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
