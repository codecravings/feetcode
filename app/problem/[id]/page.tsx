'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useVibe } from '../../../hooks/useVibe.tsx'
import ModernNavbar from '../../../components/modern/Navbar'
import Link from 'next/link'
import { 
  Play, 
  Upload, 
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  Star,
  Lightbulb,
  Code,
  Terminal
} from 'lucide-react'
import MonacoEditor from '@monaco-editor/react'

interface Problem {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  constraints: string[]
  startingCode: {
    javascript: string
    python: string
    java: string
  }
  testCases: Array<{
    input: string
    expectedOutput: string
  }>
}

interface TestResult {
  passed: boolean
  input: string
  expected: string
  actual: string
  runtime?: number
}

export default function ProblemPage() {
  const params = useParams()
  const { vibe } = useVibe()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetchProblem()
  }, [params.id, vibe])

  const fetchProblem = async () => {
    try {
      const response = await fetch(`/api/server/problems/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProblem(data.problem)
        setCode(data.problem.startingCode[selectedLanguage])
      }
    } catch (error) {
      console.error('Failed to fetch problem:', error)
      // Fallback to sample problem
      setSampleProblem()
    } finally {
      setLoading(false)
    }
  }

  const setSampleProblem = () => {
    const sampleProblem: Problem = {
      id: '1',
      title: 'Two Sum',
      difficulty: 'Easy',
      description: getVibeDescription(),
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        },
        {
          input: 'nums = [3,2,4], target = 6',
          output: '[1,2]'
        }
      ],
      constraints: [
        '2 ≤ nums.length ≤ 10⁴',
        '-10⁹ ≤ nums[i] ≤ 10⁹',
        '-10⁹ ≤ target ≤ 10⁹',
        'Only one valid answer exists.'
      ],
      startingCode: {
        javascript: `function twoSum(nums, target) {
    // Your code here
    
}`,
        python: `def two_sum(nums, target):
    # Your code here
    pass`,
        java: `public int[] twoSum(int[] nums, int target) {
    // Your code here
    
}`
      },
      testCases: [
        { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
        { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
        { input: '[3,3], 6', expectedOutput: '[0,1]' }
      ]
    }
    setProblem(sampleProblem)
    setCode(sampleProblem.startingCode[selectedLanguage as keyof typeof sampleProblem.startingCode])
  }

  const getVibeDescription = () => {
    if (problem?.description) {
      return problem.description // Use the description from the fetched problem
    }
    // Fallback descriptions for Two Sum
    const descriptions = {
      professional: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
      
      humorous: `Alright, math wizards! 🧙‍♂️ We've got an array of numbers that are feeling pretty lonely, and they want to find their perfect mathematical match!

Your mission (should you choose to accept it, and you really should because this is a coding interview): Find two numbers in this array that, when they hold hands and add themselves together, equal our target number.

Rules of engagement:
- Each number can only be used once (no double-dipping!)
- There's exactly one solution (no need to overthink it, unlike your last relationship)
- Return the positions of these mathematical soulmates`,

      genz: `Bestie, we're about to play matchmaker for some numbers! 💅✨

So like, you've got this array of numbers just vibing, and you need to find the TWO numbers that are literally perfect for each other - they add up to make your target number fr fr.

The tea ☕:
- Each number can only be picked once (we don't do toxic relationships here)
- There's exactly one solution (no cap, the problem said so)
- Just return where these numbers live in the array (their indices, bestie)

This is giving main character energy - you got this! 💪`
    }
    return descriptions[vibe as keyof typeof descriptions] || descriptions.professional
  }

  const runCode = async () => {
    if (!problem) return
    
    setIsRunning(true)
    setShowResults(true)
    
    try {
      const response = await fetch('/api/server/submissions/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          testCases: problem.testCases.slice(0, 2) // Run first 2 test cases
        })
      })

      const data = await response.json()
      setTestResults(data.results || [])
    } catch (error) {
      console.error('Failed to run code:', error)
      // Mock results for demo
      setTestResults([
        { passed: true, input: '[2,7,11,15], 9', expected: '[0,1]', actual: '[0,1]', runtime: 68 },
        { passed: false, input: '[3,2,4], 6', expected: '[1,2]', actual: 'undefined', runtime: 72 }
      ])
    } finally {
      setIsRunning(false)
    }
  }

  const submitCode = async () => {
    if (!problem) return
    
    setIsSubmitting(true)
    
    try {
      const token = localStorage.getItem('feetcode_token')
      const response = await fetch('/api/server/submissions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId: params.id,
          code,
          language: selectedLanguage
        })
      })

      const data = await response.json()
      if (data.accepted) {
        // Success state
        alert('Accepted! Great job! 🎉')
      } else {
        // Show submission results
        setTestResults(data.results || [])
        setShowResults(true)
      }
    } catch (error) {
      console.error('Failed to submit code:', error)
      alert('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    if (problem) {
      setCode(problem.startingCode[language as keyof typeof problem.startingCode])
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success'
      case 'Medium': return 'text-warning'  
      case 'Hard': return 'text-destructive'
      default: return 'text-muted-foreground'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <ModernNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-shimmer h-8 bg-muted/20 rounded mb-4" />
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="animate-shimmer h-32 bg-muted/20 rounded-xl" />
              <div className="animate-shimmer h-48 bg-muted/20 rounded-xl" />
            </div>
            <div className="animate-shimmer h-96 bg-muted/20 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-screen gradient-bg">
        <ModernNavbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Problem Not Found</h1>
          <Link href="/problems" className="btn-primary">
            Back to Problems
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <ModernNavbar />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/problems" className="btn-secondary p-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{problem.title}</h1>
            <div className="flex items-center space-x-4 text-sm">
              <span className={`font-medium ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>1.2M</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <ThumbsUp className="h-4 w-4" />
                <span>85%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="space-y-6">
            <div className="card p-6">
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {problem.description}
                </div>
              </div>
            </div>

            {/* Examples */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4 flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>Examples</span>
              </h3>
              <div className="space-y-4">
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-muted/30 p-4 rounded-lg">
                    <div className="font-medium mb-2">Example {index + 1}:</div>
                    <div className="text-sm space-y-1">
                      <div><strong>Input:</strong> {example.input}</div>
                      <div><strong>Output:</strong> {example.output}</div>
                      {example.explanation && (
                        <div><strong>Explanation:</strong> {example.explanation}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Constraints */}
            <div className="card p-6">
              <h3 className="font-semibold mb-3">Constraints</h3>
              <ul className="text-sm space-y-1">
                {problem.constraints.map((constraint, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-muted-foreground">•</span>
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Code Editor */}
          <div className="space-y-4">
            {/* Language Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="input"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>{isRunning ? 'Running...' : 'Run'}</span>
                </button>
                <button
                  onClick={submitCode}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                </button>
              </div>
            </div>

            {/* Editor */}
            <div className="card p-0 overflow-hidden" style={{ height: '400px' }}>
              <MonacoEditor
                height="400px"
                language={selectedLanguage === 'javascript' ? 'javascript' : selectedLanguage}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            </div>

            {/* Test Results */}
            {showResults && (
              <div className="card p-6">
                <h3 className="font-semibold mb-4 flex items-center space-x-2">
                  <Terminal className="h-5 w-5" />
                  <span>Test Results</span>
                </h3>
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        result.passed
                          ? 'border-success bg-success/10'
                          : 'border-destructive bg-destructive/10'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        {result.passed ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <span className="font-medium">
                          Test Case {index + 1} {result.passed ? 'Passed' : 'Failed'}
                        </span>
                        {result.runtime && (
                          <span className="text-sm text-muted-foreground">
                            ({result.runtime}ms)
                          </span>
                        )}
                      </div>
                      <div className="text-sm space-y-1">
                        <div><strong>Input:</strong> {result.input}</div>
                        <div><strong>Expected:</strong> {result.expected}</div>
                        <div><strong>Actual:</strong> {result.actual}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}