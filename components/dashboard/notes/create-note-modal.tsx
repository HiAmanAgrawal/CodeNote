'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  X, 
  Plus, 
  BookOpen, 
  Tag, 
  Sparkles,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Brain,
  Code,
  Target,
  Calendar,
  Star
} from 'lucide-react';
import { useSimpleToast } from '@/components/ui/simple-toast';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteCreated: (note: any) => void;
}

const categories = [
  { value: 'algorithms', label: 'Algorithms', icon: Code },
  { value: 'data-structures', label: 'Data Structures', icon: Target },
  { value: 'system-design', label: 'System Design', icon: Brain },
  { value: 'leetcode', label: 'LeetCode', icon: BookOpen },
  { value: 'interview', label: 'Interview Prep', icon: Star },
  { value: 'general', label: 'General', icon: Calendar }
];

const difficultyLevels = [
  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-800' }
];

export function CreateNoteModal({ isOpen, onClose, onNoteCreated }: CreateNoteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    difficulty: '',
    tags: [] as string[],
    isFavorite: false
  });
  const [tagInput, setTagInput] = useState('');
  const { toast } = useSimpleToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newNote = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      onNoteCreated(newNote);
      toast.success('Note created successfully!');
      onClose();
      resetForm();
    } catch (error) {
      toast.error('Failed to create note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateNote = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFormData(prev => ({
        ...prev,
        title: 'Binary Search Implementation',
        content: `# Binary Search Algorithm

## Overview
Binary search is an efficient algorithm for finding an element in a sorted array.

## Implementation
\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
\`\`\`

## Time Complexity
- **Time**: O(log n)
- **Space**: O(1)

## Use Cases
- Finding elements in sorted arrays
- Range queries
- Optimization problems`,
        category: 'algorithms',
        difficulty: 'medium',
        tags: ['binary-search', 'algorithms', 'python']
      }));
      
      toast.success('AI-generated note created!');
    } catch (error) {
      toast.error('Failed to generate note');
    } finally {
      setIsGenerating(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      difficulty: '',
      tags: [],
      isFavorite: false
    });
    setTagInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-xl shadow-2xl border"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Plus className="w-6 h-6 text-primary" />
                    Create New Note
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* AI Generation Section */}
                  <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">AI-Powered Note Generation</h3>
                      </div>
                      <Button
                        type="button"
                        onClick={handleGenerateNote}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Generate with AI
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Let AI create a comprehensive note based on your topic or let us suggest content.
                    </p>
                  </div>

                  {/* Title Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      placeholder="Enter note title..."
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="text-lg"
                      required
                    />
                  </div>

                  {/* Category and Difficulty */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center gap-2">
                                <category.icon className="w-4 h-4" />
                                {category.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Difficulty</label>
                      <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficultyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              <Badge className={level.color}>
                                {level.label}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <div className="flex gap-2 flex-wrap">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => removeTag(tag)}
                        >
                          {tag}
                          <X className="w-3 h-3" />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1"
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      placeholder="Write your note content here... (Supports Markdown)"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      className="min-h-[200px] resize-none"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Supports Markdown formatting for better organization
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="favorite"
                        checked={formData.isFavorite}
                        onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
                        className="rounded"
                      />
                      <label htmlFor="favorite" className="text-sm">Mark as favorite</label>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Create Note
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 