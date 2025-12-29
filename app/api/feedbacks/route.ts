import { NextRequest, NextResponse } from 'next/server'
import { feedbackRepository } from '@/repositories/FeedbackRepository'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            userId,
            generationId,
            outputType,
            rating,
            whatWorked,
            whatToImprove,
            metNeeds,
            additionalComments,
        } = body

        // Validation
        if (!userId || !generationId || !outputType) {
            return NextResponse.json(
                { error: 'userId, generationId, and outputType are required' },
                { status: 400 }
            )
        }

        const feedback = await feedbackRepository.create({
            userId,
            generationId,
            outputType,
            rating,
            whatWorked,
            whatToImprove,
            metNeeds,
            additionalComments,
        })

        return NextResponse.json({
            success: true,
            feedback,
        })
    } catch (error: any) {
        logger.error('Error creating feedback', { error: error.message })
        return NextResponse.json(
            { error: 'Failed to create feedback' },
            { status: 500 }
        )
    }
}
