
import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Calculator, User, CreditCard, FileText, Users, Settings, BarChart } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface DesktopNavigationProps {
  user: SupabaseUser | null;
}

export const DesktopNavigation = ({ user }: DesktopNavigationProps) => {
  return (
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

        {user && (
          <NavigationMenuItem>
            <NavigationMenuLink
              href="/dashboard"
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <BarChart className="h-4 w-4 mr-2" />
              Dashboard
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}

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
  );
};
