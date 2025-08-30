'use client'

import React, { useState, useEffect } from 'react'
import { useVibe } from '../../hooks/useVibe'
import ModernNavbar from '../../components/modern/Navbar'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Clock, 
  Users, 
  CheckCircle,
  Circle,
  Star
} from 'lucide-react'

interface Problem {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  solved: boolean
  acceptance_rate: number
  description_professional?: string
  description_humorous?: string
  description_genz?: string
}

export default function ProblemsPage() {
  const { vibe } = useVibe()
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')

  useEffect(() => {
    fetchProblems()
  }, [])

  const fetchProblems = async () => {
    try {
      const response = await fetch('/api/server/problems')
      if (response.ok) {
        const data = await response.json()
        setProblems(data.problems || [])
      }
    } catch (error) {
      console.error('Failed to fetch problems:', error)
      // Fallback to sample data if API fails
      setSampleProblems()
    } finally {
      setLoading(false)
    }
  }

  const setSampleProblems = () => {
    setProblems([
      {
        id: '1',
        title: 'Two Sum',
        difficulty: 'Easy',
        category: 'Array',
        solved: false,
        acceptance_rate: 85.2,
        description_professional: 'Find two numbers that add up to target',
        description_humorous: 'Find two numbers that are BFFs and add up to your target',
        description_genz: 'Find two numbers that hit different when they add up to your target fr'
      },
      {
        id: '2', 
        title: 'Add Two Numbers',
        difficulty: 'Medium',
        category: 'Linked List',
        solved: true,
        acceptance_rate: 67.4,
        description_professional: 'Add two numbers represented as linked lists',
        description_humorous: 'Make two linked lists do math like they\'re in elementary school',
        description_genz: 'These linked lists about to show their math skills no cap'
      },
      {
        id: '3',
        title: 'Longest Substring',
        difficulty: 'Medium', 
        category: 'String',
        solved: false,
        acceptance_rate: 42.8,
        description_professional: 'Find the longest substring without repeating characters',
        description_humorous: 'Find the longest string that doesn\'t repeat itself (unlike your ex)',
        description_genz: 'Find the longest substring that doesn\'t repeat - we stan unique characters'
      },
      {
        id: '4',
        title: 'Valid Parentheses',
        difficulty: 'Easy', 
        category: 'Stack',
        solved: false,
        acceptance_rate: 76.3,
        description_professional: 'Determine if parentheses are properly matched',
        description_humorous: 'Make sure these brackets have proper closure issues resolved',
        description_genz: 'Check if these brackets have healthy boundaries bestie'
      },
      {
        id: '5',
        title: 'Merge Two Sorted Lists',
        difficulty: 'Easy', 
        category: 'Linked List',
        solved: true,
        acceptance_rate: 68.9,
        description_professional: 'Merge two sorted linked lists into one',
        description_humorous: 'Play matchmaker for two very organized lists',
        description_genz: 'Help these sorted lists find their perfect merge moment'
      }
    ])
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success'
      case 'Medium': return 'text-warning'  
      case 'Hard': return 'text-destructive'
      default: return 'text-muted-foreground'
    }
  }

  const getVibeContent = () => {
    const content = {
      professional: {
        title: "Practice Problems",
        subtitle: "Master algorithms and data structures with our curated problem set",
        searchPlaceholder: "Search problems..."
      },
      humorous: {
        title: "Coding Comedy Club",
        subtitle: "Solve problems while having a laugh - debugging has never been this fun!",
        searchPlaceholder: "Find your next coding adventure..."
      },
      genz: {
        title: "Code Different",
        subtitle: "These problems are about to make you the main character of programming fr fr",
        searchPlaceholder: "Search for that coding vibe..."
      }
    }
    return content[vibe as keyof typeof content] || content.professional
  }

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = !searchTerm || (problem.title && problem.title.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesDifficulty = difficultyFilter === 'All' || problem.difficulty === difficultyFilter
    const matchesCategory = categoryFilter === 'All' || problem.category === categoryFilter
    return matchesSearch && matchesDifficulty && matchesCategory
  })

  const currentContent = getVibeContent()

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <ModernNavbar />
        <div className="container mx-auto px-4 py-16">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="animate-shimmer h-16 bg-muted/20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

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

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                  placeholder={currentContent.searchPlaceholder}
                />
              </div>
            </div>
            
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="input w-full md:w-40"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input w-full md:w-40"
            >
              <option value="All">All Categories</option>
              <option value="Array">Array</option>
              <option value="String">String</option>
              <option value="Linked List">Linked List</option>
              <option value="Stack">Stack</option>
              <option value="Tree">Tree</option>
              <option value="Graph">Graph</option>
              <option value="Dynamic Programming">Dynamic Programming</option>
              <option value="Hash Table">Hash Table</option>
              <option value="Matrix">Matrix</option>
              <option value="Binary Search">Binary Search</option>
              <option value="Math">Math</option>
              <option value="Two Pointers">Two Pointers</option>
              <option value="Sliding Window">Sliding Window</option>
              <option value="Backtracking">Backtracking</option>
            </select>
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          {filteredProblems.map((problem) => (
            <Link key={problem.id} href={`/problem/${problem.id}`}>
              <div className="card p-6 hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      {problem.solved ? (
                        <CheckCircle className="h-6 w-6 text-success" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {problem.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {vibe === 'professional' ? problem.description_professional :
                         vibe === 'humorous' ? problem.description_humorous :
                         problem.description_genz}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <span className={`font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-muted-foreground">
                      {problem.category}
                    </span>
                    <span className="text-muted-foreground">
                      {problem.acceptance_rate}%
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No problems found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}