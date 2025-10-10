import http from '../common/http-common';

const API_URL = "mensagem/";

const getTest = () => {
    return http.mainInstance.get(API_URL + "test");
};

const findById = (id) => {
    return http.mainInstance.get(API_URL + `findById/${id}`);
};

const findAll = () => {
    return http.mainInstance.get(API_URL + "findAll");
};

const findByEmail = (email) => {
    return http.mainInstance.get(API_URL + `findByEmail/${email}`);
};

const findAllAtivos = () => {
    return http.mainInstance.get(API_URL + "findAllAtivos");
};

const MensagemService = {
    getTest,
    findById,
    findAll,
    findByEmail,
    findAllAtivos,
};

export default MensagemService;
