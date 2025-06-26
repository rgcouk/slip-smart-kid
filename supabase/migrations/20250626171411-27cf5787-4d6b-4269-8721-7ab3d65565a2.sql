
-- Fix RLS policy schema alignment and add missing DELETE policy for profiles
-- Add missing DELETE policy for profiles table
CREATE POLICY "Users can delete their own profile" 
  ON public.profiles 
  FOR DELETE 
  USING (auth.uid() = id);

-- Update child_profiles foreign key to properly reference profiles table
ALTER TABLE public.child_profiles 
DROP CONSTRAINT child_profiles_parent_id_fkey;

ALTER TABLE public.child_profiles 
ADD CONSTRAINT child_profiles_parent_id_fkey 
FOREIGN KEY (parent_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update payslips foreign key to properly reference profiles table  
ALTER TABLE public.payslips 
DROP CONSTRAINT payslips_user_id_fkey;

ALTER TABLE public.payslips 
ADD CONSTRAINT payslips_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
