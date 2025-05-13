
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Vote, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const Clube = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Clube GanjaDAO</h1>
          <p className="text-lg text-muted-foreground">
            Faça parte da comunidade e participe das decisões da DAO
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-activist-50 to-ganja-50 border border-ganja-100 rounded-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Por que fazer parte do Clube?</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-ganja-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Participe das votações e decisões sobre o futuro da GanjaDAO</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-ganja-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Apoie financeiramente a causa e contribua para a expansão das iniciativas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-ganja-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Receba atualizações exclusivas sobre as ações da GanjaDAO</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-ganja-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Tenha acesso a benefícios exclusivos para assinantes</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-64 flex flex-col justify-center">
                <div className="text-center p-6 bg-white rounded-lg border shadow-sm">
                  <div className="mb-4">
                    <Crown className="mx-auto h-12 w-12 text-activist-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">R$4,20</h3>
                  <p className="text-sm text-muted-foreground mb-4">por mês</p>
                  <Button className="w-full" asChild>
                    <Link to="/clube/assinar">Assinar Agora</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Vote className="h-5 w-5 text-primary" />
                  Sistema de Votação
                </CardTitle>
                <CardDescription>
                  Participe das votações sobre as iniciativas da GanjaDAO
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Como membro do clube, você recebe créditos de voto para participar das decisões
                  sobre as iniciativas da GanjaDAO. Nosso sistema de votação quadrática permite uma
                  distribuição mais justa e eficiente dos votos.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/clube/votacoes">
                    <Vote className="mr-2 h-5 w-5" />
                    Ver Votações Ativas
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Comunidade
                </CardTitle>
                <CardDescription>
                  Conecte-se com outros cultivadores e ativistas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Faça parte de uma comunidade engajada na defesa dos direitos dos cultivadores.
                  Troque experiências, compartilhe conhecimento e fortaleça o movimento pela
                  descentralização do acesso ao direito.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                  <Users className="mr-2 h-5 w-5" />
                  Acessar Comunidade (Em breve)
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Acesso para Membros</CardTitle>
                <CardDescription>
                  Já é membro do Clube GanjaDAO? Faça login para acessar sua conta.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="w-full flex flex-col sm:flex-row gap-2">
                  <Button className="flex-1" variant="outline" asChild>
                    <Link to="/clube/login">Login</Link>
                  </Button>
                  <Button className="flex-1" variant="secondary" asChild>
                    <Link to="/clube/cadastro">Cadastro</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Clube;
