
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { FileText, Search, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface JurisprudenciaResult {
  id: string;
  tribunal: string;
  numeroProcesso: string;
  dataAjuizamento?: string;
  classe?: {
    nome: string;
  };
  assuntos?: Array<{
    nome: string;
  }>;
}

const Jurisprudencia: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<JurisprudenciaResult[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      toast({
        title: "Erro na busca",
        description: "Digite um termo para pesquisar",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setApiError(null);
    
    try {
      console.log("Iniciando busca com termo:", searchTerm);
      
      const apiUrl = "https://api-publica.datajud.cnj.jus.br/api_publica_stj/_search";
      console.log("URL da API:", apiUrl);
      
      const requestBody = {
        query: {
          bool: {
            should: [
              { match: { "assuntos.nome": searchTerm } },
              { match: { "classe.nome": searchTerm } },
              { match: { "numeroProcesso": searchTerm } }
            ]
          }
        },
        size: 10
      };
      
      console.log("Corpo da requisição:", JSON.stringify(requestBody));
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": "APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==",
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log("Status da resposta:", response.status);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Dados recebidos:", data);
      
      const hits = data.hits?.hits || [];
      console.log("Hits encontrados:", hits.length);
      
      const formattedResults = hits.map((hit: any) => ({
        id: hit._id,
        tribunal: hit._source.tribunal || "Não informado",
        numeroProcesso: hit._source.numeroProcesso || "Não informado",
        dataAjuizamento: hit._source.dataAjuizamento ? new Date(hit._source.dataAjuizamento).toLocaleDateString('pt-BR') : "Não informado",
        classe: hit._source.classe || { nome: "Não informado" },
        assuntos: hit._source.assuntos || []
      }));

      setResults(formattedResults);
      
      if (formattedResults.length === 0) {
        toast({
          title: "Nenhum resultado encontrado",
          description: "Tente outros termos de pesquisa",
        });
      } else {
        toast({
          title: "Busca concluída",
          description: `Foram encontrados ${formattedResults.length} resultados`,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar jurisprudência:", error);
      let errorMessage = "Não foi possível comunicar com a API do DataJud";
      
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      
      setApiError(errorMessage);
      
      toast({
        title: "Erro ao buscar dados",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Consulta de Jurisprudência</h1>
            <p className="text-lg text-muted-foreground">
              Pesquise decisões judiciais do Superior Tribunal de Justiça (STJ)
            </p>
          </div>

          {apiError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro de conexão</AlertTitle>
              <AlertDescription>
                {apiError}. Por favor, tente novamente mais tarde ou verifique sua conexão com a internet.
              </AlertDescription>
            </Alert>
          )}

          {/* Formulário de Pesquisa */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Pesquisar Jurisprudência
              </CardTitle>
              <CardDescription>
                Digite termos relacionados ao assunto, classe ou número do processo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="searchTerm">Termo de Pesquisa</Label>
                  <Input
                    id="searchTerm"
                    placeholder="Ex: cannabis, habeas corpus, responsabilidade civil..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Pesquisando..." : "Pesquisar"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Estado de carregamento */}
          {loading && (
            <div className="mt-8 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {/* Resultados */}
          {!loading && results.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Resultados da Pesquisa</h2>
              <div className="bg-muted p-4 mb-4 rounded-lg">
                <p className="text-sm">Encontrados {results.length} resultados para "{searchTerm}"</p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número do Processo</TableHead>
                      <TableHead>Data de Ajuizamento</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Assunto Principal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.numeroProcesso}</TableCell>
                        <TableCell>{result.dataAjuizamento}</TableCell>
                        <TableCell>{result.classe?.nome}</TableCell>
                        <TableCell>
                          {result.assuntos && result.assuntos.length > 0
                            ? result.assuntos[0].nome
                            : "Não informado"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Dicas de Pesquisa */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Dicas de Pesquisa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use termos específicos para obter resultados mais precisos</li>
                <li>Pesquise por números de processo no formato CNJ (sem pontuação)</li>
                <li>Experimente termos jurídicos relacionados ao seu caso</li>
                <li>Para buscar por classes processuais específicas, use termos como "habeas corpus", "recurso especial", etc.</li>
                <li>Se encontrar problemas de conexão, verifique sua internet e tente novamente mais tarde</li>
              </ul>
            </CardContent>
          </Card>

          {/* Link de retorno */}
          <div className="mt-6">
            <Link to="/juridico" className="text-primary hover:underline">
              &larr; Voltar para o Módulo Jurídico
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Jurisprudencia;
