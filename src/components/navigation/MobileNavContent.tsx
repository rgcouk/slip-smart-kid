
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Calculator, User, CreditCard, Settings, FileText, Users, LogOut, BarChart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MobileNavLinks } from './MobileNavLinks';
import { MobileUsageCTA } from './MobileUsageCTA';
import { MobileUserSection } from './MobileUserSection';

interface MobileNavContentProps {
  onSignOut: () => void;
  setIsOpen: (open: boolean) => void;
}

export const MobileNavContent = ({ onSignOut, setIsOpen }: MobileNavContentProps) => {
  const { user } = useAuth();

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
    { href: '/dashboard', label: 'Dashboard', icon: BarChart },
    { href: '/my-payslips', label: 'My Payslips', icon: FileText },
    { href: '/employees', label: 'Employees', icon: Users },
  ];

  const accountItems = user ? [
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/subscription', label: 'Subscription', icon: CreditCard },
  ] : [];

  const handleSignOutMobile = () => {
    setIsOpen(false);
    onSignOut();
  };

  return (
    <>
      <div className="flex flex-col space-y-4 mt-8 flex-1">
        <MobileNavLinks 
          navigationItems={navigationItems}
          userItems={userItems}
          accountItems={accountItems}
          user={user}
          setIsOpen={setIsOpen}
        />
      </div>
      
      {user && <MobileUsageCTA />}
      
      {user && (
        <MobileUserSection 
          displayName={displayName}
          onSignOut={handleSignOutMobile}
          setIsOpen={setIsOpen}
        />
      )}
    </>
  );
};
