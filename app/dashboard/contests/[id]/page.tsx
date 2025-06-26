'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  ArrowLeft,
  Play,
  BookOpen,
  Target,
  CheckCircle,
  AlertCircle,
  Star,
  Share2,
  Download,
  Eye,
  Code,
  Brain,
  Zap,
  X,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSimpleToast } from '@/components/ui/simple-toast';

// Static contest data
const staticContests = {
  '1': {
    id: '1',
    title: 'DSA Master Challenge 2024',
    description: 'A comprehensive contest covering various data structures and algorithms',
    status: 'active',
    startDate: '2024-12-25T10:00:00Z',
    duration: '3 hours',
    participants: 150,
    problems: 5,
    topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Greedy Algorithms'],
    problemsList: [
      {
        id: '1',
        title: 'Two Sum Variations',
        difficulty: 'easy',
        points: 100,
        solved: false,
        timeLimit: '1 second',
        memoryLimit: '256 MB'
      },
      {
        id: '2',
        title: 'Binary Tree Traversal',
        difficulty: 'easy',
        points: 150,
        solved: false,
        timeLimit: '1 second',
        memoryLimit: '256 MB'
      },
      {
        id: '3',
        title: 'Graph Connectivity',
        difficulty: 'medium',
        points: 200,
        solved: false,
        timeLimit: '2 seconds',
        memoryLimit: '512 MB'
      },
      {
        id: '4',
        title: 'Dynamic Programming Optimization',
        difficulty: 'medium',
        points: 250,
        solved: false,
        timeLimit: '2 seconds',
        memoryLimit: '512 MB'
      },
      {
        id: '5',
        title: 'Advanced Algorithm Design',
        difficulty: 'hard',
        points: 300,
        solved: false,
        timeLimit: '3 seconds',
        memoryLimit: '1 GB'
      }
    ],
    leaderboard: [
      { rank: 1, username: 'algo_master', problemsSolved: 5, points: 1000, time: 45 },
      { rank: 2, username: 'code_ninja', problemsSolved: 4, points: 850, time: 67 },
      { rank: 3, username: 'dsa_expert', problemsSolved: 4, points: 800, time: 89 },
      { rank: 4, username: 'problem_solver', problemsSolved: 3, points: 650, time: 120 },
      { rank: 5, username: 'algorithm_fan', problemsSolved: 3, points: 600, time: 145 }
    ],
    rules: [
      'All solutions must be submitted within the time limit',
      'Plagiarism is strictly prohibited',
      'You can use any programming language',
      'Internet access is allowed for documentation only',
      'Collaboration is not permitted during the contest'
    ]
  },
  '2': {
    id: '2',
    title: 'System Design Sprint',
    description: 'Design scalable systems and solve real-world engineering challenges',
    status: 'upcoming',
    startDate: '2024-12-30T14:00:00Z',
    duration: '4 hours',
    participants: 75,
    problems: 3,
    topics: ['System Design', 'Scalability', 'Database Design', 'API Design', 'Microservices'],
    problemsList: [
      {
        id: '1',
        title: 'Design URL Shortener',
        difficulty: 'medium',
        points: 200,
        solved: false,
        timeLimit: '2 hours',
        memoryLimit: 'N/A'
      },
      {
        id: '2',
        title: 'Design Chat Application',
        difficulty: 'hard',
        points: 300,
        solved: false,
        timeLimit: '2 hours',
        memoryLimit: 'N/A'
      },
      {
        id: '3',
        title: 'Design E-commerce Platform',
        difficulty: 'hard',
        points: 400,
        solved: false,
        timeLimit: '3 hours',
        memoryLimit: 'N/A'
      }
    ],
    leaderboard: [],
    rules: [
      'Focus on system architecture and scalability',
      'Include database schema and API specifications',
      'Consider performance and reliability requirements',
      'Document your design decisions clearly'
    ]
  }
};

export default function ContestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error } = useSimpleToast();
  const [isJoining, setIsJoining] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const contestId = params.id as string;
  const contest = staticContests[contestId as keyof typeof staticContests];

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Contest Not Found</h2>
          <p className="text-muted-foreground mb-4">The contest you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/dashboard/contests')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contests
          </Button>
        </div>
      </div>
    );
  }

  const handleJoinContest = async () => {
    setIsJoining(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      success('Successfully joined the contest!');
      router.push(`/dashboard/contests/${contestId}/problems`);
    } catch (error: any) {
      error('Failed to join contest');
    } finally {
      setIsJoining(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{contest.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge className={getStatusColor(contest.status)}>
                    {contest.status}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {contest.participants} participants
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Star className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Contest Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{contest.title}</CardTitle>
                    <CardDescription className="text-lg">
                      {contest.description}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(contest.status)}>
                    {contest.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(contest.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{contest.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{contest.participants} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{contest.problems} problems</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Topics Covered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Topics Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {contest.topics.map((topic) => (
                    <Badge key={topic} variant="outline" className="text-sm">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Problems List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Problems
                </CardTitle>
                <CardDescription>Solve these problems to improve your ranking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contest.problemsList.map((problem, index) => (
                    <motion.div
                      key={problem.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {problem.id}
                        </div>
                        <div>
                          <h4 className="font-medium">{problem.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getDifficultyColor(problem.difficulty)}>
                              {problem.difficulty}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {problem.points} points
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>Time: {problem.timeLimit}</span>
                            <span>Memory: {problem.memoryLimit}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {problem.solved && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Problem
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Leaderboard */}
          {contest.leaderboard.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Leaderboard
                  </CardTitle>
                  <CardDescription>Top performers in this contest</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contest.leaderboard.map((entry, index) => (
                      <motion.div
                        key={entry.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                            entry.rank === 2 ? 'bg-gray-100 text-gray-800' :
                            entry.rank === 3 ? 'bg-orange-100 text-orange-800' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {entry.rank}
                          </div>
                          <div>
                            <h4 className="font-medium">{entry.username}</h4>
                            <p className="text-sm text-muted-foreground">
                              {entry.problemsSolved}/{contest.problems} problems solved
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{entry.points} points</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.time} minutes
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Rules Modal */}
          {showRules && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowRules(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-2xl bg-background rounded-xl shadow-2xl border p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Contest Rules</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowRules(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {contest.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm">{rule}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4"
          >
            <Button 
              className="flex-1" 
              size="lg"
              onClick={handleJoinContest}
              disabled={isJoining || contest.status === 'ended'}
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {contest.status === 'ended' ? 'Contest Ended' : 'Join Contest'}
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setShowRules(true)}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              View Rules
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
