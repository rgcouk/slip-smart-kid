import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NotesFieldProps {
  notes: string;
  onFieldChange: (field: string, value: string) => void;
}

export const NotesField = ({ notes, onFieldChange }: NotesFieldProps) => {
  return (
    <div>
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => onFieldChange('notes', e.target.value)}
        placeholder="Additional notes about this employee"
        rows={3}
      />
    </div>
  );
};