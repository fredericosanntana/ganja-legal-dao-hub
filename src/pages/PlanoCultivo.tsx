import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Leaf } from 'lucide-react';
import { jsPDF } from 'jspdf';

const fertilizantesData = {
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
  preFloracao: {
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
  floracao: {
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

const PlanoCultivo = () => {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    endereco: '',
    quantidadePlantas: '',
    finalidadeUso: 'Medicinal',
    espacoCultivo: '',
    cicloVegetativo: '',
    cicloFlora: '',
    tipoAmbiente: 'indoor',
    tipoFertilizante: '', 
    previsaoColheita: '', 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm(prevState => ({ ...prevState, [name]: value }));
  };

  const formatCPF = (value: string) => {
    let cpf = value.replace(/\D/g, '').slice(0, 11);
    if (cpf.length > 9) {
      cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (cpf.length > 6) {
      cpf = cpf.replace(/^(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (cpf.length > 3) {
      cpf = cpf.replace(/^(\d{3})(\d{1,3})/, '$1.$2');
    }
    return cpf;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    setForm(prevState => ({ ...prevState, cpf: formattedCPF }));
  };

  const generateText = (formData: typeof form) => {
    let textContent = `Eu, ${formData.nome || '[Nome Completo]'}, inscrito(a) no CPF ${formData.cpf || '[CPF]'}, residente em ${formData.endereco || '[Endereço Completo]'}, venho por meio desta formalizar meu Plano de Cultivo de Cannabis para fins medicinais, conforme prescrição médica, em pleno exercício do meu direito constitucional à saúde, à vida digna e à liberdade individual.\n\n`;

    textContent += "Detalhamento Técnico do Cultivo\n";
    textContent += `O cultivo será realizado em ambiente ${formData.tipoAmbiente || '[indoor/outdoor]'}, utilizando um espaço de aproximadamente ${formData.espacoCultivo || '[Espaço em m²]'} m², equipado com controle de iluminação (fotoperíodo), ventilação adequada e monitoramento da temperatura e umidade, garantindo as condições ideais para o desenvolvimento saudável das plantas.\n`;
    textContent += `Tipo de Fertilizante Utilizado: ${formData.tipoFertilizante || '[Não informado]'}\n`;
    textContent += `Previsão de Colheita: ${formData.previsaoColheita || '[Não informado]'} gramas\n\n`;

    textContent += `Durante o ciclo vegetativo, estimado em ${formData.cicloVegetativo || '[Ciclo Vegetativo em dias]'} dias, as plantas receberão luz artificial ou natural adequada (aproximadamente 18 horas diárias de luz para maximizar o crescimento), irrigação regular e nutrição balanceada, conforme as melhores práticas recomendadas por especialistas.\n\n`;
    textContent += `Na fase de floração, prevista para durar ${formData.cicloFlora || '[Ciclo de Floração em dias]'} dias, o fotoperíodo será ajustado para 12 horas de luz e 12 horas de escuro, incentivando a produção dos compostos terapêuticos desejados. Todo o processo será realizado com substratos e insumos de procedência conhecida, livres de agrotóxicos, visando a máxima segurança e eficácia medicinal.\n\n`;
    
    textContent += "Cronograma de Fertilizantes:\n";
    for (const fase in fertilizantesData) {
      textContent += `  Fase: ${fase.charAt(0).toUpperCase() + fase.slice(1)}\n`;
      const fertilizantesDaFase = fertilizantesData[fase as keyof typeof fertilizantesData];
      for (const fertilizante in fertilizantesDaFase) {
        const dados = fertilizantesDaFase[fertilizante as keyof typeof fertilizantesDaFase];
        if (dados.mlPerLiter > 0 || dados.ec > 0 || fertilizante === "Enzimas" && fase === "flush") { // Mostrar apenas se houver dosagem ou for enzima no flush
            textContent += `    - ${fertilizante}: ${dados.mlPerLiter} ml/L (EC: ${dados.ec})\n`;
        }
      }
      textContent += "\n";
    }

    textContent += "3. Compromisso e Responsabilidade\n";
    textContent += "Declaro que todas as informações acima são verdadeiras e de minha inteira responsabilidade, sendo este cultivo destinado exclusivamente ao meu tratamento de saúde, conforme orientação médica.\n\n";
    textContent += "Estou ciente das limitações legais e comprometo-me a não compartilhar, distribuir ou comercializar qualquer parte das plantas ou seus derivados, mantendo o cultivo restrito ao ambiente informado acima e exclusivamente para fins terapêuticos.\n\n";

    textContent += ".Informações do Cultivo\n";
    textContent += `Quantidade de Plantas: ${formData.quantidadePlantas || '[Quantidade de Plantas]'}\n`;
    textContent += `Finalidade de Uso: ${formData.finalidadeUso}, conforme laudo e recomendação médica.\n`;
    textContent += `Espaço destinado ao cultivo: ${formData.espacoCultivo || '[Espaço em m²]'} m², ambiente controlado, dedicado exclusivamente ao cultivo para consumo próprio, sem qualquer intuito de comercialização.\n`;
    textContent += `Ciclo Vegetativo: ${formData.cicloVegetativo || '[Ciclo Vegetativo em dias]'}\n`;
    textContent += `Ciclo de Floração: ${formData.cicloFlora || '[Ciclo de Floração em dias]'}\n\n`;

    textContent += "Coloco-me à disposição das autoridades competentes para quaisquer esclarecimentos, reforçando minha disposição em colaborar com a fiscalização e demonstrar a boa-fé de minha conduta\n\n";
    
    const currentDate = new Date().toLocaleDateString('pt-BR');
    textContent += `Data: ${currentDate}\n`;
    textContent += `Assinatura: ${formData.nome || '[Nome Completo]'}\n`;

    return textContent;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const doc = new jsPDF();
    const text = generateText(form);
    
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(text, 180);
    let y = 20;
    const lineHeight = 7;

    lines.forEach((line: string) => {
      if (y + lineHeight > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 10, y);
      y += lineHeight;
    });

    doc.save('plano-cultivo-atualizado.pdf');
    
    toast({
      title: "Documento gerado",
      description: "Seu Plano de Cultivo atualizado foi gerado com sucesso!",
    });
    console.log('Form submitted:', form);
  };

  const handleReset = () => {
    setForm({
      nome: '',
      cpf: '',
      endereco: '',
      quantidadePlantas: '',
      finalidadeUso: 'Medicinal',
      espacoCultivo: '',
      cicloVegetativo: '',
      cicloFlora: '',
      tipoAmbiente: 'indoor',
      tipoFertilizante: '',
      previsaoColheita: '',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold">Plano de Cultivo</h1>
          <p className="text-lg text-muted-foreground mt-2">Documento que detalha o planejamento do seu cultivo de cannabis medicinal</p>
        </div>

        <Card className="w-full max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-activist-600" />
                Formulário do Plano de Cultivo
              </CardTitle>
              <CardDescription>
                Preencha todos os campos para gerar seu documento personalizado
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">Dados Pessoais</h3>
                  <Separator className="flex-1 ml-3" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input id="nome" name="nome" value={form.nome} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" name="cpf" value={form.cpf} onChange={handleCPFChange} placeholder="000.000.000-00" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço Completo</Label>
                  <Input id="endereco" name="endereco" value={form.endereco} onChange={handleChange} required />
                </div>
              </div>
              
              {/* Informações do Cultivo */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">Informações do Cultivo</h3>
                  <Separator className="flex-1 ml-3" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantidadePlantas">Quantidade de Plantas</Label>
                    <Input id="quantidadePlantas" name="quantidadePlantas" type="number" min="1" value={form.quantidadePlantas} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="finalidadeUso">Finalidade de Uso</Label>
                    <Select onValueChange={(value) => handleSelectChange('finalidadeUso', value)} value={form.finalidadeUso}>
                      <SelectTrigger id="finalidadeUso"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Medicinal">Medicinal</SelectItem>
                        <SelectItem value="Terapêutico">Terapêutico</SelectItem>
                        <SelectItem value="Pessoal">Uso Pessoal</SelectItem>
                        <SelectItem value="Religioso">Religioso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoAmbiente">Tipo de Ambiente</Label>
                    <Select onValueChange={(value) => handleSelectChange('tipoAmbiente', value)} value={form.tipoAmbiente}>
                      <SelectTrigger id="tipoAmbiente"><SelectValue placeholder="Selecione o ambiente..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indoor">Indoor (Interno)</SelectItem>
                        <SelectItem value="outdoor">Outdoor (Externo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipoFertilizante">Tipo de Fertilizante</Label>
                    <Select onValueChange={(value) => handleSelectChange('tipoFertilizante', value)} value={form.tipoFertilizante}>
                      <SelectTrigger id="tipoFertilizante"><SelectValue placeholder="Selecione o tipo..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mineral">Mineral</SelectItem>
                        <SelectItem value="Orgânico">Orgânico</SelectItem>
                        <SelectItem value="Organomineral">Organomineral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {/* Plano de Cultivo */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">Plano de Cultivo</h3>
                  <Separator className="flex-1 ml-3" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="espacoCultivo">Espaço (m²)</Label>
                    <Input id="espacoCultivo" name="espacoCultivo" type="number" step="0.1" min="0.1" value={form.espacoCultivo} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cicloVegetativo">Ciclo Vegetativo (dias)</Label>
                    <Input id="cicloVegetativo" name="cicloVegetativo" type="number" min="1" value={form.cicloVegetativo} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cicloFlora">Ciclo de Floração (dias)</Label>
                    <Input id="cicloFlora" name="cicloFlora" type="number" min="1" value={form.cicloFlora} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previsaoColheita">Previsão de Colheita (gramas)</Label>
                  <Input id="previsaoColheita" name="previsaoColheita" type="number" min="0" value={form.previsaoColheita} onChange={handleChange} placeholder="Ex: 100" />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={handleReset}>Limpar</Button>
              <Button type="submit">Gerar Documento</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default PlanoCultivo;