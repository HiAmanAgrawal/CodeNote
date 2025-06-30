'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Play,
  Brain,
  Target,
  Save,
  Download,
  Settings,
  Plus,
  X,
  Pencil,
  Clock,
  Palette,
  Eye,
  EyeOff,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Copy,
  Check,
  Zap,
  BookOpen,
  Users,
  Trophy,
  Code,
  FileText,
  Terminal,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const languages = [
  { id: 'javascript', name: 'JavaScript', ext: 'js' },
  { id: 'python', name: 'Python', ext: 'py' },
  { id: 'java', name: 'Java', ext: 'java' },
  { id: 'cpp', name: 'C++', ext: 'cpp' },
  { id: 'typescript', name: 'TypeScript', ext: 'ts' },
  { id: 'go', name: 'Go', ext: 'go' },
  { id: 'rust', name: 'Rust', ext: 'rs' },
];

const themes = [
  { id: 'vs-dark', name: 'Dark' },
  { id: 'vs-light', name: 'Light' },
  { id: 'hc-black', name: 'High Contrast' },
];

const defaultCode: Record<string, string> = {
  javascript: `// Two Sum Solution\nfunction twoSum(nums, target) {\n  const map = new Map();\n  \n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    \n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    \n    map.set(nums[i], i);\n  }\n  \n  return [];\n}\n\n// Test the function\nconst nums = [2, 7, 11, 15];\nconst target = 9;\nconsole.log(twoSum(nums, target));`,
  python: `# Two Sum Solution\ndef two_sum(nums, target):\n    num_map = {}\n    \n    for i, num in enumerate(nums):\n        complement = target - num\n        \n        if complement in num_map:\n            return [num_map[complement], i]\n        \n        num_map[num] = i\n    \n    return []\n\n# Test the function\nnums = [2, 7, 11, 15]\ntarget = 9\nprint(two_sum(nums, target))`,
  java: `// Two Sum Solution\nimport java.util.*;\n\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        \n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            \n            if (map.containsKey(complement)) {\n                return new int[]{map.get(complement), i};\n            }\n            \n            map.put(nums[i], i);\n        }\n        \n        return new int[]{};\n    }\n    \n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[] nums = {2, 7, 11, 15};\n        int target = 9;\n        System.out.println(Arrays.toString(sol.twoSum(nums, target)));\n    }\n}`,
  cpp: `// Two Sum Solution\n#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> map;\n        \n        for (int i = 0; i < nums.size(); i++) {\n            int complement = target - nums[i];\n            \n            if (map.find(complement) != map.end()) {\n                return {map[complement], i};\n            }\n            \n            map[nums[i]] = i;\n        }\n        \n        return {};\n    }\n};\n\nint main() {\n    Solution sol;\n    vector<int> nums = {2, 7, 11, 15};\n    int target = 9;\n    vector<int> result = sol.twoSum(nums, target);\n    \n    cout << "[" << result[0] << ", " << result[1] << "]" << endl;\n    return 0;\n}`,
  typescript: `// Two Sum Solution\nfunction twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  \n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    \n    if (map.has(complement)) {\n      return [map.get(complement)!, i];\n    }\n    \n    map.set(nums[i], i);\n  }\n  \n  return [];\n}\n\n// Test the function\nconst nums: number[] = [2, 7, 11, 15];\nconst target: number = 9;\nconsole.log(twoSum(nums, target));`,
  go: `// Two Sum Solution\npackage main\n\nimport "fmt"\n\nfunc twoSum(nums []int, target int) []int {\n    numMap := make(map[int]int)\n    \n    for i, num := range nums {\n        complement := target - num\n        \n        if j, exists := numMap[complement]; exists {\n            return []int{j, i}\n        }\n        \n        numMap[num] = i\n    }\n    \n    return []int{}\n}\n\nfunc main() {\n    nums := []int{2, 7, 11, 15}\n    target := 9\n    fmt.Println(twoSum(nums, target))\n}`,
  rust: `// Two Sum Solution\nuse std::collections::HashMap;\n\nfn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n    let mut map = HashMap::new();\n    \n    for (i, num) in nums.iter().enumerate() {\n        let complement = target - num;\n        \n        if let Some(&j) = map.get(&complement) {\n            return vec![j as i32, i as i32];\n        }\n        \n        map.insert(num, i);\n    }\n    \n    vec![]\n}\n\nfn main() {\n    let nums = vec![2, 7, 11, 15];\n    let target = 9;\n    println!("{:?}", two_sum(nums, target));\n}`,
};

type TabData = {
  id: string;
  name: string;
  language: string;
  code: string;
  isModified: boolean;
};

type ProblemData = {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  hints: string[];
};

