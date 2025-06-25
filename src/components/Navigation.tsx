
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
import { Calculator, User, CreditCard, Settings, Menu } from 'lucide-react';

export const Navigation = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { href: '/', label: 'Home', icon: Calculator },
    { href: '/pricing', label: 'Pricing', icon: CreditCard },
  ];

  const accountItems = user ? [
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/subscription', label: 'Subscription', icon: CreditCard },
  ] : [];

  // Mobile Navigation
  const MobileNav = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="flex flex-col space-y-4 mt-8">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center space-x-2 text-lg font-medium hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </a>
          ))}
          
          {user && (
            <>
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-sm text-gray-600 mb-3">Account</h3>
                {accountItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 text-lg font-medium hover:text-blue-600 mb-3"
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
              href="/pricing"
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pricing
            </NavigationMenuLink>
          </NavigationMenuItem>

          {user && (
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <User className="h-4 w-4 mr-2" />
                Account
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-48 p-2">
                  <NavigationMenuLink
                    href="/settings"
                    className="block px-3 py-2 text-sm hover:bg-accent rounded-md"
                  >
                    <Settings className="h-4 w-4 mr-2 inline" />
                    Settings
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    href="/subscription"
                    className="block px-3 py-2 text-sm hover:bg-accent rounded-md"
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
