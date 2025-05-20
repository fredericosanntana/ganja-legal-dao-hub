import React, { useState } from 'react';
import Layout from '@/components/Layout'; // Supondo que este componente exista no projeto
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Supondo que estes componentes existam
import { Input } from '@/components/ui/input'; // Supondo que estes componentes existam
import { Button } from '@/components/ui/button'; // Supondo que estes componentes existam
import { Label } from '@/components/ui/label'; // Supondo que estes componentes existam
import { Separator } from '@/components/ui/separator'; // Supondo que estes componentes existam
import { toast } from 'sonner'; // Supondo que este componente exista
import { FileText } from 'lucide-react'; // Ícone genérico para declaração
import { jsPDF } from 'jspdf';

const DeclaracaoResponsabilidade = () => {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    endereco: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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

  const generateResponsabilidadeText = (formData: typeof form) => {
    let textContent = "Declaração de Responsabilidade e Finalidade Medicinal\n\n";
    textContent += "Dados Pessoais\n\n";
    textContent += `Nome Completo: ${formData.nome || '[Inserir nome completo]'}\n`;
    textContent += `CPF: ${formData.cpf || '[Inserir CPF]'}\n`;
    textContent += `Endereço Completo: ${formData.endereco || '[Inserir endereço completo]'}\n\n`;

    textContent += "Declaração\n";
    textContent += `Eu, ${formData.nome || '[Inserir nome completo]'}, declaro, para os devidos fins, que realizo o cultivo de plantas de Cannabis exclusivamente para uso medicinal próprio, conforme prescrição médica devidamente emitida por profissional habilitado.\n\n`;
    textContent += "Comprometo-me a utilizar as plantas cultivadas unicamente para a produção de medicamentos destinados ao meu tratamento de saúde, abstendo-me de qualquer forma de compartilhamento, distribuição ou comercialização de partes da planta ou de seus derivados.\n\n";
    textContent += "Estou ciente das responsabilidades legais envolvidas e afirmo que o cultivo é realizado de forma consciente, segura e restrita ao ambiente domiciliar, visando exclusivamente a melhoria da minha qualidade de vida e o atendimento às minhas necessidades terapêuticas.\n\n";
    textContent += "Coloco-me à disposição das autoridades competentes para quaisquer esclarecimentos que se fizerem necessários, reafirmando meu compromisso com a legalidade e a ética no uso medicinal da Cannabis.\n\n";

    const currentDate = new Date().toLocaleDateString('pt-BR');
    textContent += `Data: ${currentDate}\n`;
    textContent += `Assinatura: ___________________________\n`;

    return textContent;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const doc = new jsPDF();
    const text = generateResponsabilidadeText(form);
    
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

    doc.save('declaracao_responsabilidade_medicinal.pdf');
    
    toast.success("Documento gerado com sucesso!", {
      description: "Sua Declaração de Responsabilidade e Finalidade Medicinal foi gerada."
    });
    console.log('Form submitted:', form);
  };

  const handleReset = () => {
    setForm({
      nome: '',
      cpf: '',
      endereco: '',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold">Declaração de Responsabilidade e Finalidade Medicinal</h1>
          <p className="text-lg text-muted-foreground mt-2">Preencha o formulário para gerar sua declaração.</p>
        </div>

        <Card className="w-full max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-activist-600" />
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

export default DeclaracaoResponsabilidade;
