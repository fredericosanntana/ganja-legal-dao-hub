
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Juridico from "./pages/Juridico";
import HabeasCorpusPage from "./pages/HabeasCorpusPage";
import Jurisprudencia from "./pages/Jurisprudencia";
import Anvisa from "./pages/Anvisa";
import Calculadoras from "./pages/Calculadoras";
import Conteudo from "./pages/Conteudo";
import Clube from "./pages/Clube";
import Votacoes from "./pages/Votacoes";
import VotacaoDetalhe from "./pages/VotacaoDetalhe";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/juridico" element={<Juridico />} />
          <Route path="/habeas-corpus" element={<HabeasCorpusPage />} />
          <Route path="/jurisprudencia" element={<Jurisprudencia />} />
          <Route path="/anvisa" element={<Anvisa />} />
          <Route path="/calculadoras" element={<Calculadoras />} />
          <Route path="/conteudo" element={<Conteudo />} />
          <Route path="/clube" element={<Clube />} />
          <Route path="/clube/votacoes" element={<Votacoes />} />
          <Route path="/clube/votacoes/:id" element={<VotacaoDetalhe />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
