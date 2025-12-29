import { NextRequest, NextResponse } from 'next/server'
import { userRepository } from '@/repositories/UserRepository'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        // Validation
        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            )
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            )
        }

        const user = await userRepository.findOrCreate(email.toLowerCase().trim())

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
            },
        })
    } catch (error: any) {
        logger.error('Error creating/finding user', { error: error.message })
        return NextResponse.json(
            { error: 'Failed to process user' },
            { status: 500 }
        )
    }
}
