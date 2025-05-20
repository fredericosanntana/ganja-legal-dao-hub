import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator } from 'lucide-react';

const Calculadoras = () => {
  const [cultivoType, setCultivoType] = useState('indoor');
  const [area, setArea] = useState<number | ''>('');
  const [watts, setWatts] = useState<number | ''>('');
  const [plantas, setPlantas] = useState<number | ''>('');
  const [resultadoEstimativa, setResultadoEstimativa] = useState<number | null>(null);
  const [resultadoConsumo, setResultadoConsumo] = useState<number | null>(null);
  const [tarifaEnergia, setTarifaEnergia] = useState<number | ''>(0.75);
  const [horasLuzDia, setHorasLuzDia] = useState<number | ''>(18);

  const calcularEstimativa = () => {
    if (!area || !watts) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const densidadeWattsM2 = watts / area;
    let estimativaGramaWatt;

    if (densidadeWattsM2 <= 200) {
      estimativaGramaWatt = 0.3;
    } else if (densidadeWattsM2 <= 400) {
      estimativaGramaWatt = 0.5;
    } else if (densidadeWattsM2 <= 600) {
      estimativaGramaWatt = 0.8;
    } else {
      estimativaGramaWatt = 1.0;
    }

    const estimativaTotal = watts * estimativaGramaWatt;
    setResultadoEstimativa(estimativaTotal);
  };

  const calcularConsumoEnergia = () => {
    if (!watts || !tarifaEnergia || !horasLuzDia) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const consumoDiarioKWh = (watts * Number(horasLuzDia)) / 1000;
    const consumoMensalKWh = consumoDiarioKWh * 30;
    const custoMensal = consumoMensalKWh * Number(tarifaEnergia);

    setResultadoConsumo(custoMensal);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Calculadoras</h1>
          <p className="text-lg text-muted-foreground">
            Ferramentas para cálculos relacionados ao cultivo de Cannabis
          </p>
        </div>

        <Tabs defaultValue="estimativa" className="w-full">
          <TabsList className="justify-center">
            <TabsTrigger value="estimativa">Estimativa de Colheita</TabsTrigger>
            <TabsTrigger value="consumo">Consumo de Energia</TabsTrigger>
          </TabsList>
          <TabsContent value="estimativa" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estimativa de Colheita</CardTitle>
                <CardDescription>
                  Calcule a estimativa de colheita com base na área e iluminação.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cultivoType">Tipo de Cultivo</Label>
                    <Select value={cultivoType} onValueChange={setCultivoType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indoor">Indoor</SelectItem>
                        <SelectItem value="outdoor">Outdoor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="area">Área de Cultivo (m²)</Label>
                    <Input
                      type="number"
                      id="area"
                      placeholder="Ex: 1.5"
                      value={area}
                      onChange={(e) => setArea(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="watts">Watts da Iluminação</Label>
                    <Input
                      type="number"
                      id="watts"
                      placeholder="Ex: 300"
                      value={watts}
                      onChange={(e) => setWatts(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="plantas">Número de Plantas</Label>
                    <Input
                      type="number"
                      id="plantas"
                      placeholder="Ex: 4"
                      value={plantas}
                      onChange={(e) => setPlantas(Number(e.target.value))}
                    />
                  </div>
                </div>
                <Button onClick={calcularEstimativa}>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calcular Estimativa
                </Button>
                {resultadoEstimativa !== null && (
                  <div className="mt-4">
                    <p className="font-bold">
                      Estimativa de Colheita Total: {resultadoEstimativa.toFixed(2)} gramas
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consumo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Consumo de Energia</CardTitle>
                <CardDescription>
                  Calcule o consumo de energia do seu cultivo.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wattsEnergia">Watts da Iluminação</Label>
                    <Input
                      type="number"
                      id="wattsEnergia"
                      placeholder="Ex: 300"
                      value={watts}
                      onChange={(e) => setWatts(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tarifa">Tarifa de Energia (R$ por kWh)</Label>
                    <Input
                      type="number"
                      id="tarifa"
                      placeholder="Ex: 0.75"
                      step="0.01"
                      value={tarifaEnergia}
                      onChange={(e) => setTarifaEnergia(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="horasLuz">Horas de Luz por Dia</Label>
                    <Input
                      type="number"
                      id="horasLuz"
                      placeholder="Ex: 18"
                      value={horasLuzDia}
                      onChange={(e) => setHorasLuzDia(Number(e.target.value))}
                    />
                  </div>
                </div>
                <Button onClick={calcularConsumoEnergia}>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calcular Consumo
                </Button>
                {resultadoConsumo !== null && (
                  <div className="mt-4">
                    <p className="font-bold">
                      Custo Mensal de Energia: R$ {resultadoConsumo.toFixed(2)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Calculadoras;
