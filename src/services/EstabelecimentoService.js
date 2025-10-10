import httpCommom from "../common/http-common";

const API_URL = "coletas/";

const agendarColeta = (coleta) => {
    return http.mainInstance.post(API_URL + "agendar", coleta);
};

const listarTodas = () => {
    return http.mainInstance.get(API_URL);
};

const buscarPorId = (id) => {
    return http.mainInstance.get(API_URL + `${id}`);
};

const atualizarColeta = (id, coleta) => {
    return http.mainInstance.put(API_URL + `${id}`, coleta);
};

const deletarColeta = (id) => {
    return http.mainInstance.delete(API_URL + `${id}`);
};

const ColetaService = {
    agendarColeta,
    listarTodas,
    buscarPorId,
    atualizarColeta,
    deletarColeta,
};

export default ColetaService;
