
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Shield, Leaf, Scale, Users } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 hero-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center mb-4 bg-muted rounded-full px-4 py-2 text-sm font-medium text-foreground">
            <Leaf className="w-4 h-4 mr-2 text-ganja-400" />
            LegalTech Ativista
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-ganja-500 via-activist-700 to-ganja-500 bg-clip-text text-transparent">
            Proteja seu cultivo com a GanjaDAO
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 px-4">
            Educação jurídica, ferramentas de automação legal e mobilização comunitária para cultivadores de Cannabis no Brasil
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/juridico">
                <Shield className="mr-2 h-5 w-5" />
                Proteja-se Agora
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/clube">
                <Users className="mr-2 h-5 w-5" />
                Junte-se ao Clube
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
