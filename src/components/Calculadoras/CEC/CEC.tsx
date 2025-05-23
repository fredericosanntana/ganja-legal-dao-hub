
import React from 'react';
import { Card } from '@/components/ui/card';
import CECCalculator from '@/components/Calculadoras/CEC/CECCalculator';

const CEC: React.FC = () => {
  return (
    <Card className="p-4">
      <CECCalculator />
    </Card>
  );
};

export default CEC;
