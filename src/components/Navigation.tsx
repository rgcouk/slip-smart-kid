
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MobileNavigation } from './navigation/MobileNavigation';
import { DesktopNavigation } from './navigation/DesktopNavigation';

interface NavigationProps {
  onSignOut: () => void;
}

export const Navigation = ({ onSignOut }: NavigationProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <MobileNavigation 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        onSignOut={onSignOut} 
      />
      <DesktopNavigation user={user} />
    </>
  );
};
