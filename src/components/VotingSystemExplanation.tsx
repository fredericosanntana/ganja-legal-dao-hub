
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
          Sistema de Iniciativas da GanjaDAO
        </CardTitle>
        <CardDescription>
          Entenda como funciona o sistema de participação na DAO
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
                membros ativos (com assinatura válida) podem votar alocando seus créditos.
              </p>
              <p>
                Este é um sistema aberto onde a comunidade pode propor suas próprias ideias de forma livre,
                garantindo a participação de todos na governança da DAO.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="votacao">
            <AccordionTrigger>Como Funciona a Votação</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                Para votar em iniciativas, utilizamos o sistema de <strong>votação quadrática</strong>, 
                onde o custo em créditos é o quadrado da intensidade do seu voto.
              </p>
              <p className="mb-2">
                Por exemplo:
              </p>
              <ul className="list-disc list-inside text-sm mb-2">
                <li>Um voto de intensidade 1 custa 1 crédito</li>
                <li>Um voto de intensidade 2 custa 4 créditos</li>
                <li>Um voto de intensidade 3 custa 9 créditos</li>
                <li>Um voto de intensidade 4 custa 16 créditos</li>
              </ul>
              <p>
                Esse sistema permite que você expresse convicções fortes em temas que considera mais importantes,
                criando um processo decisório mais equitativo e representativo.
              </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="creditos">
            <AccordionTrigger>Créditos de Votação</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                Cada membro recebe uma quantidade inicial de <strong>créditos de votação</strong> que pode
                utilizar para votar nas iniciativas que considerar mais relevantes.
              </p>
              <p>
                A votação quadrática permite uma distribuição mais democrática do poder de voto, evitando que
                grupos majoritários dominem todas as decisões e permitindo que minorias tenham voz em questões
                que consideram muito importantes.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default VotingSystemExplanation;
