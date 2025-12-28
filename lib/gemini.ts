import { GoogleGenerativeAI } from '@google/generative-ai'
import { logger } from '@/lib/logger'

if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables')
}

// Create base client
const baseClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Wrapper to force v1beta endpoint
export const geminiClient = {
    getGenerativeModel: (config: any) => {
        const model = baseClient.getGenerativeModel(config)

        // Monkey-patch the _url property to use v1beta
        const originalGenerateContent = model.generateContent.bind(model)
        model.generateContent = async function (...args: any[]) {
            // Override the internal URL to use v1beta
            const modelName = config.model
            const v1betaUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`

            // Access internal request method
            const self = this as any
            if (self._requestOptions) {
                self._requestOptions.baseUrl = 'https://generativelanguage.googleapis.com/v1beta'
            }

            return originalGenerateContent(...args)
        }

        return model
    },
}

export default geminiClient
