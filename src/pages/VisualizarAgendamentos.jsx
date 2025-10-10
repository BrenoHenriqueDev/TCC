import React from 'react';
import '../css/VisualizarAgendamentos.css';

const VisualizarAgendamentos = ({ agendamentos }) => {
  if (!agendamentos || agendamentos.length === 0) {
    return <p className="visualizar-agendamentos-empty">Nenhum agendamento recebido ainda.</p>;
  }

  return (
    <div className="visualizar-agendamentos-container">
      <h1 className="visualizar-agendamentos-title">Agendamentos Recebidos</h1>
      <table className="visualizar-agendamentos-table">
        <thead>
          <tr>
            <th>Ponto de Coleta</th>
            <th>Data</th>
            <th>Horário</th>
            <th>Usuário</th>
            <th>Status</th>
            <th>Tipos</th>
            <th>Observações</th>
            <th>Retirada em Casa</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.map((ag) => (
            <tr key={ag.id}>
              <td>{ag.local}</td>
              <td>{ag.data}</td>
              <td>{ag.horario}</td>
              <td>{ag.usuarioEmail || '-'}</td>
              <td>
                <span className={`visualizar-agendamentos-status visualizar-agendamentos-status-${ag.status?.toLowerCase()}`}>
                  {ag.status}
                </span>
              </td>
              <td>{Array.isArray(ag.tipos) && ag.tipos.length > 0 ? ag.tipos.join(', ') : '-'}</td>
              <td>{ag.obs || '-'}</td>
              <td>
                {ag.retirada ? (
                  <>
                    <div>Sim</div>
                    <div>{`${ag.retirada.rua}, ${ag.retirada.numero}`}</div>
                    <div>{`${ag.retirada.bairro} - ${ag.retirada.cidade}/${ag.retirada.estado}`}</div>
                    <div>CEP: {ag.retirada.cep}</div>
                  </>
                ) : (
                  "Não"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VisualizarAgendamentos;
