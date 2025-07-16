import { Link } from "react-router-dom";
import { usePage } from "../Hooks/HookHeader";
import { useAuth } from "../hooks/HookLogin";
import logo from "../Imagens/logo.png";
import fundo from "../Imagens/fundo.png";
import "../css/Header.css";

export default function Header() {
  const { isCurrentPage } = usePage();
  const { isAuthenticated, logout, userType } = useAuth();

  const general = "header-link";
  const current = "header-link-current";

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
          <Link to="/" className={isCurrentPage("/") ? current : general}>
            Home
          </Link>
          <Link
            to="/educacao"
            className={isCurrentPage("/educacao") ? current : general}
          >
            Seção Educativa
          </Link>
          <Link
            to="/dicas"
            className={isCurrentPage("/dicas") ? current : general}
          >
            Dicas de Armazenamento
          </Link>
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
            <>
              <Link
                to="/perfil"
                className={isCurrentPage("/perfil") ? current : general}
              >
                Perfil
              </Link>
              <button onClick={logout} className="header-logout-btn">
                Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}