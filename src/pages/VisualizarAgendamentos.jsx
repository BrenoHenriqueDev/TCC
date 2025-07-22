import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/VisualizarAgendamentos.css";

const VisualizarAgendamentos = () => {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!logado || logado.tipo !== "estabelecimento") {
      navigate("/painel-estabelecimento");
      return;
    }
    // Buscar todos os agendamentos dos pontos deste estabelecimento
    const pontos = JSON.parse(localStorage.getItem(`pontos_${logado.email}`)) || [];
    let todosAgendamentos = [];
    pontos.forEach((ponto) => {
      const ags = JSON.parse(localStorage.getItem(`agendamentos_ponto_${ponto.id}`)) || [];
      todosAgendamentos = todosAgendamentos.concat(
        ags.map((a) => ({ ...a, nomePonto: ponto.nome }))
      );
    });
    setAgendamentos(todosAgendamentos);
    setCarregando(false);
  }, [navigate]);

  return (
    <div className="visualizar-agendamentos-container">
      <h1 className="visualizar-agendamentos-title">Agendamentos Recebidos</h1>
      {carregando ? (
        <div className="visualizar-agendamentos-loading">Carregando...</div>
      ) : agendamentos.length === 0 ? (
        <p className="visualizar-agendamentos-empty">Nenhum agendamento recebido ainda.</p>
      ) : (
        <table className="visualizar-agendamentos-table">
          <thead>
            <tr>
              <th>Ponto de Coleta</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Usuário</th>
              <th>Status</th>
              <th>Tipos</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((ag, idx) => (
              <tr key={idx}>
                <td>{ag.nomePonto}</td>
                <td>{ag.data}</td>
                <td>{ag.horario}</td>
                <td>{ag.usuarioEmail || '-'}</td>
                <td>
                  <span className={`visualizar-agendamentos-status visualizar-agendamentos-status-${ag.status?.toLowerCase()}`}>{ag.status}</span>
                </td>
                <td>{Array.isArray(ag.tipos) ? ag.tipos.join(", ") : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VisualizarAgendamentos; 