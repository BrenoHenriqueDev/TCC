import http from "../common/http-common";
const API_URL = "usuario/";

const findAll = (adminId) => {
  return http.mainInstance.get(API_URL + `listar/${adminId}`);
};

const findAllByAdmin = async (adminId) => {
  const response = await http.mainInstance.get(API_URL + `listar/${adminId}`);
  return response.data;
};

const findById = async (id) => {
  const response = await http.mainInstance.get(API_URL + `findById/${id}`);
  return response.data;
};

const signup = (nome, email, senha, data) => {
  return http.mainInstance.post(API_URL + "salvar", {
    nome,
    email,
    senha,
    nivelAcesso: data.nivelAcesso || "USER",
    statusUsuario: data.statusUsuario || "ATIVO",
  });
};

const signin = async (email, senha) => {
  const response = await http.mainInstance.post(API_URL + "login", {
    email,
    senha,
  });
  if (response.data) {
    localStorage.setItem("usuarioLogado", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("usuarioLogado");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("usuarioLogado"));
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

const alterarSenha = async (id, senhaAtual, novaSenha) => {
  const formData = new FormData();
  formData.append('senhaAtual', senhaAtual);
  formData.append('novaSenha', novaSenha);
  
  console.log('UsuarioService - alterarSenha:', { id, senhaAtual, novaSenha });
  return http.multipartInstance.put(API_URL + `alterarSenha/${id}`, formData);
};

const findByNome = (nome) => {
  return http.mainInstance.get(API_URL + `findByNome?nome=${nome}`);
};

const remove = (id) => {
  return http.mainInstance.delete(API_URL + `delete/${id}`);
};

const updateNivelAcesso = (adminId, usuarioId, novoNivel) => {
  return http.mainInstance.put(API_URL + `alterarNivel/${adminId}/${usuarioId}?novoNivel=${novoNivel}`);
};

const validarCNPJ = async (cnpj) => {
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  if (cnpjLimpo.length !== 14) {
    throw new Error("CNPJ deve ter 14 dígitos");
  }
  
  const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
  const dados = await response.json();
  
  if (!dados.cnpj) {
    throw new Error("CNPJ inválido");
  }
  
  const isFarmacia = dados.cnae_fiscal === '47.71-7-01' || 
                    dados.cnae_fiscal === '4771701' ||
                    dados.cnae_fiscal_descricao?.toLowerCase().includes('farmácia') ||
                    dados.cnae_fiscal_descricao?.toLowerCase().includes('drogaria') ||
                    dados.razao_social?.toLowerCase().includes('farmácia') ||
                    dados.razao_social?.toLowerCase().includes('drogaria');
  
  return {
    valido: true,
    isFarmacia,
    dados: {
      razaoSocial: dados.razao_social,
      nomeFantasia: dados.nome_fantasia || 'N/A',
      situacao: dados.descricao_situacao_cadastral,
      atividade: dados.cnae_fiscal_descricao
    }
  };
};

const UsuarioService = {
  findAll,
  findAllByAdmin,
  findById,
  signup,
  signin,
  logout,
  getCurrentUser,
  update,
  inativar,
  reativar,
  alterarSenha,
  findByNome,
  remove,
  updateNivelAcesso,
  validarCNPJ,
};

export default UsuarioService;
