import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Perfil = () => {
  const { user, refreshUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    } else {
      navigate('/clube/login');
    }
  }, [user, navigate]);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      if (username.length < 3) {
        toast.error("Nome de usuário deve ter pelo menos 3 caracteres.");
        return;
      }
      
      // Update user profile using supabase directly since updateUser isn't available
      const { error } = await supabase
        .from('users')
        .update({ username })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      // Refresh user data after update
      await refreshUser();
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error("Erro ao atualizar o perfil.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    setIsPasswordChanging(true);
    if (!password) {
      toast.error("Por favor, insira sua senha atual.");
      setIsPasswordChanging(false);
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      setIsPasswordChanging(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("As novas senhas não coincidem.");
      setIsPasswordChanging(false);
      return;
    }

    try {
      // Use supabase auth to update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success("Senha alterada com sucesso!");
      setPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error: any) {
      console.error("Change password error:", error);
      toast.error(error.message || "Erro ao alterar a senha. Verifique sua senha atual.");
    } finally {
      setIsPasswordChanging(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/clube/login');
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      console.error("Sign out error:", error);
      // Even if there's an error, we'll still redirect to login
      toast.info("Sessão encerrada.");
      navigate('/clube/login');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
              <CardDescription>
                Gerencie suas informações de perfil e segurança.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.subscription ? (
                <div className="rounded-md border border-green-500 bg-green-50 p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <p className="text-sm font-medium text-green-700">
                      Assinatura ativa.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-md border border-yellow-500 bg-yellow-50 p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <p className="text-sm font-medium text-yellow-700">
                      Assinatura inativa. <a href="/clube/dashboard" className="underline">Clique aqui para ativar.</a>
                    </p>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                />
              </div>
              <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                {isUpdating ? "Atualizando..." : "Atualizar Perfil"}
              </Button>

              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Alterar Senha</h3>
                <div>
                  <Label htmlFor="currentPassword">Senha atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmNewPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleChangePassword} disabled={isPasswordChanging}>
                  {isPasswordChanging ? "Alterando..." : "Alterar Senha"}
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button variant="destructive" onClick={handleSignOut}>
                  Sair
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Perfil;
