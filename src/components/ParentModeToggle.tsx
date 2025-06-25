
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { User, GraduationCap } from 'lucide-react';

interface ParentModeToggleProps {
  isParentMode: boolean;
  onToggle: (enabled: boolean) => void;
}

export const ParentModeToggle = ({ isParentMode, onToggle }: ParentModeToggleProps) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isParentMode ? (
            <GraduationCap className="h-5 w-5 text-green-600" />
          ) : (
            <User className="h-5 w-5 text-blue-600" />
          )}
          <div>
            <h3 className="font-medium text-gray-900">
              {isParentMode ? 'Parent Mode' : 'Personal Mode'}
            </h3>
            <p className="text-sm text-gray-500">
              {isParentMode ? 'Teaching kids about money' : 'Create your payslips'}
            </p>
          </div>
        </div>
        <Switch 
          checked={isParentMode} 
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-green-600"
        />
      </div>
    </div>
  );
};
