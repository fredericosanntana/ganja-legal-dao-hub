
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { signIn, refreshUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  
  // Check if user is already authenticated only once on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          setIsRedirecting(true);
          navigate('/clube/dashboard');
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setHasCheckedAuth(true);
      }
    };
    
    if (!hasCheckedAuth) {
      checkAuth();
    }
  }, [navigate, hasCheckedAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) throw error;
      
      toast.success("Login realizado com sucesso!");
      setIsRedirecting(true);
      
      // Use a short timeout to ensure the session is properly set
      setTimeout(() => {
        navigate("/clube/dashboard");
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Falha no login. Verifique suas credenciais.");
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };

  if (isRedirecting) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <p className="text-lg">Redirecionando para o dashboard...</p>
            <Button 
              onClick={() => navigate("/clube/dashboard")} 
              variant="outline"
            >
              Continuar manualmente
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Don't render login form until we've checked authentication to prevent flashing
  if (!hasCheckedAuth) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                className="w-full"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                type="password"
                id="password"
                className="w-full"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              disabled={isLoading} 
              className="w-full bg-green-600 text-white hover:bg-green-700"
              type="submit"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> 
                  Entrando...
                </span>
              ) : "Entrar"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/clube/cadastro" className="text-sm text-gray-600 hover:text-gray-800">
              Não tem uma conta? Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
