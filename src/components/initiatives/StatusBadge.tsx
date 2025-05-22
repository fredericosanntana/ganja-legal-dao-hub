
import { Badge } from "@/components/ui/badge";
import { Initiative } from "@/types/initiatives";

interface StatusBadgeProps {
  initiative: Initiative;
}

const StatusBadge = ({ initiative }: StatusBadgeProps) => {
  if (!initiative) return null;
  
  switch (initiative.status) {
    case 'open':
      return <Badge>Aberta para Votação</Badge>;
    case 'closed':
      return <Badge variant="outline">Votação Encerrada</Badge>;
    case 'approved':
      return <Badge variant="default" className="bg-green-500">Aprovada</Badge>;
    case 'rejected':
      return <Badge variant="secondary">Rejeitada</Badge>;
    case 'implementing':
      return <Badge variant="default" className="bg-blue-500">Em Implementação</Badge>;
    case 'completed':
      return <Badge variant="default" className="bg-emerald-500">Implementada</Badge>;
    default:
      return <Badge variant="outline">Status Desconhecido</Badge>;
  }
};

export default StatusBadge;
