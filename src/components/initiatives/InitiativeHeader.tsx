
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InitiativeHeaderProps {
  onRefresh: () => void;
}

const InitiativeHeader = ({ onRefresh }: InitiativeHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/clube/iniciativas')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Iniciativas
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        title="Atualizar dados da iniciativa"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default InitiativeHeader;
