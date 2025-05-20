import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Juridico from './pages/Juridico';
import Anvisa from './pages/Anvisa';
import Calculadoras from './pages/Calculadoras';
import Conteudo from './pages/Conteudo';
import Clube from './pages/Clube';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import Dashboard from './pages/Dashboard';
import Iniciativas from './pages/Iniciativas';
import NovaIniciativa from './pages/NovaIniciativa';
import IniciativaDetalhe from './pages/IniciativaDetalhe';
import Documentos from './pages/Documentos';
import Carteirinha from './pages/Carteirinha';
import GanjaChat from './pages/GanjaChat';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/juridico" element={<Juridico />} />
              <Route path="/anvisa" element={<Anvisa />} />
              <Route path="/calculadoras" element={<Calculadoras />} />
              <Route path="/conteudo" element={<Conteudo />} />
              <Route path="/clube" element={<Clube />} />
              <Route path="/clube/login" element={<Login />} />
              <Route path="/clube/register" element={<Register />} />
              <Route path="/clube/perfil" element={<Perfil />} />
              <Route path="/clube/dashboard" element={<Dashboard />} />
              <Route path="/clube/iniciativas" element={<Iniciativas />} />
              <Route path="/clube/iniciativas/nova" element={<NovaIniciativa />} />
              <Route path="/clube/iniciativas/:id" element={<IniciativaDetalhe />} />
              <Route path="/clube/documentos" element={<Documentos />} />
              <Route path="/clube/carteirinha" element={<Carteirinha />} />
              <Route path="/clube/ganja-chat" element={<GanjaChat />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer richColors closeButton />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
