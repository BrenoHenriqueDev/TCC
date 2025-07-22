import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/GerenciarPontos.css";

const GerenciarPontos = () => {
  const navigate = useNavigate();
  const [pontos, setPontos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!logado || logado.tipo !== "estabelecimento") {
      navigate("/painel-estabelecimento");
      return;
    }
    const pontosSalvos =
      JSON.parse(localStorage.getItem(`pontos_${logado.email}`)) || [];
    setPontos(pontosSalvos);
    setCarregando(false);
  }, [navigate]);

  const handleAtivarDesativar = (id) => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const novosPontos = pontos.map((p) =>
      p.id === id ? { ...p, ativo: !p.ativo } : p
    );
    setPontos(novosPontos);
    localStorage.setItem(`pontos_${logado.email}`, JSON.stringify(novosPontos));
  };

  const handleEditar = (id) => {
    // Redireciona para a página de edição (pode ser implementada depois)
    alert("Funcionalidade de edição pode ser implementada aqui.");
  };

  if (carregando)
    return <div className="gerenciar-pontos-loading">Carregando...</div>;

  return (
    <div className="gerenciar-pontos-container">
      <h1 className="gerenciar-pontos-title">Gerenciar Pontos de Coleta</h1>
      {pontos.length === 0 ? (
        <p className="gerenciar-pontos-empty">Nenhum ponto cadastrado ainda.</p>
      ) : (
        <div className="gerenciar-pontos-list">
          {pontos.map((ponto) => (
            <div
              key={ponto.id}
              className={`gerenciar-ponto-card ${
                ponto.ativo ? "ativo" : "inativo"
              }`}
            >
              <h2 className="gerenciar-ponto-nome">{ponto.nome}</h2>
              <p className="gerenciar-ponto-endereco">{ponto.endereco}</p>
              <p className="gerenciar-ponto-info">
                <strong>Bairro:</strong> {ponto.bairro} <br />
                <strong>Cidade:</strong> {ponto.cidade} <br />
                <strong>Telefone:</strong> {ponto.telefone}
              </p>
              <div className="gerenciar-ponto-status">
                <span
                  className={`gerenciar-ponto-status-badge ${
                    ponto.ativo ? "ativo" : "inativo"
                  }`}
                >
                  {ponto.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>
              <div className="gerenciar-ponto-actions">
                <button
                  className="gerenciar-ponto-btn-editar"
                  onClick={() => handleEditar(ponto.id)}
                >
                  Editar
                </button>
                <button
                  className={`gerenciar-ponto-btn-ativar ${
                    ponto.ativo ? "inativo" : "ativo"
                  }`}
                  onClick={() => handleAtivarDesativar(ponto.id)}
                >
                  {ponto.ativo ? "Desativar" : "Ativar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GerenciarPontos;
