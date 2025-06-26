'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Search, 
  Filter, 
  TrendingUp, 
  Clock,
  Target,
  Users,
  Award
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatar?: string;
  score: number;
  problemsSolved: number;
  totalTime: number; // in minutes
  accuracy: number; // percentage
  submissions: number;
  lastSubmission: Date;
  isCurrentUser: boolean;
  country?: string;
  organization?: string;
  rating?: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  contestId: string;
  onUserClick?: (userId: string) => void;
  className?: string;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return null;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    case 2:
      return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    case 3:
      return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
    default:
      return 'bg-background hover:bg-muted/50';
  }
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  contestId,
  onUserClick,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'score' | 'problemsSolved' | 'accuracy'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState<'all' | 'top10' | 'top50' | 'currentUser'>('all');

  const filteredAndSortedEntries = useMemo(() => {
    let filtered = [...entries];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(entry =>
        entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.organization?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'top10':
        filtered = filtered.slice(0, 10);
        break;
      case 'top50':
        filtered = filtered.slice(0, 50);
        break;
      case 'currentUser':
        filtered = filtered.filter(entry => entry.isCurrentUser);
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number, bValue: number;

      switch (sortBy) {
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'problemsSolved':
          aValue = a.problemsSolved;
          bValue = b.problemsSolved;
          break;
        case 'accuracy':
          aValue = a.accuracy;
          bValue = b.accuracy;
          break;
        default:
          aValue = a.rank;
          bValue = b.rank;
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [entries, searchQuery, sortBy, sortOrder, filterBy]);

  const currentUserEntry = entries.find(entry => entry.isCurrentUser);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Leaderboard</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{entries.length} participants</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Participants</SelectItem>
              <SelectItem value="top10">Top 10</SelectItem>
              <SelectItem value="top50">Top 50</SelectItem>
              <SelectItem value="currentUser">My Position</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rank">Rank</SelectItem>
              <SelectItem value="score">Score</SelectItem>
              <SelectItem value="problemsSolved">Problems Solved</SelectItem>
              <SelectItem value="accuracy">Accuracy</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="w-full sm:w-auto"
          >
            <TrendingUp className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Current User Position */}
        {currentUserEntry && filterBy !== 'currentUser' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-primary/5 border border-primary/20 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="secondary">Your Position</Badge>
                <span className="font-medium">#{currentUserEntry.rank}</span>
                <span className="text-muted-foreground">{currentUserEntry.username}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{currentUserEntry.score} pts</span>
                <span>{currentUserEntry.problemsSolved} solved</span>
                <span>{currentUserEntry.accuracy}% accuracy</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        <div className="space-y-2">
          <AnimatePresence>
            {filteredAndSortedEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  getRankColor(entry.rank)
                } ${entry.isCurrentUser ? 'ring-2 ring-primary' : ''}`}
                onClick={() => onUserClick?.(entry.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 min-w-[60px]">
                    {getRankIcon(entry.rank)}
                    <span className="font-semibold">#{entry.rank}</span>
                  </div>
                  
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.avatar} alt={entry.username} />
                    <AvatarFallback>
                      {entry.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex flex-col">
                    <span className="font-medium">{entry.username}</span>
                    {entry.organization && (
                      <span className="text-xs text-muted-foreground">
                        {entry.organization}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">{entry.score}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold">{entry.problemsSolved}</div>
                    <div className="text-xs text-muted-foreground">solved</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold">{entry.accuracy}%</div>
                    <div className="text-xs text-muted-foreground">accuracy</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold">{formatTime(entry.totalTime)}</div>
                    <div className="text-xs text-muted-foreground">time</div>
                  </div>
                  
                  {entry.rating && (
                    <div className="text-center">
                      <div className="font-semibold">{entry.rating}</div>
                      <div className="text-xs text-muted-foreground">rating</div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredAndSortedEntries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-muted-foreground"
          >
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No participants found matching your criteria</p>
          </motion.div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {entries.length}
            </div>
            <div className="text-xs text-muted-foreground">Total Participants</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Math.max(...entries.map(e => e.problemsSolved))}
            </div>
            <div className="text-xs text-muted-foreground">Max Problems Solved</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.max(...entries.map(e => e.score))}
            </div>
            <div className="text-xs text-muted-foreground">Highest Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(entries.reduce((acc, e) => acc + e.accuracy, 0) / entries.length)}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Accuracy</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard; 