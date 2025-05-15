import React from 'react';
import Layout from '@/components/Layout';

// Conteúdo HTML e estilos para o Checklist Jurídico
const checklistJuridicoContent = `
    <h1>Seu Cultivo Está Seguro? – Checklist jurídico para não ser pego de surpresa</h1>
    <p class="lead">Um guia prático com os principais documentos e cuidados que todo cultivador precisa para evitar riscos legais. Rápido, direto e aplicável, oferecido pela GanjaDAO para fortalecer a comunidade de cultivadores conscientes e protegidos.</p>

    <p>No complexo cenário jurídico brasileiro, o cultivo de cannabis, mesmo para fins medicinais ou pessoais, ainda navega em águas turbulentas. A falta de informação clara e a constante ameaça de interpretações legais desfavoráveis colocam muitos cultivadores em uma posição de vulnerabilidade. É crucial entender que, embora a legislação possa parecer restritiva, existem caminhos e precauções que podem significativamente mitigar os riscos e proteger seu direito ao cultivo, especialmente quando amparado por uma necessidade legítima. A GanjaDAO, comprometida com a segurança e o empoderamento da comunidade, preparou este checklist detalhado para que você possa avaliar sua situação e tomar as medidas necessárias para cultivar com mais tranquilidade e segurança jurídica. Este não é um conselho legal definitivo, mas um ponto de partida robusto para sua jornada de cultivo protegido.</p>

    <h2>Entendendo o Panorama Legal Brasileiro sobre o Cultivo de Cannabis</h2>
    <p>Antes de mergulharmos no checklist propriamente dito, é fundamental ter uma compreensão básica do que a lei brasileira diz sobre o cultivo de cannabis. A Lei nº 11.343/2006, conhecida como Lei de Drogas, criminaliza o plantio, a cultura, a colheita e a exploração de vegetais e substratos dos quais possam ser extraídas ou produzidas drogas, ressalvada a autorização legal ou regulamentar. No entanto, a mesma lei abre exceções para o plantio, cultura e colheita para fins medicinais e científicos, mediante autorização da União. É nesse contexto que os Habeas Corpus (HCs) preventivos e as autorizações judiciais têm ganhado espaço, permitindo que pacientes e pesquisadores cultivem legalmente. A jurisprudência tem evoluído, reconhecendo o direito à saúde e a dignidade da pessoa humana como fundamentos para permitir o autocultivo em casos específicos, especialmente quando há prescrição médica e a ineficácia ou inacessibilidade dos tratamentos convencionais ou dos produtos à base de cannabis disponíveis no mercado.</p>
    <p>A Agência Nacional de Vigilância Sanitária (ANVISA) também possui regulamentações que permitem a importação de produtos à base de cannabis e, mais recentemente, a venda de alguns produtos em farmácias. Contudo, o cultivo doméstico ainda carece de uma regulamentação específica e abrangente, o que gera insegurança. É por isso que a documentação correta e a adoção de práticas que demonstrem a finalidade terapêutica e a ausência de intenção de tráfico são tão importantes. A GanjaDAO busca, através de seus serviços e informações, preencher essa lacuna, oferecendo suporte para que os cultivadores possam se resguardar.</p>

    <h2>Checklist Jurídico Essencial para Cultivadores</h2>
    <p>Este checklist foi elaborado para ajudá-lo a organizar sua documentação e suas práticas de cultivo, minimizando os riscos legais. Lembre-se que cada caso é único, e a consulta a um profissional do direito especializado é sempre recomendada.</p>

    <div class="checklist-item">
        <h3>1. Documentação Médica Robusta e Atualizada: A Base da Sua Defesa</h3>
        <p><strong>O que verificar:</strong></p>
        <ul>
            <li><strong>Laudo Médico Detalhado:</strong> Você possui um laudo médico recente (idealmente emitido nos últimos 6 a 12 meses) que ateste sua condição de saúde, a indicação do uso da cannabis medicinal, a posologia (quantidade e frequência de uso), e, crucialmente, a justificativa para o autocultivo? O laudo deve explicar por que outras terapias foram ineficazes ou por que os produtos disponíveis no mercado não são adequados ou acessíveis para o seu caso (custo elevado, baixa disponibilidade, etc.).</li>
            <li><strong>Prescrição Médica Específica:</strong> Além do laudo, você tem uma prescrição médica clara para o uso da cannabis, especificando a forma de uso e a quantidade estimada de plantas ou de produto final necessário para o seu tratamento contínuo?</li>
            <li><strong>CID (Classificação Internacional de Doenças):</strong> O laudo e a prescrição contêm o CID da sua patologia? Isso confere maior formalidade e clareza à documentação.</li>
            <li><strong>Histórico Médico Consistente:</strong> Você mantém um histórico de consultas, exames e tratamentos anteriores que corroboram a sua condição e a necessidade da cannabis?</li>
            <li><strong>Profissional Habilitado:</strong> O médico que emitiu o laudo e a prescrição está devidamente registrado no Conselho Regional de Medicina (CRM) e possui conhecimento sobre o uso terapêutico da cannabis?</li>
        </ul>
        <p><strong>Por que é importante?</strong> A documentação médica é a espinha dorsal de qualquer defesa em casos de autocultivo para fins medicinais. Ela demonstra a finalidade terapêutica do seu cultivo e afasta a presunção de tráfico. Quanto mais detalhada e bem fundamentada for essa documentação, maiores são suas chances de obter um Habeas Corpus preventivo ou de ter uma defesa bem-sucedida caso haja alguma intercorrência legal.</p>
    </div>

    <div class="checklist-item">
        <h3>2. Autorizações e Registros (Quando Aplicável e Possível)</h3>
        <p><strong>O que verificar:</strong></p>
        <ul>
            <li><strong>Autorização da ANVISA para Importação (se já obteve):</strong> Se você já teve autorização para importar produtos à base de cannabis, guarde esses documentos. Eles podem reforçar a legitimidade da sua necessidade terapêutica, embora não autorizem o cultivo diretamente.</li>
            <li><strong>Pedido de Habeas Corpus Preventivo:</strong> Você já consultou um advogado sobre a possibilidade de impetrar um Habeas Corpus preventivo para garantir o direito ao seu cultivo? A GanjaDAO pode oferecer suporte e direcionamento nesse processo. Ter um HC é a forma mais segura de cultivar.</li>
            <li><strong>Cadastro em Associações de Pacientes:</strong> Estar vinculado a uma associação de pacientes de cannabis medicinal pode oferecer suporte jurídico, informações e fortalecer sua posição, demonstrando que você faz parte de uma comunidade organizada que busca o tratamento legalizado.</li>
        </ul>
        <p><strong>Por que é importante?</strong> Embora o HC preventivo seja o ideal, outras autorizações e registros demonstram sua boa-fé e sua busca por vias legais para o tratamento. Associações também podem fornecer um amparo importante e acesso a recursos jurídicos coletivos.</p>
    </div>

    <div class="checklist-item">
        <h3>3. Práticas de Cultivo Conscientes e Seguras</h3>
        <p><strong>O que verificar:</strong></p>
        <ul>
            <li><strong>Quantidade de Plantas Condizente com o Uso Pessoal:</strong> O número de plantas que você cultiva é compatível com a sua prescrição médica e seu consumo pessoal? Evite quantidades excessivas que possam ser interpretadas como destinadas ao tráfico. Um diário de cultivo e de consumo pode ajudar a justificar a quantidade.</li>
            <li><strong>Local de Cultivo Discreto e Seguro:</strong> Seu cultivo está em local discreto, protegido de acesso por terceiros (especialmente crianças e adolescentes) e sem ostentação? A discrição é uma aliada importante.</li>
            <li><strong>Ausência de Indícios de Tráfico:</strong> Você não possui balanças de precisão (a menos que justificável para a produção do seu próprio óleo, com documentação), grandes quantidades de dinheiro em espécie sem origem comprovada, embalagens para venda, anotações de contabilidade de vendas, ou qualquer outro material que possa caracterizar atividade de tráfico?</li>
            <li><strong>Finalidade Exclusivamente Pessoal:</strong> O cultivo é estritamente para seu uso pessoal e intransferível? Não doe, não venda, não compartilhe sua produção com terceiros, mesmo que também sejam pacientes. Isso pode descaracterizar o autocultivo e configurar tráfico.</li>
            <li><strong>Conhecimento sobre o Cultivo:</strong> Você busca informações sobre as melhores práticas de cultivo, controle de pragas de forma orgânica e segura, e processamento do seu medicamento? Demonstrar conhecimento e cuidado com o processo reforça a seriedade do seu cultivo.</li>
        </ul>
        <p><strong>Por que é importante?</strong> As práticas de cultivo são observadas de perto em qualquer investigação. Manter um cultivo organizado, limpo, seguro e focado no consumo pessoal, sem qualquer indício de comercialização, é fundamental para evitar interpretações equivocadas por parte das autoridades.</p>
    </div>

    <div class="checklist-item">
        <h3>4. Conhecimento dos Seus Direitos e Como Agir</h3>
        <p><strong>O que verificar:</strong></p>
        <ul>
            <li><strong>Direito de Permanecer em Silêncio:</strong> Você sabe que tem o direito de não produzir provas contra si mesmo e de permanecer em silêncio durante uma abordagem policial ou interrogatório?</li>
            <li><strong>Direito a um Advogado:</strong> Você tem o contato de um advogado de confiança, preferencialmente especializado na área, para acionar imediatamente em caso de necessidade? A GanjaDAO pode ter indicações.</li>
            <li><strong>Como Agir em Caso de Abordagem Policial:</strong> Mantenha a calma, seja respeitoso, apresente sua documentação médica (se solicitado e se sentir seguro), mas não autorize a entrada em sua residência sem mandado judicial, a menos que orientado por seu advogado. Grave a abordagem, se possível e seguro.</li>
            <li><strong>Mandado Judicial:</strong> Verifique a validade e os termos de qualquer mandado judicial apresentado. Ele deve especificar o endereço correto e o que pode ser buscado.</li>
        </ul>
        <p><strong>Por que é importante?</strong> Conhecer seus direitos é o primeiro passo para se proteger de abusos e garantir que seus interesses sejam preservados. Agir com calma e estratégia, e acionar um profissional do direito o mais rápido possível, pode fazer toda a diferença.</p>
    </div>

    <div class="checklist-item">
        <h3>5. Rede de Apoio e Informação</h3>
        <p><strong>O que verificar:</strong></p>
        <ul>
            <li><strong>Comunidade e Associações:</strong> Você participa de grupos de discussão, associações de pacientes ou outras redes que oferecem informação e suporte sobre o cultivo medicinal e os aspectos jurídicos?</li>
            <li><strong>Informação Atualizada:</strong> Você se mantém atualizado sobre as mudanças na legislação, novas decisões judiciais e as melhores práticas de segurança jurídica? Acompanhe os canais da GanjaDAO e outras fontes confiáveis.</li>
            <li><strong>Suporte Familiar e Social:</strong> Sua família e pessoas próximas estão cientes da sua necessidade terapêutica e apoiam seu tratamento? O suporte social pode ser importante em momentos de dificuldade.</li>
        </ul>
        <p><strong>Por que é importante?</strong> Você não está sozinho. Conectar-se com outras pessoas na mesma situação e buscar informação de qualidade fortalece sua posição e oferece amparo emocional e prático.</p>
    </div>

    <h2>A GanjaDAO ao Seu Lado</h2>
    <p>Este checklist é um ponto de partida. A GanjaDAO está aqui para oferecer mais do que informação: buscamos construir uma rede de proteção e empoderamento para cultivadores. Nossos serviços incluem o desenvolvimento de Habeas Corpus digitais automatizados, que visam facilitar o acesso à proteção jurídica, além de uma vasta gama de conteúdos informativos e uma comunidade engajada. Entendemos que a jornada do cultivador medicinal no Brasil ainda é repleta de desafios, mas acreditamos que, com a informação correta, a documentação adequada e o apoio mútuo, podemos avançar rumo a um cenário mais justo e seguro para todos.</p>
    <p>Se, ao revisar este checklist, você identificar lacunas na sua documentação ou práticas, não se desespere. O importante é começar a agir agora. Busque orientação médica, organize seus documentos, ajuste suas práticas de cultivo e, se necessário, procure aconselhamento jurídico especializado. A prevenção é sempre o melhor caminho. Conte com a GanjaDAO para trilhar essa jornada com mais segurança e confiança. Juntos, podemos fortalecer o direito ao cultivo e à saúde.</p>
    <p>Lembre-se: a informação é sua maior aliada. Compartilhe este checklist com outros cultivadores e ajude a disseminar o conhecimento que protege. A segurança de um é a segurança de todos na comunidade GanjaDAO.</p>
`;

