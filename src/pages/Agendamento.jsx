import { useState } from "react";
import HistoricoAgendamentos from "../components/HistoricoAgendamentos";

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
    <div className="w-full min-h-screen bg-slate-100 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">
          Agendamento de Coleta
        </h1>
        <p className="text-slate-600 text-center mb-8">
          Escolha um ponto de coleta, selecione data e horário e agende a
          entrega dos seus medicamentos vencidos.
        </p>

        {/* Lista de pontos de coleta */}
        <h2 className="text-xl font-semibold text-slate-700 mb-4">
          Pontos de Coleta Disponíveis
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {pontos.map((ponto) => (
            <div
              key={ponto.id}
              className="bg-slate-50 border rounded-lg p-4 flex flex-col shadow-sm"
            >
              <h3 className="font-bold text-lg text-slate-800 mb-1">
                {ponto.nome}
              </h3>
              <p className="text-slate-600 text-sm mb-1">{ponto.endereco}</p>
              <p className="text-slate-500 text-xs mb-2">
                Horário: {ponto.horarios}
              </p>
              <p className="text-xs mb-2">
                Aceita agendamento:{" "}
                <span
                  className={
                    ponto.aceitaAgendamento
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {ponto.aceitaAgendamento ? "Sim" : "Não"}
                </span>
              </p>
              <p className="text-xs mb-2">
                Retira em casa:{" "}
                <span
                  className={
                    ponto.retiraEmCasa
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {ponto.retiraEmCasa ? "Sim" : "Não"}
                </span>
              </p>
              {ponto.aceitaAgendamento && (
                <button
                  className="mt-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
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
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg flex flex-col gap-4 relative border border-slate-200 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 text-xl"
                onClick={() => setPontoSelecionado(null)}
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                Agendar em {pontoSelecionado.nome}
              </h2>
              <label className="text-slate-700 font-medium">
                Data
                <input
                  type="date"
                  name="data"
                  value={form.data}
                  onChange={handleFormChange}
                  required
                  className="block w-full border rounded px-3 py-2 mt-1"
                />
              </label>
              <label className="text-slate-700 font-medium">
                Horário
                <input
                  type="time"
                  name="horario"
                  value={form.horario}
                  onChange={handleFormChange}
                  required
                  className="block w-full border rounded px-3 py-2 mt-1"
                />
              </label>
              <label className="text-slate-700 font-medium">
                Observações (opcional)
                <textarea
                  name="obs"
                  value={form.obs}
                  onChange={handleFormChange}
                  className="block w-full border rounded px-3 py-2 mt-1"
                />
              </label>
              {pontoSelecionado.retiraEmCasa && (
                <label className="text-slate-700 font-medium flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="desejaRetirada"
                    checked={form.desejaRetirada}
                    onChange={(e) =>
                      setForm({ ...form, desejaRetirada: e.target.checked })
                    }
                    className="accent-blue-600"
                  />
                  Desejo que o estabelecimento faça a retirada em casa
                </label>
              )}
              {pontoSelecionado.retiraEmCasa && form.desejaRetirada && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label className="text-slate-700 font-medium col-span-1 md:col-span-2">
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
                      className="block w-full border rounded px-3 py-2 mt-1"
                    />
                    {buscandoCep && (
                      <span className="text-xs text-blue-600 ml-2">
                        Buscando endereço...
                      </span>
                    )}
                  </label>
                  <label className="text-slate-700 font-medium">
                    Rua
                    <input
                      type="text"
                      name="rua"
                      value={form.rua}
                      onChange={handleFormChange}
                      required
                      className="block w-full border rounded px-3 py-2 mt-1"
                    />
                  </label>
                  <label className="text-slate-700 font-medium">
                    Número
                    <input
                      type="text"
                      name="numero"
                      value={form.numero}
                      onChange={handleFormChange}
                      required
                      className="block w-full border rounded px-3 py-2 mt-1"
                    />
                  </label>
                  <label className="text-slate-700 font-medium">
                    Bairro
                    <input
                      type="text"
                      name="bairro"
                      value={form.bairro}
                      onChange={handleFormChange}
                      required
                      className="block w-full border rounded px-3 py-2 mt-1"
                    />
                  </label>
                  <label className="text-slate-700 font-medium">
                    Cidade
                    <input
                      type="text"
                      name="cidade"
                      value={form.cidade}
                      onChange={handleFormChange}
                      required
                      className="block w-full border rounded px-3 py-2 mt-1"
                    />
                  </label>
                  <label className="text-slate-700 font-medium">
                    Estado
                    <input
                      type="text"
                      name="estado"
                      value={form.estado}
                      onChange={handleFormChange}
                      required
                      className="block w-full border rounded px-3 py-2 mt-1"
                    />
                  </label>
                </div>
              )}
              <label className="text-slate-700 font-medium">
                Tipos de medicamento a descartar
                <div className="flex flex-col gap-1 mt-2">
                  {tiposMedicamento.map((tipo) => (
                    <label
                      key={tipo}
                      className="flex items-center gap-2 text-slate-600"
                    >
                      <input
                        type="checkbox"
                        value={tipo}
                        checked={form.tipos.includes(tipo)}
                        onChange={handleTipoChange}
                        className="accent-blue-600"
                      />
                      {tipo}
                    </label>
                  ))}
                </div>
              </label>
              {form.tipos.includes("Outros") && (
                <label className="text-slate-700 font-medium mt-2">
                  Descreva o(s) outro(s) medicamento(s)
                  <input
                    type="text"
                    name="outros"
                    value={form.outros}
                    onChange={handleFormChange}
                    className="block w-full border rounded px-3 py-2 mt-1"
                  />
                </label>
              )}
              <button
                type="submit"
                className="mt-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
              >
                Confirmar agendamento
              </button>
            </form>
          </div>
        )}

        {/* Confirmação visual */}
        {sucesso && novoAgendamento && (
          <div className="bg-green-100 border border-green-400 text-green-800 rounded-lg p-4 mb-6 mt-4 text-center">
            <p className="font-semibold mb-2">
              Agendamento realizado com sucesso!
            </p>
            <p>
              <span className="font-medium">Local:</span>{" "}
              {novoAgendamento.local}
            </p>
            <p>
              <span className="font-medium">Data:</span> {novoAgendamento.data}
            </p>
            <p>
              <span className="font-medium">Horário:</span>{" "}
              {novoAgendamento.horario}
            </p>
            {novoAgendamento.tipos && novoAgendamento.tipos.length > 0 && (
              <p>
                <span className="font-medium">Tipos:</span>{" "}
                {novoAgendamento.tipos.join(", ")}
                {novoAgendamento.tipos.includes("Outros") &&
                  novoAgendamento.outros &&
                  ` - ${novoAgendamento.outros}`}
              </p>
            )}
            {novoAgendamento.obs && (
              <p>
                <span className="font-medium">Obs.:</span> {novoAgendamento.obs}
              </p>
            )}
            {novoAgendamento.retirada && (
              <div>
                <p>
                  <span className="font-medium">Retirada em casa:</span> Sim
                </p>
                <p>
                  <span className="font-medium">CEP:</span>{" "}
                  {novoAgendamento.retirada.cep}
                </p>
                <p>
                  <span className="font-medium">Rua:</span>{" "}
                  {novoAgendamento.retirada.rua},{" "}
                  {novoAgendamento.retirada.numero}
                </p>
                <p>
                  <span className="font-medium">Bairro:</span>{" "}
                  {novoAgendamento.retirada.bairro}
                </p>
                <p>
                  <span className="font-medium">Cidade/UF:</span>{" "}
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
