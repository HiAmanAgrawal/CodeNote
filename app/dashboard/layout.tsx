import { ReactNode } from 'react';
import { DashboardNav } from '@/components/layout/dashboard-nav';
import { Sidebar } from '@/components/layout/sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <DashboardNav />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="animate-in fade-in duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
