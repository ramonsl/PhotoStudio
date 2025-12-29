import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables')
}

// Initialize Gemini client
// Note: We use fetch directly in GeminiImageService for v1beta endpoint access
const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export { geminiClient }
export default geminiClient
