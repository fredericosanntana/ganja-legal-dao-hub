import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import dadosHC from '../../dadosHC';
import { estadosNomes } from '../../estadosNomes';
import Layout from "@/components/Layout";

// Componente do Mapa Interativo
const MapaBrasil = () => {
  const [brasilGeoJSON, setBrasilGeoJSON] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  
  // Carrega o GeoJSON dos estados brasileiros
  useEffect(() => {
    const fetchGeoJSON = async () => {
      setCarregando(true);
      try {
        console.log('Tentando carregar GeoJSON do caminho relativo...');
        // Carrega o arquivo local diretamente
        const response = await fetch('/br_states.json');
        if (!response.ok) {
          throw new Error(`Erro ao carregar GeoJSON: ${response.status}`);
        }
        const data = await response.json();
        console.log('GeoJSON carregado com sucesso:', data);
        setBrasilGeoJSON(data);
        setErro(null);
      } catch (error) {
        console.error('Erro ao carregar o GeoJSON do caminho relativo:', error);
        
        // Fallback para URL absoluta caso o caminho relativo falhe
        try {
          console.log('Tentando fallback com caminho absoluto...');
          const fallbackResponse = await fetch(window.location.origin + '/br_states.json');
          if (!fallbackResponse.ok) {
            throw new Error(`Erro no fallback: ${fallbackResponse.status}`);
          }
          const fallbackData = await fallbackResponse.json();
          console.log('GeoJSON carregado com sucesso via fallback');
          setBrasilGeoJSON(fallbackData);
          setErro(null);
        } catch (fallbackError) {
          console.error('Erro também no fallback:', fallbackError);
          setErro('Falha ao carregar dados do mapa. Verifique se o arquivo br_states.json está disponível.');
        }
      } finally {
        setCarregando(false);
      }
    };
    
    fetchGeoJSON();
  }, []);

  // Define o estilo para cada estado baseado no nível de concentração de HCs
  const getEstadoStyle = (feature) => {
    // Usa feature.id ao invés de feature.properties.sigla
    const estadoSigla = feature.id || '';
    const dadosEstado = dadosHC[estadoSigla] || { nivel: 0 };
    
    let fillColor;
    switch (dadosEstado.nivel) {
      case 3:
        fillColor = '#007bff'; // Alta concentração
        break;
      case 2:
        fillColor = '#17a2b8'; // Média concentração
        break;
      case 1:
        fillColor = '#28a745'; // Baixa concentração
        break;
      default:
        fillColor = '#e9ecef'; // Sem dados
    }
    
    return {
      fillColor,
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  // Função para criar o tooltip com informações do estado
  const onEachEstado = (feature, layer) => {
    // Usa feature.id ao invés de feature.properties.sigla
    const estadoSigla = feature.id || '';
    // Usa o mapeamento para obter o nome completo do estado
    const estadoNome = estadosNomes[estadoSigla] || 'Estado desconhecido';
    const dadosEstado = dadosHC[estadoSigla] || { nivel: 0, total: 0, descricao: "Sem dados registrados" };
    
    const tooltipContent = `
      <div class="mapa-info-tooltip">
        <h4>${estadoNome}</h4>
        <p>${dadosEstado.descricao}</p>
        <p class="total">Total: ${dadosEstado.total || 0} HCs registrados</p>
      </div>
    `;
    
    layer.bindTooltip(tooltipContent, { 
      sticky: true,
      direction: 'top',
      className: 'mapa-tooltip'
    });
  };

  if (carregando) {
    return (
      <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Carregando mapa...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'red' }}>
        <p>{erro}</p>
      </div>
    );
  }

  return (
    <MapContainer 
      center={[-15.7801, -47.9292]} // Coordenadas aproximadas do centro do Brasil
      zoom={4}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {brasilGeoJSON && (
        <GeoJSON 
          data={brasilGeoJSON}
          style={getEstadoStyle}
          onEachFeature={onEachEstado}
        />
      )}
    </MapContainer>
  );
};

