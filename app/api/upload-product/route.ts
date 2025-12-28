import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { logger } from '@/lib/logger'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

// Ensure upload directory exists
async function ensureUploadDir() {
    if (!existsSync(UPLOAD_DIR)) {
        await mkdir(UPLOAD_DIR, { recursive: true })
    }
}

export async function POST(request: NextRequest) {
    try {
        await ensureUploadDir()

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

            // Generate unique filename
            const timestamp = Date.now()
            const randomStr = Math.random().toString(36).substring(7)
            const extension = file.name.split('.').pop()
            const filename = `${timestamp}_${randomStr}.${extension}`
            const filepath = path.join(UPLOAD_DIR, filename)

            // Save file
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            await writeFile(filepath, buffer)

            const fileUrl = `/uploads/${filename}`

            uploadedFiles.push({
                id: `${timestamp}_${randomStr}`,
                filename,
                url: fileUrl,
                size: file.size,
                type: file.type,
            })

            logger.info('File uploaded successfully', {
                filename,
                size: file.size,
                type: file.type,
            })
        }

        return NextResponse.json({
            success: true,
            files: uploadedFiles,
        })
    } catch (error: any) {
        logger.error('Error uploading files', { error: error.message })
        return NextResponse.json(
            { error: 'Failed to upload files' },
            { status: 500 }
        )
    }
}
