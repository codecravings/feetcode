const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');

class EnhancedCodeExecutor {
  constructor() {
    this.tempDir = path.join(__dirname, '../temp');
    this.ensureTempDir();
  }

  async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
  }

  generateUniqueId() {
    return crypto.randomBytes(16).toString('hex');
  }

  async executeCode(code, language, testCases, timeLimit = 10000) {
    const executionId = this.generateUniqueId();
    
    try {
      switch (language.toLowerCase()) {
        case 'javascript':
          return await this.executeJavaScript(code, testCases, executionId, timeLimit);
        case 'python':
        case 'python3':
          return await this.executePython(code, testCases, executionId, timeLimit);
        case 'java':
          return await this.executeJava(code, testCases, executionId, timeLimit);
        case 'cpp':
        case 'c++':
          return await this.executeCpp(code, testCases, executionId, timeLimit);
        default:
          throw new Error(`Language ${language} not supported`);
      }
    } finally {
      await this.cleanup(executionId);
    }
  }

  async executeJavaScript(code, testCases, executionId, timeLimit) {
    const results = [];
    let totalExecutionTime = 0;
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const startTime = process.hrtime.bigint();
      
      try {
        // Enhanced function detection and execution
        const wrappedCode = this.wrapJavaScriptCode(code, testCase);
        
        const result = await this.runInSecureSandbox(wrappedCode, timeLimit);
        const endTime = process.hrtime.bigint();
        const executionTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
        
        totalExecutionTime += executionTime;
        
        const actualOutput = this.parseOutput(result);
        const expectedOutput = this.parseOutput(testCase.expectedOutput);
        
        const passed = this.deepCompare(actualOutput, expectedOutput);
        
        results.push({
          testCase: i + 1,
          input: testCase.input,
          expectedOutput: this.formatOutput(expectedOutput),
          actualOutput: this.formatOutput(actualOutput),
          passed,
          executionTime: Math.round(executionTime * 100) / 100,
          memoryUsage: this.estimateMemoryUsage(result)
        });
        
      } catch (error) {
        const endTime = process.hrtime.bigint();
        const executionTime = Number(endTime - startTime) / 1000000;
        totalExecutionTime += executionTime;
        
        results.push({
          testCase: i + 1,
          input: testCase.input,
          expectedOutput: this.formatOutput(this.parseOutput(testCase.expectedOutput)),
          actualOutput: null,
          passed: false,
          executionTime: Math.round(executionTime * 100) / 100,
          error: this.categorizeError(error.message),
          errorType: this.getErrorType(error.message)
        });
      }
    }

    const passedCount = results.filter(r => r.passed).length;
    const status = this.getSubmissionStatus(passedCount, results.length);
    
    return {
      status,
      testResults: results,
      summary: {
        totalTestCases: results.length,
        passedTestCases: passedCount,
        failedTestCases: results.length - passedCount,
        totalExecutionTime: Math.round(totalExecutionTime * 100) / 100,
        averageExecutionTime: Math.round((totalExecutionTime / results.length) * 100) / 100,
        memoryUsage: Math.max(...results.map(r => r.memoryUsage || 0))
      }
    };
  }

  wrapJavaScriptCode(code, testCase) {
    // Smart function detection and parameter parsing
    const functionMatches = code.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=|let\s+(\w+)\s*=|var\s+(\w+)\s*=)/g);
    const mainFunctionName = this.detectMainFunction(code);
    
    return `
      ${code}
      
      (function() {
        try {
          // Parse input intelligently
          const input = ${JSON.stringify(testCase.input)};
          let result;
          
          ${this.generateFunctionCall(mainFunctionName, testCase.input)}
          
          return JSON.stringify(result);
        } catch (e) {
          throw new Error('Runtime Error: ' + e.message);
        }
      })()
    `;
  }

  detectMainFunction(code) {
    // Common LeetCode function patterns
    const patterns = [
      /function\s+(twoSum|addTwoNumbers|lengthOfLongestSubstring|findMedianSortedArrays|longestPalindrome|reverse|atoi|isPalindrome|maxArea|intToRoman|romanToInt|longestCommonPrefix|threeSum|threeSumClosest|letterCombinations|fourSum|removeNthFromEnd|isValid|mergeTwoLists|generateParenthesis|mergeKLists|swapPairs|reverseKGroup|removeDuplicates|removeElement|strStr|divide|findSubstring|nextPermutation|longestValidParentheses|search|searchRange|searchInsert|isValidSudoku|solveSudoku|countAndSay|combinationSum|combinationSum2|firstMissingPositive|trap|multiply|isMatch|jump|permute|permuteUnique|rotate|groupAnagrams|pow|solveNQueens|maxSubArray|spiralOrder|canJump|merge|insert|generateMatrix|lengthOfLastWord|plusOne|addBinary|mySqrt|climbStairs|simplifyPath|minDistance|searchMatrix|setZeroes|minWindow|combine|subsets|exist|removeDuplicatesII|search|partition|surroundedRegions|solve|numIslands|rob|maxProduct|findMin|findPeakElement|majorityElement|reverseBits|hammingWeight|isHappy|removeElements|countPrimes|isIsomorphic|reverseList|containsDuplicate|containsNearbyDuplicate|maxSlidingWindow|isAnagram|binaryTreePaths|addDigits|isUgly|missingNumber|moveZeroes|wordPattern|canConstruct|isPowerOfThree|oddEvenList|isPowerOfFour|reverseString|reverseVowels|intersection|intersect|isPerfectSquare|guessNumber|rangeSum|getSum|findTheDifference|readBinaryWatch|sumOfLeftLeaves|toHex|longestPalindrome|canPartition|pacificAtlantic|battleshipsInBoard|findMaxForm|findTargetSumWays|predictPartyVictory|findMinDifference|findWords|findComplement|smallestRange|findRadius|checkRecord|findLongestChain|findMaxLength|hasValidPath|validTree|isBipartite|maxAreaOfIsland|networkDelayTime|shortestPathBinaryMatrix|numEnclaves|islandPerimeter)\s*\(/,
      /const\s+(twoSum|addTwoNumbers|lengthOfLongestSubstring|findMedianSortedArrays|longestPalindrome|reverse|atoi|isPalindrome|maxArea|intToRoman|romanToInt|longestCommonPrefix|threeSum|threeSumClosest|letterCombinations|fourSum|removeNthFromEnd|isValid|mergeTwoLists|generateParenthesis|mergeKLists|swapPairs|reverseKGroup|removeDuplicates|removeElement|strStr|divide|findSubstring|nextPermutation|longestValidParentheses|search|searchRange|searchInsert|isValidSudoku|solveSudoku|countAndSay|combinationSum|combinationSum2|firstMissingPositive|trap|multiply|isMatch|jump|permute|permuteUnique|rotate|groupAnagrams|pow|solveNQueens|maxSubArray|spiralOrder|canJump|merge|insert|generateMatrix|lengthOfLastWord|plusOne|addBinary|mySqrt|climbStairs|simplifyPath|minDistance|searchMatrix|setZeroes|minWindow|combine|subsets|exist|removeDuplicatesII|search|partition|surroundedRegions|solve|numIslands|rob|maxProduct|findMin|findPeakElement|majorityElement|reverseBits|hammingWeight|isHappy|removeElements|countPrimes|isIsomorphic|reverseList|containsDuplicate|containsNearbyDuplicate|maxSlidingWindow|isAnagram|binaryTreePaths|addDigits|isUgly|missingNumber|moveZeroes|wordPattern|canConstruct|isPowerOfThree|oddEvenList|isPowerOfFour|reverseString|reverseVowels|intersection|intersect|isPerfectSquare|guessNumber|rangeSum|getSum|findTheDifference|readBinaryWatch|sumOfLeftLeaves|toHex|longestPalindrome|canPartition|pacificAtlantic|battleshipsInBoard|findMaxForm|findTargetSumWays|predictPartyVictory|findMinDifference|findWords|findComplement|smallestRange|findRadius|checkRecord|findLongestChain|findMaxLength|hasValidPath|validTree|isBipartite|maxAreaOfIsland|networkDelayTime|shortestPathBinaryMatrix|numEnclaves|islandPerimeter)\s*=/
    ];
    
    for (const pattern of patterns) {
      const match = code.match(pattern);
      if (match) {
        return match[1] || match[2]; // Return the function name
      }
    }
    
    // Fallback: look for any function declaration
    const functionMatch = code.match(/(?:function\s+(\w+)|const\s+(\w+)\s*=|let\s+(\w+)\s*=|var\s+(\w+)\s*=)/);
    if (functionMatch) {
      return functionMatch[1] || functionMatch[2] || functionMatch[3] || functionMatch[4];
    }
    
    return null;
  }

  generateFunctionCall(functionName, input) {
    if (!functionName) {
      return 'result = null;';
    }

    // Smart input parsing based on common patterns
    const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
    
    // Two Sum pattern: [nums], target
    if (inputStr.includes('], ') && functionName === 'twoSum') {
      return `
        const bracketEnd = input.indexOf('], ');
        const nums = JSON.parse(input.substring(0, bracketEnd + 1));
        const target = parseInt(input.substring(bracketEnd + 3).trim());
        result = ${functionName}(nums, target);
      `;
    }
    
    // Array input pattern
    if (inputStr.startsWith('[') && !inputStr.includes('[[')) {
      return `
        const arr = JSON.parse(input);
        result = ${functionName}(arr);
      `;
    }
    
    // Matrix input pattern
    if (inputStr.includes('[[')) {
      return `
        const matrix = JSON.parse(input);
        result = ${functionName}(matrix);
      `;
    }
    
    // String input pattern
    if (inputStr.startsWith('"')) {
      return `
        const str = JSON.parse(input);
        result = ${functionName}(str);
      `;
    }
    
    // Multi-parameter pattern
    if (inputStr.includes(', ')) {
      return `
        const params = input.split(', ').map(p => {
          try { return JSON.parse(p.trim()); } 
          catch { return p.trim().replace(/"/g, ''); }
        });
        result = ${functionName}(...params);
      `;
    }
    
    // Default: single parameter
    return `
      try {
        const param = JSON.parse(input);
        result = ${functionName}(param);
      } catch {
        result = ${functionName}(input);
      }
    `;
  }

  async runInSecureSandbox(code, timeLimit) {
    const sandbox = {
      console: {
        log: (...args) => args.join(' '), // Capture console output
        error: (...args) => args.join(' ')
      },
      Math: Math,
      parseInt: parseInt,
      parseFloat: parseFloat,
      isNaN: isNaN,
      isFinite: isFinite,
      JSON: JSON,
      Array: Array,
      Object: Object,
      String: String,
      Number: Number,
      Boolean: Boolean,
      Date: Date,
      RegExp: RegExp,
      Map: Map,
      Set: Set,
      // Disable dangerous globals
      setTimeout: undefined,
      setInterval: undefined,
      require: undefined,
      process: undefined,
      global: undefined,
      eval: undefined,
      Function: undefined
    };

    const context = vm.createContext(sandbox);
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Time Limit Exceeded'));
      }, timeLimit);

      try {
        const result = vm.runInContext(code, context, { 
          timeout: timeLimit,
          displayErrors: true
        });
        clearTimeout(timeout);
        resolve(result);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  parseOutput(output) {
    if (typeof output === 'string') {
      try {
        return JSON.parse(output);
      } catch {
        return output;
      }
    }
    return output;
  }

  formatOutput(output) {
    if (output === null || output === undefined) return 'null';
    if (typeof output === 'string') return `"${output}"`;
    if (Array.isArray(output)) return `[${output.map(item => this.formatOutput(item)).join(',')}]`;
    if (typeof output === 'object') return JSON.stringify(output);
    return String(output);
  }

  deepCompare(actual, expected) {
    // Handle null/undefined cases
    if (actual === null && expected === null) return true;
    if (actual === undefined && expected === undefined) return true;
    if (actual === null || expected === null) return false;
    if (actual === undefined || expected === undefined) return false;
    
    // Handle primitive types
    if (typeof actual !== typeof expected) return false;
    if (typeof actual !== 'object') return actual === expected;
    
    // Handle arrays
    if (Array.isArray(actual) && Array.isArray(expected)) {
      if (actual.length !== expected.length) return false;
      
      // For some problems, order doesn't matter (like Two Sum)
      // We'll do strict order comparison by default
      for (let i = 0; i < actual.length; i++) {
        if (!this.deepCompare(actual[i], expected[i])) return false;
      }
      return true;
    }
    
    // Handle objects
    if (Array.isArray(actual) || Array.isArray(expected)) return false;
    
    const actualKeys = Object.keys(actual).sort();
    const expectedKeys = Object.keys(expected).sort();
    
    if (actualKeys.length !== expectedKeys.length) return false;
    if (!actualKeys.every(key => expectedKeys.includes(key))) return false;
    
    return actualKeys.every(key => this.deepCompare(actual[key], expected[key]));
  }

  getSubmissionStatus(passed, total) {
    if (passed === total) return 'Accepted';
    if (passed === 0) return 'Wrong Answer';
    return 'Partial';
  }

  categorizeError(errorMessage) {
    if (errorMessage.includes('Time Limit Exceeded')) return 'Time Limit Exceeded';
    if (errorMessage.includes('ReferenceError')) return 'Runtime Error: Undefined variable or function';
    if (errorMessage.includes('TypeError')) return 'Runtime Error: Type mismatch';
    if (errorMessage.includes('SyntaxError')) return 'Compilation Error: Syntax error';
    if (errorMessage.includes('RangeError')) return 'Runtime Error: Array index out of bounds';
    if (errorMessage.includes('Maximum call stack')) return 'Runtime Error: Stack overflow';
    return 'Runtime Error: ' + errorMessage;
  }

  getErrorType(errorMessage) {
    if (errorMessage.includes('Time Limit Exceeded')) return 'TLE';
    if (errorMessage.includes('SyntaxError')) return 'CE';
    if (errorMessage.includes('call stack')) return 'RTE';
    return 'RTE';
  }

  estimateMemoryUsage(result) {
    // Simple memory estimation based on output size
    const resultStr = JSON.stringify(result);
    return Math.round((resultStr.length * 2) / 1024); // Rough estimate in KB
  }

  async executePython(code, testCases, executionId, timeLimit) {
    const results = [];
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const startTime = Date.now();
      
      try {
        // Create enhanced Python wrapper
        const pythonScript = `
import json
import sys
import time
from typing import List, Optional

# Memory and time tracking
start_time = time.time()

${code}

# Smart function detection and execution
solution = Solution()
input_data = ${JSON.stringify(testCase.input)}

# Parse input and call appropriate method
try:
    if hasattr(solution, 'twoSum') and isinstance(input_data, str) and '], ' in input_data:
        bracket_end = input_data.find('], ')
        nums = json.loads(input_data[:bracket_end + 1])
        target = int(input_data[bracket_end + 3:].strip())
        result = solution.twoSum(nums, target)
    elif hasattr(solution, 'addTwoNumbers'):
        # Handle linked list inputs (simplified)
        result = solution.addTwoNumbers(None, None)  # Would need proper ListNode creation
    else:
        # Try to find the main solution method
        methods = [attr for attr in dir(solution) if not attr.startswith('_')]
        main_method = methods[0] if methods else None
        
        if main_method:
            method = getattr(solution, main_method)
            if isinstance(input_data, str) and input_data.startswith('['):
                parsed_input = json.loads(input_data)
                if isinstance(parsed_input, list) and len(parsed_input) > 0:
                    if isinstance(parsed_input[0], list):
                        result = method(parsed_input)  # Matrix input
                    else:
                        result = method(parsed_input)  # Array input
                else:
                    result = method(parsed_input)
            else:
                result = method(input_data)
        else:
            result = None
    
    end_time = time.time()
    execution_time = (end_time - start_time) * 1000  # Convert to ms
    
    print(json.dumps({
        'result': result,
        'execution_time': execution_time,
        'memory_usage': sys.getsizeof(result)
    }))
    
except Exception as e:
    print(json.dumps({
        'error': str(e),
        'error_type': type(e).__name__
    }))
`;

        const fileName = `${executionId}_${i}.py`;
        const filePath = path.join(this.tempDir, fileName);
        await fs.writeFile(filePath, pythonScript);

        const output = await this.executeCommand('python', [filePath], timeLimit);
        const executionTime = Date.now() - startTime;
        
        const result = JSON.parse(output.trim());
        
        if (result.error) {
          results.push({
            testCase: i + 1,
            input: testCase.input,
            expectedOutput: this.formatOutput(this.parseOutput(testCase.expectedOutput)),
            actualOutput: null,
            passed: false,
            executionTime: result.execution_time || executionTime,
            error: this.categorizeError(result.error),
            errorType: result.error_type || 'RTE'
          });
        } else {
          const actualOutput = result.result;
          const expectedOutput = this.parseOutput(testCase.expectedOutput);
          const passed = this.deepCompare(actualOutput, expectedOutput);
          
          results.push({
            testCase: i + 1,
            input: testCase.input,
            expectedOutput: this.formatOutput(expectedOutput),
            actualOutput: this.formatOutput(actualOutput),
            passed,
            executionTime: result.execution_time || executionTime,
            memoryUsage: Math.round(result.memory_usage / 1024) // Convert to KB
          });
        }
        
      } catch (error) {
        results.push({
          testCase: i + 1,
          input: testCase.input,
          expectedOutput: this.formatOutput(this.parseOutput(testCase.expectedOutput)),
          actualOutput: null,
          passed: false,
          executionTime: Date.now() - startTime,
          error: this.categorizeError(error.message),
          errorType: this.getErrorType(error.message)
        });
      }
    }

    const passedCount = results.filter(r => r.passed).length;
    const status = this.getSubmissionStatus(passedCount, results.length);
    
    return {
      status,
      testResults: results,
      summary: {
        totalTestCases: results.length,
        passedTestCases: passedCount,
        failedTestCases: results.length - passedCount,
        totalExecutionTime: results.reduce((sum, r) => sum + r.executionTime, 0),
        averageExecutionTime: Math.round((results.reduce((sum, r) => sum + r.executionTime, 0) / results.length) * 100) / 100,
        memoryUsage: Math.max(...results.map(r => r.memoryUsage || 0))
      }
    };
  }

  async executeCommand(command, args, timeLimit) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { 
        timeout: timeLimit,
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(stderr || `Process exited with code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });

      // Backup timeout
      const timeout = setTimeout(() => {
        child.kill('SIGKILL');
        reject(new Error('Time Limit Exceeded'));
      }, timeLimit);

      child.on('exit', () => {
        clearTimeout(timeout);
      });
    });
  }

  async cleanup(executionId) {
    try {
      const files = await fs.readdir(this.tempDir);
      const filesToDelete = files.filter(file => file.startsWith(executionId));
      
      await Promise.all(
        filesToDelete.map(file => 
          fs.unlink(path.join(this.tempDir, file)).catch(() => {})
        )
      );
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  validateCode(code, language) {
    // Enhanced security validation
    const dangerousPatterns = [
      /require\s*\(\s*['"]fs['"]\s*\)/, 
      /require\s*\(\s*['"]child_process['"]\s*\)/, 
      /require\s*\(\s*['"]net['"]\s*\)/, 
      /require\s*\(\s*['"]http['"]\s*\)/, 
      /import\s+os/, // Python
      /import\s+subprocess/, // Python
      /eval\s*\(/,
      /exec\s*\(/,
      /Function\s*\(/,
      /while\s*\(\s*true\s*\)/,
      /for\s*\(\s*;\s*;\s*\)/,
      /while\s*True\s*:/, // Python
      /while\s*1\s*:/  // Python
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        throw new Error('Code contains potentially dangerous operations');
      }
    }

    if (code.length > 50000) {
      throw new Error('Code exceeds maximum length limit');
    }

    return true;
  }

  // LeetCode-style result formatting
  formatLeetCodeResult(executionResult) {
    const { status, testResults, summary } = executionResult;
    
    return {
      status: status,
      runtime: `${summary.averageExecutionTime}ms`,
      memory: `${summary.memoryUsage}KB`,
      testsPassed: `${summary.passedTestCases}/${summary.totalTestCases}`,
      details: testResults,
      message: this.getStatusMessage(status, summary.passedTestCases, summary.totalTestCases)
    };
  }

  getStatusMessage(status, passed, total) {
    if (status === 'Accepted') {
      return `Success! All ${total} test cases passed. Well done! 🎉`;
    } else if (passed === 0) {
      return `All test cases failed. Please review your solution.`;
    } else {
      return `${passed} out of ${total} test cases passed. Almost there!`;
    }
  }
}

module.exports = EnhancedCodeExecutor;