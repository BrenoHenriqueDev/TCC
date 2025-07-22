import React, { useState } from "react";
import "../css/AlterarSenha.css";

const ModalAlterarSenha = ({ aberto, onClose, onSucesso }) => {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  if (!aberto) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    // Busca usuário logado
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!logado) {
      setErro("Usuário não logado.");
      return;
    }
    const chave = logado.tipo === "usuario" ? "usuarios" : "estabelecimentos";
    const lista = JSON.parse(localStorage.getItem(chave)) || [];
    const idx = lista.findIndex((item) => item.email === logado.email);
    if (idx === -1) {
      setErro("Usuário não encontrado.");
      return;
    }
    if (lista[idx].senha !== senhaAtual) {
      setErro("Senha atual incorreta.");
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
    // Atualiza a senha
    lista[idx].senha = novaSenha;
    localStorage.setItem(chave, JSON.stringify(lista));
    setSucesso("Senha alterada com sucesso!");
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarNovaSenha("");
    if (onSucesso) onSucesso();
    setTimeout(() => {
      setSucesso("");
      onClose();
    }, 1500);
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
