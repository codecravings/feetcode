'use client'

import React, { useState, useEffect } from 'react'
import { useVibe } from '../hooks/useVibe'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  animation?: 'pulse' | 'wave' | 'shimmer'
  lines?: number
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  animation = 'shimmer',
  lines = 1
}: SkeletonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full aspect-square'
      case 'text':
        return 'rounded h-4'
      case 'card':
        return 'rounded-xl h-32'
      default:
        return 'rounded-lg'
    }
  }

  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse bg-muted/40'
      case 'wave':
        return 'animate-bounce bg-muted/30'
      case 'shimmer':
        return 'animate-shimmer bg-gradient-to-r from-muted/20 via-muted/40 to-muted/20 bg-[length:200%_100%]'
      default:
        return 'animate-pulse bg-muted/40'
    }
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${getVariantClasses()} ${getAnimationClasses()}`}
            style={{ width: i === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`${getVariantClasses()} ${getAnimationClasses()} ${className}`} />
  )
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const { vibe } = useVibe()
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4'
      case 'lg':
        return 'w-8 h-8'
      default:
        return 'w-6 h-6'
    }
  }

  const getVibeEmoji = () => {
    switch (vibe) {
      case 'genz':
        return '✨'
      case 'humorous':
        return '🚀'
      default:
        return '⚡'
    }
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${getSizeClasses()} animate-spin rounded-full border-2 border-primary/30 border-t-primary`} />
      <span className="ml-2 text-sm animate-pulse">{getVibeEmoji()}</span>
    </div>
  )
}

interface LoadingCardProps {
  title?: string
  subtitle?: string
  variant?: 'dashboard' | 'problem' | 'submission' | 'leaderboard'
}

export function LoadingCard({ title, subtitle, variant = 'dashboard' }: LoadingCardProps) {
  const { vibe } = useVibe()

  const getVibeContent = () => {
    switch (vibe) {
      case 'genz':
        return {
          loading: 'Loading the tea bestie...',
          processing: 'Processing your main character moment...',
          fetching: 'Fetching your glow up data...'
        }
      case 'humorous':
        return {
          loading: 'Loading awesome stuff...',
          processing: 'Crunching numbers (they taste terrible)...',
          fetching: 'Fetching data from the cloud (it\'s raining bits)...'
        }
      default:
        return {
          loading: 'Loading...',
          processing: 'Processing...',
          fetching: 'Fetching data...'
        }
    }
  }

  const content = getVibeContent()

  const getVariantLayout = () => {
    switch (variant) {
      case 'problem':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" className="w-8 h-8" />
              <Skeleton variant="text" className="flex-1" />
              <Skeleton variant="text" className="w-16" />
            </div>
            <Skeleton variant="text" lines={3} />
            <div className="flex gap-2">
              <Skeleton className="w-20 h-8" />
              <Skeleton className="w-24 h-8" />
            </div>
          </div>
        )
      case 'submission':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" className="w-6 h-6" />
                <Skeleton variant="text" className="w-32" />
              </div>
              <Skeleton variant="text" className="w-20" />
            </div>
            <div className="flex gap-4">
              <Skeleton variant="text" className="w-16" />
              <Skeleton variant="text" className="w-20" />
              <Skeleton variant="text" className="w-24" />
            </div>
          </div>
        )
      case 'leaderboard':
        return (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton variant="text" className="w-8" />
                <Skeleton variant="circular" className="w-10 h-10" />
                <div className="flex-1">
                  <Skeleton variant="text" className="w-24 mb-1" />
                  <Skeleton variant="text" className="w-16 h-3" />
                </div>
                <Skeleton variant="text" className="w-12" />
              </div>
            ))}
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="card" />
              ))}
            </div>
            <Skeleton className="h-64" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && <Skeleton variant="text" className="w-48 h-6 mx-auto mb-2" />}
          {subtitle && <Skeleton variant="text" className="w-64 h-4 mx-auto" />}
        </div>
      )}
      
      {getVariantLayout()}
      
      <div className="mt-6 text-center">
        <LoadingSpinner />
        <p className="text-sm text-muted-foreground mt-2">
          {content.loading}
        </p>
      </div>
    </div>
  )
}

interface PulsingDotProps {
  className?: string
  color?: string
}

export function PulsingDot({ className = '', color = 'bg-primary' }: PulsingDotProps) {
  return (
    <div className={`w-2 h-2 ${color} rounded-full animate-pulse ${className}`} />
  )
}

interface TypewriterTextProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function TypewriterText({ 
  text, 
  speed = 50, 
  className = '',
  onComplete 
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <span className={className}>
      {displayText}
      <span className="animate-blink">|</span>
    </span>
  )
}

interface FloatingElementProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FloatingElement({ children, delay = 0, className = '' }: FloatingElementProps) {
  return (
    <div 
      className={`animate-float ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}