'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { getVibeContent, interpolateMessage, Vibe } from '../utils/vibeContent'

interface VibeContextType {
  vibe: Vibe
  setVibe: (vibe: Vibe) => void
  getContent: (category: string, key: string, variables?: Record<string, any>) => any
  isLoading: boolean
}

const VibeContext = createContext<VibeContextType | undefined>(undefined)

interface VibeProviderProps {
  children: ReactNode
  initialVibe?: Vibe
}

export function VibeProvider({ children, initialVibe = 'professional' }: VibeProviderProps) {
  const [vibe, setVibe] = useState<Vibe>(initialVibe)
  const [isLoading, setIsLoading] = useState(true)

  // Load user's preferred vibe from localStorage or API
  useEffect(() => {
    const loadUserVibe = async () => {
      try {
        // Check localStorage first
        const savedVibe = localStorage.getItem('feetcode_vibe') as Vibe
        if (savedVibe && ['professional', 'humorous', 'genz'].includes(savedVibe)) {
          setVibe(savedVibe)
        }

        // Check if user is authenticated and has a preference
        const token = localStorage.getItem('feetcode_token')
        if (token) {
          try {
            const response = await fetch('/api/server/auth/me', {
              headers: { Authorization: `Bearer ${token}` }
            })
            
            if (response.ok) {
              const data = await response.json()
              if (data.user?.preferredVibe) {
                setVibe(data.user.preferredVibe)
                localStorage.setItem('feetcode_vibe', data.user.preferredVibe)
              }
            }
          } catch (error) {
            console.error('Failed to load user vibe preference:', error)
          }
        }
      } catch (error) {
        console.error('Error loading vibe preference:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserVibe()
  }, [])

  // Save vibe preference when it changes
  const updateVibe = async (newVibe: Vibe) => {
    setVibe(newVibe)
    localStorage.setItem('feetcode_vibe', newVibe)

    // Update user preference if authenticated
    const token = localStorage.getItem('feetcode_token')
    if (token) {
      try {
        await fetch('/api/server/auth/preferences', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ preferredVibe: newVibe })
        })
      } catch (error) {
        console.error('Failed to update vibe preference:', error)
      }
    }
  }

  // Helper function to get vibe-specific content
  const getContent = (category: string, key: string, variables?: Record<string, any>) => {
    const content = getVibeContent(category, key, vibe)
    return variables ? interpolateMessage(content, variables) : content
  }

  const value: VibeContextType = {
    vibe,
    setVibe: updateVibe,
    getContent,
    isLoading
  }

  return (
    <VibeContext.Provider value={value}>
      {children}
    </VibeContext.Provider>
  )
}

// Custom hook to use vibe context
export const useVibe = () => {
  const context = useContext(VibeContext)
  if (context === undefined) {
    throw new Error('useVibe must be used within a VibeProvider')
  }
  return context
}

// Hook for components that need vibe content
export const useVibeContent = () => {
  const { vibe, getContent } = useVibe()
  
  return {
    vibe,
    // Common content getters for convenience
    getExecutionMessage: (status: string, variables?: Record<string, any>) => 
      getContent('execution', status, variables),
    
    getDifficultyLabel: (difficulty: string) => 
      getContent('difficulty', difficulty),
    
    getAchievementMessage: (achievement: string, variables?: Record<string, any>) => 
      getContent('achievements', achievement, variables),
    
    getNavigationLabel: (nav: string) => 
      getContent('navigation', nav),
    
    getErrorMessage: (error: string) => 
      getContent('errors', error),
    
    getSubmissionMessage: (status: string) => 
      getContent('submission', status),
    
    getSocialLabel: (social: string) => 
      getContent('social', social),
    
    // Generic content getter
    getContent
  }
}

// Simple hook for just getting the current vibe
export const useCurrentVibe = () => {
  const { vibe } = useVibe()
  return vibe
}

// Hook for vibe switching components
export const useVibeSwitcher = () => {
  const { vibe, setVibe, isLoading } = useVibe()
  
  const vibeOptions = [
    { 
      id: 'professional' as Vibe, 
      name: 'Professional',
      description: 'Clean, technical language for serious coding',
      emoji: '💼'
    },
    { 
      id: 'humorous' as Vibe, 
      name: 'Humorous',
      description: 'Funny, witty comments to make coding fun',
      emoji: '😂'
    },
    { 
      id: 'genz' as Vibe, 
      name: 'Gen Z',
      description: 'Modern slang and relatable vibes',
      emoji: '💅'
    }
  ]
  
  return {
    currentVibe: vibe,
    setVibe,
    vibeOptions,
    isLoading
  }
}

export default useVibe