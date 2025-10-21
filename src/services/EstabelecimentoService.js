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

const alterarStatus = async (adminId, estabelecimentoId, novoStatus) => {
    console.log('EstabelecimentoService.alterarStatus chamado:', { adminId, estabelecimentoId, novoStatus });
    
    // Busca todos os estabelecimentos para encontrar o que precisa ser atualizado
    const listaResponse = await http.mainInstance.get(API_URL + `/listar/${adminId}`);
    const estabelecimentos = listaResponse.data || [];
    const estabelecimento = estabelecimentos.find(e => e.id === estabelecimentoId);
    
    if (!estabelecimento) {
        throw new Error('Estabelecimento não encontrado');
    }
    
    console.log('Estabelecimento encontrado:', estabelecimento);
    
    // Prepara dados completos para atualização, mantendo todos os campos existentes
    const estabelecimentoAtualizado = {
        ...estabelecimento,
        statusEstabelecimento: novoStatus,
        // Remove campos que podem causar problemas na atualização
        id: undefined,
        usuario: undefined,
        usuarioId: undefined
    };
    
    console.log('Dados para atualizar:', estabelecimentoAtualizado);
    
    // Usa o ID do usuário dono do estabelecimento
    const usuarioId = estabelecimento.usuario?.id;
    if (!usuarioId) {
        throw new Error('ID do usuário não encontrado no estabelecimento');
    }
    
    const updateResponse = await http.mainInstance.put(
        API_URL + `/atualizar/${usuarioId}/${estabelecimentoId}`, 
        estabelecimentoAtualizado
    );
    
    console.log('Status alterado com sucesso');
    return updateResponse.data;
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
