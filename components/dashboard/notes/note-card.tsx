'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Edit, 
  Trash2, 
  Share, 
  Clock, 
  Tag,
  MoreVertical,
  Eye,
  Star
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  isPublic: boolean;
  viewCount: number;
  wordCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
}

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
  onShare?: (note: Note) => void;
  onToggleFavorite?: (noteId: string) => void;
  onView?: (note: Note) => void;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const categoryIcons = {
  'Data Structures': '📊',
  'Algorithms': '⚡',
  'Dynamic Programming': '🔄',
  'Graph Theory': '��️',
  'String Manipulation': '��',
  'Mathematics': '��',
  'System Design': '��️',
  'Database': '🗄️',
  'Web Development': '🌐',
  'Mobile Development': '📱',
  'DevOps': '⚙️',
  'Machine Learning': '��',
};

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onShare,
  onToggleFavorite,
  onView,
  variant = 'default',
  className,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -4, scale: 1.02 },
  };

  if (variant === 'compact') {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{ duration: 0.2 }}
      >
        <Card className={cn('cursor-pointer group hover:shadow-md transition-all duration-200', className)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="text-2xl">
                  {categoryIcons[note.category as keyof typeof categoryIcons] || '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                    {note.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {truncateContent(note.content, 80)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {note.difficulty}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite?.(note.id);
                  }}
                  className={cn(
                    'h-8 w-8 p-0',
                    note.isFavorite && 'text-yellow-500'
                  )}
                >
                  <Star className="h-4 w-4" fill={note.isFavorite ? 'currentColor' : 'none'} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ duration: 0.2 }}
    >
      <Card className={cn('group hover:shadow-lg transition-all duration-200', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="text-3xl">
                {categoryIcons[note.category as keyof typeof categoryIcons] || '��'}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                  {note.title}
                </CardTitle>
                <CardDescription className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {formatTimeAgo(note.updatedAt)}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {note.wordCount} words
                  </span>
                  {note.isPublic && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {note.viewCount}
                      </span>
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView?.(note)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(note)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare?.(note)}>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onToggleFavorite?.(note.id)}
                  className={note.isFavorite ? 'text-yellow-600' : ''}
                >
                  <Star className="mr-2 h-4 w-4" fill={note.isFavorite ? 'currentColor' : 'none'} />
                  {note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete?.(note.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {truncateContent(note.content)}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className={cn('text-xs', difficultyColors[note.difficulty])}
              >
                {note.difficulty}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {note.category}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              {note.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{note.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(note.createdAt)}
              </span>
              <span>•</span>
              <span>{note.topic}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView?.(note)}
                className="h-8"
              >
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(note)}
                className="h-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Helper function for className concatenation
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default NoteCard; 