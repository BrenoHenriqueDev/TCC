import { createContext, useContext, useState } from "react";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // 'normal' ou 'estabelecimento'

  const login = (type = "normal") => {
    setIsAuthenticated(true);
    setUserType(type);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    // Limpar dados do usuário logado do localStorage
    localStorage.removeItem("usuarioLogado");
    // Redirecionar para a Home após logout
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userType, login, logout, setUserType }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
