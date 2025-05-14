import React from 'react';
import Layout from '@/components/Layout';
import DeficiencyIdentifier from '@/components/deficiency/DeficiencyIdentifier';

const Calculadoras = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Calculadoras e Ferramentas</h1>
        
        {/* Identificador de Deficiências */}
        <DeficiencyIdentifier />
        
        {/* Aqui você pode adicionar as outras calculadoras como componentes separados */}
        
      </div>
    </Layout>
  );
};

export default Calculadoras;
