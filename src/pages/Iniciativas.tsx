
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Vote } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useInitiatives } from "@/hooks/use-initiatives";
import InitiativeCard from "@/components/initiatives/InitiativeCard";

const Iniciativas = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { initiatives, isLoading: initiativesLoading } = useInitiatives();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/clube/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading || initiativesLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Carregando...</p>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const openInitiatives = initiatives?.filter(i => i.status === "open") || [];
  const closedInitiatives = initiatives?.filter(i => i.status !== "open") || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Iniciativas</h1>
            {user?.subscription && (
              <Button asChild>
                <Link to="/clube/iniciativas/nova">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Iniciativa
                </Link>
              </Button>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                Iniciativas Abertas
                {openInitiatives.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {openInitiatives.length}
                  </Badge>
                )}
              </h2>
            </div>

            {openInitiatives.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {openInitiatives.map((initiative) => (
                  <InitiativeCard key={initiative.id} initiative={initiative} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-muted/50 rounded-lg">
                <Vote className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">Nenhuma iniciativa aberta</h3>
                <p className="text-muted-foreground mb-4">
                  Não há iniciativas abertas para votação no momento.
                </p>
                {user?.subscription && (
                  <Button asChild>
                    <Link to="/clube/iniciativas/nova">
                      <Plus className="mr-2 h-4 w-4" />
                      Criar nova iniciativa
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          {closedInitiatives.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Iniciativas Encerradas
                  <Badge variant="outline" className="ml-2">
                    {closedInitiatives.length}
                  </Badge>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {closedInitiatives.map((initiative) => (
                  <InitiativeCard key={initiative.id} initiative={initiative} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Iniciativas;
