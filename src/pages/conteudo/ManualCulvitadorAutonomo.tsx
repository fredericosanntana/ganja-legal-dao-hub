import React, { useState, useEffect, useCallback } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, BlobProvider } from '@react-pdf/renderer';
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Helvetica-Bold'
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'Helvetica-Bold'
  },
  paragraph: {
    marginBottom: 10,
    lineHeight: 1.5
  },
  list: {
    marginLeft: 20,
    marginBottom: 10
  },
  listItem: {
    marginBottom: 5
  }
});

// PDF Content
const ManualDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Manual do Cultivador Autônomo</Text>
        <Text style={styles.subtitle}>Introdução</Text>
        <Text style={styles.paragraph}>
          Este manual foi criado para auxiliar cultivadores autônomos a entenderem seus direitos e responsabilidades.
          Ele aborda desde os aspectos legais até as melhores práticas de cultivo.
        </Text>

        <Text style={styles.subtitle}>Aspectos Legais</Text>
        <Text style={styles.paragraph}>
          A legislação brasileira sobre o cultivo de cannabis é complexa e está em constante mudança.
          É fundamental estar atualizado sobre as leis e regulamentações em vigor.
        </Text>
        <Text style={styles.paragraph}>
          A posse e o cultivo para uso pessoal são temas de debate jurídico.
          Em geral, a lei distingue entre o usuário e o traficante, com penas mais brandas para o primeiro.
        </Text>

        <Text style={styles.subtitle}>Direitos do Cultivador</Text>
        <Text style={styles.paragraph}>
          O cultivador tem o direito de não ser tratado como criminoso, desde que possa comprovar que o cultivo
          é destinado ao uso pessoal ou medicinal.
        </Text>
        <Text style={styles.paragraph}>
          Em caso de abordagem policial, o cultivador tem o direito de permanecer em silêncio e de contatar um advogado.
        </Text>

        <Text style={styles.subtitle}>Obrigações do Cultivador</Text>
        <Text style={styles.paragraph}>
          O cultivador tem a obrigação de não fornecer cannabis a terceiros, especialmente menores de idade.
        </Text>
        <Text style={styles.paragraph}>
          É importante manter a discrição e evitar ostentar o cultivo, para não atrair a atenção das autoridades.
        </Text>

        <Text style={styles.subtitle}>Melhores Práticas de Cultivo</Text>
        <Text style={styles.paragraph}>
          Para garantir a qualidade e a segurança do seu cultivo, siga as seguintes recomendações:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>- Utilize sementes de boa procedência</Text>
          <Text style={styles.listItem}>- Monitore as condições de temperatura e umidade</Text>
          <Text style={styles.listItem}>- Utilize fertilizantes orgânicos</Text>
          <Text style={styles.listItem}>- Faça a colheita no momento certo</Text>
          <Text style={styles.listItem}>- Seque e cure a cannabis adequadamente</Text>
        </View>

        <Text style={styles.subtitle}>Recursos Adicionais</Text>
        <Text style={styles.paragraph}>
          Para saber mais sobre o cultivo de cannabis e seus aspectos legais, consulte os seguintes recursos:
        </Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>- Associações de cultivadores</Text>
          <Text style={styles.listItem}>- Grupos de discussão online</Text>
          <Text style={styles.listItem}>- Livros e artigos sobre o tema</Text>
        </View>
      </View>
    </Page>
  </Document>
);

const ManualCulvitadorAutonomo = () => {
  const [downloadLink, setDownloadLink] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [continueDownload, setContinueDownload] = useState(false);

  const generatePdfBlob = useCallback(async () => {
    setDownloadingPdf(true);
    try {
      const pdfBlob = await new Promise(resolve => {
        BlobProvider.toBlob(<ManualDocument />).then(blob => {
          resolve(blob);
        });
      });

      const url = URL.createObjectURL(pdfBlob);
      setDownloadLink(url);
      setContinueDownload(true);
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
    } finally {
      setDownloadingPdf(false);
    }
  }, []);

  useEffect(() => {
    if (!continueDownload) {
      generatePdfBlob();
    }
  }, [generatePdfBlob, continueDownload]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Manual do Cultivador Autônomo</h1>
        <p className="mb-4">
          Este manual foi criado para auxiliar cultivadores autônomos a entenderem seus direitos e responsabilidades.
          Ele aborda desde os aspectos legais até as melhores práticas de cultivo.
        </p>

        {!continueDownload ? (
          <Button 
            className="mt-6 inline-flex items-center text-white bg-green-600 hover:bg-green-700"
            disabled={true}
          >
            Baixar Manual em PDF
          </Button>
        ) : (
          <Button 
            className="mt-6 inline-flex items-center text-white bg-green-600 hover:bg-green-700"
            onClick={() => window.open(downloadLink, '_blank')}
          >
            {downloadingPdf ? 'Gerando PDF...' : 'Baixar Manual em PDF'}
          </Button>
        )}
      </div>
    </Layout>
  );
};

export default ManualCulvitadorAutonomo;
