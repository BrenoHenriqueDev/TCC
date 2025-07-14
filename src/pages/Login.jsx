import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/HookLogin";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    lembrar: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de autenticação real
    console.log("Dados do login:", formData);

    // Simulando um login bem-sucedido
    login(); // Atualiza o estado de autenticação
    alert("Login realizado com sucesso!");
    navigate("/"); // Redireciona para a home
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center py-8 px-2 bg-slate-700">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl text-slate-800 text-center font-bold mb-6 md:mb-8">
          Login
        </h1>

        <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite seu e-mail"
              required
            />
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
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="lembrar"
                name="lembrar"
                type="checkbox"
                checked={formData.lembrar}
                onChange={handleChange}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label
                htmlFor="lembrar"
                className="ml-2 block text-sm text-slate-700"
              >
                Lembrar-me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="/esqueci-senha"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Não tem uma conta?{" "}
          <a
            href="/cadastro"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;