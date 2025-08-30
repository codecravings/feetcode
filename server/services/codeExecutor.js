const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class CodeExecutor {
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

  async executeCode(code, language, testCases, timeLimit = 5000) {
    const executionId = this.generateUniqueId();
    
    try {
      switch (language) {
        case 'javascript':
          return await this.executeJavaScript(code, testCases, executionId, timeLimit);
        case 'python':
          return await this.executePython(code, testCases, executionId, timeLimit);
        case 'java':
          return await this.executeJava(code, testCases, executionId, timeLimit);
        case 'cpp':
          return await this.executeCpp(code, testCases, executionId, timeLimit);
        default:
          throw new Error(`Language ${language} not supported`);
      }
    } finally {
      // Cleanup temp files
      await this.cleanup(executionId);
    }
  }

  async executeJavaScript(code, testCases, executionId, timeLimit) {
    const results = [];
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const startTime = Date.now();
      
      try {
        // Create a sandboxed execution environment
        const wrappedCode = `
          ${code}
          
          // Parse test case input and execute based on problem type
          try {
            // Handle different problem input formats
            let result;
            const inputStr = \`${testCase.input}\`;
            
            // Check if it's a Two Sum type problem
            if (inputStr.includes('[') && inputStr.includes('], ') && typeof twoSum === 'function') {
              const bracketEnd = inputStr.indexOf('], ');
              const nums = JSON.parse(inputStr.substring(0, bracketEnd + 1));
              const target = parseInt(inputStr.substring(bracketEnd + 3).trim());
              result = twoSum(nums, target);
            }
            // Check if it's a single array input
            else if (inputStr.startsWith('[') && typeof rob === 'function') {
              const nums = JSON.parse(inputStr);
              result = rob(nums);
            }
            // Check if it's a matrix input
            else if (inputStr.includes('[[') && typeof spiralOrder === 'function') {
              const matrix = JSON.parse(inputStr);
              result = spiralOrder(matrix);
            }
            // Check if it's a tree input (simplified)
            else if ((inputStr.includes('null') || inputStr.startsWith('[')) && typeof maxDepth === 'function') {
              // For tree problems, we'd need to construct the tree first
              // This is a simplified version
              result = 0; // Placeholder
            }
            // Check for graph problems
            else if (inputStr.includes('[[') && typeof validTree === 'function') {
              const commaIndex = inputStr.indexOf(', [[');
              if (commaIndex !== -1) {
                const n = parseInt(inputStr.substring(0, commaIndex).trim());
                const edges = JSON.parse(inputStr.substring(commaIndex + 2).trim());
                result = validTree(n, edges);
              }
            }
            // Check for string problems
            else if (inputStr.startsWith('"') && typeof isValid === 'function') {
              const s = JSON.parse(inputStr);
              result = isValid(s);
            }
            // Default: try to parse as JSON and call main function
            else {
              const input = JSON.parse(inputStr);
              if (Array.isArray(input) && input.length === 2) {
                result = typeof search === 'function' ? search(input[0], input[1]) : 
                         typeof coinChange === 'function' ? coinChange(input[0], input[1]) : null;
              } else {
                result = input;
              }
            }
            
            JSON.stringify(result);
          } catch (e) {
            throw new Error('Failed to parse input or execute function: ' + e.message);
          }
        `;

        const result = await this.runInSandbox(wrappedCode, 'javascript', timeLimit);
        const executionTime = Date.now() - startTime;
        
        const actualOutput = JSON.parse(result);
        const expectedOutput = JSON.parse(testCase.expectedOutput);
        
        const passed = this.compareOutputs(actualOutput, expectedOutput);
        
        results.push({
          testCaseIndex: i,
          passed,
          actualOutput: JSON.stringify(actualOutput),
          expectedOutput: testCase.expectedOutput,
          executionTime,
          memoryUsed: 0 // Would need process monitoring for real memory usage
        });
        
      } catch (error) {
        results.push({
          testCaseIndex: i,
          passed: false,
          actualOutput: null,
          expectedOutput: testCase.expectedOutput,
          executionTime: Date.now() - startTime,
          error: error.message
        });
      }
    }

    const passedCount = results.filter(r => r.passed).length;
    const status = passedCount === results.length ? 'accepted' : 'wrong-answer';
    
    return {
      status,
      testResults: results,
      totalExecutionTime: results.reduce((sum, r) => sum + r.executionTime, 0),
      passedTestCases: passedCount,
      totalTestCases: results.length
    };
  }

  async executePython(code, testCases, executionId, timeLimit) {
    const results = [];
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const startTime = Date.now();
      
      try {
        // Create Python script with test case
        const pythonScript = `
import json
import sys
from typing import List

${code}

# Parse test case input
test_input = ${testCase.input.replace(/=/g, ':')}
solution = Solution()

# Execute the solution
if hasattr(solution, 'twoSum'):
    result = solution.twoSum(test_input['nums'], test_input['target'])
else:
    result = solution.solution()

# Output result as JSON
print(json.dumps(result))
`;

        const fileName = `${executionId}_${i}.py`;
        const filePath = path.join(this.tempDir, fileName);
        await fs.writeFile(filePath, pythonScript);

        const result = await this.executeCommand('python', [filePath], timeLimit);
        const executionTime = Date.now() - startTime;
        
        const actualOutput = JSON.parse(result.trim());
        const expectedOutput = JSON.parse(testCase.expectedOutput);
        
        const passed = this.compareOutputs(actualOutput, expectedOutput);
        
        results.push({
          testCaseIndex: i,
          passed,
          actualOutput: JSON.stringify(actualOutput),
          expectedOutput: testCase.expectedOutput,
          executionTime,
          memoryUsed: 0
        });
        
      } catch (error) {
        results.push({
          testCaseIndex: i,
          passed: false,
          actualOutput: null,
          expectedOutput: testCase.expectedOutput,
          executionTime: Date.now() - startTime,
          error: error.message
        });
      }
    }

    const passedCount = results.filter(r => r.passed).length;
    const status = passedCount === results.length ? 'accepted' : 'wrong-answer';
    
    return {
      status,
      testResults: results,
      totalExecutionTime: results.reduce((sum, r) => sum + r.executionTime, 0),
      passedTestCases: passedCount,
      totalTestCases: results.length
    };
  }

  async executeJava(code, testCases, executionId, timeLimit) {
    // Similar implementation for Java
    // This would require javac compilation and java execution
    throw new Error('Java execution not implemented yet');
  }

  async executeCpp(code, testCases, executionId, timeLimit) {
    // Similar implementation for C++
    // This would require g++ compilation and executable execution
    throw new Error('C++ execution not implemented yet');
  }

  async runInSandbox(code, language, timeLimit) {
    // For Node.js, we can use vm module for basic sandboxing
    const vm = require('vm');
    
    const sandbox = {
      console: {
        log: () => {}, // Disable console.log
        error: () => {}
      },
      setTimeout: undefined,
      setInterval: undefined,
      require: undefined,
      process: undefined,
      global: undefined,
      JSON: JSON
    };

    const context = vm.createContext(sandbox);
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Time Limit Exceeded'));
      }, timeLimit);

      try {
        const result = vm.runInContext(code, context, { timeout: timeLimit });
        clearTimeout(timeout);
        resolve(result);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  async executeCommand(command, args, timeLimit) {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, { timeout: timeLimit });
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

      // Set timeout
      setTimeout(() => {
        child.kill('SIGKILL');
        reject(new Error('Time Limit Exceeded'));
      }, timeLimit);
    });
  }

  compareOutputs(actual, expected) {
    // Deep comparison of outputs
    if (Array.isArray(actual) && Array.isArray(expected)) {
      if (actual.length !== expected.length) return false;
      
      // For Two Sum problem, order doesn't matter
      const sortedActual = [...actual].sort((a, b) => a - b);
      const sortedExpected = [...expected].sort((a, b) => a - b);
      
      return JSON.stringify(sortedActual) === JSON.stringify(sortedExpected);
    }
    
    return JSON.stringify(actual) === JSON.stringify(expected);
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

  // Security method to validate code (basic checks)
  validateCode(code, language) {
    const dangerousPatterns = [
      /require\s*\(\s*['"]fs['"]\s*\)/, // File system access
      /require\s*\(\s*['"]child_process['"]\s*\)/, // Process execution
      /require\s*\(\s*['"]net['"]\s*\)/, // Network access
      /require\s*\(\s*['"]http['"]\s*\)/, // HTTP requests
      /eval\s*\(/, // Code evaluation
      /Function\s*\(/, // Dynamic function creation
      /while\s*\(\s*true\s*\)/, // Infinite loops
      /for\s*\(\s*;\s*;\s*\)/ // Infinite loops
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        throw new Error('Code contains potentially dangerous operations');
      }
    }

    // Check code length
    if (code.length > 100000) {
      throw new Error('Code is too long');
    }

    return true;
  }
}

module.exports = CodeExecutor;