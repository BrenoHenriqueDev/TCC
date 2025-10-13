import React, { useState, useEffect } from "react";
import EstabelecimentoService from "../services/EstabelecimentoService";
import UsuarioService from "../services/UsuarioService";

const PontosColeta = () => {
  const [pontos, setPontos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPontos = async () => {
      try {
        const usuario = UsuarioService.getCurrentUser();
        console.log('Usuario logado:', usuario);
        if (usuario && usuario.id) {
          console.log('Buscando estabelecimentos para usuario ID:', usuario.id);
          const response = await EstabelecimentoService.listarPorUsuario(usuario.id);
          console.log('Resposta da API:', response);
          setPontos(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar pontos:", error);
        console.error("Detalhes do erro:", error.response);
      } finally {
        setLoading(false);
      }
    };

    fetchPontos();
  }, []);

  if (loading) {
    return <p>Carregando pontos...</p>;
  }

  if (pontos.length === 0) {
    return (
      <div className="perfil-pontos-cadastrados">
        <h2 className="perfil-pontos-title">
          📍 Pontos de Coleta Cadastrados
        </h2>
        <p className="perfil-pontos-empty">
          Nenhum ponto de coleta cadastrado ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="perfil-pontos-cadastrados">
      <h2 className="perfil-pontos-title">
        📍 Pontos de Coleta Cadastrados ({pontos.length})
      </h2>
      <div className="perfil-pontos-lista">
        {pontos.map((ponto) => (
          <div key={ponto.id} className="perfil-ponto-item">
            <div className="perfil-ponto-info">
              <h4>{ponto.nome || "Ponto de Coleta"}</h4>
              <p>{ponto.complemento} {ponto.numero && `, ${ponto.numero}`}</p>
              {ponto.telefone && <p>📞 {ponto.telefone}</p>}
              <span className={`perfil-ponto-status ${ponto.statusEstabelecimento?.toLowerCase() || 'ativo'}`}>
                {ponto.statusEstabelecimento || "Ativo"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PontosColeta;