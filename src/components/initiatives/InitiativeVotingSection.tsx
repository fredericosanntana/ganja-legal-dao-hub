
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ThumbsUp, AlertTriangle } from "lucide-react";
import { useState } from "react";
import QuadraticVotingForm from "./QuadraticVotingForm";
import { InitiativeVote } from "@/types/initiatives";

interface InitiativeVotingSectionProps {
  initiativeId: string;
  userVote?: InitiativeVote;
  status: string;
  hasActiveSubscription: boolean;
  onVoteComplete: () => void;
}

const InitiativeVotingSection = ({
  initiativeId,
  userVote,
  status,
  hasActiveSubscription,
  onVoteComplete
}: InitiativeVotingSectionProps) => {
  const [showVotingForm, setShowVotingForm] = useState(false);

  if (status !== 'open') {
    return null;
  }

  return (
    <div className="pt-4">
      {userVote ? (
        <Alert>
          <ThumbsUp className="h-4 w-4" />
          <AlertTitle>Você já votou nesta iniciativa</AlertTitle>
          <AlertDescription>
            Você votou com intensidade {userVote.intensity || userVote.credits_spent}, 
            utilizando {userVote.credits_spent} créditos.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Button onClick={() => setShowVotingForm(!showVotingForm)} className="w-full">
            {showVotingForm ? "Cancelar" : "Votar nesta Iniciativa"}
          </Button>
          
          {!hasActiveSubscription && (
            <Alert className="mt-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Assinatura necessária</AlertTitle>
              <AlertDescription>
                Apenas membros com assinatura ativa podem votar em iniciativas.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
      
      {showVotingForm && (
        <div className="mt-4">
          <QuadraticVotingForm 
            initiativeId={initiativeId} 
            onVotingComplete={() => {
              setShowVotingForm(false);
              onVoteComplete();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default InitiativeVotingSection;
