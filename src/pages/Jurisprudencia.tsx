import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Globe, FileText, Filter, X, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// REMOVIDO: checkDataJudApiStatus da importação
import { searchDataJud, searchSTJWebsite } from "@/services/jurisprudenciaService";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface JurisprudenciaResult {
  id: string;
  tribunal?: string;
  numeroProcesso?: string;
  ementa: string;
  dataAjuizamento?: string;
  classe?: string;
  orgaoJulgador?: string;
}

// jurisprudências padrão para fallback (mantido)
const defaultResults: JurisprudenciaResult[] = [
  // ... (conteúdo dos resultados padrão omitido para brevidade)
  {
    id: "hc-802866-pr",
    tribunal: "PR",
    numeroProcesso: "HC 802.866/PR",
    ementa: `HABEAS CORPUS. CULTIVO DOMÉSTICO...`,
  },
  {
    id: "embargos-1972092-STJ",
    tribunal: "STJ",
    numeroProcesso: "REsp 1.972.092/SP",
    ementa: `EMBARGOS DE DECLARAÇÃO...`,
  },
  {
    id: "agravo-182453-MG",
    tribunal: "MG",
    numeroProcesso: "AgRg no RHC 182.453/MG",
    ementa: `AGRAVO REGIMENTAL NO RECURSO EM HABEAS CORPUS...`,
  },
  {
    id: "rhc-123402-RS",
    tribunal: "RS",
    numeroProcesso: "RHC 123.402/RS",
    ementa: `RECURSO ORDINÁRIO EM HABEAS CORPUS...`,
  },
  {
    id: "RE 635659-STF",
    tribunal: "STF",
    numeroProcesso: "RE 635659",
    ementa: `RECURSO EXTRAORDINÁRIO COM REPERCUSSÃO GERAL...`,
  },
];

