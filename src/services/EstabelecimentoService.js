import http from "../common/http-common";

const API_URL = "estabelecimento";

// Funções para estabelecimentos
const cadastrar = (usuarioId, estabelecimento) => {
    return http.mainInstance.post(API_URL + `/cadastrar/${usuarioId}`, estabelecimento);
};

const solicitarCadastro = (usuarioId, estabelecimento) => {
    return http.mainInstance.post(`estabelecimento/solicitar/${usuarioId}`, estabelecimento);
};

const listarPorUsuario = (usuarioId) => {
    return http.mainInstance.get(API_URL + `/listarUsuario/${usuarioId}`);
};

const listarTodos = (usuarioId) => {
    return http.mainInstance.get(API_URL + `/listar/${usuarioId}`);
};

const atualizar = (usuarioId, estabId, estabelecimento) => {
    return http.mainInstance.put(API_URL + `/atualizar/${usuarioId}/${estabId}`, estabelecimento);
};

const listarTodosComCNPJ = async (usuarioId) => {
    const response = await http.mainInstance.get(API_URL + `/listar/${usuarioId}`);
    return response.data;
};

const listarSolicitacoesPendentes = async (usuarioId) => {
    const response = await http.mainInstance.get(API_URL + `/pendentes/${usuarioId}`);
    return response.data;
};

const aprovarSolicitacao = async (adminId, estabelecimentoId) => {
    const response = await http.mainInstance.put(API_URL + `/revisar/${adminId}/${estabelecimentoId}?aprovar=true`);
    return response.data;
};

const rejeitarSolicitacao = async (adminId, estabelecimentoId) => {
    const response = await http.mainInstance.put(API_URL + `/revisar/${adminId}/${estabelecimentoId}?aprovar=false`);
    return response.data;
};

const alterarStatus = async (usuarioId, estabelecimentoId, novoStatus) => {
    // Primeiro busca o estabelecimento completo
    const estabelecimentos = await listarTodosComCNPJ(usuarioId);
    const estabelecimento = estabelecimentos.find(e => e.id === estabelecimentoId);
    
    if (!estabelecimento) {
        throw new Error('Estabelecimento não encontrado');
    }
    
    // Atualiza apenas o status mantendo os outros dados
    const estabelecimentoAtualizado = {
        ...estabelecimento,
        statusEstabelecimento: novoStatus
    };
    
    const response = await http.mainInstance.put(API_URL + `/atualizar/${usuarioId}/${estabelecimentoId}`, estabelecimentoAtualizado);
    return response.data;
};

const EstabelecimentoService = {
    cadastrar,
    solicitarCadastro,
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
