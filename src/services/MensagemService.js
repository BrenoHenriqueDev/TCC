import http from "../common/http-common";
const API_URL = "mensagem/";

/* ======================= FUNÇÕES DE BUSCA/LEITURA ======================= */

const listarTodas = () => {
  // GET: /mensagem/findAll
  return http.mainInstance.get(API_URL + "findAll");
};

const buscarPorId = (id) => {
  // GET: /mensagem/findById/{id}
  return http.mainInstance.get(API_URL + `findById/${id}`);
};

const buscarPorEmail = (email) => {
  // GET: /mensagem/findByEmail/{email}
  return http.mainInstance.get(API_URL + `findByEmail/${email}`);
};

const buscarPorStatus = (statusMensagem) => {
  // GET: /mensagem/findByStatus/{statusMensagem}
  return http.mainInstance.get(API_URL + `findByStatus/${statusMensagem}`);
};

/* ======================= FUNÇÕES DE AÇÃO/ESCRITA ======================= */

const salvar = (mensagem) => {
  // POST: /mensagem/save
  // (O backend salva a mensagem e define data/status como ATIVO)
  return http.mainInstance.post(API_URL + "save", mensagem);
};

const marcarComoLida = (id) => {
  // PUT: /mensagem/update/{id}
  // (O backend usa o 'update' para mudar o status para "LIDA")
  return http.mainInstance.put(API_URL + `update/${id}`);
};

const inativar = (id) => {
  // PUT: /mensagem/inativar/{id}
  // (O backend muda o status para "INATIVO")
  return http.mainInstance.put(API_URL + `inativar/${id}`);
};

const excluir = (id) => {
  // DELETE: /mensagem/delete/{id}
  return http.mainInstance.delete(API_URL + `delete/${id}`);
};

/* ======================= EXPORTAÇÃO ======================= */

const MensagemService = {
  listarTodas,
  buscarPorId,
  buscarPorEmail,
  buscarPorStatus,
  salvar,
  marcarComoLida,
  inativar,
  excluir,
};

export default MensagemService;
