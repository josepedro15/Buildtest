-- Create whatsapp_instances table
CREATE TABLE IF NOT EXISTS public.whatsapp_instances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instance_name TEXT NOT NULL,
  instance_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'connecting' CHECK (status IN ('connecting', 'connected', 'disconnected', 'error')),
  qr_code TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_activity TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_instances_user_id ON public.whatsapp_instances(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_instances_instance_id ON public.whatsapp_instances(instance_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_instances_status ON public.whatsapp_instances(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_instances_created_at ON public.whatsapp_instances(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.whatsapp_instances ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own instances" ON public.whatsapp_instances
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own instances" ON public.whatsapp_instances
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own instances" ON public.whatsapp_instances
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own instances" ON public.whatsapp_instances
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_whatsapp_instances_updated_at
  BEFORE UPDATE ON public.whatsapp_instances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE public.whatsapp_instances IS 'Tabela para armazenar instâncias do WhatsApp conectadas pelos usuários';
COMMENT ON COLUMN public.whatsapp_instances.instance_name IS 'Nome amigável da instância (ex: lojamoveis)';
COMMENT ON COLUMN public.whatsapp_instances.instance_id IS 'ID único da instância na API Evolution';
COMMENT ON COLUMN public.whatsapp_instances.status IS 'Status atual da conexão: connecting, connected, disconnected, error';
COMMENT ON COLUMN public.whatsapp_instances.qr_code IS 'URL do QR Code para conexão';
COMMENT ON COLUMN public.whatsapp_instances.phone_number IS 'Número de telefone conectado (quando disponível)';
COMMENT ON COLUMN public.whatsapp_instances.message_count IS 'Contador de mensagens processadas';
COMMENT ON COLUMN public.whatsapp_instances.is_active IS 'Se a instância está ativa para receber dados';
