import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EscolhaCadastro from "./pages/EscolhaCadastro";
import CadastroUsuario from "./pages/CadastroUsuario";
import CadastroEstabelecimento from "./pages/CadastroEstabelecimento";
import Agendamento from "./pages/Agendamento";
import Educacao from "./pages/Educacao";
import Dicas from "./pages/Dicas";

export default function AppRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<EscolhaCadastro />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
        <Route
          path="/cadastro-estabelecimento"
          element={<CadastroEstabelecimento />}
        />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/educacao" element={<Educacao />} />
        <Route path="/dicas" element={<Dicas />} />
      </Routes>
      <Footer />
    </>
  );
}
