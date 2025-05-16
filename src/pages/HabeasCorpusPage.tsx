import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

interface Fundamento {
  id: string;
  nome: string;
}

const fundamentos: Fundamento[] = [
  { id: 'adpf187', nome: 'ADPF 187 - STF' },
  { id: 're635659', nome: 'RE 635659 - STF' },
  { id: 'resp2121548', nome: 'REsp 2.121.548 - STJ' }
];

const title = 'Gerador de Habeas Corpus Preventivo';

const HabeasCorpusPage: React.FC = () => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({
    nome: '',
    nacionalidade: '',
    estadoCivil: '',
    profissao: '',
    CPF: '',
    RG: '',
    Email: '',
    Telefone: '',
    Endereco: '',
    Cidade: '',
    UF: '',
    QuantidadePlantas: 1,
    FinalidadeUso: '',
    FundamentosJuridicos: [] as string[],
    Motivacao: ''
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFundamentoToggle = (id: string) => {
    const list = formData.FundamentosJuridicos as string[];
    setFormData(prev => ({
      ...prev,
      fundamentosJuridicos: list.includes(id) ? list.filter(i => i !== id) : [...list, id]
    }));
  };

  const generateText = () => {
    const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    const hoje = new Date();
    const dia = hoje.getDate();
    const mes = meses[hoje.getMonth()];
    const ano = hoje.getFullYear();

    let text = `EXCELENTÍSSIMO SENHOR DOUTOR DESEMBARGADOR DO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO ${formData.uf}\n\n`;
    text += `${formData.nome}, ${formData.nacionalidade}, ${formData.estadoCivil}, ${formData.profissao}, portador do CPF nº ${formData.cpf} e RG nº ${formData.rg}, residente e domiciliado em ${formData.endereco}, ${formData.cidade} – ${formData.uf}, vem, com o devido respeito, por meio deste instrumento constitucional e com fulcro no art. 5º, inciso LXVIII, da Constituição Federal e nos artigos 647 e 648 do Código de Processo Penal, impetrar o presente:\n\n`;
    text += `HABEAS CORPUS PREVENTIVO COM PEDIDO DE LIMINAR\n\n`;
    text += `em favor de si próprio, apontando como autoridade coatora o Delegado de Polícia de ${formData.cidade}, ou qualquer outro agente que possa restringir sua liberdade em razão da conduta a seguir descrita.\n\n`;

    text += `I. DOS FATOS\n`;
    text += `O paciente busca, por meio deste remédio constitucional, garantir sua liberdade de locomoção e o exercício pleno de seus direitos fundamentais ao requerer salvo-conduto preventivo que o autorize a realizar o cultivo pessoal de até ${formData.quantidadePlantas} plantas-fêmeas de Cannabis sativa L. em sua residência, para fins de ${formData.finalidadeUso}, não comercial, de natureza adulta e terapêutica.\n\n`;
    text += `O pedido é feito antes do início da atividade de cultivo, em razão da insegurança jurídica acentuada pela atual proposta de regulamentação da Anvisa (Consulta Pública nº 1.316/2025), que ignora o direito ao autocultivo, mesmo sendo esse reconhecido pelo Poder Judiciário em casos concretos, por meio da concessão de Habeas Corpus individuais e coletivos, inclusive no âmbito do Superior Tribunal de Justiça.\n\n`;
    text += `A proposta normativa da Anvisa não prevê qualquer exceção para o cultivo doméstico, mantendo a planta sob controle exclusivo de grandes empresas, reforçando um modelo elitizado e excludente que entra em conflito direto com a jurisprudência já firmada em prol da autonomia, da saúde e da liberdade do cidadão que cultiva para seu próprio cuidado.\n\n`;
    text += `I.1 ${formData.motivacao}\n\n`;
    text += `II. DO DIREITO\n2.1. Do Direito à Vida Privada, à Saúde e à Autonomia\nO cultivo pessoal da Cannabis sativa L., quando realizado sem fins comerciais e para uso próprio, está protegido pelos princípios constitucionais da intimidade, vida privada, dignidade e direito à saúde (art. 5º, X, e art. 6º da CF). Tal conduta também representa expressão legítima do direito à autodeterminação do indivíduo sobre seu próprio corpo.\n\n`;
    text += `2.2. Da Jurisprudência Consolidada\nO REsp 2.121.548/SP (STJ) reconheceu que o cultivo doméstico de Cannabis, quando realizado por paciente em tratamento e sem desvio de finalidade, não configura conduta criminosa, por ausência de regulamentação estatal suficiente e em razão da boa-fé do agente.\n\n`;
    text += `No julgamento do RE 635659 (STF), com repercussão geral reconhecida, ficou assentado que o porte de drogas para consumo pessoal não deve gerar responsabilização penal, sendo cabível inclusive o reconhecimento de atipicidade da conduta, mesmo com quantidade superior a 40g ou mais de seis plantas-fêmeas, desde que ausente a intenção de mercancia.\n\n`;
    text += `2.3. Da Insegurança Jurídica da Regulamentação Proposta\nA proposta da Anvisa, atualmente em Consulta Pública, ignora completamente a existência de centenas de salvo-condutos judiciais já concedidos, mantendo o cidadão em uma zona de risco constante de criminalização indevida, mesmo quando sua conduta já é reconhecida como lícita pela jurisprudência dos tribunais superiores.\n\n`;
    text += `Tal omissão cria um cenário de conflito entre a norma técnica e o Direito vigente, exigindo atuação do Poder Judiciário para assegurar a segurança jurídica do cidadão diante de uma atuação regulatória incompleta e potencialmente discriminatória.\n\n`;

    text += `III. DA BOA-FÉ E COMPROMISSO COM A LEGALIDADE\nO paciente declara:\n`;
    text += `- Que não visa comércio, doação ou distribuição da planta ou de seus derivados;\n`;
    text += `- Que se compromete a cultivar de forma segura, controlada e responsável, com fins exclusivamente pessoais;\n`;
    text += `- Que está disposto a se submeter a medidas educativas ou extrapenais, se necessário (art. 28 da Lei 11.343/06);\n`;
    text += `- Que atua em boa-fé e solicita proteção judicial preventiva para não ser confundido com traficante ou sofrer constrangimento ilegal.\n\n`;

    text += `IV. DO PEDIDO LIMINAR\nDiante do exposto, e considerando o risco concreto de violação à liberdade de locomoção do paciente diante de uma conduta reconhecidamente lícita por jurisprudência e ainda não regulamentada por norma específica, requer-se a concessão de medida liminar para assegurar ao paciente o salvo-conduto necessário, autorizando o cultivo de até ${formData.quantidadePlantas} plantas-fêmeas de Cannabis sativa L., para uso próprio, sem que possa sofrer prisão em flagrante, inquérito policial ou processo criminal.\n\n`;

    text += `V. DOS PEDIDOS\nDiante do exposto, requer-se:\n`;
    text += `1. A concessão liminar do salvo-conduto ao paciente, para evitar qualquer constrangimento ilegal decorrente do cultivo pessoal de Cannabis;\n`;
    text += `2. A notificação da autoridade coatora para prestar informações;\n`;
    text += `3. Ao final, o julgamento procedente do presente Habeas Corpus, com a concessão definitiva da ordem;\n`;
    text += `4. O reconhecimento de que a conduta do paciente, diante da jurisprudência vigente e da ausência de norma clara, é atípica, lícita e protegida constitucionalmente;\n`;
    text += `5. A autorização para que o paciente possa, se desejar, aderir a habeas corpus coletivo, como forma legítima de proteção difusa.\n\n`;

    text += `Nestes termos,\nPede deferimento.\n\n`;
    text += `${formData.cidade}, ${dia} de ${mes} de ${ano}\n`;
    text += `${formData.nome}\n`;
    text += `CPF: ${formData.cpf}\n\n`;
    text += `${formData.nome}\n`;

    return text;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = new jsPDF();
    const text = generateText();
    const lines = doc.splitTextToSize(text, 180);
    let y = 20;
    lines.forEach(line => {
      if (y > 280) { doc.addPage(); y = 20; }
      doc.text(line, 10, y);
      y += 7;
    });
    doc.save('habeas-corpus-preventivo.pdf');
  };

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
        <section className="mx-auto" style={{ maxWidth: '720px' }}>
          <h1 className="text-3xl font-bold mb-3 text-center">{title}</h1>
          <p className="text-lg text-muted-foreground mb-8 text-center">
            Preencha o formulário abaixo para gerar seu Habeas Corpus Preventivo.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Dados Pessoais */}
            <fieldset className="border rounded-lg p-4">
              <legend className="text-lg font-semibold px-2">Dados Pessoais</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['nome','nacionalidade','estado Civil','profissao','CPF','RG','Email','Telefone','Endereco','Cidade','UF'].map(field => (
                  <div key={field}>
                    <label htmlFor={field} className="block text-sm font-medium mb-1">
                      {field.charAt(0).toUpperCase()+field.slice(1)}
                    </label>
                    <input
                      type="text"
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={e => handleChange(field, e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label htmlFor="endereco" className="block text-sm font-medium mb-1">Endereço Completo</label>
                  <input
                    type="text"
                    id="endereco"
                    name="endereco"
                    value={formData.endereco}
                    onChange={e => handleChange('endereco', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
            </fieldset>

            {/* Informações do Cultivo */}
            <fieldset className="border rounded-lg p-4">
              <legend className="text-lg font-semibold px-2">Informações do Cultivo</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quantidadePlantas" className="block text-sm font-medium mb-1">Quantidade de Plantas</label>
                  <input
                    type="number"
                    id="quantidadePlantas"
                    name="quantidadePlantas"
                    min={1}
                    value={formData.quantidadePlantas}
                    onChange={e => handleChange('quantidadePlantas', Number(e.target.value))}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="finalidadeUso" className="block text-sm font-medium mb-1">Finalidade de Uso</label>
                  <select
                    id="finalidadeUso"
                    name="finalidadeUso"
                    value={formData.finalidadeUso}
                    onChange={e => handleChange('finalidadeUso', e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="medicinal">Medicinal</option>
                    <option value="terapeutico">Terapêutico</option>
                    <option value="pessoal">Uso Pessoal</option>
                    <option value="religioso">Religioso</option>
                  </select>
                </div>
              </div>
            </fieldset>

            

            {/* Motivação */}
            <fieldset className="border rounded-lg p-4">
              <legend className="text-lg font-semibold px-2">Motivação</legend>
              <div>
                <label htmlFor="motivacao" className="block text-sm font-medium mb-1">Descreva sua motivação para o autocultivo</label>
                <textarea
                  id="motivacao"
                  name="motivacao"
                  rows={5}
                  value={formData.motivacao}
                  onChange={e => handleChange('motivacao', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </fieldset>

            {/* Prévia do Texto */}
            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Prévia do Texto</h2>
              <div className="bg-gray-100 p-4 rounded h-64 overflow-auto whitespace-pre-wrap">
                {generateText()}
              </div>
              <p className="text-lg text-muted-foreground mb-8 text-center">
            Pode ser impetrado por qualquer pessoa, independentemente de habilitação legal ou representação de advogado.
            </p>
            <p className="text-lg text-muted-foreground mb-8 text-center">
            Obs: Admite-se a impetração por telegrama, radiograma ou telex, e até por telefone (RT 638/333). Sobre a impetração por meio eletrônico, vide Lei n. 11.419/06, que trata da informatização do processo judicial (cada tribunal adota um sistema eletrônico processual, o impetrante deve se informar por meio dos manuais disponíveis nos sites tribunais sobre o peticionamento eletrônico de pessoas sem assistência de advogado).
          </p>
            </section>

            {/* Ações */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" type="reset" onClick={() => setFormData({
                nome:'', nacionalidade:'', estadoCivil:'', profissao:'', CPF:'', RG:'', Email:'', Telefone:'', Endereco:'', Cidade:'', UF:'', QuantidadePlantas:1, FinalidadeUso:'', FundamentosJuridicos:[], Motivacao:''
              })}>
                Limpar
              </Button>
              <Button type="submit">Gerar Habeas Corpus</Button>
            </div>
          </form>
        </section>
      </main>
    </Layout>
  );
};

export default HabeasCorpusPage;