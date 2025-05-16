
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./App.css";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import NotFound from "./pages/NotFound";
import Clube from "./pages/Clube";
import Dashboard from "./pages/Dashboard";
import Iniciativas from "./pages/Iniciativas";
import NovaIniciativa from "./pages/NovaIniciativa";
import IniciativaDetalhe from "./pages/IniciativaDetalhe";
import Anvisa from "./pages/Anvisa";
import Juridico from "./pages/Juridico";
import HabeasCorpusPage from "./pages/HabeasCorpusPage";
import TermoResponsabilidade from "./pages/TermoResponsabilidade";
import PlanoCultivo from "./pages/PlanoCultivo";
import OrigemGenetica from "./pages/OrigemGenetica";
import Jurisprudencia from "./pages/Jurisprudencia";
import Comunidade from "./pages/Comunidade";
import ComunidadePostDetail from "./pages/ComunidadePostDetail";
import ComunidadeNovoPost from "./pages/ComunidadeNovoPost";
import Conteudo from "./pages/Conteudo";
import Votacoes from "./pages/Votacoes";
import VotacaoDetalhe from "./pages/VotacaoDetalhe";
import Calculadoras from "./pages/Calculadoras";
import Documentos from "./pages/Documentos";
import Carteirinha from "./pages/Carteirinha";
import CardView from "./pages/CardView";

// Content pages
import CultivoLegal from "./pages/conteudo/CultivoLegal";
import MitosVerdadesHcDigital from "./pages/conteudo/MitosVerdadesHcDigital";
import CheckListJuridico from "./pages/conteudo/CheckListJuridico";
import MapaProtecao from "./pages/conteudo/MapaProtecao";
import ManualCulvitadorAutonomo from "./pages/conteudo/ManualCulvitadorAutonomo";
import CasoRealMariana from "./pages/conteudo/CasoRealMariana";
import BastidoresGanjadao from "./pages/conteudo/BastidoresGanjadao";
import ConvocacaoDao from "./pages/conteudo/convocacaoDao";
import Embaixadores from "./pages/conteudo/embaixadores";
import BlogEditor from "./pages/conteudo/BlogEditor";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Index />} />
          <Route path="login" element={<Login />} />
          <Route path="cadastro" element={<Cadastro />} />

          <Route path="clube" element={<Clube />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="iniciativas" element={<Iniciativas />} />
            <Route path="nova-iniciativa" element={<NovaIniciativa />} />
            <Route path="iniciativa/:id" element={<IniciativaDetalhe />} />
            <Route path="anvisa" element={<Anvisa />} />
            <Route path="juridico" element={<Juridico />} />
            <Route path="habeas-corpus" element={<HabeasCorpusPage />} />
            <Route path="termo-responsabilidade" element={<TermoResponsabilidade />} />
            <Route path="plano-cultivo" element={<PlanoCultivo />} />
            <Route path="origem-genetica" element={<OrigemGenetica />} />
            <Route path="jurisprudencia" element={<Jurisprudencia />} />
            <Route path="comunidade" element={<Comunidade />} />
            <Route path="comunidade/:id" element={<ComunidadePostDetail />} />
            <Route path="comunidade/novo" element={<ComunidadeNovoPost />} />
            <Route path="conteudo" element={<Conteudo />} />
            <Route path="votacoes" element={<Votacoes />} />
            <Route path="votacao/:id" element={<VotacaoDetalhe />} />
            <Route path="calculadoras" element={<Calculadoras />} />
            <Route path="documentos" element={<Documentos />} />
            <Route path="carteirinha" element={<Carteirinha />} />
            <Route path="login" element={<Login />} />
          </Route>

          <Route path="card/:linkId" element={<CardView />} />

          <Route path="clube/admin/blog-editor" element={<BlogEditor />} />
          <Route path="conteudo/cultivo-legal" element={<CultivoLegal />} />
          <Route path="conteudo/mitos-verdades-hc" element={<MitosVerdadesHcDigital />} />
          <Route path="conteudo/checklist-juridico" element={<CheckListJuridico />} />
          <Route path="conteudo/mapa-protecao" element={<MapaProtecao />} />
          <Route path="conteudo/manual-cultivador" element={<ManualCulvitadorAutonomo />} />
          <Route path="conteudo/caso-real-mariana" element={<CasoRealMariana />} />
          <Route path="conteudo/bastidores-ganjadao" element={<BastidoresGanjadao />} />
          <Route path="conteudo/convocacao-dao" element={<ConvocacaoDao />} />
          <Route path="conteudo/embaixadores" element={<Embaixadores />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
