import React, { useState } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Link } from 'react-router-dom';

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
      await signUp(email, password, username);
      toast.success("Cadastro realizado com sucesso! Faça login para continuar.");
      navigate("/clube/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Erro no cadastro. Verifique os dados e tente novamente.");
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Nome de usuário:
              </label>
              <input
                id="username"
                type="text"
                placeholder="Digite seu nome de usuário"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email:
              </label>
              <input
                id="email"
                type="email"
                placeholder="Digite seu email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Senha:
              </label>
              <input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Confirmar Senha:
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
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
