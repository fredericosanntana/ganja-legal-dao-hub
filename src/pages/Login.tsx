
import React, { useState } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      const userData = await refreshUser();
      
      if (userData) {
        toast.success("Login realizado com sucesso!");
        navigate("/clube/dashboard");
      } else {
        toast.error("Falha ao obter dados do usuário. Tente novamente.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Falha no login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

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
