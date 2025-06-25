import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Trophy, 
  Target, 
  Calendar,
  Settings,
  Edit,
  Award,
  TrendingUp
} from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and view your progress
        </p>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">John Doe</h3>
                <p className="text-muted-foreground">john.doe@example.com</p>
                <Badge variant="secondary">Premium Member</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Member since</span>
                <span className="text-sm font-medium">January 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last active</span>
                <span className="text-sm font-medium">2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Timezone</span>
                <span className="text-sm font-medium">UTC-5</span>
              </div>
            </div>
            
            <Button className="w-full">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-sm text-muted-foreground">Problems Solved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-sm text-muted-foreground">Notes Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">8</div>
                <div className="text-sm text-muted-foreground">Contests Won</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">87%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>
            Your earned badges and accomplishments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Award className="h-8 w-8 text-yellow-500" />
              <div>
                <h4 className="font-semibold">First Problem</h4>
                <p className="text-sm text-muted-foreground">Solved your first problem</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Trophy className="h-8 w-8 text-blue-500" />
              <div>
                <h4 className="font-semibold">Contest Winner</h4>
                <p className="text-sm text-muted-foreground">Won your first contest</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <h4 className="font-semibold">Streak Master</h4>
                <p className="text-sm text-muted-foreground">7-day coding streak</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Solved "Two Sum" problem</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge variant="secondary">Easy</Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Created note on Dynamic Programming</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <Badge variant="outline">Note</Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Won Weekly Contest #123</p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
              <Badge variant="default">1st Place</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 