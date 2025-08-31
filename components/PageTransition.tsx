'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)
  const pathname = usePathname()

  useEffect(() => {
    setIsLoading(true)
    
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsLoading(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <div className="relative min-h-screen">
      {/* Page Transition Overlay */}
      <div className={`fixed inset-0 z-50 pointer-events-none transition-all duration-300 ${
        isLoading 
          ? 'opacity-100 bg-gradient-to-br from-purple-600/10 to-pink-600/10 backdrop-blur-sm' 
          : 'opacity-0'
      }`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Animated loading ring */}
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              {/* Inner pulsing dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Page Content with Fade Animation */}
      <div className={`transition-all duration-500 ${
        isLoading 
          ? 'opacity-0 transform translate-y-4 scale-95' 
          : 'opacity-100 transform translate-y-0 scale-100'
      }`}>
        {displayChildren}
      </div>
    </div>
  )
}

export function FadeInSection({ 
  children, 
  delay = 0, 
  className = '',
  direction = 'up'
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  const getTransform = () => {
    switch (direction) {
      case 'down':
        return isVisible ? 'translate-y-0' : '-translate-y-8'
      case 'left':
        return isVisible ? 'translate-x-0' : 'translate-x-8'
      case 'right':
        return isVisible ? 'translate-x-0' : '-translate-x-8'
      default:
        return isVisible ? 'translate-y-0' : 'translate-y-8'
    }
  }

  return (
    <div className={`transition-all duration-700 ease-out ${
      isVisible ? 'opacity-100' : 'opacity-0'
    } ${getTransform()} ${className}`}>
      {children}
    </div>
  )
}

export function SlideInContainer({ 
  children, 
  className = '',
  staggerDelay = 100 
}: {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeInSection delay={index * staggerDelay}>
          {child}
        </FadeInSection>
      ))}
    </div>
  )
}