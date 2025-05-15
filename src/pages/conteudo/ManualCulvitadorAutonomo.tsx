import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom'; // Para o link de contato

// Conteúdo HTML e estilos para o Manual do Cultivador Autônomo
const manualCultivadorContent = `
    <h1>Manual do Cultivador Autônomo: Do Primeiro Broto à Primeira Defesa Jurídica</h1>
    <p class="lead">Iniciar no mundo do autocultivo de cannabis, seja para fins medicinais ou como um ato de autonomia, é uma jornada recompensadora, mas que exige conhecimento e preparo. Para guiar novos cultivadores desde os primeiros passos no plantio até a compreensão de como se proteger legalmente, a GanjaDAO preparou este \"Manual do Cultivador Autônomo\". Apresentado em três partes (ou como um eBook gratuito para download), nosso objetivo é fornecer informações práticas, links úteis e modelos para que sua experiência seja segura, produtiva e, acima de tudo, protegida.</p>

    <p>Este manual é um convite para que você se aproprie do conhecimento necessário para cultivar com consciência e responsabilidade. Abordaremos desde a escolha das sementes e os cuidados básicos com a planta, passando por técnicas de cultivo e colheita, até os aspectos cruciais da legislação brasileira e como a GanjaDAO pode auxiliar na sua proteção jurídica. Lembre-se, informação é poder, e no contexto do cultivo de cannabis, é também segurança.</p>

    <!-- O botão de download será renderizado pelo React -->

    <article class="parte-manual">
        <h2>Parte 1: O Despertar do Cultivador – Do Planejamento ao Primeiro Broto</h2>
        <p>Nesta primeira parte, focaremos nos fundamentos essenciais para quem está começando. Um bom planejamento é a chave para um cultivo bem-sucedido e menos problemático.</p>

        <h3>1.1. Entendendo a Planta de Cannabis: Noções Básicas</h3>
        <ul>
            <li><strong>Tipos de Cannabis:</strong> Sativa, Indica, Híbridas e Ruderalis – características e efeitos.</li>
            <li><strong>Canabinoides Principais:</strong> THC, CBD e outros – o que são e como atuam.</li>
            <li><strong>Ciclo de Vida da Planta:</strong> Germinação, estágio vegetativo, floração e maturação.</li>
        </ul>

        <h3>1.2. Planejamento do Seu Cultivo:</h3>
        <ul>
            <li><strong>Definindo Seus Objetivos:</strong> Uso medicinal (qual patologia? qual canabinoide predominante?), uso pessoal recreativo (com responsabilidade e dentro dos limites legais da sua região, se houver).</li>
            <li><strong>Escolha do Local:</strong> Cultivo indoor (dentro de casa) ou outdoor (ao ar livre)? Vantagens e desvantagens de cada um. Discrição é fundamental!</li>
            <li><strong>Orçamento Inicial:</strong> Quanto você pode investir em equipamentos, sementes, substrato, etc.? É possível começar com pouco.</li>
            <li><strong>Aspectos Legais Preliminares:</strong> Pesquise a legislação da sua cidade/estado/país. Se for para uso medicinal, comece a organizar sua documentação médica (ver Parte 3).</li>
        </ul>

        <h3>1.3. Escolha e Germinação das Sementes:</h3>
        <ul>
            <li><strong>Tipos de Sementes:</strong> Regulares, feminizadas, automáticas. Qual a melhor para iniciantes?</li>
            <li><strong>Onde Conseguir Sementes:</strong> Bancos de sementes online (pesquise a legalidade da importação em seu país), associações, trocas entre cultivadores (com cautela).</li>
            <li><strong>Métodos de Germinação:</strong> Papel toalha, direto no substrato, copo d'água. Passo a passo para o sucesso.</li>
        </ul>
        <p class="dica-pro"><strong>Dica Pro:</strong> Comece com poucas plantas. É mais fácil aprender e manejar um cultivo menor, além de ser mais discreto e, em muitos casos, mais fácil de justificar legalmente para uso pessoal.</p>

        <h3>1.4. Preparando o Ambiente e o Substrato:</h3>
        <ul>
            <li><strong>Substrato Ideal:</strong> Tipos de terra, perlita, vermiculita, fibra de coco. Receitas de substratos caseiros ou opções prontas.</li>
            <li><strong>Vasos:</strong> Tamanho adequado para cada fase da planta. Materiais (plástico, tecido, cerâmica).</li>
            <li><strong>Iluminação (para indoor):</strong> Tipos de lâmpadas (LED, HPS, fluorescentes). Espectro de luz e fotoperíodo.</li>
            <li><strong>Ventilação e Exaustão (para indoor):</strong> Importância da circulação de ar para evitar mofo e pragas.</li>
            <li><strong>Controle de Temperatura e Umidade:</strong> Faixas ideais para cada fase do ciclo.</li>
        </ul>
        <p>Ao final desta etapa, você terá suas primeiras mudinhas brotando, prontas para iniciar a fase de crescimento vegetativo. A paciência e a observação constante são suas maiores aliadas.</p>
    </article>

    <article class="parte-manual">
        <h2>Parte 2: Cultivando com Maestria – Do Crescimento à Colheita Generosa</h2>
        <p>Com suas plantas já estabelecidas, esta parte do manual foca nos cuidados diários, técnicas de manejo e nos sinais que a planta dá, culminando na tão esperada colheita.</p>

        <h3>2.1. Estágio Vegetativo: Fortalecendo Suas Plantas</h3>
        <ul>
            <li><strong>Rega Correta:</strong> Quando e quanto regar? Evitando o excesso e a falta de água. Qualidade da água.</li>
            <li><strong>Nutrição:</strong> Macronutrientes (NPK) e micronutrientes. Tipos de fertilizantes (orgânicos vs. minerais). Como identificar deficiências e excessos.</li>
            <li><strong>Poda e Treinamento (Opcional, mas recomendado):</strong> Técnicas como LST (Low Stress Training), topping, FIM, SCROG. Objetivos: aumentar o rendimento e controlar o tamanho.</li>
            <li><strong>Prevenção e Controle de Pragas e Doenças:</strong> Identificando os problemas mais comuns (ácaros, fungos, pulgões). Soluções orgânicas e preventivas.</li>
        </ul>

        <h3>2.2. Floração: A Magia Acontece</h3>
        <ul>
            <li><strong>Indução à Floração:</strong> Mudança no fotoperíodo para plantas fotoperiódicas.</li>
            <li><strong>Cuidados Específicos na Floração:</strong> Ajustes na nutrição (mais Fósforo e Potássio). Suporte para galhos pesados.</li>
            <li><strong>Identificação do Sexo da Planta (para sementes regulares):</strong> Removendo machos para evitar polinização (a menos que seu objetivo seja produzir sementes).</li>
            <li><strong>Desenvolvimento dos Buds (Flores):</strong> Acompanhando o amadurecimento dos tricomas (glândulas de resina).</li>
        </ul>
        <p class="dica-pro"><strong>Dica Pro:</strong> Invista em uma lupa de pelo menos 30x de aumento para observar os tricomas. Eles são o melhor indicador do ponto ideal de colheita, variando de transparentes a leitosos e, finalmente, âmbar.</p>

        <h3>2.3. Colheita, Secagem e Cura: O Toque Final</h3>
        <ul>
            <li><strong>O Ponto Certo da Colheita:</strong> Observando os tricomas e pistilos. Efeitos diferentes conforme o ponto de colheita.</li>
            <li><strong>Processo de Colheita (Manicure):</strong> Wet trim (manicure úmida) vs. Dry trim (manicure seca).</li>
            <li><strong>Secagem Correta:</strong> Ambiente escuro, ventilado, com temperatura e umidade controladas. Tempo médio de secagem.</li>
            <li><strong>Cura (Fundamental para Qualidade):</strong> Processo de maturação em potes de vidro herméticos. Abertura periódica dos potes (burping). Tempo de cura e seus benefícios (sabor, aroma, potência).</li>
        </ul>
        <p>Parabéns! Se você chegou até aqui, realizou seu primeiro ciclo completo de cultivo. Agora, é crucial saber como armazenar seu produto e, mais importante, como se proteger legalmente.</p>
    </article>

    <article class="parte-manual">
        <h2>Parte 3: Cultivo Protegido – Entendendo a Lei e Buscando Seus Direitos</h2>
        <p>Cultivar cannabis no Brasil, mesmo para fins medicinais, ainda envolve riscos legais. Esta seção é dedicada a informar sobre a legislação e como a GanjaDAO pode auxiliar na sua proteção.</p>

        <h3>3.1. Legislação Brasileira sobre Cannabis: O Que Você Precisa Saber</h3>
        <ul>
            <li><strong>Lei de Drogas (Lei nº 11.343/2006):</strong> Diferença entre usuário e traficante. Penas para cultivo.</li>
            <li><strong>Exceções para Uso Medicinal e Científico:</strong> Artigo 2º, parágrafo único, da Lei de Drogas.</li>
            <li><strong>Resoluções da ANVISA:</strong> Importação de produtos à base de cannabis. Venda em farmácias (limitada).</li>
            <li><strong>O Papel do Habeas Corpus Preventivo:</strong> O que é, como funciona e por que é importante para o autocultivador medicinal.</li>
        </ul>

        <h3>3.2. Documentação Essencial para Sua Defesa (Foco Medicinal):</h3>
        <ul>
            <li><strong>Laudo Médico Detalhado:</strong> Atestando a patologia, indicação da cannabis, ineficácia de outros tratamentos, posologia. Deve ser recente e de profissional habilitado.</li>
            <li><strong>Prescrição Médica:</strong> Especificando o uso da cannabis.</li>
            <li><strong>Histórico Médico:</strong> Exames, receitas anteriores, etc.</li>
            <li><strong>Comprovante de Residência e Identidade.</strong></li>
            <li><strong>Outros Documentos:</strong> Autorizações de importação (se houver), cadastro em associações, etc.</li>
        </ul>
        <p class="dica-pro"><strong>Dica Pro:</strong> Mantenha toda a sua documentação organizada, digitalizada e, se possível, com cópias autenticadas. Em caso de abordagem, ter esses documentos à mão pode ser crucial.</p>

        <h3>3.3. Como a GanjaDAO Pode Ajudar:</h3>
        <ul>
            <li><strong>Plataforma HC Digital Automatizado:</strong> Facilita a organização dos seus documentos e a elaboração da minuta da sua petição de Habeas Corpus preventivo.</li>
            <li><strong>Informação e Educação:</strong> Artigos, guias (como este!) e webinars sobre cultivo, legislação e direitos.</li>
            <li><strong>Rede de Apoio:</strong> Conexão com advogados parceiros, associações e outros cultivadores.</li>
            <li><strong>Consultoria e Suporte:</strong> Nossa equipe está disponível para tirar dúvidas e orientar sobre o uso da plataforma.</li>
        </ul>

        <h3>3.4. O Que Fazer em Caso de Abordagem Policial:</h3>
        <ul>
            <li>Mantenha a calma e seja respeitoso.</li>
            <li>Apresente sua documentação médica e, se tiver, a decisão do HC.</li>
            <li>Você tem o direito de permanecer em silêncio e de não produzir provas contra si.</li>
            <li>Não autorize a entrada em sua residência sem mandado judicial (a menos que orientado por advogado).</li>
            <li>Contate um advogado imediatamente. Tenha sempre o número de um profissional de confiança.</li>
        </ul>
        <p>A jornada do cultivador autônomo é de aprendizado contínuo. A GanjaDAO está ao seu lado para fornecer as ferramentas e o conhecimento para que você possa cultivar com segurança, qualidade e, acima de tudo, com seus direitos protegidos. Explore nossa plataforma, participe da nossa comunidade e fortaleça essa rede de autonomia e cuidado.</p>
    </article>

    <div style="text-align:center; margin-top:30px;">
        <p><strong>Este manual é um ponto de partida. Aprofunde seus estudos, troque experiências e conte com a GanjaDAO!</strong></p>
        <!-- O botão de contato será renderizado pelo React usando Link -->
    </div>
`;

