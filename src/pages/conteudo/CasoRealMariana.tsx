import React from 'react';
import Layout from '@/components/Layout';

// Conteúdo HTML e estilos para o Caso Real Mariana
const casoRealMarianaContent = `
    <h1>Caso Real: Como a Mariana Protegeu Seu Cultivo com a GanjaDAO</h1>
    <p class="lead">Histórias reais têm o poder de inspirar, informar e, acima de tudo, mostrar que a mudança é possível. Hoje, compartilhamos a jornada emocionante de Mariana (nome fictício para proteger sua identidade), uma mãe dedicada que, enfrentando as adversidades do sistema e a urgência da saúde de seu filho, encontrou na GanjaDAO o suporte necessário para proteger seu cultivo medicinal e garantir o tratamento que transformou suas vidas. Esta é uma narrativa de coragem, amor e da força da comunidade.</p>

    <p>Mariana é mãe de Lucas, um menino de 8 anos diagnosticado com uma forma severa de epilepsia refratária. Desde muito cedo, Lucas sofria com dezenas de convulsões diárias, que não apenas comprometiam seu desenvolvimento neurológico, mas também roubavam sua infância e a paz de sua família. Os tratamentos convencionais, uma longa lista de anticonvulsivantes com fortes efeitos colaterais, mostravam-se ineficazes. A cada nova crise, o desespero de Mariana aumentava, e a busca por alternativas se tornava mais urgente.</p>

    <div class="imagem-destaque">
        <p style="font-size:0.9em; color:#777;"><em>(Ilustração: O cuidado e a esperança no cultivo medicinal)</em></p>
    </div>

    <h2>A Descoberta da Cannabis Medicinal e os Primeiros Desafios</h2>
    <p>Foi através de grupos de apoio online e muita pesquisa que Mariana ouviu falar sobre os benefícios do canabidiol (CBD), um dos compostos da cannabis, para o tratamento da epilepsia. Com esperança renovada, ela procurou um médico prescritor e, após uma avaliação cuidadosa, Lucas iniciou o tratamento com um óleo de CBD importado. Os resultados foram surpreendentes: as crises diminuíram drasticamente em frequência e intensidade. Lucas começou a sorrir mais, a interagir e a ter uma qualidade de vida que parecia perdida.</p>
    <p>No entanto, a alegria inicial logo deu lugar a uma nova angústia: o custo do óleo importado era proibitivo para a realidade financeira da família. Manter o tratamento em longo prazo se tornou um desafio insustentável. Além disso, a burocracia para importação e a instabilidade do fornecimento geravam constante apreensão. Foi então que Mariana, como muitas outras mães e pacientes, considerou o autocultivo como a única via viável para garantir a continuidade do tratamento de Lucas.</p>
    <blockquote>
        <p>\"Eu não podia simplesmente ver meu filho regredir. O óleo de cannabis devolveu a vida a ele, e eu faria qualquer coisa para que ele continuasse bem. O cultivo não era uma escolha, era uma necessidade vital.\" - Mariana</p>
    </blockquote>

    <h2>O Medo e a Busca por Segurança Jurídica</h2>
    <p>A decisão de cultivar cannabis, mesmo com uma finalidade tão nobre, trouxe consigo um medo paralisante. Mariana sabia dos riscos legais, do estigma e da possibilidade de ser criminalizada. Ela passava noites em claro, pesquisando sobre a legislação, lendo relatos de outros cultivadores e tentando entender como poderia se proteger. Foi nesse momento de angústia e busca por soluções que ela encontrou a GanjaDAO.</p>
    <p>\"Eu me sentia completamente sozinha e desamparada\", relata Mariana. \"Tinha a receita médica, os laudos, mas o medo de uma batida policial, de perder a guarda do meu filho, era constante. Eu precisava de ajuda, de alguém que entendesse minha situação e me mostrasse um caminho seguro.\"</p>

    <h2>A GanjaDAO como Farol: O Caminho para o Habeas Corpus</h2>
    <p>Ao conhecer a proposta da GanjaDAO de facilitar o acesso a Habeas Corpus preventivos através de uma plataforma digital, Mariana sentiu um misto de esperança e ceticismo. Seria realmente possível obter proteção jurídica de forma tão acessível? Ela decidiu entrar em contato, participou de webinars informativos e tirou suas dúvidas com a equipe de suporte.</p>
    <p>O processo, como descrito pela GanjaDAO, foi transparente e guiado. Mariana cadastrou-se na plataforma, submeteu toda a documentação médica de Lucas, detalhou sua necessidade de cultivo e, com o auxílio das ferramentas e modelos disponibilizados, conseguiu preparar uma minuta robusta de seu pedido de Habeas Corpus. Ela também foi orientada a procurar um advogado parceiro da rede GanjaDAO em sua região, que revisou e protocolou a petição no tribunal competente.</p>
    <p>\"A plataforma da GanjaDAO foi incrivelmente intuitiva. Eu, que não entendo nada de termos jurídicos, consegui organizar todos os documentos e entender cada etapa. O suporte da equipe foi fundamental para me dar confiança. E o mais importante: o custo foi muito mais acessível do que eu imaginava\", conta Mariana.</p>

    <h2>A Vitória na Justiça e a Tranquilidade para Cultivar a Esperança</h2>
    <p>Algumas semanas após o protocolo, veio a notícia que Mariana tanto esperava: o juiz concedeu o Habeas Corpus preventivo, autorizando-a a cultivar a quantidade de cannabis necessária para o tratamento de Lucas. A decisão judicial reconheceu a legitimidade da prescrição médica, a ausência de alternativas terapêuticas viáveis e, acima de tudo, o direito à saúde e à dignidade de Lucas.</p>
    <p>\"Quando recebi a notícia, chorei de alívio e gratidão\", lembra Mariana, emocionada. \"Aquele pedaço de papel significava muito mais do que a permissão para plantar; significava a segurança do meu filho, a minha paz de espírito e a prova de que lutar pelos nossos direitos vale a pena. A GanjaDAO não me deu apenas um HC, me devolveu a esperança e a força para continuar cuidando do Lucas da melhor maneira possível.\"</p>
    <p>Hoje, Mariana cultiva suas plantas com a tranquilidade de estar amparada pela lei. Lucas continua seu tratamento, com progressos notáveis em seu desenvolvimento. A história de Mariana é um testemunho do impacto positivo que a GanjaDAO busca gerar: proteger cultivadores, democratizar o acesso à justiça e fortalecer uma comunidade que acredita no poder terapêutico da cannabis e no direito fundamental à saúde.</p>

    <h2>Sua História Também Pode Ter um Final Feliz</h2>
    <p>A jornada de Mariana é única, mas os desafios que ela enfrentou são compartilhados por muitos cultivadores medicinais no Brasil. Se você se identifica com essa história, se o medo e a insegurança jurídica rondam seu cultivo, saiba que você não está sozinho. A GanjaDAO está aqui para oferecer suporte, informação e as ferramentas necessárias para que você também possa buscar a proteção legal para o seu tratamento ou de quem você ama.</p>
    <p>Não deixe que o medo o impeça de lutar pelo seu direito à saúde. Conheça nossos serviços, informe-se e junte-se à nossa rede. Assim como a Mariana, você também pode cultivar com segurança e esperança. A GanjaDAO acredita no poder da união e da informação para transformar realidades.</p>
`;

const casoRealMarianaStyles = `
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
  .conteudo-pagina-interna blockquote {
    border-left: 4px solid #2563eb; /* Tailwind blue-600 */
    padding-left: 15px;
    margin: 20px 0;
    font-style: italic;
    color: #4b5563; /* Tailwind gray-600 */
  }
  .imagem-destaque {
    text-align: center;
    margin: 20px 0;
  }
  .imagem-destaque img {
    max-width: 100%;
    height: auto;
    border-radius: 8px; /* Tailwind rounded-lg */
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
`;

const CasoRealMarianaPage: React.FC = () => {
  return (
    <Layout>
      <style>{casoRealMarianaStyles}</style>
      <main className="container mx-auto">
        <section className="conteudo-pagina-interna py-8">
          <div dangerouslySetInnerHTML={{ __html: casoRealMarianaContent }} />
        </section>
      </main>
    </Layout>
  );
};

export default CasoRealMarianaPage;

