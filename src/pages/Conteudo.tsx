
import React, { useEffect, useState } from 'react';
import Layout from "@/components/Layout";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, Award, AlertTriangle, Scale, Tag, Book, Map, User, PlusCircle, Edit3, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { getAllAuthServicePosts, AuthServicePost } from "@/services/authService";

// Interface para o formato unificado dos artigos a serem exibidos
interface DisplayArticle {
  id: string | number; // IDs podem ser string (estáticos) ou number (dinâmicos)
  title: string;
  description: string;
  icon: JSX.Element;
  category: string;
  categoryColor: string;
  isDynamic?: boolean; // Flag para diferenciar artigos dinâmicos
  createdAt?: string; // Para possível ordenação
  link?: string; // Link to navigate to
}

const staticArticles: DisplayArticle[] = [
  {
    id: "checklist-juridico",
    title: "Checklist Jurídico GanjaDAO",
    description: "Lista completa de ações para proteção legal do cultivador de Cannabis",
    icon: <FileText className="h-5 w-5" />,
    category: "Jurídico",
    categoryColor: "bg-blue-100 text-blue-800"
  },
  {
    id: "bastidores",
    title: "Bastidores da GanjaDAO",
    description: "Conheça como surgiu a iniciativa e quem está por trás dela",
    icon: <Users className="h-5 w-5" />,
    category: "Institucional",
    categoryColor: "bg-purple-100 text-purple-800"
  },
  // ... (outros artigos estáticos permanecem aqui, copiados da versão anterior)
  {
    id: "caso-mariana",
    title: "Caso Real: Mariana e GanjaDAO",
    description: "Como o HC preventivo ajudou uma cultivadora em uma abordagem policial",
    icon: <Award className="h-5 w-5" />,
    category: "Depoimento",
    categoryColor: "bg-green-100 text-green-800"
  },
  {
    id: "convocacao",
    title: "Convocação DAO para Votação",
    description: "Participe da próxima votação sobre as iniciativas da GanjaDAO",
    icon: <Users className="h-5 w-5" />,
    category: "Clube",
    categoryColor: "bg-purple-100 text-purple-800"
  },
  {
    id: "mitos-verdades",
    title: "Mitos e Verdades sobre HC Digital",
    description: "Esclarecendo dúvidas comuns sobre o Habeas Corpus preventivo",
    icon: <AlertTriangle className="h-5 w-5" />,
    category: "Jurídico",
    categoryColor: "bg-blue-100 text-blue-800"
  },
  {
    id: "cultivo-legal",
    title: "Cultivo Legal: Descentralizando o Direito",
    description: "Como a tecnologia pode democratizar o acesso à justiça",
    icon: <Scale className="h-5 w-5" />,
    category: "Artigo",
    categoryColor: "bg-amber-100 text-amber-800"
  },
  {
    id: "manual-cultivador",
    title: "Manual do Cultivador Autônomo",
    description: "Guia completo para o autocultivo responsável e seguro",
    icon: <Book className="h-5 w-5" />,
    category: "Manual",
    categoryColor: "bg-teal-100 text-teal-800"
  },
  {
    id: "mapa-protecao",
    title: "Mapa da Proteção (HCs e Autocultivo)",
    description: "Panorama da situação jurídica do cultivo de Cannabis no Brasil",
    icon: <Map className="h-5 w-5" />,
    category: "Jurídico",
    categoryColor: "bg-blue-100 text-blue-800"
  },
  {
    id: "embaixadores",
    title: "Chamada para Embaixadores GanjaDAO",
    description: "Junte-se ao time de embaixadores e ajude a espalhar a causa",
    icon: <User className="h-5 w-5" />,
    category: "Oportunidade",
    categoryColor: "bg-emerald-100 text-emerald-800"
  },
  // Add Ganja Chat card
  {
    id: "ganja-chat",
    title: "Ganja Chat - Assistente Jurídico",
    description: "Tire suas dúvidas sobre aspectos jurídicos relacionados ao cultivo de cannabis",
    icon: <MessageSquare className="h-5 w-5" />,
    category: "Serviço",
    categoryColor: "bg-green-100 text-green-800",
    link: "/conteudo/ganja-chat"
  }
];

const Conteudo = () => {
  const { user } = useAuth();
  const [allArticles, setAllArticles] = useState<DisplayArticle[]>(staticArticles);

  useEffect(() => {
    const fetchDynamicArticles = async () => {
      const dynamicPosts: AuthServicePost[] = await getAllAuthServicePosts();
      const formattedDynamicArticles: DisplayArticle[] = dynamicPosts
        .filter(post => post.published) // Mostra apenas os publicados
        .map(post => ({
          id: post.id, // ID numérico do localStorage
          title: post.title,
          description: post.content.substring(0, 150) + (post.content.length > 150 ? "..." : ""),
          icon: <Edit3 className="h-5 w-5" />, // Ícone para artigos criados
          category: "Comunidade", // Categoria padrão
          categoryColor: "bg-yellow-100 text-yellow-800", // Cor padrão
          isDynamic: true,
          createdAt: post.createdAt
        }));
      
      // Combina e ordena (mais recentes primeiro)
      setAllArticles([...formattedDynamicArticles, ...staticArticles].sort((a, b) => {
        if (a.createdAt && b.createdAt) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (a.createdAt) return -1; // Artigos com data vêm antes
        if (b.createdAt) return 1;  // Artigos com data vêm antes
        return 0;
      }));
    };

    fetchDynamicArticles();
  }, []); // Roda uma vez ao montar o componente

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Conteúdo Educacional</h1>
          <p className="text-lg text-muted-foreground">
            Artigos, manuais e notícias relevantes para a comunidade
          </p>
        </div>

        {/* Only show New Article button for admin users */}
        {user?.is_admin && (
          <div className="mb-6 text-center md:text-right">
            <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700">
              <Link to="/conteudo/editor">
                <PlusCircle className="mr-2 h-5 w-5" />
                Novo Artigo
              </Link>
            </Button>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          {allArticles.length === 0 ? (
            <p className='text-center text-slate-500'>Nenhum artigo encontrado.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allArticles.map((article) => (
                <Card key={article.isDynamic ? `dynamic-${article.id}` : `static-${article.id}`} className="card-hover flex flex-col">
                  <CardHeader className='flex-grow'>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${article.categoryColor}`}>
                        {article.category}
                      </span>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      {article.icon}
                      {article.title}
                    </CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                  </CardHeader>
                  <div className="px-6 pb-6 mt-auto">
                    {article.isDynamic ? (
                       <Button variant="outline" asChild className="w-full bg-yellow-50 hover:bg-yellow-100">
                        <span className='flex items-center'>
                           <BookOpen className="mr-2 h-4 w-4" />
                           Ver Conteúdo (Em Breve)
                        </span>
                      </Button>
                    ) : (
                      <Button variant="outline" asChild className="w-full">
                        <Link to={article.link || `/conteudo/${article.id}`}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          {article.id === 'ganja-chat' ? 'Abrir Chat' : 'Ler Artigo'}
                        </Link>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Conteudo;
