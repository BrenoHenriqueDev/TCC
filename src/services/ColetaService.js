import axios from 'axios';

// URL base da sua API no back-end (ajuste conforme necessário)
const API_URL = 'http://localhost:8080/coletas';

const ColetaService = {
  agendarColeta: (coleta) => {
    return axios.post(`${API_URL}/agendar`, coleta);
  },

  listarTodas: () => {
    return axios.get(API_URL);
  },

  listarPorEstabelecimento: (estabelecimentoId) => {
    return axios.get(`${API_URL}/estabelecimento/${estabelecimentoId}`);
  },

  listarPorUsuario: (usuarioId) => {
    return axios.get(`${API_URL}/usuario/${usuarioId}`);
  },

  buscarPorId: (id) => {
    return axios.get(`${API_URL}/${id}`);
  },

  atualizarColeta: (id, coleta) => {
    return axios.put(`${API_URL}/${id}`, coleta);
  },

  deletarColeta: (id) => {
    return axios.delete(`${API_URL}/${id}`);
  }
};

export default ColetaService;
