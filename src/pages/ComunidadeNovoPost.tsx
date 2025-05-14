
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import CreatePostForm from "@/components/forum/CreatePostForm";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ComunidadeNovoPost = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/clube/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6 text-center">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Redirect will happen in the useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/clube/comunidade">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Comunidade
          </Link>
        </Button>
        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Criar Novo Post</h1>
          <CreatePostForm />
        </div>
      </div>
    </Layout>
  );
};

export default ComunidadeNovoPost;
