'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

export type OutputType = 'front' | 'back' | 'real_situation'

interface OutputOption {
    type: OutputType
    label: string
    description: string
}

const outputOptions: OutputOption[] = [
    {
        type: 'front',
        label: 'Foto de Frente',
        description: 'Visualização frontal profissional em estúdio',
    },
    {
        type: 'back',
        label: 'Foto de Costa',
        description: 'Visualização traseira do produto',
    },
    {
        type: 'real_situation',
        label: 'Situação Real',
        description: 'Produto em uso em contexto real',
    },
]

interface OutputTypeSelectorProps {
    selectedTypes: OutputType[]
    onSelectionChange: (types: OutputType[]) => void
    maxSelections?: number
}

export default function OutputTypeSelector({
    selectedTypes,
    onSelectionChange,
    maxSelections = 3,
}: OutputTypeSelectorProps) {
    const toggleType = (type: OutputType) => {
        if (selectedTypes.includes(type)) {
            onSelectionChange(selectedTypes.filter(t => t !== type))
        } else {
            if (selectedTypes.length >= maxSelections) {
                return
            }
            onSelectionChange([...selectedTypes, type])
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Selecione os Tipos de Saída
                </h3>
                <p className="text-sm text-gray-600">
                    Escolha até {maxSelections} visualizações (mínimo 1)
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {outputOptions.map(option => {
                    const isSelected = selectedTypes.includes(option.type)
                    const isDisabled = !isSelected && selectedTypes.length >= maxSelections

                    return (
                        <button
                            key={option.type}
                            onClick={() => toggleType(option.type)}
                            disabled={isDisabled}
                            className={`
                relative p-6 rounded-xl border-2 text-left transition-all duration-300
                ${isSelected
                                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                                    : isDisabled
                                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                        : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                                }
              `}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}

                            <h4 className="font-semibold text-gray-800 mb-2">
                                {option.label}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {option.description}
                            </p>
                        </button>
                    )
                })}
            </div>

            {selectedTypes.length === 0 && (
                <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                    ⚠️ Selecione pelo menos um tipo de saída
                </p>
            )}
        </div>
    )
}
