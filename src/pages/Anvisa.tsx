import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { FileText, FileEdit, Mail, Save } from 'lucide-react';
import { jsPDF } from 'jspdf';

const Anvisa: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', cpf: '', profession: '', additionalComments: '',
    point1: true, point2: true, point3: true, point4: true, point5: false, point6: false
  });
  const [previewHtml, setPreviewHtml] = useState('');
  const [toast, setToast] = useState<{ title: string; message: string; type: 'success'|'error'|'warning' } | null>(null);

  const showNotification = (title: string, message: string, type: 'success'|'error'|'warning' = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const generateManifestationContent = (): string => {
    const { name, profession, additionalComments, point1, point2, point3, point4, point5, point6 } = formData;
    let html = `<p><strong>À Agência Nacional de Vigilância Sanitária - ANVISA</strong></p>
      <p><strong>Assunto:</strong> Manifestação sobre a proposta normativa para produtos de Cannabis</p>
      <p>Eu, ${name}${profession ? `, ${profession},` : ','} Como cidadão brasileiro e paciente que acompanha de perto a construção de políticas públicas sobre a Cannabis no país, manifesto aqui minha opinião sobre a proposta em consulta pública: o texto representa um avanço restrito e profundamente excludente, por deixar de reconhecer a realidade concreta de quem já cultiva com autorização judicial e de quem busca essa via para proteger seus direitos fundamentais.</p>`;
    if(point1) html += `<h5>1. Autocultivo para fins medicinais</h5><p>A proposta atual não reconhece o direito ao autocultivo. A referida proposta ignora completamente o direito ao autocultivo, mesmo quando exercido de forma responsável, controlada e para fins exclusivos de uso pessoal, seja medicinal ou adulto, e mesmo diante de precedentes firmes do Poder Judiciário que reconhecem a legitimidade dessa prática.</p>`;
    if(point2) html += `<h5>2. Jurisprudência favorável</h5><p>A proposta ignora decisões como RE 635659. Hoje, centenas de brasileiros já cultivam legalmente por força de Habeas Corpus preventivos concedidos pelo Judiciário, como no caso emblemático do REsp 2.121.548/SP, em que o Superior Tribunal de Justiça reconheceu que o cultivo doméstico para uso próprio, em determinadas condições, não configura crime e é expressão legítima do direito à saúde e à vida privada.
Além disso, o STF no RE 635659 fixou a tese de que o porte de Cannabis para uso pessoal não configura infração penal, e que até mesmo quantidades superiores aos limites fixados podem ser consideradas condutas atípicas, quando presentes indícios claros de uso próprio e ausência de finalidade comercial. A proposta normativa da Anvisa, no entanto, ignora completamente essa construção jurisprudencial, aumentando a distância entre o direito vivo e a norma técnica.
</p>`;
    if(point3) html += `<h5>3. Associações de pacientes</h5><p>Neste contexto, acredito que a Anvisa, como agência que tem o dever institucional de proteger o interesse público na promoção da saúde (Lei nº 9.782/1999), deve incluir na regulamentação o reconhecimento e a possibilidade de regulação do autocultivo individual e associativo, com critérios sanitários mínimos, compromisso com rastreabilidade, e vedação ao desvio de finalidade — como já ocorre em outros países e como o Judiciário já vem reconhecendo no Brasil.</p>`;
    if(point4) html += `<h5>4. Uso da planta in natura</h5><p>O artigo 9º da minuta, ao proibir integralmente a comercialização da planta in natura, desconsidera métodos tradicionais e comprovadamente seguros de uso, como vaporização de flores secas, infusão em óleo ou preparo artesanal. Além disso, a ausência de qualquer dispositivo que reconheça o autocultivo ou preveja critérios para regulação desta prática deixa os usuários expostos à criminalização indevida, mesmo quando já protegidos por decisões judiciais.
</p>`;
    if(point5) html += `<h5>5. Redução de custos para pacientes</h5><p>É fundamental considerar mecanismos de redução de custos.A proposta também reforça um modelo de acesso elitizado, que exige estrutura industrial, farmacêutica e capital elevado, inacessível para a ampla maioria da população brasileira. Isso nega, na prática, o direito ao cuidado autônomo, ao acesso seguro à planta e à liberdade de escolha sobre seu próprio corpo, especialmente para quem busca se proteger da violência do mercado ilegal e do preconceito estrutural que atinge principalmente os mais vulneráveis.

Pior: ao desconsiderar expressamente as experiências concretas de quem já planta com base no reconhecimento judicial, a proposta invalida conquistas legítimas e gera grave insegurança jurídica, ameaçando a liberdade e a saúde de pessoas que agem de forma transparente, ética e responsável.
</p>`;
    
    if(additionalComments) html += `<h5>Comentários Adicionais</h5><p>${additionalComments}</p>`;
    
    html += `<p><p><strong>Conclusão:</strong> Por fim, reitero que a proposta normativa da Anvisa, ao não reconhecer o autocultivo e ao proibir a comercialização da planta in natura, não apenas ignora a realidade de milhares de brasileiros, mas também perpetua um modelo de acesso elitizado e excludente. É fundamental que a Anvisa considere as experiências concretas de quem já cultiva com base no reconhecimento judicial e busque regulamentar o autocultivo individual e associativo, garantindo o direito à saúde e à liberdade de escolha sobre o próprio corpo. Negar o autocultivo em 2025 não é apenas uma omissão técnica, é uma forma de reforçar desigualdades sociais, criminalizar práticas legítimas e silenciar a realidade de milhares de brasileiros que cultivam como ato de cuidado, sobrevivência e dignidade.</p>Atenciosamente,<br/>${name}</p>`;
    
    if(point6) html += `<h5>6. Referências Bibliográficas</h5><p>"1. REsp 2.121.548/SP – STJ: https://ww2.stj.jus.br/processo/revista/documento/mediado/?componente=ITA&sequencial=2119057&num_registro=202101139627&data=20230821&formato=PDF",
    "2. RE 635659 – STF: https://redir.stf.jus.br/paginadorpub/paginador.jsp?docTP=TP&docID=7537390",
    "3. ADPF 187 – STF: https://redir.stf.jus.br/paginadorpub/paginador.jsp?docTP=TP&docID=601404",
    "4. FIOCRUZ (2020) – Políticas sobre Drogas: https://www.arca.fiocruz.br/handle/icict/41432",
    "5. Coletivo Reforma – Habeas Cannabis: https://reforma.co/habeascannabis.pdf",
    "6. IBCCrim – Artigo técnico: https://ibccrim.org.br/publicacoes/edicoes/231/2023",
    "7. UNODC – Relatório Mundial sobre Drogas (2022): https://www.unodc.org/unodc/en/data-and-analysis/world-drug-report-2022.html",
    "8. Observatório da Cannabis/UFRJ – Nota Técnica: https://www.epsjv.fiocruz.br/noticias/reportagem/autocultivo-de-cannabis-para-uso-medicinal-e-tema-de-nota-tecnica-da-ufrj",
    "9. Entrevista com Luciana Boiteux – IHU Unisinos: https://www.ihu.unisinos.br/78-noticias/621389-cannabis-e-direitos-fundamentais-entrevista-com-luciana-boiteux",
    "10. Lei nº 9.782/1999 – Criação da Anvisa: https://www.planalto.gov.br/ccivil_03/leis/l9782.htm",
    "11. Lei nº 12.527/2011 – Lei de Acesso à Informação: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm",
    "12. Nota Técnica ANVISA nº 01/2017: https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/categorias/fitoterapicos/cannabis/nota-tecnica-01-2017"</p>`;
    
    return html;
  };

  const validateForm = (): boolean => {
    if(!formData.name.trim()) { showNotification('Erro', 'Por favor, informe seu nome completo.', 'error'); return false; }
    if(!formData.email.trim()) { showNotification('Erro', 'Por favor, informe seu e-mail.', 'error'); return false; }
    return true;
  };

  const generatePDF = () => {
    if(!validateForm()) return;
    const doc = new jsPDF();
    const content = generateManifestationContent().replace(/<[^>]*>/g, '');
    const lines = doc.splitTextToSize(content, 180);
    let y = 20;
    lines.forEach(line => {
      if(y > 280) { doc.addPage(); y = 20; }
      doc.text(line, 15, y);
      y += 7;
    });
    doc.save(`manifestacao_anvisa_${formData.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    showNotification('Sucesso', 'PDF gerado com sucesso!', 'success');
  };

  const sendEmail = () => {
    if(!validateForm()) return;
    // Simulação de envio; em app real, chamaria API
    showNotification('Sucesso', 'Manifestação enviada com sucesso para a ANVISA!', 'success');
  };

  // Atualiza pré-visualização sempre que formData mudar
  useEffect(() => {
    setPreviewHtml(generateManifestationContent());
  }, [formData]);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Módulo ANVISA</h1>
            <p className="text-lg text-muted-foreground">
              Ferramentas para criação e envio de manifestações para consultas públicas
            </p>
          </div>

          {/* Ferramenta de Manifestação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Ferramenta de Manifestação
              </CardTitle>
              <CardDescription>
                Crie manifestações para consultas públicas da ANVISA relacionadas à Cannabis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Esta ferramenta permite que você crie manifestações formais para consultas públicas da ANVISA
                relacionadas à regulamentação da Cannabis.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2">
              <Button className="w-full sm:flex-1" onClick={() => setShowForm(true)}>
                <FileEdit className="mr-2 h-5 w-5" /> Criar Nova Manifestação
              </Button>
              <Button variant="outline" className="w-full sm:flex-1">
                <Save className="mr-2 h-5 w-5" /> Minhas Manifestações
              </Button>
            </CardFooter>
          </Card>

          {/* Formulário Dinâmico */}
          {showForm && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Formulário de Manifestação</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Dados Pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block font-medium">Nome Completo</label>
                    <input
                      id="name"
                      type="text"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      value={formData.name}
                      onChange={e => handleChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-medium">E-mail</label>
                    <input
                      id="email"
                      type="email"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      value={formData.email}
                      onChange={e => handleChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="cpf" className="block font-medium">CPF</label>
                    <input
                      id="cpf"
                      type="text"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      value={formData.cpf}
                      onChange={e => handleChange('cpf', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="profession" className="block font-medium">Profissão</label>
                    <input
                      id="profession"
                      type="text"
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      value={formData.profession}
                      onChange={e => handleChange('profession', e.target.value)}
                    />
                  </div>
                </div>

                {/* Pontos de Abordagem */}
                <div className="mb-4">
                  <p className="font-medium mb-2">Pontos a serem abordados</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {['point1','point2','point3','point4','point5','point6'].map((key, i) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={(formData as any)[key]}
                          onChange={e => handleChange(key, e.target.checked)}
                        />
                        <span>
                          {['Autocultivo medicinal','Jurisprudência favorável','Associações','Uso da planta in natura','Redução de custos','Referências Bibliográficas'][i]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Comentários Adicionais */}
                <div className="mb-4">
                  <label htmlFor="additionalComments" className="block font-medium mb-2">Comentários Adicionais</label>
                  <textarea
                    id="additionalComments"
                    rows={4}
                    className="textarea w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    value={formData.additionalComments}
                    onChange={e => handleChange('additionalComments', e.target.value)}
                  />
                </div>

                {/* Prévia */}
                <div className="mb-4 bg-muted p-4 rounded">
                  <h4 className="font-semibold mb-2">Prévia da Manifestação</h4>
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </div>

                {/* Ações */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => setPreviewHtml(generateManifestationContent())}>
                    Atualizar Prévia
                  </Button>
                  <Button onClick={generatePDF}>Baixar PDF</Button>
                  <Button onClick={sendEmail} variant="secondary">Enviar por E-mail</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alertas de Consultas Públicas */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" /> Receba Alertas de Consultas Públicas
                </CardTitle>
                <CardDescription>
                  Seja notificado quando novas consultas públicas forem abertas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Mantenha-se atualizado sobre novas consultas públicas da ANVISA relacionadas à Cannabis.
                  Cadastre seu e-mail para receber alertas e não perder os prazos.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-5 w-5" /> Cadastrar para Alertas
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Toast */}
          {toast && (
            <div className="fixed top-4 right-4">
              <div className={`alert alert-${toast.type} shadow-lg`}>
                <div>
                  <span>{toast.title}</span>
                  <span className="block">{toast.message}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Anvisa;
