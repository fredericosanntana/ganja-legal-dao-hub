import React from 'react';
import Layout from '@/components/Layout'; // Conforme o modelo CultivoLegal.tsx

const mapaProtecaoStyles = `
    .conteudo-pagina {
        padding: 20px;
        line-height: 1.6;
    }
    .conteudo-pagina h1 {
        color: #2c3e50;
        margin-bottom: 20px;
        text-align: center;
    }
    .conteudo-pagina h2 {
        color: #34495e;
        margin-top: 30px;
        margin-bottom: 15px;
    }
    .conteudo-pagina p {
        margin-bottom: 15px;
        text-align: justify;
    }
    .mapa-container {
        width: 100%;
        max-width: 800px;
        margin: 20px auto;
        border: 2px solid #007bff;
        border-radius: 8px;
        padding: 10px;
        background-color: #f0f8ff;
        text-align: center;
    }
    .mapa-container img {
        max-width: 100%;
        height: auto;
        border-radius: 5px;
    }
    .mapa-legenda {
        margin-top: 15px;
        font-size: 0.9em;
        color: #333;
    }
    .mapa-legenda span {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 5px;
        vertical-align: middle;
        border: 1px solid #ccc;
    }
    .estatisticas-mapa {
        background-color: #e9ecef;
        padding: 15px;
        border-radius: 5px;
        margin-top: 20px;
    }
    .estatisticas-mapa h3 {
        margin-top: 0;
        color: #495057;
    }
    .estatisticas-mapa ul {
        list-style-type: none;
        padding-left: 0;
    }
    .estatisticas-mapa li {
        margin-bottom: 8px;
    }
    .btn-contribua-mapa {
        display: inline-block;
        padding: 10px 20px;
        background-color: #28a745;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        margin-top: 15px;
    }
    .btn-contribua-mapa:hover {
        background-color: #218838;
    }
`;

