import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaHistory,
  FaCog,
} from "react-icons/fa";
import React, { useEffect, useState } from "react";
import HistoricoAgendamentos from "../components/HistoricoAgendamentos";
import "../css/Perfil.css";
import ModalAlterarSenha from "./AlterarSenha";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [agendamentos, setAgendamentos] = useState([]);
  const [pontosCadastrados, setPontosCadastrados] = useState([]);

  useEffect(() => {
    // Busca o usuário logado no localStorage
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (logado && logado.email && logado.tipo) {
      const chave = logado.tipo === "usuario" ? "usuarios" : "estabelecimentos";
      const lista = JSON.parse(localStorage.getItem(chave)) || [];
      const encontrado = lista.find((item) => item.email === logado.email);
      setUsuario(encontrado ? { ...encontrado, tipo: logado.tipo } : null);

      // Buscar dados específicos baseado no tipo de usuário
      if (logado.tipo === "usuario") {
        // Buscar agendamentos para usuários
        const ags =
          JSON.parse(localStorage.getItem(`agendamentos_${logado.email}`)) ||
          [];
        setAgendamentos(ags);
      } else {
        // Buscar pontos cadastrados para estabelecimentos
        const pontos =
          JSON.parse(localStorage.getItem(`pontos_${logado.email}`)) || [];
        setPontosCadastrados(pontos);
      }
    }
  }, []);

  // Função para cancelar agendamento
  const handleCancelar = (id) => {
    const novos = agendamentos.map((a) =>
      a.id === id ? { ...a, status: "Cancelado" } : a
    );
    setAgendamentos(novos);
    // Atualiza no localStorage
    if (usuario && usuario.email) {
      localStorage.setItem(
        `agendamentos_${usuario.email}`,
        JSON.stringify(novos)
      );
    }
  };

  if (!usuario) {
    return (
      <div className="perfil-container">
        <div className="perfil-content">
          <h2>Usuário não encontrado ou não logado.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <div className="perfil-content">
        {/* Cabeçalho do Perfil */}
        <div className="perfil-header-box">
          <div className="perfil-header-flex">
            <div className="perfil-avatar-area">
              <div className="perfil-avatar">
                <FaUser className="perfil-avatar-icon" />
              </div>
              <button className="perfil-avatar-edit-btn">
                <FaEdit size={16} />
              </button>
            </div>
            <div className="perfil-header-info">
              <h1 className="perfil-header-title">
                {usuario.tipo === "usuario"
                  ? usuario.nome
                  : usuario.nomeEstabelecimento}
              </h1>
              {usuario.tipo === "usuario" ? null : (
                <p className="perfil-header-role">CNPJ: {usuario.cnpj}</p>
              )}
              {/* Pode adicionar mais informações aqui */}
            </div>
          </div>
        </div>

        {/* Grid de Informações + Histórico lado a lado */}
        <div className="perfil-main-grid">
          {/* Informações Pessoais */}
          <div className="perfil-info-box">
            <h2 className="perfil-info-title">
              <FaUser className="perfil-info-icon" />
              Informações Pessoais
            </h2>
            <div className="perfil-info-list">
              <div className="perfil-info-item">
                <FaEnvelope className="perfil-info-icon" />
                <span>{usuario.email}</span>
              </div>
              {/* Telefone não cadastrado, pode adicionar campo no futuro */}
              {usuario.tipo === "estabelecimento" && usuario.cep && (
                <div className="perfil-info-item">
                  <FaMapMarkerAlt className="perfil-info-icon perfil-info-icon-address" />
                  <span>
                    {usuario.endereco} (CEP: {usuario.cep})
                  </span>
                </div>
              )}
              {usuario.tipo === "usuario" && usuario.endereco && (
                <div className="perfil-info-item">
                  <FaMapMarkerAlt className="perfil-info-icon perfil-info-icon-address" />
                  <span>{usuario.endereco}</span>
                </div>
              )}
            </div>
            <button className="perfil-info-edit-btn">
              <FaEdit />
              Editar Informações
            </button>
          </div>

          {/* Histórico de Agendamentos ou Pontos Cadastrados */}
          <div className="perfil-historico-box">
            {usuario.tipo === "usuario" ? (
              <HistoricoAgendamentos
                agendamentos={agendamentos}
                onCancelar={handleCancelar}
              />
            ) : (
              <div className="perfil-pontos-cadastrados">
                <h2 className="perfil-pontos-title">
                  📍 Pontos de Coleta Cadastrados
                </h2>
                {pontosCadastrados.length === 0 ? (
                  <p className="perfil-pontos-empty">
                    Nenhum ponto de coleta cadastrado ainda.
                  </p>
                ) : (
                  <div className="perfil-pontos-list">
                    {pontosCadastrados.map((ponto) => (
                      <div key={ponto.id} className="perfil-ponto-item">
                        <h3 className="perfil-ponto-nome">{ponto.nome}</h3>
                        <p className="perfil-ponto-endereco">
                          {ponto.endereco}
                        </p>
                        <p className="perfil-ponto-telefone">
                          {ponto.telefone}
                        </p>
                        <div className="perfil-ponto-status">
                          <span
                            className={`perfil-ponto-status-badge ${
                              ponto.ativo ? "ativo" : "inativo"
                            }`}
                          >
                            {ponto.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Configurações */}
        <div className="perfil-config-box">
          <h2 className="perfil-config-title">
            <FaCog className="perfil-config-icon" />
            Configurações
          </h2>
          <div className="perfil-config-list">
            <button
              className="perfil-config-btn"
              onClick={() => setModalAberto(true)}
            >
              Alterar Senha
            </button>
            <button className="perfil-config-btn">
              Preferências de Notificação
            </button>
            <button className="perfil-config-btn">Privacidade</button>
            <button className="perfil-config-btn perfil-config-btn-danger">
              Excluir Conta
            </button>
          </div>
        </div>
        <ModalAlterarSenha
          aberto={modalAberto}
          onClose={() => setModalAberto(false)}
        />
      </div>
    </div>
  );
}

export default Perfil;
