
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vote, Calendar, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Votacao } from "@/types/votacoes";
import { getVotacoes } from "@/services/votacoesService";
import { useToast } from "@/hooks/use-toast";

const Votacoes = () => {
  const [votacoes, setVotacoes] = useState<Votacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVotacoes = async () => {
      try {
        const data = await getVotacoes();
        setVotacoes(data);
      } catch (error) {
        toast({
          title: "Erro ao carregar votações",
          description: "Não foi possível obter a lista de votações",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVotacoes();
  }, [toast]);

  const votacoesAtivas = votacoes.filter(v => v.status === 'ativa');
  const votacoesPendentes = votacoes.filter(v => v.status === 'pendente');
  const votacoesFinalizadas = votacoes.filter(v => v.status === 'finalizada');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativa':
        return <Badge className="bg-green-500">Ativa</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-500">Em breve</Badge>;
      case 'finalizada':
        return <Badge className="bg-gray-500">Finalizada</Badge>;
      default:
        return null;
    }
  };

  const renderVotacaoCard = (votacao: Votacao) => (
    <Card key={votacao.id} className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{votacao.titulo}</CardTitle>
          {getStatusBadge(votacao.status)}
        </div>
        <CardDescription>{votacao.descricao}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {formatDate(votacao.dataInicio)} até {formatDate(votacao.dataFim)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Vote className="h-4 w-4 text-muted-foreground" />
            <span>{votacao.propostas.reduce((sum, p) => sum + p.votos, 0)} votos totais</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{votacao.propostas.length} propostas</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={votacao.status === 'ativa' ? "default" : "outline"}
          asChild
        >
          <Link to={`/clube/votacoes/${votacao.id}`}>
            {votacao.status === 'ativa' ? 'Votar Agora' : 'Ver Detalhes'} 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Sistema de Votação</h1>
          <p className="text-lg text-muted-foreground">
            Participe das decisões da GanjaDAO através do sistema de votação quadrática
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="h-5 w-5 text-primary" />
                Como funciona a votação quadrática
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                A votação quadrática permite uma distribuição mais democrática de influência, onde:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Cada membro recebe <strong>créditos de voto</strong> para utilizar em propostas</li>
                <li>O <strong>custo</strong> para alocar créditos cresce quadraticamente (1 voto = 1 crédito, 2 votos = 4 créditos, etc.)</li>
                <li>Você pode distribuir seus créditos entre múltiplas propostas ou concentrá-los em uma única</li>
                <li>Esse sistema permite que minorias tenham voz em questões importantes para elas</li>
              </ul>
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium">Exemplo:</p>
                <p>Com 16 créditos, você pode votar de várias formas:</p>
                <ul className="list-disc pl-5">
                  <li>1 voto em cada uma de 16 propostas diferentes (custo: 16 créditos)</li>
                  <li>2 votos em 4 propostas (custo: 4 × 4 = 16 créditos)</li>
                  <li>4 votos em 1 proposta (custo: 16 créditos)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="text-center py-8">
              <p>Carregando votações...</p>
            </div>
          ) : (
            <Tabs defaultValue="ativas" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ativas">
                  Ativas ({votacoesAtivas.length})
                </TabsTrigger>
                <TabsTrigger value="pendentes">
                  Em Breve ({votacoesPendentes.length})
                </TabsTrigger>
                <TabsTrigger value="finalizadas">
                  Finalizadas ({votacoesFinalizadas.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ativas" className="mt-6">
                {votacoesAtivas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {votacoesAtivas.map(renderVotacaoCard)}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>Não há votações ativas no momento.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="pendentes" className="mt-6">
                {votacoesPendentes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {votacoesPendentes.map(renderVotacaoCard)}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>Não há votações agendadas no momento.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="finalizadas" className="mt-6">
                {votacoesFinalizadas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {votacoesFinalizadas.map(renderVotacaoCard)}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p>Não há votações finalizadas.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <div className="mt-8">
            <Link to="/clube">
              <Button variant="outline">← Voltar para o Clube</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Votacoes;
