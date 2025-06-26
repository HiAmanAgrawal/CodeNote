'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  BookOpen, 
  Code, 
  Target, 
  Brain,
  Calendar,
  Clock,
  Eye,
  MoreVertical,
  Sparkles,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { CreateNoteModal } from '@/components/dashboard/notes/create-note-modal';
import { useSimpleToast } from '@/components/ui/simple-toast';

// Mock data
const mockNotes = [
  {
    id: '1',
    title: 'Binary Search Algorithm Implementation',
    excerpt: 'Comprehensive guide to binary search with multiple implementations and complexity analysis...',
    category: 'algorithms',
    difficulty: 'medium',
    tags: ['binary-search', 'algorithms', 'python'],
    isFavorite: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    views: 42,
    readingTime: '8 min read'
  },
  {
    id: '2',
    title: 'Dynamic Programming Patterns',
    excerpt: 'Common DP patterns including memoization, tabulation, and state compression...',
    category: 'algorithms',
    difficulty: 'hard',
    tags: ['dynamic-programming', 'algorithms', 'leetcode'],
    isFavorite: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    views: 28,
    readingTime: '12 min read'
  },
  {
    id: '3',
    title: 'System Design: URL Shortener',
    excerpt: 'Complete system design for a URL shortening service with scalability considerations...',
    category: 'system-design',
    difficulty: 'medium',
    tags: ['system-design', 'scalability', 'distributed-systems'],
    isFavorite: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    views: 35,
    readingTime: '15 min read'
  }
];

const categories = [
  { value: 'all', label: 'All', icon: BookOpen },
  { value: 'algorithms', label: 'Algorithms', icon: Code },
  { value: 'data-structures', label: 'Data Structures', icon: Target },
  { value: 'system-design', label: 'System Design', icon: Brain },
  { value: 'leetcode', label: 'LeetCode', icon: BookOpen }
];

export default function NotesPage() {
  const [notes, setNotes] = useState(mockNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { success, error } = useSimpleToast();

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateNote = (newNote: any) => {
    setNotes(prev => [newNote, ...prev]);
  };

  const handleGenerateNotes = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const generatedNotes = [
        {
          id: Date.now().toString(),
          title: 'Graph Algorithms: DFS vs BFS',
          excerpt: 'Deep dive into depth-first search and breadth-first search algorithms with implementation examples...',
          category: 'algorithms',
          difficulty: 'medium',
          tags: ['graphs', 'dfs', 'bfs', 'algorithms'],
          isFavorite: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          views: 0,
          readingTime: '10 min read'
        },
        {
          id: (Date.now() + 1).toString(),
          title: 'Database Indexing Strategies',
          excerpt: 'Comprehensive guide to database indexing including B-trees, hash indexes, and composite indexes...',
          category: 'system-design',
          difficulty: 'hard',
          tags: ['database', 'indexing', 'performance'],
          isFavorite: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          views: 0,
          readingTime: '14 min read'
        }
      ];
      
      setNotes(prev => [...generatedNotes, ...prev]);
      success('AI generated 2 new notes for you!');
    } catch (error: any) {
      error('Failed to generate notes');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'algorithms': return Code;
      case 'data-structures': return Target;
      case 'system-design': return Brain;
      default: return BookOpen;
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">My Notes</h1>
            <p className="text-muted-foreground">Organize and manage your learning notes</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={handleGenerateNotes}
              disabled={isGenerating}
              variant="outline"
              className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Generate
                </>
              )}
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Note
            </Button>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                >
                  <category.icon className="w-4 h-4 mr-1" />
                  {category.label}
                </Button>
              ))}
            </div>
            
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none rounded-l-lg"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none rounded-r-lg"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Notes Grid/List */}
        <AnimatePresence mode="wait">
          {filteredNotes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notes found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start by creating your first note'
                }
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Note
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
              }
            >
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/dashboard/notes/${note.id}`}>
                    <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 mb-2">
                            {React.createElement(getCategoryIcon(note.category), { 
                              className: "w-4 h-4 text-primary" 
                            })}
                            <Badge className={getDifficultyColor(note.difficulty)}>
                              {note.difficulty}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            {note.isFavorite && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {note.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <CardDescription className="line-clamp-3 mb-4">
                          {note.excerpt}
                        </CardDescription>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {note.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {note.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{note.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {note.createdAt.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {note.readingTime}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {note.views}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Note Modal */}
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onNoteCreated={handleCreateNote}
      />
    </div>
  );
} 