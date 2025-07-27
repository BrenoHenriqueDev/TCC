import Carousel from "../components/Carousel";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/HookLogin";
import "../css/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Busca usuário logado
  let mensagemBoasVindas = null;
  if (isAuthenticated) {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (logado && logado.email && logado.tipo) {
      const chave = logado.tipo === "usuario" ? "usuarios" : "estabelecimentos";
      const lista = JSON.parse(localStorage.getItem(chave)) || [];
      const usuario = lista.find((item) => item.email === logado.email);
      if (usuario) {
        mensagemBoasVindas =
          logado.tipo === "usuario"
            ? `Olá, ${usuario.nome}! Bem-vindo(a) ao VenceMED.`
            : `Olá, ${usuario.nomeEstabelecimento}! Obrigado por contribuir com a saúde e o meio ambiente.`;
      }
    }
  }

  return (
    <div className="app-main-content">
      <div className="home-container">
        {/* Carousel */}
        <section className="home-carousel-section">
          <Carousel />
        </section>

        {/* Seção de Boas-Vindas */}
        <section className="home-welcome-section">
          <h1 className="home-title">VenceMED</h1>
          {mensagemBoasVindas && (
            <div
              style={{
                margin: "12px auto 0 auto",
                background: "rgba(255,255,255,0.10)",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: 18,
                maxWidth: 600,
                boxShadow: "none",
                fontWeight: 500,
                textAlign: "center",
                letterSpacing: 0.2,
              }}
            >
              {mensagemBoasVindas}
            </div>
          )}
          <p className="home-subtitle">
            "Descartar medicamentos com responsabilidade é um ato de cuidado com
            a vida e o meio ambiente".
          </p>
          {isAuthenticated && (
            <button
              className="home-btn-agendar"
              onClick={() => navigate("/agendamento")}
            >
              Agende uma coleta
            </button>
          )}
        </section>

        {/* Como Funciona */}
        <section className="home-how-section">
          <h2 className="home-section-title">Como funciona?</h2>
          <div className="home-how-steps">
            <div className="home-how-step">
              {/* Ícone placeholder */}
              <div className="home-how-step-icon home-how-step-icon-green">
                1
              </div>
              <p className="home-how-step-text">
                Cadastre-se como cidadão ou ponto de coleta.
              </p>
            </div>
            <div className="home-how-step">
              <div className="home-how-step-icon home-how-step-icon-blue">
                2
              </div>
              <p className="home-how-step-text">
                Agende a coleta de seus medicamentos vencidos.
              </p>
            </div>
            <div className="home-how-step">
              <div className="home-how-step-icon home-how-step-icon-yellow">
                3
              </div>
              <p className="home-how-step-text">
                Descarte corretamente em um ponto próximo a você.
              </p>
            </div>
          </div>
        </section>

        {/* Impacto ambiental */}
        <section className="home-impact-section">
          <div className="home-impact-content">
            <h2 className="home-section-title home-impact-title">
              Impacto ambiental
            </h2>
            <p className="home-impact-text">
              + de 90% dos remédios descartados incorretamente contaminam o solo
              e a água.
            </p>
          </div>
          {/* Imagem ilustrativa placeholder */}
          <div className="home-impact-image-area">
            <div className="home-impact-image-placeholder">Imagem</div>
          </div>
        </section>
      </div>
    </div>
  );
}
