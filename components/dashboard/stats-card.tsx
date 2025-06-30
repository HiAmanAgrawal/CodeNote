'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: number | string;
  change?: string;
  icon: LucideIcon;
  color?: string;
  delay?: number;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = "text-muted-foreground",
  delay = 0 
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const animateValue = async () => {
      if (typeof value === 'number') {
        await controls.start({ 
          scale: [0.8, 1.1, 1],
          opacity: [0, 1],
          transition: { 
            duration: 0.5, 
            delay,
            ease: "easeOut"
          }
        });
        
        // Animate counting up
        const duration = 1000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= value) {
            setDisplayValue(value);
            clearInterval(timer);
          } else {
            setDisplayValue(Math.floor(current));
          }
        }, duration / steps);
        
        return () => clearInterval(timer);
      } else {
        setDisplayValue(value as any);
      }
    };

    animateValue();
  }, [value, controls, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <motion.div
            animate={controls}
            className={`p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300`}
          >
            <Icon className={`h-4 w-4 ${color}`} />
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tracking-tight">
            {typeof value === 'number' ? displayValue : value}
          </div>
          {change && (
            <p className="text-xs text-muted-foreground mt-1">
              {change}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 