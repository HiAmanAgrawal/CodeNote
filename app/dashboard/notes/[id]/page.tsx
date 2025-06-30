'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownReader } from '@/components/ui/markdown-reader';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  Star, 
  Share2, 
  Download, 
  Trash2,
  BookOpen,
  Tag,
  Calendar,
  Clock,
  Eye,
  Code,
  Target,
  Brain,
  CheckCircle,
  AlertCircle,
  Loader2,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSimpleToast } from '@/components/ui/simple-toast';

// Mock data for demonstration
const mockNote = {
  id: '1',
  title: 'Binary Search Algorithm Implementation',
  content: `# Binary Search Algorithm

## Overview
Binary search is an efficient algorithm for finding an element in a sorted array. It works by repeatedly dividing the search interval in half.

## Implementation

### Python
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

# Example usage
arr = [1, 3, 5, 7, 9, 11, 13, 15]
target = 7
result = binary_search(arr, target)
print(f"Element found at index: {result}")
\`\`\`

### JavaScript
\`\`\`javascript
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// Example usage
const arr = [1, 3, 5, 7, 9, 11, 13, 15];
const target = 7;
const result = binarySearch(arr, target);
console.log(\`Element found at index: \${result}\`);
\`\`\`

### Java
\`\`\`java
public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return -1;
    }
    
    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11, 13, 15};
        int target = 7;
        int result = binarySearch(arr, target);
        System.out.println("Element found at index: " + result);
    }
}
\`\`\`

## Time Complexity Analysis

### Time Complexity
- **Best Case**: O(1) - Element found at middle
- **Average Case**: O(log n) - Element found after log n comparisons
- **Worst Case**: O(log n) - Element not found

### Space Complexity
- **Iterative**: O(1) - Constant extra space
- **Recursive**: O(log n) - Call stack space

## Key Points

1. **Prerequisite**: Array must be sorted
2. **Efficiency**: Much faster than linear search for large datasets
3. **Applications**: 
   - Finding elements in sorted arrays
   - Range queries
   - Optimization problems
   - Database indexing

## Common Variations

### 1. Finding First Occurrence
\`\`\`python
def binary_search_first(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            result = mid
            right = mid - 1  # Continue searching left
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result
\`\`\`

### 2. Finding Last Occurrence
\`\`\`python
def binary_search_last(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            result = mid
            left = mid + 1  # Continue searching right
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result
\`\`\`

## Practice Problems

1. **LeetCode 704**: Binary Search
2. **LeetCode 35**: Search Insert Position
3. **LeetCode 34**: Find First and Last Position of Element in Sorted Array
4. **LeetCode 69**: Sqrt(x)

## Tips and Tricks

- Always check edge cases (empty array, single element)
- Be careful with integer overflow in mid calculation
- Use \`left + (right - left) / 2\` instead of \`(left + right) / 2\` to avoid overflow
- Consider using binary search for optimization problems

## SQL Example
\`\`\`sql
-- Finding records in a sorted table efficiently
SELECT * FROM users 
WHERE id BETWEEN 1000 AND 2000 
ORDER BY id 
LIMIT 100;

-- Using binary search concept in database queries
SELECT * FROM products 
WHERE price >= 50 AND price <= 100 
ORDER BY price;
\`\`\``,
  category: 'algorithms',
  difficulty: 'medium',
  tags: ['binary-search', 'algorithms', 'python', 'javascript', 'leetcode'],
  isFavorite: true,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
  views: 42,
  readingTime: '8 min read'
};

export default function NotePage() {
  const params = useParams();
  const router = useRouter();
  const { success, error } = useSimpleToast();
  const [note, setNote] = useState(mockNote);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setNote(prev => ({ ...prev, content: editedContent, updatedAt: new Date() }));
      setIsEditing(false);
      success('Note updated successfully!');
    } catch (error : any) {
      error('Failed to update note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        success('Note deleted successfully!');
        router.push('/dashboard/notes');
      } catch (error : any) {
        error('Failed to delete note');
      }
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'algorithms': return Code;
      case 'data-structures': return Target;
      case 'system-design': return Brain;
      case 'leetcode': return BookOpen;
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading note...</span>
        </div>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold">{note.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {note.createdAt.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {note.readingTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {note.views} views
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNote(prev => ({ ...prev, isFavorite: !prev.isFavorite }))}
                className={note.isFavorite ? 'text-yellow-500' : ''}
              >
                <Star className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="w-5 h-5" />
              </Button>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </Button>
              )}
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary text-white"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDelete}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <Card className="border-0 shadow-none">
              <CardContent className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="min-h-[600px] resize-none font-mono text-sm"
                      placeholder="Write your note content here... (Supports Markdown)"
                    />
                    {showPreview && (
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4">Preview</h3>
                        <MarkdownReader content={editedContent} />
                      </div>
                    )}
                  </div>
                ) : (
                  <MarkdownReader content={note.content} />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Note Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Note Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  {React.createElement(getCategoryIcon(note.category), { className: "w-4 h-4" })}
                  <span className="capitalize">{note.category.replace('-', ' ')}</span>
                </div>
                
                <div>
                  <Badge className={getDifficultyColor(note.difficulty)}>
                    {note.difficulty}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="w-4 h-4" />
                    <span>Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Last updated: {note.updatedAt.toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Related Notes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Code className="w-4 h-4 mr-2" />
                  Practice Problems
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Study Plan
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 