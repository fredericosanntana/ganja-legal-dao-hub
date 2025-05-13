
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, AlertCircle } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getVotacao, votar } from "@/services/votacoesService";
import { Votacao } from "@/types/votacoes";
import { useToast } from "@/hooks/use-toast";
import VotacaoForm from "@/components/VotacaoForm";

const VotacaoDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [votacao, setVotacao] = useState<Votacao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [creditosDisponiveis, setCreditosDisponiveis] = useState(100);
  
  useEffect(() => {
    const fetchVotacao = async () => {
      if (!id) {
        navigate("/clube/votacoes");
        return;
      }
      
      try {
        const data = await getVotacao(id);
        if (data) {
          setVotacao(data);
        } else {
          toast({
            title: "Votação não encontrada",
            description: "A votação solicitada não foi encontrada",
            variant: "destructive",
          });
          navigate("/clube/votacoes");
        }
      } catch (error) {
        toast({
          title: "Erro ao carregar votação",
          description: "Não foi possível obter os detalhes da votação",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVotacao();
  }, [id, navigate, toast]);

  const handleVotar = async (propostaId: string, creditos: number) => {
    if (!votacao) return;
    
    try {
      const resultado = await votar(votacao.id, propostaId, creditos);
      if (resultado) {
        setCreditosDisponiveis(prev => prev - creditos);
        
        // Atualiza o estado local para refletir o voto
        setVotacao(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            propostas: prev.propostas.map(p => {
              if (p.id === propostaId) {
                return {
                  ...p,
                  creditosAlocados: p.creditosAlocados + creditos,
                  votos: p.votos + 1
                };
              }
              return p;
            })
          };
        });
        
        toast({
          title: "Voto registrado!",
          description: `Você alocou ${creditos} créditos para esta proposta`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao registrar voto",
        description: "Não foi possível processar seu voto",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const totalVotos = votacao?.propostas.reduce((sum, p) => sum + p.votos, 0) || 0;
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Carregando detalhes da votação...</p>
        </div>
      </Layout>
    );
  }

  if (!votacao) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Votação não encontrada</p>
          <Button asChild className="mt-4">
            <Link to="/clube/votacoes">Voltar para lista de votações</Link>
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
              <h1 className="text-3xl font-bold">{votacao.titulo}</h1>
              {votacao.status === 'ativa' ? (
                <Badge className="bg-green-500">Ativa</Badge>
              ) : votacao.status === 'pendente' ? (
                <Badge className="bg-yellow-500">Em breve</Badge>
              ) : (
                <Badge className="bg-gray-500">Finalizada</Badge>
              )}
            </div>
            <p className="text-lg text-muted-foreground mb-4">{votacao.descricao}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Período: {formatDate(votacao.dataInicio)} até {formatDate(votacao.dataFim)}</span>
            </div>
          </div>

          {votacao.status === 'ativa' && (
            <Card className="mb-8 bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="h-6 w-6 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Seus créditos de votação</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Você tem <strong>{creditosDisponiveis}</strong> créditos disponíveis para usar nesta votação.
                      Aloque-os sabiamente entre as propostas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Propostas</h2>
            {votacao.propostas.map((proposta) => (
              <VotacaoForm
                key={proposta.id}
                proposta={proposta}
                totalVotos={totalVotos}
                creditosDisponiveis={creditosDisponiveis}
                onVotar={handleVotar}
                disabled={votacao.status !== 'ativa'}
              />
            ))}
          </div>

          <div className="mt-8">
            <Link to="/clube/votacoes">
              <Button variant="outline">← Voltar para votações</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VotacaoDetalhe;
