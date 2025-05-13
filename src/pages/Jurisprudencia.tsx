
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { FileText, Search, AlertCircle, Globe, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchDataJud, searchSTJWebsite } from "@/services/jurisprudenciaService";

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
  fonte: string;
}

interface STJWebsiteResult {
  id: string;
  titulo: string;
  link: string;
  descricao: string;
  detalhes: string;
  fonte: string;
}

const Jurisprudencia: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataJudResults, setDataJudResults] = useState<JurisprudenciaResult[]>([]);
  const [stjWebsiteResults, setStjWebsiteResults] = useState<STJWebsiteResult[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("datajud");

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
      console.log("Fonte selecionada:", activeTab);
      
      if (activeTab === "datajud") {
        const result = await searchDataJud(searchTerm);
        
        if (result.success) {
          setDataJudResults(result.data as JurisprudenciaResult[]);
          
          if (result.data.length === 0) {
            toast({
              title: "Nenhum resultado encontrado",
              description: "Tente outros termos de pesquisa ou utilize a busca no site do STJ",
            });
          } else {
            toast({
              title: "Busca concluída",
              description: `Foram encontrados ${result.data.length} resultados no DataJud`,
            });
          }
        } else {
          throw new Error(result.error);
        }
      } else if (activeTab === "stj") {
        const result = await searchSTJWebsite(searchTerm);
        
        if (result.success) {
          setStjWebsiteResults(result.data as STJWebsiteResult[]);
          
          if (result.data.length === 0) {
            toast({
              title: "Nenhum resultado encontrado",
              description: "Tente outros termos de pesquisa",
            });
          } else {
            toast({
              title: "Busca concluída",
              description: `Foram encontrados ${result.data.length} resultados no site do STJ`,
            });
          }
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar jurisprudência:", error);
      let errorMessage = "Não foi possível comunicar com o servidor";
      
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

          {/* Abas para escolher a fonte de dados */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="datajud" className="flex items-center gap-2">
                <Database className="h-4 w-4" /> API DataJud
              </TabsTrigger>
              <TabsTrigger value="stj" className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> Site do STJ
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="datajud">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Pesquisar via API DataJud
                  </CardTitle>
                  <CardDescription>
                    Busca oficial através da API DataJud do CNJ
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
            </TabsContent>
            
            <TabsContent value="stj">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Pesquisar via Site do STJ
                  </CardTitle>
                  <CardDescription>
                    Busca através de web scraping do site oficial do STJ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="searchTerm">Termo de Pesquisa</Label>
                      <Input
                        id="searchTerm"
                        placeholder="Ex: responsabilidade civil, dano moral..."
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
            </TabsContent>
          </Tabs>

          {/* Estado de carregamento */}
          {loading && (
            <div className="mt-8 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {/* Resultados da API DataJud */}
          {!loading && activeTab === "datajud" && dataJudResults.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Resultados da API DataJud</h2>
              <div className="bg-muted p-4 mb-4 rounded-lg">
                <p className="text-sm">Encontrados {dataJudResults.length} resultados para "{searchTerm}"</p>
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
                    {dataJudResults.map((result) => (
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

          {/* Resultados do site do STJ */}
          {!loading && activeTab === "stj" && stjWebsiteResults.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Resultados do Site do STJ</h2>
              <div className="bg-muted p-4 mb-4 rounded-lg">
                <p className="text-sm">Encontrados {stjWebsiteResults.length} resultados para "{searchTerm}"</p>
              </div>
              <div className="space-y-6">
                {stjWebsiteResults.map((result) => (
                  <Card key={result.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        <a 
                          href={result.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {result.titulo}
                        </a>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm">{result.descricao}</p>
                      <p className="text-xs text-muted-foreground">{result.detalhes}</p>
                      <div className="pt-2">
                        <a 
                          href={result.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" /> Ver documento completo
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                <li>Utilize a busca no site do STJ quando a API DataJud não retornar resultados</li>
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
