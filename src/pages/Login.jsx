import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/HookLogin";
import "../css/Login.css";

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
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="login-label">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              placeholder="Digite seu e-mail"
              required
            />
          </div>

          <div>
            <label htmlFor="senha" className="login-label">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="login-input"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <div className="login-options">
            <div className="login-remember">
              <input
                id="lembrar"
                name="lembrar"
                type="checkbox"
                checked={formData.lembrar}
                onChange={handleChange}
                className="login-checkbox"
              />
              <label htmlFor="lembrar" className="login-label-remember">
                Lembrar-me
              </label>
            </div>

            <div className="login-forgot">
              <a href="/esqueci-senha" className="login-link">
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <button type="submit" className="login-btn">
            Entrar
          </button>
        </form>

        <p className="login-register">
          Não tem uma conta?{" "}
          <Link to="/cadastro" className="login-link">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
