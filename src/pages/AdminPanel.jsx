import { useState, useEffect } from "react";
import UsuarioService from "../services/UsuarioService";
import "../css/AdminPanel.css";

function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await UsuarioService.findAll();
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const alterarNivelAcesso = async (userId, novoNivel) => {
    try {
      await UsuarioService.updateNivelAcesso(userId, novoNivel);
      alert("Nível de acesso alterado com sucesso!");
      carregarUsuarios();
    } catch (error) {
      console.error("Erro ao alterar nível:", error);
      alert("Erro ao alterar nível de acesso");
    }
  };

  if (loading) return <div className="admin-loading">Carregando...</div>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Painel Administrativo</h1>
      <h2 className="admin-subtitle">Gerenciar Níveis de Acesso</h2>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Nível Atual</th>
              <th>Alterar Para</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>
                  <span className={`nivel-badge ${usuario.nivelAcesso?.toLowerCase()}`}>
                    {usuario.nivelAcesso || 'USER'}
                  </span>
                </td>
                <td>
                  <select
                    value={usuario.nivelAcesso || 'USER'}
                    onChange={(e) => alterarNivelAcesso(usuario.id, e.target.value)}
                    className="admin-select"
                  >
                    <option value="USER">USER</option>
                    <option value="ESTABELECIMENTO">ESTABELECIMENTO</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;