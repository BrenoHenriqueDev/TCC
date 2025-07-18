import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    aceitaAgendamentos: true,
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

  // Buscar dados do estabelecimento logado
  const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!logado || logado.tipo !== "estabelecimento") {
    navigate("/painel-estabelecimento");
    return null;
  }

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

  // Buscar endereço pelo CEP
  const buscarEnderecoPorCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      }
    } catch (error) {
      console.log("Erro ao buscar CEP");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "cep" && value.length === 8) {
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
    <div
      className="app-main-content"
      style={{ background: "#334155", minHeight: "100vh" }}
    >
      <div
        style={{
          padding: "2rem",
          maxWidth: "800px",
          margin: "0 auto",
          color: "#fff",
        }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <button
            onClick={() => navigate("/painel-estabelecimento")}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer",
              marginBottom: "1rem",
            }}
          >
            ← Voltar ao Painel
          </button>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            📍 Cadastrar Ponto de Coleta
          </h1>
          <p style={{ color: "#e2e8f0" }}>
            Preencha as informações do novo ponto de coleta
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "2rem",
            borderRadius: "12px",
          }}
        >
          {/* Informações básicas */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#60a5fa", marginBottom: "1rem" }}>
              Informações Básicas
            </h3>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Nome do Ponto de Coleta *
              </label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  border: erros.nome
                    ? "1px solid #ef4444"
                    : "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
                placeholder="Ex: Farmácia Central - Ponto de Coleta"
              />
              {erros.nome && (
                <span style={{ color: "#ef4444", fontSize: "0.875rem" }}>
                  {erros.nome}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                CEP *
              </label>
              <input
                type="text"
                name="cep"
                value={form.cep}
                onChange={handleChange}
                maxLength={8}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  border: erros.cep
                    ? "1px solid #ef4444"
                    : "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
                placeholder="Digite o CEP"
              />
              {erros.cep && (
                <span style={{ color: "#ef4444", fontSize: "0.875rem" }}>
                  {erros.cep}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Endereço *
              </label>
              <input
                type="text"
                name="endereco"
                value={form.endereco}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  border: erros.endereco
                    ? "1px solid #ef4444"
                    : "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
                placeholder="Rua, número, complemento"
              />
              {erros.endereco && (
                <span style={{ color: "#ef4444", fontSize: "0.875rem" }}>
                  {erros.endereco}
                </span>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Bairro
                </label>
                <input
                  type="text"
                  name="bairro"
                  value={form.bairro}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                  placeholder="Bairro"
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Telefone *
                </label>
                <input
                  type="text"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "6px",
                    border: erros.telefone
                      ? "1px solid #ef4444"
                      : "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                  placeholder="(11) 99999-9999"
                />
                {erros.telefone && (
                  <span style={{ color: "#ef4444", fontSize: "0.875rem" }}>
                    {erros.telefone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tipos de medicamentos */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#34d399", marginBottom: "1rem" }}>
              Tipos de Medicamentos Aceitos *
            </h3>
            <select
              name="tiposMedicamentos"
              multiple
              value={form.tiposMedicamentos}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "6px",
                border: erros.tiposMedicamentos
                  ? "1px solid #ef4444"
                  : "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                minHeight: "120px",
              }}
            >
              {tiposDisponiveis.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#94a3b8",
                marginTop: "0.5rem",
              }}
            >
              Pressione Ctrl (ou Cmd) para selecionar múltiplos tipos
            </p>
            {erros.tiposMedicamentos && (
              <span style={{ color: "#ef4444", fontSize: "0.875rem" }}>
                {erros.tiposMedicamentos}
              </span>
            )}
          </div>

          {/* Horário de funcionamento */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#fbbf24", marginBottom: "1rem" }}>
              Horário de Funcionamento
            </h3>
            {Object.entries(form.horarioFuncionamento).map(([dia, horario]) => (
              <div
                key={dia}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 1fr 80px",
                  gap: "0.5rem",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ textTransform: "capitalize" }}>{dia}</span>
                <input
                  type="time"
                  name={`horario_${dia}_inicio`}
                  value={horario.inicio}
                  onChange={handleChange}
                  disabled={!horario.aberto}
                  style={{
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: horario.aberto
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(255,255,255,0.05)",
                    color: "#fff",
                  }}
                />
                <input
                  type="time"
                  name={`horario_${dia}_fim`}
                  value={horario.fim}
                  onChange={handleChange}
                  disabled={!horario.aberto}
                  style={{
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: horario.aberto
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(255,255,255,0.05)",
                    color: "#fff",
                  }}
                />
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    name={`horario_${dia}_aberto`}
                    checked={horario.aberto}
                    onChange={handleChange}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Aberto
                </label>
              </div>
            ))}
          </div>

          {/* Configurações adicionais */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#a78bfa", marginBottom: "1rem" }}>
              Configurações Adicionais
            </h3>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  name="aceitaAgendamentos"
                  checked={form.aceitaAgendamentos}
                  onChange={handleChange}
                  style={{ marginRight: "0.5rem" }}
                />
                Aceita agendamentos
              </label>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Observações
              </label>
              <textarea
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  resize: "vertical",
                }}
                placeholder="Informações adicionais sobre o ponto de coleta..."
              />
            </div>
          </div>

          {/* Botões */}
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              onClick={() => navigate("/painel-estabelecimento")}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "6px",
                border: "none",
                background: "#60a5fa",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Cadastrar Ponto de Coleta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastrarPontoColeta;
