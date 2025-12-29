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
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title">Baixar Imagem</h2>
                    <button onClick={onClose} className="modal-close">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Error Message */}
                {error && <div className="alert alert-error">{error}</div>}

                {/* Preview */}
                <div className="mb-6">
                    <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full max-h-64 object-contain rounded-lg border"
                        style={{ borderColor: 'var(--color-border-light)' }}
                    />
                </div>

                {/* Instagram Formats */}
                <div className="mb-6">
                    <h3 className="download-section-title">
                        <Instagram className="w-5 h-5 text-pink-600" />
                        Instagram
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {instagramFormats.map(([key, format]) => (
                            <button
                                key={key}
                                onClick={() => handleDownload(key)}
                                disabled={downloading !== null}
                                className="download-format-card"
                                style={{
                                    borderColor:
                                        downloading === key
                                            ? 'var(--color-secondary)'
                                            : undefined,
                                }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="download-format-name">{format.name}</div>
                                    {downloading === key ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-pink-600" />
                                    ) : (
                                        <Download className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                                    )}
                                </div>
                                <div className="download-format-dimensions">
                                    {format.width}x{format.height}
                                </div>
                                <div className="download-format-meta">
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
                    <h3 className="download-section-title">
                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                        Marketplaces
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {marketplaceFormats.map(([key, format]) => (
                            <button
                                key={key}
                                onClick={() => handleDownload(key)}
                                disabled={downloading !== null}
                                className="download-format-card"
                                style={{
                                    borderColor:
                                        downloading === key
                                            ? 'var(--color-accent-blue)'
                                            : undefined,
                                }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="download-format-name">{format.name}</div>
                                    {downloading === key ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                    ) : (
                                        <Download className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                                    )}
                                </div>
                                <div className="download-format-dimensions">
                                    {format.width}x{format.height}
                                </div>
                                <div className="download-format-meta">Alta qualidade</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="alert alert-info mt-6">
                    <p className="text-body-small mb-1">
                        <strong>💡 Dica:</strong>
                    </p>
                    <p className="text-body-small">
                        Todas as imagens são otimizadas para cada plataforma com qualidade máxima
                        (95%).
                    </p>
                </div>
            </div>
        </div>
    )
}
