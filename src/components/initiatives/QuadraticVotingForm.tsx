
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { voteOnInitiative } from '@/services/initiativeService';

export type QuadraticVotingFormProps = {
  initiativeId: string;
  currentVoteIntensity?: number;
  onVotingComplete?: () => void;
};

const QuadraticVotingForm: React.FC<QuadraticVotingFormProps> = ({
  initiativeId,
  currentVoteIntensity = 0,
  onVotingComplete
}) => {
  const { user, refreshUser } = useAuth();
  const [voteIntensity, setVoteIntensity] = useState(currentVoteIntensity);
  const [creditsRequired, setCreditsRequired] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate available credits
  const availableCredits = user?.vote_credits?.total_credits || 0;

  // Calculate required credits based on quadratic voting formula (x²)
  useEffect(() => {
    setCreditsRequired(Math.pow(voteIntensity, 2));
  }, [voteIntensity]);

  const handleVoteSubmit = async () => {
    if (!user) {
      toast.error('Você precisa estar logado para votar');
      return;
    }

    if (creditsRequired > availableCredits) {
      toast.error('Você não tem créditos suficientes para este voto');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await voteOnInitiative(
        initiativeId,
        creditsRequired
      );
      
      if (success) {
        toast.success('Seu voto foi registrado com sucesso!');
        await refreshUser();
        if (onVotingComplete) onVotingComplete();
      }
    } catch (error) {
      toast.error('Erro ao registrar voto. Tente novamente.');
      console.error('Voting error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Intensidade do Voto</span>
          <span className="text-sm font-bold">{voteIntensity}</span>
        </div>
        <Slider
          value={[voteIntensity]}
          min={0}
          max={10}
          step={1}
          onValueChange={(val) => setVoteIntensity(val[0])}
        />
      </div>

      <div className="p-3 bg-muted rounded-md">
        <div className="flex justify-between text-sm">
          <span>Créditos Necessários:</span>
          <span className="font-bold">{creditsRequired}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span>Créditos Disponíveis:</span>
          <span className={`font-bold ${availableCredits < creditsRequired ? 'text-destructive' : ''}`}>
            {availableCredits}
          </span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>
          A votação quadrática requer o <strong>quadrado</strong> da intensidade do voto em créditos.
          Assim, um voto de intensidade 3 custa 9 créditos.
        </p>
      </div>

      <Button 
        onClick={handleVoteSubmit} 
        disabled={
          voteIntensity === 0 || 
          creditsRequired > availableCredits || 
          isSubmitting || 
          !user
        }
        className="w-full"
      >
        {isSubmitting ? 'Enviando...' : 'Confirmar Voto'}
      </Button>
    </div>
  );
};

// Export the component as both default and named export
export default QuadraticVotingForm;
export { QuadraticVotingForm };
