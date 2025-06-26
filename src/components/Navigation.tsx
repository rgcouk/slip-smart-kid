import React, { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Calculator, User, CreditCard, Settings, Menu, FileText, Users, LogOut } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NavigationProps {
  onSignOut: () => void;
}

export const Navigation = ({ onSignOut }: NavigationProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : user?.email;

  const navigationItems = [
    { href: '/', label: 'Home', icon: Calculator },
    { href: '/pricing', label: 'Pricing', icon: CreditCard },
  ];

  const userItems = [
    { href: '/my-payslips', label: 'My Payslips', icon: FileText },
    { href: '/employees', label: 'Employees', icon: Users },
  ];

  const accountItems = user ? [
    { href: '/subscription', label: 'Subscription', icon: CreditCard },
  ] : [];

  const handleSignOutMobile = () => {
    setIsOpen(false);
    onSignOut();
  };

  // Mobile Navigation
  const MobileNav = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden p-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 flex flex-col">
        <div className="flex flex-col space-y-4 mt-8 flex-1">
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
        </div>
        
        {/* Usage CTA Box */}
        {user && (
          <div className="border-t pt-4 mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Free Trial Usage</div>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span>3 of 3 payslips used</span>
                <span>7 days left</span>
              </div>
              <Progress value={100} className="h-2 mb-3" />
              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                Upgrade Plan
              </Button>
            </div>
          </div>
        )}
        
        {/* User info and Sign Out at the bottom */}
        {user && (
          <div className="border-t pt-4 mt-auto">
            <div className="flex items-center gap-2 text-sm text-blue-700 mb-3 px-2">
              <User className="h-4 w-4" />
              <span>{displayName}</span>
              <a
                href="/settings"
                className="ml-auto p-1 hover:bg-gray-100 rounded"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
              </a>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOutMobile}
              className="w-full flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/"
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              href="/my-payslips"
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <FileText className="h-4 w-4 mr-2" />
              My Payslips
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              href="/employees"
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <Users className="h-4 w-4 mr-2" />
              Employees
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              href="/pricing"
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pricing
            </NavigationMenuLink>
          </NavigationMenuItem>

          {user && (
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-background">
                <User className="h-4 w-4 mr-2" />
                Account
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-48 p-2">
                  <NavigationMenuLink
                    href="/subscription"
                    className="block px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                  >
                    <CreditCard className="h-4 w-4 mr-2 inline" />
                    Subscription
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};
