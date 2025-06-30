'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale';
}

export function AnimatedWrapper({ 
  children, 
  className = '', 
  delay = 0, 
  duration = 0.5,
  animation = 'fadeIn'
}: AnimatedWrapperProps) {
  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration, delay }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, delay }
    },
    slideLeft: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration, delay }
    },
    slideRight: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      transition: { duration, delay }
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration, delay }
    }
  };

  const config = animations[animation];

  return (
    <motion.div
      className={className}
      initial={config.initial}
      animate={config.animate}
      transition={config.transition}
    >
      {children}
    </motion.div>
  );
} 