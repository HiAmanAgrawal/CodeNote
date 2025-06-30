'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface VirtualScrollProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  showScrollToTop?: boolean;
  showScrollToBottom?: boolean;
}

export function VirtualScroll<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 5,
  className = '',
  onScroll,
  onEndReached,
  endReachedThreshold = 0.8,
  showScrollToTop = true,
  showScrollToBottom = true,
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [showScrollButtons, setShowScrollButtons] = useState({
    top: false,
    bottom: false,
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.floor((scrollTop + height) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, height, itemHeight, overscan, items.length]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  // Calculate total height and offset
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  // Handle scroll
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop: newScrollTop } = event.currentTarget;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);

    // Check if we should trigger onEndReached
    if (onEndReached && newScrollTop + height >= totalHeight * endReachedThreshold) {
      onEndReached();
    }

    // Update scroll button visibility
    setShowScrollButtons({
      top: newScrollTop > 100,
      bottom: newScrollTop < totalHeight - height - 100,
    });
  }, [onScroll, onEndReached, height, totalHeight, endReachedThreshold]);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: totalHeight,
        behavior: 'smooth',
      });
    }
  }, [totalHeight]);

  // Scroll to specific item
  const scrollToItem = useCallback((index: number) => {
    if (containerRef.current) {
      const targetScrollTop = index * itemHeight;
      containerRef.current.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });
    }
  }, [itemHeight]);

  // Handle scroll button visibility with debounce
  useEffect(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        const { scrollTop: currentScrollTop } = containerRef.current;
        setShowScrollButtons({
          top: currentScrollTop > 100,
          bottom: currentScrollTop < totalHeight - height - 100,
        });
      }
    }, 100);

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [totalHeight, height]);

  return (
    <div className={`relative ${className}`}>
      {/* Virtual Scroll Container */}
      <div
        ref={containerRef}
        style={{ height, overflow: 'auto' }}
        onScroll={handleScroll}
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: offsetY,
              left: 0,
              right: 0,
            }}
          >
            <AnimatePresence>
              {visibleItems.map((item, index) => {
                const actualIndex = visibleRange.startIndex + index;
                return (
                  <motion.div
                    key={actualIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    style={{ height: itemHeight }}
                  >
                    {renderItem(item, actualIndex)}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollToTop && showScrollButtons.top && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="absolute top-4 right-4 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors z-10"
          >
            <ChevronUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollToBottom && showScrollButtons.bottom && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors z-10"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll Progress Indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
        <motion.div
          className="h-full bg-primary"
          style={{
            width: `${(scrollTop / totalHeight) * 100}%`,
          }}
        ></motion.div>
      </div>
    </div>
  );
} 