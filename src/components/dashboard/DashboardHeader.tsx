
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Vote, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/clube/login");
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold">Olá, {user?.username}</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel do Clube GanjaDAO
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button className="flex-1 md:flex-auto" asChild>
            <Link to="/clube/votacoes">
              <Vote className="mr-2 h-4 w-4" />
              Ver votações
            </Link>
          </Button>
          <Button variant="outline" className="flex-1 md:flex-auto" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      {!user?.subscription && (
        <div className="bg-ganja-50 border border-ganja-200 rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-medium text-ganja-800">Ative sua assinatura</h3>
            <p className="text-sm text-ganja-700">
              Assine o clube para ter acesso completo às votações e iniciativas
            </p>
          </div>
          <Button onClick={() => window.open("https://buy.stripe.com/dR65lA6DX0s6bEQ28c", "_blank")}>
            Assinar Agora
          </Button>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
