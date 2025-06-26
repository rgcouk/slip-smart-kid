
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
import { useAuth } from '@/contexts/AuthContext';
import { Calculator, User, CreditCard, Settings, Menu, FileText, Users, LogOut } from 'lucide-react';

interface NavigationProps {
  onSignOut: () => void;
}

export const Navigation = ({ onSignOut }: NavigationProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { href: '/', label: 'Home', icon: Calculator },
    { href: '/my-payslips', label: 'My Payslips', icon: FileText },
    { href: '/pricing', label: 'Pricing', icon: CreditCard },
  ];

  const accountItems = user ? [
    { href: '/employees', label: 'Employees', icon: Users },
    { href: '/settings', label: 'Settings', icon: Settings },
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
        
        {/* Sign Out button at the bottom */}
        {user && (
          <div className="border-t pt-4 mt-auto">
            <div className="flex items-center gap-2 text-sm text-blue-700 mb-3 px-2">
              <User className="h-4 w-4" />
              <span>{user.email}</span>
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
                    href="/employees"
                    className="block px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                  >
                    <Users className="h-4 w-4 mr-2 inline" />
                    Employees
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    href="/settings"
                    className="block px-3 py-2 text-sm hover:bg-accent rounded-md transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-2 inline" />
                    Settings
                  </NavigationMenuLink>
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
