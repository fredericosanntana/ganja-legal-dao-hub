
import Layout from "@/components/Layout";

const Privacidade = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">
              A GanjaDAO respeita profundamente a sua privacidade e tem como compromisso fundamental proteger seus dados pessoais. 
              Esta Política de Privacidade esclarece como coletamos, usamos, compartilhamos e protegemos as informações dos 
              nossos usuários, mantendo total transparência com nossa comunidade.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Quais Dados Coletamos</h2>
            <ul className="space-y-3">
              <li>
                <strong>Dados pessoais básicos:</strong> nome, e-mail, telefone e endereço, usados exclusivamente para contato, 
                suporte e autenticação na plataforma.
              </li>
              <li>
                <strong>Informações relacionadas ao cultivo:</strong> detalhes necessários para gerar automaticamente documentos 
                jurídicos (Habeas Corpus preventivo), utilizados com máxima segurança e confidencialidade.
              </li>
              <li>
                <strong>Dados de utilização da plataforma:</strong> informações sobre interações, preferências e acesso, visando 
                melhorar continuamente nossos serviços e experiência do usuário.
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Como Utilizamos Seus Dados</h2>
            <ul className="space-y-3">
              <li>
                Para garantir a prestação de serviços automatizados de proteção jurídica, como a geração personalizada e 
                automatizada de Habeas Corpus preventivos.
              </li>
              <li>
                Para fornecer suporte personalizado, conteúdos educativos e informações relevantes sobre atualizações jurídicas 
                relacionadas ao cultivo de Cannabis.
              </li>
              <li>
                Para comunicação interna, atualizações da plataforma, marketing responsável e mobilização coletiva relacionada 
                à causa da GanjaDAO.
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Compartilhamento e Segurança dos Dados</h2>
            <ul className="space-y-3">
              <li>
                Jamais vendemos, alugamos ou comercializamos dados pessoais. Dados são compartilhados apenas quando necessários 
                para cumprir com obrigações legais e judiciais, ou para garantir o funcionamento seguro dos serviços prestados.
              </li>
              <li>
                Utilizamos tecnologia blockchain para registro seguro e transparente de informações públicas, sempre respeitando 
                o anonimato e privacidade pessoal dos usuários.
              </li>
              <li>
                Implementamos medidas rigorosas de segurança para proteger suas informações contra acessos não autorizados, 
                alterações ou vazamentos.
              </li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Direitos dos Usuários</h2>
            <p>Você tem total controle sobre seus dados e pode, a qualquer momento:</p>
            <ul className="space-y-2">
              <li>Solicitar acesso aos dados armazenados.</li>
              <li>Pedir correção de informações incorretas.</li>
              <li>Solicitar exclusão dos seus dados pessoais, ressalvadas as informações necessárias para cumprir obrigações legais.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies</h2>
            <p>
              Utilizamos cookies para melhorar sua experiência de navegação e utilização da plataforma, oferecendo conteúdos 
              personalizados e relevantes. Você pode desativar cookies através das configurações do seu navegador, porém isso 
              pode afetar algumas funcionalidades da plataforma.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Alterações nesta Política</h2>
            <p>
              Esta Política pode ser alterada periodicamente para melhor atender nossas práticas e compromissos com a privacidade. 
              Toda alteração será informada previamente através de nossos canais oficiais.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contato</h2>
            <p>
              Em caso de dúvidas ou solicitações relativas à sua privacidade, entre em contato diretamente pelo nosso canal 
              oficial: <a href="mailto:ganja.dao.org@gmail.com" className="text-primary underline">ganja.dao.org@gmail.com</a>
            </p>
            
            <p className="mt-8 italic">
              A privacidade e a proteção jurídica são pilares fundamentais da nossa atuação. Conte conosco para manter seus 
              dados seguros enquanto você cultiva sua liberdade.
            </p>
            
            <p className="font-semibold mt-6">GanjaDAO – Porque cuidar de você é parte do nosso cultivo.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacidade;
