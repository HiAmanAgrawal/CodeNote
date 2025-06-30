'use client';

import { Bell, Search, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function DashboardNav() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 border-b border-border bg-background/80 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-50"
    >
      {/* Left side - Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <motion.div 
          className="relative flex-1"
          animate={{ scale: isSearchFocused ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes, problems, contests..."
            className="pl-10 transition-all duration-200"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </motion.div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Notifications */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </Button>
        </motion.div>

        {/* Mobile menu */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        {/* User menu */}
        <motion.div 
          className="flex items-center space-x-2 cursor-pointer group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center group-hover:shadow-lg transition-shadow duration-200">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
} 