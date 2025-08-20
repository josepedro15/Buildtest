-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'archived')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  source TEXT DEFAULT 'contact_form',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  assigned_to UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_priority ON public.contact_messages(priority);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_assigned_to ON public.contact_messages(assigned_to);

-- Enable RLS (Row Level Security)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Admins can view all contact messages" ON public.contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND id IN (
        'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
        '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
      )
    )
  );

CREATE POLICY "Admins can insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND id IN (
        'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
        '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
      )
    )
  );

CREATE POLICY "Admins can update contact messages" ON public.contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND id IN (
        'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
        '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
      )
    )
  );

CREATE POLICY "Admins can delete contact messages" ON public.contact_messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND id IN (
        'f4c09bd2-db18-44f3-8eb9-66a50e883b67',
        '09961117-d889-4ed7-bfcf-cac6b5e4e5a6'
      )
    )
  );

-- Allow public to insert contact messages (for the contact form)
CREATE POLICY "Public can insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_messages_updated_at();

-- Add comments
COMMENT ON TABLE public.contact_messages IS 'Tabela para armazenar mensagens de contato enviadas pelos usuários';
COMMENT ON COLUMN public.contact_messages.name IS 'Nome completo do remetente';
COMMENT ON COLUMN public.contact_messages.email IS 'Email do remetente';
COMMENT ON COLUMN public.contact_messages.company IS 'Empresa do remetente (opcional)';
COMMENT ON COLUMN public.contact_messages.phone IS 'Telefone do remetente (opcional)';
COMMENT ON COLUMN public.contact_messages.message IS 'Mensagem enviada';
COMMENT ON COLUMN public.contact_messages.status IS 'Status da mensagem: pending, read, replied, archived';
COMMENT ON COLUMN public.contact_messages.priority IS 'Prioridade da mensagem: low, normal, high, urgent';
COMMENT ON COLUMN public.contact_messages.source IS 'Origem da mensagem (contact_form, etc)';
COMMENT ON COLUMN public.contact_messages.ip_address IS 'Endereço IP do remetente';
COMMENT ON COLUMN public.contact_messages.user_agent IS 'User agent do navegador';
COMMENT ON COLUMN public.contact_messages.read_at IS 'Data/hora em que a mensagem foi lida';
COMMENT ON COLUMN public.contact_messages.replied_at IS 'Data/hora em que foi respondida';
COMMENT ON COLUMN public.contact_messages.admin_notes IS 'Notas administrativas sobre a mensagem';
COMMENT ON COLUMN public.contact_messages.assigned_to IS 'Admin responsável por responder a mensagem';
