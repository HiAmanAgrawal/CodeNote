'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Save, Download, Settings, Brain, Target } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react'),
  { ssr: false }
);

const languages = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'c', name: 'C' },
];

const defaultCode = {
  javascript: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6)); // [1, 2]
console.log(twoSum([3, 3], 6)); // [0, 1]`,
  python: `def two_sum(nums, target):
    seen = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return []

# Test cases
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]
print(two_sum([3, 2, 4], 6))       # [1, 2]
print(two_sum([3, 3], 6))          # [0, 1]`,
  java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            
            map.put(nums[i], i);
        }
        
        return new int[0];
    }
}`,
  cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> map;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            
            map[nums[i]] = i;
        }
        
        return {};
    }
};`,
  c: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    int* result = (int*)malloc(2 * sizeof(int));
    *returnSize = 2;
    
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    
    return result;
}`,
};

export default function EditorPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(defaultCode.javascript);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCode(defaultCode[language as keyof typeof defaultCode] || '');
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');
    
    // Simulate code execution
    setTimeout(() => {
      setOutput(`✓ Code executed successfully!
      
Input: [2, 7, 11, 15], target = 9
Output: [0, 1]
Runtime: 4ms
Memory: 38.5MB

Input: [3, 2, 4], target = 6
Output: [1, 2]
Runtime: 2ms
Memory: 38.2MB

Input: [3, 3], target = 6
Output: [0, 1]
Runtime: 1ms
Memory: 38.1MB

All test cases passed! 🎉`);
      setIsRunning(false);
    }, 2000);
  };

  const handleAnalyzeCode = async () => {
    setOutput('Analyzing code complexity...\n');
    
    // Simulate AI analysis
    setTimeout(() => {
      setOutput(`🤖 AI Analysis Complete!

Time Complexity: O(n)
Space Complexity: O(n)

Explanation:
- We use a hash map to store each number and its index
- For each number, we check if its complement exists in the map
- This allows us to find the solution in a single pass

Optimization Suggestions:
1. ✅ Current implementation is already optimal
2. Consider edge cases (empty array, no solution)
3. Add input validation

Alternative Approaches:
1. Brute Force: O(n²) time, O(1) space
2. Two Pointers (for sorted array): O(n log n) time, O(1) space

Best Practices Applied:
✅ Efficient hash map usage
✅ Clear variable naming
✅ Proper return handling`);
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Code Editor</h1>
          <p className="text-muted-foreground">
            Practice coding problems with AI-powered assistance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Two Sum</Badge>
          <Badge variant="outline">Easy</Badge>
        </div>
      </div>

      {/* Problem Description */}
      <Card>
        <CardHeader>
          <CardTitle>Two Sum</CardTitle>
          <CardDescription>
            Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Example 1:</h4>
              <p className="text-sm bg-muted p-3 rounded">
                <strong>Input:</strong> nums = [2,7,11,15], target = 9<br/>
                <strong>Output:</strong> [0,1]<br/>
                <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Example 2:</h4>
              <p className="text-sm bg-muted p-3 rounded">
                <strong>Input:</strong> nums = [3,2,4], target = 6<br/>
                <strong>Output:</strong> [1,2]
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Constraints:</h4>
              <ul className="text-sm space-y-1">
                <li>• 2 ≤ nums.length ≤ 10⁴</li>
                <li>• -10⁹ ≤ nums[i] ≤ 10⁹</li>
                <li>• -10⁹ ≤ target ≤ 10⁹</li>
                <li>• Only one valid answer exists.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor and Output */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Code</CardTitle>
              <div className="flex items-center space-x-2">
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div className="h-96">
              <MonacoEditor
                height="100%"
                language={selectedLanguage}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Output and Actions */}
        <div className="space-y-4">
          {/* Action Buttons */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Button onClick={handleRunCode} disabled={isRunning}>
                  <Play className="mr-2 h-4 w-4" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>
                <Button variant="outline" onClick={handleAnalyzeCode}>
                  <Brain className="mr-2 h-4 w-4" />
                  AI Analysis
                </Button>
                <Button variant="outline">
                  <Target className="mr-2 h-4 w-4" />
                  Submit
                </Button>
                <Button variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-lg">Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-black text-green-400 p-4 rounded font-mono text-sm overflow-auto">
                <pre>{output || 'Ready to run code...'}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
