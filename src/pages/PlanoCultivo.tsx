
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

const PlanoCultivo = () => {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    endereco: '',
    quantidadePlantas: '',
    finalidadeUso: '',
    espacoCultivo: '',
    cicloVegetativo: '',
    cicloFlora: ''
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically submit the form to your backend
    toast({
      title: "Documento gerado",
      description: "Seu Plano de Cultivo foi gerado com sucesso!",
    });
    console.log('Form submitted:', form);
  };

  const handleReset = () => {
    setForm({
      nome: '',
      cpf: '',
      endereco: '',
      quantidadePlantas: '',
      finalidadeUso: '',
      espacoCultivo: '',
      cicloVegetativo: '',
      cicloFlora: ''
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
                    <Input
                      id="nome"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      value={form.cpf}
                      onChange={handleCPFChange}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço Completo</Label>
                  <Input
                    id="endereco"
                    name="endereco"
                    value={form.endereco}
                    onChange={handleChange}
                    required
                  />
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
                    <Input
                      id="quantidadePlantas"
                      name="quantidadePlantas"
                      type="number"
                      min="1"
                      value={form.quantidadePlantas}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="finalidadeUso">Finalidade de Uso</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange('finalidadeUso', value)}
                      value={form.finalidadeUso}
                    >
                      <SelectTrigger id="finalidadeUso">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medicinal">Medicinal</SelectItem>
                        <SelectItem value="terapêutico">Terapêutico</SelectItem>
                        <SelectItem value="uso pessoal">Uso Pessoal</SelectItem>
                        <SelectItem value="religioso">Religioso</SelectItem>
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
                    <Input
                      id="espacoCultivo"
                      name="espacoCultivo"
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={form.espacoCultivo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cicloVegetativo">Ciclo Vegetativo (dias)</Label>
                    <Input
                      id="cicloVegetativo"
                      name="cicloVegetativo"
                      type="number"
                      min="1"
                      value={form.cicloVegetativo}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cicloFlora">Ciclo de Floração (dias)</Label>
                    <Input
                      id="cicloFlora"
                      name="cicloFlora"
                      type="number"
                      min="1"
                      value={form.cicloFlora}
                      onChange={handleChange}
                      required
                    />
                  </div>
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

export default PlanoCultivo;
