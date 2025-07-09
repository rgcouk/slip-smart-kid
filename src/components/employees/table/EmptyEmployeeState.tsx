import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface EmptyEmployeeStateProps {
  searchTerm: string;
  onAddEmployee: () => void;
}

export const EmptyEmployeeState = ({ searchTerm, onAddEmployee }: EmptyEmployeeStateProps) => {
  return (
    <div className="p-8 text-center">
      <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-500 mb-4">
        {searchTerm ? 'No employees found matching your search.' : 'No employees added yet.'}
      </p>
      {!searchTerm && (
        <Button onClick={onAddEmployee}>
          Add Your First Employee
        </Button>
      )}
    </div>
  );
};