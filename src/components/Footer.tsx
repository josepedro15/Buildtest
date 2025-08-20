import { MessageCircle, Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">ConversaFlow</span>
            </div>
            <p className="text-background/80 mb-4 max-w-md">
              IA que analisa conversas do WhatsApp para gerar insights de melhoria 
              e otimizar seus resultados de negócio.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Produto</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-primary transition-colors">Recursos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Preços</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Documentação</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Status</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contato</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © 2025 ConversaFlow Inc. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy-policy" className="text-background/60 hover:text-primary transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/terms-of-service" className="text-background/60 hover:text-primary transition-colors">
                Termos de Uso
              </Link>
              <Link to="/cookie-policy" className="text-background/60 hover:text-primary transition-colors">
                Política de Cookies
              </Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('cookiesAccepted');
                  window.location.reload();
                }}
                className="text-background/60 hover:text-primary transition-colors"
              >
                Gerenciar Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;