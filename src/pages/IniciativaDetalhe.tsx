
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ThumbsUp, Users, AlertTriangle, RefreshCw } from "lucide-react";
import { useState } from "react";
import QuadraticVotingForm from "@/components/initiatives/QuadraticVotingForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import VotingSystemExplanation from "@/components/VotingSystemExplanation";
import Layout from "@/components/Layout";
import { useInitiative } from "@/hooks/use-initiatives";
import { InitiativeVote } from "@/types/initiatives";

const IniciativaDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { initiative, isLoading, error, refreshInitiative } = useInitiative(id);
  const [showVotingForm, setShowVotingForm] = useState(false);

  // Get user's current vote for this initiative if any
  const userVote = initiative?.votes?.find((vote) => vote.user_id === user?.id);
  
  // Check if user has active subscription
  const hasActiveSubscription = user?.subscription?.status === 'active';

  // Handle voting form visibility
  const toggleVotingForm = () => {
    if (!user) {
      toast.error("Você precisa estar logado para votar.");
      return;
    }
    
    if (!hasActiveSubscription) {
      toast.error("Apenas membros ativos podem votar em iniciativas.");
      return;
    }
    
    setShowVotingForm(!showVotingForm);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch (e) {
      return "Data desconhecida";
    }
  };

  // Refresh initiative data
  const handleRefresh = () => {
    if (refreshInitiative) {
      refreshInitiative();
      toast.info("Atualizando dados da iniciativa...");
    }
  };

  // Check initiative status
  const getStatusBadge = () => {
    if (!initiative) return null;
    
    switch (initiative.status) {
      case 'open':
        return <Badge>Aberta para Votação</Badge>;
      case 'closed':
        return <Badge variant="outline">Votação Encerrada</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Aprovada</Badge>;
      case 'rejected':
        return <Badge variant="secondary">Rejeitada</Badge>;
      case 'implementing':
        return <Badge variant="default" className="bg-blue-500">Em Implementação</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-emerald-500">Implementada</Badge>;
      default:
        return <Badge variant="outline">Status Desconhecido</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Button
          variant="outline"
          size="sm"
          className="mb-6"
          onClick={() => navigate('/clube/iniciativas')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Iniciativas
        </Button>
        
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </Layout>
    );
  }

  if (!initiative) {
    return (
      <Layout>
        <Button
          variant="outline"
          size="sm"
          className="mb-6"
          onClick={() => navigate('/clube/iniciativas')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Iniciativas
        </Button>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Iniciativa não encontrada</AlertTitle>
          <AlertDescription>
            A iniciativa que você está procurando não existe ou foi removida.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/clube/iniciativas')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Iniciativas
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/clube/iniciativas')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Iniciativas
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          title="Atualizar dados da iniciativa"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <VotingSystemExplanation />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{initiative.title}</CardTitle>
              <CardDescription className="mt-2 flex flex-wrap gap-2 items-center">
                {getStatusBadge()}
                <span className="text-sm text-muted-foreground">
                  Criado {formatDate(initiative.created_at)}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage 
                src={
                  initiative.author?.avatar_url ||
                  (initiative.creator && initiative.creator.avatar_url) || 
                  undefined
                } 
              />
              <AvatarFallback>
                {((initiative.author?.username || initiative.creator?.username || "U").charAt(0))}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {initiative.author?.username || (initiative.creator && initiative.creator.username) || "Usuário Anônimo"}
              </p>
              <p className="text-xs text-muted-foreground">Autor da Iniciativa</p>
            </div>
          </div>

          <Separator />

          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: initiative.description }} />
          </div>

          <div className="flex flex-wrap gap-3 items-center pt-4">
            <div className="flex items-center gap-2 text-sm">
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              <span>
                <strong>
                  {initiative.total_votes || initiative._count?.votes || initiative.votes?.length || 0}
                </strong> votos
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                <strong>
                  {initiative.unique_voters || initiative.votes?.length || 0}
                </strong> participantes
              </span>
            </div>
          </div>

          {initiative.status === 'open' && (
            <div className="pt-4">
              {userVote ? (
                <Alert>
                  <ThumbsUp className="h-4 w-4" />
                  <AlertTitle>Você já votou nesta iniciativa</AlertTitle>
                  <AlertDescription>
                    Você votou com intensidade {userVote.credits_spent}, utilizando {userVote.credits_spent} créditos.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <Button onClick={toggleVotingForm} className="w-full">
                    {showVotingForm ? "Cancelar" : "Votar nesta Iniciativa"}
                  </Button>
                  
                  {!hasActiveSubscription && (
                    <Alert className="mt-3">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Assinatura necessária</AlertTitle>
                      <AlertDescription>
                        Apenas membros com assinatura ativa podem votar em iniciativas.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
              
              {showVotingForm && (
                <div className="mt-4">
                  <QuadraticVotingForm 
                    initiativeId={initiative.id} 
                    onVotingComplete={() => {
                      setShowVotingForm(false);
                      refreshInitiative();
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default IniciativaDetalhe;
