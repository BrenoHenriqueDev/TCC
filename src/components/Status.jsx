import React, { useState, useEffect } from 'react';
import VisualizarAgendamentos from './VisualizarAgendamentos';
import HistoricoAgendamentos from './HistoricoAgendamentos';

const Status = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!logado) return;

    const pontos = JSON.parse(localStorage.getItem(`pontos_${logado.email}`)) || [];
    let todosAgendamentos = [];

    pontos.forEach((ponto) => {
      const ags = JSON.parse(localStorage.getItem(`agendamentos_ponto_${ponto.id}`)) || [];
      todosAgendamentos = todosAgendamentos.concat(
        ags.map((a) => ({
          ...a,
          nomePonto: ponto.nome,
          idPonto: ponto.id,
        }))
      );
    });

    setAgendamentos(todosAgendamentos);
    setCarregando(false);
  }, []);

  const atualizarStatus = (idAgendamento, novoStatus, idPonto) => {
    const novos = agendamentos.map((a) =>
      a.id === idAgendamento ? { ...a, status: novoStatus } : a
    );
    setAgendamentos(novos);

    // Atualiza localStorage para o ponto correto
    const agsDoPonto = JSON.parse(localStorage.getItem(`agendamentos_ponto_${idPonto}`)) || [];
    const agsAtualizados = agsDoPonto.map((ag) =>
      ag.id === idAgendamento ? { ...ag, status: novoStatus } : ag
    );
    localStorage.setItem(`agendamentos_ponto_${idPonto}`, JSON.stringify(agsAtualizados));
  };

  if (carregando) return <div>Carregando agendamentos...</div>;

  return (
    <>
      <VisualizarAgendamentos agendamentos={agendamentos} />
      <HistoricoAgendamentos
        agendamentos={agendamentos}
        onCancelar={(id) => {
          const ag = agendamentos.find((a) => a.id === id);
          if (!ag) return;
          atualizarStatus(id, 'Cancelado', ag.idPonto);
        }}
      />
    </>
  );
};

export default Status;