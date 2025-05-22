
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, BookOpen, Calculator, FileText, Users, Leaf } from 'lucide-react';
import Logo from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-background/90 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/juridico" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors duration-200 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            Jurídico
          </Link>
          <Link to="/anvisa" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors duration-200 flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            ANVISA
          </Link>
          <Link to="/calculadoras" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors duration-200 flex items-center gap-1.5">
            <Calculator className="h-4 w-4" />
            Calculadoras
          </Link>
          <Link to="/conteudo" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors duration-200 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            Conteúdo
          </Link>
          <div className="ml-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/clube">
                <Users className="h-4 w-4 mr-1" />
                Clube
              </Link>
            </Button>
          </div>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Menu">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden p-4 space-y-2 bg-background border-b border-border">
          <Link 
            to="/juridico" 
            className="block px-3 py-2 rounded-md hover:bg-muted transition-colors duration-200 flex items-center gap-1.5"
            onClick={toggleMenu}
          >
            <BookOpen className="h-4 w-4" />
            Jurídico
          </Link>
          <Link 
            to="/anvisa" 
            className="block px-3 py-2 rounded-md hover:bg-muted transition-colors duration-200 flex items-center gap-1.5"
            onClick={toggleMenu}
          >
            <FileText className="h-4 w-4" />
            ANVISA
          </Link>
          <Link 
            to="/calculadoras" 
            className="block px-3 py-2 rounded-md hover:bg-muted transition-colors duration-200 flex items-center gap-1.5"
            onClick={toggleMenu}
          >
            <Calculator className="h-4 w-4" />
            Calculadoras
          </Link>
          <Link 
            to="/plano-cultivo" 
            className="block px-3 py-2 rounded-md hover:bg-muted transition-colors duration-200 flex items-center gap-1.5"
            onClick={toggleMenu}
          >
            <Leaf className="h-4 w-4" />
            Plano de Cultivo
          </Link>
          <Link 
            to="/conteudo" 
            className="block px-3 py-2 rounded-md hover:bg-muted transition-colors duration-200 flex items-center gap-1.5"
            onClick={toggleMenu}
          >
            <BookOpen className="h-4 w-4" />
            Conteúdo
          </Link>
          <div className="pt-2">
            <Button className="w-full" asChild>
              <Link to="/clube" onClick={toggleMenu}>
                <Users className="h-4 w-4 mr-1" />
                Clube
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
