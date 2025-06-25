import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  CheckCircle, 
  Circle, 
  ArrowRight,
  BookOpen,
  Code,
  Trophy,
  Clock,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const roadmapData = [
  {
    id: 1,
    title: "Arrays & Strings",
    description: "Master basic array operations and string manipulation",
    progress: 100,
    completed: true,
    topics: ["Two Pointers", "Sliding Window", "Prefix Sum", "Kadane's Algorithm"],
    problems: 15,
    estimatedTime: "2 weeks"
  },
  {
    id: 2,
    title: "Linked Lists",
    description: "Learn linked list operations and common patterns",
    progress: 80,
    completed: false,
    topics: ["Fast & Slow Pointers", "Reversal", "Cycle Detection", "Merge Lists"],
    problems: 12,
    estimatedTime: "1.5 weeks"
  },
  {
    id: 3,
    title: "Stacks & Queues",
    description: "Understand stack and queue data structures",
    progress: 60,
    completed: false,
    topics: ["Monotonic Stack", "Queue Implementation", "Priority Queue", "Deque"],
    problems: 10,
    estimatedTime: "1 week"
  },
  {
    id: 4,
    title: "Trees & Binary Search Trees",
    description: "Master tree traversal and BST operations",
    progress: 40,
    completed: false,
    topics: ["DFS/BFS", "Inorder/Preorder/Postorder", "BST Validation", "Tree Construction"],
    problems: 18,
    estimatedTime: "3 weeks"
  },
  {
    id: 5,
    title: "Graphs",
    description: "Learn graph algorithms and traversal techniques",
    progress: 20,
    completed: false,
    topics: ["DFS/BFS", "Topological Sort", "Shortest Path", "Union Find"],
    problems: 20,
    estimatedTime: "4 weeks"
  },
  {
    id: 6,
    title: "Dynamic Programming",
    description: "Master DP patterns and optimization techniques",
    progress: 0,
    completed: false,
    topics: ["Memoization", "Tabulation", "State Compression", "Optimization"],
    problems: 25,
    estimatedTime: "5 weeks"
  }
];

export default function RoadmapPage() {
  const totalProgress = Math.round(
    roadmapData.reduce((sum, item) => sum + item.progress, 0) / roadmapData.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Learning Roadmap</h1>
        <p className="text-muted-foreground">
          Follow this structured path to master Data Structures & Algorithms
        </p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>
            Your journey through the DSA roadmap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{totalProgress}%</span>
            </div>
            <Progress value={totalProgress} className="w-full" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">1</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">2</div>
                <div className="text-xs text-muted-foreground">Not Started</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">100</div>
                <div className="text-xs text-muted-foreground">Problems Solved</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Items */}
      <div className="space-y-6">
        {roadmapData.map((item, index) => (
          <Card key={item.id} className="relative">
            {index < roadmapData.length - 1 && (
              <div className="absolute left-8 top-16 w-0.5 h-16 bg-border"></div>
            )}
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                {/* Progress Circle */}
                <div className="relative">
                  {item.completed ? (
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Circle className="h-8 w-8 text-blue-600" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-background border-2 border-border rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{item.id}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <Badge variant={item.completed ? "default" : "secondary"}>
                        {item.completed ? "Completed" : `${item.progress}%`}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">{item.description}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="w-full" />
                  </div>

                  {/* Topics */}
                  <div>
                    <h4 className="font-medium mb-2">Key Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {item.topics.map((topic) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{item.problems}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{item.estimatedTime}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Est. Time</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {item.completed ? "100%" : `${item.progress}%`}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">Complete</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button asChild>
                      <Link href={`/dashboard/editor?topic=${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Practice Problems
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/notes?topic=${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        View Notes
                      </Link>
                    </Button>
                    {!item.completed && (
                      <Button variant="outline" size="sm">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Start Learning
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
          <CardDescription>
            Based on your current progress, here's what you should focus on
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Complete Linked Lists</h4>
                  <p className="text-sm text-muted-foreground">You're 80% done with this topic</p>
                </div>
              </div>
              <Button size="sm">
                Continue
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Practice Stacks & Queues</h4>
                  <p className="text-sm text-muted-foreground">Focus on monotonic stack problems</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Start
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
