
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { isValidEmail } from '@/utils/validation';

interface EmailSectionProps {
  isEmailSending: boolean;
  emailStatus: 'idle' | 'success' | 'error';
  onSendEmail: (emailData: { to: string; subject: string; message: string }) => void;
}

export const EmailSection = ({
  isEmailSending,
  emailStatus,
  onSendEmail,
}: EmailSectionProps) => {
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('Your Payslip');
  const [emailMessage, setEmailMessage] = useState('Please find your payslip attached.');
  const [emailError, setEmailError] = useState('');

  const validateAndSend = () => {
    console.log('🔘 Email send button clicked');
    
    // Reset previous errors
    setEmailError('');
    
    // Validate email
    if (!emailTo.trim()) {
      setEmailError('Email address is required');
      return;
    }
    
    if (!isValidEmail(emailTo)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    // Validate subject
    if (!emailSubject.trim()) {
      setEmailError('Email subject is required');
      return;
    }
    
    if (emailSubject.length > 200) {
      setEmailError('Email subject is too long (max 200 characters)');
      return;
    }
    
    // Validate message
    if (emailMessage.length > 1000) {
      setEmailError('Email message is too long (max 1000 characters)');
      return;
    }
    
    console.log('✅ Email validation passed, sending...');
    onSendEmail({
      to: emailTo.trim(),
      subject: emailSubject.trim(),
      message: emailMessage.trim(),
    });
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Email Payslip</Label>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="email-to" className="text-xs text-gray-600">
            Email Address *
          </Label>
          <Input
            id="email-to"
            type="email"
            placeholder="recipient@example.com"
            value={emailTo}
            onChange={(e) => {
              setEmailTo(e.target.value);
              setEmailError(''); // Clear error on change
            }}
            className={emailError && !isValidEmail(emailTo) ? 'border-red-500' : ''}
            maxLength={254}
          />
        </div>
        
        <div>
          <Label htmlFor="email-subject" className="text-xs text-gray-600">
            Subject *
          </Label>
          <Input
            id="email-subject"
            placeholder="Your Payslip"
            value={emailSubject}
            onChange={(e) => {
              setEmailSubject(e.target.value);
              setEmailError(''); // Clear error on change
            }}
            maxLength={200}
          />
        </div>
        
        <div>
          <Label htmlFor="email-message" className="text-xs text-gray-600">
            Message
          </Label>
          <Textarea
            id="email-message"
            placeholder="Please find your payslip attached."
            value={emailMessage}
            onChange={(e) => {
              setEmailMessage(e.target.value);
              setEmailError(''); // Clear error on change
            }}
            rows={3}
            maxLength={1000}
          />
        </div>
        
        {emailError && (
          <div className="text-red-600 text-sm">{emailError}</div>
        )}
        
        <div className="flex items-center gap-3">
          <Button
            onClick={validateAndSend}
            disabled={isEmailSending}
            className="flex-1"
            variant="outline"
          >
            {isEmailSending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Mail className="h-4 w-4 mr-2" />
            )}
            {isEmailSending ? 'Sending...' : 'Send Email'}
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
