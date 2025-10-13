import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomeEstabelecimento.css";

const HomeEstabelecimento = () => {
  const navigate = useNavigate();
  const [pontosDeColeta, setPontosDeColeta] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);

  // Buscar dados da farmácia logada
  let nome = "Farmácia";
  const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (logado && logado.nivelAcesso === "FARMACIA") {
    nome = logado.nome || "Farmácia";
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
    <div className="home-estabelecimento-container">
      {/* Cabeçalho */}
      <div className="home-estabelecimento-header">
        <h1 className="home-estabelecimento-title">Bem-vindo(a), {nome}! 💊</h1>
        <p className="home-estabelecimento-subtitle">
          Gerencie seus pontos de coleta e acompanhe os agendamentos
        </p>
      </div>

      {/* Cards de ação */}
      <div className="home-estabelecimento-cards">
        {/* 1. Cadastrar novo ponto */}
        <div
          className="home-estabelecimento-card"
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
          onClick={() => navigate("/cadastrar-ponto-coleta")}
        >
          <h2 className="home-estabelecimento-card-title home-estabelecimento-card-title-blue">
            📍 Cadastrar Ponto de Coleta
          </h2>
          <p className="home-estabelecimento-card-text">
            Adicione um novo ponto de coleta para receber medicamentos vencidos.
          </p>
          <div className="home-estabelecimento-card-info">
            {pontosDeColeta.length} ponto(s) cadastrado(s)
          </div>
        </div>

        {/* 2. Gerenciar pontos */}
        <div
          className="home-estabelecimento-card"
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
          onClick={() => navigate("/gerenciar-pontos")}
        >
          <h2 className="home-estabelecimento-card-title home-estabelecimento-card-title-green">
            ⚙️ Gerenciar Pontos
          </h2>
          <p className="home-estabelecimento-card-text">
            Edite informações e horários dos seus pontos de coleta.
          </p>
          <div className="home-estabelecimento-card-info">
            {pontosDeColeta.length} ponto(s) ativo(s)
          </div>
        </div>

        {/* 3. Histórico */}
        <div
          className="home-estabelecimento-card d-flex"
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
          onClick={() => navigate("/visualizar-agendamentos")}
        >
          <h2 className="home-estabelecimento-card-title home-estabelecimento-card-title-yellow">
            📅 Histórico de Coletas
          </h2>
          <p className="home-estabelecimento-card-text">
            Visualize o histórico de coletas realizadas.
          </p>
          <div className="home-estabelecimento-card-info">
            {agendamentos.length} coleta(s) registrada(s)
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeEstabelecimento;