const manualCultivadorStyles = `
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
  .conteudo-pagina-interna h3 {
    color: #007bff; /* Azul para subtítulos de seção */
    margin-top: 25px;
    margin-bottom: 10px;
    font-size: 1.25em;
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
  .parte-manual {
    border: 1px solid #dee2e6; /* Tailwind gray-200 */
    padding: 20px;
    margin-bottom: 30px;
    border-radius: 8px; /* Tailwind rounded-lg */
    background-color: #f8f9fa; /* Tailwind gray-50 */
  }
  .parte-manual h2 {
    margin-top: 0;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
  }
  .btn-download-ebook-react {
    display: inline-block;
    padding: 12px 25px;
    background-color: #16a34a; /* Tailwind green-600 */
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    margin: 20px 0;
    text-align: center;
    transition: background-color 0.2s ease-in-out;
  }
  .btn-download-ebook-react:hover {
    background-color: #15803d; /* Tailwind green-700 */
  }
  .btn-contato-manual {
    display: inline-block;
    padding: 12px 25px;
    background-color: #0ea5e9; /* Tailwind sky-500 */
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    margin: 20px 0;
    text-align: center;
    transition: background-color 0.2s ease-in-out;
  }
  .btn-contato-manual:hover {
    background-color: #0284c7; /* Tailwind sky-600 */
  }
  .dica-pro {
    background-color: #e0f2fe; /* Tailwind sky-100 */
    border-left: 4px solid #0ea5e9; /* Tailwind sky-500 */
    padding: 10px 15px;
    margin: 15px 0;
    font-style: italic;
  }
`;

const ManualCultivadorAutonomoPage: React.FC = () => {
  return (
    <Layout>
      <style>{manualCultivadorStyles}</style>
      <main className="container mx-auto">
        <section className="conteudo-pagina-interna py-8">
          <div dangerouslySetInnerHTML={{ __html: manualCultivadorContent }} />
          <div style={{ textAlign: 'center' }}>
            <a href="/download/manual_cultivador_autonomo.pdf" className="btn-download-ebook-react" disabled={true}>
              Baixar eBook Completo (PDF)
            </a>
            <p style={{ fontSize: '0.9em', color: '#6c757d', disabled: true }}>
              (Link para download do eBook completo, caso seja disponibilizado)
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default ManualCultivadorAutonomoPage;

