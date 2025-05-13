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
    point1: true, point2: true, point3: true, point4: true, point5: false
  });
  const [previewHtml, setPreviewHtml] = useState('');
  const [toast, setToast] = useState<{ title: string; message: string; type: 'success'|'error'|'warning' } | null>(null);

  const showNotification = (title: string, message: string, type: 'success'|'error'|'warning' = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const generateManifestationContent = (): string => {
    const { name, profession, additionalComments, point1, point2, point3, point4, point5 } = formData;
    let html = `<p><strong>À Agência Nacional de Vigilância Sanitária - ANVISA</strong></p>
      <p><strong>Assunto:</strong> Manifestação sobre a proposta normativa para produtos de Cannabis</p>
      <p>Eu, ${name}${profession ? `, ${profession},` : ','} venho apresentar minha manifestação:</p>`;
    if(point1) html += `<h5>1. Autocultivo para fins medicinais</h5><p>A proposta atual não reconhece o direito ao autocultivo...</p>`;
    if(point2) html += `<h5>2. Jurisprudência favorável</h5><p>A proposta ignora decisões como RE 635659...</p>`;
    if(point3) html += `<h5>3. Associações de pacientes</h5><p>Associações operam com autorização judicial...</p>`;
    if(point4) html += `<h5>4. Uso da planta in natura</h5><p>O artigo 9º da minuta proíbe integralmente...</p>`;
    if(point5) html += `<h5>5. Redução de custos para pacientes</h5><p>É fundamental considerar mecanismos de redução de custos...</p>`;
    if(additionalComments) html += `<h5>Comentários Adicionais</h5><p>${additionalComments}</p>`;
    html += `<p>Atenciosamente,<br/>${name}</p>`;
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block font-medium">Nome Completo</label>
                    <input
                      id="name"
                      type="text"
                      className="input w-full"
                      value={formData.name}
                      onChange={e => handleChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-medium">E-mail</label>
                    <input
                      id="email"
                      type="email"
                      className="input w-full"
                      value={formData.email}
                      onChange={e => handleChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="cpf" className="block font-medium">CPF</label>
                    <input
                      id="cpf"
                      type="text"
                      className="input w-full"
                      value={formData.cpf}
                      onChange={e => handleChange('cpf', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="profession" className="block font-medium">Profissão</label>
                    <input
                      id="profession"
                      type="text"
                      className="input w-full"
                      value={formData.profession}
                      onChange={e => handleChange('profession', e.target.value)}
                    />
                  </div>
                </div>

                {/* Pontos de Abordagem */}
                <div className="mb-4">
                  <p className="font-medium mb-2">Pontos a serem abordados</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {['point1','point2','point3','point4','point5'].map((key, i) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={(formData as any)[key]}
                          onChange={e => handleChange(key, e.target.checked)}
                        />
                        <span>
                          {['Autocultivo medicinal','Jurisprudência favorável','Associações','Uso da planta in natura','Redução de custos'][i]}
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
                    className="textarea w-full"
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