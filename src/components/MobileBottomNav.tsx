import React from 'react';
import { FileText, Users, Settings, BarChart3 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export const MobileBottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { href: '/app', label: 'Create', icon: FileText },
    { href: '/my-payslips', label: 'Payslips', icon: BarChart3 },
    { href: '/employees', label: 'Employees', icon: Users },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-gray-200 z-50 pb-safe-bottom">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              className={`flex flex-col gap-1 h-14 touch-target-48 formaslips-button ${
                isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
              asChild
            >
              <a href={item.href}>
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </a>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};