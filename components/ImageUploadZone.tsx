'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { UploadedFile, PhotoSet } from '@/types'

interface ImageUploadZoneProps {
    onFilesUploaded: (photos: PhotoSet) => void
}

export default function ImageUploadZone({ onFilesUploaded }: ImageUploadZoneProps) {
    const [frontPhoto, setFrontPhoto] = useState<UploadedFile | null>(null)
    const [backPhoto, setBackPhoto] = useState<UploadedFile | null>(null)
    const [isUploadingFront, setIsUploadingFront] = useState(false)
    const [isUploadingBack, setIsUploadingBack] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const notifyParent = useCallback((front: UploadedFile | null, back: UploadedFile | null) => {
        onFilesUploaded({ front, back })
    }, [onFilesUploaded])

    const uploadFile = async (file: File, photoType: 'front' | 'back') => {
        const setIsUploading = photoType === 'front' ? setIsUploadingFront : setIsUploadingBack
        setIsUploading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('files', file)

            const response = await fetch('/api/upload-product', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            const uploadedFile = data.files[0]

            if (photoType === 'front') {
                setFrontPhoto(uploadedFile)
                notifyParent(uploadedFile, backPhoto)
            } else {
                setBackPhoto(uploadedFile)
                notifyParent(frontPhoto, uploadedFile)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsUploading(false)
        }
    }

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>, photoType: 'front' | 'back') => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return
        await uploadFile(selectedFile, photoType)
        // Reset input
        e.target.value = ''
    }

    const handleDrop = async (e: React.DragEvent, photoType: 'front' | 'back') => {
        e.preventDefault()
        const droppedFile = e.dataTransfer.files[0]
        if (!droppedFile) return
        await uploadFile(droppedFile, photoType)
    }

    const removePhoto = (photoType: 'front' | 'back') => {
        if (photoType === 'front') {
            setFrontPhoto(null)
            notifyParent(null, backPhoto)
        } else {
            setBackPhoto(null)
            notifyParent(frontPhoto, null)
        }
    }

    const renderUploadZone = (
        photoType: 'front' | 'back',
        label: string,
        photo: UploadedFile | null,
        isUploading: boolean,
        required: boolean = false
    ) => {
        const [isDragging, setIsDragging] = useState(false)

        return (
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">{label}</h4>
                    {required && <span className="text-xs text-red-500">*obrigatória</span>}
                    {!required && <span className="text-xs text-gray-400">opcional</span>}
                </div>

                {!photo ? (
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
                        onDrop={(e) => { handleDrop(e, photoType); setIsDragging(false) }}
                        className={`
                            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                            ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}
                            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        `}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileInput(e, photoType)}
                            disabled={isUploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />

                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                {isUploading ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                                ) : (
                                    <Upload className="w-6 h-6 text-purple-600" />
                                )}
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                    {isUploading ? 'Enviando...' : 'Arraste a foto aqui'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    ou clique para selecionar
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-300 bg-gray-100">
                            <img
                                src={photo.url}
                                alt={photo.filename}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <button
                            onClick={() => removePhoto(photoType)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="mt-2 text-xs text-gray-500 truncate">
                            {photo.filename}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Upload Zones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderUploadZone('front', 'Foto de Frente', frontPhoto, isUploadingFront, true)}
                {renderUploadZone('back', 'Foto de Costas', backPhoto, isUploadingBack, false)}
            </div>

            {/* Helper Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                    💡 <strong>Dica:</strong> A foto de frente é obrigatória. A foto de costas é opcional, mas se não for enviada,
                    apenas as imagens de frente serão geradas.
                </p>
            </div>
        </div>
    )
}
