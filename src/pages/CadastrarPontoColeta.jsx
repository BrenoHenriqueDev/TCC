import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EstabelecimentoService from "../services/EstabelecimentoService";
import UsuarioService from "../services/UsuarioService";
import "../css/CadastrarPontoColeta.css";

const CadastrarPontoColeta = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    numero: "",
    cep: "",
    bairro: "",
    cidade: "",
    estado: "",
    telefone: "",
    latitude: "",
    longitude: "",
    tiposMedicamentos: [],
    tipoServico: "RECEBIMENTO",
    observacoes: "",
  });
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!logado || logado.nivelAcesso !== "FARMACIA") {
      navigate("/painel-estabelecimento");
    }
  }, [navigate]);

  // Tipos de medicamentos disponíveis
  const tiposDisponiveis = [
    { value: "COMPRIMIDOS", label: "Comprimidos e cápsulas" },
    { value: "XAROPES", label: "Xaropes" },
    { value: "POMADAS", label: "Pomadas / cremes" },
    { value: "INJETAVEIS", label: "Injetáveis" },
    { value: "CONTROLADOS", label: "Medicamentos controlados" },
  ];



  // Buscar coordenadas por endereço
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
    } catch {
      return { latitude: "", longitude: "" };
    }
  };

  // Buscar endereço pelo CEP
  const buscarEnderecoPorCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error("Erro na requisição do CEP");
      const data = await response.json();
      if (!data.erro) {
        const coordenadas = await buscarCoordenadas(data.logradouro, data.localidade, data.uf);
        setForm((prev) => ({
          ...prev,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
          latitude: coordenadas.latitude,
          longitude: coordenadas.longitude,
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          endereco: "",
          bairro: "",
          cidade: "",
          estado: "",
        }));
        alert("CEP não encontrado. Verifique e tente novamente.");
      }
    } catch {
      setForm((prev) => ({
        ...prev,
        endereco: "",
        bairro: "",
        cidade: "",
        estado: "",
      }));
      alert("Erro ao buscar o CEP. Tente novamente mais tarde.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
      newValue = value.slice(0, 100);
    } else if (name === "endereco") {
      newValue = value.slice(0, 200);
    } else if (name === "numero") {
      newValue = value.slice(0, 10);
    } else if (name === "observacoes") {
      newValue = value.slice(0, 500);
    } else if (name === "cep") {
      newValue = value.replace(/\D/g, "").slice(0, 8);
      if (newValue.length > 5) {
        newValue = newValue.replace(/(\d{5})(\d)/, "$1-$2");
      }
      if (newValue.replace(/\D/g, "").length === 8) {
        buscarEnderecoPorCep(newValue);
      }
    }

    if (name === "cep" && newValue.replace(/\D/g, "").length === 8) {
      buscarEnderecoPorCep(newValue);
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));
  };

  const validar = () => {
    const novosErros = {};

    if (!form.nome.trim()) novosErros.nome = "Nome é obrigatório";
    if (form.nome.trim().length < 3) novosErros.nome = "Nome deve ter pelo menos 3 caracteres";
    
    if (!form.cnpj.trim()) novosErros.cnpj = "CNPJ é obrigatório";
    if (form.cnpj.replace(/\D/g, "").length !== 14) novosErros.cnpj = "CNPJ deve ter 14 dígitos";
    
    if (!form.cep.trim()) novosErros.cep = "CEP é obrigatório";
    if (form.cep.replace(/\D/g, "").length !== 8) novosErros.cep = "CEP deve ter 8 dígitos";
    
    if (!form.endereco.trim()) novosErros.endereco = "Endereço é obrigatório";
    if (!form.numero.trim()) novosErros.numero = "Número é obrigatório";
    if (!form.bairro.trim()) novosErros.bairro = "Bairro é obrigatório";
    if (!form.cidade.trim()) novosErros.cidade = "Cidade é obrigatória";
    if (!form.estado.trim()) novosErros.estado = "Estado é obrigatório";
    
    if (!form.telefone.trim()) novosErros.telefone = "Telefone é obrigatório";
    const telefoneNumeros = form.telefone.replace(/\D/g, "");
    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
      novosErros.telefone = "Telefone deve ter 10 ou 11 dígitos";
    }
    
    if (form.tiposMedicamentos.length === 0) {
      novosErros.tiposMedicamentos = "Selecione pelo menos um tipo de medicamento";
    }

    return novosErros;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validacao = validar();
    setErros(validacao);

    if (Object.keys(validacao).length === 0) {
      try {
        const usuario = UsuarioService.getCurrentUser();

        if (!usuario || !usuario.id) {
          alert("Usuário não encontrado. Faça login novamente.");
          return;
        }

        const estabelecimento = {
          nome: form.nome.trim(),
          cnpj: form.cnpj.replace(/\D/g, ""),
          info: form.observacoes.trim() || "Ponto de coleta de medicamentos",
          cep: form.cep.replace(/\D/g, ""),
          numero: form.numero.trim(),
          complemento: `${form.endereco.trim()}, ${form.bairro.trim()}`,
          telefone: form.telefone.replace(/\D/g, ""),
          latitude: form.latitude ? parseFloat(form.latitude) : null,
          longitude: form.longitude ? parseFloat(form.longitude) : null,
          tipo: "FARMACIA",
          coleta: form.tipoServico
        };

        await EstabelecimentoService.cadastrar(usuario.id, estabelecimento);
        alert("Ponto de coleta cadastrado com sucesso!");
        navigate("/painel-estabelecimento");
      } catch (error) {
        console.error("Erro:", error);
        const errorMsg = error.response?.data?.message || "Erro ao cadastrar ponto de coleta";
        alert(errorMsg);
      }
    }
    setLoading(false);
  };

  return (
    <div className="app-main-content">
      <div className="cadastrar-ponto-container">
        <div className="cadastrar-ponto-header">
          <button
            onClick={() => navigate("/painel-estabelecimento")}
            className="cadastrar-ponto-voltar-btn"
          >
            ← Voltar ao Painel
          </button>
          <h1 className="cadastrar-ponto-title">
            📍 Cadastrar Ponto de Coleta
          </h1>
          <p className="cadastrar-ponto-subtitle">
            Preencha as informações do novo ponto de coleta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="cadastrar-ponto-form">
          {/* Informações Básicas */}
          <div className="cadastrar-ponto-section">
            <h3 className="cadastrar-ponto-section-title">
              📋 Informações Básicas
            </h3>

            <div className="cadastrar-ponto-grid">
              <div className="cadastrar-ponto-field">
                <label className="cadastrar-ponto-label">
                  Nome do Ponto de Coleta *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  className={`cadastrar-ponto-input ${
                    erros.nome ? "cadastrar-ponto-input-error" : ""
                  }`}
                  placeholder="Ex: Farmácia Central - Ponto de Coleta"
                  maxLength={100}
                />
                {erros.nome && (
                  <span className="cadastrar-ponto-error">{erros.nome}</span>
                )}
              </div>

              <div className="cadastrar-ponto-field">
                <label className="cadastrar-ponto-label">CNPJ *</label>
                <input
                  type="text"
                  name="cnpj"
                  value={form.cnpj}
                  onChange={handleChange}
                  className={`cadastrar-ponto-input ${
                    erros.cnpj ? "cadastrar-ponto-input-error" : ""
                  }`}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                />
                {erros.cnpj && (
                  <span className="cadastrar-ponto-error">{erros.cnpj}</span>
                )}
              </div>
            </div>

            <div className="cadastrar-ponto-field">
              <label className="cadastrar-ponto-label">Telefone *</label>
              <input
                type="text"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                className={`cadastrar-ponto-input ${
                  erros.telefone ? "cadastrar-ponto-input-error" : ""
                }`}
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
              {erros.telefone && (
                <span className="cadastrar-ponto-error">{erros.telefone}</span>
              )}
            </div>
          </div>

          {/* Endereço */}
          <div className="cadastrar-ponto-section">
            <h3 className="cadastrar-ponto-section-title">
              📍 Endereço
            </h3>

            <div className="cadastrar-ponto-grid">
              <div className="cadastrar-ponto-field">
                <label className="cadastrar-ponto-label">CEP *</label>
                <input
                  type="text"
                  name="cep"
                  value={form.cep}
                  onChange={handleChange}
                  className={`cadastrar-ponto-input ${
                    erros.cep ? "cadastrar-ponto-input-error" : ""
                  }`}
                  placeholder="00000-000"
                  maxLength={9}
                />
                {erros.cep && (
                  <span className="cadastrar-ponto-error">{erros.cep}</span>
                )}
                <small className="cadastrar-ponto-help">O endereço será preenchido automaticamente</small>
              </div>

              <div className="cadastrar-ponto-field">
                <label className="cadastrar-ponto-label">Número *</label>
                <input
                  type="text"
                  name="numero"
                  value={form.numero}
                  onChange={handleChange}
                  className={`cadastrar-ponto-input ${
                    erros.numero ? "cadastrar-ponto-input-error" : ""
                  }`}
                  placeholder="123"
                  maxLength={10}
                />
                {erros.numero && (
                  <span className="cadastrar-ponto-error">{erros.numero}</span>
                )}
              </div>
            </div>

            <div className="cadastrar-ponto-field">
              <label className="cadastrar-ponto-label">Endereço *</label>
              <input
                type="text"
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                className={`cadastrar-ponto-input ${
                  erros.endereco ? "cadastrar-ponto-input-error" : ""
                }`}
                placeholder="Rua, Avenida..."
                maxLength={200}
              />
              {erros.endereco && (
                <span className="cadastrar-ponto-error">{erros.endereco}</span>
              )}
            </div>

            <div className="cadastrar-ponto-grid">
              <div className="cadastrar-ponto-field">
                <label className="cadastrar-ponto-label">Bairro *</label>
                <input
                  type="text"
                  name="bairro"
                  value={form.bairro}
                  onChange={handleChange}
                  className={`cadastrar-ponto-input ${
                    erros.bairro ? "cadastrar-ponto-input-error" : ""
                  }`}
                  placeholder="Centro"
                />
                {erros.bairro && (
                  <span className="cadastrar-ponto-error">{erros.bairro}</span>
                )}
              </div>

              <div className="cadastrar-ponto-field">
                <label className="cadastrar-ponto-label">Cidade *</label>
                <input
                  type="text"
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  className={`cadastrar-ponto-input ${
                    erros.cidade ? "cadastrar-ponto-input-error" : ""
                  }`}
                  placeholder="São Paulo"
                />
                {erros.cidade && (
                  <span className="cadastrar-ponto-error">{erros.cidade}</span>
                )}
              </div>

              <div className="cadastrar-ponto-field">
                <label className="cadastrar-ponto-label">Estado *</label>
                <input
                  type="text"
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className={`cadastrar-ponto-input ${
                    erros.estado ? "cadastrar-ponto-input-error" : ""
                  }`}
                  placeholder="SP"
                  maxLength={2}
                />
                {erros.estado && (
                  <span className="cadastrar-ponto-error">{erros.estado}</span>
                )}
              </div>
            </div>
          </div>

          {/* Medicamentos e Serviços */}
          <div className="cadastrar-ponto-section">
            <h3 className="cadastrar-ponto-section-title">
              💊 Medicamentos e Serviços
            </h3>

            <div className="cadastrar-ponto-field">
              <label className="cadastrar-ponto-label">
                Tipos de Medicamentos Aceitos *
              </label>
              <div className="cadastrar-ponto-checkbox-grid">
                {tiposDisponiveis.map((tipo) => (
                  <label
                    key={tipo.value}
                    className="cadastrar-ponto-checkbox-item"
                  >
                    <input
                      type="checkbox"
                      value={tipo.value}
                      checked={form.tiposMedicamentos.includes(tipo.value)}
                      onChange={(e) => {
                        const { value, checked } = e.target;
                        if (checked) {
                          setForm((prev) => ({
                            ...prev,
                            tiposMedicamentos: [
                              ...prev.tiposMedicamentos,
                              value,
                            ],
                          }));
                        } else {
                          setForm((prev) => ({
                            ...prev,
                            tiposMedicamentos: prev.tiposMedicamentos.filter(
                              (t) => t !== value
                            ),
                          }));
                        }
                      }}
                      className="cadastrar-ponto-checkbox"
                    />
                    <span className="cadastrar-ponto-checkbox-text">
                      {tipo.label}
                    </span>
                  </label>
                ))}
              </div>
              {erros.tiposMedicamentos && (
                <span className="cadastrar-ponto-error">
                  {erros.tiposMedicamentos}
                </span>
              )}
            </div>

            <div className="cadastrar-ponto-field">
              <label className="cadastrar-ponto-label">Tipo de Serviço</label>
              <select
                name="tipoServico"
                value={form.tipoServico}
                onChange={handleChange}
                className="cadastrar-ponto-input"
              >
                <option value="RECEBIMENTO">📥 Apenas Recebimento</option>
                <option value="RETIRA">🚚 Apenas Retirada em Casa</option>
                <option value="AMBOS">🔄 Recebimento e Retirada</option>
              </select>
              <small className="cadastrar-ponto-help">
                Como o estabelecimento irá atender os clientes
              </small>
            </div>
          </div>



          {/* Informações Adicionais */}
          <div className="cadastrar-ponto-section">
            <h3 className="cadastrar-ponto-section-title">
              📝 Informações Adicionais
            </h3>

            <div className="cadastrar-ponto-field">
              <label className="cadastrar-ponto-label">Observações</label>
              <textarea
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                rows={4}
                className="cadastrar-ponto-textarea"
                placeholder="Ex: Aberto das 09:00 às 22:00. Informações sobre horários especiais, localização, etc..."
                maxLength={500}
              />
              <small className="cadastrar-ponto-help">
                {form.observacoes.length}/500 caracteres
              </small>
            </div>
          </div>

          {/* Botões */}
          <div className="cadastrar-ponto-buttons">
            <button
              type="button"
              onClick={() => navigate("/painel-estabelecimento")}
              className="cadastrar-ponto-btn-cancelar"
              disabled={loading}
            >
              ❌ Cancelar
            </button>
            <button 
              type="submit" 
              className="cadastrar-ponto-btn-submit"
              disabled={loading}
            >
              {loading ? "⏳ Cadastrando..." : "✅ Cadastrar Ponto de Coleta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastrarPontoColeta;
