
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useInitiatives } from "@/hooks/use-initiatives";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ThumbsUp, Users, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { QuadraticVotingForm } from "@/components/initiatives/QuadraticVotingForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import VotingSystemExplanation from "@/components/VotingSystemExplanation";

const IniciativaDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getInitiativeById, isLoading } = useInitiatives();
  const [initiative, setInitiative] = useState<any>(null);
  const [showVotingForm, setShowVotingForm] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchInitiative(id);
    }
  }, [id]);

  const fetchInitiative = async (initiativeId: string) => {
    try {
      const data = await getInitiativeById(initiativeId);
      setInitiative(data);
    } catch (error) {
      console.error("Error fetching initiative:", error);
      toast.error("Não foi possível carregar os dados da iniciativa.");
    }
  };

  // Get user's current vote for this initiative if any
  const userVote = initiative?.votes?.find((vote: any) => vote.user_id === user?.id);
  
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
      <div className="container max-w-4xl py-8">
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
      </div>
    );
  }

  if (!initiative) {
    return (
      <div className="container max-w-4xl py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Iniciativa não encontrada</AlertTitle>
          <AlertDescription>
            A iniciativa que você está procurando não existe ou foi removida.
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => navigate('/clube/iniciativas')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Iniciativas
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <Button
        variant="outline"
        size="sm"
        className="mb-6"
        onClick={() => navigate('/clube/iniciativas')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Iniciativas
      </Button>

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
              <AvatarImage src={initiative.creator?.avatar_url} />
              <AvatarFallback>{initiative.creator?.username?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{initiative.creator?.username || "Usuário Anônimo"}</p>
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
                <strong>{initiative.total_votes || 0}</strong> votos
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                <strong>{initiative.unique_voters || 0}</strong> participantes
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
                    Você votou com intensidade {userVote.intensity}, utilizando {userVote.credits_spent} créditos.
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
                      fetchInitiative(initiative.id);
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IniciativaDetalhe;
