import React from "react";

const VPDInfo: React.FC = () => {
  return (
    <div className="mt-8">
      <h5 className="text-lg font-medium mb-4">Sobre VPD</h5>
      <p className="mb-4">
        O <strong>Déficit de Pressão de Vapor (VPD)</strong> é a diferença entre a quantidade
        de umidade no ar e quanto umidade o ar poderia potencialmente conter quando saturado.
        É uma medida importante para cultivadores de cannabis, pois afeta diretamente a taxa
        de transpiração das plantas.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h6 className="font-medium mb-2">Um VPD ideal:</h6>
          <ul className="list-disc pl-5 space-y-2">
            <li>Promove transpiração saudável e absorção de nutrientes</li>
            <li>Reduz o risco de doenças fúngicas e mofo</li>
            <li>Otimiza o crescimento e desenvolvimento da planta</li>
            <li>Varia de acordo com o estágio de crescimento da planta</li>
          </ul>
        </div>
        <div>
          <h6 className="font-medium mb-2">Valores de referência:</h6>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Vegetativo:</strong> 0.8 - 1.2 kPa</li>
            <li><strong>Floração Inicial:</strong> 1.0 - 1.4 kPa</li>
            <li><strong>Floração Tardia:</strong> 1.2 - 1.6 kPa</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VPDInfo;
