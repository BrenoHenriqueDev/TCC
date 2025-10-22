import { Link, useNavigate } from "react-router-dom";
import { usePage } from "../Hooks/HookHeader";
import { useAuth } from "../hooks/HookLogin";
import logo from "../Imagens/logo.png";
import fundo from "../Imagens/fundo.png";
import "../css/Header.css";

export default function Header() {
  const { isCurrentPage } = usePage();
  const { isAuthenticated, logout, userType } = useAuth();
  const navigate = useNavigate();

  // Verificar tipo de usuário logado
  const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const isFarmacia = userType === "FARMACIA";
  const isAdmin = userType === "ADMIN";

  const general = "header-link";
  const current = "header-link-current";

  const handleHomeClick = () => {
    if (isFarmacia) {
      navigate("/painel-estabelecimento");
    } else if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <header
      className="header-container"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      <div className="header-content">
        <div className="header-logo-area">
          <img src={logo} alt="VenceMed Logo" className="header-logo" />
          <h1 className="header-title">
            VenceMed
          </h1>
        </div>
        <nav className="header-nav">
          <button 
            onClick={handleHomeClick}
            className={isCurrentPage("/") || isCurrentPage("/painel-estabelecimento") || isCurrentPage("/admin") ? current : general}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }}
          >
            Home
          </button>
          {/* Mostrar links educativos apenas para usuários não logados ou usuários comuns */}
          {!isFarmacia && !isAdmin && (
            <>
              <Link
                to="/educacao"
                className={isCurrentPage("/educacao") ? current : general}
              >
                Por que Descartar corretamente?
              </Link>
              <Link
                to="/dicas"
                className={isCurrentPage("/dicas") ? current : general}
              >
                Dicas de Armazenamento
              </Link>
            </>
          )}
          {isAdmin && (
            <Link
              to="/mensagens"
              className={isCurrentPage("/mensagens") ? current : general}
            >
              Mensagens
            </Link>
          )}
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className={isCurrentPage("/login") ? current : general}
              >
                Login
              </Link>
              <Link
                to="/cadastro"
                className={isCurrentPage("/cadastro") ? current : general}
              >
                Cadastro
              </Link>
            </>
          ) : (
            <Link
              to="/perfil"
              className={isCurrentPage("/perfil") ? current : general}
            >
              Perfil
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}