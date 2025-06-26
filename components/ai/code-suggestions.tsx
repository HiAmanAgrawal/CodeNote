'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Copy, 
  Check, 
  X, 
  RotateCcw, 
  Lightbulb,
  Code,
  Zap,
  Brain,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeSuggestion {
  id: string;
  code: string;
  explanation: string;
  language: string;
  confidence: number;
  tags: string[];
  type: 'optimization' | 'bug-fix' | 'feature' | 'refactor';
  timestamp: Date;
  isAccepted?: boolean;
  isRejected?: boolean;
}

interface CodeSuggestionsProps {
  currentCode: string;
  language: string;
  problemContext?: string;
  onApplySuggestion?: (suggestion: CodeSuggestion) => void;
  onFeedback?: (suggestionId: string, isHelpful: boolean) => void;
  className?: string;
}

const suggestionTypes = {
  optimization: { label: 'Optimization', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  'bug-fix': { label: 'Bug Fix', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
  feature: { label: 'Feature', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  refactor: { label: 'Refactor', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
};

export const CodeSuggestions: React.FC<CodeSuggestionsProps> = ({
  currentCode,
  language,
  problemContext,
  onApplySuggestion,
  onFeedback,
  className,
}) => {
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [showQueryInput, setShowQueryInput] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  // Mock AI suggestions for development
  const mockSuggestions: CodeSuggestion[] = [
    {
      id: '1',
      code: `// Optimized solution using hash map
function twoSum(nums: number[], target: number): number[] {
    const seen = new Map<number, number>();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement)!, i];
        }
        seen.set(nums[i], i);
    }
    
    return [];
}`,
      explanation: 'This solution uses a hash map to achieve O(n) time complexity instead of O(n²) with nested loops.',
      language: 'typescript',
      confidence: 0.95,
      tags: ['optimization', 'hash-map', 'time-complexity'],
      type: 'optimization',
      timestamp: new Date(),
    },
    {
      id: '2',
      code: `// Add input validation
if (!nums || nums.length < 2) {
    throw new Error('Invalid input: array must have at least 2 elements');
}`,
      explanation: 'Add input validation to handle edge cases and prevent runtime errors.',
      language: 'typescript',
      confidence: 0.88,
      tags: ['validation', 'error-handling', 'edge-cases'],
      type: 'bug-fix',
      timestamp: new Date(),
    },
    {
      id: '3',
      code: `// Add JSDoc documentation
/**
 * Finds two numbers in the array that add up to the target
 * @param nums - Array of integers
 * @param target - Target sum
 * @returns Array of two indices whose values sum to target
 * @throws {Error} If no solution exists
 */
function twoSum(nums: number[], target: number): number[] {
    // ... existing code
}`,
      explanation: 'Adding comprehensive JSDoc documentation improves code readability and maintainability.',
      language: 'typescript',
      confidence: 0.92,
      tags: ['documentation', 'jsdoc', 'readability'],
      type: 'feature',
      timestamp: new Date(),
    },
  ];

  const generateSuggestions = async () => {
    setIsLoading(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would call an AI API
    setSuggestions(mockSuggestions);
    setIsLoading(false);
  };

  const handleApplySuggestion = (suggestion: CodeSuggestion) => {
    onApplySuggestion?.(suggestion);
    setSuggestions(prev => 
      prev.map(s => 
        s.id === suggestion.id 
          ? { ...s, isAccepted: true, isRejected: false }
          : s
      )
    );
  };

  const handleRejectSuggestion = (suggestionId: string) => {
    setSuggestions(prev => 
      prev.map(s => 
        s.id === suggestionId 
          ? { ...s, isRejected: true, isAccepted: false }
          : s
      )
    );
  };

  const handleFeedback = (suggestionId: string, isHelpful: boolean) => {
    onFeedback?.(suggestionId, isHelpful);
    // You could show a toast notification here
  };

  const askAI = async () => {
    if (!userQuery.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newSuggestion: CodeSuggestion = {
      id: crypto.randomUUID(),
      code: `// AI-generated response to: "${userQuery}"
// This is a placeholder response
console.log("AI suggestion for:", "${userQuery}");`,
      explanation: `AI response to your query: "${userQuery}"`,
      language,
      confidence: 0.85,
      tags: ['ai-generated', 'custom-query'],
      type: 'feature',
      timestamp: new Date(),
    };
    
    setSuggestions(prev => [newSuggestion, ...prev]);
    setUserQuery('');
    setShowQueryInput(false);
    setIsLoading(false);
  };

  useEffect(() => {
    if (currentCode.trim()) {
      generateSuggestions();
    }
  }, [currentCode, language]);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span>AI Code Suggestions</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQueryInput(!showQueryInput)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Ask AI
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={generateSuggestions}
              disabled={isLoading}
            >
              <RotateCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* AI Query Input */}
        <AnimatePresence>
          {showQueryInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 p-4 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Ask AI for help</span>
              </div>
              
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Ask about code optimization, debugging, or best practices..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="flex-1"
                  rows={2}
                />
                <Button
                  onClick={askAI}
                  disabled={!userQuery.trim() || isLoading}
                  className="shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-8"
          >
            <div className="text-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-500" />
              <p className="text-sm text-muted-foreground">Analyzing your code...</p>
            </div>
          </motion.div>
        )}

        {/* Suggestions List */}
        <AnimatePresence>
          {!isLoading && suggestions.length > 0 && (
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 transition-all duration-200 ${
                    suggestion.isAccepted
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : suggestion.isRejected
                      ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge className={suggestionTypes[suggestion.type].color}>
                        {suggestionTypes[suggestion.type].label}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(suggestion.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {!suggestion.isAccepted && !suggestion.isRejected && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApplySuggestion(suggestion)}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRejectSuggestion(suggestion.id)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                      
                      {suggestion.isAccepted && (
                        <Badge variant="secondary" className="text-green-600">
                          Applied
                        </Badge>
                      )}
                      
                      {suggestion.isRejected && (
                        <Badge variant="secondary" className="text-red-600">
                          Rejected
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {suggestion.explanation}
                    </p>

                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSuggestion(
                          selectedSuggestion === suggestion.id ? null : suggestion.id
                        )}
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      
                      <SyntaxHighlighter
                        language={suggestion.language}
                        style={tomorrow}
                        customStyle={{
                          margin: 0,
                          borderRadius: '6px',
                          fontSize: '12px',
                          maxHeight: selectedSuggestion === suggestion.id ? 'none' : '120px',
                          overflow: 'hidden',
                        }}
                      >
                        {suggestion.code}
                      </SyntaxHighlighter>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {suggestion.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(suggestion.id, true)}
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(suggestion.id, false)}
                          className="h-6 w-6 p-0"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isLoading && suggestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-muted-foreground"
          >
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No suggestions available</p>
            <p className="text-sm">Try writing some code or asking AI for help</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeSuggestions; 