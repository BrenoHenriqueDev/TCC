import { useState } from "react";
import EstabelecimentoService from "../services/EstabelecimentoService";
import UsuarioService from "../services/UsuarioService";
import "../css/SolicitarFarmacia.css";

const SolicitarFarmacia = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    numero: "",
    cep: "",
    bairro: "",
    cidade: "",
    estado: "",
    telefone: "",
    observacoes: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const buscarCoordenadas = async (endereco, cidade, estado) => {
    try {
      const enderecoCompleto = `${endereco}, ${cidade}, ${estado}, Brasil`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`
      );
      const data = await response.json();
      return data && data.length > 0 
        ? { latitude: data[0].lat, longitude: data[0].lon }
        : { latitude: "", longitude: "" };
    } catch  {
      return { latitude: "", longitude: "" };
    }
  };

  const buscarEnderecoPorCep = async (cep) => {
    try {
      const cepLimpo = cep.replace(/\D/g, "");
      if (cepLimpo.length !== 8) return;

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (!data.erro) {
        const coordenadas = await buscarCoordenadas(data.logradouro, data.localidade, data.uf);
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
          latitude: coordenadas.latitude,
          longitude: coordenadas.longitude,
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "cnpj") {
      newValue = value.replace(/\D/g, "").slice(0, 14);
      if (newValue.length > 2) {
        newValue = newValue.replace(/(\d{2})(\d)/, "$1.$2");
      }
      if (newValue.length > 6) {
        newValue = newValue.replace(/(\d{2}\.\d{3})(\d)/, "$1.$2");
      }
      if (newValue.length > 10) {
        newValue = newValue.replace(/(\d{2}\.\d{3}\.\d{3})(\d)/, "$1/$2");
      }
      if (newValue.length > 15) {
        newValue = newValue.replace(/(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d)/, "$1-$2");
      }
    } else if (name === "telefone") {
      newValue = value.replace(/\D/g, "").slice(0, 11);
      if (newValue.length > 2) {
        newValue = newValue.replace(/(\d{2})(\d)/, "($1) $2");
      }
      if (newValue.length > 10) {
        newValue = newValue.replace(/(\(\d{2}\) \d{5})(\d)/, "$1-$2");
      }
    } else if (name === "nome") {
      newValue = value.slice(0, 20);
    } else if (name === "endereco") {
      newValue = value.slice(0, 30);
    } else if (name === "observacoes") {
      newValue = value.slice(0, 50);
    } else if (name === "numero") {
      newValue = value.slice(0, 3);
    } else if (name === "cep") {
      newValue = value.replace(/\D/g, "").slice(0, 8);
      if (newValue.length > 5) {
        newValue = newValue.replace(/(\d{5})(\d)/, "$1-$2");
      }
      if (newValue.replace(/\D/g, "").length === 8) {
        buscarEnderecoPorCep(newValue);
      }
    } else if (name === "bairro" || name === "cidade") {
      newValue = value.slice(0, 20);
    } else if (name === "estado") {
      newValue = value.slice(0, 2);
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const usuario = UsuarioService.getCurrentUser();
      if (!usuario || !usuario.id) {
        throw new Error('Usuário não encontrado. Faça login novamente.');
      }

      const estabelecimentoData = {
        nome: formData.nome.trim(),
        cnpj: formData.cnpj.replace(/\D/g, ""),
        info: formData.observacoes.trim() || "Solicitação de farmácia",
        cep: formData.cep.replace(/\D/g, ""),
        numero: formData.numero.replace(/\D/g, ""),
        complemento: `${formData.endereco.trim()}, ${formData.bairro.trim()}`.slice(0, 30),
        telefone: formData.telefone.replace(/\D/g, ""),
        tipo: "FARMACIA",
        coleta: "RECEBIMENTO",
        statusEstabelecimento: "PENDENTE",
        latitude: formData.latitude ? parseFloat(formData.latitude) : -23.5505,
        longitude: formData.longitude ? parseFloat(formData.longitude) : -46.6333
      };

      await EstabelecimentoService.solicitarCadastro(usuario.id, estabelecimentoData);
      
      alert("Solicitação enviada com sucesso! Aguarde a análise do administrador.");
      setMessage("Solicitação enviada com sucesso! Aguarde a análise do administrador.");
      
      setFormData({
        nome: "", cnpj: "", endereco: "", numero: "", cep: "",
        bairro: "", cidade: "", estado: "", telefone: "", observacoes: "",
        latitude: "", longitude: "",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Erro desconhecido';
      alert(`Erro: ${errorMsg}`);
      setMessage(`Erro: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="solicitar-farmacia-container">
      <div className="solicitar-farmacia-card">
        <h2 className="solicitar-farmacia-title">Solicitar Permissão para Farmácia</h2>

        {message && (
          <div className={`solicitar-farmacia-alert ${message.includes("sucesso") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="solicitar-farmacia-form-group">
            <label className="solicitar-farmacia-label">Nome da Farmácia *</label>
            <input
              type="text"
              className="solicitar-farmacia-input"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Farmácia Central"
              maxLength={20}
              required
            />
            <small className="solicitar-farmacia-small">{formData.nome.length}/20 caracteres</small>
          </div>

          <div className="solicitar-farmacia-form-group">
            <label className="solicitar-farmacia-label">CNPJ *</label>
            <input
              type="text"
              className="solicitar-farmacia-input"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              required
            />
            <small className="solicitar-farmacia-small">Apenas números (14 dígitos)</small>
          </div>

          <div className="solicitar-farmacia-form-group">
            <label className="solicitar-farmacia-label">CEP *</label>
            <input
              type="text"
              className="solicitar-farmacia-input"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              placeholder="00000-000"
              maxLength={9}
              required
            />
            <small className="solicitar-farmacia-small">Apenas números (8 dígitos)</small>
          </div>

          <div className="solicitar-farmacia-row">
            <div className="solicitar-farmacia-col-8">
              <div className="solicitar-farmacia-form-group">
                <label className="solicitar-farmacia-label">Endereço *</label>
                <input
                  type="text"
                  className="solicitar-farmacia-input"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  placeholder="Rua, Avenida..."
                  maxLength={30}
                  required
                />
                <small className="solicitar-farmacia-small">{formData.endereco.length}/30 caracteres</small>
              </div>
            </div>
            <div className="solicitar-farmacia-col-4">
              <div className="solicitar-farmacia-form-group">
                <label className="solicitar-farmacia-label">Número *</label>
                <input
                  type="text"
                  className="solicitar-farmacia-input"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={3}
                  required
                />
              </div>
            </div>
          </div>

          <div className="solicitar-farmacia-row">
            <div className="solicitar-farmacia-col-4">
              <div className="solicitar-farmacia-form-group">
                <label className="solicitar-farmacia-label">Bairro *</label>
                <input
                  type="text"
                  className="solicitar-farmacia-input"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  placeholder="Centro"
                  maxLength={20}
                  required
                />
              </div>
            </div>
            <div className="solicitar-farmacia-col-4">
              <div className="solicitar-farmacia-form-group">
                <label className="solicitar-farmacia-label">Cidade *</label>
                <input
                  type="text"
                  className="solicitar-farmacia-input"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  placeholder="São Paulo"
                  maxLength={20}
                  required
                />
              </div>
            </div>
            <div className="solicitar-farmacia-col-2">
              <div className="solicitar-farmacia-form-group">
                <label className="solicitar-farmacia-label">Estado *</label>
                <input
                  type="text"
                  className="solicitar-farmacia-input"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  placeholder="SP"
                  maxLength={2}
                  required
                />
              </div>
            </div>
          </div>

          <div className="solicitar-farmacia-form-group">
            <label className="solicitar-farmacia-label">Telefone *</label>
            <input
              type="tel"
              className="solicitar-farmacia-input"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              maxLength={15}
              required
            />
            <small className="solicitar-farmacia-small">Apenas números (10 ou 11 dígitos)</small>
          </div>

          <div className="solicitar-farmacia-form-group">
            <label className="solicitar-farmacia-label">Observações</label>
            <textarea
              className="solicitar-farmacia-textarea"
              name="observacoes"
              rows="4"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Informações adicionais sobre a farmácia..."
              maxLength={50}
            />
            <small className="solicitar-farmacia-small">{formData.observacoes.length}/50 caracteres</small>
          </div>

          <button type="submit" className="solicitar-farmacia-btn" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Solicitação"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SolicitarFarmacia;