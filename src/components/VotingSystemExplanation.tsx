
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Vote, Users } from "lucide-react";

const VotingSystemExplanation = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vote className="h-5 w-5 text-primary" />
          Sistema de Votação da GanjaDAO
        </CardTitle>
        <CardDescription>
          Entenda como funcionam os sistemas de participação na DAO
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="iniciativas">
            <AccordionTrigger>Iniciativas</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                <strong>Iniciativas</strong> são propostas criadas pelos membros para sugerir novos projetos, 
                mudanças ou ações que a DAO deveria tomar. Qualquer membro pode criar uma iniciativa e os 
                demais membros podem votar alocando seus créditos.
              </p>
              <p>
                Este é um sistema aberto onde a comunidade pode propor suas próprias ideias de forma livre.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="votacoes">
            <AccordionTrigger>Votações</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                <strong>Votações</strong> são consultas estruturadas e oficiais criadas pela governança da DAO, 
                com propostas pré-definidas e prazos específicos. São usadas para decisões estratégicas e que 
                afetam a organização como um todo.
              </p>
              <p>
                Este é um sistema mais formal e estruturado para decisões importantes da comunidade.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="creditos">
            <AccordionTrigger>Créditos de Votação</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                Os <strong>créditos de votação</strong> são compartilhados entre ambos os sistemas. Você possui 
                um total de créditos que pode usar tanto em Iniciativas quanto em Votações.
              </p>
              <p>
                Em ambos os casos, utilizamos o sistema de <strong>votação quadrática</strong>, onde o custo 
                em créditos é o quadrado da intensidade do seu voto, permitindo expressar convicções fortes 
                em temas que você considera mais importantes.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default VotingSystemExplanation;
