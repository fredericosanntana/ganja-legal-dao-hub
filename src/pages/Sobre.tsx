
import Layout from "@/components/Layout";
import { Users, Shield, BookOpen, Leaf } from "lucide-react";

const Sobre = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Quem Somos</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Nós que Plantamos</h2>
            <p className="text-lg mb-6">
              Somos a GanjaDAO, uma comunidade de proteção legal e ativismo digital criada para defender e empoderar 
              cultivadores individuais de Cannabis no Brasil. Nossa missão é clara e direta: proteger quem cultiva, 
              garantindo autonomia e segurança jurídica através da tecnologia e da mobilização coletiva.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Nossa Missão</h2>
            <p>
              Na GanjaDAO, acreditamos firmemente que cultivar Cannabis para uso pessoal, medicinal ou terapêutico é um 
              direito constitucional, garantido pela liberdade individual e pela dignidade humana, princípios consagrados 
              pela Constituição Federal e reforçados pelo Supremo Tribunal Federal nas decisões históricas 
              (RE 635659 e ADPF 187).
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Por que Existimos</h2>
            <p>
              Existimos porque o jardineiro não é traficante. Existimos porque cada cultivador merece autonomia jurídica 
              para proteger-se sem depender exclusivamente de advogados caros ou estruturas burocráticas. Nosso objetivo é 
              democratizar o acesso à justiça preventiva através da tecnologia e da informação clara e acessível.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Como Fazemos Isso</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Automação Jurídica</h3>
                </div>
                <p>
                  Nossa plataforma oferece um gerador automatizado de Habeas Corpus preventivo, permitindo que cada cultivador 
                  exerça seus direitos de forma prática e independente.
                </p>
              </div>
              
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Provas Públicas e Blockchain</h3>
                </div>
                <p>
                  Utilizamos tecnologia blockchain combinada às redes sociais para registrar de forma transparente e estratégica 
                  as provas públicas de boa-fé e autocuidado.
                </p>
              </div>
              
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Educação Jurídica Acessível</h3>
                </div>
                <p>
                  Acreditamos na informação como ferramenta de proteção. Disponibilizamos cursos de autoproteção jurídica e 
                  kits informativos detalhados para cada etapa do cultivo seguro.
                </p>
              </div>
              
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Mobilização e Engajamento</h3>
                </div>
                <p>
                  Somos uma rede ativa que promove eventos, encontros e ações de marketing político digital, aumentando a 
                  consciência social e impulsionando mudanças reais nas políticas sobre Cannabis.
                </p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Valores Fundamentais</h2>
            <ul className="space-y-3">
              <li>
                <strong>Autonomia Individual e Cuidado Coletivo:</strong> Cada indivíduo empoderado fortalece toda a comunidade.
              </li>
              <li>
                <strong>Liberdade e Autocuidado são Inegociáveis:</strong> Cultivar é um ato de saúde, autocuidado e resistência cidadã.
              </li>
              <li>
                <strong>Transparência e Legitimidade:</strong> Atuamos com clareza, ética e responsabilidade, fortalecendo nossa 
                legitimidade com estratégias jurídicas comprovadas.
              </li>
            </ul>
            
            <div className="bg-gradient-to-br from-activist-50 to-ganja-50 p-6 rounded-lg mt-10">
              <h2 className="text-2xl font-semibold mb-3">Junte-se a Nós</h2>
              <p>
                Na GanjaDAO, a proteção é coletiva, mas começa pelo individual. Faça parte desta rede ativa e engajada, 
                fortaleça sua proteção jurídica e ajude-nos a transformar a realidade do direito canábico no Brasil.
              </p>
              <p className="italic mt-4">Enquanto você cuida da planta, nós nos cuidamos.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Sobre;
