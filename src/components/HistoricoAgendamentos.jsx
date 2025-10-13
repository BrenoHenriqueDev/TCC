import React, { useState, useEffect } from 'react';
import { FaHistory } from 'react-icons/fa';
import '../css/HistoricoAgendamentos.css';
import UsuarioService from '../services/UsuarioService';
import ColetaService from '../services/ColetaService';

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
        console.log('Usuario logado para agendamentos:', usuario);
        if (usuario && usuario.id) {
          try {
            // Tenta buscar por usuário específico
            const response = await ColetaService.listarPorUsuario(usuario.id);
            console.log('Resposta ColetaService por usuário:', response);
            setAgendamentos(response.data);
          } catch (userError) {
            console.log('Endpoint por usuário não existe, usando listarTodas e filtrando');
            // Se não existir endpoint específico, usa listarTodas e filtra
            const response = await ColetaService.listarTodas();
            console.log('Resposta ColetaService todas:', response);
            const coletasUsuario = response.data.filter(coleta => 
              coleta.usuarioId === usuario.id || coleta.usuario?.id === usuario.id
            );
            setAgendamentos(coletasUsuario);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
        console.error('Detalhes do erro:', error.response);
      } finally {
        setLoading(false);
      }
    };

    carregarAgendamentos();
  }, []);

  const onCancelar = async (id) => {
    try {
      const coletaAtualizada = agendamentos.find(a => a.id === id);
      if (coletaAtualizada) {
        await ColetaService.atualizarColeta(id, { ...coletaAtualizada, status: 'Cancelado' });
        const novosAgendamentos = agendamentos.map(a => 
          a.id === id ? { ...a, status: 'Cancelado' } : a
        );
        setAgendamentos(novosAgendamentos);
      }
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      alert('Erro ao cancelar agendamento. Tente novamente.');
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
              <td className="historico-td historico-td-bold">{a.dataColeta || a.data}</td>
              <td className="historico-td">{a.horarioColeta || a.horario}</td>
              <td className="historico-td">{a.estabelecimento?.nome || a.nomePonto || a.local}</td>
              <td className="historico-td">
                {a.tiposMedicamentos && a.tiposMedicamentos.length > 0 ? (
                  <span>{a.tiposMedicamentos.join(', ')}</span>
                ) : a.tipos && a.tipos.length > 0 ? (
                  <span>
                    {a.tipos.join(', ')}
                    {a.tipos.includes('Outros') && a.outros ? ` - ${a.outros}` : ''}
                  </span>
                ) : (
                  <span className="historico-td-empty">-</span>
                )}
              </td>
              <td className="historico-td">
                {a.enderecoColeta ? (
                  <span className="historico-retirada-info">
                    <span className="historico-retirada-sim">Sim</span>
                    <br />
                    {a.enderecoColeta}
                  </span>
                ) : a.retirada ? (
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
                <span className={statusColors[a.statusColeta || a.status] || 'historico-status'}>
                  {a.statusColeta || a.status}
                </span>
              </td>
              <td className="historico-td">
                {(a.statusColeta === 'Pendente' || a.status === 'Pendente') && (
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
