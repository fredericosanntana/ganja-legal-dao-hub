
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Search, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { disableGlobalCursorStyles } from "react-resizable-panels";

const Juridico: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("habeas-corpus");
  const navigate = useNavigate();
  
  const templates = [
    {
      title: 'Termo de Responsabilidade',
      desc: 'Modelo de termo de responsabilidade para cultivo',
      action: () => {
        // Substitua pelo caminho do seu arquivo PDF
        window.open('/downloads/termo-responsabilidade.pdf', '_blank');
      },
      label: 'Download',
      disabled: true,
    },
    {
      title: 'Plano de Cultivo',
      desc: 'Modelo de plano de cultivo',
      action: () => {
        navigate('/plano-cultivo');
      },
      label: 'Acessar',
      disabled: false
    },
    {
      title: 'Checklist Jurídico',
      desc: 'Lista de verificação para proteção jurídica do cultivador',
      action: () => {
        // Substitua pelo caminho do seu arquivo PDF
        window.open('/downloads/checklist-juridico.pdf', '_blank');
      },
      label: 'Download',
      disabled: true
    },  
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Módulo Jurídico</h1>
            <p className="text-lg text-muted-foreground">
              Ferramentas e recursos jurídicos para proteção de cultivadores
            </p>
          </div>

          {/* Abas */}
          <div className="flex overflow-x-auto mb-8 border-b">
            <button
              className={`px-4 py-2 font-medium whitespace-nowrap ${
                activeTab === "habeas-corpus"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("habeas-corpus")}
            >
              Habeas Corpus Preventivo
            </button>
            <button
              className={`px-4 py-2 font-medium whitespace-nowrap ${
                activeTab === "jurisprudencia"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("jurisprudencia")}
            >
              Jurisprudência
            </button>
            <button
              className={`px-4 py-2 font-medium whitespace-nowrap ${
                activeTab === "templates"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("templates")}
            >
              Templates de Documentos
            </button>
          </div>

          {/* Conteúdo das Abas */}
          {activeTab === "habeas-corpus" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Habeas Corpus Preventivo
                </CardTitle>
                <CardDescription>
                  Gere seu HC preventivo para ter proteção jurídica em casos de abordagem policial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  O Habeas Corpus preventivo é um instrumento jurídico que pode ser utilizado para
                  garantir seu direito de ir e vir quando existe ameaça de violência ou coação
                  ilegal à sua liberdade de locomoção.
                </p>
                <p className="mb-4">
                  Para cultivadores de Cannabis medicinal, este documento pode ser um importante meio
                  de defesa em casos de abordagem policial.
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Como funciona:</h3>
                  <ol className="list-decimal pl-4 space-y-2">
                    <li>Preencha o formulário com seus dados pessoais</li>
                    <li>Informe detalhes relevantes sobre seu caso</li>
                    <li>Gere o documento em PDF</li>
                    <li>Faça o download do HC preventivo</li>
                    <li>Mantenha uma cópia física e digital do documento</li>
                  </ol>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/habeas-corpus" className="w-full">
                  <Button className="w-full" size="lg">
                    <Shield className="mr-2 h-5 w-5" />
                    Iniciar Geração de HC
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}

          {activeTab === "jurisprudencia" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Consulta de Jurisprudência
                </CardTitle>
                <CardDescription>
                  Pesquise decisões judiciais do Superior Tribunal de Justiça
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Esta ferramenta permite que você consulte decisões judiciais relevantes sobre o tema
                  do autocultivo de Cannabis no Brasil, ajudando a entender como os tribunais têm se
                  posicionado sobre o assunto.
                </p>
                <p className="mb-4">
                  A ferramenta utiliza a API oficial do DataJud para acessar dados reais do Superior Tribunal de Justiça (STJ),
                  fornecendo informações atualizadas sobre processos e decisões.
                </p>
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <h3 className="font-semibold mb-2">Funcionalidades:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Busca por termos e palavras-chave</li>
                    <li>Filtro por assuntos e classes processuais</li>
                    <li>Visualização de dados reais do STJ</li>
                    <li>Interface intuitiva para leitura das decisões</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/jurisprudencia" className="w-full">
                  <Button className="w-full">
                    <Search className="mr-2 h-5 w-5" />
                    Acessar Consulta de Jurisprudência
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )}

          {activeTab === "templates" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Templates de Documentos
                </CardTitle>
                <CardDescription>
                  Acesse templates de documentos jurídicos úteis para cultivadores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Aqui você encontra modelos de documentos jurídicos que podem ser úteis para
                  cultivadores de Cannabis, como notificações extrajudiciais e declarações de
                  posse para consumo pessoal.
                </p>
                <div className="space-y-4">
                  {templates.map((tpl) => (
                    <div
                      key={tpl.title}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{tpl.title}</h3>
                        <p className="text-sm text-muted-foreground">{tpl.desc}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={tpl.action}
                      >
                        {tpl.label}
                        {tpl.label === 'Download' && !tpl.disabled && (
                          <Download className="h-4 w-4 ml-1" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fluxo de Trabalho Recomendado */}
          <section className="workflow-section mt-8">
            <h2 className="text-2xl font-bold mb-2">Fluxo de Trabalho Recomendado</h2>
            <p className="mb-4">
              Siga estas etapas para maximizar sua proteção jurídica no autocultivo de cannabis.
            </p>
            <div className="workflow-steps grid md:flex md:justify-between gap-4">
              {[
                { step: 1, title: 'Consultar Jurisprudência', desc: 'Verifique decisões judiciais em seu estado para entender o cenário legal.' },
                { step: 2, title: 'Preparar Documentos', desc: 'Gere os documentos necessários para comprovar o uso pessoal e responsável.' },
                { step: 3, title: 'Gerar Habeas Corpus', desc: 'Crie seu Habeas Corpus Preventivo com base nos fundamentos jurídicos adequados.' },
                { step: 4, title: 'Protocolar', desc: 'Submeta o Habeas Corpus ao tribunal competente e mantenha cópias dos documentos.' }
              ].map(item => (
                <div key={item.step} className="workflow-step text-center">
                  <div className="step-number mx-auto mb-2 text-7xl text-primary">{item.step}</div>
                  <div className="step-title font-semibold mb-1">{item.title}</div>
                  <div className="step-desc text-sm text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Juridico;
