
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { UserCircle, CalendarDays, MapPin, Users, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";

const ChamadaEmbaixadoresPage = () => {
  return (
    <Layout>
      <main className="container">
        <section className="conteudo-pagina">
            <h1>Chamada para Embaixadores GanjaDAO: Ajude a Proteger Quem Planta, Com Você na Linha de Frente!</h1>
            <p className="lead">A GanjaDAO nasceu com a missão de democratizar o acesso à proteção jurídica e ao conhecimento para cultivadores de cannabis medicinal em todo o Brasil. Acreditamos que a força da nossa rede reside na colaboração e no engajamento de cada indivíduo que compartilha nossa visão. Para ampliar nosso impacto e alcançar ainda mais pessoas que necessitam de apoio, lançamos hoje um convite especial: <strong>junte-se a nós como um Embaixador GanjaDAO!</strong></p>

            <p>Se você é uma liderança local, um ativista engajado, um profissional da área jurídica ou da saúde, ou simplesmente alguém apaixonado pela causa da cannabis medicinal e com vontade de fazer a diferença, esta é a sua oportunidade de estar na linha de frente, multiplicando o impacto positivo da GanjaDAO em sua comunidade e em todo o país. Queremos construir uma rede de embaixadores dedicados, que nos ajudem a levar informação, segurança e esperança a quem mais precisa.</p>

            <div className="bloco-chamada-embaixadores">
                <h2>Torne-se um Farol de Esperança e Proteção em Sua Comunidade!</h2>
                <p>Os Embaixadores GanjaDAO serão peças-chave na expansão da nossa rede de apoio. Eles atuarão como pontes entre a GanjaDAO e as comunidades locais, ajudando a disseminar conhecimento, a identificar necessidades e a facilitar o acesso aos nossos serviços e recursos. Buscamos pessoas proativas, com boa comunicação e, acima de tudo, com um compromisso genuíno com a causa.</p>
            </div>

            <h2>Quem Buscamos para Ser um Embaixador GanjaDAO?</h2>
            <p>Acreditamos na diversidade de talentos e experiências. Você pode ser um excelente candidato a Embaixador GanjaDAO se você se identifica com um ou mais dos seguintes perfis:</p>
            <ul>
                <li className="perfil-embaixador"><strong>Lideranças Comunitárias e Ativistas Locais:</strong> Pessoas já engajadas em suas comunidades, com conhecimento das realidades locais e capacidade de mobilização. Queremos fortalecer quem já faz a diferença na base.</li>
                <li className="perfil-embaixador"><strong>Profissionais da Área Jurídica (Advogados, Estudantes de Direito):</strong> Aqueles que desejam aplicar seus conhecimentos para defender o direito à saúde e que podem ajudar a orientar pacientes sobre os caminhos legais e o uso da plataforma HC Digital.</li>
                <li className="perfil-embaixador"><strong>Profissionais da Saúde (Médicos, Terapeutas, Enfermeiros):</strong> Aqueles que prescrevem ou acompanham pacientes em tratamento com cannabis medicinal e podem ajudar a disseminar informações sobre a importância da segurança jurídica para a continuidade dos tratamentos.</li>
                <li className="perfil-embaixador"><strong>Pacientes Experientes e Empoderados:</strong> Pessoas que já passaram pelo processo de obtenção de HC, que cultivam com segurança e que desejam compartilhar sua experiência para inspirar e orientar outros.</li>
                <li className="perfil-embaixador"><strong>Comunicadores e Criadores de Conteúdo:</strong> Indivíduos com habilidade para criar e disseminar informações claras e acessíveis sobre cannabis medicinal, legislação e os serviços da GanjaDAO através de redes sociais, blogs, vídeos, etc.</li>
                <li className="perfil-embaixador"><strong>Organizadores de Eventos e Workshops:</strong> Pessoas com capacidade de organizar encontros, palestras e workshops educativos em suas comunidades para debater o tema e apresentar as soluções da GanjaDAO.</li>
            </ul>
            <p>Se você não se encaixa perfeitamente em um desses perfis, mas sente que tem algo valioso a contribuir, não hesite em se inscrever! Estamos abertos a todas as formas de colaboração.</p>

            <h2>O que Esperamos de um Embaixador GanjaDAO?</h2>
            <ul>
                <li><strong>Compromisso com a Missão da GanjaDAO:</strong> Acreditar e defender o direito ao cultivo seguro e legal de cannabis para fins medicinais.</li>
                <li><strong>Proatividade e Iniciativa:</strong> Buscar ativamente oportunidades para divulgar a GanjaDAO e seus serviços em sua rede de contatos e comunidade.</li>
                <li><strong>Comunicação Clara e Ética:</strong> Transmitir informações de forma precisa, responsável e respeitosa.</li>
                <li><strong>Disposição para Aprender e Compartilhar:</strong> Manter-se atualizado sobre as novidades da GanjaDAO e da legislação, e compartilhar esse conhecimento.</li>
                <li><strong>Feedback Construtivo:</strong> Ajudar a GanjaDAO a aprimorar seus serviços e sua comunicação, trazendo a perspectiva da sua comunidade.</li>
            </ul>

            <h2>Benefícios de Ser um Embaixador GanjaDAO:</h2>
            <p>Ao se tornar um Embaixador, você não apenas contribui para uma causa nobre, mas também recebe reconhecimento e recursos para potencializar sua atuação:</p>
            <ul className="beneficios-embaixador">
                <li><strong>Acesso Exclusivo a Materiais e Treinamentos:</strong> Receba materiais de divulgação personalizados, acesso a treinamentos sobre a plataforma GanjaDAO, legislação e técnicas de comunicação.</li>
                <li><strong>Visibilidade e Reconhecimento:</strong> Tenha seu perfil (opcionalmente) divulgado em nossos canais como um ponto de contato e referência da GanjaDAO em sua região.</li>
                <li><strong>Networking Estratégico:</strong> Conecte-se com outros embaixadores, profissionais e ativistas de todo o Brasil, ampliando sua rede de contatos e colaborações.</li>
                <li><strong>Participação em Eventos Exclusivos:</strong> Convites para webinars, encontros e eventos especiais promovidos pela GanjaDAO.</li>
                <li><strong>Suporte Contínuo da Equipe GanjaDAO:</strong> Conte com o apoio da nossa equipe para tirar dúvidas, receber orientações e desenvolver suas iniciativas locais.</li>
                <li><strong>Oportunidade de Co-criar Soluções:</strong> Participe ativamente do desenvolvimento de novas estratégias e ferramentas para a GanjaDAO, trazendo a voz da sua comunidade.</li>
                <li><strong>Descontos Especiais (quando aplicável):</strong> Possibilidade de acesso a descontos em serviços ou produtos de parceiros da GanjaDAO.</li>
            </ul>

            <h2>Como se Tornar um Embaixador GanjaDAO?</h2>
            <p>O processo é simples. Se você se sentiu chamado por esta convocação e deseja se juntar à nossa linha de frente, siga os passos abaixo:</p>
            <ol>
                <li><strong>Acesse o Formulário de Inscrição:</strong> Clique no botão abaixo para preencher nosso formulário online, contando um pouco sobre você, sua motivação e como acredita que pode contribuir.</li>
                <li><strong>Análise da Inscrição:</strong> Nossa equipe analisará cuidadosamente cada inscrição, buscando construir uma rede de embaixadores diversa e comprometida.</li>
                <li><strong>Entrevista (se necessário):</strong> Poderemos entrar em contato para uma breve conversa online para nos conhecermos melhor e alinharmos expectativas.</li>
                <li><strong>Boas-vindas à Rede:</strong> Se selecionado, você receberá um kit de boas-vindas digital com todas as informações e primeiros passos para iniciar sua jornada como Embaixador GanjaDAO!</li>
            </ol>

            <a href="/embaixadores/inscricao" className="btn-ser-embaixador">QUERO SER UM EMBAIXADOR GANJADAO!</a>
            <p style={{textAlign:"center", fontSize:"0.9em", color:"#6c757d", marginTop:"10px"}}>
                <em>(O link acima levaria para um formulário de inscrição específico para o programa de embaixadores)</em>
            </p>

            <h2>Juntos, Multiplicamos a Proteção e a Esperança!</h2>
            <p>A GanjaDAO acredita no poder da ação coletiva. Com uma rede forte e capilarizada de Embaixadores, poderemos alcançar muito mais pessoas, desmistificar o cultivo medicinal, combater o preconceito e, o mais importante, garantir que mais pacientes possam exercer seu direito à saúde com segurança e dignidade. Sua paixão, seu conhecimento e sua rede de contatos podem ser a chave para transformar vidas.</p>
            <p>Não perca esta oportunidade de fazer parte de um movimento que está mudando a realidade do cultivo de cannabis no Brasil. Venha para a linha de frente conosco. Venha ser um Embaixador GanjaDAO!</p>

        </section>
      </main>
    </Layout>
  );
};

export default ChamadaEmbaixadoresPage;
