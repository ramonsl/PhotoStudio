import Link from 'next/link'
import { Camera, Sparkles, Image as ImageIcon } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Camera className="w-8 h-8 text-purple-600" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Photo Studio
                        </h1>
                    </div>
                    <Link
                        href="/studio"
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                        Começar Agora
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-4 py-16">
                <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Powered by Google Gemini AI</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Fotos Profissionais de Produtos com IA
                    </h2>

                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Transforme suas fotos de produtos em imagens de estúdio profissionais.
                        Gere visualizações de frente, costa e em situações reais com apenas alguns cliques.
                    </p>

                    <Link
                        href="/studio"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        <Camera className="w-5 h-5" />
                        Criar Fotos Agora
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-slide-up">
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <ImageIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Foto de Frente</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Visualização frontal profissional do produto em fundo de estúdio com iluminação perfeita.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <ImageIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Foto de Costa</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Visualização traseira do produto para mostrar detalhes e acabamentos posteriores.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                            <Sparkles className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Situação Real</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Produto em uso em contextos reais para marketing e demonstração de aplicação.
                        </p>
                    </div>
                </div>

                {/* How it Works */}
                <div className="mt-24 max-w-4xl mx-auto">
                    <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Como Funciona</h3>
                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                1
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold mb-2">Faça Upload das Fotos</h4>
                                <p className="text-gray-600">Envie 1 ou 2 fotos do seu produto de vestuário.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                2
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold mb-2">Selecione os Tipos de Saída</h4>
                                <p className="text-gray-600">Escolha até 3 visualizações: frente, costa ou situação real.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                3
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold mb-2">Receba Imagens Profissionais</h4>
                                <p className="text-gray-600">A IA gera fotos de estúdio realistas prontas para uso.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t mt-24 py-8 bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>© 2025 Photo Studio - Powered by Google Gemini AI</p>
                </div>
            </footer>
        </div>
    )
}
