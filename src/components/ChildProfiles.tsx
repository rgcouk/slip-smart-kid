
import React, { useState, useEffect } from 'react';
import { Plus, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Child {
  id: string;
  name: string;
  photo_url?: string;
}

interface ChildProfilesProps {
  selectedChild: Child | null;
  onSelectChild: (child: Child | null) => void;
}

export const ChildProfiles = ({ selectedChild, onSelectChild }: ChildProfilesProps) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  const fetchChildren = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('child_profiles')
        .select('*')
        .eq('parent_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setChildren(data || []);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast({
        title: "Error",
        description: "Failed to load child profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addChild = async () => {
    const name = prompt('Enter child\'s name:');
    if (!name || !user) return;

    try {
      const { data, error } = await supabase
        .from('child_profiles')
        .insert([
          {
            parent_id: user.id,
            name: name.trim(),
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setChildren([...children, data]);
      toast({
        title: "Success",
        description: `${name} has been added!`,
      });
    } catch (error) {
      console.error('Error adding child:', error);
      toast({
        title: "Error",
        description: "Failed to add child profile",
        variant: "destructive",
      });
    }
  };

  const deleteChild = async (childId: string, childName: string) => {
    if (!confirm(`Are you sure you want to delete ${childName}'s profile?`)) return;

    try {
      const { error } = await supabase
        .from('child_profiles')
        .delete()
        .eq('id', childId);

      if (error) throw error;

      setChildren(children.filter(child => child.id !== childId));
      if (selectedChild?.id === childId) {
        onSelectChild(null);
      }
      
      toast({
        title: "Success",
        description: `${childName}'s profile has been deleted`,
      });
    } catch (error) {
      console.error('Error deleting child:', error);
      toast({
        title: "Error",
        description: "Failed to delete child profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 mb-6">
        <h3 className="font-medium text-gray-900 mb-3">Select Child</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 mb-6">
      <h3 className="font-medium text-gray-900 mb-3">Select Child</h3>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {children.map((child) => (
          <div key={child.id} className="flex-shrink-0 relative group">
            <button
              onClick={() => onSelectChild(selectedChild?.id === child.id ? null : child)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
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
            
            <button
              onClick={() => deleteChild(child.id, child.name)}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
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
