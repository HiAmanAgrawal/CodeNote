'use client';

import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface QuickAction {
  title: string;
  href: string;
  icon: LucideIcon;
  variant?: 'default' | 'outline';
  color?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            asChild 
            variant={action.variant || 'default'} 
            className="h-20 flex-col w-full group relative overflow-hidden"
          >
            <Link href={action.href}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <action.icon className={`h-6 w-6 mb-2 ${action.color || ''} group-hover:scale-110 transition-transform duration-200`} />
              <span className="relative z-10">{action.title}</span>
            </Link>
          </Button>
        </motion.div>
      ))}
    </div>
  );
} 