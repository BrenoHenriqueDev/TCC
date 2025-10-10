import axios from "axios";

//const API_URL =  "https://projeto.com.br/"; //remote(produção)
const API_URL = "http://localhost:8080/"; //local(desenvolvimento)

const mainInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json"
  }
});

const multipartInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "multipart/form-data"
  }
});

const apiCep = axios.create( {
  baseURL: `https://viacep.com.br/ws/`,
  headers: {
    "Content-type": "application/json"
  }
});


const httpCommom = {
  mainInstance,
  multipartInstance,
  apiCep,
};

export default httpCommom;