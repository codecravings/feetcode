'use client'

import React, { useState, useEffect } from 'react'
import { useVibe } from '../hooks/useVibe'

interface AnimatedProgressProps {
  value: number
  max: number
  label?: string
  color?: 'success' | 'warning' | 'destructive' | 'primary'
  showPercentage?: boolean
  animated?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function AnimatedProgress({ 
  value, 
  max, 
  label, 
  color = 'primary',
  showPercentage = true,
  animated = true,
  className = '',
  size = 'md'
}: AnimatedProgressProps) {
  const { vibe } = useVibe()
  const [animatedValue, setAnimatedValue] = useState(0)
  const percentage = Math.min((value / max) * 100, 100)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedValue(percentage)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setAnimatedValue(percentage)
    }
  }, [percentage, animated])

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'success':
        return {
          bg: 'bg-green-500',
          gradient: 'from-green-400 to-green-600',
          glow: 'shadow-green-500/50'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-500',
          gradient: 'from-yellow-400 to-orange-500',
          glow: 'shadow-yellow-500/50'
        }
      case 'destructive':
        return {
          bg: 'bg-red-500',
          gradient: 'from-red-400 to-red-600',
          glow: 'shadow-red-500/50'
        }
      default:
        return {
          bg: 'bg-primary',
          gradient: 'from-purple-500 to-pink-500',
          glow: 'shadow-primary/50'
        }
    }
  }

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'h-2'
      case 'lg':
        return 'h-4'
      default:
        return 'h-3'
    }
  }

  const colorClasses = getColorClasses(color)
  const sizeClasses = getSizeClasses(size)

  const getVibeLabel = () => {
    if (!label) return null
    
    switch (vibe) {
      case 'genz':
        return label.replace('Progress', 'Glow Up').replace('Complete', 'Slaying') + ' ✨'
      case 'humorous':
        return label + ' (Looking Good!) 😎'
      default:
        return label
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {getVibeLabel() && (
            <span className="font-medium text-foreground">{getVibeLabel()}</span>
          )}
          {showPercentage && (
            <span className="text-muted-foreground font-mono">
              {animated ? Math.round(animatedValue) : Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-muted/30 rounded-full overflow-hidden ${sizeClasses}`}>
        <div
          className={`${sizeClasses} bg-gradient-to-r ${colorClasses.gradient} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
          style={{ 
            width: `${animated ? animatedValue : percentage}%`,
            boxShadow: animatedValue > 0 ? `0 0 10px ${colorClasses.glow}` : 'none'
          }}
        >
          {/* Shimmer effect */}
          {animated && animatedValue > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          )}
        </div>
      </div>
      
      {/* Milestone indicators */}
      {max > 10 && (
        <div className="flex justify-between text-xs text-muted-foreground relative -mt-1">
          {[25, 50, 75].map(milestone => (
            <div 
              key={milestone}
              className={`absolute transition-colors duration-300 ${
                percentage >= milestone ? 'text-primary' : 'text-muted-foreground/50'
              }`}
              style={{ left: `${milestone}%`, transform: 'translateX(-50%)' }}
            >
              •
            </div>
          ))}
        </div>
      )}
    </div>
  )
}