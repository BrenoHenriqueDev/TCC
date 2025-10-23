import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/HookLogin";
import { useNavigate } from "react-router-dom";
import UsuarioService from "../services/UsuarioService";
import EstabelecimentoService from "../services/EstabelecimentoService";
import MensagemService from "../services/MensagemService";
import "../css/Admin.css";

function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState([]);
  const [solicitacoesFarmacia, setSolicitacoesFarmacia] = useState([]);
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
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!logado || logado.nivelAcesso !== "ADMIN") {
      navigate("/");
      return;
    }
    carregarUsuarios();
    carregarEstabelecimentos();
    carregarSolicitacoesPendentes();
    carregarSolicitacoesFarmacia();
  }, [navigate]);

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
        const dados = await EstabelecimentoService.listarTodosComCNPJ(
          usuarioLogado.id
        );
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
        const dados = await EstabelecimentoService.listarSolicitacoesPendentes(
          usuarioLogado.id
        );
        setSolicitacoesPendentes(dados || []);
      }
    } catch (error) {
      console.error("Erro ao carregar solicitações pendentes:", error);
    }
  };

  const carregarSolicitacoesFarmacia = async () => {
    try {
      const response = await MensagemService.listarTodas();
      console.log("Todas as mensagens:", response.data);
      const solicitacoesFarmacia =
        response.data.filter(
          (msg) =>
            msg.texto &&
            msg.texto.includes("SOLICITAÇÃO FARMÁCIA") &&
            msg.statusMensagem === "PENDENTE"
        ) || [];
      console.log("Solicitações de farmácia filtradas:", solicitacoesFarmacia);
      setSolicitacoesFarmacia(solicitacoesFarmacia);
    } catch (error) {
      console.error("Erro ao carregar solicitações de farmácia:", error);
    }
  };

  const aprovarSolicitacao = async (estabelecimentoId) => {
    try {
      const usuarioLogado = UsuarioService.getCurrentUser();
      if (usuarioLogado && usuarioLogado.id) {
        await EstabelecimentoService.aprovarSolicitacao(
          usuarioLogado.id,
          estabelecimentoId
        );
        alert("Solicitação aprovada com sucesso!");
        carregarSolicitacoesPendentes();
        carregarEstabelecimentos();
        carregarUsuarios();
        carregarSolicitacoesFarmacia();
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
        await EstabelecimentoService.rejeitarSolicitacao(
          usuarioLogado.id,
          estabelecimentoId
        );
        alert("Solicitação rejeitada com sucesso!");
        carregarSolicitacoesPendentes();
      }
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error);
      alert("Erro ao rejeitar solicitação");
    }
  };

  const alterarStatusEstabelecimento = async (
    estabelecimentoId,
    novoStatus
  ) => {
    try {
      const usuarioLogado = UsuarioService.getCurrentUser();
      if (!usuarioLogado || !usuarioLogado.id) {
        alert("Erro: Usuário não encontrado. Faça login novamente.");
        return;
      }
      await EstabelecimentoService.alterarStatus(
        usuarioLogado.id,
        estabelecimentoId,
        novoStatus
      );
      alert("Status alterado com sucesso!");
      setEstabelecimentos((prev) =>
        prev.map((estab) =>
          estab.id === estabelecimentoId
            ? { ...estab, statusEstabelecimento: novoStatus }
            : estab
        )
      );
      await carregarEstabelecimentos();
      if (novoStatus === "PENDENTE") {
        carregarSolicitacoesPendentes();
      }
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      alert(`Erro ao alterar status: ${error.message || error}`);
    }
  };

  const alterarNivelAcesso = async (usuarioId, novoNivel) => {
    try {
      const usuarioLogado = UsuarioService.getCurrentUser();
      await UsuarioService.updateNivelAcesso(
        usuarioLogado.id,
        usuarioId,
        novoNivel
      );
      alert("Nível alterado com sucesso!");
      carregarUsuarios();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao alterar nível");
    }
  };

  const excluirUsuario = async (usuarioId, nomeUsuario) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o usuário "${nomeUsuario}"? Esta ação não pode ser desfeita.`
      )
    ) {
      try {
        const usuarioLogado = UsuarioService.getCurrentUser();
        await UsuarioService.remove(usuarioLogado.id, usuarioId);
        alert("Usuário excluído com sucesso!");
        carregarUsuarios();
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        if (error.response?.status === 500) {
          alert(
            "Erro: Não é possível excluir este usuário. Ele tem agendamentos pendentes."
          );
        } else {
          alert(
            "Erro ao excluir usuário: " +
              (error.response?.data || error.message)
          );
        }
      }
    }
  };

  const formatarCNPJ = (valor) => {
    const cnpj = valor.replace(/\D/g, "");
    return cnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  };

  const validarCNPJFarmacia = async () => {
    if (!cnpjValidacao) {
      alert("Digite um CNPJ");
      return;
    }
    setValidandoCNPJ(true);
    try {
      const resultado = await UsuarioService.validarCNPJ(
        cnpjValidacao.replace(/\D/g, "")
      );
      setResultadoCNPJ(resultado);
    } catch (error) {
      setResultadoCNPJ({ valido: false, erro: error.message });
    }
    setValidandoCNPJ(false);
  };

  const aprovarSolicitacaoFarmacia = async (id, email) => {
    try {
      const usuario = usuarios.find((u) => u.email === email);
      if (usuario) {
        await UsuarioService.updateNivelAcesso(
          UsuarioService.getCurrentUser().id,
          usuario.id,
          "FARMACIA"
        );
        await MensagemService.excluir(id);
        alert("Solicitação aprovada! Usuário agora é FARMÁCIA.");
        carregarSolicitacoesFarmacia();
        carregarUsuarios();
      }
    } catch (error) {
      console.error("Erro ao aprovar solicitação:", error);
      alert("Erro ao aprovar solicitação");
    }
  };

  const rejeitarSolicitacaoFarmacia = async (id) => {
    try {
      await MensagemService.excluir(id);
      alert("Solicitação rejeitada.");
      carregarSolicitacoesFarmacia();
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error);
      alert("Erro ao rejeitar solicitação");
    }
  };

  // Filtros e paginação
  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(filtro.toLowerCase()) ||
      (usuario.nivelAcesso || "USER")
        .toLowerCase()
        .includes(filtro.toLowerCase())
  );

  const totalPaginasUsuarios = Math.ceil(
    usuariosFiltrados.length / itensPorPagina
  );
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaUsuarios - 1) * itensPorPagina,
    paginaUsuarios * itensPorPagina
  );

  const totalPaginasEstabelecimentos = Math.ceil(
    estabelecimentos.length / itensPorPagina
  );
  const estabelecimentosPaginados = estabelecimentos.slice(
    (paginaEstabelecimentos - 1) * itensPorPagina,
    paginaEstabelecimentos * itensPorPagina
  );

  const totalPaginasSolicitacoes = Math.ceil(
    solicitacoesPendentes.length / itensPorPagina
  );
  const solicitacoesPaginadas = solicitacoesPendentes.slice(
    (paginaSolicitacoes - 1) * itensPorPagina,
    paginaSolicitacoes * itensPorPagina
  );

  if (loading) return <div className="admin-loading">Carregando...</div>;

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <h1>Painel Administrativo</h1>
          <p>Gerencie usuários e valide CNPJs de farmácias</p>
        </div>

        <div className="admin-grid">
          {/* Seção de Solicitações de Farmácia */}
          <div className="admin-section solicitacoes-farmacia">
            <div className="section-header">
              <div className="section-icon">🏥</div>
              <h2 className="section-title">
                Solicitações de Farmácia ({solicitacoesFarmacia.length})
              </h2>
              <button
                onClick={carregarSolicitacoesFarmacia}
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                🔄 Recarregar
              </button>
            </div>

            {solicitacoesFarmacia.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#a0aec0",
                }}
              >
                <p>Nenhuma solicitação de farmácia pendente encontrada.</p>
              </div>
            ) : (
              <div className="solicitacoes-lista">
                {solicitacoesFarmacia.map((solicitacao) => (
                  <div
                    key={solicitacao.id}
                    className="solicitacao-card farmacia-card"
                  >
                    <div className="solicitacao-info">
                      <h4>{solicitacao.emissor}</h4>
                      <p>
                        <strong>Email:</strong> {solicitacao.email}
                      </p>
                      <div className="justificativa-container">
                        <p>
                          <strong>Solicitação:</strong>
                        </p>
                        <div className="justificativa-texto">
                          {solicitacao.texto}
                        </div>
                      </div>
                      <span className="status-badge pendente">
                        {solicitacao.statusMensagem}
                      </span>
                    </div>

                    <div className="solicitacao-actions">
                      <button
                        onClick={() =>
                          aprovarSolicitacaoFarmacia(
                            solicitacao.id,
                            solicitacao.email
                          )
                        }
                        className="btn-aprovar"
                      >
                        ✅ Aprovar
                      </button>
                      <button
                        onClick={() =>
                          rejeitarSolicitacaoFarmacia(solicitacao.id)
                        }
                        className="btn-rejeitar"
                      >
                        ❌ Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Seção de Solicitações Pendentes */}
          {solicitacoesPendentes.length > 0 && (
            <div className="admin-section solicitacoes-pendentes">
              <div className="section-header">
                <div className="section-icon">⏳</div>
                <h2 className="section-title">
                  Solicitações Pendentes ({solicitacoesPendentes.length})
                </h2>
              </div>

              <div className="solicitacoes-lista">
                {solicitacoesPaginadas.map((solicitacao) => (
                  <div key={solicitacao.id} className="solicitacao-card">
                    <div className="solicitacao-info">
                      <h4>{solicitacao.nome}</h4>
                      <p>
                        <strong>CNPJ:</strong> {solicitacao.cnpj}
                      </p>
                      <p>
                        <strong>Solicitante:</strong>{" "}
                        {solicitacao.usuario?.nome}
                      </p>
                      <p>
                        <strong>Email:</strong> {solicitacao.usuario?.email}
                      </p>
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

              {totalPaginasSolicitacoes > 1 && (
                <div className="paginacao">
                  <button
                    onClick={() =>
                      setPaginaSolicitacoes((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={paginaSolicitacoes === 1}
                    className="paginacao-btn"
                  >
                    ← Anterior
                  </button>
                  <span className="paginacao-info">
                    Página {paginaSolicitacoes} de {totalPaginasSolicitacoes}
                  </span>
                  <button
                    onClick={() =>
                      setPaginaSolicitacoes((prev) =>
                        Math.min(prev + 1, totalPaginasSolicitacoes)
                      )
                    }
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
                placeholder="00.000.000/0000-00"
                value={cnpjValidacao}
                onChange={(e) => {
                  const valor = e.target.value.replace(/\D/g, "");
                  if (valor.length <= 14) {
                    setCnpjValidacao(formatarCNPJ(valor));
                  }
                }}
                className="cnpj-input"
                maxLength="18"
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
              <h3 style={{ color: "white", marginBottom: "15px" }}>
                Estabelecimentos Cadastrados ({estabelecimentos.length})
              </h3>
              {estabelecimentos.length > 0 ? (
                <>
                  <div className="estabelecimentos-grid">
                    {estabelecimentosPaginados.map((estab) => (
                      <div key={estab.id} className="estabelecimento-card">
                        <h4>{estab.nome}</h4>
                        <p>
                          <strong>CNPJ:</strong>
                          <span
                            style={{
                              cursor: "pointer",
                              color: "#00ff88",
                              fontWeight: "bold",
                              textDecoration: "underline",
                            }}
                            onClick={() => {
                              setCnpjValidacao(estab.cnpj);
                              navigator.clipboard.writeText(estab.cnpj);
                            }}
                          >
                            {estab.cnpj}
                          </span>
                        </p>
                        <p>
                          <strong>Cadastrado por:</strong>{" "}
                          {estab.usuario?.nome || "N/A"}
                        </p>
                        <p>
                          <strong>Email:</strong>{" "}
                          {estab.usuario?.email || "N/A"}
                        </p>
                        <div className="estabelecimento-controls">
                          <span
                            className={`status-badge ${(
                              estab.statusEstabelecimento || "ATIVO"
                            ).toLowerCase()}`}
                          >
                            {estab.statusEstabelecimento || "ATIVO"}
                          </span>
                          <div className="status-change-controls">
                            <select
                              id={`status-select-${estab.id}`}
                              defaultValue={
                                estab.statusEstabelecimento || "ATIVO"
                              }
                              className="status-select"
                            >
                              <option value="ATIVO">ATIVO</option>
                              <option value="INATIVO">INATIVO</option>
                              <option value="PENDENTE">PENDENTE</option>
                            </select>
                            <button
                              onClick={() => {
                                const select = document.getElementById(
                                  `status-select-${estab.id}`
                                );
                                const novoStatus = select.value;
                                const statusAtual =
                                  estab.statusEstabelecimento || "ATIVO";
                                if (novoStatus !== statusAtual) {
                                  if (
                                    window.confirm(
                                      `Alterar status de ${statusAtual} para ${novoStatus}?`
                                    )
                                  ) {
                                    alterarStatusEstabelecimento(
                                      estab.id,
                                      novoStatus
                                    );
                                  }
                                } else {
                                  alert("Status já é " + statusAtual);
                                }
                              }}
                              className="btn-alterar-status"
                            >
                              Alterar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPaginasEstabelecimentos > 1 && (
                    <div className="paginacao">
                      <button
                        onClick={() =>
                          setPaginaEstabelecimentos((prev) =>
                            Math.max(prev - 1, 1)
                          )
                        }
                        disabled={paginaEstabelecimentos === 1}
                        className="paginacao-btn"
                      >
                        ← Anterior
                      </button>
                      <span className="paginacao-info">
                        Página {paginaEstabelecimentos} de{" "}
                        {totalPaginasEstabelecimentos}
                      </span>
                      <button
                        onClick={() =>
                          setPaginaEstabelecimentos((prev) =>
                            Math.min(prev + 1, totalPaginasEstabelecimentos)
                          )
                        }
                        disabled={
                          paginaEstabelecimentos ===
                          totalPaginasEstabelecimentos
                        }
                        className="paginacao-btn"
                      >
                        Próxima →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p style={{ color: "#a0aec0", fontStyle: "italic" }}>
                  Nenhum estabelecimento cadastrado
                </p>
              )}
            </div>

            {resultadoCNPJ && (
              <div
                className={`cnpj-resultado ${
                  resultadoCNPJ.valido ? "valido" : "invalido"
                }`}
              >
                {resultadoCNPJ.valido ? (
                  <div>
                    <h4>✅ CNPJ Válido</h4>
                    <p>
                      <strong>Razão Social:</strong>{" "}
                      {resultadoCNPJ.dados.razaoSocial}
                    </p>
                    <p>
                      <strong>Nome Fantasia:</strong>{" "}
                      {resultadoCNPJ.dados.nomeFantasia}
                    </p>
                    <p>
                      <strong>É Farmácia:</strong>{" "}
                      {resultadoCNPJ.isFarmacia ? "✅ Sim" : "❌ Não"}
                    </p>
                    <p>
                      <strong>Situação:</strong> {resultadoCNPJ.dados.situacao}
                    </p>
                    <p>
                      <strong>Atividade:</strong>{" "}
                      {resultadoCNPJ.dados.atividade}
                    </p>
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
              <h2 className="section-title">
                Gerenciar Usuários ({usuarios.length})
              </h2>
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
                    <span
                      className={`nivel-badge ${(
                        usuario.nivelAcesso || "USER"
                      ).toLowerCase()}`}
                    >
                      {usuario.nivelAcesso || "USER"}
                    </span>
                  </div>

                  <div className="nivel-acesso-controls">
                    <label>Alterar nível:</label>
                    <select
                      value={usuario.nivelAcesso || "USER"}
                      onChange={(e) =>
                        alterarNivelAcesso(usuario.id, e.target.value)
                      }
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

            {totalPaginasUsuarios > 1 && (
              <div className="paginacao">
                <button
                  onClick={() =>
                    setPaginaUsuarios((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={paginaUsuarios === 1}
                  className="paginacao-btn"
                >
                  ← Anterior
                </button>
                <span className="paginacao-info">
                  Página {paginaUsuarios} de {totalPaginasUsuarios}
                </span>
                <button
                  onClick={() =>
                    setPaginaUsuarios((prev) =>
                      Math.min(prev + 1, totalPaginasUsuarios)
                    )
                  }
                  disabled={paginaUsuarios === totalPaginasUsuarios}
                  className="paginacao-btn"
                >
                  Próxima →
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="debug-info">
          Usuários encontrados: {usuarios.length} | Seu nível: {userType}
        </div>
      </div>
    </div>
  );
}

export default Admin;
