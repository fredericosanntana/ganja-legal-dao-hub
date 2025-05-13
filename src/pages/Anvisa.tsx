
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FileEdit, Mail, Save } from "lucide-react";

const Anvisa = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Módulo ANVISA</h1>
            <p className="text-lg text-muted-foreground">
              Ferramentas para criação e envio de manifestações para consultas públicas
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Ferramenta de Manifestação
              </CardTitle>
              <CardDescription>
                Crie manifestações para consultas públicas da ANVISA relacionadas à Cannabis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Esta ferramenta permite que você crie manifestações formais para consultas públicas da ANVISA
                relacionadas à regulamentação da Cannabis. Sua participação é fundamental para influenciar
                políticas públicas sobre o tema.
              </p>

              <div className="bg-muted p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">Como funciona:</h3>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>Preencha o formulário com seus dados pessoais</li>
                  <li>Construa sua manifestação com base nos pontos relevantes da consulta pública</li>
                  <li>Revise a prévia do documento gerado</li>
                  <li>Escolha uma das opções: fazer download em PDF, enviar por e-mail para a ANVISA, ou salvar sua manifestação</li>
                </ol>
              </div>

              <div className="bg-ganja-100 border border-ganja-400/30 p-4 rounded-lg">
                <h3 className="font-medium text-ganja-600 mb-2 flex items-center">
                  <FileEdit className="mr-2 h-5 w-5" />
                  Consulta Pública Atual
                </h3>
                <p className="text-sm mb-2">
                  <strong>CP XX/20XX:</strong> Proposta de RDC que dispõe sobre os requisitos técnicos para a regularização de produtos de Cannabis.
                </p>
                <p className="text-sm">
                  <strong>Prazo:</strong> Até XX/XX/20XX
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button className="w-full sm:flex-1">
                <FileEdit className="mr-2 h-5 w-5" />
                Criar Nova Manifestação
              </Button>
              <Button variant="outline" className="w-full sm:flex-1">
                <Save className="mr-2 h-5 w-5" />
                Minhas Manifestações
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Receba Alertas de Consultas Públicas
                </CardTitle>
                <CardDescription>
                  Seja notificado quando novas consultas públicas relacionadas à Cannabis forem abertas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Mantenha-se atualizado sobre novas consultas públicas da ANVISA relacionadas à Cannabis.
                  Cadastre seu e-mail para receber alertas e não perder os prazos para enviar sua manifestação.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  <Mail className="mr-2 h-5 w-5" />
                  Cadastrar para Alertas
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Anvisa;
