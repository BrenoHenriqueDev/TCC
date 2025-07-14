import { Link } from "react-router-dom";
import { usePage } from "../Hooks/HookHeader";
import { useAuth } from "../hooks/HookLogin";
import logo from "../Imagens/logo.png";
import fundo from "../Imagens/fundo.png";

export default function Header() {
  const { isCurrentPage } = usePage();
  const { isAuthenticated, logout, userType } = useAuth();

  const general = "text-slate-700 hover:text-white transition-colors";
  const current = "text-white font-bold";

  return (
    <header
      className="w-full shadow sticky top-0 z-50 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-0 py-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="VenceMed Logo" className="h-15 w-auto" />
          <h1 className="text-white font-extrabold text-2xl select-none cursor-default">
            VenceMed
          </h1>
        </div>
        <nav className="flex gap-8 text-lg">
          <Link to="/" className={isCurrentPage("/") ? current : general}>
            Home
          </Link>
          {userType === "normal" && (
            <>
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
            </>
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
            <>
              <Link
                to="/perfil"
                className={isCurrentPage("/perfil") ? current : general}
              >
                Perfil
              </Link>
              <button onClick={logout} className={general}>
                Sair
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}