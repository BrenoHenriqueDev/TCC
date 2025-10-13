import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import CadastroUnificado from "./pages/CadastroUnificado";
import Educacao from "./pages/Educacao";
import Dicas from "./pages/Dicas";
import HomeEstabelecimento from "./pages/HomeEstabelecimento";
import CadastrarPontoColeta from "./pages/CadastrarPontoColeta";
import GerenciarPontos from "./pages/GerenciarPontos";
import VisualizarAgendamentos from "./pages/VisualizarAgendamentos";

import Editar from "./components/EditarPonto";
import Admin from "./pages/Admin";

export default function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUnificado />} />
        <Route path="/perfil" element={<Perfil />} />

        <Route path="/educacao" element={<Educacao />} />
        <Route path="/dicas" element={<Dicas />} />
        <Route
          path="/painel-estabelecimento"
          element={<HomeEstabelecimento />}
        />
        <Route
          path="/cadastrar-ponto-coleta"
          element={<CadastrarPontoColeta />}
        />
        <Route path="/gerenciar-pontos" element={<GerenciarPontos />} />
        <Route path="/visualizar-agendamentos" element={<VisualizarAgendamentos />} />
        <Route path="/editar" element={<Editar />} />

        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}
