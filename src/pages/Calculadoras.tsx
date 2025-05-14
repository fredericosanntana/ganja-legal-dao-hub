import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Calculator,
  Thermometer,
  Droplets,
  Sun,
  Cloud,
  Activity,
  Lightbulb,
  Droplet,
  Leaf,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Chart from "chart.js/auto";

// Constantes para VPD Calculator
const VPD_RANGES = {
  vegetativo: { min: 0.8, max: 1.2 },
  floracaoInicial: { min: 1.0, max: 1.4 },
  floracaoTardia: { min: 1.2, max: 1.6 }
};

// Funções auxiliares para VPD Calculator
const calculateVPD = (leafTemp: number, airTemp: number, humidity: number): number => {
  const svpLeaf = 610.7 * Math.pow(10, (7.5 * leafTemp) / (237.3 + leafTemp));
  const svpAir = 610.7 * Math.pow(10, (7.5 * airTemp) / (237.3 + airTemp));
  const vpAir = (svpAir * humidity) / 100;
  return (svpLeaf - vpAir) / 1000; // Convertendo para kPa
};

const estimateLeafTemperature = (airTemp: number): number => {
  return airTemp - 2; // Estimativa simples: folha 2°C mais fria que o ar
};

const getVPDZone = (vpd: number, stage: string): string => {
  const range = VPD_RANGES[stage as keyof typeof VPD_RANGES];
  if (vpd < range.min - 0.2) return 'tooLow';
  if (vpd < range.min) return 'low';
  if (vpd > range.max + 0.2) return 'tooHigh';
  if (vpd > range.max) return 'high';
  return 'optimal';
};

// Renomear a função do VPD Calculator
const generateVPDRecommendations = (
  vpd: number,
  zone: string,
  temperature: number,
  humidity: number,
  stage: string
) => {
  const actions = [];
  let status = '';

  switch (zone) {
    case 'tooLow':
      status = 'VPD muito baixo - Risco de doenças';
      actions.push('Aumente a temperatura ou diminua a umidade');
      actions.push('Melhore a circulação de ar');
      actions.push('Verifique se há condensação nas folhas');
      break;
    case 'low':
      status = 'VPD baixo';
      actions.push('Considere aumentar a temperatura');
      actions.push('Monitore a umidade relativa');
      break;
    case 'optimal':
      status = 'VPD ótimo';
      actions.push('Mantenha as condições atuais');
      break;
    case 'high':
      status = 'VPD alto';
      actions.push('Considere diminuir a temperatura');
      actions.push('Aumente a umidade relativa');
      break;
    case 'tooHigh':
      status = 'VPD muito alto - Risco de estresse';
      actions.push('Diminua a temperatura imediatamente');
      actions.push('Aumente a umidade relativa');
      actions.push('Verifique a hidratação das plantas');
      break;
  }

  // Recomendações específicas por estágio
  if (stage === 'vegetativo') {
    actions.push('Mantenha boa circulação de ar');
    actions.push('Monitore o crescimento das folhas');
  } else if (stage === 'floracaoInicial') {
    actions.push('Ajuste gradualmente para VPD mais alto');
    actions.push('Monitore a formação de botões');
  } else if (stage === 'floracaoTardia') {
    actions.push('Mantenha VPD mais alto para produção de resina');
    actions.push('Evite flutuações bruscas');
  }

  return { status, actions };
};

const generateChartData = (stage: string) => {
  const temperatures = Array.from({ length: 21 }, (_, i) => 15 + i);
  const humidities = [40, 50, 60, 70, 80];
  const range = VPD_RANGES[stage as keyof typeof VPD_RANGES];

  return {
    labels: temperatures.map(t => `${t}°C`),
    datasets: [
      ...humidities.map((h, i) => ({
        label: `${h}% UR`,
        data: temperatures.map(t => calculateVPD(estimateLeafTemperature(t), t, h)),
        borderColor: `hsl(${200 + i * 20}, 70%, 50%)`,
        tension: 0.1
      })),
      {
        label: 'VPD Mínimo',
        data: temperatures.map(() => range.min),
        borderColor: 'rgba(40, 167, 69, 0.5)',
        borderDash: [5, 5],
        fill: false
      },
      {
        label: 'VPD Máximo',
        data: temperatures.map(() => range.max),
        borderColor: 'rgba(40, 167, 69, 0.5)',
        borderDash: [5, 5],
        fill: false
      }
    ]
  };
};

const VPDCalculator = () => {
  const [temperature, setTemperature] = useState<number>(25);
  const [humidity, setHumidity] = useState<number>(60);
  const [leafTemperature, setLeafTemperature] = useState<string>('');
  const [growthStage, setGrowthStage] = useState<string>("vegetativo");
  const [vpdResult, setVpdResult] = useState<number | null>(null);
  const [vpdZone, setVpdZone] = useState<string>('optimal');
  const [recommendations, setRecommendations] = useState<{ status: string; actions: string[] }>({ status: '', actions: [] });

  const vpdChartRef = useRef<HTMLCanvasElement>(null);
  const vpdChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const leafTemp = leafTemperature === '' ? estimateLeafTemperature(temperature) : parseFloat(leafTemperature);
    const vpd = calculateVPD(leafTemp, temperature, humidity);
    const zone = getVPDZone(vpd, growthStage);
    const recs = generateVPDRecommendations(vpd, zone, temperature, humidity, growthStage);

    setVpdResult(vpd);
    setVpdZone(zone);
    setRecommendations(recs);

    // Atualizar gráfico
    if (vpdChartInstance.current) {
      vpdChartInstance.current.destroy();
    }

    if (vpdChartRef.current) {
      vpdChartInstance.current = new Chart(vpdChartRef.current, {
        type: 'line',
        data: generateChartData(growthStage),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Temperatura (°C)'
              }
            },
            y: {
              title: {
                display: true,
                text: 'VPD (kPa)'
              },
              min: 0,
              max: 3
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: (tooltipItems) => `Temperatura: ${tooltipItems[0].label}`
              }
            }
          }
        }
      });
    }

    return () => {
      if (vpdChartInstance.current) {
        vpdChartInstance.current.destroy();
      }
    };
  }, [temperature, humidity, leafTemperature, growthStage]);

  const handleResetLeafTemp = () => {
    setLeafTemperature('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-primary" />
          Calculadora VPD (Vapor Pressure Deficit)
        </CardTitle>
        <CardDescription>
          Calcule o Déficit de Pressão de Vapor para otimizar condições de cultivo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Parâmetros */}
          <div className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="temperature">Temperatura Ambiente (°C)</Label>
              <div className="flex items-center gap-2">
            <Input
                  type="range"
              id="temperature"
                  min={15}
                  max={35}
                  step={0.5}
              value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="flex-1"
            />
                <span className="w-16 text-center">{temperature}°C</span>
          </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>15°C</span>
                <span>35°C</span>
              </div>
            </div>

          <div className="space-y-2">
            <Label htmlFor="humidity">Umidade Relativa (%)</Label>
              <div className="flex items-center gap-2">
            <Input
                  type="range"
              id="humidity"
                  min={20}
                  max={90}
                  step={1}
              value={humidity}
                  onChange={(e) => setHumidity(parseFloat(e.target.value))}
                  className="flex-1"
            />
                <span className="w-16 text-center">{humidity}%</span>
          </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>20%</span>
                <span>90%</span>
        </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leaf-temperature">Temperatura da Folha (°C)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  id="leaf-temperature"
                  min={10}
                  max={35}
                  step={0.1}
                  value={leafTemperature}
                  onChange={(e) => setLeafTemperature(e.target.value)}
                  placeholder="Auto"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleResetLeafTemp}
                  className="whitespace-nowrap"
                >
                  Auto
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Deixe em branco para estimativa automática
            </p>
          </div>

            <div className="space-y-2">
              <Label htmlFor="growth-stage">Estágio de Crescimento</Label>
              <Select value={growthStage} onValueChange={setGrowthStage}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estágio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetativo">Vegetativo</SelectItem>
                  <SelectItem value="floracaoInicial">Floração Inicial</SelectItem>
                  <SelectItem value="floracaoTardia">Floração Tardia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Resultados */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                {vpdResult !== null ? `${vpdResult.toFixed(2)} kPa` : '0.00 kPa'}
              </h2>
              <div className="relative h-8 mb-2">
                {/* Zonas de cor */}
                <div className="absolute inset-0 flex rounded-full overflow-hidden">
                  <div className="w-1/5 bg-blue-400" />
                  <div className="w-1/5 bg-green-300" />
                  <div className="w-1/5 bg-emerald-500" />
                  <div className="w-1/5 bg-yellow-400" />
                  <div className="w-1/5 bg-red-500" />
                </div>

                {/* Marcador */}
                <div
                  className="absolute top-0 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-transparent border-t-black"
                  style={{
                    left: `${((vpdResult || 0) / 3) * 100}%`,
                    transform: 'translateX(-50%)'
                  }}
                />
              </div>

              {/* Labels */}
              <div className="flex justify-between text-sm font-medium">
                <span className="text-blue-600">Muito Baixo</span>
                <span className="text-green-500">Baixo</span>
                <span className="text-emerald-600">Ótimo</span>
                <span className="text-yellow-600">Alto</span>
                <span className="text-red-600">Muito Alto</span>
              </div>
            </div>

            <div className={`alert ${
              vpdZone === 'tooLow' ? 'bg-blue-500/20' :
              vpdZone === 'low' || vpdZone === 'optimal' ? 'bg-green-500/20' :
              vpdZone === 'high' ? 'bg-yellow-500/20' : 'bg-red-500/20'
            }`}>
              <strong>{recommendations.status}</strong>
            </div>

            <div>
              <h6 className="text-lg font-medium mb-2">Recomendações:</h6>
              <ul className="list-disc pl-5 space-y-1">
                {recommendations.actions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Gráfico */}
          <div className="space-y-4 md:col-span-2">
            <div className="h-64">
              <canvas ref={vpdChartRef}></canvas>
            </div>
            <p className="text-sm text-muted-foreground">
              O gráfico mostra o VPD para diferentes combinações de temperatura e umidade.
              A área entre as linhas tracejadas verdes representa a faixa ideal para o estágio selecionado.
            </p>
          </div>
        </div>

        {/* Sobre VPD */}
        <div className="mt-8">
          <h5 className="text-lg font-medium mb-4">Sobre VPD</h5>
          <p className="mb-4">
            O <strong>Déficit de Pressão de Vapor (VPD)</strong> é a diferença entre a quantidade
            de umidade no ar e quanto umidade o ar poderia potencialmente conter quando saturado.
            É uma medida importante para cultivadores de cannabis, pois afeta diretamente a taxa
            de transpiração das plantas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h6 className="font-medium mb-2">Um VPD ideal:</h6>
              <ul className="list-disc pl-5 space-y-2">
                <li>Promove transpiração saudável e absorção de nutrientes</li>
                <li>Reduz o risco de doenças fúngicas e mofo</li>
                <li>Otimiza o crescimento e desenvolvimento da planta</li>
                <li>Varia de acordo com o estágio de crescimento da planta</li>
              </ul>
            </div>
            <div>
              <h6 className="font-medium mb-2">Valores de referência:</h6>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Vegetativo:</strong> 0.8 - 1.2 kPa</li>
                <li><strong>Floração Inicial:</strong> 1.0 - 1.4 kPa</li>
                <li><strong>Floração Tardia:</strong> 1.2 - 1.6 kPa</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Dew Point Calculator (novo)
