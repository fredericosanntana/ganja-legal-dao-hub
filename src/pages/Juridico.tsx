
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Search, Download } from "lucide-react";

const Juridico = () => {
  const [activeTab, setActiveTab] = useState("habeas-corpus");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Módulo Jurídico</h1>
            <p className="text-lg text-muted-foreground">
              Ferramentas e recursos jurídicos para proteção de cultivadores
            </p>
          </div>

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

          {activeTab === "habeas-corpus" && (
            <div>
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
                  <Button className="w-full" size="lg">
                    <Shield className="mr-2 h-5 w-5" />
                    Iniciar Geração de HC
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "jurisprudencia" && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    Consulta de Jurisprudência
                  </CardTitle>
                  <CardDescription>
                    Pesquise decisões judiciais sobre cultivo de Cannabis no Brasil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Esta ferramenta permite que você consulte decisões judiciais relevantes sobre o tema
                    do autocultivo de Cannabis no Brasil, ajudando a entender como os tribunais têm se
                    posicionado sobre o assunto.
                  </p>
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <p className="text-sm">
                      Estamos trabalhando para disponibilizar esta funcionalidade em breve.
                      A consulta permitirá filtros por tribunal, data e palavras-chave.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" disabled>
                    <Search className="mr-2 h-5 w-5" />
                    Consultar Jurisprudência (Em breve)
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {activeTab === "templates" && (
            <div>
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
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Notificação Extrajudicial</h3>
                        <p className="text-sm text-muted-foreground">
                          Modelo para notificações formais a terceiros
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Declaração de Posse</h3>
                        <p className="text-sm text-muted-foreground">
                          Modelo de declaração para consumo pessoal
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Checklist Jurídico</h3>
                        <p className="text-sm text-muted-foreground">
                          Lista de verificação para proteção jurídica do cultivador
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Juridico;
