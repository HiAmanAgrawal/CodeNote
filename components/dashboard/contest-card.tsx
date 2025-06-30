'use client';

import { Button } from '@/components/ui/button';
import { Trophy, Clock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContestCardProps {
  id: string;
  title: string;
  description: string;
  timeLeft: string;
  problems: number;
  duration: string;
  color: string;
  isUpcoming?: boolean;
  onJoin?: () => void;
  onRemind?: () => void;
}

export function ContestCard({
  id,
  title,
  description,
  timeLeft,
  problems,
  duration,
  color,
  isUpcoming = false,
  onJoin,
  onRemind
}: ContestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-300 group"
    >
      <div className="flex items-center space-x-4">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Trophy className={`h-8 w-8 ${color}`} />
        </motion.div>
        <div>
          <h3 className="font-semibold group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {problems} problems • {duration}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{timeLeft}</p>
        <Button 
          size="sm" 
          variant={isUpcoming ? "outline" : "default"}
          className="mt-2 group-hover:scale-105 transition-transform duration-200"
          onClick={isUpcoming ? onRemind : onJoin}
        >
          {isUpcoming ? (
            <>
              <Clock className="mr-2 h-4 w-4" />
              Remind Me
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Join
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
} 