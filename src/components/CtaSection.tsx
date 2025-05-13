
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Users } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-activist-800 to-ganja-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Faça Parte da Mudança</h2>
          <p className="text-lg mb-8">
            Junte-se ao Clube GanjaDAO por R$4,20/mês e tenha acesso a todas as ferramentas, 
            participe das votações de iniciativas e ajude a promover a descentralização do acesso 
            ao direito para cultivadores.
          </p>
          <Button size="lg" variant="outline" className="bg-white hover:bg-white/90 text-activist-800" asChild>
            <Link to="/clube">
              <Users className="mr-2 h-5 w-5" />
              Junte-se ao Clube
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
