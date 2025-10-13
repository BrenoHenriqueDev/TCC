import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EstabelecimentoService from "../services/EstabelecimentoService";
import UsuarioService from "../services/UsuarioService";
import "../css/CadastrarPontoColeta.css";

const CadastrarPontoColeta = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    numero: "",
    cep: "",
    bairro: "",
    cidade: "",
    estado: "",
    telefone: "",
    tiposMedicamentos: [],
    tipoServico: "RECEBIMENTO",
    horarioFuncionamento: {
      segunda: { inicio: "", fim: "", aberto: true },
      terca: { inicio: "", fim: "", aberto: true },
      quarta: { inicio: "", fim: "", aberto: true },
      quinta: { inicio: "", fim: "", aberto: true },
      sexta: { inicio: "", fim: "", aberto: true },
      sabado: { inicio: "", fim: "", aberto: false },
      domingo: { inicio: "", fim: "", aberto: false },
    },
    observacoes: "",
  });
  const [erros, setErros] = useState({});

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



  // Buscar endereço pelo CEP
  const buscarEnderecoPorCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error("Erro na requisição do CEP");
      const data = await response.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
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

    if (name === "cep" && (value.length === 8 || value.length === 9)) {
      buscarEnderecoPorCep(value);
    }

    if (name.startsWith("horario_")) {
      const [dia, campo] = name.split("_").slice(1);
      setForm((prev) => ({
        ...prev,
        horarioFuncionamento: {
          ...prev.horarioFuncionamento,
          [dia]: {
            ...prev.horarioFuncionamento[dia],
            [campo]: type === "checkbox" ? checked : value,
          },
        },
      }));

    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const validar = () => {
    const novosErros = {};

    if (!form.nome.trim()) novosErros.nome = "Nome do ponto é obrigatório.";
    if (!form.endereco.trim()) novosErros.endereco = "Endereço é obrigatório.";
    if (!form.cep.trim()) novosErros.cep = "CEP é obrigatório.";
    if (!form.numero.trim()) novosErros.numero = "Número é obrigatório.";
    if (!form.telefone.trim()) novosErros.telefone = "Telefone é obrigatório.";
    if (form.tiposMedicamentos.length === 0)
      novosErros.tiposMedicamentos =
        "Selecione pelo menos um tipo de medicamento.";

    return novosErros;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          nome: form.nome,
          info: form.observacoes || "Ponto de coleta de medicamentos",
          cep: form.cep,
          numero: form.numero,
          complemento: form.endereco,
          telefone: form.telefone,
          tipo: "FARMACIA",
          coleta: form.tipoServico // RECEBIMENTO, RETIRA ou AMBOS
        };

        await EstabelecimentoService.cadastrar(usuario.id, estabelecimento);
        alert("Estabelecimento cadastrado com sucesso!");
        navigate("/painel-estabelecimento");
      } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao cadastrar ponto de coleta.");
      }
    }
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
          {/* Informações básicas */}
          <div className="cadastrar-ponto-section">
            <h3 className="cadastrar-ponto-section-title">
              Informações Básicas
            </h3>

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
              />
              {erros.nome && (
                <span className="cadastrar-ponto-error">{erros.nome}</span>
              )}
            </div>

            <div className="cadastrar-ponto-field">
              <label className="cadastrar-ponto-label">CEP *</label>
              <input
                type="text"
                name="cep"
                value={form.cep}
                onChange={handleChange}
                onBlur={() => {
                  if (form.cep.length === 8 || form.cep.length === 9) {
                    buscarEnderecoPorCep(form.cep);
                  }
                }}
                maxLength={9}
                className={`cadastrar-ponto-input ${
                  erros.cep ? "cadastrar-ponto-input-error" : ""
                }`}
                placeholder="Digite o CEP"
              />
              {erros.cep && (
                <span className="cadastrar-ponto-error">{erros.cep}</span>
              )}
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
                placeholder="Rua, número, complemento"
              />
              {erros.endereco && (
                <span className="cadastrar-ponto-error">{erros.endereco}</span>
              )}
            </div>

            <div className="cadastrar-ponto-grid">
              <div>
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
                />
                {erros.numero && (
                  <span className="cadastrar-ponto-error">{erros.numero}</span>
                )}
              </div>
              <div>
                <label className="cadastrar-ponto-label">Bairro</label>
                <input
                  type="text"
                  name="bairro"
                  value={form.bairro}
                  onChange={handleChange}
                  className="cadastrar-ponto-input"
                  placeholder="Bairro"
                />
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
              />
              {erros.telefone && (
                <span className="cadastrar-ponto-error">
                  {erros.telefone}
                </span>
              )}
            </div>
          </div>

          {/* Tipo de medicamento */}
          <div className="cadastrar-ponto-section">
            <h3 className="cadastrar-ponto-section-title cadastrar-ponto-section-title-green">
              Tipos de Medicamentos Aceitos *
            </h3>
            <div className="cadastrar-ponto-field">
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
          </div>

          {/* Horário de funcionamento */}
          <div className="cadastrar-ponto-section">
            <h3 className="cadastrar-ponto-section-title cadastrar-ponto-section-title-yellow">
              Horário de Funcionamento
            </h3>
            {Object.entries(form.horarioFuncionamento).map(([dia, horario]) => (
              <div key={dia} className="cadastrar-ponto-horario-card">
                <div className="cadastrar-ponto-horario-header">
                  <span className="cadastrar-ponto-dia">{dia}</span>
                  <label className="cadastrar-ponto-toggle">
                    <input
                      type="checkbox"
                      name={`horario_${dia}_aberto`}
                      checked={horario.aberto}
                      onChange={handleChange}
                      className="cadastrar-ponto-toggle-input"
                    />
                    <span className="cadastrar-ponto-toggle-slider"></span>
                  </label>
                </div>
                {horario.aberto && (
                  <div className="cadastrar-ponto-horario-inputs">
                    <div className="cadastrar-ponto-time-group">
                      <label>Abertura</label>
                      <input
                        type="time"
                        name={`horario_${dia}_inicio`}
                        value={horario.inicio}
                        onChange={handleChange}
                        className="cadastrar-ponto-time-input"
                      />
                    </div>
                    <div className="cadastrar-ponto-time-group">
                      <label>Fechamento</label>
                      <input
                        type="time"
                        name={`horario_${dia}_fim`}
                        value={horario.fim}
                        onChange={handleChange}
                        className="cadastrar-ponto-time-input"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Configurações adicionais */}
          <div className="cadastrar-ponto-section">
            <h3 className="cadastrar-ponto-section-title cadastrar-ponto-section-title-purple">
              Configurações Adicionais
            </h3>

            {/* Tipo de serviço */}
            <div className="cadastrar-ponto-field">
              <label className="cadastrar-ponto-label">Tipo de Serviço</label>
              <select
                name="tipoServico"
                value={form.tipoServico}
                onChange={handleChange}
                className="cadastrar-ponto-input"
              >
                <option value="RECEBIMENTO">Apenas Recebimento</option>
                <option value="RETIRA">Apenas Retirada em Casa</option>
                <option value="AMBOS">Recebimento e Retirada</option>
              </select>
              <p className="cadastrar-ponto-help-text">
                Escolha como o estabelecimento irá atender os clientes
              </p>
            </div>

            <div>
              <label className="cadastrar-ponto-label">Observações</label>
              <textarea
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                rows={4}
                className="cadastrar-ponto-textarea"
                placeholder="Informações adicionais sobre o ponto de coleta..."
              />
            </div>
          </div>

          {/* Botões */}
          <div className="cadastrar-ponto-buttons">
            <button
              type="button"
              onClick={() => navigate("/painel-estabelecimento")}
              className="cadastrar-ponto-btn-cancelar"
            >
              Cancelar
            </button>
            <button type="submit" className="cadastrar-ponto-btn-submit">
              Cadastrar Ponto de Coleta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastrarPontoColeta;
