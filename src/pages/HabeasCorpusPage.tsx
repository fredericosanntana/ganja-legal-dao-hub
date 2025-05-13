
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface Fundamento {
  id: string;
  nome: string;
}

const HabeasCorpusPage: React.FC = () => {
  // For now, we'll hardcode these values since we're transitioning from Next.js to React Router
  const fundamentos: Fundamento[] = [
    { id: 'adpf187', nome: 'ADPF 187 - STF' },
    { id: 're635659', nome: 'RE 635659 - STF' },
    { id: 'resp2121548', nome: 'REsp 2.121.548 - STJ' }
  ];
  const title = 'Gerador de Habeas Corpus Preventivo';
  
  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
        <section className="form-section mx-auto" style={{ maxWidth: '720px' }}>
          <h1 className="text-3xl font-bold mb-3 text-center">{title}</h1>
          <p className="text-lg text-muted-foreground mb-8 text-center">
            Preencha o formulário abaixo para gerar seu Habeas Corpus Preventivo personalizado.
          </p>

          <form className="space-y-6">
            {/* Dados Pessoais */}
            <fieldset className="border rounded-lg p-4">
              <legend className="text-lg font-semibold px-2">Dados Pessoais</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium mb-1">Nome Completo</label>
                  <input type="text" id="nome" name="nome" className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label htmlFor="cpf" className="block text-sm font-medium mb-1">CPF</label>
                  <input type="text" id="cpf" name="cpf" className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">E-mail</label>
                  <input type="email" id="email" name="email" className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium mb-1">Telefone</label>
                  <input type="tel" id="telefone" name="telefone" className="w-full p-2 border rounded" required />
                </div>
                <div className="col-span-2">
                  <label htmlFor="endereco" className="block text-sm font-medium mb-1">Endereço Completo</label>
                  <input type="text" id="endereco" name="endereco" className="w-full p-2 border rounded" required />
                </div>
              </div>
            </fieldset>

            {/* Informações do Cultivo */}
            <fieldset className="border rounded-lg p-4">
              <legend className="text-lg font-semibold px-2">Informações do Cultivo</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quantidadePlantas" className="block text-sm font-medium mb-1">Quantidade de Plantas</label>
                  <input type="number" id="quantidadePlantas" name="quantidadePlantas" className="w-full p-2 border rounded" min={1} required />
                </div>
                <div>
                  <label htmlFor="finalidadeUso" className="block text-sm font-medium mb-1">Finalidade de Uso</label>
                  <select id="finalidadeUso" name="finalidadeUso" className="w-full p-2 border rounded" required>
                    <option value="">Selecione...</option>
                    <option value="medicinal">Medicinal</option>
                    <option value="terapeutico">Terapêutico</option>
                    <option value="pessoal">Uso Pessoal</option>
                    <option value="religioso">Religioso</option>
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Fundamentos Jurídicos */}
            <fieldset className="border rounded-lg p-4">
              <legend className="text-lg font-semibold px-2">Fundamentos Jurídicos</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fundamentos.map(f => (
                  <div key={f.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={f.id}
                      name="fundamentosJuridicos"
                      value={f.id}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor={f.id} className="text-sm">
                      {f.nome}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>

            {/* Motivação */}
            <fieldset className="border rounded-lg p-4">
              <legend className="text-lg font-semibold px-2">Motivação</legend>
              <div>
                <label htmlFor="motivacao" className="block text-sm font-medium mb-1">Descreva sua motivação para o autocultivo</label>
                <textarea id="motivacao" name="motivacao" rows={5} className="w-full p-2 border rounded" required></textarea>
              </div>
            </fieldset>

            {/* Ações */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="reset">Limpar</Button>
              <Button type="submit">Gerar Habeas Corpus</Button>
            </div>
          </form>
        </section>
      </main>
    </Layout>
  );
};

export default HabeasCorpusPage;
