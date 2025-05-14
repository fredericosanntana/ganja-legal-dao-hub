import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Globe, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { searchDataJud, searchSTJWebsite } from "@/services/jurisprudenciaService";
import { Link } from "react-router-dom";

interface JurisprudenciaResult {
  id: string;
  tribunal?: string;
  numeroProcesso?: string;
  ementa: string;
}

// jurisprudências padrão para fallback
const defaultResults: JurisprudenciaResult[] = [
  {
    id: "hc-802866-pr",
    tribunal: "PR",
    numeroProcesso: "HC 802.866/PR",
    ementa: `HABEAS CORPUS. CULTIVO DOMÉSTICO DA PLANTA CANNABIS SATIVA PARA FINS MEDICINAIS. HABEAS CORPUS PREVENTIVO. UNIFORMIZAÇÃO DO ENTENDIMENTO DAS TURMAS CRIMINAIS. RISCO DE CONSTRANGIMENTO ILEGAL. DIREITO À SAÚDE PÚBLICA E À MELHOR QUALIDADE DE VIDA. REGULAMENTAÇÃO. OMISSÃO DA ANVISA E DO MINISTÉRIO DA SAÚDE. ATIPICIDADE PENAL DA CONDUTA. 1. O Juiz de primeiro grau concedeu o habeas corpus preventivo, porque, analisando o conjunto probatório, entendeu que o uso medicinal do óleo extraído da planta encontra-se suficientemente demonstrado pela documentação médica e, especialmente, pelo fato de que o paciente obteve autorização da ANVISA para importar o medicamento derivado da substância, o que indica que sua condição clínica fora avaliada com crivo administrativo, que reconheceu a necessidade de uso do medicamento. 2. O entendimento da Quinta Turma passou a corroborar o da Sexta Turma que, na sessão de julgamento do dia 14/6/2022, de relatoria do Ministro Rogério Schietti Cruz, por unanimidade, negou provimento ao Recurso Especial n. 1.972.092-SP do Ministério Público, e manteve a decisão do Tribunal de origem, que havia concedido habeas corpus preventivo. Então, ambas as turmas passaram a entender que o plantio e a aquisição das sementes da Cannabis sativa, para fins medicinais, não se trata de conduta criminosa, independente da regulamentação da ANVISA. 3. Após o precedente paradigma da Sexta Turma, formou-se a jurisprudência, segundo a qual, "uma vez que o uso pleiteado do óleo da Cannabis sativa, mediante fabrico artesanal, se dará para fins exclusivamente terapêuticos, com base em receituário e laudo subscrito por profissional médico especializado, chancelado pela ANVISA na oportunidade em que autorizou os pacientes a importarem o medicamento feito à base de canabidiol - a revelar que reconheceu a necessidade que têm no seu uso - , não há dúvidas de que deve ser obstada a iminente repressão criminal sobre a conduta praticada pelos pacientes/recorridos" (REsp n. 1.972.092/SP, relator Ministro Rogerio Schietti Cruz, Sexta Turma, julgado em 14/6/2022, DJe de 30/6/2022). 4. Os fatos, ora apresentados pelo impetrante, não podem ser objeto da sanção penal, porque se tratam do exercício de um direito fundamental garantido na Constituição da República, e não há como, em matéria de saúde pública e melhor qualidade de vida, ignorar que "a função judicial acaba exercendo a competência institucional e a capacidade intelectual para fixar tais conceitos abstratos, atribuindo significado aos mesmos, concretizando-os, e até dando um alcance maior ao texto constitucional, bem como julgando os atos das outras funções do Poder Público que interpretam estes mesmos princípios" (DUTRA JÚNIOR, José Felicio. *Constitucionalização de fatos sociais por meio da interpretação do Supremo Tribunal Federal: Análise de alguns julgados proativos da Suprema Corte Brasileira*. Revista Cadernos de Direito, v. 1, n. 1, UDF: Brasília, 2019, pags. 205-206). 5. Habeas corpus concedido, a fim de reestabelecer a decisão de primeiro grau que garantiu ao paciente o salvo-conduto, para obstar que qualquer órgão de persecução penal turbe ou embarace o cultivo de 15 (quinze) mudas de Cannabis sativa para uso exclusivo próprio e enquanto durar o tratamento. Oficie-se à Agência Nacional de Vigilância Sanitária (ANVISA) e ao Ministério da Saúde. (HC n. 802.866/PR, rel. Min. Jesuíno Rissato, 13/9/2023, DJe 3/10/2023.)`,
  },
  {
    id: "embargos-1972092",
    tribunal: "STJ",
    numeroProcesso: "REsp 1.972.092/SP",
    ementa: `EMBARGOS DE DECLARAÇÃO NO AGRAVO REGIMENTAL NO RECURSO EM HABEAS CORPUS. CULTIVO DOMÉSTICO DA PLANTA CANNABIS SATIVA PARA FINS MEDICINAIS. HABEAS CORPUS PREVENTIVO. UNIFORMIZAÇÃO DO ENTENDIMENTO DAS TURMAS CRIMINAIS. RISCO DE CONSTRANGIMENTO ILEGAL. DIREITO A SAÚDE PÚBLICA E A MELHOR QUALIDADE DE VIDA. REGULAMENTAÇÃO. OMISSÃO DA ANVISA E DO MINISTÉRIO DA SAÚDE. ATIPICIDADE PENAL DA CONDUTA. 1. No presente caso, "a autorização de importação n. 036687.0641726/2020, acostada às págs. 41/42, proveniente da ANVISA, autoriza que o paciente importe excepcionalmente o produto HempFlex CBD - Green Care, o que demonstra a veracidade de suas afirmações nesse momento quanto à necessidade do cultivo da plante para uso medicinal, uma vez que o impetrante não possui recursos financeiros para a compra do medicamento". 2. O entendimento da Quinta Turma passou a corroborar o da Sexta Turma que, na sessão de julgamento do dia 14/6/2022, de relatoria do Ministro Rogério Schietti Cruz, por unanimidade, negou provimento ao Recurso Especial n. 1.972.092-SP do Ministério Público, e manteve a decisão do Tribunal de origem, que havia concedido habeas corpus preventivo. Então, ambas as turmas passaram a entender que o plantio e a aquisição das sementes da Cannabis sativa, para fins medicinais, não se trata de conduta criminosa, independente da regulamentação da ANVISA. 3. Após o precedente paradigma da Sexta Turma, formou-se a jurisprudência, segundo a qual, "uma vez que o uso pleiteado do óleo da Cannabis sativa, mediante fabrico artesanal, se dará para fins exclusivamente terapêuticos, com base em receituário e laudo subscrito por profissional médico especializado, chancelado pela ANVISA na oportunidade em que autorizou os pacientes a importarem o medicamento feito à base de canabidiol - a revelar que reconheceu a necessidade que têm no seu uso - , não há dúvidas de que deve ser obstada a iminente repressão criminal sobre a conduta praticada pelos pacientes/recorridos" (REsp n. 1.972.092/SP, relator Ministro Rogerio Schietti Cruz, Sexta Turma, julgado em 14/6/2022, DJe de 30/6/2022). 4. Os fatos, ora apresentados pelo embargante, não podem ser objeto da sanção penal, porque se tratam do exercício de um direito fundamental garantido na Constituição da República, e não há como, em matéria de saúde pública e melhor qualidade de vida, ignorar que "a função judicial acaba exercendo a competência institucional e a capacidade intelectual para fixar tais conceitos abstratos, atribuindo significado aos mesmos, concretizando-os, e até dando um alcance maior ao texto constitucional, bem como julgando os atos das outras funções do Poder Público que interpretam estes mesmos princípios" (DUTRA JÚNIOR, José Felicio. Constitucionalização de fatos sociais por meio da interpretação do Supremo Tribunal Federal: Análise de alguns julgados proativos da Suprema Corte Brasileira. Revista Cadernos de Direito, v. 1, n. 1, UDF: Brasília, 2019, pags. 205-206). 5`,
  },
  {
    id: "agravo-182453-mg",
    tribunal: "MG",
    numeroProcesso: "AgRg no RHC 182.453/MG",
    ementa: `AGRAVO REGIMENTAL NO RECURSO EM HABEAS CORPUS. PLANTIO DE MACONHA PARA USO PRÓPRIO COM FINS MEDICINAIS. AUTORIZAÇÃO PARA IMPORTAÇÃO CONCEDIDA PELA ANVISA CONDICIONADA À PRESCRIÇÃO MÉDICA ATUALIZADA. IRRESIGNAÇÃO DO MINISTÉRIO PÚBLICO DO ESTADO DE MINAS GERAIS. ESPECIFICAÇÃO DA QUANTIDADE AUTORIZADA. AGRAVO REGIMENTAL PARCIALMENTE PROVIDO. 1. O Superior Tribunal de Justiça vem entendendo pela concessão de habeas corpus para que se possa obter salvo-conduto para fins exclusivamente terapêuticos e/ou medicinais, com base em receituário e laudo subscrito por profissional médico habilitado, desde que devidamente autorizado pela Anvisa, pois é possível, "ao menos em tese, que os pacientes (ora recorridos) tenham suas condutas enquadradas no art. 33, 1º, da Lei n. 11.343/2006, punível com pena privativa de liberdade, é indiscutível o cabimento de habeas corpus para os fins por eles almejados: concessão de salvo-conduto para o plantio e o transporte de Cannabis sativa, da qual se pode extrair a substância necessária para a produção artesanal dos medicamentos prescritos para fins de tratamento de saúde" (REsp n. 1.972.092/SP, relator Ministro Rogerio Schietti Cruz, Sexta Turma, julgado em 14/6/2022, DJe de 30/6/2022). 2. No caso, verificando-se situação excepcional, concedo salvo-conduto aos agravados, autorizando o cultivo de 304 plantas de Cannabis sativa, a cada 6 meses, totalizando 608 plantas de Cannabis sativa, por ano, para uso exclusivo e próprio dos agravados, enquanto durar o tratamento, nos termos das prescrições médicas, impedindo-se qualquer medida de natureza penal, devendo manter atualizadas as prescrições médicas e autorizações administrativas necessárias junto à Agência Nacional de Vigilância Sanitária - ANVISA. 3. Agravo regimental parcialmente provido. (AgRg no RHC n. 182.453/MG, relator Ministro Jesuíno Rissato (Desembargador Convocado do Tjdft), Sexta Turma, julgado em 8/4/2024, DJe de 11/4/2024.)`,
  },
  {
    id: "rhc-123402-rs",
    tribunal: "RS",
    numeroProcesso: "RHC 123.402/RS",
    ementa: `RECURSO ORDINÁRIO EM HABEAS CORPUS. PEDIDO DE SALVO-CONDUTO PARA PLANTIO, CULTIVO, USO E POSSE DE CANNABIS SATIVA L. PARA TRATAMENTO INDIVIDUAL. INDICAÇÃO MÉDICA PARA O USO DA SUBSTÂNCIA. AUTORIZAÇÃO PARA IMPORTAÇÃO DO PRODUTO POR PARTE DA AGÊNCIA NACIONAL DE VIGILÂNCIA SANITÁRIA (ANVISA). HIPOSSUFICIÊNCIA FINANCEIRA. IMPORTAÇÃO DE SEMENTES AUTORIZADA PELA CORTE A QUO. AUTORIZAÇÃO PARA O CULTIVO E EXTRAÇÃO DE ÓLEO MEDICINAL. ANÁLISE TÉCNICA A CARGO DA AGÊNCIA DE VIGILÂNCIA SANITÁRIA. RECURSO NÃO PROVIDO. RECOMENDAÇÃO PARA QUE A ANVISA ANALISE A POSSIBILIDADE DE AUTORIZAÇÃO DO CULTIVO E MANEJO PARA FINS MEDICINAIS. 1. A recorrente busca salvo-conduto para viabilizar o plantio de maconha para fins medicinais, após ter obtido, perante o Tribunal Regional Federal da 4ª Região, permissão para importar pequenas quantidades de semente de Cannabis sativa L. 2. Os Tribunais Superiores já possuem jurisprudência firmada no sentido de considerar que a conduta de importar pequenas quantidades de sementes de maconha não se adequa à forma prevista no art. 33 da Lei de Drogas, subsumindo-se, formalmente, ao tipo penal descrito no art. 334-A do Código Penal, mas cuja tipicidade material é afastada pela aplicação do princípio da insignificância. 3. O controle do cultivo e da manipulação da maconha deve ser limitado aos conhecidos efeitos deletérios atribuídos a algumas substâncias contidas na planta, sendo certo que a própria Lei n. 11.343/2006 permite o manejo de vegetais dos quais possam ser extraídas ou produzidas drogas para fins medicinais ou científicos, desde que autorizado pela União. 3. No atual estágio do debate acerca da regulamentação dos produtos baseados na Cannabis e de desenvolvimento das pesquisas a respeito da eficácia dos medicamentos obtidos a partir da planta, não parece razoável desautorizar a produção artesanal do óleo à base de maconha apenas sob o pretexto da falta de regulamentação. De mais a mais, a própria agência de vigilância sanitária federal já permite a importação de medicamentos à base de maconha, produzidos industrial ou artesanalmente no exterior, como, aliás, comprovam os documentos juntados a estes autos. 4. Entretanto, a autorização buscada pela recorrente depende de análise de critérios técnicos que não cabem ao juízo criminal, especialmente em sede de habeas corpus. Essa incumbência está a cargo da própria Agência Nacional de Vigilância Sanitária que, diante das peculiaridades do caso concreto, poderá autorizar ou não o cultivo e colheita de plantas das quais se possam extrair as substâncias necessárias para a produção artesanal dos medicamentos. 5. Recurso ordinário em habeas corpus não provido, recomendando à Agência Nacional de Vigilância Sanitária que analise o caso e decida se é viável autorizar a recorrente a cultivar e ter a posse de plantas de Cannabis sativa L. para fins medicinais, suprindo a exigência contida no art. 33 da Lei n. 11.343/2006. (RHC n. 123.402/RS, relator Ministro Reynaldo Soares da Fonseca, Quinta Turma, julgado em 23/3/2021, DJe de 29/3/2021.)`,
  },
];

