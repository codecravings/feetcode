'use client'

import { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { Play, RotateCcw, Settings, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface CodeEditorProps {
  problem: any
  vibe: string
  onSubmit: (code: string, language: string) => Promise<any>
  className?: string
}

interface TestResult {
  passed: boolean
  input: string
  expectedOutput: string
  actualOutput?: string
  error?: string
  executionTime?: number
}

const languageOptions = [
  { id: 'javascript', name: 'JavaScript', extension: 'js' },
  { id: 'python', name: 'Python', extension: 'py' },
  { id: 'java', name: 'Java', extension: 'java' },
  { id: 'cpp', name: 'C++', extension: 'cpp' },
  { id: 'go', name: 'Go', extension: 'go' },
  { id: 'rust', name: 'Rust', extension: 'rs' }
]

const defaultCode = {
  javascript: `function solution() {
    // Write your solution here
    return null;
}`,
  python: `def solution():
    # Write your solution here
    pass`,
  java: `public class Solution {
    public int solution() {
        // Write your solution here
        return 0;
    }
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    int solution() {
        // Write your solution here
        return 0;
    }
};`,
  go: `package main

import "fmt"

func solution() int {
    // Write your solution here
    return 0
}`,
  rust: `impl Solution {
    pub fn solution() -> i32 {
        // Write your solution here
        0
    }
}`
}

export default function CodeEditor({ problem, vibe, onSubmit, className = '' }: CodeEditorProps) {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [theme, setTheme] = useState('vs-dark')
  const editorRef = useRef<any>(null)

  useEffect(() => {
    // Load initial code template
    const template = problem?.codeTemplates?.[language] || defaultCode[language as keyof typeof defaultCode] || ''
    setCode(template)
  }, [language, problem])

  const vibeMessages = {
    professional: {
      running: 'Executing code...',
      success: 'All test cases passed!',
      failure: 'Some test cases failed.',
      error: 'Runtime error occurred.'
    },
    humorous: {
      running: 'Teaching the computer to dance... 💃',
      success: 'Your code is more successful than my last relationship! 🎉',
      failure: 'Houston, we have a problem... but not the fun kind 🚀',
      error: 'Your code threw a tantrum! 😤'
    },
    genz: {
      running: 'Code is loading... no cap',
      success: 'That code hits different! Absolutely fire! 🔥',
      failure: 'This ain\'t it chief... back to the drawing board fr',
      error: 'Code said nah fam and crashed 💀'
    }
  }

  const currentMessages = vibeMessages[vibe as keyof typeof vibeMessages] || vibeMessages.professional

  const handleRunCode = async () => {
    setIsRunning(true)
    setShowResults(false)

    try {
      // Simulate test execution (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockResults: TestResult[] = problem?.testCases?.map((testCase: any, index: number) => ({
        passed: Math.random() > 0.3, // 70% pass rate for demo
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: Math.random() > 0.3 ? testCase.expectedOutput : 'Wrong output',
        executionTime: Math.floor(Math.random() * 100) + 50
      })) || []

      setTestResults(mockResults)
      setShowResults(true)
    } catch (error) {
      console.error('Code execution failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    setIsRunning(true)
    
    try {
      const result = await onSubmit(code, language)
      setTestResults(result.testResults || [])
      setShowResults(true)
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    const template = problem?.codeTemplates?.[language] || defaultCode[language as keyof typeof defaultCode] || ''
    setCode(template)
    setTestResults([])
    setShowResults(false)
  }

  const getResultIcon = (passed: boolean) => {
    if (passed) return <CheckCircle className="h-4 w-4 text-green-500" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getResultMessage = () => {
    const passedCount = testResults.filter(r => r.passed).length
    const totalCount = testResults.length
    
    if (passedCount === totalCount && totalCount > 0) {
      return currentMessages.success
    } else if (passedCount < totalCount) {
      return currentMessages.failure
    }
    return currentMessages.error
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <div className="flex items-center space-x-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languageOptions.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value={12}>12px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
            </select>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="vs-dark">Dark</option>
              <option value="light">Light</option>
              <option value="hc-black">High Contrast</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={(editor) => {
            editorRef.current = editor
          }}
          theme={theme}
          options={{
            fontSize,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true }
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
        <div className="flex items-center space-x-2">
          {isRunning && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">{currentMessages.running}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="h-4 w-4" />
            <span>Run</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Test Results */}
      {showResults && testResults.length > 0 && (
        <div className="border-t bg-white">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <AlertCircle className="h-5 w-5 text-gray-500" />
              <h3 className="font-semibold text-gray-800">Test Results</h3>
              <span className="text-sm text-gray-600">
                ({testResults.filter(r => r.passed).length}/{testResults.length} passed)
              </span>
            </div>

            <div className="text-sm mb-3 font-medium" 
                 style={{ 
                   color: testResults.every(r => r.passed) ? '#10b981' : '#ef4444' 
                 }}>
              {getResultMessage()}
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.passed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getResultIcon(result.passed)}
                      <span className="font-medium text-sm">Test Case {index + 1}</span>
                    </div>
                    {result.executionTime && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{result.executionTime}ms</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div><strong>Input:</strong> {result.input}</div>
                    <div><strong>Expected:</strong> {result.expectedOutput}</div>
                    {result.actualOutput && (
                      <div><strong>Actual:</strong> {result.actualOutput}</div>
                    )}
                    {result.error && (
                      <div className="text-red-600"><strong>Error:</strong> {result.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}