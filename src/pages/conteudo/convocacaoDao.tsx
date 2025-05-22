import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom'; // Importar Link para o botão de votação

// Conteúdo HTML e estilos para a Convocação DAO
const convocacaoDaoContent = `
    <h1>Convocação DAO: Vamos Votar Nossa Próxima Missão Coletiva?</h1>
    <p class="lead">A GanjaDAO é mais do que uma plataforma de serviços; somos uma Organização Autônoma Descentralizada (DAO) em essência e prática. Isso significa que a voz da nossa comunidade não apenas é ouvida, mas ativamente molda nossos próximos passos. Chegou o momento de exercermos nossa governança coletiva: convocamos todos os membros para decidir, juntos, qual será a próxima grande missão da nossa rede!</p>

    <p>Desde nossa fundação, a GanjaDAO tem se dedicado a proteger e empoderar cultivadores de cannabis medicinal no Brasil. Nosso foco inicial na facilitação do acesso a Habeas Corpus preventivos foi um passo crucial, mas sabemos que os desafios e as oportunidades são vastos. Acreditamos que a inteligência coletiva de nossa comunidade é a ferramenta mais poderosa para identificar as necessidades mais prementes e as estratégias mais eficazes para o futuro. Esta votação é um convite para que você, membro da GanjaDAO, participe ativamente da construção do nosso amanhã.</p>

    <h2>O Poder da Governança Descentralizada na GanjaDAO</h2>
    <p>Uma DAO opera com base em princípios de transparência, participação e tomada de decisão distribuída. Na GanjaDAO, isso se traduz em um compromisso de envolver nossos membros em decisões estratégicas. Não se trata apenas de uma consulta, mas de um processo vinculativo onde a opção mais votada pela comunidade se tornará uma prioridade para nossa equipe de desenvolvimento, jurídica e de comunicação. Queremos que cada membro sinta que tem um papel real na direção que tomamos, pois a força da GanjaDAO reside na união e no engajamento de cada um.</p>
    <p>Este modelo de governança não apenas aumenta a legitimidade de nossas ações, mas também garante que nossos esforços estejam sempre alinhados com os anseios e as necessidades reais daqueles a quem servimos: os cultivadores e pacientes que dependem da cannabis para sua saúde e bem-estar. Ao participar desta votação, você não está apenas escolhendo uma opção; está fortalecendo os alicerces democráticos e colaborativos da nossa organização.</p>

    <h2>Propostas em Votação para a Próxima Missão da GanjaDAO:</h2>
    <p>Após um período de coleta de sugestões e debates internos com membros ativos e conselheiros, chegamos a três propostas principais que representam diferentes frentes de expansão e aprofundamento do nosso trabalho. Analise cada uma com atenção e escolha aquela que você acredita que trará o maior impacto positivo para nossa comunidade e para a causa do cultivo legal e seguro no Brasil.</p>

    <div class="proposta-votacao">
        <h3>Proposta 1: Expansão do Suporte Jurídico para Casos de Apreensão</h3>
        <p><strong>Descrição:</strong> Atualmente, nosso foco principal é o HC preventivo. Esta proposta visa desenvolver e implementar um novo módulo de suporte jurídico focado em auxiliar cultivadores que, infelizmente, já enfrentaram uma apreensão de suas plantas ou produtos. Isso incluiria a criação de modelos de defesa, orientação sobre como proceder legalmente após uma apreensão, e a facilitação do contato com advogados especializados em casos de defesa criminal relacionados ao cultivo. O objetivo é não deixar desamparado quem já está enfrentando um processo.</p>
        <p><strong>Impacto Potencial:</strong> Aumentaria significativamente o escopo de proteção da GanjaDAO, oferecendo amparo em um momento crítico e de grande vulnerabilidade para os cultivadores. Poderia ajudar a reverter situações injustas e a garantir que os direitos dos pacientes sejam respeitados mesmo após uma intercorrência legal.</p>
        <p><strong>Recursos Necessários:</strong> Desenvolvimento de nova plataforma/módulo, contratação ou parceria com mais advogados criminalistas, criação de material informativo específico.</p>
    </div>

    <div class="proposta-votacao">
        <h3>Proposta 2: Lançamento de uma Plataforma Educacional sobre Cultivo e Legislação (GanjaDAO Educa)</h3>
        <p><strong>Descrição:</strong> Esta proposta foca na criação de uma plataforma educacional robusta, a \"GanjaDAO Educa\". O objetivo é oferecer cursos, workshops, webinars, artigos e guias detalhados sobre todos os aspectos do cultivo de cannabis (desde o básico até técnicas avançadas, cultivo orgânico, extração de óleos, etc.) e, crucialmente, sobre a legislação brasileira, direitos dos pacientes, como montar uma documentação médica forte, e como se preparar para um pedido de HC. O conteúdo seria produzido por especialistas e acessível de forma gratuita ou a baixo custo para membros da DAO.</p>
        <p><strong>Impacto Potencial:</strong> Empoderaria os cultivadores com conhecimento técnico e jurídico, aumentando a qualidade dos cultivos, a segurança dos pacientes e a capacidade da comunidade de se autodefender e de advogar pela causa. A informação é uma ferramenta poderosa de transformação.</p>
        <p><strong>Recursos Necessários:</strong> Desenvolvimento da plataforma EAD, produção de conteúdo multimídia, parcerias com educadores e especialistas, equipe de moderação e suporte.</p>
    </div>

    <div class="proposta-votacao">
        <h3>Proposta 3: Desenvolvimento de Ferramentas para Associações de Pacientes</h3>
        <p><strong>Descrição:</strong> Muitas associações de pacientes de cannabis medicinal realizam um trabalho incrível, mas frequentemente carecem de ferramentas de gestão, comunicação e captação de recursos. Esta proposta visa desenvolver um conjunto de soluções tecnológicas (software como serviço - SaaS) especificamente para essas associações. Poderia incluir ferramentas para gestão de associados, comunicação interna, organização de eventos, campanhas de doação, e até mesmo um módulo simplificado para auxiliar as associações a orientarem seus membros sobre a busca por HCs, em parceria com a GanjaDAO.</p>
        <p><strong>Impacto Potencial:</strong> Fortaleceria o ecossistema de associações, que são pilares fundamentais no apoio aos pacientes e na luta pela regulamentação. Ao otimizar a gestão dessas organizações, permitiríamos que elas focassem mais em sua missão principal e ampliassem seu alcance e impacto.</p>
        <p><strong>Recursos Necessários:</strong> Pesquisa de necessidades das associações, desenvolvimento de software customizado, equipe de suporte técnico e treinamento para as associações.</p>
    </div>

    <h2>Como Participar da Votação:</h2>
    <p>A participação é simples e direta, refletindo nosso compromisso com a acessibilidade:</p>
    <ol>
        <li><strong>Acesse a Área de Membros:</strong> Faça login na sua conta na plataforma GanjaDAO.</li>
        <li><strong>Navegue até a Seção \"Votações\":</strong> Você encontrará um link destacado para a votação atual.</li>
        <li><strong>Leia os Detalhes de Cada Proposta:</strong> Embora resumidas aqui, na plataforma você encontrará informações mais detalhadas sobre cada opção, incluindo estimativas de cronograma e desafios.</li>
        <li><strong>Vote na Sua Proposta Preferida:</strong> Cada membro tem direito a um voto. Escolha com consciência, pensando no que trará maior benefício para a comunidade como um todo.</li>
    </ol>
    <!-- O botão será renderizado pelo React usando Link -->

    <div class="calendario-dao">
        <h3>Cronograma da Votação:</h3>
        <ul>
            <li><strong>Período de Votação:</strong> De 20/05/2025</strong>  a 20/06/2025</strong> – Fique atento aos prazos!</li>
            <li><strong>Apuração dos Votos:</strong> 21/06/2025</strong> </li>
            <li><strong>Anúncio da Proposta Vencedora:</strong> 21/06/2025</strong> – Será divulgado em nossos canais oficiais e na plataforma.</li>
            <li><strong>Início do Desenvolvimento da Missão Escolhida:</strong> 28/06/2025</strong> </li>
        </ul>
        <p><em>(Nota: As datas acima são placeholders e seriam preenchidas com as informações reais da campanha de votação.)</em></p>
    </div>

    <h2>Seu Voto Constrói o Futuro da GanjaDAO!</h2>
    <p>Esta convocação é um chamado à ação. Sua participação é vital para que a GanjaDAO continue evoluindo de forma alinhada com os anseios de sua comunidade. Não perca a oportunidade de exercer seu direito de voto e de contribuir ativamente para a construção de um futuro onde o cultivo de cannabis para fins medicinais seja seguro, legal e acessível a todos que dele necessitam.</p>
    <p>Contamos com você para nos ajudar a definir nossa próxima grande missão. Juntos, somos mais fortes. Juntos, somos a GanjaDAO!</p>
`;

