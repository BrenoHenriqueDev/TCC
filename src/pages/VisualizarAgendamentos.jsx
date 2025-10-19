import React, { useEffect, useState } from 'react';
import ColetaService from '../services/ColetaService';
import EstabelecimentoService from '../services/EstabelecimentoService';
import UsuarioService from '../services/UsuarioService';
import '../css/VisualizarAgendamentos.css';

const VisualizarAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 6;

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    try {
      const usuario = UsuarioService.getCurrentUser();
      if (usuario && usuario.id) {
        // Buscar estabelecimentos do usuário logado
        const estabelecimentosResponse = await EstabelecimentoService.listarPorUsuario(usuario.id);
        const estabelecimentos = estabelecimentosResponse.data || [];
        
        // Buscar agendamentos para cada estabelecimento
        let todosAgendamentos = [];
        for (const estab of estabelecimentos) {
          try {
            const response = await ColetaService.listarPorEstabelecimento(estab.id);
            todosAgendamentos = [...todosAgendamentos, ...(response.data || [])];
          } catch {
            console.log(`Nenhum agendamento para estabelecimento ${estab.id}`);
          }
        }
        setAgendamentos(todosAgendamentos);
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setAgendamentos([]);
    } finally {
      setCarregando(false);
    }
  };

  const atualizarStatusAgendamento = async (agendamentoId, novoStatus) => {
    setAtualizando(agendamentoId);
    try {
      const agendamento = agendamentos.find(a => a.id === agendamentoId);
      if (agendamento) {
        await ColetaService.atualizarColeta(agendamentoId, {
          ...agendamento,
          statusColeta: novoStatus
        });
        
        setAgendamentos(prev => 
          prev.map(a => 
            a.id === agendamentoId 
              ? { ...a, statusColeta: novoStatus }
              : a
          )
        );
        
        alert(`Agendamento ${novoStatus.toLowerCase()} com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do agendamento.');
    } finally {
      setAtualizando(null);
    }
  };

  if (carregando) {
    return (
      <div className="visualizar-agendamentos-container">
        <div className="visualizar-agendamentos-card">
          <div className="visualizar-agendamentos-loading">Carregando agendamentos...</div>
        </div>
      </div>
    );
  }

  if (!agendamentos || agendamentos.length === 0) {
    return (
      <div className="visualizar-agendamentos-container">
        <div className="visualizar-agendamentos-card">
          <h1 className="visualizar-agendamentos-title">Meus Agendamentos</h1>
          <div className="visualizar-agendamentos-empty">
            Nenhum agendamento encontrado para seus estabelecimentos.
          </div>
        </div>
      </div>
    );
  }

  // Cálculos da paginação
  const totalPaginas = Math.ceil(agendamentos.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const agendamentosPaginados = agendamentos.slice(indiceInicio, indiceFim);

  const irParaPagina = (pagina) => {
    setPaginaAtual(pagina);
  };

  return (
    <div className="visualizar-agendamentos-container">
      <div className="visualizar-agendamentos-card">
        <h1 className="visualizar-agendamentos-title">Meus Agendamentos</h1>
        <div className="agendamentos-grid">
          {agendamentosPaginados.map((agendamento) => (
            <div key={agendamento.id} className="agendamento-card">
              <div className="agendamento-header">
                <div className="agendamento-id">Agendamento solicitado por {agendamento.usuario?.nome || agendamento.usuario?.email || 'Usuário desconhecido'}</div>
                <span className={`agendamento-status ${
                  agendamento.statusColeta === 'PENDENTE' ? 'status-pendente' :
                  agendamento.statusColeta === 'CONCLUIDO' ? 'status-concluido' :
                  agendamento.statusColeta === 'CANCELADO' ? 'status-cancelado' : 'status-pendente'
                }`}>
                  {agendamento.statusColeta || 'PENDENTE'}
                </span>
              </div>
              
              <div className="agendamento-info">
                <div className="info-item">
                  <span className="info-label">Data da Coleta</span>
                  <span className="info-value">{agendamento.dataColeta || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tipo de Coleta</span>
                  <span className="info-value">{agendamento.tipoColeta || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tipo de Medicamento</span>
                  <span className="info-value">{agendamento.tipoMedicamento || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">CEP</span>
                  <span className="info-value">{agendamento.cep || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Endereço</span>
                  <span className="info-value">{agendamento.info || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Número</span>
                  <span className="info-value">{agendamento.numero || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Complemento</span>
                  <span className="info-value">{agendamento.complemento || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Telefone</span>
                  <span className="info-value">{agendamento.telefone || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Usuário</span>
                  <span className="info-value">{agendamento.usuario?.nome || agendamento.usuario?.email || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Estabelecimento</span>
                  <span className="info-value">{agendamento.estabelecimento?.nome || 'N/A'}</span>
                </div>
              </div>
              
              <div className="agendamento-actions">
                <button
                  className="action-btn btn-concluir"
                  onClick={() => atualizarStatusAgendamento(agendamento.id, 'CONCLUIDO')}
                  disabled={atualizando === agendamento.id || agendamento.statusColeta === 'CONCLUIDO'}
                >
                  {atualizando === agendamento.id ? 'Atualizando...' : 'Concluir'}
                </button>
                <button
                  className="action-btn btn-ativo"
                  onClick={() => atualizarStatusAgendamento(agendamento.id, 'ATIVO')}
                  disabled={atualizando === agendamento.id || agendamento.statusColeta === 'ATIVO'}
                >
                  {atualizando === agendamento.id ? 'Atualizando...' : 'Ativo'}
                </button>
                <button
                  className="action-btn btn-cancelar"
                  onClick={() => atualizarStatusAgendamento(agendamento.id, 'CANCELADO')}
                  disabled={atualizando === agendamento.id || agendamento.statusColeta === 'CANCELADO'}
                >
                  {atualizando === agendamento.id ? 'Atualizando...' : 'Cancelar'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {totalPaginas > 1 && (
          <div className="paginacao">
            <button 
              className="paginacao-btn" 
              onClick={() => irParaPagina(paginaAtual - 1)}
              disabled={paginaAtual === 1}
            >
              Anterior
            </button>
            
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
              <button
                key={pagina}
                className={`paginacao-btn ${paginaAtual === pagina ? 'ativo' : ''}`}
                onClick={() => irParaPagina(pagina)}
              >
                {pagina}
              </button>
            ))}
            
            <button 
              className="paginacao-btn" 
              onClick={() => irParaPagina(paginaAtual + 1)}
              disabled={paginaAtual === totalPaginas}
            >
              Próximo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizarAgendamentos;