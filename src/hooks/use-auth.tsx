
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/types/auth";
import { getCurrentUser, logout as authLogout } from "@/services/authService";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  logout: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      console.log("User loaded:", currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const logout = async () => {
    try {
      await authLogout();
      setUser(null);
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um problema ao desconectar sua conta",
        variant: "destructive",
      });
    }
  };

  const refreshUser = async () => {
    console.log("Refreshing user data...");
    await loadUser();
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