const Jurisprudencia: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"datajud" | "stj">("datajud");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [dataJudResults, setDataJudResults] = useState<JurisprudenciaResult[]>([]);
  const [stjResults, setStjResults] = useState<JurisprudenciaResult[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Carrega jurisprudências padrão inicialmente
    setDataJudResults(defaultResults);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getPreview = (text: string) => {
    const sentences = text.split(/\.\s+/);
    const preview: string[] = [];
    for (const s of sentences) {
      if (s === s.trim().toUpperCase()) preview.push(s.trim());
      else break;
    }
    return preview.join('. ') + (preview.length ? '.' : '');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);

    try {
      if (activeTab === "datajud") {
        // mantém padrão visível
        setDataJudResults(defaultResults);
        const res = await searchDataJud(searchTerm);
        if (res.success && res.data.length > 0) {
          setDataJudResults(res.data.map((r: any) => ({
            id: r.id,
            tribunal: r.tribunal,
            numeroProcesso: r.numeroProcesso,
            ementa: r.ementa || ''
          })));
          toast({ title: "Busca concluída", description: `Encontrados ${res.data.length} resultados.` });
        } else {
          toast({ title: "Nenhum resultado", description: "Mantendo jurisprudências padrão.", variant: "warning" });
        }
      } else {
        const res = await searchSTJWebsite(searchTerm);
        if (res.success && res.data.length > 0) {
          setStjResults(res.data.map((r: any) => ({ id: r.id, ementa: r.ementa || '' })));
        } else {
          setStjResults([]);
          toast({ title: "Nenhum resultado STJ", description: "Tente outro termo.", variant: "warning" });
        }
      }
    } catch (err: any) {
      setApiError(err.message);
      toast({ title: "Erro na busca", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Consulta de Jurisprudência</h1>
        <p className="text-muted-foreground mb-6">Pesquise decisões ligadas ao cultivo de cannabis</p>

        {apiError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Erro de conexão</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="datajud" className="flex items-center gap-2">
              <Database className="w-4 h-4" /> API DataJud
            </TabsTrigger>
            <TabsTrigger value="stj" className="flex items-center gap-2">
              <Globe className="w-4 h-4" /> Site STJ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="datajud">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" /> Pesquisar DataJud
                </CardTitle>
                <CardDescription>API oficial do CNJ</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <Label htmlFor="searchTerm">Termo de Pesquisa</Label>
                    <Input
                      id="searchTerm"
                      placeholder="Ex: cultivo, habeas corpus"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
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
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" /> Pesquisar Site STJ
                </CardTitle>
                <CardDescription>Web scraping no site do STJ</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <Label htmlFor="searchTermStj">Termo de Pesquisa</Label>
                    <Input
                      id="searchTermStj"
                      placeholder="Ex: REsp 2.121.548"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
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

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {!loading && activeTab === "datajud" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Jurisprudências</h2>
            {dataJudResults.map(item => {
              const isExpanded = expandedItems.has(item.id);
              const preview = getPreview(item.ementa);
              return (
                <Card key={item.id} className="p-4">
                  <CardHeader>
                    <CardTitle>
                      {item.numeroProcesso} {item.tribunal && `— ${item.tribunal}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm font-semibold">
                      {isExpanded ? item.ementa : preview || item.ementa.substring(0, 100) + '...'}
                    </p>
                    {preview && preview !== item.ementa && (
                      <button
                        className="mt-2 text-primary hover:underline"
                        onClick={() => toggleExpand(item.id)}
                      >
                        {isExpanded ? 'Ver menos' : 'Ver mais'}
                      </button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && activeTab === "stj" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Resultados Site STJ</h2>
            {stjResults.length > 0 ? (
              stjResults.map(item => {
                const isExpanded = expandedItems.has(item.id);
                const preview = getPreview(item.ementa);
                return (
                  <Card key={item.id} className="p-4">
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm">
                        {isExpanded ? item.ementa : preview || item.ementa.substring(0, 100) + '...'}
                      </p>
                      {preview && preview !== item.ementa && (
                        <button
                          className="mt-2 text-primary hover:underline"
                          onClick={() => toggleExpand(item.id)}
                        >
                          {isExpanded ? 'Ver menos' : 'Ver mais'}
                        </button>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum resultado STJ.</p>
            )}
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Dicas de Pesquisa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Use termos específicos para resultados mais precisos.</li>
              <li>Inclua números de processo no formato CNJ (sem pontuação).</li>
              <li>Para classes processuais, use termos como “Habeas Corpus”.</li>
              <li>Se a API não retornar nada, as ementas padrão já estarão visíveis.</li>
            </ul>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Link to="/juridico" className="text-primary hover:underline">
            &larr; Voltar ao Módulo Jurídico
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Jurisprudencia;