import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomeEstabelecimento = () => {
  const navigate = useNavigate();
  const [pontosDeColeta, setPontosDeColeta] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);

  // Buscar dados do estabelecimento logado
  let nome = "Estabelecimento";
  const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (logado && logado.tipo === "estabelecimento") {
    const lista = JSON.parse(localStorage.getItem("estabelecimentos")) || [];
    const est = lista.find((e) => e.email === logado.email);
    if (est && est.nomeEstabelecimento) nome = est.nomeEstabelecimento;
  }

  // Carregar dados do localStorage
  React.useEffect(() => {
    if (logado && logado.email) {
      const pontosSalvos =
        JSON.parse(localStorage.getItem(`pontos_${logado.email}`)) || [];
      const agendamentosSalvos =
        JSON.parse(localStorage.getItem(`agendamentos_${logado.email}`)) || [];
      setPontosDeColeta(pontosSalvos);
      setAgendamentos(agendamentosSalvos);
    }
  }, [logado?.email]);

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.1)",
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    minWidth: "280px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: "#fff",
    position: "relative",
    overflow: "hidden",
  };

  const handleCardHover = (e, isEntering) => {
    if (isEntering) {
      e.target.style.background = "rgba(255, 255, 255, 0.2)";
      e.target.style.transform = "translateY(-4px)";
      e.target.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.3)";
      e.target.style.border = "1px solid rgba(255, 255, 255, 0.4)";
      e.target.style.scale = "1.02";
    } else {
      e.target.style.background = "rgba(255, 255, 255, 0.1)";
      e.target.style.transform = "translateY(0)";
      e.target.style.boxShadow = "none";
      e.target.style.border = "1px solid rgba(255, 255, 255, 0.2)";
      e.target.style.scale = "1";
    }
  };

  return (
    <div
      className="app-main-content"
      style={{ background: "#334155", minHeight: "100vh" }}
    >
      <div
        style={{
          padding: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          color: "#fff",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "2.5rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Bem-vindo(a), {nome}!
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#e2e8f0",
            marginBottom: "3rem",
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto 3rem auto",
          }}
        >
          Obrigado por contribuir com a saúde e o meio ambiente. Aqui você pode
          gerenciar seus pontos de coleta, agendamentos e visualizar
          estatísticas.
        </p>

        {/* Cards principais */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {/* 1. Cadastrar Ponto de Coleta */}
          <div
            style={cardStyle}
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
            onClick={() => navigate("/cadastrar-ponto-coleta")}
          >
            <h2
              style={{
                color: "#60a5fa",
                marginBottom: "0.5rem",
                fontSize: "1.3rem",
              }}
            >
              📍 Cadastrar Ponto de Coleta
            </h2>
            <p style={{ color: "#e2e8f0", fontSize: "0.95rem" }}>
              Adicione novos pontos de coleta para seu estabelecimento.
            </p>
            <div
              style={{
                marginTop: "1rem",
                fontSize: "0.9rem",
                color: "#94a3b8",
              }}
            >
              {pontosDeColeta.length} ponto(s) cadastrado(s)
            </div>
          </div>

          {/* 2. Ver meus pontos de coleta */}
          <div
            style={cardStyle}
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
          >
            <h2
              style={{
                color: "#34d399",
                marginBottom: "0.5rem",
                fontSize: "1.3rem",
              }}
            >
              🏢 Meus Pontos de Coleta
            </h2>
            <p style={{ color: "#e2e8f0", fontSize: "0.95rem" }}>
              Gerencie seus pontos de coleta existentes.
            </p>
            <div
              style={{
                marginTop: "1rem",
                fontSize: "0.9rem",
                color: "#94a3b8",
              }}
            >
              {pontosDeColeta.length} ponto(s) ativo(s)
            </div>
          </div>

          {/* 3. Ver Agendamentos Recebidos */}
          <div
            style={cardStyle}
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
          >
            <h2
              style={{
                color: "#fbbf24",
                marginBottom: "0.5rem",
                fontSize: "1.3rem",
              }}
            >
              📅 Agendamentos Recebidos
            </h2>
            <p style={{ color: "#e2e8f0", fontSize: "0.95rem" }}>
              Visualize e gerencie agendamentos de coleta.
            </p>
            <div
              style={{
                marginTop: "1rem",
                fontSize: "0.9rem",
                color: "#94a3b8",
              }}
            >
              {agendamentos.length} agendamento(s) pendente(s)
            </div>
          </div>

          {/* 4. Estatísticas */}
          <div
            style={cardStyle}
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
          >
            <h2
              style={{
                color: "#a78bfa",
                marginBottom: "0.5rem",
                fontSize: "1.3rem",
              }}
            >
              📊 Estatísticas
            </h2>
            <p style={{ color: "#e2e8f0", fontSize: "0.95rem" }}>
              Acompanhe seu impacto ambiental.
            </p>
            <div
              style={{
                marginTop: "1rem",
                fontSize: "0.9rem",
                color: "#94a3b8",
              }}
            >
              {agendamentos.filter((a) => a.status === "concluído").length}{" "}
              coleta(s) realizada(s)
            </div>
          </div>

          {/* 5. Configurações do perfil */}
          <div
            style={cardStyle}
            onMouseEnter={(e) => handleCardHover(e, true)}
            onMouseLeave={(e) => handleCardHover(e, false)}
          >
            <h2
              style={{
                color: "#f87171",
                marginBottom: "0.5rem",
                fontSize: "1.3rem",
              }}
            >
              ⚙️ Configurações
            </h2>
            <p style={{ color: "#e2e8f0", fontSize: "0.95rem" }}>
              Gerencie suas informações e preferências.
            </p>
            <div
              style={{
                marginTop: "1rem",
                fontSize: "0.9rem",
                color: "#94a3b8",
              }}
            >
              Perfil e configurações
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeEstabelecimento;
