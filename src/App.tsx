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
import BlogEditor from "./pages/conteudo/BlogEditor";
// Importar os componentes de página específicos para artigos estáticos
import CheckListJuridicoPage from "./pages/conteudo/CheckListJuridico";
import BastidoresGanjadaoPage from "./pages/conteudo/BastidoresGanjadao";
import CasoRealMarianaPage from "./pages/conteudo/CasoRealMariana"; // Nova importação
import ConvocacaoDaoPage from "./pages/conteudo/convocacaoDao";
import MitosVerdadesHcDigitalPage from "./pages/conteudo/MitosVerdadesHcDigital";
import CultivoLegalPage from "./pages/conteudo/CultivoLegal";
import ManualCultivadorAutonomoPage from "./pages/conteudo/ManualCulvitadorAutonomo.tsx";
import MapaProtecaoPage from "./pages/conteudo/MapaProtecao";
import ChamadaEmbaixadoresPage from "./pages/conteudo/embaixadores";
import Clube from "./pages/Clube";
import Votacoes from "./pages/Votacoes";
import VotacaoDetalhe from "./pages/VotacaoDetalhe";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/use-auth";
import PlanoCultivo from "./pages/PlanoCultivo";
import DeclaracaoOrigemGenetica from "./pages/OrigemGenetica";
import DeclaracaoResponsabilidade from "./pages/TermoResponsabilidade";

// Pages
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Iniciativas from "./pages/Iniciativas";
import IniciativaDetalhe from "./pages/IniciativaDetalhe";
import NovaIniciativa from "./pages/NovaIniciativa";
import Perfil from "./pages/Perfil";

// Comunidade (fórum) Pages
import Comunidade from "./pages/Comunidade";
import ComunidadePostDetail from "./pages/ComunidadePostDetail";
import ComunidadeNovoPost from "./pages/ComunidadeNovoPost";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
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
            <Route path="/plano-cultivo" element={<PlanoCultivo />} />
            <Route path="/origem-genetica" element={<DeclaracaoOrigemGenetica />} />
            <Route path="/termo-responsabilidade" element={<DeclaracaoResponsabilidade />} />

            {/* Rotas de Conteúdo */}
            <Route path="/conteudo" element={<Conteudo />} />
            <Route path="/conteudo/editor" element={<BlogEditor />} />
            {/* Rotas específicas para artigos estáticos */}
            <Route path="/conteudo/checklist-juridico" element={<CheckListJuridicoPage />} />
            <Route path="/conteudo/bastidores" element={<BastidoresGanjadaoPage />} />
            <Route path="/conteudo/caso-mariana" element={<CasoRealMarianaPage />} /> {/* Nova rota */}
            <Route path="/conteudo/convocacao" element={<ConvocacaoDaoPage />} />
            <Route path="/conteudo/mitos-verdades" element={<MitosVerdadesHcDigitalPage />} />
            <Route path="/conteudo/cultivo-legal" element={<CultivoLegalPage />} />
            <Route path="/conteudo/manual-cultivador" element={<ManualCultivadorAutonomoPage />} />
            <Route path="/conteudo/mapa-protecao" element={<MapaProtecaoPage />} />
            <Route path="/conteudo/embaixadores" element={<ChamadaEmbaixadoresPage />} />
            {/* Adicionar outras rotas de artigos estáticos aqui conforme necessário */}

            <Route path="/clube" element={<Clube />} />
            <Route path="/clube/votacoes" element={<Votacoes />} />
            <Route path="/clube/votacoes/:id" element={<VotacaoDetalhe />} />
            
            {/* Auth Routes */}
            <Route path="/clube/login" element={<Login />} />
            <Route path="/clube/cadastro" element={<Cadastro />} />
            <Route path="/clube/dashboard" element={<Dashboard />} />
            <Route path="/clube/iniciativas" element={<Iniciativas />} />
            <Route path="/clube/iniciativas/nova" element={<NovaIniciativa />} />
            <Route path="/clube/iniciativas/:id" element={<IniciativaDetalhe />} />
            <Route path="/clube/perfil" element={<Perfil />} />
            
            {/* Comunidade (Fórum) Routes */}
            <Route path="/clube/comunidade" element={<Comunidade />} />
            <Route path="/clube/comunidade/posts/:postId" element={<ComunidadePostDetail />} />
            <Route path="/clube/comunidade/novo" element={<ComunidadeNovoPost />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

