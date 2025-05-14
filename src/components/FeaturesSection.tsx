
import { Shield, BookOpen, Calculator, Users } from "lucide-react";
import ModuleCard from "./ModuleCard";

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ferramentas e Recursos</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A GanjaDAO oferece recursos completos para sua proteção, educação e participação na comunidade de cultivadores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModuleCard
            icon={<Shield className="h-6 w-6" />}
            title="Módulo Jurídico"
            description="Ferramentas para geração de documentos legais, como HC preventivo, e consulta de jurisprudência para sua proteção."
            to="/juridico"
            variant="featured"
          />
          <ModuleCard
            icon={<BookOpen className="h-6 w-6" />}
            title="Módulo ANVISA"
            description="Ferramenta para auxiliar na criação e envio de manifestações para consultas públicas da ANVISA."
            to="/anvisa"
            variant="featured"
          />
          <ModuleCard
            icon={<Calculator className="h-6 w-6" />}
            title="Calculadoras"
            description="Calculadoras úteis para o cultivo: VPD, DLI, Nutrientes, Ponto de Orvalho e EC Flush."
            to="/calculadoras"
            variant="featured"
          />
          <ModuleCard
            icon={<Users className="h-6 w-6" />}
            title="Clube GanjaDAO"
            description="Junte-se ao clube de assinaturas para apoiar a causa e participar de votações sobre as iniciativas."
            to="/clube"
            variant="featured"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
