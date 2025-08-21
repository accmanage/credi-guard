-- Create customers table for storing customer records
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  pan_number TEXT NOT NULL,
  aadhaar_number TEXT NOT NULL,
  mobile TEXT NOT NULL,
  date_registered DATE NOT NULL DEFAULT CURRENT_DATE,
  debit_card_number TEXT,
  pan_photo_url TEXT,
  aadhaar_photo_url TEXT,
  debit_card_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is admin-only system)
CREATE POLICY "Allow all operations on customers" 
ON public.customers 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for document uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('customer-documents', 'customer-documents', false);

-- Create storage policies for document uploads
CREATE POLICY "Allow all operations on customer documents"
ON storage.objects
FOR ALL
USING (bucket_id = 'customer-documents')
WITH CHECK (bucket_id = 'customer-documents');

-- Add some indexes for better performance
CREATE INDEX idx_customers_name ON public.customers(name);
CREATE INDEX idx_customers_account_number ON public.customers(account_number);
CREATE INDEX idx_customers_date_registered ON public.customers(date_registered);