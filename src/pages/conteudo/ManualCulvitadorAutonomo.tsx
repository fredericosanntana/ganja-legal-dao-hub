
import React, { useState, useCallback } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  listItem: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 2,
  },
});

// PDF Document Component
const ManualPDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>MANUAL DO CULTIVADOR AUTÔNOMO</Text>
        <Text style={styles.subtitle}>Orientações para cultivo medicinal</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>1. ASPECTOS LEGAIS</Text>
        <Text style={styles.text}>Para cultivar cannabis para fins medicinais no Brasil, é necessário:</Text>
        <Text style={styles.listItem}>- Habeas Corpus preventivo ou autorização judicial</Text>
        <Text style={styles.listItem}>- Prescrição médica para paciente com CID específico</Text>
        <Text style={styles.listItem}>- Associação a clube de cultivadores ou entidade representativa</Text>
        <Text style={styles.listItem}>- Documentação legal e técnica organizada e disponível</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>2. ESTRUTURA DE CULTIVO</Text>
        <Text style={styles.text}>Recomendações básicas para cultivadores iniciantes:</Text>
        <Text style={styles.listItem}>- Espaço dedicado e seguro, preferencialmente indoor</Text>
        <Text style={styles.listItem}>- Iluminação LED full spectrum com temporizador</Text>
        <Text style={styles.listItem}>- Sistema de ventilação adequado</Text>
        <Text style={styles.listItem}>- Controle de temperatura e umidade</Text>
        <Text style={styles.listItem}>- Substratos e nutrientes de qualidade</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>3. GENÉTICA E ESCOLHA DE VARIEDADES</Text>
        <Text style={styles.listItem}>- Variedades altas em CBD para tratamento de dor, ansiedade, epilepsia</Text>
        <Text style={styles.listItem}>- Variedades balanceadas CBD:THC para dores crônicas e condições neurológicas</Text>
        <Text style={styles.listItem}>- Variedades auto-florescentes para cultivadores iniciantes</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>4. CICLO DE CULTIVO</Text>
        <Text style={styles.listItem}>- Germinação: 3-7 dias</Text>
        <Text style={styles.listItem}>- Fase vegetativa: 4-8 semanas</Text>
        <Text style={styles.listItem}>- Fase de floração: 7-12 semanas</Text>
        <Text style={styles.listItem}>- Colheita, secagem e cura: 2-4 semanas</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>5. RECOMENDAÇÕES DE SEGURANÇA</Text>
        <Text style={styles.listItem}>- Cultive apenas a quantidade necessária para tratamento</Text>
        <Text style={styles.listItem}>- Mantenha documentação médica e legal sempre organizada</Text>
        <Text style={styles.listItem}>- Não comercialize o produto sob nenhuma circunstância</Text>
        <Text style={styles.listItem}>- Informe-se sobre atualizações na legislação</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>6. PRODUÇÃO DE EXTRATOS</Text>
        <Text style={styles.listItem}>- Extração em óleo: método mais seguro e comum</Text>
        <Text style={styles.listItem}>- Dosagem inicial: começar com doses baixas e aumentar gradualmente</Text>
        <Text style={styles.listItem}>- Armazenamento: frascos âmbar, local fresco e escuro</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.text}>Este manual é apenas informativo. Consulte sempre seu médico e um advogado especializado antes de iniciar o cultivo.</Text>
        <Text style={styles.text}>© GanjaDAO - Associação de Apoio a Pacientes e Cultivadores de Cannabis Medicinal</Text>
      </View>
    </Page>
  </Document>
);

const ManualCultivadorAutonomo = () => {
  const navigate = useNavigate();
  const [termoAceito, setTermoAceito] = useState(false);
  const [mostrarBotaoDownload, setMostrarBotaoDownload] = useState(false);

  const handleTermoChange = useCallback(() => {
    setTermoAceito(!termoAceito);
    if (!termoAceito) {
      setTimeout(() => {
        setMostrarBotaoDownload(true);
      }, 1000);
    }
  }, [termoAceito]);

  const handleDownload = useCallback((url: string | null) => {
    if (url) {
      // Create a temporary anchor to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'manual-cultivador-autonomo.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Manual do Cultivador Autônomo</h1>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <h2>Orientações para Cultivo Medicinal Responsável</h2>
              <p>Este manual foi desenvolvido para auxiliar pacientes e cuidadores que necessitam cultivar cannabis para fins medicinais, seguindo práticas responsáveis e dentro do contexto de autorizações judiciais.</p>
              
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
                <p className="text-amber-700">
                  <strong>AVISO IMPORTANTE:</strong> Este material possui caráter exclusivamente informativo e educacional. O cultivo de cannabis no Brasil é considerado ilícito, exceto em casos específicos com autorização judicial. Consulte sempre um advogado especializado antes de iniciar qualquer atividade relacionada ao cultivo.
                </p>
              </div>
              
              <h3>Conteúdo do Manual:</h3>
              <ol>
                <li><strong>Aspectos Legais</strong> - Documentação e requisitos judiciais</li>
                <li><strong>Estrutura de Cultivo</strong> - Configuração básica e equipamentos</li>
                <li><strong>Genética e Escolha de Variedades</strong> - Seleção apropriada para condições específicas</li>
                <li><strong>Ciclo de Cultivo</strong> - Desde germinação até colheita</li>
                <li><strong>Recomendações de Segurança</strong> - Boas práticas e precauções</li>
                <li><strong>Produção de Extratos</strong> - Métodos seguros para uso medicinal</li>
              </ol>
              
              <h3>Termo de Responsabilidade:</h3>
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox 
                  id="termo" 
                  checked={termoAceito}
                  onCheckedChange={handleTermoChange}
                />
                <label 
                  htmlFor="termo"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Declaro que estou ciente de que este material possui finalidade exclusivamente informativa e educacional. Compreendo que o cultivo de cannabis no Brasil é considerado ilícito, exceto em casos específicos com autorização judicial. Entendo que devo consultar um advogado especializado antes de iniciar qualquer atividade relacionada ao cultivo.
                </label>
              </div>
              
              {mostrarBotaoDownload && (
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  {termoAceito ? (
                    <PDFDownloadLink 
                      document={<ManualPDF />} 
                      fileName="manual-cultivador-autonomo.pdf"
                      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-primary-foreground h-10 px-4 py-2 bg-primary hover:bg-primary/90 ${!termoAceito ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {({ blob, url, loading, error }) =>
                        loading ? 'Gerando PDF...' : 'Baixar Manual em PDF'
                      }
                    </PDFDownloadLink>
                  ) : (
                    <Button
                      className="w-full sm:w-auto"
                      disabled={true}
                    >
                      Aceite o termo para baixar
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    onClick={() => navigate('/conteudo')}
                  >
                    Voltar para Conteúdos
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ManualCultivadorAutonomo;
