import React, { useState } from 'react';
import { Menu, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MobileNavContent } from '@/components/navigation/MobileNavContent';
export const Header = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully"
      });
    }
  };
  return (
    <header className="backdrop-blur-sm border-b border-border bg-background/80">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-1">
            <span className="font-serif font-bold text-foreground text-2xl tracking-tight">FORMA</span>
            <span className="font-sans font-medium text-muted-foreground text-xl">slips</span>
          </a>
          
          {/* Main Navigation for logged-in users */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <a href="/dashboard">Dashboard</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="/my-payslips">My Payslips</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="/employees">Employees</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="/pricing">Pricing</a>
              </Button>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* User Menu Sidebar for logged-in users */}
          {user && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:block">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 flex flex-col">
                <MobileNavContent onSignOut={handleSignOut} setIsOpen={setIsOpen} />
              </SheetContent>
            </Sheet>
          )}
          
          {/* Login buttons for non-logged-in users */}
          {!user && (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <a href="/auth">Sign In</a>
              </Button>
              <Button size="sm" asChild>
                <a href="/auth">Get Started</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};