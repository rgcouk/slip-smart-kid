-- Add ytd_data column to payslips table for storing year-to-date override information
ALTER TABLE public.payslips 
ADD COLUMN ytd_data JSONB;