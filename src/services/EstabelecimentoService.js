import http from "../common/http-common";

const API_URL = "estabelecimento/";

// Funções para estabelecimentos
const cadastrar = (usuarioId, estabelecimento) => {
    return http.mainInstance.post(API_URL + `cadastrar/${usuarioId}`, estabelecimento);
};

const listarPorUsuario = (usuarioId) => {
    return http.mainInstance.get(API_URL + `listarUsuario/${usuarioId}`);
};

const listarTodos = (usuarioId) => {
    return http.mainInstance.get(API_URL + `listar/${usuarioId}`);
};

const atualizar = (usuarioId, estabId, estabelecimento) => {
    return http.mainInstance.put(API_URL + `atualizar/${usuarioId}/${estabId}`, estabelecimento);
};

const listarTodosComCNPJ = async () => {
    const response = await http.mainInstance.get(API_URL + "listarTodos");
    return response.data;
};

const listarSolicitacoesPendentes = async () => {
    const response = await http.mainInstance.get(API_URL + "solicitacoesPendentes");
    return response.data;
};

const aprovarSolicitacao = async (estabelecimentoId) => {
    const response = await http.mainInstance.put(API_URL + `aprovar/${estabelecimentoId}`);
    return response.data;
};

const rejeitarSolicitacao = async (estabelecimentoId) => {
    const response = await http.mainInstance.delete(API_URL + `rejeitar/${estabelecimentoId}`);
    return response.data;
};

const alterarStatus = async (estabelecimentoId, novoStatus) => {
    const response = await http.mainInstance.put(API_URL + `alterarStatus/${estabelecimentoId}`, { status: novoStatus });
    return response.data;
};

const EstabelecimentoService = {
    cadastrar,
    listarPorUsuario,
    listarTodos,
    listarTodosComCNPJ,
    atualizar,
    listarSolicitacoesPendentes,
    aprovarSolicitacao,
    rejeitarSolicitacao,
    alterarStatus,
};

export default EstabelecimentoService;
