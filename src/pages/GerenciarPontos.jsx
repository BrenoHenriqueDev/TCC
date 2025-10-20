import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EstabelecimentoService from "../services/EstabelecimentoService";
import UsuarioService from "../services/UsuarioService";
import "../css/GerenciarPontos.css";
import EditarModal from "../components/EditarPonto";

const GerenciarPontos = () => {
  const navigate = useNavigate();
  const [pontos, setPontos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Estado para controlar qual ponto está sendo editado (modal)
  const [pontoSelecionado, setPontoSelecionado] = useState(null);

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!logado || logado.nivelAcesso !== "FARMACIA") {
      navigate("/painel-estabelecimento");
      return;
    }
    carregarPontos();
  }, [navigate]);

  const carregarPontos = async () => {
    try {
      const usuario = UsuarioService.getCurrentUser();
      if (usuario && usuario.id) {
        const response = await EstabelecimentoService.listarPorUsuario(usuario.id);
        setPontos(response.data || []);
      }
    } catch (error) {
      console.error("Erro ao carregar pontos:", error);
      setPontos([]);
    } finally {
      setCarregando(false);
    }
  };

  // Atualiza o ponto editado
  const handleSalvarEdicao = async (pontoEditado) => {
    try {
      const usuario = UsuarioService.getCurrentUser();
      
      // Mapear tipoServico para coleta
      const dadosParaBackend = {
        ...pontoEditado,
        coleta: pontoEditado.tipoServico
      };
      
      await EstabelecimentoService.atualizar(usuario.id, pontoEditado.id, dadosParaBackend);
      carregarPontos();
      setPontoSelecionado(null);
      alert("Ponto atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar ponto:", error);
      alert("Erro ao atualizar ponto");
    }
  };

  const handleAtivarDesativar = async (id) => {
    try {
      const usuario = UsuarioService.getCurrentUser();
      const ponto = pontos.find(p => p.id === id);
      
      console.log('Ponto encontrado:', ponto);
      console.log('Status atual:', ponto?.statusEstabelecimento);
      
      const novoStatus = ponto.statusEstabelecimento === 'ATIVO' ? 'INATIVO' : 'ATIVO';
      console.log('Novo status:', novoStatus);
      
      await EstabelecimentoService.alterarStatus(usuario.id, id, novoStatus);
      await carregarPontos(); // Recarrega a lista atualizada
      alert("Status alterado com sucesso!");
    } catch (error) {
      console.error("Erro completo:", error);
      alert("Erro ao alterar status: " + error.message);
    }
  };

  if (carregando)
    return <div className="gerenciar-pontos-loading">Carregando...</div>;

  return (
    <div className="gerenciar-pontos-container">
      <h1 className="gerenciar-pontos-title">Gerenciar Pontos de Coleta</h1>
      {pontos.length === 0 ? (
        <p className="gerenciar-pontos-empty">Nenhum ponto cadastrado ainda.</p>
      ) : (
        <div className="gerenciar-pontos-list">
          {pontos.map((ponto) => (
            <div
              key={ponto.id}
              className={`gerenciar-ponto-card ${
                ponto.ativo ? "ativo" : "inativo"
              }`}
            >
              <h2 className="gerenciar-ponto-nome">{ponto.nome}</h2>
              <p className="gerenciar-ponto-endereco">{ponto.complemento}, {ponto.numero}</p>
              <p className="gerenciar-ponto-info">
                <strong>CEP:</strong> {ponto.cep} <br />
                <strong>Tipo:</strong> {ponto.coleta} <br />
                <strong>Telefone:</strong> {ponto.telefone}
              </p>
              <div className="gerenciar-ponto-status">
                <span
                  className={`gerenciar-ponto-status-badge ${
                    ponto.statusEstabelecimento === 'ATIVO' ? "ativo" : "inativo"
                  }`}
                >
                  {ponto.statusEstabelecimento || 'ATIVO'}
                </span>
              </div>
              <div className="gerenciar-ponto-actions">
                <button
                  className="gerenciar-ponto-btn-editar"
                  onClick={() => setPontoSelecionado(ponto)}
                >
                  Editar
                </button>
                <button
                  className={`gerenciar-ponto-btn-ativar ${
                    ponto.statusEstabelecimento === 'ATIVO' ? "inativo" : "ativo"
                  }`}
                  onClick={() => {
                    console.log('Botão clicado! ID:', ponto.id);
                    handleAtivarDesativar(ponto.id);
                  }}
                  style={{ pointerEvents: 'auto' }}
                >
                  {ponto.statusEstabelecimento === 'ATIVO' ? "Desativar" : "Ativar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Renderizar o modal só se pontoSelecionado tiver valor */}
      {pontoSelecionado && (
        <EditarModal
          ponto={pontoSelecionado}
          onClose={() => setPontoSelecionado(null)}
          onSave={handleSalvarEdicao}
        />
      )}
    </div>
  );
};

export default GerenciarPontos;
