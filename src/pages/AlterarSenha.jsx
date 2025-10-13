import React, { useState } from "react";
import "../css/AlterarSenha.css";
import UsuarioService from "../services/UsuarioService";

const ModalAlterarSenha = ({ aberto, onClose, onSucesso }) => {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  if (!aberto) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    
    const logado = UsuarioService.getCurrentUser();
    if (!logado || !logado.id) {
      setErro("Usuário não logado.");
      return;
    }
    
    if (novaSenha.length < 6) {
      setErro("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    
    if (novaSenha !== confirmarNovaSenha) {
      setErro("A confirmação da nova senha não confere.");
      return;
    }
    
    try {
      console.log('Dados enviados:', { id: logado.id, senhaAtual, novaSenha });
      await UsuarioService.alterarSenha(logado.id, senhaAtual, novaSenha);
      setSucesso("Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarNovaSenha("");
      if (onSucesso) onSucesso();
      setTimeout(() => {
        setSucesso("");
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Erro completo:', error);
      console.error('Response:', error.response);
      console.error('Response data:', error.response?.data);
      if (error.response?.status === 400) {
        const mensagemErro = error.response?.data?.message || error.response?.data || "Senha atual incorreta.";
        setErro(mensagemErro);
      } else {
        setErro("Erro ao alterar senha. Tente novamente.");
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Alterar Senha</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-field">
            <label className="modal-label">Senha Atual</label>
            <input
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              className="modal-input"
              required
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Nova Senha</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="modal-input"
              required
              minLength={6}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Confirmar Nova Senha</label>
            <input
              type="password"
              value={confirmarNovaSenha}
              onChange={(e) => setConfirmarNovaSenha(e.target.value)}
              className="modal-input"
              required
            />
          </div>

          {erro && <div className="modal-error">{erro}</div>}
          {sucesso && <div className="modal-success">{sucesso}</div>}

          <div className="modal-buttons">
            <button
              type="button"
              onClick={onClose}
              className="modal-btn modal-btn-cancelar"
            >
              Cancelar
            </button>
            <button type="submit" className="modal-btn modal-btn-confirmar">
              Alterar Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAlterarSenha;
