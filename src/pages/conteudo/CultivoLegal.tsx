import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom'; // Importar Link para o botão de engajamento

// Conteúdo HTML e estilos para Cultivo Legal
const cultivoLegalContent = `
    <h1>Cultivo Legal – Como Descentralizar o Direito à Planta</h1>
    <p class="lead">A luta pelo direito ao cultivo de cannabis medicinal e pela reforma da política de drogas no Brasil é multifacetada, mas uma dimensão crucial frequentemente negligenciada é o impacto desproporcional da criminalização nas comunidades periféricas. Nos territórios historicamente marginalizados pelo Estado, que a guerra às drogas mostra sua face mais cruel, encarcerando jovens, desestruturando famílias e perpetuando ciclos de violência e exclusão. A GanjaDAO acredita que descentralizar o direito à planta é também uma forma de promover justiça social e reparação histórica. Este é um chamado à reflexão e à ação para ativistas periféricos e todos que sonham com um futuro mais justo.</p>

    <p>Enquanto o debate sobre a legalização avança em certos círculos, e o acesso a produtos importados ou HCs individuais se torna uma realidade para uma parcela da população, é fundamental questionar: como garantir que os benefícios dessa transformação alcancem também as comunidades mais vulneráveis? Como evitar que a legalização se torne mais um privilégio de poucos, enquanto a criminalização continua a penalizar os mesmos de sempre? A resposta passa, necessariamente, por empoderar as periferias com informação, ferramentas e oportunidades para que sejam protagonistas nessa mudança.</p>

    <div class="reflexao-social">
        <h2>A Criminalização da Pobreza e a Guerra às Drogas nas Periferias</h2>
        <p>Não é segredo que a política de \"guerra às drogas\" no Brasil tem cor e CEP. São majoritariamente jovens negros e pobres, moradores das periferias e favelas, que lotam o sistema prisional por delitos relacionados a drogas, muitas vezes por porte de pequenas quantidades que, em outros contextos sociais, poderiam ser interpretadas como para uso pessoal. Essa criminalização seletiva não apenas destrói vidas e futuros, mas também impede que essas comunidades acessem os potenciais terapêuticos da cannabis e participem de um eventual mercado legalizado de forma equitativa.</p>
        <p>Descentralizar o direito à planta significa, antes de tudo, lutar pelo fim dessa política genocida e pela descriminalização do usuário. Significa também criar mecanismos para que o conhecimento sobre o cultivo seguro e medicinal chegue a esses territórios, não como uma imposição externa, mas como uma ferramenta de autonomia e cuidado com a saúde. A GanjaDAO entende que a informação sobre direitos, sobre como obter um HC, sobre os benefícios terapêuticos da planta, precisa circular para além das bolhas privilegiadas.</p>
    </div>

    <h2>Oportunidades de Formação e Empoderamento com a GanjaDAO</h2>
    <p>A GanjaDAO está comprometida em ser uma aliada dos ativistas e moradores das periferias que desejam se engajar na luta pelo cultivo legal e seguro. Acreditamos que o conhecimento é a chave para a transformação. Por isso, buscamos oferecer e apoiar:</p>
    <ul>
        <li><strong>Formação em Direitos e Legislação:</strong> Oferecer workshops e materiais educativos em linguagem acessível sobre a Lei de Drogas, o que é um Habeas Corpus, como funciona o sistema de justiça criminal, e quais são os direitos do cidadão em caso de abordagem policial. Conhecer os direitos é o primeiro passo para se defender de abusos.</li>
        <li><strong>Capacitação em Cultivo Medicinal Básico:</strong> Promover cursos e oficinas sobre técnicas de cultivo de cannabis para fins medicinais, focando em métodos de baixo custo, orgânicos e adaptados à realidade das comunidades. O objetivo é que as pessoas possam cultivar seu próprio remédio com segurança e qualidade.</li>
        <li><strong>Rede de Apoio Jurídico e Comunitário:</strong> Facilitar a conexão entre ativistas periféricos, advogados populares, associações de pacientes e outros coletivos que atuam na área. A GanjaDAO pode servir como uma ponte, oferecendo sua plataforma para organizar informações e conectar pessoas.</li>
        <li><strong>Uso Estratégico da Plataforma GanjaDAO:</strong> Orientar sobre como a plataforma GanjaDAO pode ser utilizada por coletivos e associações de base comunitária para auxiliar seus membros na busca por HCs, na organização de documentos e no acesso a informações relevantes.</li>
    </ul>
    <p>Entendemos que as soluções não podem ser padronizadas e impostas de cima para baixo. É fundamental ouvir as demandas específicas de cada território e construir as estratégias em conjunto com quem vive a realidade local.</p>

    <h2>Chamada à Ação: Ativistas Periféricos na Linha de Frente</h2>
    <p>Se você é um ativista, líder comunitário, profissional de saúde, educador popular ou simplesmente um morador da periferia interessado em promover o direito à planta em seu território, a GanjaDAO quer se conectar com você. Acreditamos que a verdadeira descentralização acontece quando as próprias comunidades se apropriam das ferramentas e do conhecimento e se tornam agentes de sua própria transformação.</p>
    <p><strong>Como você pode se envolver?</strong></p>
    <ol>
        <li><strong>Entre em Contato Conosco:</strong> Compartilhe suas ideias, os desafios da sua comunidade e como você acredita que a GanjaDAO pode contribuir. Estamos abertos ao diálogo e à construção conjunta.</li>
        <li><strong>Organize Grupos de Estudo e Debate:</strong> Utilize os materiais da GanjaDAO e de outras fontes confiáveis para promover a discussão sobre cannabis medicinal, legislação e direitos em sua comunidade.</li>
        <li><strong>Torne-se um Multiplicador de Informações:</strong> Ajude a disseminar conhecimento sobre os serviços da GanjaDAO, sobre como obter um HC e sobre os benefícios terapêuticos da planta. A informação precisa chegar a quem mais precisa.</li>
        <li><strong>Participe de Nossas Formações:</strong> Fique atento aos nossos canais para oportunidades de capacitação e formação que possam fortalecer sua atuação.</li>
        <li><strong>Proponha Parcerias:</strong> Se você faz parte de um coletivo ou organização que já atua na periferia, vamos explorar formas de colaborar e somar forças.</li>
    </ol>

    <!-- O botão será renderizado pelo React usando Link -->

    <h2>Construindo Pontes para um Futuro Mais Verde e Justo</h2>
    <p>Descentralizar o direito à planta é um desafio complexo, que exige um esforço conjunto de diversos atores sociais. Envolve não apenas a mudança nas leis, mas também uma profunda transformação cultural e a superação de estigmas arraigados. Exige o reconhecimento de que a política de drogas atual é um instrumento de controle social e racial, e que sua reforma precisa ter um viés de justiça social e reparação.</p>
    <p>A GanjaDAO se coloca como uma ferramenta a serviço dessa transformação. Convidamos todos os ativistas periféricos, todas as comunidades que sofrem com a violência da guerra às drogas, a se juntarem a nós nessa construção. Juntos, podemos plantar as sementes de um futuro onde o direito à saúde, à liberdade e à dignidade seja uma realidade para todos, independentemente de sua cor, classe ou CEP. Todos devem ter direito à planta, e a GanjaDAO está aqui para lutar ao seu lado.</p>
`;

