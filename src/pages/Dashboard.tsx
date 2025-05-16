import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vote, Crown, Plus, User, Key, CreditCard, Loader2 } from "lucide-react";
import { useInitiatives } from "@/hooks/use-initiatives";
import { useAuth } from "@/hooks/use-auth";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import CreditStats from "@/components/dashboard/CreditStats";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading, session } = useAuth();
  const { initiatives, isLoading: initiativesLoading } = useInitiatives();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      // Wait briefly to allow auth state to resolve
      setTimeout(async () => {
        // Direct check from supabase
        const { data } = await supabase.auth.getSession();
        
        if (!data?.session) {
          toast.error("Sessão expirada ou inválida. Por favor, faça login novamente.");
          navigate("/clube/login");
        } else {
          setIsCheckingAuth(false);
        }
      }, 500);
    };

    checkAuthentication();
  }, [navigate]);
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !isCheckingAuth) {
      toast.error("Por favor faça login para acessar o dashboard");
      navigate("/clube/login");
    } else if (!authLoading && isAuthenticated && user) {
      // Successfully logged in and loaded user data
      toast.success(`Bem-vindo ${user?.username || 'ao GanjaDAO'}!`);
    }
  }, [authLoading, isAuthenticated, navigate, user, isCheckingAuth]);

  if (authLoading || isCheckingAuth) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <p className="text-lg">Verificando autenticação...</p>
            <Button 
              onClick={() => navigate("/clube/login")} 
              variant="outline"
            >
              Voltar para login
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Redirect happens in the useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <DashboardHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Iniciativas Ativas</h2>
                {user.subscription && (
                  <Button size="sm" asChild>
                    <Link to="/clube/iniciativas/nova">
                      <Plus className="mr-1 h-4 w-4" />
                      Nova Iniciativa
                    </Link>
                  </Button>
                )}
              </div>

              {initiativesLoading ? (
                <p className="text-muted-foreground">Carregando iniciativas...</p>
              ) : initiatives && initiatives.length > 0 ? (
                <div className="space-y-4">
                  {initiatives.slice(0, 3).map((initiative) => (
                    <Card key={initiative.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-lg">{initiative.title}</CardTitle>
                          <Badge variant={initiative.status === "open" ? "default" : "outline"}>
                            {initiative.status === "open" ? "Aberta" : "Fechada"}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {initiative.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-2">
                        <Button variant="outline" size="sm" className="ml-auto" asChild>
                          <Link to={`/clube/iniciativas/${initiative.id}`}>
                            <Vote className="mr-1 h-4 w-4" />
                            Ver detalhes
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}

                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/clube/iniciativas">Ver todas as iniciativas</Link>
                  </Button>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-6 text-center">
                    <p className="text-muted-foreground">
                      Nenhuma iniciativa ativa no momento.
                    </p>
                    {user.subscription && (
                      <Button className="mt-4" asChild>
                        <Link to="/clube/iniciativas/nova">
                          <Plus className="mr-1 h-4 w-4" />
                          Criar primeira iniciativa
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Minhas Votações</h2>
              <Card>
                <CardContent className="py-6">
                  {user.votes && user.votes.length > 0 ? (
                    <div className="space-y-4">
                      {user.votes.slice(0, 3).map((vote) => (
                        <div key={vote.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{vote.initiative.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {vote.credits_spent} créditos alocados
                            </p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/clube/iniciativas/${vote.initiative_id}`}>
                              Ver
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      Você ainda não votou em nenhuma iniciativa.
                    </p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/clube/votacoes">
                      <Vote className="mr-2 h-4 w-4" />
                      Ver histórico de votos
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <CreditStats />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  Status da Assinatura
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.subscription ? (
                  <div>
                    <Badge className="mb-2 bg-green-500">Ativa</Badge>
                    <p className="text-sm text-muted-foreground mb-2">
                      Sua assinatura está ativa até{" "}
                      {new Date(user.subscription.expires_at || "").toLocaleDateString()}
                    </p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => window.open("https://buy.stripe.com/dR65lA6DX0s6bEQ28c", "_blank")}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Gerenciar assinatura
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Badge className="mb-2" variant="outline">
                      Inativa
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-4">
                      Você ainda não possui uma assinatura ativa.
                    </p>
                    <Button className="w-full" onClick={() => window.open("https://buy.stripe.com/dR65lA6DX0s6bEQ28c", "_blank")}>
                      Assinar Agora
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-center mb-4">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-lg">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/clube/perfil">
                      <User className="mr-2 h-4 w-4" />
                      Editar perfil
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Key className="mr-2 h-4 w-4" />
                    Alterar senha
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

export default Dashboard;
