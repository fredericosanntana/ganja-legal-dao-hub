
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Página não encontrada</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Desculpe, não conseguimos encontrar a página que você está procurando.
          </p>
          <Button size="lg" asChild>
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Voltar para a Página Inicial
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
