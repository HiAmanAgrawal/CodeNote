'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ContestCard } from '@/components/dashboard/contest-card';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { 
  Code, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Target
} from 'lucide-react';

const stats = [
  {
    title: 'Problems Solved',
    value: 24,
    change: '+2 from last week',
    icon: Code,
    color: 'text-blue-500',
    delay: 0.1
  },
  {
    title: 'Notes Created',
    value: 156,
    change: '+12 from last week',
    icon: BookOpen,
    color: 'text-green-500',
    delay: 0.2
  },
  {
    title: 'Contests Won',
    value: 8,
    change: '+1 from last week',
    icon: Trophy,
    color: 'text-yellow-500',
    delay: 0.3
  },
  {
    title: 'Success Rate',
    value: '87%',
    change: '+3% from last week',
    icon: TrendingUp,
    color: 'text-purple-500',
    delay: 0.4
  }
];

const quickActions = [
  {
    title: 'Start Coding',
    href: '/dashboard/editor',
    icon: Code,
    color: 'text-blue-500'
  },
  {
    title: 'Create Note',
    href: '/dashboard/notes',
    icon: BookOpen,
    color: 'text-green-500'
  },
  {
    title: 'Join Contest',
    href: '/dashboard/contests',
    icon: Trophy,
    color: 'text-yellow-500'
  },
  {
    title: 'View Roadmap',
    href: '/dashboard/roadmap',
    icon: Target,
    color: 'text-purple-500'
  }
];

const activities = [
  {
    id: '1',
    type: 'success' as const,
    title: 'Solved "Two Sum"',
    time: '2 hours ago',
    badge: 'Easy',
    badgeVariant: 'secondary' as const
  },
  {
    id: '2',
    type: 'info' as const,
    title: 'Created note on Dynamic Programming',
    time: '1 day ago',
    badge: 'Note',
    badgeVariant: 'outline' as const
  },
  {
    id: '3',
    type: 'warning' as const,
    title: 'Won Weekly Contest #123',
    time: '3 days ago',
    badge: '1st Place',
    badgeVariant: 'default' as const
  }
];

const upcomingContests = [
  {
    id: '1',
    title: 'Weekly Contest #124',
    description: '4 problems • 90 minutes',
    timeLeft: 'Starts in 2 hours',
    problems: 4,
    duration: '90 minutes',
    color: 'text-yellow-500',
    isUpcoming: false
  },
  {
    id: '2',
    title: 'Algorithm Master Challenge',
    description: '6 problems • 3 hours',
    timeLeft: 'Tomorrow at 10:00 AM',
    problems: 6,
    duration: '3 hours',
    color: 'text-blue-500',
    isUpcoming: true
  }
];

export default function DashboardPage() {
  return (
    <AnimatedWrapper className="space-y-6 p-6">
      {/* Header */}
      <AnimatedWrapper
        delay={0.1}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's what's happening with your DSA journey.
        </p>
      </AnimatedWrapper>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatedWrapper
          delay={0.6}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Jump into coding or create new content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuickActions actions={quickActions} />
            </CardContent>
          </Card>
        </AnimatedWrapper>

        <AnimatedWrapper
          delay={0.7}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest coding sessions and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={activities} />
            </CardContent>
          </Card>
        </AnimatedWrapper>
      </div>

      {/* Upcoming Contests */}
      <AnimatedWrapper
        delay={0.8}
      >
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Contests</CardTitle>
            <CardDescription>
              Don't miss these coding competitions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingContests.map((contest, index) => (
                <ContestCard
                  key={contest.id}
                  {...contest}
                  onJoin={() => console.log('Join contest:', contest.id)}
                  onRemind={() => console.log('Remind contest:', contest.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </AnimatedWrapper>
    </AnimatedWrapper>
  );
} 