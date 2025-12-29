'use client'

import { useState } from 'react'
import { X, Download, Instagram, ShoppingBag, Loader2 } from 'lucide-react'
import { IMAGE_FORMATS } from '@/types/imageFormats'

interface DownloadModalProps {
    imageUrl: string
    isOpen: boolean
    onClose: () => void
}

export function DownloadModal({ imageUrl, isOpen, onClose }: DownloadModalProps) {
    const [downloading, setDownloading] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleDownload = async (formatKey: string) => {
        setDownloading(formatKey)
        setError(null)

        try {
            const response = await fetch('/api/resize-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl, format: formatKey }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to download image')
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${formatKey}.jpg`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        } catch (err: any) {
            console.error('Download failed:', err)
            setError(err.message || 'Falha ao baixar imagem')
        } finally {
            setDownloading(null)
        }
    }

    if (!isOpen) return null

    const instagramFormats = Object.entries(IMAGE_FORMATS).filter(([key]) =>
        key.startsWith('instagram')
    )
    const marketplaceFormats = Object.entries(IMAGE_FORMATS).filter(
        ([key]) => !key.startsWith('instagram')
    )

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Baixar Imagem</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {/* Preview */}
                <div className="mb-6">
                    <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full max-h-64 object-contain rounded-lg border"
                    />
                </div>

                {/* Instagram Formats */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                        <Instagram className="w-5 h-5 text-pink-600" />
                        Instagram
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {instagramFormats.map(([key, format]) => (
                            <button
                                key={key}
                                onClick={() => handleDownload(key)}
                                disabled={downloading !== null}
                                className="p-4 border-2 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-medium text-left">{format.name}</div>
                                    {downloading === key ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-pink-600" />
                                    ) : (
                                        <Download className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                                <div className="text-sm text-gray-500 text-left">
                                    {format.width}x{format.height}
                                </div>
                                <div className="text-xs text-gray-400 text-left mt-1">
                                    {format.width / format.height > 1
                                        ? 'Paisagem'
                                        : format.width / format.height < 1
                                            ? 'Retrato'
                                            : 'Quadrado'}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Marketplace Formats */}
                <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                        Marketplaces
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {marketplaceFormats.map(([key, format]) => (
                            <button
                                key={key}
                                onClick={() => handleDownload(key)}
                                disabled={downloading !== null}
                                className="p-4 border-2 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-medium text-left">{format.name}</div>
                                    {downloading === key ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                    ) : (
                                        <Download className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>
                                <div className="text-sm text-gray-500 text-left">
                                    {format.width}x{format.height}
                                </div>
                                <div className="text-xs text-gray-400 text-left mt-1">
                                    Alta qualidade
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <p className="font-medium mb-1">💡 Dica:</p>
                    <p>
                        Todas as imagens são otimizadas para cada plataforma com qualidade máxima
                        (95%).
                    </p>
                </div>
            </div>
        </div>
    )
}
