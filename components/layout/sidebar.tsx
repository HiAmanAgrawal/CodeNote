'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Code, 
  BookOpen, 
  Trophy, 
  Map, 
  Settings, 
  User,
  Home
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Editor', href: '/dashboard/editor', icon: Code },
  { name: 'Notes', href: '/dashboard/notes', icon: BookOpen },
  { name: 'Contests', href: '/dashboard/contests', icon: Trophy },
  { name: 'Roadmap', href: '/dashboard/roadmap', icon: Map },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-card/50 backdrop-blur-sm border-r border-border flex flex-col"
    >
      {/* Logo */}
      <motion.div 
        className="p-6 border-b border-border"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Link href="/dashboard" className="flex items-center space-x-2 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Code className="h-8 w-8 text-primary" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            CodeNote
          </span>
        </Link>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start group transition-all duration-200',
                    isActive && 'bg-primary text-primary-foreground shadow-lg',
                    !isActive && 'hover:bg-muted/50'
                  )}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                  </motion.div>
                  {item.name}
                </Button>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User Info */}
      <motion.div 
        className="p-4 border-t border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <div className="flex items-center space-x-3 group cursor-pointer">
          <motion.div 
            className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <User className="h-4 w-4 text-primary-foreground" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors duration-200">
              User Name
            </p>
            <p className="text-xs text-muted-foreground truncate">
              user@example.com
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 