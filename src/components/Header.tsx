import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X } from "lucide-react";
import { WHATSAPP_CONTACT } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleWhatsAppContact = () => {
    window.open(WHATSAPP_CONTACT.link, '_blank');
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">WhatsApp Analytics</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#benefits" className="text-foreground hover:text-primary transition-colors">
            Benefícios
          </a>
          <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
            Como Funciona
          </a>
          <a href="#cases" className="text-foreground hover:text-primary transition-colors">
            Casos de Uso
          </a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors">
            Contato
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="outline">
            <a href="/auth">Entrar</a>
          </Button>
          <Button 
            onClick={handleWhatsAppContact}
            className="bg-green-600 hover:bg-green-700"
          >
            Falar com um Especialista
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#benefits" className="text-foreground hover:text-primary transition-colors">
              Benefícios
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">
              Como Funciona
            </a>
            <a href="#cases" className="text-foreground hover:text-primary transition-colors">
              Casos de Uso
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contato
            </a>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Button asChild variant="outline" className="w-full">
                <a href="/auth">Entrar</a>
              </Button>
              <Button 
                onClick={handleWhatsAppContact}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Falar com um Especialista
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;