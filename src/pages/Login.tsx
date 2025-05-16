
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, refreshUser, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verifique se o usuário já está autenticado e redirecione
  useEffect(() => {
    if (isAuthenticated && !loading) {
      // Usar timeout para evitar redirecionamento prematuro durante carregamento de autenticação
      setTimeout(() => {
        console.log("Usuário já autenticado, redirecionando para o dashboard");
        navigate("/clube/dashboard");
      }, 0);
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Registra tentativa de login
      console.log("Tentando fazer login com:", email);
      
      const authResult = await signIn(email, password);
      console.log("Resultado da autenticação:", authResult);
      
      const userData = await refreshUser();
      console.log("Dados do usuário obtidos:", userData ? "sim" : "não");
      
      if (userData) {
        toast.success("Login realizado com sucesso!");
        console.log("Redirecionando para dashboard após login bem-sucedido");
        navigate("/clube/dashboard");
      } else {
        console.error("Falha ao obter dados do usuário após login");
        toast.error("Falha ao obter dados do usuário. Tente novamente.");
      }
    } catch (error: any) {
      console.error("Erro no login:", error);
      toast.error(error.message || "Falha no login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  // Se estiver carregando a autenticação, mostre uma mensagem
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Verificando autenticação...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Login</CardTitle>
            <CardDescription>Entre com sua conta para acessar o GanjaDAO Clube</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/clube/cadastro" className="text-sm text-primary hover:underline">
              Não tem uma conta? Cadastre-se
            </Link>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;
