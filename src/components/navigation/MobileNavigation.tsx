
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { MobileNavContent } from './MobileNavContent';

interface MobileNavigationProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSignOut: () => void;
}

export const MobileNavigation = ({ isOpen, setIsOpen, onSignOut }: MobileNavigationProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden p-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 flex flex-col">
        <MobileNavContent onSignOut={onSignOut} setIsOpen={setIsOpen} />
      </SheetContent>
    </Sheet>
  );
};
