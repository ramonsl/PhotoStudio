import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const files = formData.getAll('files') as File[]

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No files provided' },
                { status: 400 }
            )
        }

        if (files.length > 2) {
            return NextResponse.json(
                { error: 'Maximum 2 files allowed' },
                { status: 400 }
            )
        }

        const uploadedFiles = []

        for (const file of files) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                return NextResponse.json(
                    { error: `Invalid file type: ${file.type}` },
                    { status: 400 }
                )
            }

            // Validate file size (10MB max)
            const maxSize = 10 * 1024 * 1024
            if (file.size > maxSize) {
                return NextResponse.json(
                    { error: `File too large: ${file.name}. Max size is 10MB` },
                    { status: 400 }
                )
            }

            // Convert file to buffer
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Upload to Cloudinary
            const uploadResult = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'photostudio/uploads',
                        resource_type: 'image',
                        transformation: [
                            { quality: 'auto', fetch_format: 'auto' }
                        ]
                    },
                    (error, result) => {
                        if (error) reject(error)
                        else resolve(result)
                    }
                )

                uploadStream.end(buffer)
            })

            const timestamp = Date.now()
            const randomStr = Math.random().toString(36).substring(7)

            uploadedFiles.push({
                id: `${timestamp}_${randomStr}`,
                filename: file.name,
                url: uploadResult.secure_url,
                size: file.size,
                type: file.type,
                cloudinary_id: uploadResult.public_id,
            })

            logger.info('File uploaded to Cloudinary', {
                filename: file.name,
                size: file.size,
                type: file.type,
                cloudinary_url: uploadResult.secure_url,
            })
        }

        return NextResponse.json({
            success: true,
            files: uploadedFiles,
        })
    } catch (error: any) {
        logger.error('Error uploading files to Cloudinary', { error: error.message })
        return NextResponse.json(
            { error: 'Failed to upload files' },
            { status: 500 }
        )
    }
}
