
import { ThumbsUp, Users } from "lucide-react";
import { Initiative } from "@/types/initiatives";

interface InitiativeStatsProps {
  initiative: Initiative;
}

const InitiativeStats = ({ initiative }: InitiativeStatsProps) => {
  return (
    <div className="flex flex-wrap gap-3 items-center pt-4">
      <div className="flex items-center gap-2 text-sm">
        <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        <span>
          <strong>
            {initiative.total_votes || initiative._count?.votes || initiative.votes?.length || 0}
          </strong> votos
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span>
          <strong>
            {initiative.unique_voters || initiative.votes?.length || 0}
          </strong> participantes
        </span>
      </div>
    </div>
  );
};

export default InitiativeStats;
