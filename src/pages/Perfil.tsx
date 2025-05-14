
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User } from "lucide-react";

const profileSchema = z.object({
  username: z.string().min(3, "O nome de usuário deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Perfil = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/clube/login");
    }

    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
      });
    }
  }, [isLoading, isAuthenticated, navigate, user, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSaving(true);
    
    try {
      // This would normally update the user's profile
      // But we'll just show a toast for now
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar suas informações",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
          
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle>Informações Pessoais</CardTitle>
              </div>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome de usuário</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSaving} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSaving} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4">
                    <Button type="submit" disabled={isSaving} className="w-full">
                      {isSaving ? "Salvando..." : "Salvar alterações"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 border-t pt-4">
              <div>
                <h3 className="font-medium text-sm mb-2">Alterar senha</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Para alterar sua senha, clique no botão abaixo
                </p>
                <Button variant="outline" className="w-full">
                  Alterar senha
                </Button>
              </div>
              
              <div>
                <h3 className="font-medium text-sm mb-2">Assinatura</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {user.subscription 
                    ? "Sua assinatura está ativa. Clique abaixo para gerenciar."
                    : "Você ainda não possui uma assinatura ativa."}
                </p>
                <Button 
                  variant={user.subscription ? "outline" : "default"} 
                  className="w-full"
                  onClick={() => window.open("https://buy.stripe.com/dR65lA6DX0s6bEQ28c", "_blank")}
                >
                  {user.subscription ? "Gerenciar assinatura" : "Assinar agora"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Perfil;