// Estilos para o componente de mapa
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
    .mapa-brasil {
        width: 100%;
        height: 500px;
        border-radius: 5px;
        margin-bottom: 15px;
    }
    .mapa-legenda {
        margin-top: 15px;
        font-size: 0.9em;
        color: #333;
        text-align: left;
        padding: 10px;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 5px;
    }
    .mapa-legenda h3 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 1.1em;
        color: #333;
    }
    .mapa-legenda-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
    }
    .mapa-legenda-cor {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 10px;
        border: 1px solid #ccc;
        border-radius: 3px;
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
    .mapa-info-tooltip {
        background-color: rgba(255, 255, 255, 0.9);
        border: 1px solid #ccc;
        padding: 8px;
        border-radius: 4px;
        font-size: 14px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .mapa-info-tooltip h4 {
        margin: 0 0 5px 0;
        font-size: 16px;
    }
    .mapa-info-tooltip p {
        margin: 0;
    }
    .mapa-info-tooltip .total {
        font-weight: bold;
        margin-top: 5px;
    }
    @media (max-width: 768px) {
        .mapa-brasil {
            height: 400px;
        }
        .mapa-legenda {
            font-size: 0.8em;
        }
    }
    @media (max-width: 480px) {
        .mapa-brasil {
            height: 350px;
        }
    }
`;

// Componente principal da página
const MapaProtecaoPage = () => {
  return (
    <Layout>
      <style>{mapaProtecaoStyles}</style>
      <main className="container">
        <section className="conteudo-pagina">
          <h1>O Mapa da Proteção – Veja Onde o Autocultivo já está Blindado por HCs</h1>
          <p className="lead">A GanjaDAO tem o orgulho de apresentar o "Mapa da Proteção", uma iniciativa visual e inspiradora que busca mostrar, de forma anonimizada e agregada, as regiões do Brasil onde cultivadores medicinais já conquistaram a tranquilidade de cultivar seu remédio sob a proteção de um Habeas Corpus (HC) preventivo, muitos deles com o auxílio da nossa plataforma e rede de apoio. Este mapa é um testemunho do poder da comunidade, da evolução da jurisprudência e da crescente conscientização sobre o direito à saúde através da cannabis.</p>

          <p>Entendemos que a jornada de cada cultivador é única e, muitas vezes, solitária. O Mapa da Proteção surge como uma forma de conectar essas experiências, gerar um sentimento de rede e pertencimento, e inspirar aqueles que ainda buscam segurança jurídica. Ao visualizar a expansão da proteção legal, queremos encorajar mais pacientes e suas famílias a darem o passo em direção ao cultivo seguro e amparado pela lei. A privacidade dos indivíduos é nossa prioridade máxima; por isso, todos os dados são apresentados de forma agregada e anonimizada, respeitando integralmente o sigilo e a segurança de cada membro da comunidade GanjaDAO.</p>

          <div className="mapa-container">
            <h2>Brasil: Áreas com Proteção de HC para Autocultivo (Dados Agregados GanjaDAO)</h2>
            <div className="mapa-brasil">
              <MapaBrasil />
            </div>
            <div className="mapa-legenda">
              <h3>Legenda:</h3>
              <div className="mapa-legenda-item">
                <span className="mapa-legenda-cor" style={{ backgroundColor: '#007bff' }}></span>
                <span>Alta concentração de HCs registrados pela GanjaDAO</span>
              </div>
              <div className="mapa-legenda-item">
                <span className="mapa-legenda-cor" style={{ backgroundColor: '#17a2b8' }}></span>
                <span>Média concentração de HCs registrados pela GanjaDAO</span>
              </div>
              <div className="mapa-legenda-item">
                <span className="mapa-legenda-cor" style={{ backgroundColor: '#28a745' }}></span>
                <span>Baixa concentração de HCs / Primeiros registros GanjaDAO</span>
              </div>
              <p><em>Nota: Este mapa representa dados agregados e anonimizados para fins informativos e de conscientização. A GanjaDAO não divulga informações individuais.</em></p>
            </div>
          </div>

          <h2>Interpretando o Mapa: Uma Luz de Esperança e um Chamado à Ação</h2>
          <p>Ao observar o Mapa da Proteção, podemos extrair algumas percepções importantes. Primeiramente, ele evidencia que a busca por Habeas Corpus para autocultivo medicinal não é um fenômeno isolado, mas uma realidade crescente em diversas partes do país. Vemos que, embora algumas regiões metropolitanas e estados com maior acesso à informação e a serviços jurídicos possam apresentar uma concentração maior de decisões favoráveis, a proteção legal está se expandindo, alcançando também localidades menores e mais distantes dos grandes centros.</p>
          <p>Este mapa é uma fonte de esperança. Cada ponto, cada área destacada, representa uma história de luta, de superação do medo e da burocracia, e da conquista do direito fundamental à saúde. São pacientes que, como você, decidiram buscar a via legal para cultivar seu próprio remédio, garantindo a continuidade e a qualidade de seus tratamentos. A GanjaDAO se orgulha de ter contribuído para muitas dessas vitórias, facilitando o acesso à informação e às ferramentas necessárias para a elaboração de petições de HC robustas.</p>
          <p>No entanto, o mapa também serve como um chamado à ação. As áreas ainda não destacadas ou com menor concentração de HCs não significam ausência de necessidade, mas sim, muitas vezes, falta de informação, de acesso a recursos jurídicos ou receio por parte dos pacientes. Nosso objetivo é que, com o tempo, este mapa se torne cada vez mais colorido, refletindo uma proteção jurídica disseminada por todo o território nacional.</p>

          <div className="estatisticas-mapa">
            <h3>Alguns Insights da Rede GanjaDAO (Dados Anonimizados):</h3>
            <ul>
              <li><strong>Crescimento Constante:</strong> Observamos um aumento percentual significativo no número de HCs concedidos a usuários da nossa plataforma nos últimos dois anos.</li>
              <li><strong>Diversidade de Patologias:</strong> Os HCs abrangem uma ampla gama de condições médicas, incluindo epilepsia, dor crônica, câncer, ansiedade, autismo, doenças neurodegenerativas, entre outras.</li>
              <li><strong>Perfil dos Pacientes:</strong> A proteção tem alcançado pessoas de diversas faixas etárias, desde crianças (representadas por seus pais) até idosos.</li>
              <li><strong>Impacto Positivo Relatado:</strong> A grande maioria dos pacientes que obtiveram HC relata uma melhora significativa na qualidade de vida, com redução do estresse relacionado à ilegalidade e maior foco no tratamento.</li>
            </ul>
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

          <div style={{ textAlign: 'center' }}>
            <a href="Mapa-GanjaDAO.pdf" className="btn-ebook">Baixe nosso Ebook!</a>
          </div>

          <h2>Um Futuro Onde a Proteção é a Norma, Não a Exceção</h2>
          <p>O Mapa da Proteção da GanjaDAO é mais do que uma representação geográfica; é um símbolo da nossa visão de futuro. Um futuro onde nenhum paciente precise viver com medo de cultivar seu próprio remédio. Um futuro onde o acesso à cannabis medicinal seja um direito garantido e a proteção jurídica seja a norma, não a exceção. A cada novo HC concedido, damos um passo em direção a esse futuro.</p>
          <p>Convidamos você a explorar este mapa, a se inspirar nas conquistas já alcançadas e a se juntar a nós nessa jornada. A GanjaDAO continua comprometida em fornecer as ferramentas, o conhecimento e o apoio para que cada vez mais cultivadores possam adicionar sua localidade ao Mapa da Proteção, construindo uma rede de segurança e solidariedade que abranja todo o Brasil.</p>
        </section>
      </main>
    </Layout>
  );
};

export default MapaProtecaoPage;
