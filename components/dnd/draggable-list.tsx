'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, Reorder, useDragControls } from 'framer-motion';
import { Grip, Trash2, Edit, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DraggableItem {
  id: string;
  title: string;
  description?: string;
  order: number;
}

interface DraggableListProps {
  items: DraggableItem[];
  onReorder?: (items: DraggableItem[]) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  className?: string;
  itemHeight?: number;
  showDragHandle?: boolean;
  enableDrag?: boolean;
  enableDelete?: boolean;
  enableEdit?: boolean;
  enableDuplicate?: boolean;
}

export const DraggableList: React.FC<DraggableListProps> = ({
  items,
  onReorder,
  onDelete,
  onEdit,
  onDuplicate,
  className = '',
  itemHeight = 80,
  showDragHandle = true,
  enableDrag = true,
  enableDelete = true,
  enableEdit = true,
  enableDuplicate = true,
}) => {
  const [reorderedItems, setReorderedItems] = useState(items);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleReorder = useCallback((newOrder: DraggableItem[]) => {
    const updatedItems = newOrder.map((item, index) => ({
      ...item,
      order: index,
    }));
    setReorderedItems(updatedItems);
    onReorder?.(updatedItems);
  }, [onReorder]);

  const handleDelete = useCallback((id: string) => {
    const updatedItems = reorderedItems.filter(item => item.id !== id);
    setReorderedItems(updatedItems);
    onDelete?.(id);
  }, [reorderedItems, onDelete]);

  const handleDuplicate = useCallback((id: string) => {
    const itemToDuplicate = reorderedItems.find(item => item.id === id);
    if (itemToDuplicate) {
      const newItem: DraggableItem = {
        ...itemToDuplicate,
        id: crypto.randomUUID(),
        title: `${itemToDuplicate.title} (Copy)`,
        order: reorderedItems.length,
      };
      const updatedItems = [...reorderedItems, newItem];
      setReorderedItems(updatedItems);
      onDuplicate?.(id);
    }
  }, [reorderedItems, onDuplicate]);

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <Reorder.Group
          axis="y"
          values={reorderedItems}
          onReorder={handleReorder}
          className="space-y-2 p-4"
        >
          {reorderedItems.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              onDragStart={() => setDraggedId(item.id)}
              onDragEnd={() => setDraggedId(null)}
              whileDrag={{
                scale: 1.02,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
              }}
              className="relative"
            >
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`relative bg-card border border-border rounded-lg p-4 transition-all duration-200 ${
                  draggedId === item.id ? 'shadow-lg' : 'hover:shadow-md'
                } ${hoveredId === item.id ? 'border-primary/50' : ''}`}
                style={{ minHeight: itemHeight }}
                onHoverStart={() => setHoveredId(item.id)}
                onHoverEnd={() => setHoveredId(null)}
              >
                <div className="flex items-center space-x-3">
                  {/* Drag Handle */}
                  {showDragHandle && enableDrag && (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <Grip className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        Order: {item.order + 1}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    {enableDuplicate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDuplicate(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {enableEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {enableDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Drag Overlay */}
                {draggedId === item.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-primary/5 border-2 border-primary/20 rounded-lg pointer-events-none"
                  />
                )}
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {/* Empty State */}
        {reorderedItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No items to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 