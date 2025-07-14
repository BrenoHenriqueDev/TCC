import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/HookLogin";

function CadastroUsuario() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [erros, setErros] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const validar = () => {
    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = "Nome é obrigatório.";
    if (!form.email.trim()) novosErros.email = "E-mail é obrigatório.";
    if (!form.senha) novosErros.senha = "Senha é obrigatória.";
    if (!form.confirmarSenha) novosErros.confirmarSenha = "Confirme a senha.";
    if (
      form.senha &&
      form.confirmarSenha &&
      form.senha !== form.confirmarSenha
    ) {
      novosErros.confirmarSenha = "As senhas não coincidem.";
    }
    return novosErros;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validacao = validar();
    setErros(validacao);
    if (Object.keys(validacao).length === 0) {
      alert("Cadastro realizado com sucesso!");
      setForm({ nome: "", email: "", senha: "", confirmarSenha: "" });
      login();
      navigate("/");
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center py-8 px-2 bg-slate-700">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl text-slate-800 text-center font-bold mb-6 md:mb-8">
          Cadastro de Usuário
        </h1>
        <form
          className="space-y-5 md:space-y-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-slate-700"
            >
              Nome Completo
            </label>
            <input
              type="text"
              id="nome"
              value={form.nome}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                erros.nome ? "border-red-500" : "border-slate-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Digite seu nome completo"
            />
            {erros.nome && (
              <p className="text-red-500 text-xs mt-1">{erros.nome}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                erros.email ? "border-red-500" : "border-slate-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Digite seu e-mail"
            />
            {erros.email && (
              <p className="text-red-500 text-xs mt-1">{erros.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-slate-700"
            >
              Senha
            </label>
            <input
              type="password"
              id="senha"
              value={form.senha}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                erros.senha ? "border-red-500" : "border-slate-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Digite sua senha"
            />
            {erros.senha && (
              <p className="text-red-500 text-xs mt-1">{erros.senha}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmarSenha"
              className="block text-sm font-medium text-slate-700"
            >
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmarSenha"
              value={form.confirmarSenha}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                erros.confirmarSenha ? "border-red-500" : "border-slate-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Confirme sua senha"
            />
            {erros.confirmarSenha && (
              <p className="text-red-500 text-xs mt-1">
                {erros.confirmarSenha}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadastroUsuario;