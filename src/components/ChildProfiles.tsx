
import React, { useState } from 'react';
import { Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Child {
  id: string;
  name: string;
  photo?: string;
}

interface ChildProfilesProps {
  selectedChild: Child | null;
  onSelectChild: (child: Child | null) => void;
}

export const ChildProfiles = ({ selectedChild, onSelectChild }: ChildProfilesProps) => {
  const [children, setChildren] = useState<Child[]>([
    { id: '1', name: 'Emma' },
    { id: '2', name: 'Alex' }
  ]);

  const addChild = () => {
    const name = prompt('Enter child\'s name:');
    if (name) {
      const newChild = {
        id: Date.now().toString(),
        name: name.trim()
      };
      setChildren([...children, newChild]);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 mb-6">
      <h3 className="font-medium text-gray-900 mb-3">Select Child</h3>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => onSelectChild(selectedChild?.id === child.id ? null : child)}
            className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
              selectedChild?.id === child.id
                ? 'bg-green-100 border-2 border-green-500'
                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
            }`}
          >
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-green-700" />
            </div>
            <span className="text-sm font-medium text-gray-700">{child.name}</span>
          </button>
        ))}
        
        <button
          onClick={addChild}
          className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-dashed border-green-300 hover:border-green-500 transition-colors"
        >
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
            <Plus className="h-6 w-6 text-green-600" />
          </div>
          <span className="text-sm font-medium text-green-600">Add</span>
        </button>
      </div>
    </div>
  );
};
