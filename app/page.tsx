import Link from 'next/link'
import { Camera, Sparkles, Image as ImageIcon, TrendingUp, Shield, Zap, AlertCircle } from 'lucide-react'

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
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-6">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-700">Projeto em Teste - Validação de Negócio</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Fotos Profissionais para E-commerce
                    </h2>

                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Gere imagens profissionais de produtos com IA. Sem custos de fotógrafo, sem problemas de direitos autorais.
                        <br />
                        <strong className="text-purple-600">100% suas imagens, 100% legais para uso comercial.</strong>
                    </p>

                    <Link
                        href="/studio"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        <Camera className="w-5 h-5" />
                        Testar Gratuitamente
                    </Link>
                </div>

                {/* Benefits Grid */}
                <div className="mb-16">
                    <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
                        Por Que Boas Fotos Vendem Mais?
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">+40% de Conversão</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Produtos com fotos profissionais convertem até 40% mais que fotos amadoras.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Mais Confiança</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Fotos profissionais transmitem credibilidade e aumentam a confiança do cliente.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Menos Devoluções</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Imagens claras e detalhadas reduzem devoluções por expectativa não atendida.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16 animate-slide-up">
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
                <div className="mt-24 max-w-4xl mx-auto mb-24">
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
                                <p className="text-gray-600">A IA gera fotos de estúdio realistas prontas para uso comercial.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Problem Section */}
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
                    <div className="flex gap-4">
                        <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-xl font-bold text-red-900 mb-2">
                                ⚠️ Problema: Direitos Autorais em E-commerce
                            </h3>
                            <p className="text-red-800 mb-3">
                                Lojistas <strong>NÃO PODEM</strong> usar fotos de terceiros sem autorização. Isso inclui:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-red-800">
                                <li>Fotos de fornecedores sem permissão expressa</li>
                                <li>Imagens da internet ou redes sociais</li>
                                <li>Fotos de outros e-commerces</li>
                            </ul>
                            <p className="text-red-900 font-semibold mt-3">
                                💰 Usar fotos sem autorização pode resultar em processos e multas de até R$ 10.000 por imagem!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Solution Section */}
                <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 mb-16 max-w-4xl mx-auto">
                    <div className="flex gap-4">
                        <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="text-xl font-bold text-green-900 mb-2">
                                ✅ Solução: Gere Suas Próprias Fotos Profissionais
                            </h3>
                            <p className="text-green-800 mb-3">
                                Com o Photo Studio, você:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-green-800">
                                <li><strong>Cria suas próprias imagens</strong> - 100% de propriedade</li>
                                <li><strong>Sem custos de fotógrafo</strong> - Economia de milhares de reais</li>
                                <li><strong>Sem problemas legais</strong> - Todas as imagens são suas</li>
                                <li><strong>Qualidade profissional</strong> - Fotos de estúdio em segundos</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Beta Notice */}
                <div className="mt-16 max-w-4xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-blue-900 mb-2">📢 Projeto em Validação</h4>
                    <p className="text-blue-800">
                        Este é um <strong>projeto de validação de negócio</strong>. Estamos testando a viabilidade da solução
                        e coletando feedback de usuários reais. Sua opinião é muito importante para nós!
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t mt-24 py-8 bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>© 2025 Photo Studio - Validação de Negócio</p>
                    <p className="text-sm mt-2">Gere fotos profissionais legalmente para seu e-commerce</p>
                </div>
            </footer>
        </div>
    )
}
