
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Thermometer, Droplets, Sun, Cloud, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const VPDCalculator = () => {
  const [temperature, setTemperature] = useState<string>("25");
  const [humidity, setHumidity] = useState<string>("60");
  const [vpdResult, setVpdResult] = useState<number | null>(null);

  const calculateVPD = () => {
    // Convert inputs to numbers
    const temp = parseFloat(temperature);
    const rh = parseFloat(humidity);

    // Validate inputs
    if (isNaN(temp) || isNaN(rh) || rh < 0 || rh > 100) {
      return;
    }

    // Calculate Saturated Vapor Pressure (SVP) using the simplified formula
    // SVP = 610.7 * 10^(7.5 * T / (237.3 + T))
    const svp = 610.7 * Math.pow(10, (7.5 * temp) / (237.3 + temp));
    
    // Calculate Vapor Pressure Deficit (VPD) in kPa
    // VPD = SVP * (1 - RH/100)
    const vpd = (svp * (1 - rh / 100)) / 1000; // Convert from Pa to kPa
    
    setVpdResult(vpd);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-primary" />
          Calculadora VPD
        </CardTitle>
        <CardDescription>
          Calcule o Déficit de Pressão de Vapor para otimizar condições de cultivo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          O VPD (Vapor Pressure Deficit) é uma medida que relaciona a temperatura e a umidade para determinar 
          o quão eficiente será a transpiração da planta. Um VPD adequado contribui para um crescimento 
          saudável e uma melhor absorção de nutrientes.
        </p>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperatura (°C)</Label>
            <Input
              id="temperature"
              type="number"
              placeholder="Ex: 25"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="humidity">Umidade Relativa (%)</Label>
            <Input
              id="humidity"
              type="number"
              placeholder="Ex: 60"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
            />
          </div>
        </div>

        {vpdResult !== null && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              Resultado
            </h3>
            <p className="text-lg">
              VPD: <strong>{vpdResult.toFixed(2)} kPa</strong>
            </p>
            <div className="mt-2 text-sm">
              <InterpretVPD vpd={vpdResult} />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={calculateVPD}>
          Calcular VPD
        </Button>
      </CardFooter>
    </Card>
  );
};

const InterpretVPD = ({ vpd }: { vpd: number }) => {
  if (vpd < 0.4) {
    return (
      <div className="text-amber-600">
        VPD muito baixo. Risco de doenças fúngicas e baixa transpiração. Aumente a temperatura ou reduza a umidade.
      </div>
    );
  } else if (vpd >= 0.4 && vpd < 0.8) {
    return (
      <div className="text-ganja-500">
        VPD bom para fase vegetativa. Condições adequadas para crescimento vegetativo saudável.
      </div>
    );
  } else if (vpd >= 0.8 && vpd < 1.2) {
    return (
      <div className="text-ganja-500">
        VPD bom para fase de floração. Condições ideais para produção de flores.
      </div>
    );
  } else {
    return (
      <div className="text-red-500">
        VPD muito alto. Risco de estresse hídrico e fechamento de estômatos. Reduza a temperatura ou aumente a umidade.
      </div>
    );
  }
};

const Calculadoras = () => {
  const [activeCalculator, setActiveCalculator] = useState<string>("vpd");

  const calculators = [
    { id: "vpd", name: "VPD", icon: <Thermometer className="h-4 w-4" /> },
    { id: "dli", name: "DLI", icon: <Sun className="h-4 w-4" /> },
    { id: "nutrients", name: "Nutrientes", icon: <Activity className="h-4 w-4" /> },
    { id: "dew-point", name: "Ponto de Orvalho", icon: <Droplets className="h-4 w-4" /> },
    { id: "ec-flush", name: "EC Flush", icon: <Cloud className="h-4 w-4" /> },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Calculadoras para Cultivo</h1>
            <p className="text-lg text-muted-foreground">
              Ferramentas matemáticas para otimizar seu cultivo
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-8">
            {calculators.map((calc) => (
              <Button
                key={calc.id}
                variant={activeCalculator === calc.id ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => setActiveCalculator(calc.id)}
              >
                {calc.icon}
                <span>{calc.name}</span>
              </Button>
            ))}
          </div>

          {activeCalculator === "vpd" ? (
            <VPDCalculator />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Calculadora em Desenvolvimento
                </CardTitle>
                <CardDescription>
                  Esta calculadora estará disponível em breve
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Estamos trabalhando para disponibilizar mais calculadoras úteis para o seu cultivo.
                  Volte em breve para acessar esta funcionalidade.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Calculadoras;
