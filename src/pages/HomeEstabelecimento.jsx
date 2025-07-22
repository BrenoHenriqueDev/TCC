import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/HomeEstabelecimento.css";

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
        <h1 className="home-estabelecimento-title">Bem-vindo(a), {nome}! 👋</h1>
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

        {/* 3. Agendamentos */}
        <div
          className="home-estabelecimento-card"
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
          onClick={() => navigate("/visualizar-agendamentos")}
        >
          <h2 className="home-estabelecimento-card-title home-estabelecimento-card-title-yellow">
            📅 Agendamentos
          </h2>
          <p className="home-estabelecimento-card-text">
            Visualize e gerencie os agendamentos de coleta.
          </p>
          <div className="home-estabelecimento-card-info">
            {agendamentos.filter((a) => a.status === "Pendente").length}{" "}
            agendamento(s) pendente(s)
          </div>
        </div>

        {/* 4. Estatísticas */}
        <div
          className="home-estabelecimento-card"
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
        >
          <h2 className="home-estabelecimento-card-title home-estabelecimento-card-title-purple">
            📊 Estatísticas
          </h2>
          <p className="home-estabelecimento-card-text">
            Acompanhe seu impacto ambiental.
          </p>
          <div className="home-estabelecimento-card-info">
            {agendamentos.filter((a) => a.status === "concluído").length}{" "}
            coleta(s) realizada(s)
          </div>
        </div>

        {/* 5. Configurações do perfil */}
        <div
          className="home-estabelecimento-card"
          onMouseEnter={(e) => handleCardHover(e, true)}
          onMouseLeave={(e) => handleCardHover(e, false)}
        >
          <h2 className="home-estabelecimento-card-title home-estabelecimento-card-title-red">
            ⚙️ Configurações
          </h2>
          <p className="home-estabelecimento-card-text">
            Gerencie suas informações e preferências.
          </p>
          <div className="home-estabelecimento-card-info">
            Perfil e configurações
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeEstabelecimento;
