import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Clock, 
  Users, 
  Calendar,
  Star,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import Link from 'next/link';

export default function ContestsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contests</h1>
          <p className="text-muted-foreground">
            Compete with other coders and test your skills
          </p>
        </div>
        <Button>
          <Trophy className="mr-2 h-4 w-4" />
          Create Contest
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search contests..."
                className="px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">All</Badge>
              <Badge variant="secondary">Upcoming</Badge>
              <Badge variant="outline">Past</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Contests */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Contests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Weekly Contest #124</CardTitle>
                <Badge variant="default">Live</Badge>
              </div>
              <CardDescription>
                4 problems • 90 minutes • 1,234 participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Starts in 2 hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">1,234 registered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">$500 prize pool</span>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/contests/124">Join Contest</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Algorithm Master Challenge</CardTitle>
                <Badge variant="secondary">Upcoming</Badge>
              </div>
              <CardDescription>
                6 problems • 3 hours • 567 participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Tomorrow at 10:00 AM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">567 registered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">$1,000 prize pool</span>
                </div>
                <Button variant="outline" className="w-full">
                  Register
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Data Structures Sprint</CardTitle>
                <Badge variant="secondary">Upcoming</Badge>
              </div>
              <CardDescription>
                5 problems • 2 hours • 890 participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Next Saturday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">890 registered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">$750 prize pool</span>
                </div>
                <Button variant="outline" className="w-full">
                  Register
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Past Contests */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Past Contests</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <h3 className="font-semibold">Weekly Contest #123</h3>
                    <p className="text-sm text-muted-foreground">
                      Completed 3 days ago • 4 problems • 1,156 participants
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">1st Place</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Score: 2800</p>
                  <Button variant="outline" size="sm">
                    View Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Trophy className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">Dynamic Programming Challenge</h3>
                    <p className="text-sm text-muted-foreground">
                      Completed 1 week ago • 6 problems • 789 participants
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-semibold">3rd Place</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Score: 2400</p>
                  <Button variant="outline" size="sm">
                    View Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Trophy className="h-8 w-8 text-gray-500" />
                  <div>
                    <h3 className="font-semibold">Graph Algorithms Contest</h3>
                    <p className="text-sm text-muted-foreground">
                      Completed 2 weeks ago • 5 problems • 1,023 participants
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">15th Place</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Score: 1800</p>
                  <Button variant="outline" size="sm">
                    View Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
