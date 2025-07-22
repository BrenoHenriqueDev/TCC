import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CadastrarPontoColeta.css";

const CadastrarPontoColeta = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    cep: "",
    bairro: "",
    cidade: "",
    estado: "",
    telefone: "",
    tiposMedicamentos: [],
    FazRetirada: true,
    aceitaAgendamento: false,
    retiraEmCasa: false,
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
    if (!logado || logado.tipo !== "estabelecimento") {
      navigate("/painel-estabelecimento");
    }
  }, [navigate]);

  // Tipos de medicamentos disponíveis
  const tiposDisponiveis = [
    "Comprimidos e cápsulas",
    "Xaropes",
    "Pomadas / cremes",
    "Injetáveis",
    "Medicamentos controlados",
    "Medicamentos vencidos",
    "Embalagens vazias",
  ];

  // Horários pré-definidos para facilitar a seleção
  const horariosDisponiveis = [
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
    "00:00",
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
    } else if (name === "tiposMedicamentos") {
      const tipos = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setForm((prev) => ({ ...prev, tiposMedicamentos: tipos }));
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
    if (!form.telefone.trim()) novosErros.telefone = "Telefone é obrigatório.";
    if (form.tiposMedicamentos.length === 0)
      novosErros.tiposMedicamentos =
        "Selecione pelo menos um tipo de medicamento.";

    return novosErros;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validacao = validar();
    setErros(validacao);

    if (Object.keys(validacao).length === 0) {
      // Salvar no localStorage
      const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
      const pontosSalvos =
        JSON.parse(localStorage.getItem(`pontos_${logado.email}`)) || [];
      const novoPonto = {
        ...form,
        id: Date.now(),
        estabelecimentoEmail: logado.email,
        dataCadastro: new Date().toISOString(),
        ativo: true,
      };
      pontosSalvos.push(novoPonto);
      localStorage.setItem(
        `pontos_${logado.email}`,
        JSON.stringify(pontosSalvos)
      );

      alert("Ponto de coleta cadastrado com sucesso!");
      navigate("/painel-estabelecimento");
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
              <div>
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
          </div>

          {/* Tipos de medicamentos */}
          <div className="cadastrar-ponto-section">
            <h3 className="cadastrar-ponto-section-title cadastrar-ponto-section-title-green">
              Tipos de Medicamentos Aceitos *
            </h3>
            <select
              name="tiposMedicamentos"
              multiple
              value={form.tiposMedicamentos}
              onChange={handleChange}
              className={`cadastrar-ponto-select ${
                erros.tiposMedicamentos ? "cadastrar-ponto-input-error" : ""
              }`}
            >
              {tiposDisponiveis.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            <p className="cadastrar-ponto-help-text">
              Pressione Ctrl (ou Cmd) para selecionar múltiplos tipos
            </p>
            {erros.tiposMedicamentos && (
              <span className="cadastrar-ponto-error">
                {erros.tiposMedicamentos}
              </span>
            )}
          </div>

          {/* Horário de funcionamento */}
          <div className="cadastrar-ponto-section">
            <h3 className="cadastrar-ponto-section-title cadastrar-ponto-section-title-yellow">
              Horário de Funcionamento
            </h3>
            {Object.entries(form.horarioFuncionamento).map(([dia, horario]) => (
              <div key={dia} className="cadastrar-ponto-horario-grid">
                <span className="cadastrar-ponto-dia">{dia}</span>
                <select
                  name={`horario_${dia}_inicio`}
                  value={horario.inicio}
                  onChange={handleChange}
                  disabled={!horario.aberto}
                  className="cadastrar-ponto-time-select"
                >
                  <option value="">Início</option>
                  {horariosDisponiveis.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
                <select
                  name={`horario_${dia}_fim`}
                  value={horario.fim}
                  onChange={handleChange}
                  disabled={!horario.aberto}
                  className="cadastrar-ponto-time-select"
                >
                  <option value="">Fim</option>
                  {horariosDisponiveis.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
                <label className="cadastrar-ponto-checkbox-label">
                  <input
                    type="checkbox"
                    name={`horario_${dia}_aberto`}
                    checked={horario.aberto}
                    onChange={handleChange}
                    className="cadastrar-ponto-checkbox"
                  />
                  Aberto
                </label>
              </div>
            ))}
          </div>

          {/* Configurações adicionais */}
          <div className="cadastrar-ponto-section">
            <h3 className="cadastrar-ponto-section-title cadastrar-ponto-section-title-purple">
              Configurações Adicionais
            </h3>

            {/* Checkboxes de agendamento e retirada */}
            <div className="cadastrar-ponto-field">
              <label className="cadastrar-ponto-label">
                Aceita agendamento?
              </label>
              <input
                type="checkbox"
                name="aceitaAgendamento"
                checked={form.aceitaAgendamento || false}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    aceitaAgendamento: e.target.checked,
                  }))
                }
                className="cadastrar-ponto-checkbox"
              />
            </div>
            <div className="cadastrar-ponto-field">
              <label className="cadastrar-ponto-label">Retira em casa?</label>
              <input
                type="checkbox"
                name="retiraEmCasa"
                checked={form.retiraEmCasa || false}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    retiraEmCasa: e.target.checked,
                  }))
                }
                className="cadastrar-ponto-checkbox"
              />
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