const DewPointCalculator = () => {
  const [temperature, setTemperature] = useState<number>(18);
  const [humidity, setHumidity] = useState<number>(60);
  const [phase, setPhase] = useState<string>("secagemInicial");
  const [density, setDensity] = useState<string>("medio");
  const [airflow, setAirflow] = useState<string>("media");

  const dewPointRef = useRef<HTMLHeadingElement>(null);
  const moldRiskRef = useRef<HTMLDivElement>(null);
  const dryingRateRef = useRef<HTMLParagraphElement>(null);
  const dryingTimeRef = useRef<HTMLParagraphElement>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);
  const actionListRef = useRef<HTMLUListElement>(null);
  const moldChartRef = useRef<HTMLCanvasElement>(null);
  const scheduleChartRef = useRef<HTMLCanvasElement>(null);
  const scheduleTableRef = useRef<HTMLTableSectionElement>(null);
  const moldChartInstance = useRef<Chart | null>(null);
  const scheduleChartInstance = useRef<Chart | null>(null);

  const calculateDewPoint = (T: number, RH: number) => {
    const a = 17.27;
    const b = 237.7;
    const alpha = (a * T) / (b + T) + Math.log(RH / 100);
    return (b * alpha) / (a - alpha);
  };

  const calculateMoldRisk = (T: number, dp: number) => {
    const diff = T - dp;
    if (diff < 2) return 'alto';
    if (diff < 4) return 'medio';
    return 'baixo';
  };

  const estimateDryingRate = (temp: number, humidity: number, density: string, airflow: string) => {
    const baseRate = ((humidity - 30) / 50) * 10;
    const densityFactor = density === 'denso' ? 0.8 : density === 'medio' ? 1 : 1.2;
    const airflowFactor = airflow === 'alta' ? 1.2 : airflow === 'media' ? 1 : 0.8;
    
    const dailyRate = baseRate * densityFactor * airflowFactor;
    const estimatedDays = (100 - humidity) / dailyRate;
    
    return { dailyRate, estimatedDays };
  };

  // Renomear a função do Dew Point Calculator
  const generateDewPointRecommendations = (
    temp: number,
    humidity: number,
    dewPoint: number,
    moldRisk: string,
    dryingRate: { dailyRate: number; estimatedDays: number },
    phase: string,
    density: string,
    airflow: string
  ) => {
    const actions = [];
    let status = '';

    if (moldRisk === 'alto') {
      status = 'Atenção: Risco alto de mofo!';
      actions.push('Aumente a temperatura ou diminua a umidade');
      actions.push('Melhore a circulação de ar');
      actions.push('Verifique se há condensação nas superfícies');
    } else if (moldRisk === 'medio') {
      status = 'Cuidado: Risco médio de mofo';
      actions.push('Monitore as condições de perto');
      actions.push('Considere ajustar a temperatura ou umidade');
    } else {
      status = 'Condições ideais para esta fase';
      actions.push('Mantenha as condições atuais');
    }

    // Recomendações específicas por fase
    if (phase === 'secagemInicial') {
      actions.push('Mantenha boa circulação de ar');
      actions.push('Evite luz direta');
    } else if (phase === 'secagemMedia') {
      actions.push('Reduza gradualmente a circulação de ar');
      actions.push('Monitore a umidade diariamente');
    } else if (phase === 'cura') {
      actions.push('Armazene em recipientes herméticos');
      actions.push('Abra os recipientes diariamente para troca de ar');
    }

    return { status, actions };
  };

  const generateSchedule = (density: string) => {
    const baseDays = {
    secagemInicial: { dias: 4, temperatura: '15-21°C', umidade: '45-60%' },
      secagemMedia: { dias: 6, temperatura: '15-21°C', umidade: '50-65%' },
      cura: { dias: 14, temperatura: '15-21°C', umidade: '58-65%' }
    };

    // Ajustar dias baseado na densidade
    const densityFactor = density === 'denso' ? 1.2 : density === 'medio' ? 1 : 0.8;
    
    return {
      secagemInicial: {
        ...baseDays.secagemInicial,
        dias: Math.round(baseDays.secagemInicial.dias * densityFactor)
      },
      secagemMedia: {
        ...baseDays.secagemMedia,
        dias: Math.round(baseDays.secagemMedia.dias * densityFactor)
      },
      cura: {
        ...baseDays.cura,
        dias: Math.round(baseDays.cura.dias * densityFactor)
      }
    };
  };

  useEffect(() => {
    const dp = calculateDewPoint(temperature, humidity);
    const risk = calculateMoldRisk(temperature, dp);
    const dryingRateInfo = estimateDryingRate(temperature, humidity, density, airflow);
    const recommendationsInfo = generateDewPointRecommendations(
      temperature, humidity, dp, risk, dryingRateInfo, phase, density, airflow
    );
    const schedule = generateSchedule(density);

    // Atualizar DOM
    if (dewPointRef.current) dewPointRef.current.textContent = `${dp.toFixed(1)}°C`;
    if (moldRiskRef.current) {
      moldRiskRef.current.className = `alert ${
        risk === 'alto' ? 'alert-danger' :
        risk === 'medio' ? 'alert-warning' : 'alert-success'
      }`;
      moldRiskRef.current.innerHTML = `<strong>${
        risk === 'alto' ? 'Alto' :
        risk === 'medio' ? 'Médio' : 'Baixo'
      }</strong>`;
    }

    if (dryingRateRef.current) {
      dryingRateRef.current.textContent = `~${dryingRateInfo.dailyRate.toFixed(1)}% de umidade por dia`;
    }
    if (dryingTimeRef.current) {
      dryingTimeRef.current.textContent = `Tempo estimado: ${dryingRateInfo.estimatedDays.toFixed(1)} dias`;
    }

    if (recommendationsRef.current) {
      recommendationsRef.current.className = `alert ${
        risk === 'alto' ? 'alert-danger' :
        risk === 'medio' ? 'alert-warning' : 'alert-info'
      }`;
      recommendationsRef.current.innerHTML = `<strong>${recommendationsInfo.status}</strong>`;
    }

    if (actionListRef.current) {
      actionListRef.current.innerHTML = recommendationsInfo.actions
        .map(action => `<li>${action}</li>`)
        .join('');
    }

    if (scheduleTableRef.current) {
      scheduleTableRef.current.innerHTML = `
        <tr>
          <td>Secagem Inicial</td>
          <td>${schedule.secagemInicial.dias}</td>
          <td>${schedule.secagemInicial.temperatura}</td>
          <td>${schedule.secagemInicial.umidade}</td>
        </tr>
        <tr>
          <td>Secagem Média</td>
          <td>${schedule.secagemMedia.dias}</td>
          <td>${schedule.secagemMedia.temperatura}</td>
          <td>${schedule.secagemMedia.umidade}</td>
        </tr>
        <tr>
          <td>Cura</td>
          <td>${schedule.cura.dias}</td>
          <td>${schedule.cura.temperatura}</td>
          <td>${schedule.cura.umidade}</td>
        </tr>
      `;
    }

    // Destruir gráficos existentes
    if (moldChartInstance.current) {
      moldChartInstance.current.destroy();
    }
    if (scheduleChartInstance.current) {
      scheduleChartInstance.current.destroy();
    }

    // Criar novos gráficos
    if (moldChartRef.current) {
      const labels = Array.from({ length: 5 }, (_, i) => temperature - 2 + i);
      moldChartInstance.current = new Chart(moldChartRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Ponto de Orvalho',
            data: labels.map(t => calculateDewPoint(t, humidity)),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Temperatura (°C)'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Ponto de Orvalho (°C)'
              },
              min: 0,
              max: 30
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: (tooltipItems) => `Temperatura: ${tooltipItems[0].label}°C`
              }
            },
            legend: {
              display: true,
              position: 'bottom'
            }
          }
        }
      });
    }

    if (scheduleChartRef.current) {
      scheduleChartInstance.current = new Chart(scheduleChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Secagem Inicial', 'Secagem Média', 'Cura'],
          datasets: [{
            label: 'Dias',
            data: [
            schedule.secagemInicial.dias,
            schedule.secagemMedia.dias,
            schedule.cura.dias
            ],
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(153, 102, 255, 0.6)'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Dias'
              }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'bottom'
            }
          }
        }
      });
    }

    return () => {
      if (moldChartInstance.current) {
        moldChartInstance.current.destroy();
      }
      if (scheduleChartInstance.current) {
        scheduleChartInstance.current.destroy();
      }
    };
  }, [temperature, humidity, phase, density, airflow]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-primary" />
          Calculadora de Ponto de Orvalho
        </CardTitle>
        <CardDescription>Secagem e Cura de Cannabis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Parâmetros */}
          <div className="space-y-4">
            <div className="space-y-2">
            <Label htmlFor="temperature">Temperatura Ambiente (°C)</Label>
              <div className="flex items-center gap-2">
                <Input
              type="range"
                  id="temperature"
              min={10}
              max={30}
              step={0.5}
              value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="w-16 text-center">{temperature}°C</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>10°C</span>
                <span>30°C</span>
              </div>
            </div>

            <div className="space-y-2">
            <Label htmlFor="humidity">Umidade Relativa (%)</Label>
              <div className="flex items-center gap-2">
                <Input
              type="range"
                  id="humidity"
              min={30}
              max={80}
              step={1}
              value={humidity}
                  onChange={(e) => setHumidity(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="w-16 text-center">{humidity}%</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>30%</span>
                <span>80%</span>
              </div>
            </div>

            <div className="space-y-2">
            <Label htmlFor="drying-phase">Fase</Label>
            <select
              id="drying-phase"
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
                className="w-full p-2 border rounded-md"
            >
              <option value="secagemInicial">Secagem Inicial</option>
              <option value="secagemMedia">Secagem Média</option>
              <option value="cura">Cura</option>
            </select>
            </div>

            <div className="space-y-2">
            <Label htmlFor="material-density">Densidade do Material</Label>
            <select
              id="material-density"
              value={density}
              onChange={(e) => setDensity(e.target.value)}
                className="w-full p-2 border rounded-md"
            >
              <option value="solto">Solto (flores pequenas)</option>
              <option value="medio">Médio (flores médias)</option>
              <option value="denso">Denso (flores grandes)</option>
            </select>
            </div>

            <div className="space-y-2">
            <Label htmlFor="airflow">Circulação de Ar</Label>
            <select
              id="airflow"
              value={airflow}
              onChange={(e) => setAirflow(e.target.value)}
                className="w-full p-2 border rounded-md"
            >
              <option value="baixa">Baixa (ambiente fechado)</option>
              <option value="media">Média (ventilação suave)</option>
              <option value="alta">Alta (ventilador direto)</option>
            </select>
            </div>
          </div>

          {/* Resultados */}
          <div className="space-y-4">
            <div className="text-center">
              <h6 className="text-lg font-medium">Ponto de Orvalho</h6>
              <h2 ref={dewPointRef} className="text-3xl font-bold">0°C</h2>
              <p className="text-sm text-muted-foreground">Temperatura na qual ocorre condensação</p>
            </div>

            <div className="space-y-2">
              <h6 className="text-lg font-medium">Risco de Mofo</h6>
            <div ref={moldRiskRef} className="alert">Baixo</div>
            </div>

            <div className="space-y-2">
              <h6 className="text-lg font-medium">Taxa de Secagem</h6>
              <p ref={dryingRateRef} className="text-lg">~0% de umidade por dia</p>
              <p ref={dryingTimeRef} className="text-sm text-muted-foreground">Tempo estimado: 0 dias</p>
            </div>

            <div className="space-y-2">
            <div ref={recommendationsRef} className="alert alert-info">
              Condições ideais para esta fase
            </div>
              <div>
                <h6 className="text-lg font-medium">Recomendações:</h6>
                <ul ref={actionListRef} className="list-disc pl-5 space-y-1"></ul>
              </div>
            </div>
          </div>

          {/* Gráficos e Cronograma */}
          <div className="space-y-4 md:col-span-2">
            <div className="h-64">
              <canvas ref={moldChartRef}></canvas>
            </div>
            <div className="h-64">
              <canvas ref={scheduleChartRef}></canvas>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
              <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Fase</th>
                    <th className="p-2 text-left">Dias</th>
                    <th className="p-2 text-left">Temp.</th>
                    <th className="p-2 text-left">Umid.</th>
                  </tr>
                </thead>
                <tbody ref={scheduleTableRef}></tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Funções auxiliares para DLI Calculator
const luxToPPFD = (lux: number, lightType: string): number => {
  const conversionFactors = {
    hps: 0.0155,
    led: 0.0185,
    cmh: 0.0165,
    fluorescente: 0.0135,
    sol: 0.0205
  };
  return lux * (conversionFactors[lightType as keyof typeof conversionFactors] || 0.0155);
};

const adjustPPFDForDistance = (ppfd: number, referenceDistance: number, currentDistance: number): number => {
  return ppfd * Math.pow(referenceDistance / currentDistance, 2);
};

const calculateDLI = (ppfd: number, hoursOfLight: number): number => {
  return (ppfd * hoursOfLight * 3600) / 1000000; // Convertendo para mol/m²/dia
};

const getDLIZone = (dli: number, stage: string): string => {
  const zones = {
    mudas: { tooLow: 12, low: 20, high: 30, tooHigh: 40 },
    vegetativo: { tooLow: 20, low: 30, high: 45, tooHigh: 55 },
    floracao: { tooLow: 30, low: 40, high: 55, tooHigh: 65 }
  };
  
  const stageZones = zones[stage as keyof typeof zones];
  if (dli < stageZones.tooLow) return 'tooLow';
  if (dli < stageZones.low) return 'low';
  if (dli > stageZones.tooHigh) return 'tooHigh';
  if (dli > stageZones.high) return 'high';
  return 'optimal';
};

// Renomear a função do DLI Calculator
const generateDLIRecommendations = (
  dli: number,
  zone: string,
  ppfd: number,
  hoursOfLight: number,
  stage: string
) => {
  const actions = [];
  let status = '';

  switch (zone) {
    case 'tooLow':
      status = 'DLI muito baixo';
      actions.push('Aumente a intensidade da luz');
      actions.push('Considere aumentar as horas de luz');
      break;
    case 'low':
      status = 'DLI baixo';
      actions.push('Considere aumentar a intensidade da luz');
      if (hoursOfLight < 18) actions.push('Aumente as horas de luz');
      break;
    case 'optimal':
      status = 'DLI ótimo';
      actions.push('Mantenha as condições atuais');
      break;
    case 'high':
      status = 'DLI alto';
      actions.push('Considere reduzir a intensidade da luz');
      if (hoursOfLight > 12) actions.push('Reduza as horas de luz');
      break;
    case 'tooHigh':
      status = 'DLI muito alto';
      actions.push('Reduza a intensidade da luz imediatamente');
      actions.push('Reduza as horas de luz');
      break;
  }

  // Recomendações específicas por estágio
  if (stage === 'mudas') {
    actions.push('Mantenha as mudas a uma distância segura da luz');
    actions.push('Monitore sinais de estresse');
  } else if (stage === 'vegetativo') {
    actions.push('Ajuste a altura das luzes conforme a planta cresce');
  } else if (stage === 'floracao') {
    actions.push('Mantenha a intensidade consistente durante a floração');
    actions.push('Evite mudanças bruscas no fotoperíodo');
  }

  return { status, actions };
};

const estimateEnergyConsumption = (
  ppfd: number,
  area: number,
  lightType: string,
  hoursOfLight: number
): number => {
  const efficiencyFactors = {
    hps: 1.0,
    led: 0.6,
    cmh: 0.8,
    fluorescente: 0.7,
    sol: 0
  };

  const wattsPerSquareMeter = (ppfd * area) / 2; // Estimativa aproximada
  return wattsPerSquareMeter * (efficiencyFactors[lightType as keyof typeof efficiencyFactors] || 1) * hoursOfLight / 1000;
};

const DLICalculator = () => {
  const [lightType, setLightType] = useState<string>("hps");
  const [lightIntensity, setLightIntensity] = useState<number>(10000);
  const [lightHours, setLightHours] = useState<number>(18);
  const [lightDistance, setLightDistance] = useState<number>(50);
  const [growthStage, setGrowthStage] = useState<string>("vegetativo");
  const [growArea, setGrowArea] = useState<number>(1);

  const ppfdValueRef = useRef<HTMLSpanElement>(null);
  const dliValueRef = useRef<HTMLHeadingElement>(null);
  const dliStatusRef = useRef<HTMLDivElement>(null);
  const recommendationListRef = useRef<HTMLUListElement>(null);
  const energyValueRef = useRef<HTMLSpanElement>(null);
  const lightCurveChartRef = useRef<HTMLCanvasElement>(null);
  const dliComparisonChartRef = useRef<HTMLCanvasElement>(null);
  const lightCurveChartInstance = useRef<Chart | null>(null);
  const dliComparisonChartInstance = useRef<Chart | null>(null);

  const generateLightCurveData = (ppfd: number, hoursOfLight: number) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return {
      labels: hours.map(h => `${h}h`),
      datasets: [{
        label: 'PPFD',
        data: hours.map(h => h >= 0 && h < hoursOfLight ? ppfd : 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    };
  };

  const generateDLIComparisonData = (currentDLI: number) => {
    const stages = ['Mudas', 'Vegetativo', 'Floração'];
    const referenceDLIs = [16, 30, 45]; // Valores de referência para cada estágio
    return {
      labels: stages,
      datasets: [
        {
          label: 'DLI Atual',
          data: stages.map(() => currentDLI),
          backgroundColor: 'rgba(75, 192, 192, 0.6)'
        },
        {
          label: 'DLI Ideal',
          data: referenceDLIs,
          backgroundColor: 'rgba(153, 102, 255, 0.6)'
        }
      ]
    };
  };

  useEffect(() => {
    // Calcular valores
    let ppfd = luxToPPFD(lightIntensity, lightType);
    if (lightType !== 'sol') {
      ppfd = adjustPPFDForDistance(ppfd, 50, lightDistance);
    }
    const dli = calculateDLI(ppfd, lightHours);
    const zone = getDLIZone(dli, growthStage);
    const recommendations = generateDLIRecommendations(dli, zone, ppfd, lightHours, growthStage);
    const energyConsumption = estimateEnergyConsumption(ppfd, growArea, lightType, lightHours);

    // Atualizar DOM
    if (ppfdValueRef.current) {
      ppfdValueRef.current.textContent = Math.round(ppfd).toString();
    }
    if (dliValueRef.current) {
      dliValueRef.current.textContent = `${dli.toFixed(1)} mol/m²/dia`;
    }
    if (dliStatusRef.current) {
      dliStatusRef.current.className = `alert ${
        zone === 'tooLow' ? 'alert-info' :
        zone === 'low' || zone === 'optimal' ? 'alert-success' :
        zone === 'high' ? 'alert-warning' : 'alert-danger'
      }`;
      dliStatusRef.current.innerHTML = `<strong>${recommendations.status}</strong>`;
    }
    if (recommendationListRef.current) {
      recommendationListRef.current.innerHTML = recommendations.actions
        .map(action => `<li>${action}</li>`)
        .join('');
    }
    if (energyValueRef.current) {
      energyValueRef.current.textContent = energyConsumption.toFixed(1);
    }

    // Atualizar gráficos
    if (lightCurveChartInstance.current) {
      lightCurveChartInstance.current.destroy();
    }
    if (dliComparisonChartInstance.current) {
      dliComparisonChartInstance.current.destroy();
    }

    if (lightCurveChartRef.current) {
      lightCurveChartInstance.current = new Chart(lightCurveChartRef.current, {
        type: 'bar',
        data: generateLightCurveData(ppfd, lightHours),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Hora do Dia'
              }
            },
            y: {
              title: {
                display: true,
                text: 'PPFD (μmol/m²/s)'
              },
              min: 0
            }
          }
        }
      });
    }

    if (dliComparisonChartRef.current) {
      dliComparisonChartInstance.current = new Chart(dliComparisonChartRef.current, {
        type: 'bar',
        data: generateDLIComparisonData(dli),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Estágio de Crescimento'
              }
            },
            y: {
              title: {
                display: true,
                text: 'DLI (mol/m²/dia)'
              },
              min: 0,
              max: 60
            }
          }
        }
      });
    }

    return () => {
      if (lightCurveChartInstance.current) {
        lightCurveChartInstance.current.destroy();
      }
      if (dliComparisonChartInstance.current) {
        dliComparisonChartInstance.current.destroy();
      }
    };
  }, [lightType, lightIntensity, lightHours, lightDistance, growthStage, growArea]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Calculadora DLI (Daily Light Integral)
        </CardTitle>
        <CardDescription>
          Calcule a quantidade total de luz fotossinteticamente ativa recebida pelas plantas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Parâmetros */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Luz</Label>
              <RadioGroup
                value={lightType}
                onValueChange={setLightType}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hps" id="light-hps" />
                  <Label htmlFor="light-hps">HPS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="led" id="light-led" />
                  <Label htmlFor="light-led">LED</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cmh" id="light-cmh" />
                  <Label htmlFor="light-cmh">CMH</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fluorescente" id="light-fluorescente" />
                  <Label htmlFor="light-fluorescente">Fluo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sol" id="light-sol" />
                  <Label htmlFor="light-sol">Sol</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="light-intensity">Intensidade da Luz (lux)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  id="light-intensity"
                  min={100}
                  max={100000}
                  step={100}
                  value={lightIntensity}
                  onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                />
                <span className="text-sm text-muted-foreground">lux</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Equivalente a <span ref={ppfdValueRef}>0</span> μmol/m²/s (PPFD)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="light-hours">Horas de Luz por Dia</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="range"
                  id="light-hours"
                  min={6}
                  max={24}
                  step={0.5}
                  value={lightHours}
                  onChange={(e) => setLightHours(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="w-16 text-center">{lightHours}h</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>6h</span>
                <span>24h</span>
              </div>
            </div>

            {lightType !== 'sol' && (
              <div className="space-y-2">
                <Label htmlFor="light-distance">Distância da Luz às Plantas (cm)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="range"
                    id="light-distance"
                    min={10}
                    max={150}
                    step={1}
                    value={lightDistance}
                    onChange={(e) => setLightDistance(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-16 text-center">{lightDistance}cm</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>10cm</span>
                  <span>150cm</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="growth-stage">Estágio de Crescimento</Label>
              <select
                id="growth-stage"
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="mudas">Mudas/Clones</option>
                <option value="vegetativo">Vegetativo</option>
                <option value="floracao">Floração</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grow-area">Área de Cultivo (m²)</Label>
              <Input
                type="number"
                id="grow-area"
                min={0.1}
                max={100}
                step={0.1}
                value={growArea}
                onChange={(e) => setGrowArea(parseFloat(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Opcional, para cálculo de consumo energético
              </p>
            </div>
          </div>

          {/* Resultados */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 ref={dliValueRef} className="text-3xl font-bold">0.0 mol/m²/dia</h2>
              <div className="mt-4">
                <Progress value={50} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Muito Baixo</span>
                  <span>Ótimo</span>
                  <span>Muito Alto</span>
                </div>
              </div>
            </div>

            <div ref={dliStatusRef} className="alert">
              <strong>DLI ótimo</strong>
            </div>

            <div>
              <h6 className="text-lg font-medium">Recomendações:</h6>
              <ul ref={recommendationListRef} className="list-disc pl-5 space-y-1"></ul>
            </div>

            <div className="text-sm">
              <strong>Consumo estimado:</strong>{' '}
              <span ref={energyValueRef}>0.0</span> kWh/dia
            </div>
          </div>

          {/* Gráficos */}
          <div className="space-y-4 md:col-span-2">
            <div className="h-64">
              <canvas ref={lightCurveChartRef}></canvas>
            </div>
            <div className="h-64">
              <canvas ref={dliComparisonChartRef}></canvas>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Constantes para EC Flush Calculator
const TARGET_FLUSH_EC = 0.4; // EC alvo após flush completo

// Funções auxiliares para EC Flush Calculator
const convertToEC = (value: number, unit: string): number => {
  if (unit === 'ec') return value;
  if (unit === 'ppm500') return value / 500;
  if (unit === 'ppm700') return value / 700;
  return value;
};

const calculateWaterVolume = (potSize: number, substrate: string): number => {
  const multipliers = {
    solo: 3,
    coco: 2.5,
    hidroponia: 2
  };
  return potSize * (multipliers[substrate as keyof typeof multipliers] || 3);
};

const calculateNumberOfFlushes = (currentEC: number, targetEC: number, substrate: string): number => {
  const efficiencyFactors = {
    solo: 0.6,
    coco: 0.7,
    hidroponia: 0.8
  };
  
  const efficiency = efficiencyFactors[substrate as keyof typeof efficiencyFactors] || 0.6;
  const reductionPerFlush = 1 - efficiency;
  
  let remainingEC = currentEC;
  let flushCount = 0;
  
  while (remainingEC > targetEC && flushCount < 10) {
    remainingEC *= reductionPerFlush;
    flushCount++;
  }
  
  return Math.min(flushCount, 5); // Limitar a 5 flushes
};

const generateECReductionSchedule = (
  currentEC: number,
  targetEC: number,
  daysRemaining: number,
  flushCount: number
) => {
  const schedule = [];
  const daysPerFlush = Math.floor(daysRemaining / flushCount);
  let remainingEC = currentEC;
  
  for (let i = 0; i < flushCount; i++) {
    const day = i * daysPerFlush + 1;
    remainingEC *= 0.6; // Redução de 60% por flush
    
    schedule.push({
      day,
      ec: remainingEC.toFixed(2),
      action: `Realizar flush ${i + 1} de ${flushCount}`
    });
  }
  
  return schedule;
};

const generateFlushRecommendations = (
  currentEC: number,
  waterEC: number,
  daysRemaining: number,
  flushCount: number
) => {
  const actions = [];
  let status = '';
  
  if (currentEC > 2.5) {
    status = 'EC muito alta - Flush urgente necessário';
    actions.push('Realize o primeiro flush imediatamente');
    actions.push('Monitore a EC do runoff após cada flush');
  } else if (currentEC > 1.5) {
    status = 'EC elevada - Flush recomendado';
    actions.push(`Realize ${flushCount} flushes nos próximos ${daysRemaining} dias`);
    actions.push('Monitore a EC do runoff após cada flush');
  } else {
    status = 'EC dentro do intervalo aceitável';
    actions.push('Continue monitorando a EC regularmente');
    actions.push('Realize flushes apenas se necessário');
  }
  
  if (waterEC > 0.3) {
    actions.push('Considere usar água com EC mais baixa');
  }
  
  actions.push('Mantenha a temperatura e umidade adequadas');
  actions.push('Evite fertilizantes durante o período de flush');
  
  return { status, actions };
};

const generateSubstrateInstructions = (
  substrate: string,
  waterVolume: number,
  flushCount: number
) => {
  const instructions = {
    solo: [
      'Regue lentamente para evitar compactação do solo',
      'Permita drenagem completa entre os flushes',
      'Monitore a umidade do solo entre os flushes',
      'Evite deixar água parada no prato'
    ],
    coco: [
      'Regue até 20% de runoff',
      'Mantenha o coco sempre úmido',
      'Use água com pH ajustado (5.8-6.2)',
      'Evite deixar o coco secar completamente'
    ],
    hidroponia: [
      'Drene completamente o sistema',
      'Encha com água limpa',
      'Recircule por 1-2 horas',
      'Drene e repita o processo'
    ]
  };
  
  return instructions[substrate as keyof typeof instructions] || instructions.solo;
};

const generateECReductionChartData = (schedule: any[]) => {
  return {
    labels: schedule.map(item => `Dia ${item.day}`),
    datasets: [
      {
        label: 'EC Projetada',
        data: schedule.map(item => parseFloat(item.ec)),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'EC Alvo',
        data: schedule.map(() => TARGET_FLUSH_EC),
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        tension: 0
      }
    ]
  };
};

const generateFlushEfficiencyChartData = (substrate: string, currentEC: number, targetEC: number) => {
  const efficiencyFactors = {
    solo: 0.6,
    coco: 0.7,
    hidroponia: 0.8
  };
  
  const efficiency = efficiencyFactors[substrate as keyof typeof efficiencyFactors] || 0.6;
  const flushCount = 5;
  const data = [];
  let remainingEC = currentEC;
  
  for (let i = 0; i <= flushCount; i++) {
    data.push(remainingEC);
    remainingEC *= (1 - efficiency);
  }
  
  return {
    labels: Array.from({ length: flushCount + 1 }, (_, i) => `Flush ${i}`),
    datasets: [
      {
        label: 'EC após cada flush',
        data,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'EC Alvo',
        data: Array(flushCount + 1).fill(targetEC),
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        tension: 0
      }
    ]
  };
};

const ECFlushCalculator = () => {
  const [currentEC, setCurrentEC] = useState<number>(2.0);
  const [ecUnit, setEcUnit] = useState<string>("ec");
  const [waterEC, setWaterEC] = useState<number>(0.2);
  const [potSize, setPotSize] = useState<number>(10);
  const [substrate, setSubstrate] = useState<string>("solo");
  const [daysRemaining, setDaysRemaining] = useState<number>(14);

  const waterVolumeRef = useRef<HTMLHeadingElement>(null);
  const flushCountRef = useRef<HTMLHeadingElement>(null);
  const totalVolumeRef = useRef<HTMLParagraphElement>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);
  const actionListRef = useRef<HTMLUListElement>(null);
  const scheduleTableRef = useRef<HTMLTableSectionElement>(null);
  const substrateNameRef = useRef<HTMLSpanElement>(null);
  const substrateInstructionsRef = useRef<HTMLOListElement>(null);
  const ecReductionChartRef = useRef<HTMLCanvasElement>(null);
  const flushEfficiencyChartRef = useRef<HTMLCanvasElement>(null);
  const ecReductionChartInstance = useRef<Chart | null>(null);
  const flushEfficiencyChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Calcular valores
    const currentECValue = convertToEC(currentEC, ecUnit);
    const waterVolume = calculateWaterVolume(potSize, substrate);
    const flushCount = calculateNumberOfFlushes(currentECValue, TARGET_FLUSH_EC, substrate);
    const totalVolume = waterVolume * flushCount;
    const schedule = generateECReductionSchedule(currentECValue, TARGET_FLUSH_EC, daysRemaining, flushCount);
    const recommendationsInfo = generateFlushRecommendations(currentECValue, waterEC, daysRemaining, flushCount);
    const instructions = generateSubstrateInstructions(substrate, waterVolume, flushCount);

    // Atualizar DOM
    if (waterVolumeRef.current) {
      waterVolumeRef.current.textContent = `${waterVolume.toFixed(1)} L`;
    }
    if (flushCountRef.current) {
      flushCountRef.current.textContent = flushCount.toString();
    }
    if (totalVolumeRef.current) {
      totalVolumeRef.current.textContent = `${totalVolume.toFixed(1)} L`;
    }
    if (recommendationsRef.current) {
      recommendationsRef.current.className = `alert ${
        currentECValue > 2.5 ? 'alert-danger' :
        currentECValue > 1.5 ? 'alert-warning' : 'alert-info'
      }`;
      recommendationsRef.current.innerHTML = `<strong>${recommendationsInfo.status}</strong>`;
    }
    if (actionListRef.current) {
      actionListRef.current.innerHTML = recommendationsInfo.actions
        .map(action => `<li>${action}</li>`)
        .join('');
    }
    if (scheduleTableRef.current) {
      scheduleTableRef.current.innerHTML = schedule
        .map(item => `
          <tr>
            <td>${item.day}</td>
            <td>${item.ec} mS/cm</td>
            <td>${item.action}</td>
          </tr>
        `)
        .join('');
    }
    if (substrateNameRef.current) {
      substrateNameRef.current.textContent = substrate.charAt(0).toUpperCase() + substrate.slice(1);
    }
    if (substrateInstructionsRef.current) {
      substrateInstructionsRef.current.innerHTML = instructions
        .map(instruction => `<li>${instruction}</li>`)
        .join('');
    }

    // Atualizar gráficos
    if (ecReductionChartInstance.current) {
      ecReductionChartInstance.current.destroy();
    }
    if (flushEfficiencyChartInstance.current) {
      flushEfficiencyChartInstance.current.destroy();
    }

    if (ecReductionChartRef.current) {
      ecReductionChartInstance.current = new Chart(ecReductionChartRef.current, {
        type: 'line',
        data: generateECReductionChartData(schedule),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              title: {
                display: true,
                text: 'EC (mS/cm)'
              },
              min: 0
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'bottom'
            }
          }
        }
      });
    }

    if (flushEfficiencyChartRef.current) {
      flushEfficiencyChartInstance.current = new Chart(flushEfficiencyChartRef.current, {
        type: 'line',
        data: generateFlushEfficiencyChartData(substrate, currentECValue, TARGET_FLUSH_EC),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              title: {
                display: true,
                text: 'EC (mS/cm)'
              },
              min: 0
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'bottom'
            }
          }
        }
      });
    }

    return () => {
      if (ecReductionChartInstance.current) {
        ecReductionChartInstance.current.destroy();
      }
      if (flushEfficiencyChartInstance.current) {
        flushEfficiencyChartInstance.current.destroy();
      }
    };
  }, [currentEC, ecUnit, waterEC, potSize, substrate, daysRemaining]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-primary" />
          Calculadora EC Flush
        </CardTitle>
        <CardDescription>
          Calcule o volume de água e número de flushes necessários para limpar o substrato
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Parâmetros */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-ec">EC/PPM Atual do Substrato/Runoff</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  id="current-ec"
                  min={0.1}
                  max={5.0}
                  step={0.1}
                  value={currentEC}
                  onChange={(e) => setCurrentEC(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <Select value={ecUnit} onValueChange={setEcUnit}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ec">EC (mS/cm)</SelectItem>
                    <SelectItem value="ppm500">PPM 500</SelectItem>
                    <SelectItem value="ppm700">PPM 700</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="water-ec">EC/PPM da Água de Entrada</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  id="water-ec"
                  min={0}
                  max={1.0}
                  step={0.1}
                  value={waterEC}
                  onChange={(e) => setWaterEC(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">mS/cm</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pot-size">Volume do Vaso/Sistema (L)</Label>
              <Input
                type="number"
                id="pot-size"
                min={1}
                max={100}
                step={1}
                value={potSize}
                onChange={(e) => setPotSize(parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="substrate-type">Tipo de Substrato</Label>
              <Select value={substrate} onValueChange={setSubstrate}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o substrato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo</SelectItem>
                  <SelectItem value="coco">Coco</SelectItem>
                  <SelectItem value="hidroponia">Hidroponia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="days-remaining">Dias Restantes até a Colheita</Label>
              <Input
                type="number"
                id="days-remaining"
                min={1}
                max={60}
                step={1}
                value={daysRemaining}
                onChange={(e) => setDaysRemaining(parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Resultados */}
          <div className="space-y-4">
            <div className="text-center">
              <h6 className="text-lg font-medium">Volume de Água por Flush</h6>
              <h2 ref={waterVolumeRef} className="text-3xl font-bold">0.0 L</h2>

              <h6 className="mt-3 text-lg font-medium">Número de Flushes</h6>
              <h2 ref={flushCountRef} className="text-3xl font-bold">0</h2>

              <h6 className="mt-3 text-lg font-medium">Volume Total</h6>
              <p ref={totalVolumeRef} className="text-lg">0.0 L</p>
            </div>

            <div ref={recommendationsRef} className="alert">
              <strong>Calculando...</strong>
            </div>

            <div>
              <h6 className="text-lg font-medium">Recomendações:</h6>
              <ul ref={actionListRef} className="list-disc pl-5 space-y-1"></ul>
            </div>
          </div>

          {/* Gráficos e Tabela */}
          <div className="space-y-4 md:col-span-2">
            <div className="h-64">
              <canvas ref={ecReductionChartRef}></canvas>
            </div>
            <div className="h-64">
              <canvas ref={flushEfficiencyChartRef}></canvas>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Dia</th>
                    <th className="p-2 text-left">EC Alvo</th>
                    <th className="p-2 text-left">Ação</th>
                </tr>
              </thead>
              <tbody ref={scheduleTableRef}></tbody>
            </table>
          </div>
          </div>
        </div>

        {/* Instruções Específicas */}
        <div className="mt-8">
          <h5 className="text-lg font-medium mb-4">
            Instruções Específicas para <span ref={substrateNameRef}>Solo</span>
          </h5>
          <ol ref={substrateInstructionsRef} className="list-decimal pl-5 space-y-2"></ol>
        </div>
      </CardContent>
    </Card>
  );
};

// Constantes para Nutrients Calculator
const NUTRIENT_DOSAGES = {
  mudas: {
    "Grow (Vegetativo)": { mlPerLiter: 1.0, ec: 0.2 },
    "Bloom (Floração)": { mlPerLiter: 0.5, ec: 0.1 },
    "Micro": { mlPerLiter: 0.5, ec: 0.1 },
    "CalMag": { mlPerLiter: 0.5, ec: 0.1 },
    "Silício": { mlPerLiter: 0.2, ec: 0.05 },
    "Enzimas": { mlPerLiter: 0.5, ec: 0.05 },
    "PK Booster": { mlPerLiter: 0, ec: 0 },
    "Estimulador de Raízes": { mlPerLiter: 0.5, ec: 0.05 },
    "Potenciador de Floração": { mlPerLiter: 0, ec: 0 }
  },
  vegetativo: {
    "Grow (Vegetativo)": { mlPerLiter: 2.0, ec: 0.4 },
    "Bloom (Floração)": { mlPerLiter: 0.5, ec: 0.1 },
    "Micro": { mlPerLiter: 1.0, ec: 0.2 },
    "CalMag": { mlPerLiter: 1.0, ec: 0.2 },
    "Silício": { mlPerLiter: 0.5, ec: 0.1 },
    "Enzimas": { mlPerLiter: 1.0, ec: 0.1 },
    "PK Booster": { mlPerLiter: 0, ec: 0 },
    "Estimulador de Raízes": { mlPerLiter: 0.5, ec: 0.05 },
    "Potenciador de Floração": { mlPerLiter: 0, ec: 0 }
  },
  preFloração: {
    "Grow (Vegetativo)": { mlPerLiter: 1.0, ec: 0.2 },
    "Bloom (Floração)": { mlPerLiter: 1.5, ec: 0.3 },
    "Micro": { mlPerLiter: 1.0, ec: 0.2 },
    "CalMag": { mlPerLiter: 1.0, ec: 0.2 },
    "Silício": { mlPerLiter: 0.5, ec: 0.1 },
    "Enzimas": { mlPerLiter: 1.0, ec: 0.1 },
    "PK Booster": { mlPerLiter: 0.5, ec: 0.1 },
    "Estimulador de Raízes": { mlPerLiter: 0, ec: 0 },
    "Potenciador de Floração": { mlPerLiter: 0.5, ec: 0.1 }
  },
  floração: {
    "Grow (Vegetativo)": { mlPerLiter: 0.5, ec: 0.1 },
    "Bloom (Floração)": { mlPerLiter: 2.0, ec: 0.4 },
    "Micro": { mlPerLiter: 1.0, ec: 0.2 },
    "CalMag": { mlPerLiter: 1.0, ec: 0.2 },
    "Silício": { mlPerLiter: 0.5, ec: 0.1 },
    "Enzimas": { mlPerLiter: 1.0, ec: 0.1 },
    "PK Booster": { mlPerLiter: 1.0, ec: 0.2 },
    "Estimulador de Raízes": { mlPerLiter: 0, ec: 0 },
    "Potenciador de Floração": { mlPerLiter: 1.0, ec: 0.2 }
  },
  flush: {
    "Grow (Vegetativo)": { mlPerLiter: 0, ec: 0 },
    "Bloom (Floração)": { mlPerLiter: 0, ec: 0 },
    "Micro": { mlPerLiter: 0, ec: 0 },
    "CalMag": { mlPerLiter: 0, ec: 0 },
    "Silício": { mlPerLiter: 0, ec: 0 },
    "Enzimas": { mlPerLiter: 0.5, ec: 0.05 },
    "PK Booster": { mlPerLiter: 0, ec: 0 },
    "Estimulador de Raízes": { mlPerLiter: 0, ec: 0 },
    "Potenciador de Floração": { mlPerLiter: 0, ec: 0 }
  }
};

const DEFICIENCY_SYMPTOMS = {
  nitrogen: {
    symptoms: "Folhas inferiores amarelando, crescimento lento",
    solutions: [
      "Aumentar a dose de Grow",
      "Verificar pH do substrato",
      "Adicionar nitrogênio orgânico se necessário"
    ]
  },
  phosphorus: {
    symptoms: "Folhas roxas/vermelhas, crescimento atrofiado",
    solutions: [
      "Aumentar a dose de Bloom",
      "Adicionar PK Booster",
      "Verificar temperatura do substrato"
    ]
  },
  potassium: {
    symptoms: "Bordas amareladas/marrons, folhas queimadas",
    solutions: [
      "Aumentar a dose de Bloom",
      "Adicionar PK Booster",
      "Verificar pH do substrato"
    ]
  },
  calcium: {
    symptoms: "Pontos marrons nas folhas, crescimento deformado",
    solutions: [
      "Adicionar CalMag",
      "Verificar pH do substrato",
      "Ajustar dureza da água"
    ]
  },
  magnesium: {
    symptoms: "Amarelamento entre nervuras, folhas retorcidas",
    solutions: [
      "Adicionar CalMag",
      "Verificar pH do substrato",
      "Ajustar dureza da água"
    ]
  }
};

// Funções auxiliares para Nutrients Calculator
const convertECPPM = (value: number, fromUnit: 'ec' | 'ppm500' | 'ppm700', toUnit: 'ec' | 'ppm500' | 'ppm700'): number => {
  if (fromUnit === toUnit) return value;
  
  const conversions = {
    'ec': { 'ppm500': 500, 'ppm700': 700 },
    'ppm500': { 'ec': 1/500, 'ppm700': 700/500 },
    'ppm700': { 'ec': 1/700, 'ppm500': 500/700 }
  } as const;
  
  return value * (conversions[fromUnit][toUnit] || 1);
};

const calculateNutrients = (
  phase: string,
  substrate: string,
  waterVolume: number,
  waterEC: number,
  waterHardness: string,
  selectedNutrients: Record<string, boolean>
) => {
  const dosages: Record<string, { mlPerLiter: number; mlTotal: number }> = {};
  let totalEC = waterEC;
  
  // Ajustar EC base na dureza da água
  const hardnessFactors = {
    soft: 1.2,
    medium: 1.0,
    hard: 0.8
  };
  
  const hardnessFactor = hardnessFactors[waterHardness as keyof typeof hardnessFactors] || 1.0;
  
  // Calcular dosagens para cada nutriente selecionado
  Object.entries(selectedNutrients).forEach(([nutrient, isSelected]) => {
    if (isSelected && NUTRIENT_DOSAGES[phase as keyof typeof NUTRIENT_DOSAGES][nutrient]) {
      const dosage = NUTRIENT_DOSAGES[phase as keyof typeof NUTRIENT_DOSAGES][nutrient];
      const adjustedMlPerLiter = dosage.mlPerLiter * hardnessFactor;
      
      dosages[nutrient] = {
        mlPerLiter: adjustedMlPerLiter,
        mlTotal: adjustedMlPerLiter * waterVolume
      };
      
      totalEC += dosage.ec * hardnessFactor;
    }
  });
  
  // Ajustar EC final baseado no substrato
  const substrateFactors = {
    solo: 0.8,
    coco: 1.0,
    hidroponia: 1.2
  };
  
  const substrateFactor = substrateFactors[substrate as keyof typeof substrateFactors] || 1.0;
  totalEC *= substrateFactor;
  
  return {
    dosages,
    targetEC: getTargetEC(phase),
    resultEC: totalEC
  };
};

const getTargetEC = (phase: string): number => {
  const targetECs = {
    mudas: 0.8,
    vegetativo: 1.5,
    preFloração: 1.8,
    floração: 2.2,
    flush: 0.4
  };
  
  return targetECs[phase as keyof typeof targetECs] || 1.5;
};

const checkIncompatibilities = (selectedNutrients: Record<string, boolean>): string[] => {
  const incompatibilities = [];
  
  if (selectedNutrients["PK Booster"] && selectedNutrients["Grow (Vegetativo)"]) {
    incompatibilities.push("PK Booster não deve ser usado durante o vegetativo");
  }
  
  if (selectedNutrients["Potenciador de Floração"] && selectedNutrients["Grow (Vegetativo)"]) {
    incompatibilities.push("Potenciador de Floração não deve ser usado durante o vegetativo");
  }
  
  if (selectedNutrients["Estimulador de Raízes"] && selectedNutrients["Bloom (Floração)"]) {
    incompatibilities.push("Estimulador de Raízes não deve ser usado durante a floração");
  }
  
  return incompatibilities;
};

const generateFeedingSchedule = (phase: string, dosages: Record<string, { mlPerLiter: number; mlTotal: number }>) => {
  const weeklyFactors = {
    mudas: { week1: 0.5, week2: 0.7, week3: 0.9, week4: 1.0 },
    vegetativo: { week1: 0.7, week2: 0.8, week3: 0.9, week4: 1.0 },
    preFloração: { week1: 0.8, week2: 0.9, week3: 1.0, week4: 1.0 },
    floração: { week1: 0.9, week2: 1.0, week3: 1.0, week4: 0.9 },
    flush: { week1: 0, week2: 0, week3: 0, week4: 0 }
  };
  
  return weeklyFactors[phase as keyof typeof weeklyFactors] || weeklyFactors.vegetativo;
};

const generateNutrientLevelsData = (dosages: Record<string, { mlPerLiter: number; mlTotal: number }>, phase: string) => {
  const baseLevels = {
    mudas: [2, 1, 1, 1, 1, 1],
    vegetativo: [3, 1, 2, 2, 1, 1],
    preFloração: [2, 2, 3, 2, 1, 1],
    floração: [1, 3, 4, 2, 1, 1],
    flush: [0, 0, 0, 0, 0, 0]
  };
  
  const currentLevels = baseLevels[phase as keyof typeof baseLevels] || baseLevels.vegetativo;
  
  return {
    labels: ['Nitrogênio (N)', 'Fósforo (P)', 'Potássio (K)', 'Cálcio (Ca)', 'Magnésio (Mg)', 'Micronutrientes'],
    datasets: [
      {
        label: 'Nível Atual',
        data: currentLevels,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Nível Ideal',
        data: baseLevels.vegetativo,
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }
    ]
  };
};

const identifyDeficiencies = (symptoms: string[]): Array<{ nutrient: string; symptoms: string; solutions: string[] }> => {
  const deficiencies = [];
  
  if (symptoms.includes("Folhas inferiores amarelando")) {
    deficiencies.push({
      nutrient: "nitrogen",
      ...DEFICIENCY_SYMPTOMS.nitrogen
    });
  }
  
  if (symptoms.includes("Folhas roxas/vermelhas")) {
    deficiencies.push({
      nutrient: "phosphorus",
      ...DEFICIENCY_SYMPTOMS.phosphorus
    });
  }
  
  if (symptoms.includes("Bordas amareladas/marrons")) {
    deficiencies.push({
      nutrient: "potassium",
      ...DEFICIENCY_SYMPTOMS.potassium
    });
  }
  
  if (symptoms.includes("Pontos marrons nas folhas")) {
    deficiencies.push({
      nutrient: "calcium",
      ...DEFICIENCY_SYMPTOMS.calcium
    });
  }
  
  if (symptoms.includes("Amarelamento entre nervuras")) {
    deficiencies.push({
      nutrient: "magnesium",
      ...DEFICIENCY_SYMPTOMS.magnesium
    });
  }
  
  return deficiencies;
};

const NutrientsCalculator = () => {
  const [growthPhase, setGrowthPhase] = useState<string>("vegetativo");
  const [substrate, setSubstrate] = useState<string>("solo");
  const [waterVolume, setWaterVolume] = useState<number>(20);
  const [waterEC, setWaterEC] = useState<number>(0.2);
  const [ecUnit, setEcUnit] = useState<string>("ec");
  const [waterHardness, setWaterHardness] = useState<string>("medium");
  const [selectedNutrients, setSelectedNutrients] = useState<Record<string, boolean>>({
    "Grow (Vegetativo)": true,
    "Bloom (Floração)": true,
    "Micro": true,
    "CalMag": false,
    "Silício": false,
    "Enzimas": false,
    "PK Booster": false,
    "Estimulador de Raízes": false,
    "Potenciador de Floração": false
  });
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [showDeficiencies, setShowDeficiencies] = useState<boolean>(false);

  const targetECRef = useRef<HTMLSpanElement>(null);
  const targetPPMRef = useRef<HTMLSpanElement>(null);
  const resultECRef = useRef<HTMLSpanElement>(null);
  const nutrientTableRef = useRef<HTMLTableSectionElement>(null);
  const incompatibilityListRef = useRef<HTMLDivElement>(null);
  const incompatibilityItemsRef = useRef<HTMLUListElement>(null);
  const scheduleTableRef = useRef<HTMLTableSectionElement>(null);
  const deficiencyListRef = useRef<HTMLDivElement>(null);
  const nutrientLevelsChartRef = useRef<HTMLCanvasElement>(null);
  const nutrientLevelsChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (showResults) {
      const result = calculateNutrients(
        growthPhase,
        substrate,
        waterVolume,
        waterEC,
        waterHardness,
        selectedNutrients
      );
      
      const incompatibilities = checkIncompatibilities(selectedNutrients);
      const schedule = generateFeedingSchedule(growthPhase, result.dosages);
      const nutrientLevelsData = generateNutrientLevelsData(result.dosages, growthPhase);
      
      // Atualizar DOM
      if (targetECRef.current) {
        targetECRef.current.textContent = result.targetEC.toFixed(2);
      }
      if (targetPPMRef.current) {
        targetPPMRef.current.textContent = Math.round(result.targetEC * 500).toString();
      }
      if (resultECRef.current) {
        resultECRef.current.textContent = result.resultEC.toFixed(2);
      }
      
      if (nutrientTableRef.current) {
        nutrientTableRef.current.innerHTML = Object.entries(result.dosages)
          .map(([nutrient, info]) => `
            <tr>
              <td>${nutrient}</td>
              <td>${info.mlPerLiter.toFixed(1)} ml/L</td>
              <td>${info.mlTotal.toFixed(1)} ml</td>
            </tr>
          `)
          .join('');
      }
      
      if (incompatibilityListRef.current) {
        incompatibilityListRef.current.innerHTML = incompatibilities
          .map(incompatibility => `<li>${incompatibility}</li>`)
          .join('');
      }
      
      if (scheduleTableRef.current) {
        scheduleTableRef.current.innerHTML = Object.entries(schedule)
          .map(([week, factor]) => `
            <tr>
              <td>Semana ${week.replace('week', '')}</td>
              <td>${(factor * 100).toFixed(0)}%</td>
              <td>${(result.targetEC * factor).toFixed(2)} mS/cm</td>
            </tr>
          `)
          .join('');
      }
      
      // Atualizar gráfico
      if (nutrientLevelsChartInstance.current) {
        nutrientLevelsChartInstance.current.destroy();
      }
      
      if (nutrientLevelsChartRef.current) {
        nutrientLevelsChartInstance.current = new Chart(nutrientLevelsChartRef.current, {
          type: 'radar',
          data: nutrientLevelsData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                min: 0,
                max: 5,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });
      }
    }
    
    return () => {
      if (nutrientLevelsChartInstance.current) {
        nutrientLevelsChartInstance.current.destroy();
      }
    };
  }, [showResults, growthPhase, substrate, waterVolume, waterEC, waterHardness, selectedNutrients]);

  const handleNutrientChange = (nutrient: string, checked: boolean) => {
    setSelectedNutrients(prev => ({
      ...prev,
      [nutrient]: checked
    }));
  };

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setSelectedSymptoms(prev => 
      checked ? [...prev, symptom] : prev.filter(s => s !== symptom)
    );
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleIdentifyDeficiencies = () => {
    if (selectedSymptoms.length === 0) {
      alert('Por favor, selecione pelo menos um sintoma.');
      return;
    }
    
    const deficiencies = identifyDeficiencies(selectedSymptoms);
    
    if (deficiencyListRef.current) {
      deficiencyListRef.current.innerHTML = deficiencies.length === 0
        ? '<p>Nenhuma deficiência específica identificada com base nos sintomas selecionados.</p>'
        : deficiencies
            .map(deficiency => `
              <div class="mb-3">
                <h6>Deficiência de ${deficiency.nutrient.charAt(0).toUpperCase() + deficiency.nutrient.slice(1)}</h6>
                <p class="small mb-1">Sintomas: ${deficiency.symptoms}</p>
                <ul class="small">
                  ${deficiency.solutions.map(solution => `<li>${solution}</li>`).join('')}
                </ul>
              </div>
            `)
            .join('');
    }
    
    setShowDeficiencies(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" />
          Calculadora de Nutrientes
        </CardTitle>
        <CardDescription>
          Calcule as dosagens de nutrientes para cada fase do cultivo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Parâmetros */}
          <div className="space-y-4 md:col-span-2">
            <div className="space-y-2">
              <Label htmlFor="growth-phase">Fase de Crescimento</Label>
              <Select value={growthPhase} onValueChange={setGrowthPhase}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a fase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mudas">Mudas/Clones</SelectItem>
                  <SelectItem value="vegetativo">Vegetativo</SelectItem>
                  <SelectItem value="preFloração">Pré-Floração</SelectItem>
                  <SelectItem value="floração">Floração</SelectItem>
                  <SelectItem value="flush">Flush</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="substrate-type">Tipo de Substrato</Label>
              <Select value={substrate} onValueChange={setSubstrate}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o substrato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo</SelectItem>
                  <SelectItem value="coco">Coco</SelectItem>
                  <SelectItem value="hidroponia">Hidroponia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="water-volume">Volume do Reservatório (L)</Label>
              <Input
                type="number"
                id="water-volume"
                min={1}
                max={1000}
                step={1}
                value={waterVolume}
                onChange={(e) => setWaterVolume(parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="water-ec">EC/PPM da Água Base</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  id="water-ec"
                  min={0}
                  max={3}
                  step={0.1}
                  value={waterEC}
                  onChange={(e) => setWaterEC(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">mS/cm</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="water-hardness">Dureza da Água</Label>
              <Select value={waterHardness} onValueChange={setWaterHardness}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a dureza" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soft">Mole (menos que 100 ppm)</SelectItem>
                  <SelectItem value="medium">Média (100-200 ppm)</SelectItem>
                  <SelectItem value="hard">Dura (mais que 200 ppm)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nutrientes Disponíveis</Label>
              <div className="space-y-2 md:col-span-2">
                {Object.entries(selectedNutrients).map(([nutrient, checked]) => (
                  <div key={nutrient} className="flex items-center space-x-2">
                    <Checkbox
                      id={`nutrient-${nutrient}`}
                      checked={checked}
                      onCheckedChange={(checked) => handleNutrientChange(nutrient, checked as boolean)}
                    />
                    <Label htmlFor={`nutrient-${nutrient}`}>{nutrient}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full" onClick={handleCalculate}>
              Calcular Nutrientes
            </Button>
          </div>

          {/* Resultados */}
          <div className="space-y-4 md:col-span-2">
            {showResults && (
              <>
                <div className="alert alert-info">
                  <strong>EC Alvo:</strong>{' '}
                  <span ref={targetECRef}>0.0</span> mS/cm{' '}
                  (<span ref={targetPPMRef}>0</span> ppm) |{' '}
                  <strong>EC Resultante:</strong>{' '}
                  <span ref={resultECRef}>0.0</span> mS/cm
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">Nutriente</th>
                        <th className="p-2 text-left">ml por Litro</th>
                        <th className="p-2 text-left">Quantidade Total</th>
                      </tr>
                    </thead>
                    <tbody ref={nutrientTableRef}></tbody>
                  </table>
                </div>

                <div ref={incompatibilityListRef} className="alert alert-warning" style={{ display: 'none' }}>
                  <strong>Atenção! Incompatibilidades detectadas:</strong>
                  <ul ref={incompatibilityItemsRef}></ul>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">Semana</th>
                        <th className="p-2 text-left">% da Dose</th>
                        <th className="p-2 text-left">EC Alvo</th>
                      </tr>
                    </thead>
                    <tbody ref={scheduleTableRef}></tbody>
                  </table>
                </div>
              </>
            )}

            {!showResults && (
              <div className="text-center py-4">
                <p className="text-muted">
                  Clique em "Calcular Nutrientes" para gerar a tabela de dosagem.
                </p>
              </div>
            )}
          </div>

          {/* Gráficos e Deficiências */}
          <div className="space-y-4 md:col-span-2">
            <div className="h-64">
              <canvas ref={nutrientLevelsChartRef}></canvas>
            </div>

            <div className="mt-4">
              <h6>Medição e Monitoramento</h6>
              <p>
                A condutividade elétrica (EC) é uma medida da concentração total de sais
                dissolvidos na solução nutritiva. Diferentes fases de crescimento e substratos
                requerem diferentes níveis de EC:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Mudas/Clones:</strong> EC baixa (0.4-1.2 mS/cm)</li>
                <li><strong>Vegetativo:</strong> EC média (0.8-2.2 mS/cm)</li>
                <li><strong>Floração:</strong> EC mais alta (1.2-2.6 mS/cm)</li>
                <li><strong>Flush:</strong> EC muito baixa (0-0.4 mS/cm)</li>
              </ul>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Nota: Esta calculadora fornece recomendações gerais. Ajuste as dosagens com base
              na resposta específica das suas plantas e nas recomendações do fabricante dos
              nutrientes.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Constantes para Deficiency Identifier
const DEFICIENCY_TYPES = {
  nitrogen: {
    name: "Nitrogênio (N)",
    symptoms: [
      "Folhas inferiores amarelando uniformemente",
      "Crescimento lento e atrofiado",
      "Folhas velhas caem prematuramente",
      "Hastes fracas e finas"
    ],
    solutions: [
      "Aumentar a dose de Grow",
      "Verificar pH do substrato (ideal: 6.0-7.0)",
      "Adicionar nitrogênio orgânico se necessário",
      "Verificar drenagem do substrato"
    ],
    image: "nitrogen-deficiency.jpg"
  },
  phosphorus: {
    name: "Fósforo (P)",
    symptoms: [
      "Folhas roxas/vermelhas nas bordas",
      "Crescimento atrofiado",
      "Folhas pequenas e escuras",
      "Raízes subdesenvolvidas"
    ],
    solutions: [
      "Aumentar a dose de Bloom",
      "Adicionar PK Booster",
      "Verificar temperatura do substrato",
      "Ajustar pH para 6.0-7.0"
    ],
    image: "phosphorus-deficiency.jpg"
  },
  potassium: {
    name: "Potássio (K)",
    symptoms: [
      "Bordas amareladas/marrons nas folhas",
      "Folhas queimadas nas pontas",
      "Crescimento lento",
      "Flores pequenas"
    ],
    solutions: [
      "Aumentar a dose de Bloom",
      "Adicionar PK Booster",
      "Verificar pH do substrato",
      "Evitar excesso de cálcio"
    ],
    image: "potassium-deficiency.jpg"
  },
  calcium: {
    name: "Cálcio (Ca)",
    symptoms: [
      "Pontos marrons nas folhas novas",
      "Crescimento deformado",
      "Folhas retorcidas",
      "Manchas necróticas"
    ],
    solutions: [
      "Adicionar CalMag",
      "Verificar pH do substrato",
      "Ajustar dureza da água",
      "Evitar excesso de potássio"
    ],
    image: "calcium-deficiency.jpg"
  },
  magnesium: {
    name: "Magnésio (Mg)",
    symptoms: [
      "Amarelamento entre nervuras",
      "Folhas retorcidas",
      "Manchas amarelas irregulares",
      "Folhas velhas afetadas primeiro"
    ],
    solutions: [
      "Adicionar CalMag",
      "Verificar pH do substrato",
      "Ajustar dureza da água",
      "Evitar excesso de cálcio"
    ],
    image: "magnesium-deficiency.jpg"
  },
  iron: {
    name: "Ferro (Fe)",
    symptoms: [
      "Amarelamento entre nervuras nas folhas novas",
      "Nervuras permanecem verdes",
      "Crescimento atrofiado",
      "Folhas pálidas"
    ],
    solutions: [
      "Adicionar quelato de ferro",
      "Verificar pH do substrato (ideal: 6.0-6.5)",
      "Evitar excesso de fósforo",
      "Verificar temperatura do substrato"
    ],
    image: "iron-deficiency.jpg"
  },
  zinc: {
    name: "Zinco (Zn)",
    symptoms: [
      "Folhas pequenas e estreitas",
      "Internódios curtos",
      "Manchas amarelas entre nervuras",
      "Crescimento atrofiado"
    ],
    solutions: [
      "Adicionar micronutrientes",
      "Verificar pH do substrato",
      "Evitar excesso de fósforo",
      "Ajustar temperatura do ambiente"
    ],
    image: "zinc-deficiency.jpg"
  }
};

// Funções auxiliares para Deficiency Identifier
const calculateDeficiencyProbability = (
  selectedSymptoms: string[],
  deficiencyType: keyof typeof DEFICIENCY_TYPES
): number => {
  const deficiency = DEFICIENCY_TYPES[deficiencyType];
  const matchingSymptoms = deficiency.symptoms.filter(symptom =>
    selectedSymptoms.some(selected => selected.toLowerCase().includes(symptom.toLowerCase()))
  );
  return (matchingSymptoms.length / deficiency.symptoms.length) * 100;
};

const generateDeficiencyChartData = (probabilities: Record<string, number>) => {
  return {
    labels: Object.keys(probabilities).map(key => DEFICIENCY_TYPES[key as keyof typeof DEFICIENCY_TYPES].name),
    datasets: [{
      label: 'Probabilidade de Deficiência',
      data: Object.values(probabilities),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };
};

const generateRecommendationSchedule = (deficiencies: Array<{ type: string; probability: number }>) => {
  const schedule = [];
  const today = new Date();
  
  deficiencies.forEach(({ type, probability }) => {
    if (probability > 50) {
      const deficiency = DEFICIENCY_TYPES[type as keyof typeof DEFICIENCY_TYPES];
      const solutions = deficiency.solutions;
      
      solutions.forEach((solution, index) => {
        const date = new Date(today);
        date.setDate(date.getDate() + index * 2); // Espaçar as ações em 2 dias
        
        schedule.push({
          date: date.toLocaleDateString(),
          action: solution,
          deficiency: deficiency.name
        });
      });
    }
  });
  
  return schedule;
};

const DeficiencyIdentifier = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [deficiencyProbabilities, setDeficiencyProbabilities] = useState<Record<string, number>>({});
  const [recommendationSchedule, setRecommendationSchedule] = useState<Array<{date: string; deficiency: string; action: string}>>([]);
  const [sortedDeficiencies, setSortedDeficiencies] = useState<Array<{type: string; probability: number}>>([]);

  const probabilityChartRef = useRef<HTMLCanvasElement>(null);
  const scheduleTableRef = useRef<HTMLTableSectionElement>(null);
  const probabilityChartInstance = useRef<Chart | null>(null);

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setSelectedSymptoms(prev =>
      checked ? [...prev, symptom] : prev.filter(s => s !== symptom)
    );
  };

  const handleIdentify = () => {
    if (selectedSymptoms.length === 0) {
      alert('Por favor, selecione pelo menos um sintoma.');
      return;
    }
    
    // Calcular probabilidades para todas as deficiências
    const probabilities = Object.keys(DEFICIENCY_TYPES).reduce((acc, type) => ({
      ...acc,
      [type]: calculateDeficiencyProbability(selectedSymptoms, type as keyof typeof DEFICIENCY_TYPES)
    }), {} as Record<string, number>);
    
    setDeficiencyProbabilities(probabilities);
    
    // Ordenar deficiências por probabilidade
    const sorted = Object.entries(probabilities)
      .filter(([, prob]) => prob > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([type, probability]) => ({ type, probability }));
    
    setSortedDeficiencies(sorted);
    
    // Gerar cronograma de recomendações
    const schedule = generateRecommendationSchedule(sorted);
    setRecommendationSchedule(schedule);
    
    setShowResults(true);
  };

  // Efeito para atualizar o gráfico quando as probabilidades mudarem
  useEffect(() => {
    if (showResults && probabilityChartRef.current) {
      // Destruir gráfico existente
      if (probabilityChartInstance.current) {
        probabilityChartInstance.current.destroy();
      }

      // Criar novo gráfico
      probabilityChartInstance.current = new Chart(probabilityChartRef.current, {
        type: 'bar',
        data: {
          labels: Object.entries(deficiencyProbabilities)
            .filter(([, prob]) => prob > 0)
            .map(([type]) => DEFICIENCY_TYPES[type as keyof typeof DEFICIENCY_TYPES].name),
          datasets: [{
            label: 'Probabilidade de Deficiência',
            data: Object.entries(deficiencyProbabilities)
              .filter(([, prob]) => prob > 0)
              .map(([, prob]) => prob),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Probabilidade (%)'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }

    return () => {
      if (probabilityChartInstance.current) {
        probabilityChartInstance.current.destroy();
      }
    };
  }, [showResults, deficiencyProbabilities]);

  // Efeito para atualizar a tabela de recomendações
  useEffect(() => {
    if (showResults && scheduleTableRef.current) {
      scheduleTableRef.current.innerHTML = recommendationSchedule
        .map(item => `
          <tr>
            <td>${item.date}</td>
            <td>${item.deficiency}</td>
            <td>${item.action}</td>
          </tr>
        `)
        .join('');
    }
  }, [showResults, recommendationSchedule]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Identificador de Deficiências
        </CardTitle>
        <CardDescription>
          Identifique deficiências nutricionais com base nos sintomas observados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Sobre Nutrição de Cannabis */}
        <div className="mb-8">
          <h5 className="text-lg font-medium mb-4">Sobre Nutrição de Cannabis</h5>
          <p className="mb-4">
            A nutrição adequada é fundamental para o cultivo bem-sucedido de cannabis. 
            Cada fase de crescimento requer diferentes proporções de nutrientes:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h6 className="font-medium mb-2">Macronutrientes (NPK)</h6>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Nitrogênio (N):</strong> Essencial para o crescimento vegetativo, 
                  desenvolvimento de folhas e estrutura da planta.
                </li>
                <li>
                  <strong>Fósforo (P):</strong> Crucial para o desenvolvimento de raízes, 
                  floração e produção de resina.
                </li>
                <li>
                  <strong>Potássio (K):</strong> Importante para a saúde geral da planta, 
                  resistência a doenças e desenvolvimento de botões.
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-medium mb-2">Nutrientes Secundários e Micronutrientes</h6>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Cálcio (Ca) e Magnésio (Mg):</strong> Essenciais para a estrutura 
                  celular e fotossíntese.
                </li>
                <li>
                  <strong>Enxofre (S):</strong> Componente de aminoácidos e proteínas.
                </li>
                <li>
                  <strong>Micronutrientes (Fe, Zn, Mn, B, etc.):</strong> Necessários em 
                  pequenas quantidades para funções enzimáticas e metabólicas.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Seleção de Sintomas */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sintomas Observados</Label>
              <div className="space-y-2 max-h-[400px] overflow-y-auto p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symptom-yellow-lower"
                      checked={selectedSymptoms.includes("Folhas inferiores amarelando")}
                      onCheckedChange={(checked) => handleSymptomChange("Folhas inferiores amarelando", checked as boolean)}
                    />
                    <Label htmlFor="symptom-yellow-lower">Folhas inferiores amarelando</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symptom-purple"
                      checked={selectedSymptoms.includes("Folhas roxas/vermelhas")}
                      onCheckedChange={(checked) => handleSymptomChange("Folhas roxas/vermelhas", checked as boolean)}
                    />
                    <Label htmlFor="symptom-purple">Folhas roxas/vermelhas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symptom-edges"
                      checked={selectedSymptoms.includes("Bordas amareladas/marrons")}
                      onCheckedChange={(checked) => handleSymptomChange("Bordas amareladas/marrons", checked as boolean)}
                    />
                    <Label htmlFor="symptom-edges">Bordas amareladas/marrons</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symptom-brown-spots"
                      checked={selectedSymptoms.includes("Pontos marrons nas folhas")}
                      onCheckedChange={(checked) => handleSymptomChange("Pontos marrons nas folhas", checked as boolean)}
                    />
                    <Label htmlFor="symptom-brown-spots">Pontos marrons nas folhas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symptom-veins"
                      checked={selectedSymptoms.includes("Amarelamento entre nervuras")}
                      onCheckedChange={(checked) => handleSymptomChange("Amarelamento entre nervuras", checked as boolean)}
                    />
                    <Label htmlFor="symptom-veins">Amarelamento entre nervuras</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="symptom-twisted"
                      checked={selectedSymptoms.includes("Folhas retorcidas")}
                      onCheckedChange={(checked) => handleSymptomChange("Folhas retorcidas", checked as boolean)}
                    />
                    <Label htmlFor="symptom-twisted">Folhas retorcidas</Label>
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={handleIdentify}>
              Identificar Deficiências
            </Button>
          </div>

          {/* Resultados */}
          <div className="space-y-4 md:col-span-2">
            {showResults && (
              <>
                <div className="h-64">
                  <canvas ref={probabilityChartRef}></canvas>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left">Data</th>
                        <th className="p-2 text-left">Deficiência</th>
                        <th className="p-2 text-left">Ação Recomendada</th>
                      </tr>
                    </thead>
                    <tbody ref={scheduleTableRef}></tbody>
                  </table>
                </div>
              </>
            )}

            {!showResults && (
              <div className="text-center space-y-4 md:col-span-2">
                <p className="text-muted">
                  Selecione os sintomas observados e clique em "Identificar Deficiências"
                  para gerar a análise.
                </p>
              </div>
            )}
          </div>

          {/* Informações Detalhadas */}
          <div className="space-y-4 md:col-span-2">
            <div className="card">
              <div className="card-header">
                <h5>Guia de Deficiências</h5>
              </div>
              <div className="card-body">
                <div className="space-y-4 md:col-span-2">
                  {Object.entries(DEFICIENCY_TYPES).map(([type, info]) => (
                    <div key={type} className="space-y-2">
                      <h6 className="font-medium">{info.name}</h6>
                      <div className="text-sm">
                        <p className="font-medium mb-1">Sintomas Comuns:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {info.symptoms.map(symptom => (
                            <li key={symptom}>{symptom}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-8">
          <h5 className="text-lg font-medium mb-4">Sobre Deficiências Nutricionais</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h6>Fatores que Influenciam Deficiências</h6>
              <ul className="list-disc pl-5 space-y-1">
                <li>pH do substrato fora do intervalo ideal</li>
                <li>Desequilíbrio entre nutrientes</li>
                <li>Temperatura do ambiente e do substrato</li>
                <li>Qualidade e dureza da água</li>
                <li>Drenagem e aeração do substrato</li>
              </ul>
            </div>
            <div>
              <h6>Prevenção de Deficiências</h6>
              <ul className="list-disc pl-5 space-y-1">
                <li>Monitore regularmente o pH e EC do substrato</li>
                <li>Mantenha um programa de nutrição consistente</li>
                <li>Use água de qualidade e pH ajustado</li>
                <li>Observe as plantas diariamente para sinais precoces</li>
                <li>Mantenha registros de nutrição e sintomas</li>
              </ul>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Nota: Este identificador fornece uma análise baseada nos sintomas observados.
            Considere outros fatores ambientais e de cultivo ao diagnosticar problemas.
            Em caso de dúvida, consulte um especialista.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// Atualizar o componente Calculadoras
const Calculadoras = () => {
  const [activeCalculator, setActiveCalculator] = useState<string>("vpd");

  const calculators = [
    { id: "vpd", name: "VPD", icon: <Thermometer className="h-4 w-4" /> },
    { id: "dli", name: "DLI", icon: <Sun className="h-4 w-4" /> },
    { id: "nutrients", name: "Nutrientes", icon: <Activity className="h-4 w-4" /> },
    { id: "dew-point", name: "Ponto de Orvalho", icon: <Droplets className="h-4 w-4" /> },
    { id: "ec-flush", name: "EC Flush", icon: <Droplet className="h-4 w-4" /> },
    { id: "deficiency", name: "Deficiências", icon: <Activity className="h-4 w-4" /> },
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 gap-2 mb-8">
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
          ) : activeCalculator === "dli" ? (
            <DLICalculator />
          ) : activeCalculator === "dew-point" ? (
            <DewPointCalculator />
          ) : activeCalculator === "ec-flush" ? (
            <ECFlushCalculator />
          ) : activeCalculator === "nutrients" ? (
            <NutrientsCalculator />
          ) : activeCalculator === "deficiency" ? (
            <DeficiencyIdentifier />
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