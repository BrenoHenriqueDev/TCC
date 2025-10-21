import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
        cnpj: formatarCnpj(ponto.cnpj || ""),
        telefone: formatarTelefone(ponto.telefone || ""),
        cep: formatarCep(ponto.cep || ""),
        endereco: ponto.endereco || ponto.endereço || "",
        tiposMedicamentos: ponto.tiposMedicamentos || [],
        tipoServico: ponto.coleta || ponto.tipoServico || "RECEBIMENTO"
      });
    }
    
    // Desabilita scroll do body quando modal abre
    document.body.style.overflow = 'hidden';
    
    // Reabilita scroll quando modal fecha
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [ponto]);

  const tiposDisponiveis = [
    { value: "COMPRIMIDOS", label: "Comprimidos e cápsulas" },
    { value: "XAROPES", label: "Xaropes" },
    { value: "POMADAS", label: "Pomadas / cremes" },
    { value: "INJETAVEIS", label: "Injetáveis" },
    { value: "CONTROLADOS", label: "Medicamentos controlados" },
  ];



  const buscarCep = async (cep) => {
    console.log('Buscando CEP:', cep);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      console.log('Dados do CEP:', data);
      
      if (!data.erro && data.logradouro) {
        setForm(prev => ({
          ...prev,
          endereco: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade
        }));
        console.log('CEP encontrado e dados preenchidos');
      } else {
        console.log('CEP não encontrado ou inválido');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleCepChange = (e) => {
    const value = e.target.value;
    const numeros = value.replace(/\D/g, "").slice(0, 8);
    const cepFormatado = formatarCep(numeros);
    
    setForm(prev => ({ ...prev, cep: cepFormatado }));
    
    console.log('CEP digitado:', numeros, 'Comprimento:', numeros.length);
    
    // Busca automaticamente quando CEP tiver 8 dígitos
    if (numeros.length === 8) {
      console.log('CEP completo, iniciando busca...');
      buscarCep(numeros);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    if (name === "cnpj") {
      const numeros = value.replace(/\D/g, "").slice(0, 14);
      newValue = formatarCnpj(numeros);
    } else if (name === "telefone") {
      const numeros = value.replace(/\D/g, "").slice(0, 11);
      newValue = formatarTelefone(numeros);
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!form.nome?.trim()) {
      alert("Nome do ponto é obrigatório");
      return;
    }
    
    const formData = {
      ...form,
      cnpj: form.cnpj?.replace(/\D/g, "") || "",
      telefone: form.telefone?.replace(/\D/g, "") || "",
      cep: form.cep?.replace(/\D/g, "") || "",
      coleta: form.tipoServico || "RECEBIMENTO"
    };
    
    onSave(formData);
  };

  if (!ponto) return null;

  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Ponto de Coleta</h2>

        <form onSubmit={handleSubmit} className="editar-form">
          <div className="editar-field">
            <label className="editar-label">Nome do ponto:</label>
            <input
              type="text"
              name="nome"
              value={form.nome || ""}
              onChange={handleChange}
              className="editar-input"
            />
          </div>

          <div className="editar-field">
            <label className="editar-label">CEP:</label>
            <input
              type="text"
              name="cep"
              value={form.cep || ""}
              onChange={handleCepChange}
              placeholder="00000-000"
              maxLength={9}
              className="editar-input"
            />
          </div>

          <div className="editar-field">
            <label className="editar-label">Endereço:</label>
            <input
              type="text"
              name="endereco"
              value={form.endereco || ""}
              onChange={handleChange}
              className="editar-input"
            />
          </div>

          <div className="editar-field">
            <label className="editar-label">Bairro:</label>
            <input
              type="text"
              name="bairro"
              value={form.bairro || ""}
              onChange={handleChange}
              className="editar-input"
            />
          </div>

          <div className="editar-field">
            <label className="editar-label">Cidade:</label>
            <input
              type="text"
              name="cidade"
              value={form.cidade || ""}
              onChange={handleChange}
              className="editar-input"
            />
          </div>

          <div className="editar-field">
            <label className="editar-label">CNPJ:</label>
            <input
              type="text"
              name="cnpj"
              value={form.cnpj || ""}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              className="editar-input"
            />
          </div>

          <div className="editar-field">
            <label className="editar-label">Telefone:</label>
            <input
              type="text"
              name="telefone"
              value={form.telefone || ""}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              maxLength={15}
              className="editar-input"
            />
          </div>

          <div className="editar-field">
            <label className="editar-label">Tipos de Medicamentos Aceitos:</label>
            <div className="editar-checkbox-grid">
              {tiposDisponiveis.map((tipo) => (
                <div key={tipo.value} className="editar-checkbox-item">
                  <input
                    type="checkbox"
                    id={`tipo-${tipo.value}`}
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
                  <span className="editar-checkbox-text">{tipo.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="editar-field">
            <label className="editar-label">Tipo de Serviço:</label>
            <select
              name="tipoServico"
              value={form.tipoServico || "RECEBIMENTO"}
              onChange={handleChange}
              className="editar-select"
            >
              <option value="RECEBIMENTO">Apenas Recebimento</option>
              <option value="RETIRA">Apenas Retirada em Casa</option>
              <option value="AMBOS">Recebimento e Retirada</option>
            </select>
          </div>

          <div className="editar-field">
            <label className="editar-label">Observações:</label>
            <textarea
              name="observacoes"
              value={form.observacoes || ""}
              onChange={handleChange}
              rows={3}
              placeholder="Ex: Aberto das 09:00 às 22:00. Informações adicionais sobre o ponto de coleta..."
              className="editar-textarea"
            />
          </div>

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
  
  return createPortal(modalContent, document.body);
};

export default EditarModal;
