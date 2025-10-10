import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/HookLogin";
import "../css/Login.css";
import UsuarioService from "../services/UsuarioService";

  function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    lembrar: false,
  });
  const [erro, setErro] = useState("");

  // Na montagem, buscar dados do usuário lembrado no backend
  useEffect(() => {
    const carregarUsuarioLembrado = async () => {
      try {
        const usuario = await UsuarioService.signin();
        if (usuario && usuario.lembrar) {
          setFormData(prev => ({
            ...prev,
            email: usuario.email,
            senha: usuario.senha,
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar usuário lembrado", error);
      }
    };

    carregarUsuarioLembrado();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErro("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const usuario = await UsuarioService.signin(formData.email, formData.senha);

      if (usuario) {
        // Aqui você pode avisar o backend para salvar ou remover a preferência "lembrar"
        if (formData.lembrar) {
          await http.mainInstance.post(API_URL + "usuario/salvar", { email: formData.email });
        } else {
          await http.mainInstance.post(API_URL + "usuario/salvar", { email: formData.email });
        }

        // Salvar dados mínimos no localStorage (sem senha)
        localStorage.setItem("usuarioLogado", JSON.stringify({ email: usuario.email, tipo: usuario.tipo }));

        login(usuario.tipo);
        alert("Login realizado com sucesso!");

        if (usuario.tipo === "estabelecimento") {
          navigate("/painel-estabelecimento");
        } else {
          navigate("/");
        }
      } else {
        setErro("E-mail ou senha incorretos.");
      }
    } catch (error) {
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
