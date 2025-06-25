
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface EmailSectionProps {
  email: string;
  isEmailing: boolean;
  emailStatus: 'idle' | 'success' | 'error';
  onEmailChange: (email: string) => void;
  onEmailSend: () => void;
}

export const EmailSection = ({
  email,
  isEmailing,
  emailStatus,
  onEmailChange,
  onEmailSend,
}: EmailSectionProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="email" className="text-sm font-medium">
        Email Payslip
      </Label>
      <div className="space-y-2">
        <Input
          id="email"
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={isEmailing}
        />
        <div className="flex items-center gap-3">
          <Button
            onClick={onEmailSend}
            disabled={isEmailing || !email}
            className="flex-1"
            variant="outline"
          >
            {isEmailing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            {isEmailing ? 'Preparing...' : 'Send Email'}
          </Button>
          {emailStatus === 'success' && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
          {emailStatus === 'error' && (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
        </div>
      </div>
    </div>
  );
};
