import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Brain,
  Clock,
  Tag,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';

const notesData = [
  {
    id: 1,
    title: "Two Pointers Technique",
    content: "A technique where we use two pointers to solve array problems efficiently...",
    topic: "Arrays",
    difficulty: "Easy",
    createdAt: "2 hours ago",
    tags: ["Two Pointers", "Arrays", "Optimization"]
  },
  {
    id: 2,
    title: "Dynamic Programming Patterns",
    content: "Common DP patterns including memoization, tabulation, and state compression...",
    topic: "Dynamic Programming",
    difficulty: "Hard",
    createdAt: "1 day ago",
    tags: ["DP", "Memoization", "Optimization"]
  },
  {
    id: 3,
    title: "Binary Search Tree Operations",
    content: "Insertion, deletion, and traversal operations for BST...",
    topic: "Trees",
    difficulty: "Medium",
    createdAt: "3 days ago",
    tags: ["BST", "Trees", "Traversal"]
  },
  {
    id: 4,
    title: "Graph Traversal Algorithms",
    content: "DFS and BFS implementations with their applications...",
    topic: "Graphs",
    difficulty: "Medium",
    createdAt: "1 week ago",
    tags: ["Graphs", "DFS", "BFS"]
  }
];

export default function NotesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">
            Your personal collection of DSA notes and insights
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Note
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search notes..."
                className="px-3 py-2 border rounded-md text-sm flex-1"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">All Topics</Badge>
              <Badge variant="secondary">Recent</Badge>
              <Badge variant="outline">Favorites</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Note Generation */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">AI-Powered Note Generation</h3>
              <p className="text-sm text-muted-foreground">
                Let AI help you create comprehensive notes from your coding problems
              </p>
            </div>
            <Button>
              <Brain className="mr-2 h-4 w-4" />
              Generate Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notesData.map((note) => (
          <Card key={note.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{note.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {note.content.substring(0, 100)}...
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{note.topic}</Badge>
                  <Badge variant={note.difficulty === 'Easy' ? 'default' : note.difficulty === 'Medium' ? 'secondary' : 'destructive'}>
                    {note.difficulty}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{note.createdAt}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/dashboard/notes/${note.id}`}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Note
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common note-taking tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <BookOpen className="h-6 w-6 mb-2" />
              Browse Templates
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Tag className="h-6 w-6 mb-2" />
              Manage Tags
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Brain className="h-6 w-6 mb-2" />
              AI Summary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 