
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MapaProtecaoPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Mapa da Proteção Jurídica para Cultivadores no Brasil</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Panorama Nacional</CardTitle>
            <CardDescription>Situação jurídica do cultivo de Cannabis por estado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Este mapa representa um panorama da proteção jurídica disponível para cultivadores de Cannabis medicinal em diferentes regiões do Brasil, baseado em decisões judiciais e HCs concedidos.
            </p>
            
            {/* Mapa interativo será implementado aqui */}
            <div className="bg-muted h-80 rounded-md flex items-center justify-center mb-4">
              <p className="text-muted-foreground">Mapa interativo em desenvolvimento</p>
            </div>
            
            <h3 className="font-bold mt-6 mb-2">Legenda</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span>Alta proteção: Múltiplos HCs concedidos</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                <span>Média proteção: Alguns HCs concedidos</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                <span>Baixa proteção: HCs raramente concedidos</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-400 mr-2"></div>
                <span>Dados insuficientes</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 space-y-6">
          <h2 className="text-2xl font-bold">Análise por Região</h2>
          
          {/* Regiões */}
          {[
            {
              region: "Sudeste",
              status: "Alta proteção",
              description: "Estados como São Paulo e Rio de Janeiro possuem jurisprudência favorável ao cultivo medicinal, com diversos HCs preventivos concedidos."
            },
            {
              region: "Sul",
              status: "Média proteção",
              description: "Jurisprudência em evolução, com decisões favoráveis principalmente no Rio Grande do Sul."
            },
            {
              region: "Centro-Oeste",
              status: "Média proteção",
              description: "Situação variável, com DF apresentando decisões mais favoráveis que outros estados da região."
            },
            {
              region: "Nordeste",
              status: "Baixa a média proteção",
              description: "Avanços recentes em estados como Pernambuco e Bahia, mas cenário ainda incerto."
            },
            {
              region: "Norte",
              status: "Dados insuficientes",
              description: "Poucos casos documentados, difícil estabelecer um panorama claro da situação."
            }
          ].map((region, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{region.region}</CardTitle>
                <CardDescription>{region.status}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{region.description}</p>
              </CardContent>
            </Card>
          ))}
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Metodologia</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Os dados apresentados neste mapa são baseados em levantamento jurisprudencial realizado pela equipe da GanjaDAO, através de consulta a bases públicas de tribunais e relatos verificados de advogados e pacientes.
              </p>
              <p className="mt-4">
                Este material tem caráter informativo e não substitui a orientação jurídica especializada. A situação jurídica do cultivo medicinal no Brasil é dinâmica e pode variar conforme novas decisões são proferidas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapaProtecaoPage;
