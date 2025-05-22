import React, { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CalculatorCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({
  icon: Icon,
  title,
  description,
  children,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CalculatorCard;
