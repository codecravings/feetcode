'use client'

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react'

type Vibe = 'professional' | 'humorous' | 'genz'

interface VibeContextType {
  vibe: Vibe
  setVibe: (vibe: Vibe) => void
}

const VibeContext = createContext<VibeContextType | undefined>(undefined)

interface VibeProviderProps {
  children: ReactNode
}

export function VibeProvider({ children }: VibeProviderProps) {
  const [vibe, setVibe] = useState<Vibe>('professional')

                      

  useEffect(() => {
    const savedVibe = localStorage.getItem('feetcode_vibe') as Vibe
    if (savedVibe && ['professional', 'humorous', 'genz'].includes(savedVibe)) {
      setVibe(savedVibe)
    }
  }, [])

  const updateVibe = (newVibe: Vibe) => {
    setVibe(newVibe)
    localStorage.setItem('feetcode_vibe', newVibe)
  }

  const contextValue: VibeContextType = {
    vibe,
    setVibe: updateVibe
  }

  return (
    <VibeContext.Provider value={contextValue}>
      {children}
    </VibeContext.Provider>
  )
}
export function useVibe() {
  const context = useContext(VibeContext)
  if (!context) {
    throw new Error('useVibe must be used within a VibeProvider') 
  }
  return context
}

export const VIBES = ['professional', 'humorous', 'genz'] as const
export type { Vibe }
