'use client'

import { useState, useEffect, createContext, useContext } from 'react'

const VibeContext = createContext()

export function VibeProvider({ children }) {
  const [vibe, setVibe] = useState('professional')

  useEffect(() => {
    const savedVibe = localStorage.getItem('feetcode_vibe')
    if (savedVibe && ['professional', 'humorous', 'genz'].includes(savedVibe)) {
      setVibe(savedVibe)
    }
  }, [])

  const updateVibe = (newVibe) => {
    setVibe(newVibe)
    localStorage.setItem('feetcode_vibe', newVibe)
  }

  const contextValue = {
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

export const VIBES = ['professional', 'humorous', 'genz']