const Jurisprudencia: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<JurisprudenciaResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("datajud"); // 'datajud' ou 'stj_website'
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<any>({}); // Estado para filtros avançados
  const { toast } = useToast();
  // const [apiStatus, setApiStatus] = useState<{ online: boolean, details?: any } | null>(null); // Estado para status da API (removido ou desativado)

  // Função para lidar com a busca
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim() && Object.keys(filters).length === 0) {
      toast({
        title: "Entrada Inválida",
        description: "Por favor, insira um termo de busca ou use os filtros.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]); // Limpa resultados anteriores

    // REMOVIDO: Bloco de verificação de status da API
    /*
    try {
      console.log("Checking API Status before search...");
      const status = await checkDataJudApiStatus();
      console.log("API Status Check inside handleSearch (Jurisprudencia.tsx):", status);
      setApiStatus(status);
      if (!status.online) {
        toast({
          title: "API DataJud Indisponível",
          description: `A API do DataJud parece estar offline. (${status.details?.message || 'Erro desconhecido'})`,
          variant: "destructive",
        });
        // Poderia decidir parar aqui ou tentar outra fonte
      }
    } catch (statusError) {
      console.error("Error checking API status:", statusError);
      setApiStatus({ online: false, details: { message: "Falha ao verificar status" } });
      toast({
        title: "Erro ao Verificar API",
        description: "Não foi possível verificar o status da API DataJud.",
        variant: "destructive",
      });
    }
    */

    try {
      let response;
      if (activeTab === "datajud") {
        console.log("Iniciando busca no DataJud (via proxy)...");
        // Certifique-se que searchDataJud está usando o proxy configurado em jurisprudenciaService.ts
        response = await searchDataJud(searchTerm, filters);
        console.log("Resposta da busca DataJud (via proxy):", response);
      } else {
        console.log("Iniciando busca no site do STJ...");
        // A busca no site do STJ pode precisar de um proxy também se for feita do frontend
        // Verifique a implementação de searchSTJWebsite
        response = await searchSTJWebsite(searchTerm);
        console.log("Resposta da busca STJ Website:", response);
      }

      if (response.success) {
        setResults(response.data || []);
        if (response.data.length === 0) {
          toast({
            title: "Nenhum Resultado",
            description: "Sua busca não retornou resultados.",
          });
        }
      } else {
        setError(response.error?.message || "Ocorreu um erro desconhecido");
        toast({
          title: "Erro na Busca",
          description: response.error?.message || "Não foi possível completar a busca.",
          variant: "destructive",
        });
        // Considerar usar os resultados padrão como fallback em caso de erro
        // setResults(defaultResults);
      }
    } catch (err: any) {
      console.error("Erro fatal na busca:", err);
      const errorMessage = err.message || "Erro inesperado ao buscar jurisprudência.";
      setError(errorMessage);
      toast({
        title: "Erro Crítico",
        description: errorMessage,
        variant: "destructive",
      });
      // Considerar usar os resultados padrão como fallback em caso de erro crítico
      // setResults(defaultResults);
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para carregar resultados padrão ou fazer busca inicial (opcional)
  useEffect(() => {
    // setResults(defaultResults); // Carrega exemplos iniciais
    // Ou pode fazer uma busca inicial se desejar
    // handleSearch();
  }, []);

  // Função para limpar filtros
  const clearFilters = () => {
    setFilters({});
    // Opcional: refazer a busca sem filtros se houver termo
    // if (searchTerm.trim()) handleSearch();
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Pesquisa de Jurisprudência sobre Cannabis Medicinal</h1>

        {/* REMOVIDO: Alerta de Status da API */}
        {/* {apiStatus && (
          <Alert variant={apiStatus.online ? "default" : "destructive"} className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{apiStatus.online ? "API DataJud Online" : "API DataJud Offline"}</AlertTitle>
            <AlertDescription>
              {apiStatus.details?.message || (apiStatus.online ? "Pronto para busca." : "Tentando usar fontes alternativas.")}
            </AlertDescription>
          </Alert>
        )} */}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Buscar Decisões</CardTitle>
            <CardDescription>Use termos de busca ou filtros avançados.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="text"
                  placeholder="Ex: habeas corpus cultivo, 1234567-89.2023.8.26.0000, STJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Buscando..." : "Buscar"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="mr-2 h-4 w-4" /> Filtros
                </Button>
              </div>
            </form>

            {showFilters && (
              <div className="mt-4 p-4 border rounded-md bg-muted/40">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Filtros Avançados</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters} disabled={Object.keys(filters).length === 0}>
                    <X className="mr-1 h-4 w-4" /> Limpar Filtros
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Adicionar campos de filtro aqui (Select, Input de Data, etc.) */}
                  {/* Exemplo:
                  <div>
                    <Label htmlFor="tribunal">Tribunal</Label>
                    <Select onValueChange={(value) => setFilters({...filters, tribunal: value})} value={filters.tribunal || ''}>
                      <SelectTrigger id="tribunal">
                        <SelectValue placeholder="Selecione o Tribunal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STJ">STJ</SelectItem>
                        <SelectItem value="STF">STF</SelectItem>
                         Adicionar outros tribunais 
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dataInicio">Data Início</Label>
                    <Input id="dataInicio" type="date" onChange={(e) => setFilters({...filters, dataInicio: e.target.value})} value={filters.dataInicio || ''} />
                  </div>
                  <div>
                    <Label htmlFor="dataFim">Data Fim</Label>
                    <Input id="dataFim" type="date" onChange={(e) => setFilters({...filters, dataFim: e.target.value})} value={filters.dataFim || ''} />
                  </div>
                   */} 
                  <p className="text-sm text-muted-foreground col-span-full">Filtros avançados ainda em desenvolvimento.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="datajud"><Database className="mr-2 h-4 w-4" />DataJud (Oficial)</TabsTrigger>
            <TabsTrigger value="stj_website" disabled><Globe className="mr-2 h-4 w-4" />Site STJ (Alternativo - Em breve)</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {error && !isLoading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro na Busca</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && results.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <FileText className="mx-auto h-12 w-12 mb-4" />
            <p>Nenhum resultado encontrado ou busca não realizada.</p>
            <p className="text-sm">Tente usar termos diferentes ou verifique os filtros.</p>
          </div>
        )}

        {!isLoading && !error && results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Resultados ({results.length})</h2>
            {results.map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {result.numeroProcesso || "Processo não informado"}
                    {result.tribunal && <Badge variant="secondary" className="ml-2">{result.tribunal}</Badge>}
                  </CardTitle>
                  <CardDescription>
                    {result.classe && <span>Classe: {result.classe} | </span>}
                    {result.orgaoJulgador && <span>Órgão Julgador: {result.orgaoJulgador} | </span>}
                    {result.dataAjuizamento && <span>Data: {new Date(result.dataAjuizamento).toLocaleDateString()}</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Ver Ementa</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm whitespace-pre-wrap">{result.ementa}</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                {/* <CardFooter>
                  <Button variant="link" size="sm" asChild>
                    <Link to={`/jurisprudencia/${result.id}`}>Ver Detalhes</Link>
                  </Button>
                </CardFooter> */}
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Jurisprudencia;

