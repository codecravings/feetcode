'use client'

import { useVibeSwitcher } from '../hooks/useVibe'

interface VibeSwitcherProps {
  className?: string
  showLabels?: boolean
  showDescriptions?: boolean
  layout?: 'horizontal' | 'vertical' | 'dropdown'
}

export default function VibeSwitcher({ 
  className = '',
  showLabels = true,
  showDescriptions = false,
  layout = 'horizontal'
}: VibeSwitcherProps) {
  const { currentVibe, setVibe, vibeOptions, isLoading } = useVibeSwitcher()

  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (layout === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <select
          value={currentVibe}
          onChange={(e) => setVibe(e.target.value as 'professional' | 'humorous' | 'genz')}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {vibeOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.emoji} {option.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    )
  }

  if (layout === 'vertical') {
    return (
      <div className={`space-y-3 ${className}`}>
        {vibeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setVibe(option.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              currentVibe === option.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{option.emoji}</span>
              <div>
                {showLabels && (
                  <div className="font-medium">{option.name}</div>
                )}
                {showDescriptions && (
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    )
  }

  // Default horizontal layout
  return (
    <div className={`flex items-center space-x-1 bg-gray-100 rounded-lg p-1 ${className}`}>
      {vibeOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => setVibe(option.id)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            currentVibe === option.id
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-white hover:text-gray-800'
          }`}
          title={showDescriptions ? option.description : undefined}
        >
          <span>{option.emoji}</span>
          {showLabels && <span>{option.name}</span>}
        </button>
      ))}
    </div>
  )
}

// Specialized vibe switcher for mobile
export function MobileVibeSwitcher({ className = '' }: { className?: string }) {
  return (
    <VibeSwitcher
      layout="dropdown"
      showLabels={true}
      showDescriptions={false}
      className={className}
    />
  )
}

// Specialized vibe switcher for settings page
export function SettingsVibeSwitcher({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Language Style</h3>
      <p className="text-sm text-gray-600 mb-4">
        Choose how you'd like FeetCode to communicate with you
      </p>
      <VibeSwitcher
        layout="vertical"
        showLabels={true}
        showDescriptions={true}
      />
    </div>
  )
}

// Preview component to show what each vibe looks like
export function VibePreview({ className = '' }: { className?: string }) {
  const { vibeOptions } = useVibeSwitcher()

  const previewMessages = {
    professional: "All test cases passed successfully!",
    humorous: "Your code is smoother than my pickup lines! 🎉",
    genz: "That code absolutely slaps! No cap! 🔥"
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900">Preview Different Vibes</h3>
      <div className="grid gap-4">
        {vibeOptions.map((option) => (
          <div key={option.id} className="border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{option.emoji}</span>
              <span className="font-medium">{option.name}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{option.description}</p>
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="text-green-700 text-sm">
                {previewMessages[option.id as keyof typeof previewMessages]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}