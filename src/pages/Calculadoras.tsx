import { useState } from "react";
import Layout from "@/components/Layout";
import VPDCalculator from "@/components/Calculadoras/VPD/VPDCalculator";
import DewPointCalculator from "@/components/Calculadoras/DewPoint/DewPointCalculator";
import DLICalculator from "@/components/Calculadoras/DLI/DLICalculator";
import ECFlushCalculator from "@/components/Calculadoras/ECFlush/ECFlushCalculator";
import DeficiencyCalculator from "@/components/Calculadoras/Deficiency/DeficiencyCalculator";
import NutrientsCalculator from "@/components/Calculadoras/Nutrients/NutrientsCalculator";
import { Button } from "@/components/ui/button"; // ajuste conforme seu projeto
import { Droplet, Sun, Thermometer, FlaskConical, AlertTriangle, Sprout } from "lucide-react"; // ícones exemplo

const Calculadoras = () => {
  const [activeCalculator, setActiveCalculator] = useState<string>("vpd");

  const calculators = [
    { id: "vpd", name: "VPD", icon: <Thermometer /> },
    { id: "dli", name: "DLI", icon: <Sun /> },
    { id: "dew-point", name: "Ponto de Orvalho", icon: <Droplet /> },
    { id: "ec-flush", name: "EC/Flush", icon: <FlaskConical /> },
    { id: "deficiency", name: "Deficiências", icon: <AlertTriangle /> },
    { id: "nutrients", name: "Nutrientes", icon: <Sprout /> },
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-8">
        <h1 className="text-3xl font-bold mb-6">Calculadoras para Cultivo</h1>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-8">
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

        {activeCalculator === "vpd" && <VPDCalculator />}
        {activeCalculator === "dli" && <DLICalculator />}
        {activeCalculator === "dew-point" && <DewPointCalculator />}
        {activeCalculator === "ec-flush" && <ECFlushCalculator />}
        {activeCalculator === "deficiency" && <DeficiencyCalculator />}
        {activeCalculator === "nutrients" && <NutrientsCalculator />}
      </div>
    </Layout>
  );
};

export default Calculadoras;
