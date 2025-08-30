'use client'

import { useState, useEffect } from 'react'
import { useVibe } from '../hooks/useVibe.tsx'
import { 
  Code2, 
  Trophy, 
  Users, 
  Zap, 
  ArrowRight, 
  Check, 
  Star,
  Sparkles,
  Brain,
  Target,
  Rocket,
  PlayCircle
} from 'lucide-react'
import ModernNavbar from '../components/modern/Navbar'

export default function ModernHome() {
  const { vibe } = useVibe()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const vibeContent = {
    professional: {
      title: "Master Technical Interviews",
      subtitle: "Practice algorithms and data structures with industry-standard problems",
      cta: "Start Practicing",
      badge: "Professional Training",
      features: [
        "Industry-standard problems",
        "Comprehensive test coverage",
        "Performance analytics",
        "Interview preparation"
      ]
    },
    humorous: {
      title: "Code Like a Comedy Show",
      subtitle: "Debug your way through hilarious problems that'll make you LOL while learning",
      cta: "Let's Get Silly",
      badge: "Fun Learning",
      features: [
        "Hilarious problem descriptions",
        "Witty feedback messages", 
        "Comedy-themed challenges",
        "Laugh while you learn"
      ]
    },
    genz: {
      title: "Code Different, Hit Different",
      subtitle: "No cap, these problems will have you coding like a main character fr fr",
      cta: "That's Bussin",
      badge: "Built Different",
      features: [
        "Relatable problem descriptions",
        "Modern slang feedback",
        "Trendy UI elements",
        "Main character energy"
      ]
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="animate-shimmer h-16 bg-muted/20" />
        <div className="container mx-auto px-4 py-32">
          <div className="text-center space-y-8">
            <div className="animate-shimmer h-16 bg-muted/20 rounded-xl max-w-4xl mx-auto" />
            <div className="animate-shimmer h-8 bg-muted/20 rounded-lg max-w-2xl mx-auto" />
            <div className="animate-shimmer h-12 bg-muted/20 rounded-lg w-48 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  const currentContent = vibeContent[vibe as keyof typeof vibeContent]

  return (
    <div className="min-h-screen gradient-bg">
      <ModernNavbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float delay-300" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float delay-700" />
        </div>

        <div className="container mx-auto px-4 py-24 lg:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-glow">
              <Sparkles className="h-4 w-4" />
              <span>{currentContent.badge}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
              {currentContent.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              {currentContent.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <button className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                <span>{currentContent.cta}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button className="btn-secondary text-lg px-8 py-4 rounded-xl flex items-center space-x-2 group">
                <PlayCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              {currentContent.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-success flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with modern tools and techniques to give you the best coding practice experience
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Your Progress</h3>
              <p className="text-muted-foreground mb-4">
                Monitor your improvement with detailed analytics, streak tracking, and performance insights across different problem categories.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>Detailed statistics dashboard</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>Streak and consistency tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>Performance analytics</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Live Code Execution</h3>
              <p className="text-muted-foreground mb-4">
                Write, test, and debug your code in real-time with our advanced online code editor supporting multiple programming languages.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>Multi-language support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>Real-time test validation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>Syntax highlighting & autocomplete</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community & Learning</h3>
              <p className="text-muted-foreground mb-4">
                Connect with other developers, share solutions, participate in discussions, and learn from the best practices in the community.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>Discussion forums</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>Solution sharing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-success" />
                  <span>Leaderboards & competitions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Personality Showcase */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Code with Personality
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Switch between different vibes to match your mood and learning style
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {Object.entries(vibeContent).map(([key, content]) => (
              <div
                key={key}
                className={`card p-8 hover:shadow-lg transition-all duration-200 ${
                  vibe === key ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center text-2xl">
                    {key === 'professional' ? '💼' : key === 'humorous' ? '😄' : '💅'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{content.badge}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{key}</p>
                  </div>
                </div>
                <h4 className="font-semibold mb-2">{content.title}</h4>
                <p className="text-muted-foreground text-sm mb-4">{content.subtitle}</p>
                <button className="w-full btn-primary">{content.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Problems Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">1M+</div>
              <div className="text-muted-foreground">Solutions Submitted</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-center space-x-2 text-success">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="font-medium">All Systems Operational</span>
            </div>
            <div className="text-muted-foreground space-y-2">
              <p>
                🎯 <strong>Backend:</strong>{' '}
                <a href="http://localhost:5000/api/health" target="_blank" className="text-primary hover:underline">
                  http://localhost:5000
                </a>{' '}
                ✅
              </p>
              <p>
                💾 <strong>Database:</strong> Supabase Connected ✅
              </p>
              <p>
                🚀 <strong>Status:</strong> Ready for coding practice!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}