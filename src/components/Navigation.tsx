
import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Calculator, User, CreditCard, Settings } from 'lucide-react';

export const Navigation = () => {
  const { user } = useAuth();

  return (
    <NavigationMenu>
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
  );
};
