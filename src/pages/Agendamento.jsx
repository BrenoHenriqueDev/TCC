import { useState } from "react";
import HistoricoAgendamentos from "../components/HistoricoAgendamentos";
import "../css/Agendamento.css";
import ColetaService from "../services/ColetaService";

function buscarPontosColeta() {
  // Busca todos os pontos de todos os estabelecimentos
  const estabelecimentos =
    JSON.parse(localStorage.getItem("estabelecimentos")) || [];
  let pontos = [];
  estabelecimentos.forEach((est) => {
    const pontosEst =
      JSON.parse(localStorage.getItem(`pontos_${est.email}`)) || [];
    pontos = pontos.concat(pontosEst);
  });
  return pontos;
}

function Agendamento() {
  // Buscar usuário logado
  const logado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const usuarioEmail = logado && logado.email ? logado.email : null;

  // Buscar agendamentos do localStorage
  function buscarAgendamentos() {
    if (!usuarioEmail) return [];
    return (
      JSON.parse(localStorage.getItem(`agendamentos_${usuarioEmail}`)) || []
    );
  }

  const [pontos] = useState(buscarPontosColeta());
  const [agendamentos, setAgendamentos] = useState(buscarAgendamentos());
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
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [sucesso, setSucesso] = useState(false);
  const [novoAgendamento, setNovoAgendamento] = useState(null);
  const [buscandoCep, setBuscandoCep] = useState(false);

  // Função para obter o dia da semana em português a partir de uma data yyyy-mm-dd
  function getDiaSemana(dateStr) {
    const dias = [
      "domingo",
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
    ];
    const d = new Date(dateStr);
    return dias[d.getDay()];
  }

  // Atualiza horários disponíveis ao mudar a data
  function handleDataChange(e) {
    const data = e.target.value;
    setForm((prev) => ({ ...prev, data, horario: "" }));
    if (pontoSelecionado && pontoSelecionado.horarioFuncionamento) {
      const dia = getDiaSemana(data);
      const horario = pontoSelecionado.horarioFuncionamento[dia];
      if (horario && horario.aberto && horario.inicio && horario.fim) {
        setHorariosDisponiveis(gerarHorarios(horario.inicio, horario.fim));
      } else {
        setHorariosDisponiveis([]);
      }
    }
  }

  // Função para desabilitar dias que o ponto não está aberto
  function isDiaDisponivel(dateStr) {
    if (!pontoSelecionado || !pontoSelecionado.horarioFuncionamento)
      return true;
    const dia = getDiaSemana(dateStr);
    const horario = pontoSelecionado.horarioFuncionamento[dia];
    return horario && horario.aberto && horario.inicio && horario.fim;
  }

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
        if (!response.ok) throw new Error("Erro na requisição do CEP");
        const data = await response.json();
        if (!data.erro) {
          setForm((prev) => ({
            ...prev,
            rua: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            rua: "",
            bairro: "",
            cidade: "",
            estado: "",
          }));
          alert("CEP não encontrado. Verifique e tente novamente.");
        }
      } catch {
        setForm((prev) => ({
          ...prev,
          rua: "",
          bairro: "",
          cidade: "",
          estado: "",
        }));
        alert("Erro ao buscar o CEP. Tente novamente mais tarde.");
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
      id: Date.now(), // id único baseado no timestamp
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
      usuarioEmail: usuarioEmail,
    };
    const novosAgendamentos = [agendamento, ...agendamentos];
    setAgendamentos(novosAgendamentos);
    // Salvar no localStorage
    if (usuarioEmail) {
      localStorage.setItem(
        `agendamentos_${usuarioEmail}`,
        JSON.stringify(novosAgendamentos)
      );
      // Salvar também no ponto de coleta
      const agsPonto =
        JSON.parse(
          localStorage.getItem(`agendamentos_ponto_${pontoSelecionado.id}`)
        ) || [];
      localStorage.setItem(
        `agendamentos_ponto_${pontoSelecionado.id}`,
        JSON.stringify([{ ...agendamento }, ...agsPonto])
      );
    }
    setSucesso(true);
    setNovoAgendamento(agendamento);
    setPontoSelecionado(null);
  };

  const handleCancelar = (id) => {
    const novos = agendamentos.map((a) =>
      a.id === id ? { ...a, status: "Cancelado" } : a
    );
    setAgendamentos(novos);
    if (usuarioEmail) {
      localStorage.setItem(
        `agendamentos_${usuarioEmail}`,
        JSON.stringify(novos)
      );
    }
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
                  onChange={handleDataChange}
                  required
                  className="agendamento-input"
                  min={new Date().toISOString().split("T")[0]}
                  // Desabilitar dias não disponíveis (apenas visual, pois input date não suporta nativamente)
                  style={
                    pontoSelecionado
                      ? {
                          color: isDiaDisponivel(form.data)
                            ? undefined
                            : "#aaa",
                        }
                      : {}
                  }
                />
                {form.data && !isDiaDisponivel(form.data) && (
                  <div style={{ color: "red", fontSize: 13, marginTop: 4 }}>
                    O ponto não está aberto neste dia. Escolha outro dia.
                  </div>
                )}
              </label>
              <label className="agendamento-label">
                Horário
                <select
                  name="horario"
                  value={form.horario}
                  onChange={handleFormChange}
                  required
                  className="agendamento-input"
                  disabled={
                    !form.data ||
                    horariosDisponiveis.length === 0 ||
                    !isDiaDisponivel(form.data)
                  }
                >
                  <option value="">Selecione o horário</option>
                  {horariosDisponiveis.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                {form.data &&
                  horariosDisponiveis.length === 0 &&
                  isDiaDisponivel(form.data) && (
                    <div style={{ color: "red", fontSize: 13, marginTop: 4 }}>
                      Nenhum horário disponível para este dia.
                    </div>
                  )}
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
                  {(pontoSelecionado?.tiposMedicamentos || []).map((tipo) => (
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

// Função utilitária para gerar horários de X em X minutos entre dois horários
function gerarHorarios(inicio, fim, intervalo = 30) {
  const horarios = [];
  let [hIni, mIni] = inicio.split(":").map(Number);
  let [hFim, mFim] = fim.split(":").map(Number);
  let totalIni = hIni * 60 + mIni;
  let totalFim = hFim * 60 + mFim;
  for (let t = totalIni; t <= totalFim; t += intervalo) {
    let h = Math.floor(t / 60)
      .toString()
      .padStart(2, "0");
    let m = (t % 60).toString().padStart(2, "0");
    horarios.push(`${h}:${m}`);
  }
  return horarios;
}

export default Agendamento;
