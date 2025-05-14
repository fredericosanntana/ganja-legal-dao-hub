
import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useInitiative } from "@/hooks/use-initiatives";
import QuadraticVotingForm from "@/components/initiatives/QuadraticVotingForm";

const IniciativaDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { initiative, isLoading, error, vote, removeVote } = useInitiative(id);
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/clube/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar iniciativa",
        description: "Não foi possível obter os detalhes da iniciativa",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (authLoading || isLoading) {
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

  if (!initiative) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Iniciativa não encontrada</p>
          <Button asChild className="mt-4">
            <Link to="/clube/iniciativas">Voltar para lista de iniciativas</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Check if the user has already voted on this initiative
  const userVote = user.votes?.find(v => v.initiative_id === initiative.id);
  
  const handleVote = async (creditsSpent: number) => {
    try {
      await vote(creditsSpent);
      toast({
        title: "Voto registrado!",
        description: `Você alocou ${creditsSpent} créditos para esta iniciativa`,
      });
    } catch (err) {
      toast({
        title: "Erro ao votar",
        description: "Não foi possível registrar seu voto",
        variant: "destructive",
      });
    }
  };

  const handleRemoveVote = async () => {
    try {
      await removeVote();
      toast({
        title: "Voto removido!",
        description: "Seus créditos foram devolvidos",
      });
    } catch (err) {
      toast({
        title: "Erro ao remover voto",
        description: "Não foi possível remover seu voto",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold">{initiative.title}</h1>
              <Badge variant={initiative.status === "open" ? "default" : "secondary"}>
                {initiative.status === "open" ? "Aberta" : "Fechada"}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-2">
              Proposta por: {initiative.author?.username || "Usuário anônimo"}
            </p>
            <p className="text-muted-foreground text-sm">
              Criada em: {new Date(initiative.created_at).toLocaleDateString()}
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold">Descrição</h2>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{initiative.description}</p>
            </CardContent>
          </Card>

          {initiative.status === "open" && user.subscription ? (
            <Card className="mb-8">
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  {userVote ? "Gerenciar seu voto" : "Votar nesta iniciativa"}
                </h2>
              </CardHeader>
              <CardContent>
                {userVote ? (
                  <div className="space-y-4">
                    <p>
                      Você já votou nesta iniciativa, alocando{" "}
                      <strong>{userVote.credits_spent}</strong> créditos.
                    </p>
                    <Button variant="destructive" onClick={handleRemoveVote}>
                      Remover meu voto
                    </Button>
                  </div>
                ) : (
                  <QuadraticVotingForm 
                    availableCredits={user.vote_credits?.total_credits || 0} 
                    onVote={handleVote} 
                  />
                )}
              </CardContent>
            </Card>
          ) : initiative.status !== "open" ? (
            <Card className="mb-8 bg-muted/50">
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground">
                  Esta iniciativa está encerrada e não aceita mais votos.
                </p>
              </CardContent>
            </Card>
          ) : !user.subscription ? (
            <Card className="mb-8 bg-muted/50">
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Apenas assinantes podem votar nas iniciativas.
                </p>
                <Button onClick={() => window.open("https://buy.stripe.com/dR65lA6DX0s6bEQ28c", "_blank")}>
                  Assinar Agora
                </Button>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Estatísticas de Votação</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-md bg-muted/50">
                  <p className="text-sm text-muted-foreground">Votos Totais</p>
                  <p className="text-3xl font-bold">{initiative.votes?.length || 0}</p>
                </div>
                <div className="p-4 rounded-md bg-muted/50">
                  <p className="text-sm text-muted-foreground">Créditos Alocados</p>
                  <p className="text-3xl font-bold">
                    {initiative.votes?.reduce((sum, vote) => sum + vote.credits_spent, 0) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-between">
            <Button variant="outline" asChild>
              <Link to="/clube/iniciativas">← Voltar para iniciativas</Link>
            </Button>
            {initiative.user_id === user.id && initiative.status === "open" && (
              <Button variant="destructive">Encerrar Iniciativa</Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IniciativaDetalhe;
