'use client'

import React, { useState } from 'react'
import { useVibe } from '../../hooks/useVibe'
import ModernNavbar from '../../components/modern/Navbar'
import CodeTinder from '../../components/modern/CodeTinder'
import FeetCoins from '../../components/modern/FeetCoins'
import { Heart, Coins, Code, Trophy } from 'lucide-react'

export default function FeaturesPage() {
  const { vibe } = useVibe()
  const [activeFeature, setActiveFeature] = useState<'tinder' | 'coins'>('tinder')

  const getVibeContent = () => {
    const content = {
      professional: {
        title: "Platform Features",
        subtitle: "Explore advanced coding practice tools",
        tinderDesc: "Code review and feedback system",
        coinsDesc: "Achievement tracking and rewards"
      },
      humorous: {
        title: "The Fun Zone 🎮",
        subtitle: "Because coding should be entertaining!",
        tinderDesc: "Swipe right for good code, left for... well, you know",
        coinsDesc: "Get paid to code (sort of)"
      },
      genz: {
        title: "Where Coding Gets Spicy ✨",
        subtitle: "These features are about to change your whole coding experience fr",
        tinderDesc: "Find your code soulmate bestie",
        coinsDesc: "Secure the bag while you code 💰"
      }
    }
    return content[vibe as keyof typeof content]
  }

  const currentContent = getVibeContent()

  return (
    <div className="min-h-screen gradient-bg">
      <ModernNavbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {currentContent.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Feature Selector */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setActiveFeature('tinder')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeFeature === 'tinder'
                  ? 'bg-white dark:bg-gray-800 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Heart className="h-5 w-5" />
              <span>Code Tinder</span>
            </button>
            
            <button
              onClick={() => setActiveFeature('coins')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeFeature === 'coins'
                  ? 'bg-white dark:bg-gray-800 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Coins className="h-5 w-5" />
              <span>FeetCoins</span>
            </button>
          </div>
        </div>

        {/* Feature Description */}
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            {activeFeature === 'tinder' ? currentContent.tinderDesc : currentContent.coinsDesc}
          </p>
        </div>

        {/* Feature Display */}
        <div className="max-w-4xl mx-auto">
          {activeFeature === 'tinder' && <CodeTinder />}
          {activeFeature === 'coins' && <FeetCoins />}
        </div>

        {/* Feature Cards Preview */}
        {activeFeature === 'tinder' && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Coming Soon: More Features</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="card p-6 text-center opacity-60">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Chaos Mode</h4>
                <p className="text-muted-foreground text-sm">
                  Random coding pranks to keep you entertained
                </p>
              </div>
              
              <div className="card p-6 text-center opacity-60">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Leaderboards</h4>
                <p className="text-muted-foreground text-sm">
                  Compete with other developers globally
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}