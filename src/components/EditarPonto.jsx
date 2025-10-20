import React, { useEffect, useState } from "react";
import "../css/EditarPonto.css";

const EditarModal = ({ ponto, onClose, onSave }) => {
  const [form, setForm] = useState(ponto || {});

  const formatarCnpj = (cnpj) => {
    if (!cnpj) return "";
    const numeros = cnpj.replace(/\D/g, "");
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return "";
    const numeros = telefone.replace(/\D/g, "");
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  };

  const formatarCep = (cep) => {
    if (!cep) return "";
    const numeros = cep.replace(/\D/g, "");
    return numeros.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  useEffect(() => {
    if (ponto) {
      setForm({
        ...ponto,
        cnpj: formatarCnpj(ponto.cnpj),
        telefone: formatarTelefone(ponto.telefone),
        cep: formatarCep(ponto.cep),
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
    } else if (name === "cep") {
      newValue = value.replace(/\D/g, "").slice(0, 8);
      if (newValue.length > 5) {
        newValue = newValue.replace(/(\d{5})(\d)/, "$1-$2");
      }
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      ...form,
      cnpj: form.cnpj?.replace(/\D/g, "") || "",
      telefone: form.telefone?.replace(/\D/g, "") || "",
      cep: form.cep?.replace(/\D/g, "") || ""
    };
    onSave(formData);
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
            CNPJ:
            <input
              type="text"
              name="cnpj"
              value={form.cnpj || ""}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
          </label>

          <label>
            CEP:
            <input
              type="text"
              name="cep"
              value={form.cep || ""}
              onChange={handleChange}
              placeholder="00000-000"
              maxLength={9}
            />
          </label>

          <label>
            Telefone:
            <input
              type="text"
              name="telefone"
              value={form.telefone || ""}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              maxLength={15}
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
              placeholder="Ex: Aberto das 09:00 às 22:00. Informações adicionais sobre o ponto de coleta..."
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
