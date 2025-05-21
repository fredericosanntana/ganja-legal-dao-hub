
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { MessageSquare, Vote, Crown, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Logout realizado com sucesso!");
      navigate("/clube/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erro ao fazer logout. Tente novamente.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao GanjaDAO Clube, {user?.username || 'usuário'}!
          </p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button variant="outline" size="sm" asChild>
            <Link to="/clube/comunidade">
              <MessageSquare className="mr-2 h-4 w-4" /> Comunidade
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/clube/iniciativas">
              <Vote className="mr-2 h-4 w-4" /> Iniciativas
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/clube/perfil">
              <User className="mr-2 h-4 w-4" /> Perfil
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/clube/ganja-chat">
              <MessageSquare className="mr-2 h-4 w-4" /> GanjaChat
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" /> 
            {isLoggingOut ? "Saindo..." : "Sair"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
