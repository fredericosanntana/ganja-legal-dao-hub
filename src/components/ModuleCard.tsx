
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface ModuleCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  to: string;
  className?: string;
  variant?: 'default' | 'featured';
}

const ModuleCard = ({
  icon,
  title,
  description,
  to,
  className,
  variant = 'default'
}: ModuleCardProps) => {
  return (
    <div 
      className={cn(
        "rounded-xl overflow-hidden border card-hover", 
        variant === 'featured' 
          ? "bg-gradient-to-br from-ganja-100 to-accent/20 border-ganja-400/30" 
          : "bg-card",
        className
      )}
    >
      <div className="p-6">
        <div className={cn(
          "w-12 h-12 flex items-center justify-center rounded-full mb-4",
          variant === 'featured' 
            ? "bg-ganja-400 text-white"
            : "bg-muted text-primary"
        )}>
          {icon}
        </div>
        <h3 className="text-xl font-heading mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <Button 
          asChild 
          variant={variant === 'featured' ? 'default' : 'outline'}
        >
          <Link to={to}>
            Acessar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ModuleCard;
