import React, { useEffect, useState } from 'react';
import ColetaService from '../services/ColetaService';
import EstabelecimentoService from '../services/EstabelecimentoService';
import UsuarioService from '../services/UsuarioService';

const VisualizarAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);

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

  if (carregando) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando agendamentos...</div>;
  }

  if (!agendamentos || agendamentos.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Meus Agendamentos</h1>
        <p>Nenhum agendamento encontrado para seus estabelecimentos.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Meus Agendamentos</h1>
      <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
        {agendamentos.map((agendamento) => (
          <div key={agendamento.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: '#f9f9f9'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>Agendamento #{agendamento.id}</h3>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                backgroundColor: agendamento.status === 'PENDENTE' ? '#fff3cd' : '#d4edda',
                color: agendamento.status === 'PENDENTE' ? '#856404' : '#155724'
              }}>
                {agendamento.status}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div><strong>Data da Coleta:</strong> {agendamento.dataColeta}</div>
              <div><strong>Tipo de Coleta:</strong> {agendamento.tipoColeta}</div>
              <div><strong>Status:</strong> {agendamento.statusColeta}</div>
              <div><strong>Tipo de Medicamento:</strong> {agendamento.tipoMedicamento}</div>
              <div><strong>CEP:</strong> {agendamento.cep}</div>
              <div><strong>Endereço:</strong> {agendamento.info}</div>
              <div><strong>Número:</strong> {agendamento.numero}</div>
              <div><strong>Complemento:</strong> {agendamento.complemento || '-'}</div>
              <div><strong>Telefone:</strong> {agendamento.telefone}</div>
              <div><strong>Usuário:</strong> {agendamento.usuario?.nome || agendamento.usuario?.email || 'N/A'}</div>
              <div><strong>Estabelecimento:</strong> {agendamento.estabelecimento?.nome || 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualizarAgendamentos;