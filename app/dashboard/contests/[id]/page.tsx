import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Trophy } from 'lucide-react';
import { initializeLangChain } from '@/lib/langchain/init';

interface ContestDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ContestDetailPage({ params }: ContestDetailPageProps) {
  await initializeLangChain();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Contest Details</h1>
        <p className="text-muted-foreground">Contest ID: {params.id}</p>
      </div>

      <div className="grid gap-6">
        {/* Contest Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Sample DSA Contest</CardTitle>
                <CardDescription>
                  A comprehensive contest covering various data structures and algorithms
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Dec 25, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">3 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">150 participants</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">5 problems</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contest Description */}
        <Card>
          <CardHeader>
            <CardTitle>About This Contest</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This contest is designed to test your knowledge of fundamental data structures and algorithms. 
              It includes problems ranging from basic concepts to advanced optimization techniques.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold">Topics Covered:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Arrays</Badge>
                <Badge variant="outline">Linked Lists</Badge>
                <Badge variant="outline">Trees</Badge>
                <Badge variant="outline">Graphs</Badge>
                <Badge variant="outline">Dynamic Programming</Badge>
                <Badge variant="outline">Greedy Algorithms</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problems List */}
        <Card>
          <CardHeader>
            <CardTitle>Problems</CardTitle>
            <CardDescription>Solve these problems to improve your ranking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((problemId) => (
                <div key={problemId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {problemId}
                    </div>
                    <div>
                      <h4 className="font-medium">Problem {problemId}</h4>
                      <p className="text-sm text-muted-foreground">
                        Difficulty: {problemId <= 2 ? 'Easy' : problemId <= 4 ? 'Medium' : 'Hard'}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Problem
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>Top performers in this contest</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((rank) => (
                <div key={rank} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      rank === 2 ? 'bg-gray-100 text-gray-800' :
                      rank === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {rank}
                    </div>
                    <div>
                      <h4 className="font-medium">User {rank}</h4>
                      <p className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 5) + 1}/5 problems solved
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{Math.floor(Math.random() * 300) + 100} points</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.floor(Math.random() * 180) + 30} minutes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button className="flex-1" size="lg">
            Join Contest
          </Button>
          <Button variant="outline" size="lg">
            View Rules
          </Button>
        </div>
      </div>
    </div>
  );
}
