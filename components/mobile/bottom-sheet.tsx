'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ChevronUp, ChevronDown, Grip } from 'lucide-react';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: number[]; // Heights in pixels
  defaultSnap?: number; // Index of default snap point
  maxHeight?: number; // Maximum height
  minHeight?: number; // Minimum height
  className?: string;
  showBackdrop?: boolean;
  backdropOpacity?: number;
  enableDrag?: boolean;
  enableResize?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [300, 500, 700],
  defaultSnap = 0,
  maxHeight = 800,
  minHeight = 100,
  className = '',
  showBackdrop = true,
  backdropOpacity = 0.5,
  enableDrag = true,
  enableResize = true,
}) => {
  const [currentSnap, setCurrentSnap] = useState(defaultSnap);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [currentHeight, setCurrentHeight] = useState(snapPoints[defaultSnap]);
  
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const currentSnapHeight = snapPoints[currentSnap];

  // Handle drag start
  const handleDragStart = useCallback((event: React.PointerEvent | PointerEvent) => {
    if (!enableDrag) return;
    setIsDragging(true);
    setDragStartY(event.clientY);
  }, [enableDrag]);

  // Handle drag
  const handleDrag = useCallback((event: React.PointerEvent | PointerEvent) => {
    if (!isDragging || !enableDrag) return;
    
    const deltaY = dragStartY - event.clientY;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, currentSnapHeight + deltaY));
    setCurrentHeight(newHeight);
  }, [isDragging, enableDrag, dragStartY, currentSnapHeight, minHeight, maxHeight]);

  // Handle drag end
  const handleDragEnd = useCallback((event: React.PointerEvent | PointerEvent) => {
    if (!enableDrag) return;
    
    setIsDragging(false);
    const deltaY = dragStartY - event.clientY;
    const newHeight = currentSnapHeight + deltaY;
    
    // Find closest snap point
    let closestSnap = currentSnap;
    let minDistance = Math.abs(newHeight - snapPoints[currentSnap]);
    
    snapPoints.forEach((snapHeight, index) => {
      const distance = Math.abs(newHeight - snapHeight);
      if (distance < minDistance) {
        minDistance = distance;
        closestSnap = index;
      }
    });
    
    setCurrentSnap(closestSnap);
    setCurrentHeight(snapPoints[closestSnap]);
  }, [enableDrag, dragStartY, currentSnapHeight, snapPoints, currentSnap]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === backdropRef.current) {
      onClose();
    }
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle pointer events
  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      handleDrag(event);
    };

    const handlePointerUp = (event: PointerEvent) => {
      handleDragEnd(event);
    };

    if (isDragging) {
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, handleDrag, handleDragEnd]);

  // Snap to specific point
  const snapTo = useCallback((index: number) => {
    if (index >= 0 && index < snapPoints.length) {
      setCurrentSnap(index);
      setCurrentHeight(snapPoints[index]);
    }
  }, [snapPoints]);

  // Snap to next/previous
  const snapToNext = useCallback(() => {
    if (currentSnap < snapPoints.length - 1) {
      snapTo(currentSnap + 1);
    }
  }, [currentSnap, snapPoints.length, snapTo]);

  const snapToPrevious = useCallback(() => {
    if (currentSnap > 0) {
      snapTo(currentSnap - 1);
    }
  }, [currentSnap, snapTo]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <AnimatePresence>
        {showBackdrop && (
          <motion.div
            ref={backdropRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: backdropOpacity }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="absolute inset-0 bg-black"
            style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
          />
        )}
      </AnimatePresence>

      {/* Bottom Sheet */}
      <motion.div
        ref={sheetRef}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ 
          type: 'spring', 
          damping: 25, 
          stiffness: 300,
          mass: 0.8 
        }}
        style={{ height: currentHeight }}
        className={`absolute bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-xl shadow-2xl ${className}`}
        onPointerDown={handleDragStart}
      >
        {/* Handle */}
        <div className="flex items-center justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        {(title || enableResize) && (
          <div className="flex items-center justify-between px-4 pb-2 border-b border-border">
            {title && (
              <h3 className="text-lg font-semibold">{title}</h3>
            )}
            
            <div className="flex items-center space-x-2">
              {enableResize && (
                <>
                  <button
                    onClick={snapToPrevious}
                    disabled={currentSnap === 0}
                    className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={snapToNext}
                    disabled={currentSnap === snapPoints.length - 1}
                    className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                </>
              )}
              
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>

        {/* Snap Indicators */}
        {enableResize && (
          <div className="flex items-center justify-center space-x-1 pb-2">
            {snapPoints.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-1 rounded-full transition-colors ${
                  index === currentSnap 
                    ? 'bg-primary' 
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
};

// Hook for bottom sheet
export function useBottomSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [snapPoint, setSnapPoint] = useState(0);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const snapTo = useCallback((point: number) => setSnapPoint(point), []);

  return {
    isOpen,
    snapPoint,
    open,
    close,
    toggle,
    snapTo,
  };
}

export default BottomSheet; 