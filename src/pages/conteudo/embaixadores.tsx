
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar, MessageSquare, ShieldCheck, Users } from 'lucide-react';

const ChamadaEmbaixadoresPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Chamada para Embaixadores GanjaDAO</h1>
        <p className="text-center text-muted-foreground mb-10">
          Junte-se ao time de embaixadores e ajude a espalhar a causa da cannabis medicinal
        </p>
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-ganja-400 to-activist-600 text-white rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Seja um Embaixador da Mudança</h2>
          <p className="mb-6">
            Estamos procurando pessoas comprometidas que acreditem no poder da cannabis medicinal
            e queiram fazer parte de um movimento que está transformando vidas e mudando a legislação
            no Brasil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Saiba Mais
            </Button>
            <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 w-full sm:w-auto">
              Candidatar-se
            </Button>
          </div>
        </div>
        
        {/* O que fazem os embaixadores */}
        <h2 className="text-2xl font-bold mb-6">O Que Fazem Nossos Embaixadores?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <Users className="h-8 w-8 text-ganja-500" />,
              title: "Representação Comunitária",
              description: "Representar a GanjaDAO em eventos, encontros e debates sobre cannabis medicinal na sua região."
            },
            {
              icon: <MessageSquare className="h-8 w-8 text-ganja-500" />,
              title: "Educação e Informação",
              description: "Compartilhar informações científicas e jurídicas precisas sobre o uso medicinal da cannabis."
            },
            {
              icon: <ShieldCheck className="h-8 w-8 text-ganja-500" />,
              title: "Suporte a Pacientes",
              description: "Orientar pacientes sobre os primeiros passos para acesso seguro e legal à cannabis medicinal."
            }
          ].map((item, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="mb-2">{item.icon}</div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Requisitos */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-activist-600" />
              Requisitos para se tornar um Embaixador
            </CardTitle>
            <CardDescription>
              O que procuramos em nossos embaixadores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="min-w-4 min-h-4 rounded-full bg-activist-600 mt-1.5"></div>
                <span>Conhecimento sobre cannabis medicinal e/ou ativismo cannábico</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-4 min-h-4 rounded-full bg-activist-600 mt-1.5"></div>
                <span>Habilidade de comunicação e empatia com pacientes</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-4 min-h-4 rounded-full bg-activist-600 mt-1.5"></div>
                <span>Comprometimento com informação baseada em evidências</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-4 min-h-4 rounded-full bg-activist-600 mt-1.5"></div>
                <span>Disponibilidade para dedicar pelo menos 5 horas semanais às atividades</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="min-w-4 min-h-4 rounded-full bg-activist-600 mt-1.5"></div>
                <span>Residir no Brasil e ter mais de 18 anos</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        {/* Benefícios */}
        <h2 className="text-2xl font-bold mb-6">Benefícios de ser um Embaixador</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            "Acesso gratuito ao clube GanjaDAO e todos os recursos premium",
            "Capacitação exclusiva com especialistas em cannabis medicinal",
            "Participação em eventos restritos com a comunidade",
            "Certificação oficial como Embaixador GanjaDAO",
            "Acesso prioritário a novas ferramentas e recursos",
            "Participação ativa nas decisões e rumos da organização"
          ].map((benefit, index) => (
            <div key={index} className="flex items-center p-4 border rounded-lg">
              <div className="h-8 w-8 bg-ganja-100 text-ganja-800 rounded-full flex items-center justify-center mr-3">
                {index + 1}
              </div>
              <p>{benefit}</p>
            </div>
          ))}
        </div>
        
        {/* Processo Seletivo */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Processo Seletivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4 relative border-l border-muted pl-6">
              <li className="mb-10">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-1.5 border border-white"></div>
                <h3 className="font-bold">Inscrição</h3>
                <p className="text-sm text-muted-foreground mb-1">Preencha o formulário de candidatura com suas informações e motivações</p>
              </li>
              <li className="mb-10">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-1.5 border border-white"></div>
                <h3 className="font-bold">Entrevista</h3>
                <p className="text-sm text-muted-foreground mb-1">Conversaremos para conhecer melhor sua experiência e expectativas</p>
              </li>
              <li className="mb-10">
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-1.5 border border-white"></div>
                <h3 className="font-bold">Capacitação</h3>
                <p className="text-sm text-muted-foreground mb-1">Treinamento online sobre os princípios e atuação da GanjaDAO</p>
              </li>
              <li>
                <div className="absolute w-3 h-3 bg-primary rounded-full -left-1.5 border border-white"></div>
                <h3 className="font-bold">Início das atividades</h3>
                <p className="text-sm text-muted-foreground">Após aprovação, você estará oficialmente representando a GanjaDAO</p>
              </li>
            </ol>
          </CardContent>
        </Card>
        
        {/* CTA Final */}
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>Pronto para se juntar a nós?</CardTitle>
            <CardDescription>
              As inscrições para embaixadores estão abertas até 30/06/2023
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Se você se identifica com nossa missão de promover o acesso seguro e legal à cannabis medicinal 
              e deseja fazer parte dessa transformação, candidate-se agora para ser um Embaixador GanjaDAO.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-grow w-full">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    className="w-full pl-10 h-12 rounded-md border border-input bg-background px-3 py-2"
                  />
                </div>
              </div>
              <Button size="lg" className="w-full sm:w-auto">
                Candidatar-se
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Ao se candidatar, você concorda em receber comunicações da GanjaDAO. Seus dados serão tratados conforme nossa política de privacidade.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChamadaEmbaixadoresPage;
