import React from 'react';
import Layout from '@/components/Layout';

// Conteúdo HTML e estilos para Bastidores da GanjaDAO
const bastidoresGanjadaoContent = `
    <h1>Bastidores da GanjaDAO – Como Nasce um HC que Protege em Rede</h1>
    <p class="lead">A GanjaDAO se orgulha de sua transparência e inovação. Convidamos você a conhecer os bastidores da criação do nosso Habeas Corpus (HC) Digital automatizado, uma ferramenta poderosa desenvolvida para democratizar o acesso à proteção jurídica para cultivadores medicinais. Entender esse processo é fundamental para construir a confiança mútua que fortalece nossa rede.</p>

    <p>O Habeas Corpus é um instrumento jurídico fundamental que visa proteger o direito de ir e vir contra ilegalidades ou abuso de poder. No contexto do cultivo de cannabis para fins medicinais, o HC preventivo busca garantir que o paciente não seja preso ou processado criminalmente por cultivar a planta necessária ao seu tratamento, desde que comprovada a necessidade terapêutica e a ausência de finalidade de tráfico. Tradicionalmente, a obtenção de um HC envolve um processo jurídico complexo, custoso e demorado, muitas vezes inacessível para grande parte da população. Foi pensando em superar essas barreiras que a GanjaDAO desenvolveu uma solução inovadora: o HC Digital automatizado.</p>

    <h2>A Gênese do HC Digital Automatizado: Tecnologia a Serviço do Direito</h2>
    <p>A ideia por trás do HC Digital da GanjaDAO é simples, mas revolucionária: utilizar a tecnologia para simplificar, agilizar e baratear a elaboração de petições de Habeas Corpus preventivo. Isso não significa substituir o papel crucial do advogado, mas sim fornecer uma ferramenta que otimiza a coleta de informações, a estruturação da argumentação jurídica com base em teses já consolidadas e a geração de documentos preliminares. O objetivo é empoderar o cidadão e facilitar o trabalho dos profissionais do direito que atuam em defesa dos cultivadores.</p>
    <p>Nosso sistema foi construído com base em um extenso estudo da legislação pertinente, da jurisprudência atualizada dos tribunais brasileiros e das melhores práticas na elaboração de HCs para casos de autocultivo. Contamos com a colaboração de juristas experientes e desenvolvedores dedicados para criar uma plataforma que seja, ao mesmo tempo, robusta juridicamente e amigável para o usuário.</p>

    <h2>O Processo de Geração do HC Digital na GanjaDAO: Passo a Passo</h2>
    <p>A criação de um HC Digital através da plataforma GanjaDAO segue um fluxo cuidadosamente desenhado para garantir a precisão das informações e a solidez do documento gerado. A transparência em cada etapa é um compromisso nosso:</p>

    <div class="etapa-hc">
        <h3>1. Cadastro e Coleta Inicial de Informações</h3>
        <p>O primeiro passo é o cadastro do usuário em nossa plataforma segura. Solicitamos informações básicas de identificação e contato. Em seguida, o usuário é guiado por um formulário inteligente que coleta dados essenciais sobre sua condição de saúde, a indicação para o uso de cannabis medicinal e as características do seu cultivo (quantidade de plantas, local, etc.). Todas as informações são tratadas com o mais alto nível de sigilo e segurança de dados, em conformidade com a Lei Geral de Proteção de Dados (LGPD).</p>
        <p><strong>Tecnologia em ação:</strong> Utilizamos formulários dinâmicos e validações automáticas para garantir que as informações sejam inseridas de forma correta e completa, minimizando erros e a necessidade de retrabalho.</p>
    </div>

    <div class="etapa-hc">
        <h3>2. Upload de Documentação Comprobatória</h3>
        <p>A robustez de um HC depende fundamentalmente da qualidade da documentação que o acompanha. Nossa plataforma permite o upload seguro de documentos cruciais, como laudos médicos detalhados, prescrições, documentos de identidade, comprovante de residência e, se houver, autorizações prévias da ANVISA ou outros documentos que reforcem a necessidade terapêutica e a boa-fé do cultivador. O sistema orienta sobre quais documentos são necessários e oferece dicas para garantir que estejam legíveis e completos.</p>
        <p><strong>Tecnologia em ação:</strong> A plataforma utiliza criptografia para proteger os documentos enviados e armazena os arquivos em servidores seguros. Oferecemos também ferramentas de organização para que o usuário possa gerenciar sua documentação de forma eficiente.</p>
    </div>

    <div class="etapa-hc">
        <h3>3. Análise Automatizada e Geração da Minuta da Petição</h3>
        <p>Com base nas informações e documentos fornecidos, nosso sistema realiza uma análise automatizada. Ele cruza os dados do usuário com um banco de teses jurídicas e modelos de petição previamente elaborados e validados por nossa equipe jurídica. O algoritmo identifica os argumentos mais pertinentes para o caso específico e estrutura uma minuta da petição de Habeas Corpus. Esta minuta inclui a qualificação das partes, a exposição dos fatos, a fundamentação jurídica (com citação de leis e jurisprudência relevante) e os pedidos.</p>
        <p><strong>Tecnologia em ação:</strong> Utilizamos inteligência artificial e processamento de linguagem natural para auxiliar na interpretação das informações e na seleção dos argumentos jurídicos mais adequados. Isso garante agilidade e consistência na elaboração da minuta.</p>
    </div>

    <div class="etapa-hc">
        <h3>4. Revisão e Complementação pelo Usuário (e/ou Advogado)</h3>
        <p>A minuta gerada pelo sistema é disponibilizada para o usuário. Ele pode revisá-la, fazer ajustes e complementar informações, se necessário. É importante ressaltar que, embora nosso sistema seja avançado, a GanjaDAO sempre recomenda que a petição final seja revisada por um advogado de confiança do usuário antes de ser protocolada no tribunal. Nossa plataforma pode, inclusive, facilitar a comunicação entre o usuário e seu advogado, permitindo o compartilhamento seguro da minuta.</p>
        <p><strong>Tecnologia em ação:</strong> Oferecemos um editor de texto integrado à plataforma para facilitar a revisão e edição da minuta. O sistema também mantém um histórico de versões para controle.</p>
    </div>

    <div class="etapa-hc">
        <h3>5. Geração do Documento Final e Orientações para Protocolo</h3>
        <p>Após a revisão e eventuais ajustes, o usuário pode gerar o documento final da petição de Habeas Corpus em formato PDF, pronto para ser assinado (digitalmente ou fisicamente) e protocolado. A GanjaDAO também fornece orientações gerais sobre como realizar o protocolo nos diferentes tribunais, embora os procedimentos específicos possam variar e devam ser confirmados junto ao órgão competente ou com o auxílio de um advogado.</p>
        <p><strong>Tecnologia em ação:</strong> O sistema formata automaticamente a petição de acordo com os padrões geralmente aceitos, incluindo numeração de páginas, cabeçalho e rodapé, facilitando a apresentação do documento.</p>
    </div>

    <h2>Transparência e Melhoria Contínua</h2>
    <p>Todo esse processo é desenhado com foco na transparência. Queremos que nossos usuários entendam como suas informações são utilizadas e como a tecnologia pode ser uma aliada na busca por seus direitos. Acreditamos que essa abertura é essencial para construir uma relação de confiança com a comunidade GanjaDAO.</p>
    <p>Além disso, nosso sistema está em constante evolução. Coletamos feedback dos usuários e da nossa equipe jurídica para aprimorar continuamente nossos algoritmos, modelos de petição e a usabilidade da plataforma. Novas decisões judiciais e alterações legislativas são monitoradas e incorporadas ao sistema para garantir que os HCs gerados estejam sempre atualizados e alinhados com o entendimento jurídico mais recente.</p>

    <div class="fluxograma-container">
        <p><strong>Fluxo Simplificado da Geração do HC Digital GanjaDAO:</strong></p>
        <ol>
            <li>Usuário se cadastra e insere dados.</li>
            <li>Usuário faz upload de documentos médicos e pessoais.</li>
            <li>Sistema GanjaDAO analisa dados e documentos.</li>
            <li>Sistema GanjaDAO gera minuta da petição de HC.</li>
            <li>Usuário (e/ou advogado) revisa e ajusta a minuta.</li>
            <li>Sistema GanjaDAO gera petição final em PDF.</li>
            <li>Usuário protocola o HC no tribunal competente.</li>
        </ol>
    </div>

    <h2>O Futuro é Colaborativo e Protegido em Rede</h2>
    <p>O HC Digital automatizado da GanjaDAO é mais do que uma ferramenta tecnológica; é um passo em direção a um futuro onde o acesso à justiça é mais democrático e a proteção jurídica está ao alcance de todos que dela necessitam. Ao desmistificar e simplificar a criação de um Habeas Corpus, empoderamos os cultivadores medicinais e fortalecemos toda uma comunidade que luta pelo direito à saúde e pela regulamentação justa do cultivo de cannabis.</p>
    <p>Convidamos você a fazer parte dessa rede. Conheça nossa plataforma, utilize nossos serviços e compartilhe sua experiência. Juntos, podemos construir um ecossistema de proteção mútua, onde a transparência e a tecnologia caminham lado a lado com a justiça. A GanjaDAO está comprometida em ser a vanguarda dessa transformação, sempre com o apoio e a participação ativa de nossa comunidade.</p>
`;

