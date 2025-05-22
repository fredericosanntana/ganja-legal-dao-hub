
import { Separator } from "@/components/ui/separator";
import { Initiative } from "@/types/initiatives";
import InitiativeAuthor from "./InitiativeAuthor";
import InitiativeStats from "./InitiativeStats";

interface InitiativeContentProps {
  initiative: Initiative;
}

const InitiativeContent = ({ initiative }: InitiativeContentProps) => {
  return (
    <>
      <InitiativeAuthor initiative={initiative} />
      <Separator />
      <div className="prose prose-sm max-w-none">
        <div dangerouslySetInnerHTML={{ __html: initiative.description }} />
      </div>
      <InitiativeStats initiative={initiative} />
    </>
  );
};

export default InitiativeContent;
