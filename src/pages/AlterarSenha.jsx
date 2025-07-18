import React, { useState } from "react";

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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          minWidth: 320,
          boxShadow: "0 2px 16px #0002",
        }}
      >
        <h2>Alterar Senha</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Senha atual</label>
            <input
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Nova senha</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              style={{ width: "100%" }}
              required
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Confirmar nova senha</label>
            <input
              type="password"
              value={confirmarNovaSenha}
              onChange={(e) => setConfirmarNovaSenha(e.target.value)}
              style={{ width: "100%" }}
              required
            />
          </div>
          {erro && <div style={{ color: "red", marginBottom: 8 }}>{erro}</div>}
          {sucesso && (
            <div style={{ color: "green", marginBottom: 8 }}>{sucesso}</div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#eee",
                border: "none",
                padding: "6px 16px",
                borderRadius: 4,
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                background: "#007bff",
                color: "#fff",
                border: "none",
                padding: "6px 16px",
                borderRadius: 4,
              }}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAlterarSenha;