const bastidoresGanjadaoStyles = `
  .conteudo-pagina-interna {
    padding: 20px;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
  }
  .conteudo-pagina-interna h1 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 2em;
  }
  .conteudo-pagina-interna h2 {
    color: #34495e;
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 1.5em;
  }
  .conteudo-pagina-interna p {
    margin-bottom: 15px;
    text-align: justify;
  }
  .conteudo-pagina-interna ul, .conteudo-pagina-interna ol {
    margin-left: 20px;
    margin-bottom: 15px;
    list-style-position: inside;
  }
  .conteudo-pagina-interna li {
    margin-bottom: 8px;
  }
  .conteudo-pagina-interna .lead {
    font-size: 1.1em;
    font-weight: 500;
  }
  .etapa-hc {
    padding: 15px;
    border: 1px solid #e2e8f0; /* slate-200 */
    margin-bottom: 15px;
    border-radius: 8px; /* rounded-lg */
    background-color: #f8fafc; /* slate-50 */
  }
  .etapa-hc h3 {
    color: #1d4ed8; /* blue-700 */
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.25em;
  }
  .fluxograma-container {
    text-align: center;
    margin: 30px 0;
  }
  .fluxograma-container img {
    max-width: 100%;
    height: auto;
    border: 1px solid #cbd5e1; /* slate-300 */
    border-radius: 5px;
  }
  .fluxograma-container ol {
    text-align: left;
    display: inline-block;
  }
`;

const BastidoresGanjadaoPage: React.FC = () => {
  return (
    <Layout>
      <style>{bastidoresGanjadaoStyles}</style>
      <main className="container mx-auto">
        <section className="conteudo-pagina-interna py-8">
          <div dangerouslySetInnerHTML={{ __html: bastidoresGanjadaoContent }} />
        </section>
      </main>
    </Layout>
  );
};

export default BastidoresGanjadaoPage;

