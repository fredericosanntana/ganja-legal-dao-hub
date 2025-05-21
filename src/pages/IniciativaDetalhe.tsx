
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import VotingSystemExplanation from "@/components/VotingSystemExplanation";
import Layout from "@/components/Layout";
import { useInitiative } from "@/hooks/use-initiatives";
import InitiativeHeader from "@/components/initiatives/InitiativeHeader";
import InitiativeContent from "@/components/initiatives/InitiativeContent";
import StatusBadge from "@/components/initiatives/StatusBadge";
import InitiativeVotingSection from "@/components/initiatives/InitiativeVotingSection";

const IniciativaDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { initiative, isLoading, error, refreshInitiative } = useInitiative(id);

  // Get user's current vote for this initiative if any
  const userVote = initiative?.votes?.find((vote) => vote.user_id === user?.id);
  
  // Check if user has active subscription
  const hasActiveSubscription = user?.subscription?.status === 'active';

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
      <InitiativeHeader onRefresh={handleRefresh} />
      <VotingSystemExplanation />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{initiative.title}</CardTitle>
              <CardDescription className="mt-2 flex flex-wrap gap-2 items-center">
                <StatusBadge initiative={initiative} />
                <span className="text-sm text-muted-foreground">
                  Criado {formatDate(initiative.created_at)}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <InitiativeContent initiative={initiative} />
          
          <InitiativeVotingSection 
            initiativeId={initiative.id}
            userVote={userVote}
            status={initiative.status}
            hasActiveSubscription={hasActiveSubscription}
            onVoteComplete={refreshInitiative}
          />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default IniciativaDetalhe;
