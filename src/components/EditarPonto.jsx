import React, { useEffect, useState } from "react";
import "../css/EditarPonto.css";

const EditarModal = ({ ponto, onClose, onSave }) => {
  const [form, setForm] = useState(ponto || {});

  useEffect(() => {
    if (ponto) {
      setForm({
        ...ponto,
        horarioFuncionamento: ponto.horarioFuncionamento || {
          segunda: { inicio: "", fim: "", aberto: true },
          terca: { inicio: "", fim: "", aberto: true },
          quarta: { inicio: "", fim: "", aberto: true },
          quinta: { inicio: "", fim: "", aberto: true },
          sexta: { inicio: "", fim: "", aberto: true },
          sabado: { inicio: "", fim: "", aberto: false },
          domingo: { inicio: "", fim: "", aberto: false },
        },
        tiposMedicamentos: ponto.tiposMedicamentos || [],
        tipoServico: ponto.coleta || "RECEBIMENTO"
      });
    }
  }, [ponto]);

  const tiposDisponiveis = [
    { value: "COMPRIMIDOS", label: "Comprimidos e cápsulas" },
    { value: "XAROPES", label: "Xaropes" },
    { value: "POMADAS", label: "Pomadas / cremes" },
    { value: "INJETAVEIS", label: "Injetáveis" },
    { value: "CONTROLADOS", label: "Medicamentos controlados" },
  ];

  const diasSemana = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("horario_")) {
      const [_, dia, campo] = name.split("_");
      setForm((prev) => ({
        ...prev,
        horarioFuncionamento: {
          ...prev.horarioFuncionamento,
          [dia]: {
            ...prev.horarioFuncionamento?.[dia] || {},
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
            <div className="editar-checkbox-grid">
              {tiposDisponiveis.map((tipo) => (
                <label key={tipo.value} className="editar-checkbox-item">
                  <input
                    type="checkbox"
                    value={tipo.value}
                    checked={(form.tiposMedicamentos || []).includes(tipo.value)}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      const tipos = form.tiposMedicamentos || [];
                      if (checked) {
                        setForm(prev => ({
                          ...prev,
                          tiposMedicamentos: [...tipos, value]
                        }));
                      } else {
                        setForm(prev => ({
                          ...prev,
                          tiposMedicamentos: tipos.filter(t => t !== value)
                        }));
                      }
                    }}
                  />
                  <span>{tipo.label}</span>
                </label>
              ))}
            </div>
          </label>

          <fieldset className="horario-funcionamento">
            <legend>Horário de Funcionamento</legend>
            {diasSemana.map((dia) => (
              <div key={dia} className="editar-horario-card">
                <div className="editar-horario-header">
                  <span className="editar-dia">{dia.charAt(0).toUpperCase() + dia.slice(1)}</span>
                  <label className="editar-toggle">
                    <input
                      type="checkbox"
                      name={`horario_${dia}_aberto`}
                      checked={form.horarioFuncionamento?.[dia]?.aberto || false}
                      onChange={handleChange}
                      className="editar-toggle-input"
                    />
                    <span className="editar-toggle-slider"></span>
                  </label>
                </div>
                {form.horarioFuncionamento?.[dia]?.aberto && (
                  <div className="editar-horario-inputs">
                    <div className="editar-time-group">
                      <label>Abertura</label>
                      <input
                        type="time"
                        name={`horario_${dia}_inicio`}
                        value={form.horarioFuncionamento?.[dia]?.inicio || ""}
                        onChange={handleChange}
                        className="editar-time-input"
                      />
                    </div>
                    <div className="editar-time-group">
                      <label>Fechamento</label>
                      <input
                        type="time"
                        name={`horario_${dia}_fim`}
                        value={form.horarioFuncionamento?.[dia]?.fim || ""}
                        onChange={handleChange}
                        className="editar-time-input"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </fieldset>

          <label>
            Tipo de Serviço:
            <select
              name="tipoServico"
              value={form.tipoServico || "RECEBIMENTO"}
              onChange={handleChange}
            >
              <option value="RECEBIMENTO">Apenas Recebimento</option>
              <option value="RETIRA">Apenas Retirada em Casa</option>
              <option value="AMBOS">Recebimento e Retirada</option>
            </select>
          </label>

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
