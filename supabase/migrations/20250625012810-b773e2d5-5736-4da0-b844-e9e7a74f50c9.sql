
-- Manually verify the user's email
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    updated_at = NOW()
WHERE id = '3442a819-6ff4-436e-acae-755654f6914f';
