
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Scale, Pipette, Leaf, BarChart } from 'lucide-react';

const Calculadoras = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Calculadoras</h1>
        <p className="text-lg text-muted-foreground">
          Ferramentas para auxiliar os cultivadores em seus cálculos
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Calculadora de Dosagem
            </CardTitle>
            <CardDescription>
              Calcule a dosagem ideal com base no seu peso e condição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Nossa calculadora de dosagem ajuda a estimar a quantidade ideal de CBD e THC com base no seu peso, 
              condição médica e experiência prévia com Cannabis medicinal. Sempre consulte um médico para orientações específicas.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              <Calculator className="mr-2 h-5 w-5" />
              Calcular Dosagem
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pipette className="h-5 w-5 text-primary" />
              Calculadora de Diluição
            </CardTitle>
            <CardDescription>
              Calcule a diluição correta para óleos e tinturas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Determine a concentração final de canabinoides em óleos, tinturas e outros extratos. 
              Especifique a quantidade de material vegetal, solvente e os percentuais de canabinoides 
              na planta.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              <Calculator className="mr-2 h-5 w-5" />
              Calcular Diluição
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Estimativa de Colheita
            </CardTitle>
            <CardDescription>
              Estime a quantidade de material vegetal na colheita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Calcule a estimativa de rendimento da sua colheita com base no número de plantas, 
              espaço de cultivo, luminosidade e técnicas utilizadas. Importante para planejar 
              o ciclo de cultivo e estimar a produção.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              <Calculator className="mr-2 h-5 w-5" />
              Estimar Colheita
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Calculadora de Economia
            </CardTitle>
            <CardDescription>
              Compare custos entre cultivar e comprar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Compare o custo-benefício entre cultivar e comprar produtos baseados em Cannabis. 
              Considere despesas com equipamentos, insumos, energia elétrica versus o preço de 
              medicamentos prontos ao longo do tempo.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              <Calculator className="mr-2 h-5 w-5" />
              Calcular Economia
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Todas as calculadoras são fornecidas apenas para fins educacionais e de referência. 
          Consulte sempre um profissional de saúde para orientações específicas.
        </p>
      </div>
    </div>
  );
};

export default Calculadoras;
