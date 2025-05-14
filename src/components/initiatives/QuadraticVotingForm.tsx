
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { calcularCustoQuadratico } from "@/services/votacoesService";

interface QuadraticVotingFormProps {
  availableCredits: number;
  onVote: (creditsSpent: number) => void;
}

const QuadraticVotingForm: React.FC<QuadraticVotingFormProps> = ({ 
  availableCredits, 
  onVote 
}) => {
  const [votePower, setVotePower] = useState(0);
  
  // Calculate the quadratic cost based on vote power
  const quadraticCost = calcularCustoQuadratico(votePower);
  
  // Calculate maximum possible vote power based on available credits
  const maxVotePower = Math.floor(Math.sqrt(availableCredits));

  const handleVotePowerChange = (values: number[]) => {
    setVotePower(values[0]);
  };

  const handleVote = () => {
    if (votePower > 0 && quadraticCost <= availableCredits) {
      onVote(quadraticCost);
      setVotePower(0); // Reset after voting
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm mb-1">
          <span>Intensidade do voto: {votePower}</span>
          <span>Custo: {quadraticCost} créditos</span>
        </div>
        
        <Slider
          value={[votePower]}
          max={maxVotePower}
          step={1}
          onValueChange={handleVotePowerChange}
          disabled={availableCredits <= 0}
        />
        
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0</span>
          <span>{maxVotePower}</span>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-md text-sm space-y-2">
        <p className="font-medium">Como funciona a votação quadrática?</p>
        <p>
          Na votação quadrática, o custo em créditos é o quadrado da intensidade do seu voto.
          Isso permite que você demonstre sua preferência de forma mais precisa.
        </p>
        <p>
          <span className="font-medium">Exemplo:</span> Um voto de intensidade 3 custa 9 créditos.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Créditos disponíveis: <strong>{availableCredits}</strong>
        </span>
        <Button 
          onClick={handleVote} 
          disabled={votePower === 0 || quadraticCost > availableCredits}
        >
          Votar ({quadraticCost} créditos)
        </Button>
      </div>
    </div>
  );
};

export default QuadraticVotingForm;
