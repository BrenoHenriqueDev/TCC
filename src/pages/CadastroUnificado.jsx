import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/HookLogin";
import "../css/CadastroUnificado.css";

function CadastroUnificado() {
  const [tipoCadastro, setTipoCadastro] = useState("usuario"); // "usuario" ou "estabelecimento"
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
    } catch (error) {
      // Não faz nada se der erro
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
    if (tipoCadastro === "usuario") {
      if (!form.nome.trim()) novosErros.nome = "Nome é obrigatório.";
    } else if (tipoCadastro === "estabelecimento") {
      if (!form.nomeEstabelecimento.trim())
        novosErros.nomeEstabelecimento = "Nome do estabelecimento é obrigatório.";
      if (!form.cnpj.trim()) novosErros.cnpj = "CNPJ é obrigatório.";
      else if (form.cnpj.replace(/\D/g, '').length !== 14) novosErros.cnpj = "CNPJ deve ter 14 dígitos.";
      if (!form.endereco.trim()) novosErros.endereco = "Endereço é obrigatório.";
      if (!form.cep.trim()) novosErros.cep = "CEP é obrigatório.";
    }
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

  // Salva o cadastro no localStorage
  const salvarCadastro = () => {
    const chave = tipoCadastro === "usuario" ? "usuarios" : "estabelecimentos";
    const lista = JSON.parse(localStorage.getItem(chave)) || [];
    const novoCadastro = { ...form };
    lista.push(novoCadastro);
    localStorage.setItem(chave, JSON.stringify(lista));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validacao = validar();
    setErros(validacao);
    if (Object.keys(validacao).length === 0) {
      salvarCadastro();
      // Salva o e-mail e tipo do usuário logado
      localStorage.setItem("usuarioLogado", JSON.stringify({ email: form.email, tipo: tipoCadastro }));
      const mensagem =
        tipoCadastro === "usuario"
          ? "Cadastro de usuário realizado com sucesso!"
          : "Cadastro de estabelecimento realizado com sucesso!";
      alert(mensagem);
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
      login();
      if (tipoCadastro === "estabelecimento") {
        navigate("/painel-estabelecimento");
      } else {
        navigate("/");
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

        {/* Abas */}
        <div className="cadastro-unificado-tabs">
          <button
            className={`cadastro-unificado-tab ${
              tipoCadastro === "usuario" ? "active" : ""
            }`}
            onClick={() => {
              setTipoCadastro("usuario");
              limparFormulario();
            }}
          >
            Cadastro de Usuário
          </button>
          <button
            className={`cadastro-unificado-tab ${
              tipoCadastro === "estabelecimento" ? "active" : ""
            }`}
            onClick={() => {
              setTipoCadastro("estabelecimento");
              limparFormulario();
            }}
          >
            Cadastro de Estabelecimento
          </button>
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
          {tipoCadastro === "usuario" ? (
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
          ) : (
            <>
              <div>
                <label
                  htmlFor="nomeEstabelecimento"
                  className="cadastro-unificado-label"
                >
                  Nome do Estabelecimento
                </label>
                <input
                  type="text"
                  id="nomeEstabelecimento"
                  value={form.nomeEstabelecimento}
                  onChange={handleChange}
                  className={`cadastro-unificado-input${
                    erros.nomeEstabelecimento
                      ? " cadastro-unificado-input-error"
                      : ""
                  }`}
                  placeholder="Digite o nome do estabelecimento"
                />
                {erros.nomeEstabelecimento && (
                  <p className="cadastro-unificado-error">
                    {erros.nomeEstabelecimento}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="cnpj" className="cadastro-unificado-label">
                  CNPJ
                </label>
                <input
                  type="text"
                  id="cnpj"
                  value={form.cnpj}
                  onChange={handleChange}
                  className={`cadastro-unificado-input${
                    erros.cnpj ? " cadastro-unificado-input-error" : ""
                  }`}
                  placeholder="Digite o CNPJ"
                />
                {erros.cnpj && (
                  <p className="cadastro-unificado-error">{erros.cnpj}</p>
                )}
              </div>
              <div>
                <label htmlFor="cep" className="cadastro-unificado-label">
                  CEP
                </label>
                <input
                  type="text"
                  id="cep"
                  value={form.cep}
                  onChange={handleChange}
                  className={`cadastro-unificado-input${
                    erros.cep ? " cadastro-unificado-input-error" : ""
                  }`}
                  placeholder="Digite o CEP"
                  maxLength={9}
                />
                {erros.cep && (
                  <p className="cadastro-unificado-error">{erros.cep}</p>
                )}
              </div>
              <div>
                <label htmlFor="endereco" className="cadastro-unificado-label">
                  Endereço
                </label>
                <input
                  type="text"
                  id="endereco"
                  value={form.endereco}
                  onChange={handleChange}
                  className={`cadastro-unificado-input${
                    erros.endereco ? " cadastro-unificado-input-error" : ""
                  }`}
                  placeholder="Digite o endereço"
                />
                {erros.endereco && (
                  <p className="cadastro-unificado-error">{erros.endereco}</p>
                )}
              </div>
            </>
          )}

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
            {tipoCadastro === "usuario"
              ? "Cadastrar Usuário"
              : "Cadastrar Estabelecimento"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadastroUnificado;
