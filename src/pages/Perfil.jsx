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
import ModalEditarInfo from "../components/EditarInfo";
import ModalExcluirConta from "../components/ExcluirConta";
import UsuarioService from "../services/UsuarioService";
import MensagemService from "../services/MensagemService";
import EstabelecimentoService from "../services/EstabelecimentoService";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [modalAberto, setModalAberto] = useState(null);
  const [farmaciaForm, setFarmaciaForm] = useState({
    nomeFantasia: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    justificativa: ''
  });
  const [loadingFarmacia, setLoadingFarmacia] = useState(false);
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

  const handleSolicitarFarmacia = async (e) => {
    e.preventDefault();
    setLoadingFarmacia(true);
    
    try {
      const estabelecimentoData = {
        nome: farmaciaForm.nomeFantasia,
        cnpj: farmaciaForm.cnpj,
        endereco: farmaciaForm.endereco,
        telefone: farmaciaForm.telefone,
        justificativa: farmaciaForm.justificativa,
        status: 'PENDENTE'
      };
      
      await EstabelecimentoService.cadastrar(usuario.id, estabelecimentoData);
      alert('Solicitação enviada com sucesso! Aguarde a análise do administrador.');
      setModalAberto(null);
      setFarmaciaForm({
        nomeFantasia: '',
        cnpj: '',
        endereco: '',
        telefone: '',
        justificativa: ''
      });
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      alert('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setLoadingFarmacia(false);
    }
  };

  const handleDelete = async () => {
    // Torne a função assíncrona
    if (!usuario || !usuario.id) {
      console.error("ID do usuário não encontrado para exclusão na API.");
      setModalAberto(null);
      return;
    }
    try {
      await UsuarioService.remove(usuario.id);

      const chave =
        usuario.tipo === "usuario" ? "usuarios" : "estabelecimentos";
      const lista = JSON.parse(localStorage.getItem(chave)) || [];

      // Remove o usuário atual da lista
      const novaLista = lista.filter((u) => u.email !== usuario.email);
      localStorage.setItem(chave, JSON.stringify(novaLista));

      // Remove agendamentos ou pontos cadastrados
      if (usuario.tipo === "usuario") {
        localStorage.removeItem(`agendamentos_${usuario.email}`);
      } else {
        localStorage.removeItem(`pontos_${usuario.email}`);
      }

      // Remove o login atual
      localStorage.removeItem("usuarioLogado");

      // Fecha o modal
      setModalAberto(null);

      alert("Conta excluída com sucesso!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Erro ao excluir conta via API:", error);
      alert("Falha ao excluir a conta. Tente novamente.");
      setModalAberto(null); // Fecha o modal em caso de falha
    }
  };

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
            <button
              className="perfil-info-edit-btn"
              onClick={() => setModalAberto("editarInfo")}
            >
              <FaEdit />
              Editar Informações
            </button>
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
            {usuario.nivelAcesso === "USER" && (
              <button
                className="perfil-config-btn"
                onClick={() => setModalAberto("solicitarFarmacia")}
              >
                Solicitar Permissão de Farmácia
              </button>
            )}
            <button
              className="perfil-config-btn perfil-config-btn-danger"
              onClick={() => setModalAberto("excluirConta")}
            >
              Excluir Conta
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

      {modalAberto === "editarInfo" && (
        <ModalEditarInfo
          aberto={true}
          usuario={usuario}
          onClose={() => setModalAberto(false)}
          onSave={async (dadosAtualizados) => {
            try {
              await UsuarioService.update(usuario.id, dadosAtualizados);
              // Recarrega os dados atualizados da API
              const dadosAtualizadosAPI = await UsuarioService.findById(usuario.id);
              setUsuario(dadosAtualizadosAPI);
              setModalAberto(null);
            } catch (error) {
              console.error("Erro ao atualizar usuário:", error);
            }
          }}
        />
      )}

      {modalAberto === "excluirConta" && (
        <ModalExcluirConta
          isOpen={true}
          onConfirm={handleDelete}
          onCancel={() => setModalAberto(null)}
        />
      )}

      {modalAberto === "solicitarFarmacia" && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '600px'}}>
            <h3>Solicitar Permissão de Farmácia</h3>
            <form onSubmit={handleSolicitarFarmacia}>
              <div className="form-group">
                <label>Nome Fantasia *</label>
                <input
                  type="text"
                  value={farmaciaForm.nomeFantasia}
                  onChange={(e) => setFarmaciaForm({...farmaciaForm, nomeFantasia: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>CNPJ *</label>
                <input
                  type="text"
                  value={farmaciaForm.cnpj}
                  onChange={(e) => setFarmaciaForm({...farmaciaForm, cnpj: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Endereço *</label>
                <input
                  type="text"
                  value={farmaciaForm.endereco}
                  onChange={(e) => setFarmaciaForm({...farmaciaForm, endereco: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Telefone *</label>
                <input
                  type="tel"
                  value={farmaciaForm.telefone}
                  onChange={(e) => setFarmaciaForm({...farmaciaForm, telefone: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Justificativa *</label>
                <textarea
                  rows="4"
                  value={farmaciaForm.justificativa}
                  onChange={(e) => setFarmaciaForm({...farmaciaForm, justificativa: e.target.value})}
                  placeholder="Explique por que deseja se tornar uma farmácia parceira..."
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => setModalAberto(null)}>Cancelar</button>
                <button type="submit" disabled={loadingFarmacia}>
                  {loadingFarmacia ? 'Enviando...' : 'Enviar Solicitação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  //   </div>
}

export default Perfil;
