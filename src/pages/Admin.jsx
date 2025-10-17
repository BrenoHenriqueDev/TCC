import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/HookLogin";
import { useNavigate } from "react-router-dom";
import UsuarioService from "../services/UsuarioService";
import EstabelecimentoService from "../services/EstabelecimentoService";
import "../css/Admin.css";

function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [cnpjValidacao, setCnpjValidacao] = useState("");
  const [resultadoCNPJ, setResultadoCNPJ] = useState(null);
  const [validandoCNPJ, setValidandoCNPJ] = useState(false);
  
  // Estados para paginação
  const [paginaUsuarios, setPaginaUsuarios] = useState(1);
  const [paginaEstabelecimentos, setPaginaEstabelecimentos] = useState(1);
  const [paginaSolicitacoes, setPaginaSolicitacoes] = useState(1);
  const itensPorPagina = 5;
  const { userType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userType !== "ADMIN") {
      navigate("/");
      return;
    }
    carregarUsuarios();
    carregarEstabelecimentos();
    carregarSolicitacoesPendentes();
  }, [userType, navigate]);

  const carregarUsuarios = async () => {
    try {
      const usuarioLogado = UsuarioService.getCurrentUser();
      
      if (!usuarioLogado || !usuarioLogado.id) {
        alert("Erro: Usuário não encontrado. Faça login novamente.");
        navigate("/login");
        return;
      }
      
      const data = await UsuarioService.findAllByAdmin(usuarioLogado.id);
      setUsuarios(data || []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      if (error.response?.status === 403) {
        alert("Acesso negado: Apenas ADMIN pode listar usuários.");
        navigate("/");
      } else {
        alert("Erro ao carregar usuários");
      }
    } finally {
      setLoading(false);
    }
  };

  const carregarEstabelecimentos = async () => {
    try {
      const usuarioLogado = UsuarioService.getCurrentUser();
      if (usuarioLogado && usuarioLogado.id) {
        const dados = await EstabelecimentoService.listarTodosComCNPJ(usuarioLogado.id);
        setEstabelecimentos(dados || []);
      }
    } catch (error) {
      console.error("Erro ao carregar estabelecimentos:", error);
    }
  };

  const carregarSolicitacoesPendentes = async () => {
    try {
      const usuarioLogado = UsuarioService.getCurrentUser();
      if (usuarioLogado && usuarioLogado.id) {
        const dados = await EstabelecimentoService.listarSolicitacoesPendentes(usuarioLogado.id);
        setSolicitacoesPendentes(dados || []);
      }
    } catch (error) {
      console.error("Erro ao carregar solicitações pendentes:", error);
    }
  };

  const aprovarSolicitacao = async (estabelecimentoId) => {
    try {
      const usuarioLogado = UsuarioService.getCurrentUser();
      if (usuarioLogado && usuarioLogado.id) {
        await EstabelecimentoService.aprovarSolicitacao(usuarioLogado.id, estabelecimentoId);
        alert("Solicitação aprovada com sucesso!");
        carregarSolicitacoesPendentes();
        carregarEstabelecimentos();
        carregarUsuarios();
      }
    } catch (error) {
      console.error("Erro ao aprovar solicitação:", error);
      alert("Erro ao aprovar solicitação");
    }
  };

  const rejeitarSolicitacao = async (estabelecimentoId) => {
    try {
      const usuarioLogado = UsuarioService.getCurrentUser();
      if (usuarioLogado && usuarioLogado.id) {
        await EstabelecimentoService.rejeitarSolicitacao(usuarioLogado.id, estabelecimentoId);
        alert("Solicitação rejeitada com sucesso!");
        carregarSolicitacoesPendentes();
      }
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error);
      alert("Erro ao rejeitar solicitação");
    }
  };

  const alterarStatusEstabelecimento = async (estabelecimentoId, novoStatus) => {
    try {
      const usuarioLogado = UsuarioService.getCurrentUser();
      if (usuarioLogado && usuarioLogado.id) {
        await EstabelecimentoService.alterarStatus(usuarioLogado.id, estabelecimentoId, novoStatus);
        alert("Status alterado com sucesso!");
        
        // Atualiza o estado local imediatamente
        setEstabelecimentos(prev => 
          prev.map(estab => 
            estab.id === estabelecimentoId 
              ? { ...estab, statusEstabelecimento: novoStatus }
              : estab
          )
        );
        
        // Recarrega do servidor para garantir sincronização
        await carregarEstabelecimentos();
        
        if (novoStatus === 'PENDENTE') {
          carregarSolicitacoesPendentes();
        }
      }
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert("Erro ao alterar status");
    }
  };

  const alterarNivelAcesso = async (usuarioId, novoNivel) => {
    try {
      const usuarioLogado = UsuarioService.getCurrentUser();
      
      await UsuarioService.updateNivelAcesso(usuarioLogado.id, usuarioId, novoNivel);
      alert("Nível alterado com sucesso!");
      carregarUsuarios();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao alterar nível");
    }
  };

  const excluirUsuario = async (usuarioId, nomeUsuario) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${nomeUsuario}"? Esta ação não pode ser desfeita.`)) {
      try {
        await UsuarioService.remove(usuarioId);
        alert("Usuário excluído com sucesso!");
        carregarUsuarios();
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Erro ao excluir usuário");
      }
    }
  };

  const validarCNPJFarmacia = async () => {
    if (!cnpjValidacao) {
      alert("Digite um CNPJ");
      return;
    }
    
    setValidandoCNPJ(true);
    
    try {
      const resultado = await UsuarioService.validarCNPJ(cnpjValidacao);
      setResultadoCNPJ(resultado);
    } catch (error) {
      setResultadoCNPJ({ valido: false, erro: error.message });
    }
    
    setValidandoCNPJ(false);
  };

  const usuariosFiltrados = usuarios.filter(usuario => 
    usuario.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(filtro.toLowerCase()) ||
    (usuario.nivelAcesso || 'USER').toLowerCase().includes(filtro.toLowerCase())
  );

  // Paginação para usuários
  const totalPaginasUsuarios = Math.ceil(usuariosFiltrados.length / itensPorPagina);
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaUsuarios - 1) * itensPorPagina,
    paginaUsuarios * itensPorPagina
  );

  // Paginação para estabelecimentos
  const totalPaginasEstabelecimentos = Math.ceil(estabelecimentos.length / itensPorPagina);
  const estabelecimentosPaginados = estabelecimentos.slice(
    (paginaEstabelecimentos - 1) * itensPorPagina,
    paginaEstabelecimentos * itensPorPagina
  );

  // Paginação para solicitações pendentes
  const totalPaginasSolicitacoes = Math.ceil(solicitacoesPendentes.length / itensPorPagina);
  const solicitacoesPaginadas = solicitacoesPendentes.slice(
    (paginaSolicitacoes - 1) * itensPorPagina,
    paginaSolicitacoes * itensPorPagina
  );

  if (loading) return <div className="admin-loading">Carregando...</div>;

  // Debug temporário
  console.log('Usuários carregados:', usuarios);
  console.log('UserType atual:', userType);

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <h1>Painel Administrativo</h1>
          <p>Gerencie usuários e valide CNPJs de farmácias</p>
        </div>
        
        <div className="admin-grid">
          {/* Seção de Solicitações Pendentes */}
          {solicitacoesPendentes.length > 0 && (
            <div className="admin-section solicitacoes-pendentes">
              <div className="section-header">
                <div className="section-icon">⏳</div>
                <h2 className="section-title">Solicitações Pendentes ({solicitacoesPendentes.length})</h2>
              </div>
              
              <div className="solicitacoes-lista">
                {solicitacoesPaginadas.map((solicitacao) => (
                  <div key={solicitacao.id} className="solicitacao-card">
                    <div className="solicitacao-info">
                      <h4>{solicitacao.nome}</h4>
                      <p><strong>CNPJ:</strong> {solicitacao.cnpj}</p>
                      <p><strong>Solicitante:</strong> {solicitacao.usuario?.nome}</p>
                      <p><strong>Email:</strong> {solicitacao.usuario?.email}</p>
                      <span className="status-badge pendente">PENDENTE</span>
                    </div>
                    
                    <div className="solicitacao-actions">
                      <button 
                        onClick={() => aprovarSolicitacao(solicitacao.id)}
                        className="btn-aprovar"
                      >
                        ✅ Aprovar
                      </button>
                      <button 
                        onClick={() => rejeitarSolicitacao(solicitacao.id)}
                        className="btn-rejeitar"
                      >
                        ❌ Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Paginação Solicitações */}
              {totalPaginasSolicitacoes > 1 && (
                <div className="paginacao">
                  <button 
                    onClick={() => setPaginaSolicitacoes(prev => Math.max(prev - 1, 1))}
                    disabled={paginaSolicitacoes === 1}
                    className="paginacao-btn"
                  >
                    ← Anterior
                  </button>
                  <span className="paginacao-info">
                    Página {paginaSolicitacoes} de {totalPaginasSolicitacoes}
                  </span>
                  <button 
                    onClick={() => setPaginaSolicitacoes(prev => Math.min(prev + 1, totalPaginasSolicitacoes))}
                    disabled={paginaSolicitacoes === totalPaginasSolicitacoes}
                    className="paginacao-btn"
                  >
                    Próxima →
                  </button>
                </div>
              )}
            </div>
          )}
          {/* Seção de Validação de CNPJ */}
          <div className="admin-section">
            <div className="section-header">
              <div className="section-icon">🏥</div>
              <h2 className="section-title">Validar CNPJ de Farmácia</h2>
            </div>
        <div className="cnpj-input-group">
          <input
            type="text"
            placeholder="Digite o CNPJ"
            value={cnpjValidacao}
            onChange={(e) => setCnpjValidacao(e.target.value)}
            className="cnpj-input"
          />
          <button 
            onClick={validarCNPJFarmacia}
            disabled={validandoCNPJ}
            className="cnpj-btn"
          >
            {validandoCNPJ ? "Validando..." : "Validar"}
          </button>
        </div>
        
            {/* Lista de Estabelecimentos Cadastrados */}
            <div className="estabelecimentos-lista">
              <h3 style={{color: 'white', marginBottom: '15px'}}>Estabelecimentos Cadastrados ({estabelecimentos.length})</h3>
              {estabelecimentos.length > 0 ? (
                <>
                  <div className="estabelecimentos-grid">
                    {estabelecimentosPaginados.map((estab) => (
                      <div key={estab.id} className="estabelecimento-card">
                        <h4>{estab.nome}</h4>
                        <p><strong>CNPJ:</strong> 
                          <span 
                            style={{cursor: 'pointer', color: '#667eea', textDecoration: 'underline'}}
                            onClick={() => {
                              setCnpjValidacao(estab.cnpj);
                              navigator.clipboard.writeText(estab.cnpj);
                            }}
                          >
                            {estab.cnpj}
                          </span>
                        </p>
                        <p><strong>Cadastrado por:</strong> {estab.usuario?.nome || 'N/A'}</p>
                        <p><strong>Email:</strong> {estab.usuario?.email || 'N/A'}</p>
                        <div className="estabelecimento-controls">
                          <span className={`status-badge ${(estab.statusEstabelecimento || 'ATIVO').toLowerCase()}`}>
                            {estab.statusEstabelecimento || 'ATIVO'}
                          </span>
                          <select
                            value={estab.statusEstabelecimento || 'ATIVO'}
                            onChange={(e) => {
                              if (e.target.value !== estab.statusEstabelecimento) {
                                alterarStatusEstabelecimento(estab.id, e.target.value);
                              }
                            }}
                            className="status-select"
                          >
                            <option value="ATIVO">ATIVO</option>
                            <option value="INATIVO">INATIVO</option>
                            <option value="PENDENTE">PENDENTE</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Paginação Estabelecimentos */}
                  {totalPaginasEstabelecimentos > 1 && (
                    <div className="paginacao">
                      <button 
                        onClick={() => setPaginaEstabelecimentos(prev => Math.max(prev - 1, 1))}
                        disabled={paginaEstabelecimentos === 1}
                        className="paginacao-btn"
                      >
                        ← Anterior
                      </button>
                      <span className="paginacao-info">
                        Página {paginaEstabelecimentos} de {totalPaginasEstabelecimentos}
                      </span>
                      <button 
                        onClick={() => setPaginaEstabelecimentos(prev => Math.min(prev + 1, totalPaginasEstabelecimentos))}
                        disabled={paginaEstabelecimentos === totalPaginasEstabelecimentos}
                        className="paginacao-btn"
                      >
                        Próxima →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p style={{color: '#a0aec0', fontStyle: 'italic'}}>Nenhum estabelecimento cadastrado</p>
              )}
            </div>

            {resultadoCNPJ && (
              <div className={`cnpj-resultado ${resultadoCNPJ.valido ? 'valido' : 'invalido'}`}>
                {resultadoCNPJ.valido ? (
                  <div>
                    <h4>✅ CNPJ Válido</h4>
                    <p><strong>Razão Social:</strong> {resultadoCNPJ.dados.razaoSocial}</p>
                    <p><strong>Nome Fantasia:</strong> {resultadoCNPJ.dados.nomeFantasia}</p>
                    <p><strong>É Farmácia:</strong> {resultadoCNPJ.isFarmacia ? "✅ Sim" : "❌ Não"}</p>
                    <p><strong>Situação:</strong> {resultadoCNPJ.dados.situacao}</p>
                    <p><strong>Atividade:</strong> {resultadoCNPJ.dados.atividade}</p>
                  </div>
                ) : (
                  <div>
                    <h4>❌ CNPJ Inválido</h4>
                    <p>{resultadoCNPJ.erro}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Seção de Gerenciamento de Usuários */}
          <div className="admin-section">
            <div className="section-header">
              <div className="section-icon">👥</div>
              <h2 className="section-title">Gerenciar Usuários ({usuarios.length})</h2>
            </div>
            
            <div className="filtro-container">
              <input
                type="text"
                placeholder="Filtrar por nome, email ou nível..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="filtro-input"
              />
            </div>
            
            <div className="usuarios-lista">
              {usuariosPaginados.map((usuario) => (
                <div key={usuario.id} className="usuario-card">
                  <div className="usuario-info">
                    <h3>{usuario.nome}</h3>
                    <p className="usuario-email">{usuario.email}</p>
                    <span className={`nivel-badge ${(usuario.nivelAcesso || 'USER').toLowerCase()}`}>
                      {usuario.nivelAcesso || 'USER'}
                    </span>
                  </div>
                  
                  <div className="nivel-acesso-controls">
                    <label>Alterar nível:</label>
                    <select
                      value={usuario.nivelAcesso || 'USER'}
                      onChange={(e) => alterarNivelAcesso(usuario.id, e.target.value)}
                      className="nivel-select"
                    >
                      <option value="USER">USER</option>
                      <option value="FARMACIA">FARMACIA</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button
                      onClick={() => excluirUsuario(usuario.id, usuario.nome)}
                      className="excluir-btn"
                      title="Excluir usuário"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
              
              {usuariosFiltrados.length === 0 && (
                <div className="no-users">Nenhum usuário encontrado</div>
              )}
            </div>
            
            {/* Paginação Usuários */}
            {totalPaginasUsuarios > 1 && (
              <div className="paginacao">
                <button 
                  onClick={() => setPaginaUsuarios(prev => Math.max(prev - 1, 1))}
                  disabled={paginaUsuarios === 1}
                  className="paginacao-btn"
                >
                  ← Anterior
                </button>
                <span className="paginacao-info">
                  Página {paginaUsuarios} de {totalPaginasUsuarios}
                </span>
                <button 
                  onClick={() => setPaginaUsuarios(prev => Math.min(prev + 1, totalPaginasUsuarios))}
                  disabled={paginaUsuarios === totalPaginasUsuarios}
                  className="paginacao-btn"
                >
                  Próxima →
                </button>
              </div>
            )}
          </div>
        </div>
        <br />
        
        {/* Debug Info */}
        <div className="debug-info">
          Usuários encontrados: {usuarios.length} | Seu nível: {userType}
        </div>
      </div>
    </div>
  );
}

export default Admin;