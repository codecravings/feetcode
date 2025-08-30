'use client'

import { useVibeContent } from '../hooks/useVibe'

interface VibeDisplayProps {
  category: string
  contentKey: string
  variables?: Record<string, any>
  className?: string
  fallback?: string
}

export const VibeDisplay = ({ 
  category, 
  contentKey, 
  variables, 
  className = '',
  fallback = 'Content loading...' 
}: VibeDisplayProps) => {
  const { getContent } = useVibeContent()
  const content = getContent(category, contentKey, variables)
  
  return (
    <span className={className}>
      {content?.message || fallback}
    </span>
  )
}

interface VibeDifficultyProps {
  difficulty: string
  className?: string
}

export const VibeDifficulty = ({ difficulty, className = '' }: VibeDifficultyProps) => {
  const { getDifficultyLabel } = useVibeContent()
  const content = getDifficultyLabel(difficulty)
  
  return (
    <span className={`${content?.color || 'text-gray-600'} ${className}`}>
      {content?.message || difficulty}
    </span>
  )
}

interface VibeExecutionStatusProps {
  status: string
  variables?: Record<string, any>
  className?: string
}

export const VibeExecutionStatus = ({ status, variables, className = '' }: VibeExecutionStatusProps) => {
  const { getExecutionMessage } = useVibeContent()
  const content = getExecutionMessage(status, variables)
  
  const statusColors = {
    running: 'text-blue-600',
    success: 'text-green-600',
    partialSuccess: 'text-yellow-600',
    failure: 'text-red-600',
    timeout: 'text-orange-600',
    error: 'text-red-600'
  }
  
  const colorClass = statusColors[status as keyof typeof statusColors] || 'text-gray-600'
  
  return (
    <span className={`${colorClass} ${className}`}>
      {content?.message || status}
    </span>
  )
}

interface VibeAchievementProps {
  achievement: string
  variables?: Record<string, any>
  className?: string
  showIcon?: boolean
}

export const VibeAchievement = ({ 
  achievement, 
  variables, 
  className = '', 
  showIcon = true 
}: VibeAchievementProps) => {
  const { getAchievementMessage } = useVibeContent()
  const content = getAchievementMessage(achievement, variables)
  
  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-2">
        {showIcon && <span className="text-2xl">🏆</span>}
        <div>
          {content?.title && (
            <h3 className="font-semibold text-yellow-800">{content.title}</h3>
          )}
          <p className="text-yellow-700">{content?.message || achievement}</p>
        </div>
      </div>
    </div>
  )
}

interface VibeNavigationProps {
  nav: string
  className?: string
}

export const VibeNavigation = ({ nav, className = '' }: VibeNavigationProps) => {
  const { getNavigationLabel } = useVibeContent()
  const content = getNavigationLabel(nav)
  
  return (
    <span className={className}>
      {content?.message || nav}
    </span>
  )
}

interface VibeErrorProps {
  error: string
  className?: string
}

export const VibeError = ({ error, className = '' }: VibeErrorProps) => {
  const { getErrorMessage } = useVibeContent()
  const content = getErrorMessage(error)
  
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-3 ${className}`}>
      <p className="text-red-700">{content?.message || error}</p>
    </div>
  )
}

interface VibeProblemStatusProps {
  status: string
  className?: string
}

export const VibeProblemStatus = ({ status, className = '' }: VibeProblemStatusProps) => {
  const { getContent } = useVibeContent()
  const content = getContent('problemStatus', status)
  
  const statusColors = {
    solved: 'text-green-600 bg-green-100',
    attempted: 'text-yellow-600 bg-yellow-100',
    locked: 'text-gray-600 bg-gray-100'
  }
  
  const colorClass = statusColors[status as keyof typeof statusColors] || 'text-gray-600 bg-gray-100'
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      <span className="mr-1">{content?.icon}</span>
      {content?.message || status}
    </span>
  )
}

interface VibeButtonProps {
  category: string
  contentKey: string
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  className?: string
  children?: React.ReactNode
}

export const VibeButton = ({ 
  category, 
  contentKey, 
  onClick, 
  disabled = false,
  variant = 'primary',
  className = '',
  children
}: VibeButtonProps) => {
  const { getContent } = useVibeContent()
  const content = getContent(category, contentKey)
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  }
  
  const variantClass = variants[variant]
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClass} ${className}`}
    >
      {children || content?.action || content?.message || 'Button'}
    </button>
  )
}

export default VibeDisplay