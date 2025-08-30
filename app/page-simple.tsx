'use client'

import { useState } from 'react'
import { Code, Trophy, Users, Zap } from 'lucide-react'

export default function Home() {
  const [vibe, setVibe] = useState('professional')

  const vibeContent = {
    professional: {
      title: "Master Technical Interviews",
      subtitle: "Practice algorithms and data structures with industry-standard problems",
      cta: "Start Practicing"
    },
    humorous: {
      title: "Code Like a Comedy Show",
      subtitle: "Debug your way through hilarious problems that'll make you LOL while learning",
      cta: "Let's Get Silly"
    },
    genz: {
      title: "Code Different, Hit Different",
      subtitle: "No cap, these problems will have you coding like a main character fr fr",
      cta: "That's Bussin"
    }
  }

  const currentContent = vibeContent[vibe]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Code className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-800">FeetCode</span>
        </div>
        
        <div className="flex space-x-2">
          {Object.keys(vibeContent).map((vibeKey) => (
            <button
              key={vibeKey}
              onClick={() => setVibe(vibeKey)}
              className={`px-4 py-2 rounded-lg capitalize transition-all ${
                vibe === vibeKey
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {vibeKey}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {currentContent.subtitle}
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
            {currentContent.cta}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Trophy className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
            <p className="text-gray-600">Monitor your improvement with detailed analytics</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Zap className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Live Code Execution</h3>
            <p className="text-gray-600">Execute code in multiple languages with test validation</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Users className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Community</h3>
            <p className="text-gray-600">Connect with developers and share solutions</p>
          </div>
        </div>
      </main>

      <div className="text-center p-8">
        <p className="text-gray-600">
          🎯 <strong>Backend running on:</strong> <a href="http://localhost:5000/api/health" target="_blank" className="text-blue-600">http://localhost:5000</a>
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Database:</strong> Run the SQL script in Supabase to complete setup
        </p>
      </div>
    </div>
  )
}