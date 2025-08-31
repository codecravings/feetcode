'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useVibe } from '../hooks/useVibe'

interface TypewriterCodeProps {
  code: string
  language?: string
  speed?: number
  showCursor?: boolean
  onComplete?: () => void
  className?: string
  autoStart?: boolean
}

export default function TypewriterCode({
  code,
  language = 'javascript',
  speed = 50,
  showCursor = true,
  onComplete,
  className = '',
  autoStart = true
}: TypewriterCodeProps) {
  const { vibe } = useVibe()
  const [displayedCode, setDisplayedCode] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [isStarted, setIsStarted] = useState(autoStart)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isStarted || isComplete) return

    if (currentIndex < code.length) {
      intervalRef.current = setTimeout(() => {
        setDisplayedCode(prev => prev + code[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
    } else {
      setIsComplete(true)
      if (onComplete) onComplete()
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [currentIndex, code, speed, isStarted, isComplete, onComplete])

  const startTyping = () => {
    setIsStarted(true)
  }

  const resetTyping = () => {
    setDisplayedCode('')
    setCurrentIndex(0)
    setIsComplete(false)
    setIsStarted(false)
  }

  const getVibeStartText = () => {
    switch (vibe) {
      case 'genz':
        return '✨ Start the show bestie'
      case 'humorous':
        return '🚀 Begin the magic!'
      default:
        return '▶ Start typing animation'
    }
  }

  return (
    <div className={`relative ${className}`}>
      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-hidden font-mono text-sm leading-relaxed">
        <code className="block">
          {displayedCode}
          {showCursor && !isComplete && (
            <span className="animate-blink bg-green-400 text-gray-900 px-0.5">|</span>
          )}
        </code>
      </pre>

      {!isStarted && (
        <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center rounded-lg">
          <button
            onClick={startTyping}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {getVibeStartText()}
          </button>
        </div>
      )}

      {isComplete && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={resetTyping}
            className="bg-gray-800 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
          >
            ↻ Replay
          </button>
        </div>
      )}

      {/* Progress indicator */}
      <div className="mt-2">
        <div className="w-full bg-gray-700 rounded-full h-1">
          <div 
            className="bg-green-400 h-1 rounded-full transition-all duration-100"
            style={{ width: `${(currentIndex / code.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{language}</span>
          <span>{currentIndex}/{code.length} chars</span>
        </div>
      </div>
    </div>
  )
}

interface CodeStepByStepProps {
  steps: Array<{
    description: string
    code: string
    highlight?: string
  }>
  className?: string
}

export function CodeStepByStep({ steps, className = '' }: CodeStepByStepProps) {
  const { vibe } = useVibe()
  const [currentStep, setCurrentStep] = useState(0)
  const [stepComplete, setStepComplete] = useState(false)

  const getVibeStepText = (step: number) => {
    switch (vibe) {
      case 'genz':
        return `Step ${step + 1}: Serving looks with code ✨`
      case 'humorous':
        return `Step ${step + 1}: Making magic happen! 🎪`
      default:
        return `Step ${step + 1}: Implementation`
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      setStepComplete(false)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setStepComplete(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {getVibeStepText(currentStep)}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-3 py-1 text-sm bg-muted rounded disabled:opacity-50"
          >
            ← Prev
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="bg-muted/20 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground mb-3">
          {steps[currentStep].description}
        </p>
      </div>

      <TypewriterCode
        code={steps[currentStep].code}
        onComplete={() => setStepComplete(true)}
        autoStart={true}
        key={currentStep}
      />

      <div className="flex justify-center">
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-primary' : 
                index < currentStep ? 'bg-success' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}