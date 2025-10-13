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

const EstabelecimentoService = {
    cadastrar,
    listarPorUsuario,
    listarTodos,
    atualizar,
};

export default EstabelecimentoService;
