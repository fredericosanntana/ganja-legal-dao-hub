import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Cadastro = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        toast.error("Este email já está cadastrado. Por favor, tente outro ou faça login.");
        setIsLoading(false);
        return;
      }

      // Register user with inactive subscription by default
      await signUp(email, password, username);
      
      toast.success("Cadastro realizado com sucesso! Faça login para continuar.");
      navigate("/clube/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle specific error cases
      if (error.message?.includes('duplicate key') || error.message?.includes('already exists')) {
        toast.error("Este email já está cadastrado. Por favor, tente outro ou faça login.");
      } else {
        const errorMessage = error?.message || "Erro no cadastro. Verifique os dados e tente novamente.";
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Criar uma conta
          </h2>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-amber-800">
                  Após o cadastro, sua conta estará com assinatura inativa. 
                  Para ativar, faça login e atualize seu plano.
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Nome de usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> 
                  Cadastrando...
                </span>
              ) : "Cadastrar"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            Já tem uma conta?{" "}
            <Link to="/clube/login" className="text-green-500 hover:text-green-700">
              Faça login
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cadastro;
