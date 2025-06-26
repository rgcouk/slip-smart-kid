
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Settings, LogOut } from 'lucide-react';

interface MobileUserSectionProps {
  displayName: string | undefined;
  onSignOut: () => void;
  setIsOpen: (open: boolean) => void;
}

export const MobileUserSection = ({ displayName, onSignOut, setIsOpen }: MobileUserSectionProps) => {
  return (
    <div className="border-t pt-4 mt-auto">
      <div className="flex items-center gap-2 text-sm text-blue-700 mb-3 px-2">
        <User className="h-4 w-4" />
        <span>{displayName}</span>
        <div className="ml-auto flex items-center gap-1">
          <a
            href="/settings"
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="h-4 w-4" />
          </a>
          <button
            onClick={onSignOut}
            className="p-1 hover:bg-gray-100 rounded text-red-600 hover:text-red-700"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={onSignOut}
        className="w-full flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};
