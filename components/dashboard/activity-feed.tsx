'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActivityItem {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  time: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'outline';
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getStatusColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'info': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex items-center space-x-3 group hover:bg-muted/50 rounded-lg p-2 transition-colors duration-200"
        >
          <motion.div
            className={`w-2 h-2 rounded-full ${getStatusColor(activity.type)}`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{activity.title}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
          {activity.badge && (
            <Badge variant={activity.badgeVariant || 'secondary'} className="shrink-0">
              {activity.badge}
            </Badge>
          )}
        </motion.div>
      ))}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: activities.length * 0.1 }}
      >
        <Button variant="ghost" className="w-full group">
          View All Activity
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Button>
      </motion.div>
    </div>
  );
} 