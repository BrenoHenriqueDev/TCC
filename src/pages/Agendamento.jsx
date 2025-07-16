import { useState } from "react";
import HistoricoAgendamentos from "../components/HistoricoAgendamentos";
import "../css/Agendamento.css";

// Dados fictícios de pontos de coleta
const pontosMock = [
  {
    id: 1,
    nome: "Farmácia Central",
    endereco: "Rua das Flores, 123 - Centro",
    horarios: "08:00 - 18:00",
    aceitaAgendamento: true,
    retiraEmCasa: true,
  },
  {
    id: 2,
    nome: "Posto de Saúde Bairro Novo",
    endereco: "Av. Brasil, 456 - Bairro Novo",
    horarios: "09:00 - 17:00",
    aceitaAgendamento: false,
    retiraEmCasa: false,
  },
  {
    id: 3,
    nome: "Drogaria Vida",
    endereco: "Rua Esperança, 789 - Jardim Alegre",
    horarios: "07:30 - 19:00",
    aceitaAgendamento: true,
    retiraEmCasa: false,
  },
];

// Dados fictícios de agendamentos do usuário
const agendamentosMock = [
  {
    id: 1,
    data: "2024-06-20",
    horario: "10:00",
    local: "Farmácia Central",
    status: "Pendente",
  },
  {
    id: 2,
    data: "2024-05-10",
    horario: "15:30",
    local: "Drogaria Vida",
    status: "Concluído",
  },
];

const tiposMedicamento = [
  "Comprimidos e cápsulas",
  "Xaropes",
  "Pomadas / cremes",
  "Injetáveis (sem agulhas)",
  "Medicamentos controlados",
  "Antibióticos vencidos",
  "Outros",
];

