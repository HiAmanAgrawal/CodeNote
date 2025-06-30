'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  transitionType?: 'fade' | 'slide' | 'scale' | 'flip' | 'custom';
  duration?: number;
  delay?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: (direction: string) => ({
      x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
      y: direction === 'up' ? -300 : direction === 'down' ? 300 : 0,
      opacity: 0,
    }),
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
    },
    exit: (direction: string) => ({
      x: direction === 'left' ? 300 : direction === 'right' ? -300 : 0,
      y: direction === 'up' ? 300 : direction === 'down' ? -300 : 0,
      opacity: 0,
    }),
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 },
  },
  flip: {
    initial: { rotateY: -90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: 90, opacity: 0 },
  },
  custom: {
    initial: { 
      opacity: 0,
      y: 50,
      scale: 0.95,
      filter: 'blur(10px)',
    },
    animate: { 
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      filter: 'blur(10px)',
    },
  },
};

const PageTransitions: React.FC<PageTransitionProps> = ({
  children,
  className,
  transitionType = 'fade',
  duration = 0.5,
  delay = 0,
  direction,
}) => {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => {
        router.refresh();
      }}
    >
      {isMounted && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={transitionVariants[transitionType]}
          custom={direction}
          className={`${className} ${transitionType}`}
          style={{
            duration: duration,
            delay: delay,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransitions; 