
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Vote } from "lucide-react";
import { Link } from "react-router-dom";
import { Initiative } from "@/types/initiatives";

interface InitiativeCardProps {
  initiative: Initiative;
}

const InitiativeCard: React.FC<InitiativeCardProps> = ({ initiative }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between mb-1">
          <h3 className="font-semibold text-lg line-clamp-1">{initiative.title}</h3>
          <Badge variant={initiative.status === "open" ? "default" : "secondary"}>
            {initiative.status === "open" ? "Aberta" : "Fechada"}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>Por: {initiative.author?.username || "Anônimo"}</span>
          <span>
            {new Date(initiative.created_at).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm line-clamp-3">{initiative.description}</p>
      </CardContent>
      <CardFooter>
        <div className="w-full flex items-center justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">{initiative.votes?.length || 0} votos</span>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link to={`/clube/iniciativas/${initiative.id}`}>
              <Vote className="mr-1 h-4 w-4" />
              {initiative.status === "open" ? "Votar" : "Detalhes"}
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default InitiativeCard;
