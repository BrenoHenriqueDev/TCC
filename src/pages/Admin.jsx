import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/HookLogin";
import { useNavigate } from "react-router-dom";
import UsuarioService from "../services/UsuarioService";
import CNPJService from "../services/CNPJService";
import "../css/Admin.css";

function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [cnpjValidacao, setCnpjValidacao] = useState("");
  const [resultadoCNPJ, setResultadoCNPJ] = useState(null);
  const [validandoCNPJ, setValidandoCNPJ] = useState(false);
  const { userType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userType !== "ADMIN") {
      navigate("/");
      return;
    }
    carregarUsuarios();
  }, [userType, navigate]);

  const carregarUsuarios = async () => {
    try {
      const usuarioLogado = UsuarioService.getCurrentUser();
      
      if (!usuarioLogado || !usuarioLogado.id) {
        alert("Erro: Usuário não encontrado. Faça login novamente.");
        navigate("/login");
        return;
      }
      
      const data = await UsuarioService.findAllByAdmin(usuarioLogado.id);
      setUsuarios(data || []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      if (error.response?.status === 403) {
        alert("Acesso negado: Apenas ADMIN pode listar usuários.");
        navigate("/");
      } else {
        alert("Erro ao carregar usuários");
      }
    } finally {
      setLoading(false);
    }
  };

  const alterarNivelAcesso = async (usuarioId, novoNivel) => {
    try {
      const usuarioLogado = UsuarioService.getCurrentUser();
      
      await UsuarioService.updateNivelAcesso(usuarioLogado.id, usuarioId, novoNivel);
      alert("Nível alterado com sucesso!");
      carregarUsuarios();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao alterar nível");
    }
  };

  const validarCNPJFarmacia = async () => {
    if (!cnpjValidacao) {
      alert("Digite um CNPJ");
      return;
    }
    
    setValidandoCNPJ(true);
    
    try {
      const resultado = await UsuarioService.validarCNPJ(cnpjValidacao);
      setResultadoCNPJ(resultado);
    } catch (error) {
      setResultadoCNPJ({ valido: false, erro: error.message });
    }
    
    setValidandoCNPJ(false);
  };

  const usuariosFiltrados = usuarios.filter(usuario => 
    usuario.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(filtro.toLowerCase()) ||
    (usuario.nivelAcesso || 'USER').toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return <div className="admin-loading">Carregando...</div>;

  // Debug temporário
  console.log('Usuários carregados:', usuarios);
  console.log('UserType atual:', userType);

  return (
    <div className="admin-container">
      <h1>Painel Administrativo</h1>
      
      {/* Seção de Validação de CNPJ */}
      <div className="cnpj-section">
        <h2>Validar CNPJ de Farmácia</h2>
        <div className="cnpj-input-group">
          <input
            type="text"
            placeholder="Digite o CNPJ"
            value={cnpjValidacao}
            onChange={(e) => setCnpjValidacao(e.target.value)}
            className="cnpj-input"
          />
          <button 
            onClick={validarCNPJFarmacia}
            disabled={validandoCNPJ}
            className="cnpj-btn"
          >
            {validandoCNPJ ? "Validando..." : "Validar"}
          </button>
        </div>
        
        {resultadoCNPJ && (
          <div className={`cnpj-resultado ${resultadoCNPJ.valido ? 'valido' : 'invalido'}`}>
            {resultadoCNPJ.valido ? (
              <div>
                <h4>✅ CNPJ Válido</h4>
                <p><strong>Razão Social:</strong> {resultadoCNPJ.dados.razaoSocial}</p>
                <p><strong>Nome Fantasia:</strong> {resultadoCNPJ.dados.nomeFantasia}</p>
                <p><strong>É Farmácia:</strong> {resultadoCNPJ.isFarmacia ? "✅ Sim" : "❌ Não"}</p>
                <p><strong>Situação:</strong> {resultadoCNPJ.dados.situacao}</p>
                <p><strong>Atividade:</strong> {resultadoCNPJ.dados.atividade}</p>
              </div>
            ) : (
              <div>
                <h4>❌ CNPJ Inválido</h4>
                <p>{resultadoCNPJ.erro}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div style={{background: '#f0f0f0', padding: '10px', marginBottom: '20px', borderRadius: '4px'}}>
        <strong>Debug:</strong> Usuários encontrados: {usuarios.length} | Seu nível: {userType}
      </div>

      {/* Seção de Gerenciamento de Usuários */}
      <div className="usuarios-section">
        <h2>Gerenciar Usuários ({usuarios.length})</h2>
        
        <div className="filtro-container">
          <input
            type="text"
            placeholder="Filtrar por nome, email ou nível..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="filtro-input"
          />
        </div>
        
        <div className="usuarios-lista">
          {usuariosFiltrados.map((usuario) => (
            <div key={usuario.id} className="usuario-card">
              <div className="usuario-info">
                <h3>{usuario.nome}</h3>
                <p className="usuario-email">{usuario.email}</p>
                <span className={`nivel-badge ${(usuario.nivelAcesso || 'USER').toLowerCase()}`}>
                  {usuario.nivelAcesso || 'USER'}
                </span>
              </div>
              
              <div className="nivel-acesso-controls">
                <label>Alterar nível:</label>
                <select
                  value={usuario.nivelAcesso || 'USER'}
                  onChange={(e) => alterarNivelAcesso(usuario.id, e.target.value)}
                  className="nivel-select"
                >
                  <option value="USER">USER</option>
                  <option value="FARMACIA">FARMACIA</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
          ))}
          
          {usuariosFiltrados.length === 0 && (
            <div className="no-users">Nenhum usuário encontrado</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;