const cultivoLegalStyles = `
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
  .conteudo-pagina-interna ul, .conteudo-pagina-interna ol {
    margin-left: 20px;
    margin-bottom: 15px;
    list-style-position: inside;
  }
  .conteudo-pagina-interna li {
    margin-bottom: 8px;
  }
  .reflexao-social {
    border-top: 2px dashed #6c757d; /* Tailwind gray-500 */
    border-bottom: 2px dashed #6c757d; /* Tailwind gray-500 */
    padding: 20px 0;
    margin: 30px 0;
  }
  .chamada-acao-cultivo {
    background-color: #e0f2fe; /* Tailwind sky-100 */
    border: 1px solid #bae6fd; /* Tailwind sky-200 */
    padding: 20px;
    border-radius: 8px; /* Tailwind rounded-lg */
    margin-top: 25px;
    text-align: center;
  }
  .chamada-acao-cultivo h3 {
    color: #075985; /* Tailwind sky-700 */
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.25em;
  }
  .btn-engajar-react {
    display: inline-block;
    padding: 12px 25px;
    background-color: #0ea5e9; /* Tailwind sky-500 */
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    margin-top: 10px;
    transition: background-color 0.2s ease-in-out;
  }
  .btn-engajar-react:hover {
    background-color: #0284c7; /* Tailwind sky-600 */
  }
`;

const CultivoLegalPage: React.FC = () => {
  return (
    <Layout>
      <style>{cultivoLegalStyles}</style>
      <main className="container mx-auto">
        <section className="conteudo-pagina-interna py-8">
          <div dangerouslySetInnerHTML={{ __html: cultivoLegalContent }} />
          <div className="chamada-acao-cultivo">
            <h3>Sua Voz, Sua Luta, Nossa Parceria!</h3>
            <p>A GanjaDAO acredita que o futuro do cultivo legal no Brasil deve ser inclusivo, justo e reparador. Para isso, é essencial que as vozes e as lutas das periferias estejam no centro do debate e da construção de soluções. Queremos ser parceiros nessa jornada, oferecendo nosso conhecimento, nossa tecnologia e nossa rede de apoio.</p>
            <Link to="/clube" className="btn-engajar-react">
              Entre em nosso Clube e Vamos Juntos Descentralizar o Direito à Planta!
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default CultivoLegalPage;

