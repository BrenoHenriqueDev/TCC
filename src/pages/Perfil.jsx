import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaCog,
} from "react-icons/fa";
import React, { useEffect, useState } from "react";
import HistoricoAgendamentos from "../components/HistoricoAgendamentos";
import PontosColeta from "../components/PontosColeta";
import "../css/Perfil.css";
import ModalAlterarSenha from "./AlterarSenha";


import UsuarioService from "../services/UsuarioService";
import SolicitarFarmacia from "../components/SolicitarFarmacia";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [modalAberto, setModalAberto] = useState(null);

  // const [agendamentos, setAgendamentos] = useState([]);
  //const [pontosCadastrados, setPontosCadastrados] = useState([]);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        // 1. Renomeie para evitar conflito com o estado 'usuario'
        const usuarioLogado = UsuarioService.getCurrentUser();

        if (usuarioLogado && usuarioLogado.id) {
          // 2. CORREÇÃO CRÍTICA: Use o 'await' para esperar a resposta da API
          const dados = await UsuarioService.findById(usuarioLogado.id); // <-- AGORA COM 'await'

          setUsuario(dados); // 'dados' agora é o objeto real do usuário
        } else {
          console.warn("Usuário não logado.");
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    };

    fetchUsuario();
  }, []);





  return !usuario ? (
    <div className="loading-screen">
      <h1>Carregando...</h1>
    </div>
  ) : (
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
                  : usuario.estabelecimento}
              </h1>
              {usuario.tipo === "usuario" ? null : (
                <h1 className="perfil-header-role">{usuario.nome}</h1>
              )}
              {usuario.nivelAcesso === "USER" && (
                <button
                  className="solicitar-farmacia-btn"
                  onClick={() => setModalAberto("solicitarFarmacia")}
                >
                  Solicitar Permissão de Farmácia
                </button>
              )}
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
              {usuario.telefone && (
                <div className="perfil-info-item">
                  <FaPhone className="perfil-info-icon" />
                  <span>{usuario.telefone}</span>
                </div>
              )}
            </div>
            <div>
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

          </div>

          {/* Histórico de Agendamentos */}
          <div className="perfil-historico-box">
            {usuario.nivelAcesso === "USER" ? (
              <HistoricoAgendamentos />
            ) : (
              <PontosColeta />
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
              onClick={() => setModalAberto("alterarSenha")}
            >
              Alterar Senha
            </button>

            <button
              className="perfil-config-btn perfil-config-btn-danger"
              onClick={() => {
                UsuarioService.logout();
                window.location.href = "/login";
              }}
            >
              Sair da Conta
            </button>
          </div>
        </div>
      </div>

      {modalAberto === "alterarSenha" && (
        <ModalAlterarSenha
          aberto={true}
          onClose={() => setModalAberto(null)}
          onSucesso={() => {
            console.log("Senha alterada com sucesso!");
            setModalAberto(null);
          }}
        />
      )}





      {modalAberto === "solicitarFarmacia" && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '700px', maxHeight: '90vh', overflow: 'auto'}}>
            <button 
              onClick={() => setModalAberto(null)}
              style={{float: 'right', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer'}}
            >
              ×
            </button>
            <SolicitarFarmacia />
          </div>
        </div>
      )}
    </div>
  );
  //   </div>
}

export default Perfil;
