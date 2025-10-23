import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MensagemService from "../services/MensagemService";
import UsuarioService from "../services/UsuarioService";
import "../css/Mensagens.css";

const Mensagens = () => {
  const navigate = useNavigate();
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!logado || logado.nivelAcesso !== "ADMIN") {
      navigate("/");
      return;
    }
    carregarMensagens();
  }, [navigate]);

  const carregarMensagens = async () => {
    try {
      console.log('Carregando mensagens...');
      const response = await MensagemService.listarTodas();
      console.log('Resposta da API:', response);
      console.log('Dados das mensagens:', response.data);
      
      // Filtrar para excluir solicitações de farmácia
      const mensagensFiltradas = (response.data || []).filter(
        (msg) => !msg.texto || !msg.texto.includes("SOLICITAÇÃO FARMÁCIA")
      );
      
      setMensagens(mensagensFiltradas);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      setMensagens([]);
    } finally {
      setCarregando(false);
    }
  };

  // Cálculos da paginação
  const totalPaginas = Math.ceil(mensagens.length / itensPorPagina);
  const mensagensPaginadas = mensagens.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const formatarData = (data) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  if (carregando)
    return <div className="mensagens-loading">Carregando...</div>;

  return (
    <div className="mensagens-container">
      <h1 className="mensagens-title">Todas as Mensagens do Sistema ({mensagens.length})</h1>
      {mensagens.length === 0 ? (
        <p className="mensagens-empty">Nenhuma mensagem encontrada.</p>
      ) : (
        <>
          <div className="mensagens-list">
            {mensagensPaginadas.map((mensagem) => (
              <div key={mensagem.id} className="mensagem-card">
                <div className="mensagem-header">
                  <h3 className="mensagem-nome">{mensagem.nome}</h3>
                  <span className="mensagem-data">{formatarData(mensagem.dataEnvio)}</span>
                </div>
                <div className="mensagem-info">
                  <p><strong>Email:</strong> {mensagem.email}</p>
                  <p><strong>Telefone:</strong> {mensagem.telefone}</p>
                </div>
                <div className="mensagem-conteudo">
                  {console.log('Estrutura da mensagem:', mensagem)}
                  <p>{mensagem.mensagem || mensagem.texto || mensagem.conteudo || mensagem.message || 'Conteúdo não disponível'}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="paginacao">
              <button 
                onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
                className="paginacao-btn"
              >
                ← Anterior
              </button>
              <span className="paginacao-info">
                Página {paginaAtual} de {totalPaginas}
              </span>
              <button 
                onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
                className="paginacao-btn"
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Mensagens;