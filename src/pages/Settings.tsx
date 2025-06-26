
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { LocaleSelector } from '@/components/LocaleSelector';
import { User, CreditCard, Mail, Settings as SettingsIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
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
    : 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-1 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Settings</h1>
          <p className="text-blue-600">Manage your account and subscription preferences</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-sm text-gray-600">{displayName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-600">{profile?.email || user?.email}</p>
              </div>
              <Button variant="outline">Edit Profile</Button>
            </CardContent>
          </Card>

          {/* Subscription Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription Plan
              </CardTitle>
              <CardDescription>
                Manage your current subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Plan</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">Free Trial</Badge>
                    <span className="text-sm text-gray-600">7 days remaining</span>
                  </div>
                </div>
                <Button>Upgrade Plan</Button>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Plan Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Up to 3 payslips per month</li>
                  <li>• Basic templates</li>
                  <li>• Email support</li>
                </ul>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">View Billing History</Button>
                <Button variant="outline">Manage Payment Methods</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive updates and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates about your payslips</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Application Settings
              </CardTitle>
              <CardDescription>
                Customize your SlipSim experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Regional Settings */}
              <div className="space-y-4">
                <LocaleSelector />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Default Currency</p>
                  <p className="text-sm text-gray-600">USD ($)</p>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Date Format</p>
                  <p className="text-sm text-gray-600">MM/DD/YYYY</p>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Settings;
