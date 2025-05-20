
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { HelpCircle } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CreditStats = () => {
  const { user } = useAuth();
  const totalCredits = user?.vote_credits?.total_credits || 0;
  const initialCredits = 100; // Assuming this is the starting amount

  // Calculate used credits
  const usedCredits = user?.votes?.reduce((total, vote) => total + vote.credits_spent, 0) || 0;
  const availableCredits = totalCredits;
  
  // Calculate percentages for progress bars
  const availablePercentage = (availableCredits / initialCredits) * 100;
  const usedPercentage = (usedCredits / initialCredits) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Seus Créditos de Votação</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Créditos de votação são usados tanto no sistema de Iniciativas quanto no sistema de Votações, 
                  ambos utilizando o método de votação quadrática.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span>Créditos Disponíveis</span>
              <span className="font-medium">{availableCredits}</span>
            </div>
            <Progress value={availablePercentage} className="h-2 mt-1" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm">
              <span>Créditos Utilizados</span>
              <span className="font-medium">{usedCredits}</span>
            </div>
            <Progress value={usedPercentage} className="h-2 mt-1" />
          </div>

          <div className="pt-2 text-xs text-muted-foreground">
            <p>
              Seus créditos são utilizados para votar em iniciativas e propostas usando o sistema de votação quadrática.
              Os mesmos créditos são compartilhados entre os sistemas de Iniciativas e Votações.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditStats;
