import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/HookLogin";

function CadastroEstabelecimento() {
  const [form, setForm] = useState({
    nomeEstabelecimento: "",
    cnpj: "",
    endereco: "",
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
    if (!form.nomeEstabelecimento.trim())
      novosErros.nomeEstabelecimento = "Nome do estabelecimento é obrigatório.";
    if (!form.cnpj.trim()) novosErros.cnpj = "CNPJ é obrigatório.";
    if (!form.endereco.trim()) novosErros.endereco = "Endereço é obrigatório.";
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
      alert("Cadastro de estabelecimento realizado com sucesso!");
      setForm({
        nomeEstabelecimento: "",
        cnpj: "",
        endereco: "",
        email: "",
        senha: "",
        confirmarSenha: "",
      });
      login();
      navigate("/");
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center py-8 px-2 bg-slate-700">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl text-slate-800 text-center font-bold mb-6 md:mb-8">
          Cadastro de Estabelecimento
        </h1>
        <form
          className="space-y-5 md:space-y-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <label
              htmlFor="nomeEstabelecimento"
              className="block text-sm font-medium text-slate-700"
            >
              Nome do Estabelecimento
            </label>
            <input
              type="text"
              id="nomeEstabelecimento"
              value={form.nomeEstabelecimento}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                erros.nomeEstabelecimento
                  ? "border-red-500"
                  : "border-slate-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Digite o nome do estabelecimento"
            />
            {erros.nomeEstabelecimento && (
              <p className="text-red-500 text-xs mt-1">
                {erros.nomeEstabelecimento}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="cnpj"
              className="block text-sm font-medium text-slate-700"
            >
              CNPJ
            </label>
            <input
              type="text"
              id="cnpj"
              value={form.cnpj}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                erros.cnpj ? "border-red-500" : "border-slate-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Digite o CNPJ"
            />
            {erros.cnpj && (
              <p className="text-red-500 text-xs mt-1">{erros.cnpj}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="endereco"
              className="block text-sm font-medium text-slate-700"
            >
              Endereço
            </label>
            <input
              type="text"
              id="endereco"
              value={form.endereco}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                erros.endereco ? "border-red-500" : "border-slate-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Digite o endereço"
            />
            {erros.endereco && (
              <p className="text-red-500 text-xs mt-1">{erros.endereco}</p>
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
              placeholder="Digite o e-mail"
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
              placeholder="Digite a senha"
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
              placeholder="Confirme a senha"
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
            Cadastrar Estabelecimento
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadastroEstabelecimento;
