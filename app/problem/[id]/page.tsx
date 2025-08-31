'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useVibe } from '../../../hooks/useVibe'
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
  Terminal,
  Zap,
  Award,
  Activity,
  BarChart,
  Timer,
  HardDrive,
  AlertTriangle,
  TrendingUp
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
  testCase: number
  input: string
  expectedOutput: string
  actualOutput: string
  passed: boolean
  executionTime: number
  memoryUsage?: number
  error?: string
  errorType?: string
}

interface ExecutionSummary {
  status: string
  runtime: string
  memory: string
  testsPassed: string
  message: string
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
  const [executionSummary, setExecutionSummary] = useState<ExecutionSummary | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState<'testcases' | 'result' | 'submissions'>('testcases')

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
    setActiveTab('result')
    
    try {
      const response = await fetch('/api/server/submissions/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          testCases: problem.testCases.slice(0, 3) // Run first 3 test cases
        })
      })

      const data = await response.json()
      setTestResults(data.results || [])
      setExecutionSummary(data.leetcode || null)
    } catch (error) {
      console.error('Failed to run code:', error)
      // Enhanced mock results for demo
      const mockResults = [
        { 
          testCase: 1,
          input: '[2,7,11,15], 9', 
          expectedOutput: '[0,1]', 
          actualOutput: '[0,1]', 
          passed: true,
          executionTime: 68,
          memoryUsage: 12
        },
        { 
          testCase: 2,
          input: '[3,2,4], 6', 
          expectedOutput: '[1,2]', 
          actualOutput: 'undefined', 
          passed: false,
          executionTime: 72,
          error: 'Runtime Error: Cannot read property of undefined'
        }
      ]
      setTestResults(mockResults)
      setExecutionSummary({
        status: 'Wrong Answer',
        runtime: '70ms',
        memory: '12.5KB',
        testsPassed: '1/2',
        message: '1 out of 2 test cases passed. Almost there!'
      })
    } finally {
      setIsRunning(false)
    }
  }

  const submitCode = async () => {
    if (!problem) return
    
    setIsSubmitting(true)
    setShowResults(true)
    setActiveTab('result')
    
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
      setTestResults(data.submission?.testResults || [])
      setExecutionSummary(data.result || null)
      
      if (data.result?.status === 'Accepted') {
        // Celebration animation
        setTimeout(() => {
          alert('🎉 Accepted! Congratulations! Your solution passed all test cases!')
        }, 500)
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
            {/* Enhanced Language Selector & Actions */}
            <div className="flex items-center justify-between bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <Code className="h-5 w-5 text-primary" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-muted border border-border rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                >
                  <option value="javascript">🟨 JavaScript</option>
                  <option value="python">🐍 Python</option>
                  <option value="java">☕ Java</option>
                </select>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isRunning 
                      ? 'bg-blue-100 text-blue-600 cursor-not-allowed' 
                      : 'bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                      <span>Running...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Run Code</span>
                    </>
                  )}
                </button>
                <button
                  onClick={submitCode}
                  disabled={isSubmitting}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold transition-all ${
                    isSubmitting
                      ? 'bg-gradient-to-r from-purple-300 to-pink-300 text-purple-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Submit Solution</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Enhanced Code Editor */}
            <div className="relative">
              <div className="absolute top-3 right-3 z-10 flex items-center space-x-2 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1">
                <Zap className="h-3 w-3 text-yellow-400" />
                <span className="text-xs text-white font-medium">Enhanced Editor</span>
              </div>
              <div className="card p-0 overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-colors" style={{ height: '450px' }}>
                <MonacoEditor
                  height="450px"
                  language={selectedLanguage === 'javascript' ? 'javascript' : selectedLanguage}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 15,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    automaticLayout: true,
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    formatOnPaste: true,
                    formatOnType: true,
                    tabSize: 2,
                    insertSpaces: true,
                    bracketPairColorization: { enabled: true },
                    guides: {
                      bracketPairs: true,
                      indentation: true
                    },
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    contextmenu: true,
                    scrollbar: {
                      verticalScrollbarSize: 8,
                      horizontalScrollbarSize: 8
                    }
                  }}
                />
              </div>
            </div>

            {/* Enhanced Test Results - LeetCode Style */}
            {showResults && (
              <div className="card p-0 overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-border">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab('testcases')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'testcases'
                          ? 'border-b-2 border-primary text-primary bg-primary/5'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Code className="h-4 w-4" />
                        <span>Test Cases</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('result')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'result'
                          ? 'border-b-2 border-primary text-primary bg-primary/5'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Terminal className="h-4 w-4" />
                        <span>Result</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('submissions')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'submissions'
                          ? 'border-b-2 border-primary text-primary bg-primary/5'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Activity className="h-4 w-4" />
                        <span>Submissions</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'testcases' && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Code className="h-5 w-5 text-primary" />
                        <span className="font-medium">Sample Test Cases</span>
                      </div>
                      {problem?.examples.map((example, index) => (
                        <div key={index} className="bg-muted/30 p-4 rounded-lg space-y-2">
                          <div className="font-medium text-sm text-muted-foreground">Case {index + 1}</div>
                          <div className="text-sm">
                            <div className="mb-2"><span className="font-medium">Input:</span> <code className="bg-muted px-2 py-1 rounded text-xs">{example.input}</code></div>
                            <div><span className="font-medium">Output:</span> <code className="bg-muted px-2 py-1 rounded text-xs">{example.output}</code></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'result' && (
                    <div className="space-y-6">
                      {/* Execution Summary */}
                      {executionSummary && (
                        <div className={`p-6 rounded-xl border-2 ${
                          executionSummary.status === 'Accepted' 
                            ? 'border-success bg-success/5' 
                            : 'border-destructive bg-destructive/5'
                        }`}>
                          <div className="flex items-center space-x-3 mb-4">
                            {executionSummary.status === 'Accepted' ? (
                              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-white" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center">
                                <XCircle className="h-6 w-6 text-white" />
                              </div>
                            )}
                            <div>
                              <h3 className={`text-xl font-bold ${
                                executionSummary.status === 'Accepted' ? 'text-success' : 'text-destructive'
                              }`}>
                                {executionSummary.status}
                              </h3>
                              <p className="text-sm text-muted-foreground">{executionSummary.message}</p>
                            </div>
                          </div>

                          {/* Performance Stats */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <Timer className="h-4 w-4 text-blue-500" />
                              <div>
                                <div className="text-sm font-medium">{executionSummary.runtime}</div>
                                <div className="text-xs text-muted-foreground">Runtime</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <HardDrive className="h-4 w-4 text-purple-500" />
                              <div>
                                <div className="text-sm font-medium">{executionSummary.memory}</div>
                                <div className="text-xs text-muted-foreground">Memory</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-green-500" />
                              <div>
                                <div className="text-sm font-medium">{executionSummary.testsPassed}</div>
                                <div className="text-xs text-muted-foreground">Test Cases</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Individual Test Results */}
                      <div className="space-y-3">
                        {testResults.map((result, index) => (
                          <div
                            key={index}
                            className={`p-5 rounded-lg border transition-all hover:shadow-md ${
                              result.passed
                                ? 'border-success bg-success/5 hover:bg-success/10'
                                : 'border-destructive bg-destructive/5 hover:bg-destructive/10'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                {result.passed ? (
                                  <CheckCircle className="h-6 w-6 text-success animate-pulse" />
                                ) : (
                                  <XCircle className="h-6 w-6 text-destructive animate-pulse" />
                                )}
                                <div>
                                  <h4 className="font-semibold">Test Case {result.testCase}</h4>
                                  <p className={`text-sm ${result.passed ? 'text-success' : 'text-destructive'}`}>
                                    {result.passed ? 'Passed ✨' : 'Failed'}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm">
                                {result.executionTime && (
                                  <div className="flex items-center space-x-1 text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{result.executionTime}ms</span>
                                  </div>
                                )}
                                {result.memoryUsage && (
                                  <div className="flex items-center space-x-1 text-muted-foreground">
                                    <BarChart className="h-3 w-3" />
                                    <span>{result.memoryUsage}KB</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-3 text-sm">
                              <div className="grid gap-2">
                                <div>
                                  <span className="font-medium text-muted-foreground">Input:</span>
                                  <code className="ml-2 bg-muted px-2 py-1 rounded text-xs font-mono">
                                    {result.input}
                                  </code>
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">Expected:</span>
                                  <code className="ml-2 bg-muted px-2 py-1 rounded text-xs font-mono text-success">
                                    {result.expectedOutput}
                                  </code>
                                </div>
                                <div>
                                  <span className="font-medium text-muted-foreground">Output:</span>
                                  <code className={`ml-2 px-2 py-1 rounded text-xs font-mono ${
                                    result.passed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                                  }`}>
                                    {result.actualOutput || 'null'}
                                  </code>
                                </div>
                              </div>
                              
                              {result.error && (
                                <div className="mt-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                                  <div className="flex items-start space-x-2">
                                    <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                                    <div>
                                      <div className="font-medium text-destructive text-xs mb-1">
                                        {result.errorType || 'Runtime Error'}
                                      </div>
                                      <div className="text-xs text-muted-foreground font-mono">
                                        {result.error}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'submissions' && (
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Submission History</h3>
                      <p className="text-muted-foreground mb-4">Track your progress and compare solutions</p>
                      <button className="btn-primary">View All Submissions</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}