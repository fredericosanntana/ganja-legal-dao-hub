import React from 'react';
import Layout from '@/components/Layout';

// Conteúdo HTML e estilos para Mitos e Verdades HC Digital
const mitosVerdadesHcDigitalContent = `
    <h1>“Isso é mesmo válido na Justiça?” – Mitos e verdades sobre o HC Digital</h1>
    <p class="lead">A inovação tecnológica frequentemente desperta dúvidas, especialmente quando se cruza com áreas tradicionais como o Direito. O Habeas Corpus (HC) Digital, uma das soluções pioneiras da GanjaDAO, não é exceção. Muitos se perguntam sobre sua validade, eficácia e como ele se compara ao HC tradicional. Para desmistificar o tema e trazer clareza à comunidade, preparamos este guia com os principais mitos e verdades sobre o HC Digital, sempre com uma explicação jurídica acessível.</p>

    <p>O Habeas Corpus é uma garantia constitucional fundamental, prevista no artigo 5º, inciso LXVIII, da Constituição Federal, destinada a proteger o direito à liberdade de locomoção contra ilegalidade ou abuso de poder. No contexto do autocultivo de cannabis para fins medicinais, o HC preventivo busca assegurar que o paciente não seja preso ou processado por cultivar a planta para seu tratamento. A GanjaDAO, ao desenvolver o HC Digital, visa democratizar o acesso a essa proteção, utilizando a tecnologia para otimizar a elaboração da petição. Mas será que essa modernização compromete sua validade jurídica? Vamos analisar.</p>

    <h2>Desvendando o HC Digital:</h2>

    <div class="mito-verdade mito">
        <h3><strong>Mito 1:</strong> O HC Digital é menos válido ou \"mais fraco\" que um HC feito inteiramente por um advogado.</h3>
        <p class="explicacao-juridica">
            <strong>Explicação:</strong> Isso é um grande equívoco. A validade de uma petição de Habeas Corpus não reside na forma como ela foi elaborada (manual ou com auxílio de tecnologia), mas sim na solidez de seus fundamentos jurídicos, na qualidade da documentação comprobatória e na correta adequação ao caso concreto. O HC Digital da GanjaDAO é uma ferramenta que auxilia na organização das informações e na estruturação da petição com base em teses jurídicas consolidadas e jurisprudência atual. A petição gerada é um documento jurídico formal que, uma vez assinado (pelo próprio paciente, em caso de HC impetrado por ele mesmo, ou por um advogado) e protocolado no tribunal competente, tem a mesma validade que qualquer outro HC. A tecnologia aqui é um meio, não um fim que diminua o rigor jurídico.
        </p>
    </div>

    <div class="mito-verdade verdade">
        <h3><strong>Verdade 1:</strong> O HC Digital da GanjaDAO utiliza fundamentos legais e jurisprudência atualizada.</h3>
        <p class="explicacao-juridica">
            <strong>Explicação:</strong> Sim, este é um pilar da nossa plataforma. O sistema da GanjaDAO é constantemente alimentado e atualizado por nossa equipe jurídica com as leis pertinentes (Constituição Federal, Lei de Drogas, resoluções da ANVISA, etc.) e as decisões mais recentes dos tribunais superiores (STF e STJ) e tribunais regionais sobre o tema do autocultivo para fins medicinais. Isso garante que as minutas de HC geradas estejam embasadas nos entendimentos jurídicos mais atuais, aumentando as chances de êxito. A tecnologia permite que essa atualização seja mais ágil e abrangente do que seria possível em um processo puramente manual e individualizado para cada caso desde o zero.
        </p>
    </div>

    <div class="mito-verdade mito">
        <h3><strong>Mito 2:</strong> Qualquer pessoa pode simplesmente preencher um formulário online e conseguir um HC automaticamente, sem necessidade de análise.</h3>
        <p class="explicacao-juridica">
            <strong>Explicação:</strong> Embora a plataforma da GanjaDAO simplifique significativamente o processo de coleta de dados e elaboração da minuta, ela não elimina a necessidade de uma documentação robusta e de uma análise criteriosa. O usuário precisa fornecer laudos médicos detalhados, prescrições e outras provas que justifiquem a necessidade do cultivo medicinal. A plataforma organiza esses dados, mas a decisão final de conceder o HC é sempre do Poder Judiciário, após análise do caso concreto. Além disso, a GanjaDAO sempre recomenda que la minuta gerada seja revisada por um advogado, que poderá fazer ajustes finos e garantir a melhor estratégia para o caso específico antes do protocolo.
        </p>
    </div>

    <div class="mito-verdade verdade">
        <h3><strong>Verdade 2:</strong> O HC Digital pode tornar o acesso à proteção jurídica mais rápido e acessível financeiramente.</h3>
        <p class="explicacao-juridica">
            <strong>Explicação:</strong> Este é um dos grandes benefícios e objetivos da GanjaDAO. Ao automatizar parte do processo de elaboração da petição, reduzimos o tempo e os custos envolvidos. A plataforma permite que o paciente organize sua documentação e tenha uma minuta de HC bem estruturada de forma mais ágil. Isso pode significar uma economia considerável em honorários advocatícios, especialmente na fase inicial de elaboração. A democratização do acesso à justiça é uma meta central, e a tecnologia é uma aliada poderosa para alcançá-la, tornando a proteção jurídica uma realidade para mais pessoas.
        </p>
    </div>

    <div class="mito-verdade mito">
        <h3><strong>Mito 3:</strong> O HC Digital substitui completamente o trabalho do advogado.</h3>
        <p class="explicacao-juridica">
            <strong>Explicação:</strong> De forma alguma. A plataforma da GanjaDAO é uma ferramenta de auxílio, tanto para o paciente quanto para o advogado. Ela otimiza a criação da petição inicial, mas o conhecimento técnico, a experiência e a estratégia processual de um advogado continuam sendo insubstituíveis, especialmente em casos mais complexos ou se houver necessidade de sustentações orais, recursos, etc. Encorajamos fortemente que os usuários consultem advogados e que os próprios advogados utilizem nossa plataforma para agilizar seu trabalho e atender mais clientes de forma eficiente. A tecnologia e o profissional do direito são parceiros, não concorrentes, na busca pela justiça.
        </p>
    </div>

    <div class="mito-verdade verdade">
        <h3><strong>Verdade 3:</strong> O Poder Judiciário aceita petições de HC elaboradas com auxílio de ferramentas digitais.</h3>
        <p class="explicacao-juridica">
            <strong>Explicação:</strong> Sim. O Judiciário está cada vez mais digitalizado (Processo Judicial Eletrônico - PJe, e-SAJ, etc.). O que importa para o tribunal é o conteúdo da petição, a clareza dos fatos, a consistência da argumentação jurídica, a qualidade das provas e o cumprimento dos requisitos formais (endereçamento correto, qualificação das partes, pedido, assinatura, etc.). A forma como a petição foi redigida – se em um editor de texto comum ou com auxílio de uma plataforma como a da GanjaDAO – é irrelevante para sua admissibilidade, desde que o resultado final seja um documento jurídico válido e bem fundamentado. O HC pode, inclusive, ser impetrado pelo próprio paciente (jus postulandi em HC), sem necessidade de advogado em um primeiro momento, embora a assistência técnica seja sempre recomendável.
        </p>
    </div>

    <div class="mito-verdade mito">
        <h3><strong>Mito 4:</strong> Um HC Digital garante 100% de certeza de que não terei problemas com a polícia.</h3>
        <p class="explicacao-juridica">
            <strong>Explicação:</strong> Nenhum Habeas Corpus, seja ele digital ou tradicional, oferece uma garantia absoluta de 100% contra qualquer tipo de abordagem ou mal-entendido. O HC preventivo é uma ordem judicial que visa impedir uma prisão ou processo ilegal ANTES que aconteça, com base na demonstração da legalidade do cultivo para fins medicinais. Ele é uma ferramenta de proteção jurídica extremamente forte. No entanto, em uma situação de abordagem, é crucial manter a calma, apresentar a decisão judicial (o HC) e, se necessário, contatar seu advogado. O HC aumenta exponencialmente sua segurança, mas a prudência e o conhecimento dos seus direitos continuam sendo importantes.
        </p>
    </div>

    <div class="mito-verdade verdade">
        <h3><strong>Verdade 4:</strong> A GanjaDAO se preocupa com a segurança e o sigilo dos meus dados ao usar o HC Digital.</h3>
        <p class="explicacao-juridica">
            <strong>Explicação:</strong> Absolutamente. A segurança e a privacidade dos dados de nossos usuários são prioridade máxima. Nossa plataforma é desenvolvida com protocolos de segurança robustos, criptografia de ponta a ponta para os documentos enviados e conformidade com a Lei Geral de Proteção de Dados (LGPD). Entendemos a sensibilidade das informações compartilhadas e garantimos um ambiente digital seguro e confiável para que você possa buscar sua proteção jurídica com tranquilidade.
        </p>
    </div>

    <h2>Conclusão: Tecnologia e Direito de Mãos Dadas pela Justiça</h2>
    <p>O HC Digital da GanjaDAO representa um avanço significativo na democratização do acesso à justiça para cultivadores medicinais. Ele não é uma \"solução mágica\" nem um substituto para o trabalho essencial dos advogados, mas sim uma poderosa ferramenta que, combinando tecnologia e conhecimento jurídico, torna a busca pela proteção legal mais acessível, ágil e financeiramente viável. Ao desmistificar as dúvidas e apresentar os fatos, esperamos que a comunidade se sinta mais confiante e segura para utilizar essa inovação em favor de seu direito à saúde e à liberdade.</p>
    <p>A GanjaDAO reitera seu compromisso com a transparência, a informação de qualidade e o desenvolvimento de soluções que realmente façam a diferença na vida das pessoas. Se você ainda tem dúvidas, entre em contato conosco. Estamos aqui para ajudar!</p>
`;