export default function EnhancedCodeEditor() {
  const [tabs, setTabs] = useState<TabData[]>([]);
  const [activeTabId, setActiveTabId] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [editingTabName, setEditingTabName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Timer state
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // UI state
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);

  const [showMinimap, setShowMinimap] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Layout state
  const [activeView, setActiveView] = useState('editor');
  const [showHints, setShowHints] = useState(false);
  
  const [problem] = useState<ProblemData>({
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    difficulty: "Easy",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]"
      }
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists."
    ],
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
      "Again, the best way would be to use a HashMap to store the numbers and their indices.",
      "The reason is that we can look up if the complement exists in O(1) time."
    ]
  });

  // Timer functions
  const startTimer = () => {
    setIsTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resetTimer = () => {
    setTime(0);
    stopTimer();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize with default tab
  useEffect(() => {
    const savedTabs = JSON.parse(localStorage.getItem('code-tabs') || '[]');
    if (savedTabs.length > 0) {
      setTabs(savedTabs);
      setActiveTabId(savedTabs[0].id);
    } else {
      createNewTab();
    }
    
    const savedSettings = JSON.parse(localStorage.getItem('editor-settings') || '{}');
    if (savedSettings.theme) setTheme(savedSettings.theme);
    if (savedSettings.fontSize) setFontSize(savedSettings.fontSize);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem('code-tabs', JSON.stringify(tabs));
    }
  }, [tabs]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const createNewTab = () => {
    const id = Date.now().toString();
    const newTab: TabData = {
      id,
      name: `Solution ${tabs.length + 1}`,
      language: 'javascript',
      code: defaultCode['javascript'],
      isModified: false,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(id);
  };

  const closeTab = (id: string) => {
    const updated = tabs.filter(t => t.id !== id);
    setTabs(updated);
    if (activeTabId === id && updated.length > 0) {
      setActiveTabId(updated[0].id);
    } else if (updated.length === 0) {
      createNewTab();
    }
  };

  const updateTab = (id: string, updates: Partial<TabData>) => {
    setTabs(prev =>
      prev.map(tab => tab.id === id ? { ...tab, ...updates, isModified: true } : tab)
    );
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const runCode = async () => {
    if (!activeTab) return;
    
    setIsRunning(true);
    setOutput('🚀 Running code...\n');
    
    // Simulate code execution
    setTimeout(() => {
      const results = [
        '✅ Test Case 1: PASSED\nInput: [2,7,11,15], target = 9\nExpected: [0,1]\nActual: [0,1]\n',
        '✅ Test Case 2: PASSED\nInput: [3,2,4], target = 6\nExpected: [1,2]\nActual: [1,2]\n',
        '✅ Test Case 3: PASSED\nInput: [3,3], target = 6\nExpected: [0,1]\nActual: [0,1]\n',
        '\n🎉 All test cases passed!\n⏱️  Runtime: 1ms\n💾 Memory: 10.2MB\n🏆 Beats 95.67% of submissions'
      ];
      
      setOutput(results.join(''));
      setIsRunning(false);
    }, 2000);
  };

  const analyzeCode = () => {
    if (!activeTab) return;
    
    setOutput('🔍 Analyzing code complexity...\n');
    
    setTimeout(() => {
      const analysis = `🤖 Code Analysis Results:

⏰ Time Complexity: O(n)
💾 Space Complexity: O(n)

📊 Algorithm Analysis:
• Uses hash map for O(1) lookups
• Single pass through the array
• Efficient space-time tradeoff

🎯 Optimization Score: 95/100
✨ Code is well-optimized!

📝 Suggestions:
• Consider edge cases for duplicate values
• Add input validation for robustness
• Good use of early return pattern`;
      
      setOutput(analysis);
    }, 1500);
  };

  const copyCode = async () => {
    if (activeTab) {
      await navigator.clipboard.writeText(activeTab.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CodeEditor = () => (
    <div className="relative h-full overflow-hidden">
      <Textarea
        value={activeTab?.code || ''}
        onChange={(e) => activeTab && updateTab(activeTab.id, { code: e.target.value })}
        className="h-full font-mono text-sm resize-none bg-gray-900 text-green-400 border-0"
        style={{ fontSize: `${fontSize}px` }}
        placeholder="// Start coding here..."
      />
      <div className="absolute bottom-2 right-2 flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={copyCode}
          className="bg-white backdrop-blur-sm"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-background`}>
      <div className={'h-[95vh] flex flex-col p-4 space-y-4'}>
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-lg">{formatTime(time)}</span>
              <Button size="sm" variant="ghost" onClick={isTimerRunning ? stopTimer : startTimer}>
                {isTimerRunning ? 'Pause' : 'Start'}
              </Button>
              <Button size="sm" variant="ghost" onClick={resetTimer}>
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <PanelGroup direction="horizontal" className="flex-1">
          
          {/* Left Panel - Problem & Navigation */}
          <Panel defaultSize={25} minSize={20}>
            <Card className="h-full">
              <Tabs value={activeView} onValueChange={setActiveView} className="h-full p-1 flex flex-col">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="problem"><BookOpen className="w-4 h-4 mr-1" />Problem</TabsTrigger>
                  <TabsTrigger value="discuss"><Users className="w-4 h-4 mr-1" />Discuss</TabsTrigger>
                  <TabsTrigger value="submissions"><Trophy className="w-4 h-4 mr-1" />Submit</TabsTrigger>
                </TabsList>
                
                <TabsContent value="problem" className="flex-1 overflow-auto">
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold">{problem.title}</h2>
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {problem.description}
                    </p>
                    
                    <div className="space-y-3">
                      <h3 className="font-medium">Examples:</h3>
                      {problem.examples.map((example, i) => (
                        <div key={i} className="bg-muted p-3 rounded text-xs">
                          <div><strong>Input:</strong> {example.input}</div>
                          <div><strong>Output:</strong> {example.output}</div>
                          {example.explanation && (
                            <div className="mt-1 text-muted-foreground">
                              <strong>Explanation:</strong> {example.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Constraints:</h3>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        {problem.constraints.map((constraint, i) => (
                          <li key={i}>• {constraint}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Hints:</h3>
                        <Button size="sm" variant="ghost" onClick={() => setShowHints(!showHints)}>
                          {showHints ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </Button>
                      </div>
                      {showHints && (
                        <div className="space-y-2">
                          {problem.hints.map((hint, i) => (
                            <div key={i} className="bg-blue-50 border-l-4 border-blue-400 p-2 text-xs">
                              <Lightbulb className="w-3 h-3 inline mr-1" />
                              {hint}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="discuss" className="flex-1">
                  <CardContent>
                    <div className="text-center text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Discussion coming soon!</p>
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="submissions" className="flex-1">
                  <CardContent>
                    <div className="text-center text-muted-foreground">
                      <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Submissions history coming soon!</p>
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </Panel>
          
          <PanelResizeHandle className="w-1 m-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 hover:dark:bg-gray-600" />
          
          {/* Right Panel - Editor & Output */}
          <Panel defaultSize={75}>
            <PanelGroup direction="vertical">
              
              {/* Code Editor Panel */}
              <Panel defaultSize={65} minSize={30}>
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Tabs */}
                        <Tabs value={activeTabId} onValueChange={setActiveTabId}>
                          <TabsList className="h-8">
                            {tabs.map((tab) => (
                              <TabsTrigger key={tab.id} value={tab.id} className="relative text-xs px-2">
                                {editingTabName === tab.id ? (
                                  <Input
                                    autoFocus
                                    defaultValue={tab.name}
                                    onBlur={(e) => {
                                      updateTab(tab.id, { name: e.target.value });
                                      setEditingTabName(null);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        updateTab(tab.id, { name: (e.target as HTMLInputElement).value });
                                        setEditingTabName(null);
                                      }
                                    }}
                                    className="h-5 w-20 text-xs"
                                  />
                                ) : (
                                  <span 
                                    onDoubleClick={() => setEditingTabName(tab.id)} 
                                    className="flex items-center gap-1"
                                  >
                                    {tab.name}
                                    {tab.isModified && <div className="w-1 h-1 bg-orange-400 rounded-full" />}
                                  </span>
                                )}
                                {tabs.length > 1 && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="ml-1 h-4 w-4 p-0 hover:bg-red-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      closeTab(tab.id);
                                    }}
                                  >
                                    <X className="h-2 w-2" />
                                  </Button>
                                )}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </Tabs>
                        
                        <Button size="sm" variant="outline" onClick={createNewTab}>
                          <Plus className="w-3 h-3 mr-1" />
                          New
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Select
                          value={activeTab?.language || 'javascript'}
                          onValueChange={(lang) => activeTab && updateTab(activeTab.id, {
                            language: lang,
                            code: defaultCode[lang],
                          })}
                        >
                          <SelectTrigger className="w-32 h-8">
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
                          <Settings className="w-3 h-3 mr-1" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-2 flex-1">
                    <CodeEditor />
                  </CardContent>
                </Card>
              </Panel>
              
              <PanelResizeHandle className="h-1 bg-gray-200 m-1 hover:bg-gray-300 dark:bg-gray-700 hover:dark:bg-gray-600" />
              
              {/* Output Panel */}
              <Panel defaultSize={35} minSize={20}>
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        <CardTitle className="text-sm">Output</CardTitle>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button size="sm" onClick={runCode} disabled={isRunning}>
                          {isRunning ? <Zap className="w-3 h-3 mr-1 animate-pulse" /> : <Play className="w-3 h-3 mr-1" />}
                          {isRunning ? 'Running...' : 'Run'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={analyzeCode}>
                          <Brain className="w-3 h-3 mr-1" />
                          Analyze
                        </Button>
                        <Button size="sm" variant="outline">
                          <Target className="w-3 h-3 mr-1" />
                          Submit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-2 flex-1">
                    <div className="h-full bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-auto border">
                      <pre className="whitespace-pre-wrap">
                        {output || '💡 Output will appear here...\n\nClick "Run" to test your code\nClick "Analyze" for complexity analysis'}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}