import { useState, useEffect } from "react";
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
  const [erro, setErro] = useState("");

  // Carregar e-mail e senha salvos quando a página carrega
  useEffect(() => {
    const emailSalvo = localStorage.getItem("emailLembrado");
    const senhaSalva = localStorage.getItem("senhaLembrada");
    const lembrarSalvo = localStorage.getItem("lembrarUsuario");
    
    if (emailSalvo && senhaSalva && lembrarSalvo === "true") {
      setFormData(prev => ({
        ...prev,
        email: emailSalvo,
        senha: senhaSalva,
        lembrar: true
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErro("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");
    // Busca o usuário em ambos os tipos
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const estabelecimentos = JSON.parse(localStorage.getItem("estabelecimentos")) || [];
    const usuario = usuarios.find((u) => u.email === formData.email);
    const estabelecimento = estabelecimentos.find((e) => e.email === formData.email);
    let encontrado = null;
    let tipo = null;
    if (usuario && usuario.senha === formData.senha) {
      encontrado = usuario;
      tipo = "usuario";
    } else if (estabelecimento && estabelecimento.senha === formData.senha) {
      encontrado = estabelecimento;
      tipo = "estabelecimento";
    }
    if (encontrado) {
      // Salvar ou remover e-mail e senha baseado na opção "lembrar-me"
      if (formData.lembrar) {
        localStorage.setItem("emailLembrado", formData.email);
        localStorage.setItem("senhaLembrada", formData.senha);
        localStorage.setItem("lembrarUsuario", "true");
      } else {
        localStorage.removeItem("emailLembrado");
        localStorage.removeItem("senhaLembrada");
        localStorage.removeItem("lembrarUsuario");
      }

      // Salva o usuário logado
      localStorage.setItem("usuarioLogado", JSON.stringify({ email: encontrado.email, tipo }));
      login(tipo); // Atualiza o estado de autenticação
      alert("Login realizado com sucesso!");
      if (tipo === "estabelecimento") {
        navigate("/painel-estabelecimento");
      } else {
        navigate("/");
      }
    } else {
      setErro("E-mail ou senha incorretos.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {erro && (
            <div style={{ color: 'red', marginBottom: 8 }}>{erro}</div>
          )}
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
