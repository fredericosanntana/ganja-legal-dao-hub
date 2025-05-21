
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Initiative } from "@/types/initiatives";

interface InitiativeAuthorProps {
  initiative: Initiative;
}

const InitiativeAuthor = ({ initiative }: InitiativeAuthorProps) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage 
          src={
            initiative.author?.avatar_url ||
            (initiative.creator && initiative.creator.avatar_url) || 
            undefined
          } 
        />
        <AvatarFallback>
          {((initiative.author?.username || initiative.creator?.username || "U").charAt(0))}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium">
          {initiative.author?.username || (initiative.creator && initiative.creator.username) || "Usuário Anônimo"}
        </p>
        <p className="text-xs text-muted-foreground">Autor da Iniciativa</p>
      </div>
    </div>
  );
};

export default InitiativeAuthor;
