
import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Fundamento {
  id: string;
  nome: string;
}

interface Props {
  fundamentos: Fundamento[];
  title: string;
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
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <main className="container page-section light-bg-alt py-5">
          <section className="form-section mx-auto" style={{ maxWidth: '720px' }}>
            <h1 className="text-center mb-3">{title}</h1>
            <p className="lead text-center mb-4">
              Preencha o formulário abaixo para gerar seu Habeas Corpus Preventivo personalizado.
            </p>

            <form action="/juridico/habeas-corpus" method="POST" className="hc-form">
              {/* Dados Pessoais */}
              <fieldset className="border p-3 mb-4">
                <legend className="w-auto px-2">Dados Pessoais</legend>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="nome" className="form-label">Nome Completo</label>
                    <input type="text" id="nome" name="nome" className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="cpf" className="form-label">CPF</label>
                    <input type="text" id="cpf" name="cpf" className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">E-mail</label>
                    <input type="email" id="email" name="email" className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="telefone" className="form-label">Telefone</label>
                    <input type="tel" id="telefone" name="telefone" className="form-control" required />
                  </div>
                  <div className="col-12">
                    <label htmlFor="endereco" className="form-label">Endereço Completo</label>
                    <input type="text" id="endereco" name="endereco" className="form-control" required />
                  </div>
                </div>
              </fieldset>

              {/* Informações do Cultivo */}
              <fieldset className="border p-3 mb-4">
                <legend className="w-auto px-2">Informações do Cultivo</legend>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="quantidadePlantas" className="form-label">Quantidade de Plantas</label>
                    <input type="number" id="quantidadePlantas" name="quantidadePlantas" className="form-control" min={1} required />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="finalidadeUso" className="form-label">Finalidade de Uso</label>
                    <select id="finalidadeUso" name="finalidadeUso" className="form-select" required>
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
              <fieldset className="border p-3 mb-4">
                <legend className="w-auto px-2">Fundamentos Jurídicos</legend>
                <div className="row g-2">
                  {fundamentos.map(f => (
                    <div key={f.id} className="col-md-6 d-flex align-items-center">
                      <input
                        type="checkbox"
                        id={f.id}
                        name="fundamentosJuridicos"
                        value={f.id}
                        className="form-check-input me-2"
                      />
                      <label htmlFor={f.id} className="form-check-label">
                        {f.nome}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>

              {/* Motivação */}
              <fieldset className="border p-3 mb-4">
                <legend className="w-auto px-2">Motivação</legend>
                <div className="mb-3">
                  <label htmlFor="motivacao" className="form-label">Descreva sua motivação para o autocultivo</label>
                  <textarea id="motivacao" name="motivacao" rows={5} className="form-control" required></textarea>
                </div>
              </fieldset>

              {/* Ações */}
              <div className="d-flex justify-content-end gap-2">
                <button type="reset" className="btn btn-outline-secondary">Limpar</button>
                <button type="submit" className="btn btn-primary">Gerar Habeas Corpus</button>
              </div>
            </form>
          </section>
        </main>
      </Layout>
    </>
  );
};

export default HabeasCorpusPage;
