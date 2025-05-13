
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Mariana S.",
    avatar: "MS",
    role: "Cultivadora há 1 ano",
    content: "Graças ao HC preventivo que gerei na GanjaDAO, pude defender meus direitos quando houve uma abordagem policial. Não sei o que teria acontecido sem essa ferramenta."
  },
  {
    name: "João P.",
    avatar: "JP",
    role: "Ativista canábico",
    content: "Participar das votações do clube me fez sentir que realmente posso ajudar a moldar o futuro do ativismo canábico no Brasil. A GanjaDAO está descentralizando o direito."
  },
  {
    name: "Fernanda M.",
    avatar: "FM",
    role: "Usuária medicinal",
    content: "As calculadoras são extremamente úteis para otimizar meu cultivo. Minha produção melhorou significativamente após utilizar as ferramentas de VPD e DLI."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Depoimentos</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veja como a GanjaDAO tem ajudado cultivadores por todo o Brasil
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card rounded-lg p-6 border shadow-sm card-hover"
            >
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src="" alt={testimonial.name} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {testimonial.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-foreground italic">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
