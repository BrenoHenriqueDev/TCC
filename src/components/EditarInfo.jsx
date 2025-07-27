import React, { useState, useEffect } from "react";
import "../css/EditarInfo.css";

const ModalEditarInfo = ({ aberto, usuario, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  // Preenche os campos com os dados atuais do usuário
  useEffect(() => {
    if (usuario) {
      setFormData({
        nome: usuario.nome || usuario.nomeEstabelecimento || "",
        email: usuario.email || "",
        telefone: usuario.telefone || "",
        endereco: usuario.endereco || "",
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const tipo = usuario.tipo;
    const chave = tipo === "usuario" ? "usuarios" : "estabelecimentos";
    const lista = JSON.parse(localStorage.getItem(chave)) || [];

    // Atualiza os dados no array
    const atualizado = lista.map((item) =>
      item.email === usuario.email
        ? {
            ...item,
            // Se for usuário comum
            nome: tipo === "usuario" ? formData.nome : item.nome,
            // Se for estabelecimento
            nomeEstabelecimento:
              tipo === "estabelecimento"
                ? formData.nome
                : item.nomeEstabelecimento,
            telefone: formData.telefone,
            endereco: formData.endereco,
            email: formData.email,
          }
        : item
    );

    // Salva no localStorage atualizado
    localStorage.setItem(chave, JSON.stringify(atualizado));

    // Atualiza o usuarioLogado também
    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify({
        email: formData.email,
        tipo: tipo,
      })
    );

    // Envia para o Perfil.jsx atualizar
    onSave({
      ...usuario,
      nome: tipo === "usuario" ? formData.nome : usuario.nome,
      nomeEstabelecimento:
        tipo === "estabelecimento"
          ? formData.nome
          : usuario.nomeEstabelecimento,
      telefone: formData.telefone,
      endereco: formData.endereco,
      email: formData.email,
    });

    onClose();
  };

  if (!aberto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Informações</h2>
        <form onSubmit={handleSubmit}>
          <label>Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Telefone</label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
          />

          <label>Endereço</label>
          <input
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancelar">
              Cancelar
            </button>
            <button type="submit" className="salvar">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarInfo;
