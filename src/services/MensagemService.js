import http from "../common/http-common";
const API_URL = "mensagem/";

const listarTodas = () => {
  return http.mainInstance.get(API_URL + "findAll");
};

const enviar = (mensagem) => {
  return http.mainInstance.post(API_URL + "enviar", mensagem);
};

const MensagemService = {
  listarTodas,
  enviar,
};

export default MensagemService;