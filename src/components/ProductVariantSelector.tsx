'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

interface VariantOption {
  name: string
  value: string
  available: boolean
  image?: string
}

interface VariantGroup {
  name: string
  type: 'color' | 'size' | 'ram' | 'storage' | 'other'
  options: VariantOption[]
}

interface ProductVariantSelectorProps {
  variants: VariantGroup[]
  onVariantChange: (selectedVariants: Record<string, string>) => void
}

export default function ProductVariantSelector({ variants, onVariantChange }: ProductVariantSelectorProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})

  const handleVariantSelect = (groupName: string, value: string) => {
    const newSelections = { ...selectedVariants, [groupName]: value }
    setSelectedVariants(newSelections)
    onVariantChange(newSelections)
  }

  const getColorDisplay = (value: string) => {
    const colorMap: Record<string, string> = {
      black: '#000000',
      white: '#ffffff',
      silver: '#c0c0c0',
      gray: '#808080',
      red: '#ef4444',
      blue: '#3b82f6',
      green: '#22c55e',
      yellow: '#eab308',
      purple: '#a855f7',
      pink: '#ec4899',
      orange: '#f97316',
      brown: '#92400e',
    }
    return colorMap[value.toLowerCase()] || value
  }

  return (
    <div className="space-y-6">
      {variants.map((variantGroup) => (
        <div key={variantGroup.name}>
          <h3 className="text-sm font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {variantGroup.name}
          </h3>
          
          {variantGroup.type === 'color' ? (
            <div className="flex flex-wrap gap-3">
              {variantGroup.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => option.available && handleVariantSelect(variantGroup.name, option.value)}
                  disabled={!option.available}
                  className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                    selectedVariants[variantGroup.name] === option.value
                      ? 'border-blue-600 ring-2 ring-blue-200'
                      : 'border-slate-300 hover:border-slate-400'
                  } ${!option.available ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                  style={{ backgroundColor: getColorDisplay(option.value) }}
                  title={option.name}
                >
                  {selectedVariants[variantGroup.name] === option.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {variantGroup.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => option.available && handleVariantSelect(variantGroup.name, option.value)}
                  disabled={!option.available}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    selectedVariants[variantGroup.name] === option.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                  } ${!option.available ? 'opacity-40 cursor-not-allowed' : ''}`}
                  style={{ fontFamily: 'Fira Code, monospace' }}
                >
                  {option.name}
                  {!option.available && ' (Out of Stock)'}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
