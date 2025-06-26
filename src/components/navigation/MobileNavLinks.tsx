
import React from 'react';
import { User } from '@supabase/supabase-js';
import { LucideIcon } from 'lucide-react';

interface NavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface MobileNavLinksProps {
  navigationItems: NavigationItem[];
  userItems: NavigationItem[];
  accountItems: NavigationItem[];
  user: User | null;
  setIsOpen: (open: boolean) => void;
}

export const MobileNavLinks = ({ 
  navigationItems, 
  userItems, 
  accountItems, 
  user, 
  setIsOpen 
}: MobileNavLinksProps) => {
  return (
    <>
      {navigationItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="flex items-center space-x-2 text-lg font-medium hover:text-blue-600 p-2 rounded-md hover:bg-gray-100"
          onClick={() => setIsOpen(false)}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </a>
      ))}
      
      {user && (
        <>
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold text-sm text-gray-600 mb-3 px-2">My Content</h3>
            {userItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-lg font-medium hover:text-blue-600 mb-3 p-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-sm text-gray-600 mb-3 px-2">Account</h3>
            {accountItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-lg font-medium hover:text-blue-600 mb-3 p-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};
