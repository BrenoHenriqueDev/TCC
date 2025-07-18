import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CadastroUnificado from "./pages/CadastroUnificado";
import Agendamento from "./pages/Agendamento";
import Educacao from "./pages/Educacao";
import Dicas from "./pages/Dicas";
import HomeEstabelecimento from "./pages/HomeEstabelecimento";
import CadastrarPontoColeta from "./pages/CadastrarPontoColeta";

export default function AppRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroUnificado />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/agendamento" element={<Agendamento />} />
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
      </Routes>
      <Footer />
    </>
  );
}
