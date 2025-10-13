import React, { useState, useEffect } from 'react';
import { FaHistory } from 'react-icons/fa';
import '../css/HistoricoAgendamentos.css';
import UsuarioService from '../services/UsuarioService';

const statusColors = {
  Pendente: 'historico-status historico-status-pendente',
  Concluído: 'historico-status historico-status-concluido',
  Cancelado: 'historico-status historico-status-cancelado',
};

const HistoricoAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarAgendamentos = async () => {
      try {
        const usuario = UsuarioService.getCurrentUser();
        if (usuario && usuario.id) {
          // Aqui você pode implementar uma chamada para o backend
          // Por enquanto, vamos usar dados mockados ou localStorage
          const agendamentosSalvos = JSON.parse(localStorage.getItem(`agendamentos_${usuario.id}`)) || [];
          setAgendamentos(agendamentosSalvos);
        }
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarAgendamentos();
  }, []);

  const onCancelar = (id) => {
    const novosAgendamentos = agendamentos.map(a => 
      a.id === id ? { ...a, status: 'Cancelado' } : a
    );
    setAgendamentos(novosAgendamentos);
    
    const usuario = UsuarioService.getCurrentUser();
    if (usuario && usuario.id) {
      localStorage.setItem(`agendamentos_${usuario.id}`, JSON.stringify(novosAgendamentos));
    }
  };

  if (loading) {
    return (
      <div className="historico-container">
        <h2 className="historico-title">
          <FaHistory className="historico-title-icon" /> Histórico de Agendamentos
        </h2>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
  <div className="historico-container">
    <h2 className="historico-title">
      <FaHistory className="historico-title-icon" /> Histórico de Agendamentos
    </h2>
    <div className="historico-table-wrapper">
      <table className="historico-table">
        <thead>
          <tr className="historico-table-header-row">
            <th className="historico-th">Data</th>
            <th className="historico-th">Horário</th>
            <th className="historico-th">Local</th>
            <th className="historico-th">Tipos</th>
            <th className="historico-th">Retirada</th>
            <th className="historico-th">Status</th>
            <th className="historico-th">Ações</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.length === 0 && (
            <tr>
              <td colSpan={7} className="historico-td historico-td-empty">
                Nenhum agendamento encontrado.
              </td>
            </tr>
          )}
          {agendamentos.map((a) => (
            <tr key={a.id} className="historico-table-row">
              <td className="historico-td historico-td-bold">{a.data}</td>
              <td className="historico-td">{a.horario}</td>
              <td className="historico-td">{a.nomePonto || a.local}</td>
              <td className="historico-td">
                {a.tipos && a.tipos.length > 0 ? (
                  <span>
                    {a.tipos.join(', ')}
                    {a.tipos.includes('Outros') && a.outros ? ` - ${a.outros}` : ''}
                  </span>
                ) : (
                  <span className="historico-td-empty">-</span>
                )}
              </td>
              <td className="historico-td">
                {a.retirada ? (
                  <span className="historico-retirada-info">
                    <span className="historico-retirada-sim">Sim</span>
                    <br />
                    {a.retirada.cep}
                    <br />
                    {a.retirada.rua}, {a.retirada.numero}
                    <br />
                    {a.retirada.bairro}
                    <br />
                    {a.retirada.cidade} - {a.retirada.estado}
                  </span>
                ) : (
                  <span className="historico-td-empty">-</span>
                )}
              </td>
              <td className="historico-td">
                <span className={statusColors[a.status] || 'historico-status'}>
                  {a.status}
                </span>
              </td>
              <td className="historico-td">
                {a.status === 'Pendente' && (
                  <button
                    onClick={() => onCancelar(a.id)}
                    className="historico-btn-cancelar"
                  >
                    Cancelar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default HistoricoAgendamentos;
