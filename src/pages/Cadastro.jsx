import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import FormUsuario from "./components/FormUsuario";
import FormEstabelecimento from "./components/FormEstabelecimento";
import "./css/Cadastro.css";

function App() {
  const [showCadastro, setShowCadastro] = useState(false);
  const [aba, setAba] = useState("usuario");

  return (
    <>
      <Header onOpenCadastro={() => setShowCadastro(true)} />
      <Home />
      {showCadastro && (
        <div className="cadastro-overlay-bg">
          <div className="cadastro-overlay"></div>
          <div className="cadastro-bg cadastro-bg-absolute">
            <div className="cadastro-card">
              <div className="cadastro-tabs">
                <button
                  className={`cadastro-tab${
                    aba === "usuario" ? " cadastro-tab-active" : ""
                  }`}
                  onClick={() => setAba("usuario")}
                >
                  Usuário
                </button>
                <button
                  className={`cadastro-tab${
                    aba === "estabelecimento" ? " cadastro-tab-active" : ""
                  }`}
                  onClick={() => setAba("estabelecimento")}
                >
                  Estabelecimento
                </button>
              </div>
              {aba === "usuario" ? <FormUsuario /> : <FormEstabelecimento />}
              <button
                className="modal-close"
                onClick={() => setShowCadastro(false)}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default App;
