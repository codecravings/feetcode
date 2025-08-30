'use client'

import { useState } from 'react'
import { Download, Share2, Copy, Instagram } from 'lucide-react'

interface ShareableCodeCardProps {
  code: string
  problemTitle: string
  difficulty: string
  language: string
  runtime: string
  vibe: 'professional' | 'humorous' | 'genz'
}

export default function ShareableCodeCard({ 
  code, 
  problemTitle, 
  difficulty, 
  language, 
  runtime,
  vibe 
}: ShareableCodeCardProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const vibeColors = {
    professional: 'from-blue-600 to-purple-600',
    humorous: 'from-orange-500 to-pink-500', 
    genz: 'from-pink-500 to-purple-600'
  }

  const vibeEmojis = {
    professional: '💼',
    humorous: '😄',
    genz: '✨'
  }

  const generateShareableImage = async () => {
    setIsGenerating(true)
    
    // Create a canvas to generate the image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return
    
    // Set canvas size for Instagram post (1080x1080)
    canvas.width = 1080
    canvas.height = 1080
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080)
    gradient.addColorStop(0, vibe === 'professional' ? '#3B82F6' : vibe === 'humorous' ? '#F97316' : '#EC4899')
    gradient.addColorStop(1, vibe === 'professional' ? '#8B5CF6' : vibe === 'humorous' ? '#EC4899' : '#8B5CF6')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1080, 1080)
    
    // Dark overlay for readability
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, 1080, 1080)
    
    // Header
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 36px Inter, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${vibeEmojis[vibe]} FeetCode Solution`, 540, 80)
    
    // Problem title
    ctx.font = 'bold 28px Inter, Arial, sans-serif'
    ctx.fillText(problemTitle, 540, 130)
    
    // Difficulty badge
    const difficultyColor = difficulty === 'Easy' ? '#10B981' : difficulty === 'Medium' ? '#F59E0B' : '#EF4444'
    ctx.fillStyle = difficultyColor
    ctx.fillRect(440, 150, 200, 40)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 18px Inter, Arial, sans-serif'
    ctx.fillText(difficulty.toUpperCase(), 540, 175)
    
    // Code container
    ctx.fillStyle = 'rgba(30, 30, 30, 0.9)'
    ctx.fillRect(60, 220, 960, 600)
    
    // Code
    ctx.fillStyle = '#E5E7EB'
    ctx.font = '16px "Fira Code", monospace'
    ctx.textAlign = 'left'
    
    const lines = code.split('\n')
    let lineY = 260
    
    lines.forEach((line, index) => {
      if (lineY < 780) { // Don't overflow
        // Line numbers
        ctx.fillStyle = '#6B7280'
        ctx.fillText(`${index + 1}`.padStart(2, ' '), 80, lineY)
        
        // Code line
        ctx.fillStyle = '#E5E7EB'
        ctx.fillText(line, 140, lineY)
        lineY += 24
      }
    })
    
    // Footer stats
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 20px Inter, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`✅ Accepted | ⚡ ${runtime} | 🔥 ${language}`, 540, 900)
    
    // Branding
    ctx.font = 'bold 24px Inter, Arial, sans-serif'
    ctx.fillText('feetcode.dev', 540, 950)
    
    // Download the image
    const link = document.createElement('a')
    link.download = `feetcode-${problemTitle.replace(/\s+/g, '-').toLowerCase()}.png`
    link.href = canvas.toDataURL()
    link.click()
    
    setIsGenerating(false)
  }

  const shareToSocial = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I solved "${problemTitle}" on FeetCode!`,
          text: `Just crushed this ${difficulty} problem in ${runtime}! 🔥\n\nCheck out FeetCode - coding practice with personality!`,
          url: window.location.href
        })
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      // Copy URL for manual sharing
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
          Share Your Success! 🎉
        </h3>
        <div className="flex gap-2">
          <button
            onClick={generateShareableImage}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Instagram Post
          </button>
          
          <button
            onClick={shareToSocial}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
        <p>✨ Generate a beautiful code image perfect for Instagram stories!</p>
        <p>🚀 Show off your coding skills and inspire others to join FeetCode</p>
        <p>💡 Use hashtags: #FeetCode #CodingLife #LeetCode #ProgrammingChallenge</p>
      </div>
    </div>
  )
}