'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code, 
  FileText, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  Target,
  BarChart3,
  Copy,
  ExternalLink,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface TestCase {
  input: string;
  output: string;
  explanation?: string;
  isHidden?: boolean;
}

interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  description: string;
  examples: TestCase[];
  constraints: string[];
  followUp?: string;
  hints: string[];
  relatedTopics: string[];
  timeLimit: number; // in seconds
  memoryLimit: number; // in MB
  submissionCount: number;
  acceptanceRate: number;
  tags: string[];
}

interface ProblemViewerProps {
  problem: Problem;
  onSolve?: (problemId: string) => void;
  onViewSolution?: (problemId: string) => void;
  onViewDiscussion?: (problemId: string) => void;
  className?: string;
}

const difficultyConfig = {
  easy: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', label: 'Easy' },
  medium: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', label: 'Medium' },
  hard: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', label: 'Hard' },
};

export const ProblemViewer: React.FC<ProblemViewerProps> = ({
  problem,
  onSolve,
  onViewSolution,
  onViewDiscussion,
  className,
}) => {
  const [activeTab, setActiveTab] = useState('description');
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  const formatTimeLimit = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  const renderDescription = () => (
    <div className="space-y-6">
      {/* Problem Description */}
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: problem.description }} />
      </div>

      {/* Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Play className="h-5 w-5" />
          <span>Examples</span>
        </h3>
        
        {problem.examples.map((example, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Example {index + 1}:</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(`Input: ${example.input}\nOutput: ${example.output}`)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Input:</div>
                <SyntaxHighlighter
                  language="text"
                  style={tomorrow}
                  customStyle={{ margin: 0, borderRadius: '6px' }}
                >
                  {example.input}
                </SyntaxHighlighter>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Output:</div>
                <SyntaxHighlighter
                  language="text"
                  style={tomorrow}
                  customStyle={{ margin: 0, borderRadius: '6px' }}
                >
                  {example.output}
                </SyntaxHighlighter>
              </div>
            </div>
            
            {example.explanation && (
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Explanation:</div>
                <p className="text-sm text-muted-foreground">{example.explanation}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Constraints */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Constraints:</h3>
        <ul className="space-y-2">
          {problem.constraints.map((constraint, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start space-x-2"
            >
              <span className="text-primary mt-1">•</span>
              <span className="text-sm">{constraint}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Follow-up */}
      {problem.followUp && (
        <div className="border-l-4 border-primary/20 pl-4 py-2 bg-primary/5 rounded-r-lg">
          <h4 className="font-medium text-primary mb-2">Follow-up:</h4>
          <p className="text-sm text-muted-foreground">{problem.followUp}</p>
        </div>
      )}
    </div>
  );

  const renderHints = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <span>Hints</span>
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHints(!showHints)}
        >
          {showHints ? 'Hide Hints' : 'Show Hints'}
        </Button>
      </div>

      <AnimatePresence>
        {showHints && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {problem.hints.map((hint, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${
                  index === currentHintIndex
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-muted bg-muted/30'
                }`}
              >
                <div className="flex items-start space-x-2">
                  <Badge variant="outline" className="shrink-0">
                    Hint {index + 1}
                  </Badge>
                  <p className="text-sm">{hint}</p>
                </div>
              </motion.div>
            ))}
            
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentHintIndex(Math.max(0, currentHintIndex - 1))}
                disabled={currentHintIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentHintIndex(Math.min(problem.hints.length - 1, currentHintIndex + 1))}
                disabled={currentHintIndex === problem.hints.length - 1}
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderRelatedTopics = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Related Topics:</h3>
      <div className="flex flex-wrap gap-2">
        {problem.relatedTopics.map((topic, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10">
              {topic}
            </Badge>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <CardTitle className="text-xl">{problem.title}</CardTitle>
              <Badge className={difficultyConfig[problem.difficulty].color}>
                {difficultyConfig[problem.difficulty].label}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatTimeLimit(problem.timeLimit)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>{problem.memoryLimit}MB</span>
              </div>
              <div className="flex items-center space-x-1">
                <BarChart3 className="h-4 w-4" />
                <span>{problem.acceptanceRate.toFixed(1)}% acceptance</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDiscussion?.(problem.id)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Discussion
            </Button>
            <Button
              onClick={() => onSolve?.(problem.id)}
              className="flex items-center space-x-2"
            >
              <Code className="h-4 w-4" />
              <span>Solve</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Description</span>
            </TabsTrigger>
            <TabsTrigger value="hints" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Hints</span>
            </TabsTrigger>
            <TabsTrigger value="related" className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4" />
              <span>Related</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4">
            {renderDescription()}
          </TabsContent>

          <TabsContent value="hints" className="space-y-4">
            {renderHints()}
          </TabsContent>

          <TabsContent value="related" className="space-y-4">
            {renderRelatedTopics()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProblemViewer; 