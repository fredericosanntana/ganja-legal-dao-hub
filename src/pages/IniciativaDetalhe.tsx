import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowLeft, Calendar, User, Vote } from "lucide-react";
import { useInitiative } from "@/hooks/use-initiatives";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import QuadraticVotingForm from "@/components/initiatives/QuadraticVotingForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const IniciativaDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { initiative, isLoading, error, vote } = useInitiative(id);
  const [isVoting, setIsVoting] = useState(false);

  // Check if user can vote (has active subscription)
  const canVote = user?.subscription && user.subscription.status === 'active';
  
  // Calculate available credits
  const availableCredits = user?.vote_credits?.total_credits || 0;
  
  // Check if initiative is open for voting
  const isOpen = initiative?.status === "open";
  
  // Check if user has already voted on this initiative
  const hasVoted = initiative?.votes.some(v => v.user_id === user?.id);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar iniciativa",
        description: "Não foi possível obter os detalhes da iniciativa",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleVote = async (creditsSpent: number) => {
    if (!id || !canVote) return;
    
    setIsVoting(true);
    try {
      const success = await vote(creditsSpent);
      if (success) {
        toast({
          title: "Voto registrado!",
          description: `Você alocou ${creditsSpent} créditos para esta iniciativa`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao registrar voto",
        description: "Não foi possível processar seu voto",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Carregando detalhes da iniciativa...</p>
        </div>
      </Layout>
    );
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold">{initiative.title}</h1>
              <Badge variant={isOpen ? "default" : "outline"}>
                {isOpen ? "Aberta" : "Fechada"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <User className="h-4 w-4" />
              <span>Proposta por: {initiative.author?.username || "Anônimo"}</span>
              <Calendar className="h-4 w-4 ml-2" />
              <span>
                {new Date(initiative.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="whitespace-pre-line">{initiative.description}</p>
            </CardContent>
          </Card>

          {isOpen && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Votação</CardTitle>
                <CardDescription>
                  {canVote 
                    ? "Vote nesta iniciativa usando o sistema de votação quadrática" 
                    : "Apenas membros com assinatura ativa podem votar"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!canVote ? (
                  <Alert variant="warning" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Assinatura necessária</AlertTitle>
                    <AlertDescription>
                      Você precisa ter uma assinatura ativa para votar nesta iniciativa.
                      <div className="mt-2">
                        <Button size="sm" onClick={() => window.open("https://buy.stripe.com/dR65lA6DX0s6bEQ28c", "_blank")}>
                          Assinar agora
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : hasVoted ? (
                  <Alert className="mb-4">
                    <Vote className="h-4 w-4" />
                    <AlertTitle>Voto registrado</AlertTitle>
                    <AlertDescription>
                      Você já votou nesta iniciativa. Obrigado pela participação!
                    </AlertDescription>
                  </Alert>
                ) : (
                  <QuadraticVotingForm 
                    availableCredits={availableCredits}
                    onVote={handleVote}
                  />
                )}
              </CardContent>
            </Card>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Votos ({initiative.votes.length})</h2>
            {initiative.votes.length > 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {initiative.votes.map((vote) => (
                      <div key={vote.id} className="flex justify-between items-center pb-2 border-b">
                        <div>
                          <p className="font-medium">Usuário #{vote.user_id.substring(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(vote.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {vote.credits_spent} créditos
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-muted-foreground">
                    Nenhum voto registrado ainda.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mt-8">
            <Button variant="outline" asChild>
              <Link to="/clube/iniciativas">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para iniciativas
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IniciativaDetalhe;
