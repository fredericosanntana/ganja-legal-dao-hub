
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { UserCircle, CalendarDays, MapPin, Users, ArrowRight } from "lucide-react";

const ChamadaEmbaixadoresPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Programa de Embaixadores GanjaDAO</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Chamada para Embaixadores</CardTitle>
            <CardDescription>Seja um representante da GanjaDAO na sua região</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Estamos buscando ativistas, advogados, pacientes e cultivadores comprometidos com a causa da Cannabis medicinal e terapêutica para se tornarem embaixadores da GanjaDAO em suas regiões. Este é um chamado para quem deseja fazer a diferença de forma concreta e organizada.
            </p>
            
            <h3 className="text-xl font-semibold mt-4">O que fazem os embaixadores?</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Representam os valores e princípios da GanjaDAO em suas localidades</li>
              <li>Organizam encontros e eventos educativos sobre direitos dos cultivadores</li>
              <li>Conectam pacientes com a rede de apoio jurídico e médico</li>
              <li>Participam de reuniões estratégicas e desenvolvimento de iniciativas</li>
              <li>Levantam dados sobre a situação jurídica local para o mapa de proteção</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-4">Requisitos</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Compromisso com a causa da Cannabis medicinal e terapêutica</li>
              <li>Disponibilidade para dedicar ao menos 5 horas semanais às atividades</li>
              <li>Conhecimento sobre aspectos jurídicos ou médicos relacionados à Cannabis (desejável, mas não obrigatório)</li>
              <li>Habilidade para articular redes locais e comunicar-se bem</li>
              <li>Ser membro do Clube GanjaDAO</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              Candidate-se para Embaixador
            </Button>
          </CardFooter>
        </Card>
        
        <h2 className="text-2xl font-bold mb-4">Eventos Organizados por Embaixadores</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            {
              title: "Workshop Jurídico em São Paulo",
              date: "15 de Junho, 2025",
              location: "São Paulo, SP",
              attendees: 35,
              description: "Workshop sobre proteção legal para cultivadores com foco em habeas corpus preventivos."
            },
            {
              title: "Roda de Conversa: Cannabis e Saúde",
              date: "22 de Junho, 2025",
              location: "Rio de Janeiro, RJ",
              attendees: 20,
              description: "Discussão sobre os usos terapêuticos da Cannabis e depoimentos de pacientes."
            },
            {
              title: "Palestra: Direitos do Cultivador",
              date: "05 de Julho, 2025",
              location: "Florianópolis, SC",
              attendees: 25,
              description: "Apresentação sobre direitos constitucionais relacionados ao cultivo para uso pessoal."
            },
            {
              title: "Encontro Regional GanjaDAO",
              date: "12 de Julho, 2025",
              location: "Brasília, DF",
              attendees: 40,
              description: "Encontro para discutir estratégias de advocacy e acompanhamento de projetos de lei."
            }
          ].map((event, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{event.attendees} participantes</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {event.description}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <span>Detalhes</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Depoimento de Embaixador</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="border-l-4 border-ganja-400 pl-4 italic">
              "Ser embaixador da GanjaDAO transformou minha militância. Conseguimos criar uma rede local de apoio que já ajudou mais de 20 pacientes a obterem seus habeas corpus preventivos e agora temos um grupo de apoio para novos cultivadores. Fazemos a diferença na vida das pessoas."
            </blockquote>
            <div className="flex items-center mt-4">
              <UserCircle className="h-8 w-8 text-ganja-500 mr-2" />
              <div>
                <p className="font-medium">Carlos M.</p>
                <p className="text-sm text-muted-foreground">Embaixador em Belo Horizonte desde 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChamadaEmbaixadoresPage;
