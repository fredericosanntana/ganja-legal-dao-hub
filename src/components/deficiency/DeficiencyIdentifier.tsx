
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckIcon, AlertCircleIcon, InfoIcon } from "lucide-react";
import { symptoms, deficienciesDatabase } from "@/data/deficiencyData";

interface Deficiency {
  name: string;
  description: string;
  solutions: string[];
  matchCount: number;
  severity?: 'low' | 'medium' | 'high';
}

export const DeficiencyIdentifier = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [results, setResults] = useState<Deficiency[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    } else {
      setSelectedSymptoms(selectedSymptoms.filter(id => id !== symptomId));
    }
  };

  const identifyDeficiencies = () => {
    if (selectedSymptoms.length === 0) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Mapear sintomas selecionados para possíveis deficiências
    const deficiencyCounts: Record<string, number> = {};
    
    selectedSymptoms.forEach(symptomId => {
      const symptom = symptoms.find(s => s.id === symptomId);
      if (symptom) {
        symptom.deficiencies.forEach(deficiency => {
          deficiencyCounts[deficiency] = (deficiencyCounts[deficiency] || 0) + 1;
        });
      }
    });

    // Transformar contagens em resultados ordenados
    const sortedResults = Object.entries(deficiencyCounts)
      .map(([name, matchCount]) => ({
        name,
        matchCount,
        description: deficienciesDatabase[name]?.description || "Informação não disponível",
        solutions: deficienciesDatabase[name]?.solutions || ["Consulte um especialista"],
        severity: deficienciesDatabase[name]?.severity
      }))
      .sort((a, b) => b.matchCount - a.matchCount);

    setResults(sortedResults);
    setShowResults(true);
  };

  const getSeverityColor = (severity?: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-orange-500 bg-orange-50';
      case 'low':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-violet-500 bg-violet-50';
    }
  };

  const getSeverityText = (severity?: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return '';
    }
  };

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
          <InfoIcon className="h-5 w-5 mr-2 text-violet-600" />
          Identificador de Deficiências
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium leading-none text-gray-700 mb-2 block">
              Selecione os Sintomas Observados
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {symptoms.map((symptom) => (
                <div key={symptom.id} className="flex items-center space-x-3 rounded-md border p-3 hover:bg-slate-50 transition-colors">
                  <Checkbox 
                    id={symptom.id} 
                    checked={selectedSymptoms.includes(symptom.id)}
                    onCheckedChange={(checked) => 
                      handleSymptomChange(symptom.id, checked === true)
                    }
                  />
                  <label 
                    htmlFor={symptom.id} 
                    className="text-sm font-medium leading-none cursor-pointer flex-grow"
                  >
                    {symptom.label}
                  </label>
                </div>
              ))}
            </div>
            <Button 
              onClick={identifyDeficiencies} 
              className="mt-4 bg-violet-600 hover:bg-violet-700 transition-colors"
              disabled={selectedSymptoms.length === 0}
            >
              Identificar Deficiências
            </Button>
          </div>

          {showResults && (
            <div className="mt-6 animate-fade-in">
              <h3 className="text-md font-medium mb-3">Possíveis Deficiências:</h3>
              {results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((deficiency) => (
                    <Alert 
                      key={deficiency.name}
                      variant="default"
                      className={`border-l-4 ${getSeverityColor(deficiency.severity)}`}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <CheckIcon className="h-4 w-4 text-violet-500 mr-2" />
                          <AlertTitle className="font-medium">
                            {deficiency.name}
                          </AlertTitle>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            Correspondência: {deficiency.matchCount}
                          </span>
                          {deficiency.severity && (
                            <span className={`text-xs ml-2 px-2 py-1 rounded-full ${
                              deficiency.severity === 'high' ? 'bg-red-100 text-red-700' : 
                              deficiency.severity === 'medium' ? 'bg-orange-100 text-orange-700' : 
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              Severidade: {getSeverityText(deficiency.severity)}
                            </span>
                          )}
                        </div>
                      </div>
                      <AlertDescription className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">{deficiency.description}</p>
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-700 mb-1">Soluções recomendadas:</p>
                          <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                            {deficiency.solutions.map((solution, idx) => (
                              <li key={idx}>{solution}</li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <Alert variant="default" className="border-yellow-200 bg-yellow-50">
                  <AlertCircleIcon className="h-4 w-4 text-yellow-600 mr-2" />
                  <AlertTitle>Nenhum resultado encontrado</AlertTitle>
                  <AlertDescription>
                    Selecione mais sintomas ou consulte um especialista para diagnóstico preciso.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeficiencyIdentifier;
