
import Layout from "@/components/Layout";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, Award, AlertTriangle, Scale, Tag, Book, Map, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const articles = [
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
    id: "oferta-dao",
    title: "Oferta DAO Ativa (HC Digital com Desconto)",
    description: "Promoção especial para membros do clube GanjaDAO",
    icon: <Tag className="h-5 w-5" />,
    category: "Oferta",
    categoryColor: "bg-red-100 text-red-800"
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
  }
];

const Conteudo = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Conteúdo Educacional</h1>
          <p className="text-lg text-muted-foreground">
            Artigos, manuais e notícias relevantes para a comunidade
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="card-hover">
                <CardHeader>
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
                <div className="px-6 pb-6">
                  <Button variant="outline" asChild className="w-full">
                    <Link to={`/conteudo/${article.id}`}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Ler Artigo
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Conteudo;