const checklistJuridicoStyles = `
  .conteudo-pagina-interna {
    padding: 20px;
    line-height: 1.6;
    max-width: 800px; /* Limita a largura para melhor leitura */
    margin: 0 auto; /* Centraliza */
  }
  .conteudo-pagina-interna h1 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 2em; /* Ajuste de tamanho */
  }
  .conteudo-pagina-interna h2 {
    color: #34495e;
    margin-top: 30px;
    margin-bottom: 15px;
    font-size: 1.5em; /* Ajuste de tamanho */
  }
  .conteudo-pagina-interna p {
    margin-bottom: 15px;
    text-align: justify;
  }
  .conteudo-pagina-interna ul {
    margin-left: 20px;
    margin-bottom: 15px;
    list-style-type: disc; /* Garante estilo de lista */
  }
  .conteudo-pagina-interna li {
    margin-bottom: 8px;
  }
  .conteudo-pagina-interna .lead {
    font-size: 1.1em;
    font-weight: 500;
  }
  .checklist-item {
    padding: 15px;
    border: 1px solid #e2e8f0; /* Cor do Tailwind slate-200 */
    margin-bottom: 15px;
    border-radius: 8px; /* Tailwind rounded-lg */
    background-color: #f8fafc; /* Cor do Tailwind slate-50 */
  }
  .checklist-item h3 {
    color: #1e293b; /* Cor do Tailwind slate-800 */
    margin-bottom: 10px;
    font-size: 1.25em;
  }
  .checklist-item strong {
    color: #2563eb; /* Cor do Tailwind blue-600 */
  }
`;

const CheckListJuridicoPage: React.FC = () => {
  return (
    <Layout>
      <style>{checklistJuridicoStyles}</style>
      <main className="container mx-auto">
        <section className="conteudo-pagina-interna py-8">
          <div dangerouslySetInnerHTML={{ __html: checklistJuridicoContent }} />
        </section>
      </main>
    </Layout>
  );
};

export default CheckListJuridicoPage;

