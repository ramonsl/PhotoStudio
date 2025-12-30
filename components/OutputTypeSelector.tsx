'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'

export type Gender = 'male' | 'female'
export type OutputType = 'front' | 'back' | 'real_situation_front_male' | 'real_situation_back_male' | 'real_situation_front_female' | 'real_situation_back_female'

interface OutputTypeSelectorProps {
    onGenerate: (outputTypes: OutputType[]) => Promise<void>
    isGenerating: boolean
    disabled: boolean
    hasBackPhoto: boolean
}

export default function OutputTypeSelector({
    onGenerate,
    isGenerating,
    disabled,
    hasBackPhoto,
}: OutputTypeSelectorProps) {
    const [includeMannequin, setIncludeMannequin] = useState(false)
    const [includeRealSituation, setIncludeRealSituation] = useState(false)
    const [selectedGenders, setSelectedGenders] = useState<Gender[]>(['male'])

    const toggleGender = (gender: Gender) => {
        if (selectedGenders.includes(gender)) {
            // Não permitir desmarcar se for o único selecionado
            if (selectedGenders.length > 1) {
                setSelectedGenders(selectedGenders.filter(g => g !== gender))
            }
        } else {
            setSelectedGenders([...selectedGenders, gender])
        }
    }

    const handleGenerate = async () => {
        const outputTypes: OutputType[] = []

        // Add mannequin if selected
        if (includeMannequin) {
            outputTypes.push('front')
            if (hasBackPhoto) {
                outputTypes.push('back')
            }
        }

        // Add real situation if selected
        if (includeRealSituation) {
            selectedGenders.forEach(gender => {
                outputTypes.push(`real_situation_front_${gender}` as OutputType)
                if (hasBackPhoto) {
                    outputTypes.push(`real_situation_back_${gender}` as OutputType)
                }
            })
        }

        if (outputTypes.length > 0) {
            await onGenerate(outputTypes)
        }
    }

    const getTotalImages = () => {
        let total = 0
        if (includeMannequin) {
            total += hasBackPhoto ? 2 : 1
        }
        if (includeRealSituation) {
            total += selectedGenders.length * (hasBackPhoto ? 2 : 1)
        }
        return total
    }

    const canGenerate = includeMannequin || includeRealSituation

    return (
        <div className="space-y-6">
            {/* Selection Options */}
            <div className="space-y-4">
                {/* Mannequin Option */}
                <div
                    onClick={() => !disabled && setIncludeMannequin(!includeMannequin)}
                    className={`bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border-2 transition-all cursor-pointer ${includeMannequin
                        ? 'border-purple-500 shadow-md'
                        : 'border-purple-200 hover:border-purple-300'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${includeMannequin
                                ? 'bg-purple-600 border-purple-600'
                                : 'border-gray-300 bg-white'
                                }`}>
                                {includeMannequin && (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                📸 Manequim
                            </h3>
                            <p className="text-sm text-gray-600">
                                Gera {hasBackPhoto ? '2 imagens: frente e costas' : '1 imagem: apenas frente'} em manequim profissional
                            </p>
                            {!hasBackPhoto && (
                                <p className="text-xs text-amber-600 mt-1">
                                    ⚠️ Envie a foto de costas para gerar também a vista traseira
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Real Situation Option */}
                <div
                    onClick={() => !disabled && setIncludeRealSituation(!includeRealSituation)}
                    className={`bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 transition-all cursor-pointer ${includeRealSituation
                        ? 'border-green-500 shadow-md'
                        : 'border-green-200 hover:border-green-300'
                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${includeRealSituation
                                ? 'bg-green-600 border-green-600'
                                : 'border-gray-300 bg-white'
                                }`}>
                                {includeRealSituation && (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                👤 Situação Real
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Gera {selectedGenders.length * (hasBackPhoto ? 2 : 1)} imagens: {hasBackPhoto ? 'frente e costas' : 'apenas frente'} em pessoa real
                            </p>
                            {!hasBackPhoto && (
                                <p className="text-xs text-amber-600 mb-3">
                                    ⚠️ Envie a foto de costas para gerar também a vista traseira
                                </p>
                            )}

                            {/* Gender Selection - Only show when Real Situation is selected */}
                            {includeRealSituation && (
                                <div className="bg-white rounded-lg p-4 mt-3" onClick={(e) => e.stopPropagation()}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Selecione o gênero do modelo:
                                    </label>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => toggleGender('male')}
                                            className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${selectedGenders.includes('male')
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-300 bg-white text-gray-600 hover:border-blue-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-xl">👨</span>
                                                <span>Masculino</span>
                                                {selectedGenders.includes('male') && (
                                                    <span className="text-blue-500">✓</span>
                                                )}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => toggleGender('female')}
                                            className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${selectedGenders.includes('female')
                                                ? 'border-pink-500 bg-pink-50 text-pink-700'
                                                : 'border-gray-300 bg-white text-gray-600 hover:border-pink-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-xl">👩</span>
                                                <span>Feminino</span>
                                                {selectedGenders.includes('female') && (
                                                    <span className="text-pink-500">✓</span>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        💡 Você pode selecionar ambos para gerar 4 imagens
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary and Generate Button */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-sm font-medium text-gray-700">Total de imagens a gerar:</p>
                        <p className="text-2xl font-bold text-purple-700">{getTotalImages()} imagens</p>
                    </div>
                    {canGenerate && (
                        <div className="text-xs text-gray-600">
                            {includeMannequin && <div>✓ Manequim ({hasBackPhoto ? 2 : 1})</div>}
                            {includeRealSituation && (
                                <div>✓ Situação Real ({selectedGenders.length * (hasBackPhoto ? 2 : 1)})</div>
                            )}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={disabled || isGenerating || !canGenerate}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Gerando {getTotalImages()} Imagens...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Gerar {getTotalImages()} {getTotalImages() === 1 ? 'Imagem' : 'Imagens'}
                        </>
                    )}
                </button>

                {!canGenerate && (
                    <p className="text-sm text-amber-600 mt-2 text-center">
                        ⚠️ Selecione pelo menos um tipo de geração
                    </p>
                )}
            </div>
        </div>
    )
}
