'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface UploadedFile {
    id: string
    filename: string
    url: string
    size: number
    type: string
}

interface ImageUploadZoneProps {
    onFilesUploaded: (files: UploadedFile[]) => void
    maxFiles?: number
}

export default function ImageUploadZone({ onFilesUploaded, maxFiles = 2 }: ImageUploadZoneProps) {
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const uploadFiles = async (filesToUpload: File[]) => {
        setIsUploading(true)
        setError(null)

        try {
            const formData = new FormData()
            filesToUpload.forEach(file => formData.append('files', file))

            const response = await fetch('/api/upload-product', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            const newFiles = [...files, ...data.files]
            setFiles(newFiles)
            onFilesUploaded(newFiles)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsUploading(false)
        }
    }

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const droppedFiles = Array.from(e.dataTransfer.files)

        if (files.length + droppedFiles.length > maxFiles) {
            setError(`Máximo de ${maxFiles} arquivos permitidos`)
            return
        }

        await uploadFiles(droppedFiles)
    }, [files, maxFiles])

    const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files
        if (!selectedFiles) return

        const fileArray = Array.from(selectedFiles)

        if (files.length + fileArray.length > maxFiles) {
            setError(`Máximo de ${maxFiles} arquivos permitidos`)
            return
        }

        await uploadFiles(fileArray)
    }

    const removeFile = (id: string) => {
        const newFiles = files.filter(f => f.id !== id)
        setFiles(newFiles)
        onFilesUploaded(newFiles)
    }

    return (
        <div className="space-y-4">
            {/* Upload Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
          ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}
          ${files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    disabled={files.length >= maxFiles || isUploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />

                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                        {isUploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        ) : (
                            <Upload className="w-8 h-8 text-purple-600" />
                        )}
                    </div>

                    <div>
                        <p className="text-lg font-semibold text-gray-700 mb-1">
                            {isUploading ? 'Enviando...' : 'Arraste suas fotos aqui'}
                        </p>
                        <p className="text-sm text-gray-500">
                            ou clique para selecionar (máximo {maxFiles} fotos)
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            JPG, PNG ou WEBP até 10MB
                        </p>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Preview Grid */}
            {files.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                    {files.map(file => (
                        <div key={file.id} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                                <img
                                    src={file.url}
                                    alt={file.filename}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <button
                                onClick={() => removeFile(file.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="mt-2 text-xs text-gray-500 truncate">
                                {file.filename}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
