
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Juridico from './pages/Juridico';
import Anvisa from './pages/Anvisa';
import Calculadoras from './pages/Calculadoras';
import Conteudo from './pages/Conteudo';
import Clube from './pages/Clube';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Dashboard from './pages/Dashboard';
import Iniciativas from './pages/Iniciativas';
import NovaIniciativa from './pages/NovaIniciativa';
import IniciativaDetalhe from './pages/IniciativaDetalhe';
import Documentos from './pages/Documentos';
import Carteirinha from './pages/Carteirinha';
import GanjaChat from './pages/GanjaChat';
import Cadastro from './pages/Cadastro';
import { Toaster } from 'sonner';
import MapaProtecaoPage from './pages/conteudo/MapaProtecao';
import ChamadaEmbaixadoresPage from './pages/conteudo/embaixadores';
import TermoResponsabilidade from './pages/TermoResponsabilidade';
import PlanoCultivo from './pages/PlanoCultivo';
import OrigemGenetica from './pages/OrigemGenetica';
import HabeasCorpusPage from './pages/HabeasCorpusPage';
import Jurisprudencia from './pages/Jurisprudencia';
import CheckListJuridicoPage from './pages/conteudo/CheckListJuridico';
import BastidoresGanjadaoPage from './pages/conteudo/BastidoresGanjadao';
import CasoRealMarianaPage from './pages/conteudo/CasoRealMariana';
import ConvocacaoDaoPage from './pages/conteudo/convocacaoDao';
import MitosVerdadesHcDigitalPage from './pages/conteudo/MitosVerdadesHcDigital';
import CultivoLegalPage from './pages/conteudo/CultivoLegal';
import ManualCultivadorAutonomoPage from './pages/conteudo/ManualCulvitadorAutonomo';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/juridico" element={<Juridico />} />
        <Route path="/anvisa" element={<Anvisa />} />
        <Route path="/calculadoras" element={<Calculadoras />} />
        <Route path="/conteudo" element={<Conteudo />} />
        <Route path="/conteudo/mapa-protecao" element={<MapaProtecaoPage />} />
        <Route path="/conteudo/embaixadores" element={<ChamadaEmbaixadoresPage />} />
        <Route path="/conteudo/checklist-juridico" element={<CheckListJuridicoPage />} />
        <Route path="/conteudo/bastidores-ganjadao" element={<BastidoresGanjadaoPage />} />
        <Route path="/conteudo/caso-real-mariana" element={<CasoRealMarianaPage />} />
        <Route path="/conteudo/convocacao-dao" element={<ConvocacaoDaoPage />} />
        <Route path="/conteudo/mitos-verdades-hc-digital" element={<MitosVerdadesHcDigitalPage />} />
        <Route path="/conteudo/cultivo-legal" element={<CultivoLegalPage />} />
        <Route path="/conteudo/manual-culvitador-autonomo" element={<ManualCultivadorAutonomoPage />} />
        <Route path="/clube" element={<Clube />} />
        <Route path="/clube/login" element={<Login />} />
        <Route path="/clube/cadastro" element={<Cadastro />} />
        <Route path="/clube/perfil" element={<Perfil />} />
        <Route path="/clube/dashboard" element={<Dashboard />} />
        <Route path="/clube/iniciativas" element={<Iniciativas />} />
        <Route path="/clube/iniciativas/nova" element={<NovaIniciativa />} />
        <Route path="/clube/iniciativas/:id" element={<IniciativaDetalhe />} />
        <Route path="/clube/documentos" element={<Documentos />} />
        <Route path="/clube/carteirinha" element={<Carteirinha />} />
        <Route path="/clube/ganja-chat" element={<GanjaChat />} />
        <Route path="/termo-responsabilidade" element={<TermoResponsabilidade />} />
        <Route path="/plano-cultivo" element={<PlanoCultivo />} />
        <Route path="/origem-genetica" element={<OrigemGenetica />} />
        <Route path="/habeas-corpus-preventivo" element={<HabeasCorpusPage />} />
        <Route path="/jurisprudencia" element={<Jurisprudencia />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster richColors closeButton />
    </>
  );
}

export default App;
