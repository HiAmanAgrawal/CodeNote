'use client';

import { motion } from 'framer-motion';
import { Loader2, Code, Brain, Trophy } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dots' | 'pulse' | 'code' | 'brain' | 'trophy';
  text?: string;
  className?: string;
}

export function Spinner({ 
  size = 'md', 
  variant = 'default', 
  text,
  className = '' 
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const variants = {
    default: (
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
    ),
    dots: (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'} bg-current rounded-full`}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    ),
    pulse: (
      <motion.div
        className={`${sizeClasses[size]} bg-current rounded-full`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    ),
    code: (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Code className={`${sizeClasses[size]} text-primary`} />
      </motion.div>
    ),
    brain: (
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Brain className={`${sizeClasses[size]} text-purple-500`} />
      </motion.div>
    ),
    trophy: (
      <motion.div
        animate={{ 
          y: [0, -5, 0],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Trophy className={`${sizeClasses[size]} text-yellow-500`} />
      </motion.div>
    )
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {variants[variant]}
      {text && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );
}

// Page Loading Spinner
export function PageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 mx-auto"
        >
          <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-muted-foreground"
        >
          Loading CodeNote...
        </motion.p>
      </div>
    </div>
  );
}

// Button Loading Spinner
export function ButtonSpinner({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <Loader2 className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} animate-spin`} />
  );
}

// Skeleton Loading
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
} 