const mitosVerdadesHcDigitalStyles = `
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
  .conteudo-pagina-interna .lead {
    font-size: 1.1em;
    font-weight: 500;
  }
  .mito-verdade {
    margin-bottom: 25px;
    padding: 15px;
    border-radius: 8px; /* Tailwind rounded-lg */
  }
  .mito {
    background-color: #fee2e2; /* Tailwind red-100 */
    border-left: 5px solid #ef4444; /* Tailwind red-500 */
  }
  .verdade {
    background-color: #dcfce7; /* Tailwind green-100 */
    border-left: 5px solid #22c55e; /* Tailwind green-500 */
  }
  .mito-verdade h3 {
    margin-top: 0;
    font-size: 1.3em;
    margin-bottom: 10px;
  }
  .mito h3 strong {
    color: #b91c1c; /* Tailwind red-700 */
  }
  .verdade h3 strong {
    color: #15803d; /* Tailwind green-700 */
  }
  .explicacao-juridica {
    font-size: 0.95em;
    color: #374151; /* Tailwind gray-700 */
  }
`;

const MitosVerdadesHcDigitalPage: React.FC = () => {
  return (
    <Layout>
      <style>{mitosVerdadesHcDigitalStyles}</style>
      <main className="container mx-auto">
        <section className="conteudo-pagina-interna py-8">
          <div dangerouslySetInnerHTML={{ __html: mitosVerdadesHcDigitalContent }} />
        </section>
      </main>
    </Layout>
  );
};

export default MitosVerdadesHcDigitalPage;

