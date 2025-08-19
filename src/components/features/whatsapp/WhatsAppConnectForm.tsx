import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone, Zap } from 'lucide-react';
import { z } from 'zod';

const connectSchema = z.object({
  instanceName: z.string()
    .min(3, 'Nome da instância deve ter pelo menos 3 caracteres')
    .max(50, 'Nome da instância deve ter no máximo 50 caracteres')
    .regex(/^[a-z0-9]+$/, 'Use apenas letras minúsculas e números (sem hífens ou caracteres especiais)')
});

export type ConnectFormData = z.infer<typeof connectSchema>;

interface WhatsAppConnectFormProps {
  formData: ConnectFormData;
  setFormData: (data: ConnectFormData) => void;
  errors: Partial<ConnectFormData>;
  setErrors: (errors: Partial<ConnectFormData>) => void;
  isCreatingInstance: boolean;
  onCreateInstance: () => void;
}

export function WhatsAppConnectForm({
  formData,
  setFormData,
  errors,
  setErrors,
  isCreatingInstance,
  onCreateInstance
}: WhatsAppConnectFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name as keyof ConnectFormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      connectSchema.parse(formData);
      onCreateInstance();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<ConnectFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ConnectFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Smartphone className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Conectar WhatsApp</CardTitle>
        <CardDescription>
          Crie uma nova instância do WhatsApp para começar a usar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instanceName">Nome da Instância</Label>
            <Input
              id="instanceName"
              name="instanceName"
              type="text"
              placeholder="minhainstancia123"
              value={formData.instanceName}
              onChange={handleInputChange}
              className={errors.instanceName ? 'border-red-500' : ''}
            />
            {errors.instanceName && (
              <p className="text-sm text-red-500">{errors.instanceName}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Use apenas letras minúsculas e números. Ex: minhainstancia123
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isCreatingInstance}
          >
            {isCreatingInstance ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-spin" />
                Criando Instância...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Criar Instância
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
