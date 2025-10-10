import http from '../common/http-common';
const API_URL = "usuario/";

const findAll = () => {
    return http.mainInstance.get(API_URL + 'findAll');
};

const findById = (id) => {
    return http.mainInstance.get(API_URL + `findById/${id}`);
};

const signup = (nome, email, senha, data) => {
    return http.mainInstance.post(API_URL + "salvar", {
        nome,
        email,
        senha,
        data,
        nivelAcesso: data.nivelAcesso,
        statusUsuario: data.statusUsuario,
    });
};

const signin = async (email, senha) => {
    const response = await http.mainInstance
        .post(API_URL + "login", {
            email,
            senha,
        });
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const create = data => {
     return http.mainInstance.post(API_URL + "salvar", {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
    });
};

const update = (id, data) => {
    return http.multipartInstance.put(API_URL + `update/${id}`, data);
};

const inativar = (id) => {
    return http.multipartInstance.put(API_URL + `inativar/${id}`);
};

const reativar = (id) => {
    return http.multipartInstance.put(API_URL + `reativar/${id}`);
};

const alterarSenha = (id, data) => {
    const formData = new FormData();
    formData.append('senha', data.senha);

    return http.mainInstance.put(API_URL + `alterarSenha/${id}`, formData);
};

const findByNome = nome => {
    return http.mainInstance.get(API_URL + `findByNome?nome=${nome}`);
};


const UsuarioService = {
    findAll,
    findById,
    signup,
    signin,
    logout,
    getCurrentUser,
    create,
    update,
    inativar,
    reativar,
    alterarSenha,
    findByNome,
}

export default UsuarioService;