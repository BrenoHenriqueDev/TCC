import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/HookLogin";
import "../css/CadastroUnificado.css";
import UsuarioService from '../services/UsuarioService.js';

function CadastroUnificado() {
  const [tipoCadastro] = useState("usuario"); // apenas "usuario"
  const [form, setForm] = useState({
    nome: "",
    nomeEstabelecimento: "",
    cnpj: "",
    endereco: "",
    cep: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [erros, setErros] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  // Função para buscar endereço pelo CEP
  const buscarEnderecoPorCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        const enderecoCompleto = `${data.logradouro || ''}, ${data.bairro || ''}, ${data.localidade || ''} - ${data.uf || ''}`;
        setForm((prev) => ({ ...prev, endereco: enderecoCompleto }));
      }
    } catch  {
      alert("CEP não encontrado");
    }
  };

  // Atualiza o campo e busca endereço se for o CEP
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (id === "cep" && (value.length === 8 || value.length === 9)) {
      buscarEnderecoPorCep(value);
    }
  };

  // Validação de e-mail
  const emailValido = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Verifica se o e-mail já está cadastrado para o tipo
  const emailJaCadastrado = (email, tipo) => {
    const chave = tipo === "usuario" ? "usuarios" : "estabelecimentos";
    const lista = JSON.parse(localStorage.getItem(chave)) || [];
    return lista.some((item) => item.email === email);
  };

  const validar = () => {
    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = "Nome é obrigatório.";
    if (!form.email.trim()) novosErros.email = "E-mail é obrigatório.";
    else if (!emailValido(form.email)) novosErros.email = "E-mail inválido.";
    else if (emailJaCadastrado(form.email, tipoCadastro)) novosErros.email = "E-mail já cadastrado.";
    if (!form.senha) novosErros.senha = "Senha é obrigatória.";
    else if (form.senha.length < 6) novosErros.senha = "Senha deve ter pelo menos 6 caracteres.";
    if (!form.confirmarSenha) novosErros.confirmarSenha = "Confirme a senha.";
    if (form.senha && form.confirmarSenha && form.senha !== form.confirmarSenha) {
      novosErros.confirmarSenha = "As senhas não coincidem.";
    }
    return novosErros;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validacao = validar();
  setErros(validacao);
  if (Object.keys(validacao).length === 0) {
    try {
      const response = await UsuarioService.signup(form.nome, form.email, form.senha, { nivelAcesso: 'USER' });
      const userData = response.data;
      localStorage.setItem("usuarioLogado", JSON.stringify(userData));
      alert("Cadastro realizado com sucesso!");
      login(userData.nivelAcesso || 'USER');
      navigate("/");
      limparFormulario();
    } catch (error) {
      alert("Erro ao realizar cadastro. Tente novamente.");
      console.error(error);
    }
  }
};


  const limparFormulario = () => {
    setForm({
      nome: "",
      nomeEstabelecimento: "",
      cnpj: "",
      endereco: "",
      cep: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    });
    setErros({});
  };

  return (
    <div className="cadastro-unificado-container">
      <div className="cadastro-unificado-box">
        <h1 className="cadastro-unificado-title">Cadastro</h1>

        {/* Título único */}
        <div className="cadastro-unificado-header">
          <h2>Cadastro de Usuário</h2>
        </div>

        {/* Subtítulo */}
        <p className="cadastro-unificado-subtitle">
          Preencha seus dados para se cadastrar
        </p>

        {/* Formulário */}
        <form
          className="cadastro-unificado-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <label htmlFor="nome" className="cadastro-unificado-label">
              Nome Completo
            </label>
            <input
              type="text"
              id="nome"
              value={form.nome}
              onChange={handleChange}
              className={`cadastro-unificado-input${
                erros.nome ? " cadastro-unificado-input-error" : ""
              }`}
              placeholder="Digite seu nome completo"
            />
            {erros.nome && (
              <p className="cadastro-unificado-error">{erros.nome}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="cadastro-unificado-label">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              className={`cadastro-unificado-input${
                erros.email ? " cadastro-unificado-input-error" : ""
              }`}
              placeholder="Digite seu e-mail"
            />
            {erros.email && (
              <p className="cadastro-unificado-error">{erros.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="senha" className="cadastro-unificado-label">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              value={form.senha}
              onChange={handleChange}
              className={`cadastro-unificado-input${
                erros.senha ? " cadastro-unificado-input-error" : ""
              }`}
              placeholder="Digite sua senha"
            />
            {erros.senha && (
              <p className="cadastro-unificado-error">{erros.senha}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmarSenha"
              className="cadastro-unificado-label"
            >
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmarSenha"
              value={form.confirmarSenha}
              onChange={handleChange}
              className={`cadastro-unificado-input${
                erros.confirmarSenha ? " cadastro-unificado-input-error" : ""
              }`}
              placeholder="Confirme sua senha"
            />
            {erros.confirmarSenha && (
              <p className="cadastro-unificado-error">{erros.confirmarSenha}</p>
            )}
          </div>

          <button type="submit" className="cadastro-unificado-btn">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadastroUnificado;
