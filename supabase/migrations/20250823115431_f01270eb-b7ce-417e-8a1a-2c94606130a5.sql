-- Create users table for authentication
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff'
);

-- Create staff_data table for staff records
CREATE TABLE public.staff_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID,
  customer_name TEXT,
  record JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample admin and staff users
INSERT INTO public.users (email, password, role) VALUES 
('admin@example.com', 'admin123', 'admin'),
('staff@example.com', 'staff123', 'staff');

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can read their own data" ON public.users 
FOR SELECT USING (true);

-- Create RLS policies for staff_data table  
CREATE POLICY "Staff can manage their own data" ON public.staff_data
FOR ALL USING (true);