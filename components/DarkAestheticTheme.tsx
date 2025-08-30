'use client'

import { useState } from 'react'
import { Palette, Camera, Download, Instagram } from 'lucide-react'

export default function DarkAestheticTheme() {
  const [selectedTheme, setSelectedTheme] = useState<'neon' | 'cyberpunk' | 'vaporwave' | 'matrix'>('neon')

  const themes = {
    neon: {
      name: 'Neon Dreams 💜',
      gradient: 'from-purple-900 via-pink-900 to-indigo-900',
      accent: 'from-pink-400 to-purple-500',
      description: 'Perfect for Instagram dark mode aesthetics',
      hashtags: '#DarkMode #NeonVibes #CodingAesthetic'
    },
    cyberpunk: {
      name: 'Cyberpunk 2077 🌃',
      gradient: 'from-yellow-400 via-red-500 to-pink-500',
      accent: 'from-cyan-400 to-blue-500',
      description: 'Futuristic coding vibes',
      hashtags: '#Cyberpunk #FutureCoder #TechNoir'
    },
    vaporwave: {
      name: 'Vaporwave Coder 🌴',
      gradient: 'from-pink-500 via-purple-500 to-cyan-400',
      accent: 'from-pink-400 to-cyan-300',
      description: 'Retro-futuristic aesthetic',
      hashtags: '#Vaporwave #RetroTech #AestheticCoding'
    },
    matrix: {
      name: 'Matrix Hacker 💚',
      gradient: 'from-black via-green-900 to-black',
      accent: 'from-green-400 to-green-500',
      description: 'Classic hacker aesthetic',
      hashtags: '#MatrixVibes #HackerAesthetic #GreenCode'
    }
  }

  const generateAestheticPost = () => {
    const theme = themes[selectedTheme]
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return
    
    // Instagram story size
    canvas.width = 1080
    canvas.height = 1920
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1920)
    
    switch(selectedTheme) {
      case 'neon':
        gradient.addColorStop(0, '#581c87')
        gradient.addColorStop(0.5, '#831843')
        gradient.addColorStop(1, '#312e81')
        break
      case 'cyberpunk':
        gradient.addColorStop(0, '#fbbf24')
        gradient.addColorStop(0.5, '#ef4444')
        gradient.addColorStop(1, '#ec4899')
        break
      case 'vaporwave':
        gradient.addColorStop(0, '#ec4899')
        gradient.addColorStop(0.5, '#8b5cf6')
        gradient.addColorStop(1, '#06b6d4')
        break
      case 'matrix':
        gradient.addColorStop(0, '#000000')
        gradient.addColorStop(0.5, '#14532d')
        gradient.addColorStop(1, '#000000')
        break
    }
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1080, 1920)
    
    // Add grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1
    for (let x = 0; x < 1080; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 1920)
      ctx.stroke()
    }
    for (let y = 0; y < 1920; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(1080, y)
      ctx.stroke()
    }
    
    // Add glowing effects
    ctx.shadowColor = selectedTheme === 'matrix' ? '#22c55e' : '#ec4899'
    ctx.shadowBlur = 20
    
    // Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 64px Inter, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('FEETCODE', 540, 300)
    
    // Subtitle
    ctx.font = 'bold 32px Inter, Arial, sans-serif'
    ctx.fillText('CODING WITH PERSONALITY', 540, 360)
    
    // Code snippet
    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.fillRect(60, 500, 960, 600)
    
    // Code lines
    ctx.fillStyle = selectedTheme === 'matrix' ? '#22c55e' : '#ffffff'
    ctx.font = '24px "Fira Code", monospace'
    ctx.textAlign = 'left'
    
    const codeLines = [
      'function solveProblem() {',
      '  const solution = think();',
      '  if (solution.isCorrect()) {',
      '    celebrate(); 🎉',
      '    shareOnSocial();',
      '    return "ACCEPTED";',
      '  }',
      '  return tryAgain();',
      '}'
    ]
    
    let lineY = 560
    codeLines.forEach((line, index) => {
      ctx.fillText(`${index + 1}  ${line}`, 100, lineY)
      lineY += 60
    })
    
    // Stats section
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.fillRect(60, 1200, 960, 200)
    
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 36px Inter, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('47+ PROBLEMS • 15+ CATEGORIES', 540, 1270)
    ctx.fillText('REAL CODE EXECUTION • VIRAL FEATURES', 540, 1320)
    
    // Call to action
    ctx.fillStyle = selectedTheme === 'matrix' ? '#22c55e' : '#ec4899'
    ctx.fillRect(240, 1500, 600, 120)
    
    ctx.fillStyle = '#000000'
    ctx.font = 'bold 48px Inter, Arial, sans-serif'
    ctx.fillText('JOIN NOW', 540, 1580)
    
    // Social handle
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 32px Inter, Arial, sans-serif'
    ctx.fillText('@feetcode.dev', 540, 1750)
    
    // Download
    const link = document.createElement('a')
    link.download = `feetcode-${selectedTheme}-aesthetic.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Dark Aesthetic Themes 🌙✨
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Create viral Instagram stories and posts that coders can't resist
        </p>
      </div>

      {/* Theme selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(themes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => setSelectedTheme(key as any)}
            className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
              selectedTheme === key
                ? 'border-purple-500 shadow-lg shadow-purple-200'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${theme.gradient} mb-3`} />
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              {theme.name}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              {theme.description}
            </p>
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className={`relative p-8 rounded-xl bg-gradient-to-br ${themes[selectedTheme].gradient} text-white overflow-hidden`}>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 gap-1 h-full">
            {[...Array(144)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center">
          <h3 className="text-3xl font-bold mb-2">FEETCODE</h3>
          <p className="text-lg opacity-90 mb-6">CODING WITH PERSONALITY</p>
          
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto mb-6">
            <pre className="text-sm text-left">
{`function solve() {
  return "ACCEPTED"; ✅
}`}
            </pre>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={generateAestheticPost}
              className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${themes[selectedTheme].accent} text-white rounded-lg hover:opacity-90 transition-opacity font-bold`}
            >
              <Download className="w-5 h-5" />
              Download for Insta
            </button>
            
            <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
              <Instagram className="w-5 h-5" />
              Share Story
            </button>
          </div>

          <p className="text-sm opacity-70 mt-4">
            Use hashtags: {themes[selectedTheme].hashtags}
          </p>
        </div>
      </div>

      {/* Instagram tips */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 rounded-lg p-6">
        <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
          📱 Instagram Success Tips:
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>✨ Post during peak hours (7-9 PM)</li>
          <li>🔥 Use trending hashtags: #CodingLife #ProgrammerAesthetic #TechTok</li>
          <li>💯 Add polls: "Which theme is your vibe?"</li>
          <li>👑 Tag developer friends to challenge them</li>
          <li>🚀 Create reels showing your solving streak</li>
          <li>💜 Use dark themes for better engagement in tech community</li>
        </ul>
      </div>
    </div>
  )
}