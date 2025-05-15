import React, { useState } from 'react';
import Layout from '@/components/Layout'; // Supondo que este componente exista no projeto
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Supondo que estes componentes existam
import { Input } from '@/components/ui/input'; // Supondo que estes componentes existam
import { Button } from '@/components/ui/button'; // Supondo que estes componentes existam
import { Label } from '@/components/ui/label'; // Supondo que estes componentes existam
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Supondo que estes componentes existam
import { Separator } from '@/components/ui/separator'; // Supondo que estes componentes existam
import { toast } from '@/components/ui/use-toast'; // Supondo que este componente exista
import { Dna } from 'lucide-react'; // Alterado de Leaf para Dna para representar genética
import { jsPDF } from 'jspdf';

const DeclaracaoOrigemGenetica = () => {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    endereco: '',
    nomeGenetica: '',
    tipoGenetica: '', // Opções: Indica, Sativa, Híbrida
    proporcaoTHC: '',
    proporcaoCBD: '',
    canabinoidesSecundarios: '',
    terpenosPredominantes: '',
    origemSementes: '',
    metodoAquisicao: '',
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

  const generateDeclaracaoText = (formData: typeof form) => {
    let textContent = "🌿 Declaração de Verificação de Origem Genética de Cannabis para Uso Medicinal\n\n";
    textContent += "Dados Pessoais\n\n";
    textContent += `Nome Completo: ${formData.nome || '[Inserir nome completo]'}\n`;
    textContent += `CPF: ${formData.cpf || '[Inserir CPF]'}\n`;
    textContent += `Endereço Completo: ${formData.endereco || '[Inserir endereço completo]'}\n\n`;

    textContent += "Informações da Genética Cultivada\n\n";
    textContent += `Nome da Genética: ${formData.nomeGenetica || '[Inserir nome da genética]'}\n`;
    textContent += `Tipo: ${formData.tipoGenetica || '[Indica/Sativa/Híbrida]'}\n`;
    textContent += `Proporção THC/CBD: ${formData.proporcaoTHC || '[Inserir porcentagem de THC]'} / ${formData.proporcaoCBD || '[Inserir porcentagem de CBD]'}\n`;
    textContent += `Canabinoides Secundários: ${formData.canabinoidesSecundarios || '[Inserir outros canabinoides presentes, se aplicável]'}\n`;
    textContent += `Terpenos Predominantes: ${formData.terpenosPredominantes || '[Inserir terpenos predominantes, ex: mirceno, limoneno, pineno]'}\n`;
    textContent += `Origem das Sementes: ${formData.origemSementes || '[Inserir origem das sementes, ex: banco de sementes, país de origem]'}\n`;
    textContent += `Método de Aquisição: ${formData.metodoAquisicao || '[Inserir método de aquisição, ex: importação, doação, etc.]'}\n\n`;

    textContent += "Justificativa e Fundamentação Legal\n";
    textContent += "Declaro que a aquisição das sementes mencionadas foi realizada com o objetivo exclusivo de cultivo para uso medicinal próprio, conforme prescrição médica. A escolha da genética foi baseada em suas características terapêuticas específicas, visando atender às necessidades do meu tratamento de saúde.\n\n";
    textContent += "Ressalto que a jurisprudência brasileira tem reconhecido a atipicidade da conduta de importar sementes de cannabis para uso medicinal próprio, especialmente quando há comprovação de finalidade terapêutica e ausência de intenção de tráfico. Decisões judiciais têm considerado que a criminalização dessa conduta viola princípios constitucionais, como o direito à saúde e à dignidade da pessoa humana.\n\n";

    textContent += "Compromisso e Responsabilidade\n";
    textContent += "Comprometo-me a utilizar as plantas provenientes das sementes acima descritas exclusivamente para fins medicinais, conforme orientação médica, e a não compartilhar, distribuir ou comercializar qualquer parte das plantas ou seus derivados. Estou ciente das responsabilidades legais envolvidas e coloco-me à disposição das autoridades competentes para quaisquer esclarecimentos que se fizerem necessários.\n\n";

    const currentDate = new Date().toLocaleDateString('pt-BR');
    textContent += `Data: ${currentDate}\n`;
    textContent += `Assinatura: ___________________________\n`; // Linha para assinatura manual

    return textContent;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const doc = new jsPDF();
    const text = generateDeclaracaoText(form);
    
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

    doc.save('declaracao_origem_genetica.pdf');
    
    toast({
      title: "Documento gerado",
      description: "Sua Declaração de Origem Genética foi gerada com sucesso!",
    });
    console.log('Form submitted:', form);
  };

  const handleReset = () => {
    setForm({
      nome: '',
      cpf: '',
      endereco: '',
      nomeGenetica: '',
      tipoGenetica: '',
      proporcaoTHC: '',
      proporcaoCBD: '',
      canabinoidesSecundarios: '',
      terpenosPredominantes: '',
      origemSementes: '',
      metodoAquisicao: '',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold">🌿 Declaração de Verificação de Origem Genética de Cannabis para Uso Medicinal</h1>
          <p className="text-lg text-muted-foreground mt-2">Preencha o formulário para gerar sua declaração.</p>
        </div>

        <Card className="w-full max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dna className="h-5 w-5 text-activist-600" />
                Formulário da Declaração
              </CardTitle>
              <CardDescription>
                Preencha todos os campos para gerar seu documento personalizado.
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

              {/* Informações da Genética Cultivada */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">Informações da Genética Cultivada</h3>
                  <Separator className="flex-1 ml-3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomeGenetica">Nome da Genética</Label>
                  <Input id="nomeGenetica" name="nomeGenetica" value={form.nomeGenetica} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipoGenetica">Tipo (Indica/Sativa/Híbrida)</Label>
                  <Select onValueChange={(value) => handleSelectChange('tipoGenetica', value)} value={form.tipoGenetica}>
                    <SelectTrigger id="tipoGenetica">
                      <SelectValue placeholder="Selecione o tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Indica">Indica</SelectItem>
                      <SelectItem value="Sativa">Sativa</SelectItem>
                      <SelectItem value="Híbrida">Híbrida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="proporcaoTHC">Proporção THC (%)</Label>
                    <Input id="proporcaoTHC" name="proporcaoTHC" type="text" value={form.proporcaoTHC} onChange={handleChange} placeholder="Ex: 20 ou 0.2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proporcaoCBD">Proporção CBD (%)</Label>
                    <Input id="proporcaoCBD" name="proporcaoCBD" type="text" value={form.proporcaoCBD} onChange={handleChange} placeholder="Ex: 10 ou 0.5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="canabinoidesSecundarios">Canabinoides Secundários (se aplicável)</Label>
                  <Input id="canabinoidesSecundarios" name="canabinoidesSecundarios" value={form.canabinoidesSecundarios} onChange={handleChange} placeholder="Ex: CBG, CBN" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terpenosPredominantes">Terpenos Predominantes</Label>
                  <Input id="terpenosPredominantes" name="terpenosPredominantes" value={form.terpenosPredominantes} onChange={handleChange} placeholder="Ex: Mirceno, Limoneno" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="origemSementes">Origem das Sementes</Label>
                  <Input id="origemSementes" name="origemSementes" value={form.origemSementes} onChange={handleChange} placeholder="Ex: Banco de sementes X, País Y" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metodoAquisicao">Método de Aquisição</Label>
                  <Input id="metodoAquisicao" name="metodoAquisicao" value={form.metodoAquisicao} onChange={handleChange} placeholder="Ex: Importação, Doação" />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={handleReset}>
                Limpar
              </Button>
              <Button type="submit">
                Gerar Documento
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default DeclaracaoOrigemGenetica;