const mapaProtecaoContent = `
    <h1>O Mapa da Proteção – Veja Onde o Autocultivo já está Blindado por HCs</h1>
    <p class="lead">A GanjaDAO tem o orgulho de apresentar o "Mapa da Proteção", uma iniciativa visual e inspiradora que busca mostrar, de forma anonimizada e agregada, as regiões do Brasil onde cultivadores medicinais já conquistaram a tranquilidade de cultivar seu remédio sob a proteção de um Habeas Corpus (HC) preventivo, muitos deles com o auxílio da nossa plataforma e rede de apoio. Este mapa é um testemunho do poder da comunidade, da evolução da jurisprudência e da crescente conscientização sobre o direito à saúde através da cannabis.</p>

    <p>Entendemos que a jornada de cada cultivador é única e, muitas vezes, solitária. O Mapa da Proteção surge como uma forma de conectar essas experiências, gerar um sentimento de rede e pertencimento, e inspirar aqueles que ainda buscam segurança jurídica. Ao visualizar a expansão da proteção legal, queremos encorajar mais pacientes e suas famílias a darem o passo em direção ao cultivo seguro e amparado pela lei. A privacidade dos indivíduos é nossa prioridade máxima; por isso, todos os dados são apresentados de forma agregada e anonimizada, respeitando integralmente o sigilo e a segurança de cada membro da comunidade GanjaDAO.</p>

    <div class="mapa-container">
        <h2>Brasil: Áreas com Proteção de HC para Autocultivo (Dados Agregados GanjaDAO)</h2>
        <!-- 
             Placeholder para a imagem do mapa. 
             Idealmente, incluiríamos aqui uma biblioteca de mapas como Leaflet ou Mapbox GL JS, 
             mas como não posso adicionar dependências externas complexas ou interagir com APIs de mapas diretamente,
             simularemos a ideia com uma imagem estática ou uma descrição textual rica.
             A imagem deve mostrar o mapa do Brasil com marcações (pontos, áreas coloridas) 
             indicando estados ou regiões com maior concentração de HCs concedidos.
             Exemplo: <img src="/img/mapa_protecao_hc_brasil.png" alt="Mapa do Brasil com indicações de HCs para autocultivo">
        -->
        <img src="/img/placeholder_mapa_brasil_hc.png" alt="Mapa do Brasil com indicações de HCs para autocultivo (Exemplo)">
        <div class="mapa-legenda">
            <p><strong>Legenda (Exemplo):</strong></p>
            <p><span style="background-color: #007bff;"></span> Alta concentração de HCs registrados pela GanjaDAO</p>
            <p><span style="background-color: #17a2b8;"></span> Média concentração de HCs registrados pela GanjaDAO</p>
            <p><span style="background-color: #28a745;"></span> Baixa concentração de HCs / Primeiros registros GanjaDAO</p>
            <p><em>Nota: Este mapa é ilustrativo e representa dados agregados e anonimizados para fins informativos e de conscientização. A GanjaDAO não divulga informações individuais.</em></p>
        </div>
    </div>

    <h2>Interpretando o Mapa: Uma Luz de Esperança e um Chamado à Ação</h2>
    <p>Ao observar o Mapa da Proteção, podemos extrair algumas percepções importantes. Primeiramente, ele evidencia que a busca por Habeas Corpus para autocultivo medicinal não é um fenômeno isolado, mas uma realidade crescente em diversas partes do país. Vemos que, embora algumas regiões metropolitanas e estados com maior acesso à informação e a serviços jurídicos possam apresentar uma concentração maior de decisões favoráveis, a proteção legal está se expandindo, alcançando também localidades menores e mais distantes dos grandes centros.</p>
    <p>Este mapa é uma fonte de esperança. Cada ponto, cada área destacada, representa uma história de luta, de superação do medo e da burocracia, e da conquista do direito fundamental à saúde. São pacientes que, como você, decidiram buscar a via legal para cultivar seu próprio remédio, garantindo a continuidade e a qualidade de seus tratamentos. A GanjaDAO se orgulha de ter contribuído para muitas dessas vitórias, facilitando o acesso à informação e às ferramentas necessárias para a elaboração de petições de HC robustas.</p>
    <p>No entanto, o mapa também serve como um chamado à ação. As áreas ainda não destacadas ou com menor concentração de HCs não significam ausência de necessidade, mas sim, muitas vezes, falta de informação, de acesso a recursos jurídicos ou receio por parte dos pacientes. Nosso objetivo é que, com o tempo, este mapa se torne cada vez mais colorido, refletindo uma proteção jurídica disseminada por todo o território nacional.</p>

    <div class="estatisticas-mapa">
        <h3>Alguns Insights da Rede GanjaDAO (Dados Anonimizados):</h3>
        <ul>
            <li><strong>Crescimento Constante:</strong> Observamos um aumento percentual significativo no número de HCs concedidos a usuários da nossa plataforma nos últimos dois anos.</li>
            <li><strong>Diversidade de Patologias:</strong> Os HCs abrangem uma ampla gama de condições médicas, incluindo epilepsia, dor crônica, câncer, ansiedade, autismo, doenças neurodegenerativas, entre outras.</li>
            <li><strong>Perfil dos Pacientes:</strong> A proteção tem alcançado pessoas de diversas faixas etárias, desde crianças (representadas por seus pais) até idosos.</li>
            <li><strong>Impacto Positivo Relatado:</strong> A grande maioria dos pacientes que obtiveram HC relata uma melhora significativa na qualidade de vida, com redução do estresse relacionado à ilegalidade e maior foco no tratamento.</li>
        </ul>
        <p><em>(Estes são exemplos de dados que poderiam ser apresentados. A GanjaDAO compilaria estatísticas reais e relevantes, sempre preservando o anonimato.)</em></p>
    </div>

    <h2>Como Você Pode Contribuir para Expandir o Mapa da Proteção?</h2>
    <p>O Mapa da Proteção é uma construção coletiva e contínua. Se você já obteve seu HC, mesmo que por outros meios, e deseja compartilhar sua conquista de forma anônima para inspirar outros, entre em contato. Se você ainda não buscou sua proteção jurídica, esperamos que este mapa o motive a dar o próximo passo. A GanjaDAO está aqui para ajudar.</p>
    <ol>
        <li><strong>Busque Seu HC com a GanjaDAO:</strong> Utilize nossa plataforma para facilitar a elaboração da sua petição. Ao obter seu HC, você não apenas se protege, mas também contribui para fortalecer os dados que mostram a crescente aceitação do autocultivo medicinal.</li>
        <li><strong>Compartilhe Informação:</strong> Divulgue o Mapa da Proteção e os serviços da GanjaDAO para amigos, familiares e em suas redes sociais. A informação precisa chegar a quem necessita.</li>
        <li><strong>Apoie Associações de Pacientes:</strong> Muitas associações realizam um trabalho fundamental na orientação e no apoio a pacientes. Considere se associar ou contribuir.</li>
        <li><strong>Informe-se e Eduque Outros:</strong> Quanto mais pessoas entenderem os benefícios da cannabis medicinal e a importância da proteção jurídica, mais forte se tornará nossa causa.</li>
    </ol>
    <p>Se você já é um membro da GanjaDAO e obteve seu HC através de nossa plataforma, seus dados (sempre anonimizados) já ajudam a compor este cenário de esperança. Se desejar, você pode nos enviar um relato (opcional e anônimo) sobre sua experiência para que possamos compartilhar inspiração com a comunidade.</p>

    <div style="text-align:center;">
         <a href="/clube" class="btn-contribua-mapa">Quero Ajudar a Expandir o Mapa!</a>
    </div>

    <h2>Um Futuro Onde a Proteção é a Norma, Não a Exceção</h2>
    <p>O Mapa da Proteção da GanjaDAO é mais do que uma representação geográfica; é um símbolo da nossa visão de futuro. Um futuro onde nenhum paciente precise viver com medo de cultivar seu próprio remédio. Um futuro onde o acesso à cannabis medicinal seja um direito garantido e a proteção jurídica seja a norma, não a exceção. A cada novo HC concedido, damos um passo em direção a esse futuro.</p>
    <p>Convidamos você a explorar este mapa, a se inspirar nas conquistas já alcançadas e a se juntar a nós nessa jornada. A GanjaDAO continua comprometida em fornecer as ferramentas, o conhecimento e o apoio para que cada vez mais cultivadores possam adicionar sua localidade ao Mapa da Proteção, construindo uma rede de segurança e solidariedade que abranja todo o Brasil.</p>
    <!-- Scripts adicionais para um mapa interativo seriam colocados aqui, se fosse o caso. -->
`;

const MapaProtecaoPage: React.FC = () => {
  return (
    <Layout>
      <style>{mapaProtecaoStyles}</style>
      <main className="container">
        <section className="conteudo-pagina">
          <div dangerouslySetInnerHTML={{ __html: mapaProtecaoContent }} />
        </section>
      </main>
    </Layout>
  );
};

export default MapaProtecaoPage;

