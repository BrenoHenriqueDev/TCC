import React, { useEffect, useState } from "react";
import "../css/EditarPonto.css";

const EditarModal = ({ ponto, onClose, onSave }) => {
  const [form, setForm] = useState(ponto);

  useEffect(() => {
    if (ponto) setForm(ponto);
  }, [ponto]);

  const tiposDisponiveis = [
    "Comprimidos e cápsulas",
    "Xaropes",
    "Pomadas / cremes",
    "Injetáveis",
    "Medicamentos controlados",
    "Medicamentos vencidos",
    "Embalagens vazias",
  ];

  const horariosDisponiveis = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
    "22:00", "22:30", "23:00", "23:30", "00:00"
  ];

  const diasSemana = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];

  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;

    if (name === "tiposMedicamentos") {
      const selectedOptions = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setForm((prev) => ({ ...prev, tiposMedicamentos: selectedOptions }));
    } else if (name.startsWith("horario_")) {
      // Exemplo de name: horario_segunda_inicio
      const [_, dia, campo] = name.split("_");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  if (!ponto) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Ponto de Coleta</h2>

        <form onSubmit={handleSubmit} className="editar-form">
          <label>
            Nome do ponto:
            <input
              type="text"
              name="nome"
              value={form.nome || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            Endereço:
            <input
              type="text"
              name="endereco"
              value={form.endereco || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            Bairro:
            <input
              type="text"
              name="bairro"
              value={form.bairro || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            Cidade:
            <input
              type="text"
              name="cidade"
              value={form.cidade || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            Telefone:
            <input
              type="text"
              name="telefone"
              value={form.telefone || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            Tipos de Medicamentos Aceitos:
            <select
              name="tiposMedicamentos"
              multiple
              value={form.tiposMedicamentos || []}
              onChange={handleChange}
              size={tiposDisponiveis.length}
            >
              {tiposDisponiveis.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="horario-funcionamento">
            <legend>Horário de Funcionamento</legend>
            {diasSemana.map((dia) => (
              <div key={dia} className="horario-dia">
                <label>{dia.charAt(0).toUpperCase() + dia.slice(1)}:</label>
                <select
                  name={`horario_${dia}_inicio`}
                  value={form.horarioFuncionamento?.[dia]?.inicio || ""}
                  onChange={handleChange}
                  disabled={!form.horarioFuncionamento?.[dia]?.aberto}
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
                  value={form.horarioFuncionamento?.[dia]?.fim || ""}
                  onChange={handleChange}
                  disabled={!form.horarioFuncionamento?.[dia]?.aberto}
                >
                  <option value="">Fim</option>
                  {horariosDisponiveis.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
                <label>
                  <input
                    type="checkbox"
                    name={`horario_${dia}_aberto`}
                    checked={form.horarioFuncionamento?.[dia]?.aberto || false}
                    onChange={handleChange}
                  />
                  Aberto
                </label>
              </div>
            ))}
          </fieldset>

          <label>
            Observações:
            <textarea
              name="observacoes"
              value={form.observacoes || ""}
              onChange={handleChange}
              rows={3}
            />
          </label>

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="btn-cancelar">
              Cancelar
            </button>
            <button type="submit" className="btn-salvar">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarModal;
