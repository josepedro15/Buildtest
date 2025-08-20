import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para gerar link do WhatsApp
export function getWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}

// Link padrão do WhatsApp para contato
export const WHATSAPP_CONTACT = {
  phone: '+5531994959512',
  message: 'Olá! Gostaria de saber mais sobre o MetricaWhats e como posso implementar em minha empresa.',
  link: getWhatsAppLink('+5531994959512', 'Olá! Gostaria de saber mais sobre o MetricaWhats e como posso implementar em minha empresa.')
};
