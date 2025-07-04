
import React from 'react';
import { Calculator, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

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

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    }
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl">
              <Calculator className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground text-xl">Formaslips</span>
              <Badge variant="secondary" className="text-xs px-2 py-1 rounded-lg">Pro</Badge>
            </div>
          </div>
          
          {user && <Navigation onSignOut={handleSignOut} />}
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-sm">
                  <div className="text-foreground font-medium">{displayName}</div>
                  <div className="text-muted-foreground text-xs">Online</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2 h-9 rounded-xl"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}
          
          {!user && (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="h-9 rounded-xl" asChild>
                <a href="/auth">Sign In</a>
              </Button>
              <Button size="sm" className="h-9 rounded-xl bg-primary hover:bg-primary/90" asChild>
                <a href="/auth">Get Started</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
