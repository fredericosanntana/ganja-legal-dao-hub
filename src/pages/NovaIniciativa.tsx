
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { createInitiative } from "@/services/initiativeService";

const iniciativaSchema = z.object({
  title: z.string()
    .min(5, "O título deve ter pelo menos 5 caracteres")
    .max(100, "O título deve ter no máximo 100 caracteres"),
  description: z.string()
    .min(20, "A descrição deve ter pelo menos 20 caracteres")
    .max(2000, "A descrição deve ter no máximo 2000 caracteres"),
});

type IniciativaFormValues = z.infer<typeof iniciativaSchema>;

const NovaIniciativa = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<IniciativaFormValues>({
    resolver: zodResolver(iniciativaSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Check if user is authenticated and has subscription
  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  if (!authLoading && (!isAuthenticated || !user?.subscription)) {
    navigate("/clube/dashboard");
    return null;
  }

  const onSubmit = async (values: IniciativaFormValues) => {
    setIsSubmitting(true);
    
    try {
      const created = await createInitiative(values.title, values.description);
      
      if (created) {
        toast({
          title: "Iniciativa criada com sucesso",
          description: "Sua iniciativa foi publicada para votação",
        });
        navigate(`/clube/iniciativas/${created.id}`);
      } else {
        toast({
          title: "Erro ao criar iniciativa",
          description: "Não foi possível criar sua iniciativa",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao criar iniciativa",
        description: "Ocorreu um erro ao processar sua solicitação",
        variant: "destructive",
      });
      console.error("Create initiative error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Nova Iniciativa</h1>
            <p className="text-muted-foreground">
              Crie uma nova proposta para ser votada pelos membros do clube
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalhes da iniciativa</CardTitle>
              <CardDescription>
                Preencha as informações da sua proposta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Título da sua iniciativa"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Descreva em detalhes sua proposta..."
                            className="min-h-[200px]"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      asChild
                    >
                      <Link to="/clube/iniciativas">Cancelar</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Criando..." : "Criar Iniciativa"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default NovaIniciativa;
