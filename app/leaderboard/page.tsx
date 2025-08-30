'use client'

import React from 'react'
import { useVibe } from '../../hooks/useVibe'
import ModernNavbar from '../../components/modern/Navbar'
import CompetitiveLeaderboard from '../../components/CompetitiveLeaderboard'

export default function LeaderboardPage() {
  const { vibe } = useVibe()

  return (
    <div className="min-h-screen bg-background">
      <ModernNavbar />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {vibe === 'professional' && 'Global Rankings'}
            {vibe === 'humorous' && 'Hall of Coding Fame'}
            {vibe === 'genz' && 'Who\'s Slaying the Code Game?'}
          </h1>
          <p className="text-muted-foreground">
            {vibe === 'professional' && 'Top performers in algorithmic problem solving'}
            {vibe === 'humorous' && 'These legends are absolutely crushing it!'}
            {vibe === 'genz' && 'These coders are literally the main characters fr fr'}
          </p>
        </div>
        
        <CompetitiveLeaderboard />
      </div>
    </div>
  )
}