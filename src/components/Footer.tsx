
import { Link } from 'react-router-dom';
import { Leaf, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-ganja-400 to-activist-700 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl">GanjaDAO</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Iniciativa LegalTech ativista para proteção e empoderamento de cultivadores de Cannabis no Brasil através de educação jurídica e ferramentas legais.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-medium text-lg mb-4">Módulos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/juridico" className="text-muted-foreground hover:text-foreground transition-colors">
                  Módulo Jurídico
                </Link>
              </li>
              <li>
                <Link to="/anvisa" className="text-muted-foreground hover:text-foreground transition-colors">
                  Módulo ANVISA
                </Link>
              </li>
              <li>
                <Link to="/calculadoras" className="text-muted-foreground hover:text-foreground transition-colors">
                  Calculadoras
                </Link>
              </li>
              <li>
                <Link to="/conteudo" className="text-muted-foreground hover:text-foreground transition-colors">
                  Conteúdo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-medium text-lg mb-4">Clube</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/clube" className="text-muted-foreground hover:text-foreground transition-colors">
                  Clube de Assinaturas
                </Link>
              </li>
              <li>
                <Link to="/clube/votacoes" className="text-muted-foreground hover:text-foreground transition-colors">
                  Votações
                </Link>
              </li>
              <li>
                <Link to="/clube/iniciativas" className="text-muted-foreground hover:text-foreground transition-colors">
                  Iniciativas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-medium text-lg mb-4">Sobre Nós</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/sobre" className="text-muted-foreground hover:text-foreground transition-colors">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link to="/missao" className="text-muted-foreground hover:text-foreground transition-colors">
                  Nossa Missão
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-muted-foreground/20">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {currentYear} GanjaDAO. Todos os direitos reservados.</p>
            <p className="mt-2">
              Este site é destinado a fins educacionais e ativistas. A GanjaDAO não comercializa, distribui ou incentiva o uso recreativo de substâncias controladas.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