function Agendamento() {
  const [pontos] = useState(pontosMock);
  const [agendamentos, setAgendamentos] = useState(agendamentosMock);
  const [pontoSelecionado, setPontoSelecionado] = useState(null);
  const [form, setForm] = useState({
    data: "",
    horario: "",
    obs: "",
    tipos: [],
    outros: "",
    desejaRetirada: false,
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [sucesso, setSucesso] = useState(false);
  const [novoAgendamento, setNovoAgendamento] = useState(null);
  const [buscandoCep, setBuscandoCep] = useState(false);

  const handleAgendarClick = (ponto) => {
    setPontoSelecionado(ponto);
    setForm({
      data: "",
      horario: "",
      obs: "",
      tipos: [],
      outros: "",
      desejaRetirada: false,
      cep: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
    });
    setSucesso(false);
    setNovoAgendamento(null);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTipoChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setForm({ ...form, tipos: [...form.tipos, value] });
    } else {
      setForm({ ...form, tipos: form.tipos.filter((t) => t !== value) });
    }
  };

  const handleCepBlur = async () => {
    if (form.cep.length === 8 || form.cep.length === 9) {
      setBuscandoCep(true);
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${form.cep.replace(/\D/g, "")}/json/`
        );
        const data = await response.json();
        if (!data.erro) {
          setForm((prev) => ({
            ...prev,
            rua: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }));
        }
      } catch {
        // erro silencioso
      }
      setBuscandoCep(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pontoSelecionado.retiraEmCasa && form.desejaRetirada) {
      if (
        !form.cep.trim() ||
        !form.rua.trim() ||
        !form.numero.trim() ||
        !form.bairro.trim() ||
        !form.cidade.trim() ||
        !form.estado.trim()
      ) {
        alert("Por favor, preencha todos os campos de endereço para retirada.");
        return;
      }
    }
    const agendamento = {
      id: agendamentos.length + 1,
      data: form.data,
      horario: form.horario,
      local: pontoSelecionado.nome,
      status: "Pendente",
      obs: form.obs,
      tipos: form.tipos,
      outros: form.outros,
      retirada:
        pontoSelecionado.retiraEmCasa && form.desejaRetirada
          ? {
              cep: form.cep,
              rua: form.rua,
              numero: form.numero,
              bairro: form.bairro,
              cidade: form.cidade,
              estado: form.estado,
            }
          : undefined,
    };
    setAgendamentos([agendamento, ...agendamentos]);
    setSucesso(true);
    setNovoAgendamento(agendamento);
    setPontoSelecionado(null);
  };

  const handleCancelar = (id) => {
    setAgendamentos(
      agendamentos.map((a) => (a.id === id ? { ...a, status: "Cancelado" } : a))
    );
  };

  return (
    <div className="agendamento-container">
      <div className="agendamento-box">
        <h1 className="agendamento-title">Agendamento de Coleta</h1>
        <p className="agendamento-subtitle">
          Escolha um ponto de coleta, selecione data e horário e agende a
          entrega dos seus medicamentos vencidos.
        </p>

        {/* Lista de pontos de coleta */}
        <h2 className="agendamento-section-title">
          Pontos de Coleta Disponíveis
        </h2>
        <div className="agendamento-pontos-grid">
          {pontos.map((ponto) => (
            <div key={ponto.id} className="agendamento-ponto-card">
              <h3 className="agendamento-ponto-nome">{ponto.nome}</h3>
              <p className="agendamento-ponto-endereco">{ponto.endereco}</p>
              <p className="agendamento-ponto-horario">
                Horário: {ponto.horarios}
              </p>
              <p className="agendamento-ponto-info">
                Aceita agendamento:{" "}
                <span
                  className={
                    ponto.aceitaAgendamento
                      ? "agendamento-status-sim"
                      : "agendamento-status-nao"
                  }
                >
                  {ponto.aceitaAgendamento ? "Sim" : "Não"}
                </span>
              </p>
              <p className="agendamento-ponto-info">
                Retira em casa:{" "}
                <span
                  className={
                    ponto.retiraEmCasa
                      ? "agendamento-status-sim"
                      : "agendamento-status-nao"
                  }
                >
                  {ponto.retiraEmCasa ? "Sim" : "Não"}
                </span>
              </p>
              {ponto.aceitaAgendamento && (
                <button
                  className="agendamento-btn-agendar"
                  onClick={() => handleAgendarClick(ponto)}
                >
                  Agendar
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Formulário de agendamento */}
        {pontoSelecionado && (
          <div className="agendamento-modal-bg">
            <form onSubmit={handleSubmit} className="agendamento-modal-form">
              <button
                type="button"
                className="agendamento-modal-close"
                onClick={() => setPontoSelecionado(null)}
              >
                ×
              </button>
              <h2 className="agendamento-modal-title">
                Agendar em {pontoSelecionado.nome}
              </h2>
              <label className="agendamento-label">
                Data
                <input
                  type="date"
                  name="data"
                  value={form.data}
                  onChange={handleFormChange}
                  required
                  className="agendamento-input"
                />
              </label>
              <label className="agendamento-label">
                Horário
                <input
                  type="time"
                  name="horario"
                  value={form.horario}
                  onChange={handleFormChange}
                  required
                  className="agendamento-input"
                />
              </label>
              <label className="agendamento-label">
                Observações (opcional)
                <textarea
                  name="obs"
                  value={form.obs}
                  onChange={handleFormChange}
                  className="agendamento-input"
                />
              </label>
              {pontoSelecionado.retiraEmCasa && (
                <label className="agendamento-label agendamento-checkbox-label">
                  <input
                    type="checkbox"
                    name="desejaRetirada"
                    checked={form.desejaRetirada}
                    onChange={(e) =>
                      setForm({ ...form, desejaRetirada: e.target.checked })
                    }
                    className="agendamento-checkbox"
                  />
                  Desejo que o estabelecimento faça a retirada em casa
                </label>
              )}
              {pontoSelecionado.retiraEmCasa && form.desejaRetirada && (
                <div className="agendamento-endereco-grid">
                  <label className="agendamento-label agendamento-endereco-cep">
                    CEP
                    <input
                      type="text"
                      name="cep"
                      value={form.cep}
                      onChange={handleFormChange}
                      onBlur={handleCepBlur}
                      required
                      maxLength={9}
                      placeholder="Digite o CEP"
                      className="agendamento-input"
                    />
                    {buscandoCep && (
                      <span className="agendamento-cep-buscando">
                        Buscando endereço...
                      </span>
                    )}
                  </label>
                  <label className="agendamento-label">
                    Rua
                    <input
                      type="text"
                      name="rua"
                      value={form.rua}
                      onChange={handleFormChange}
                      required
                      className="agendamento-input"
                    />
                  </label>
                  <label className="agendamento-label">
                    Número
                    <input
                      type="text"
                      name="numero"
                      value={form.numero}
                      onChange={handleFormChange}
                      required
                      className="agendamento-input"
                    />
                  </label>
                  <label className="agendamento-label">
                    Bairro
                    <input
                      type="text"
                      name="bairro"
                      value={form.bairro}
                      onChange={handleFormChange}
                      required
                      className="agendamento-input"
                    />
                  </label>
                  <label className="agendamento-label">
                    Cidade
                    <input
                      type="text"
                      name="cidade"
                      value={form.cidade}
                      onChange={handleFormChange}
                      required
                      className="agendamento-input"
                    />
                  </label>
                  <label className="agendamento-label">
                    Estado
                    <input
                      type="text"
                      name="estado"
                      value={form.estado}
                      onChange={handleFormChange}
                      required
                      className="agendamento-input"
                    />
                  </label>
                </div>
              )}
              <label className="agendamento-label">
                Tipos de medicamento a descartar
                <div className="agendamento-tipos-list">
                  {tiposMedicamento.map((tipo) => (
                    <label
                      key={tipo}
                      className="agendamento-tipo-checkbox-label"
                    >
                      <input
                        type="checkbox"
                        value={tipo}
                        checked={form.tipos.includes(tipo)}
                        onChange={handleTipoChange}
                        className="agendamento-checkbox"
                      />
                      {tipo}
                    </label>
                  ))}
                </div>
              </label>
              {form.tipos.includes("Outros") && (
                <label className="agendamento-label">
                  Descreva o(s) outro(s) medicamento(s)
                  <input
                    type="text"
                    name="outros"
                    value={form.outros}
                    onChange={handleFormChange}
                    className="agendamento-input"
                  />
                </label>
              )}
              <button type="submit" className="agendamento-btn-confirmar">
                Confirmar agendamento
              </button>
            </form>
          </div>
        )}

        {/* Confirmação visual */}
        {sucesso && novoAgendamento && (
          <div className="agendamento-sucesso">
            <p className="agendamento-sucesso-titulo">
              Agendamento realizado com sucesso!
            </p>
            <p>
              <span className="agendamento-sucesso-label">Local:</span>{" "}
              {novoAgendamento.local}
            </p>
            <p>
              <span className="agendamento-sucesso-label">Data:</span>{" "}
              {novoAgendamento.data}
            </p>
            <p>
              <span className="agendamento-sucesso-label">Horário:</span>{" "}
              {novoAgendamento.horario}
            </p>
            {novoAgendamento.tipos && novoAgendamento.tipos.length > 0 && (
              <p>
                <span className="agendamento-sucesso-label">Tipos:</span>{" "}
                {novoAgendamento.tipos.join(", ")}
                {novoAgendamento.tipos.includes("Outros") &&
                  novoAgendamento.outros &&
                  ` - ${novoAgendamento.outros}`}
              </p>
            )}
            {novoAgendamento.obs && (
              <p>
                <span className="agendamento-sucesso-label">Obs.:</span>{" "}
                {novoAgendamento.obs}
              </p>
            )}
            {novoAgendamento.retirada && (
              <div>
                <p>
                  <span className="agendamento-sucesso-label">
                    Retirada em casa:
                  </span>{" "}
                  Sim
                </p>
                <p>
                  <span className="agendamento-sucesso-label">CEP:</span>{" "}
                  {novoAgendamento.retirada.cep}
                </p>
                <p>
                  <span className="agendamento-sucesso-label">Rua:</span>{" "}
                  {novoAgendamento.retirada.rua},{" "}
                  {novoAgendamento.retirada.numero}
                </p>
                <p>
                  <span className="agendamento-sucesso-label">Bairro:</span>{" "}
                  {novoAgendamento.retirada.bairro}
                </p>
                <p>
                  <span className="agendamento-sucesso-label">Cidade/UF:</span>{" "}
                  {novoAgendamento.retirada.cidade} -{" "}
                  {novoAgendamento.retirada.estado}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Lista de agendamentos do usuário */}
        <HistoricoAgendamentos
          agendamentos={agendamentos}
          onCancelar={handleCancelar}
        />
      </div>
    </div>
  );
}

export default Agendamento;
