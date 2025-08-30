'use client'

import { useState, useEffect, createContext, useContext } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system')
  const [resolvedTheme, setResolvedTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('feetcode_theme') || 'system'
    setTheme(savedTheme)
    updateResolvedTheme(savedTheme)
  }, [])

  const updateResolvedTheme = (newTheme) => {
    let resolved = newTheme
    if (newTheme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    
    setResolvedTheme(resolved)
    
    // Update the document class
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const changeTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('feetcode_theme', newTheme)
    updateResolvedTheme(newTheme)
  }

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => updateResolvedTheme('system')
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const contextValue = {
    theme,
    resolvedTheme,
    setTheme: changeTheme
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}