const convocacaoDaoStyles = `
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
  .proposta-votacao {
    padding: 15px;
    border: 1px solid #1d4ed8; /* Tailwind blue-700 */
    margin-bottom: 20px;
    border-radius: 8px; /* Tailwind rounded-lg */
    background-color: #eff6ff; /* Tailwind blue-50 */
  }
  .proposta-votacao h3 {
    color: #1e3a8a; /* Tailwind blue-800 */
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.25em;
  }
  .btn-votar-react {
    display: inline-block;
    padding: 10px 20px;
    background-color: #16a34a; /* Tailwind green-600 */
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    text-align: center;
    margin-top: 10px;
    transition: background-color 0.2s ease-in-out;
  }
  .btn-votar-react:hover {
    background-color: #15803d; /* Tailwind green-700 */
  }
  .calendario-dao {
    background-color: #fefce8; /* Tailwind yellow-50 */
    border: 1px solid #fef08a; /* Tailwind yellow-200 */
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
  }
  .calendario-dao h3 {
    color: #854d0e; /* Tailwind yellow-700 */
    margin-bottom: 10px;
  }
`;

const ConvocacaoDaoPage: React.FC = () => {
  return (
    <Layout>
      <style>{convocacaoDaoStyles}</style>
      <main className="container mx-auto">
        <section className="conteudo-pagina-interna py-8">
          <div dangerouslySetInnerHTML={{ __html: convocacaoDaoContent }} />
          <Link to="/clube/login" className="btn-votar-react">
            Acessar Plataforma e Votar Agora!
          </Link>
        </section>
      </main>
    </Layout>
  );
};

export default ConvocacaoDaoPage;

