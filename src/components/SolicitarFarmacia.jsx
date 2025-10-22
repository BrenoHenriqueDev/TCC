import { useState } from "react";
import MensagemService from "../services/MensagemService";
import UsuarioService from "../services/UsuarioService";
import "../css/SolicitarFarmacia.css";

const SolicitarFarmacia = () => {
  const [formData, setFormData] = useState({
    cnpj: "",
    justificativa: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");



  const handleChange = (e) => {
    const { name, value } = e.target;
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
    } else if (name === "justificativa") {
      newValue = value.slice(0, 500);
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const usuario = UsuarioService.getCurrentUser();
      if (!usuario || !usuario.id) {
        throw new Error('Usuário não encontrado. Faça login novamente.');
      }

      const solicitacaoData = {
        email: usuario.email,
        emissor: usuario.nome,
        telefone: "",
        texto: `SOLICITAÇÃO FARMÁCIA - CNPJ: ${formData.cnpj.replace(/\D/g, "")} - Justificativa: ${formData.justificativa.trim()}`,
        dataMensagem: new Date().toISOString(),
        statusMensagem: "PENDENTE"
      };

      await MensagemService.save(solicitacaoData);
      
      alert("Solicitação enviada com sucesso! Aguarde a análise do administrador.");
      setMessage("Solicitação enviada com sucesso! Aguarde a análise do administrador.");
      
      setFormData({
        cnpj: "",
        justificativa: "",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Erro desconhecido';
      alert(`Erro: ${errorMsg}`);
      setMessage(`Erro: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="solicitar-farmacia-container">
      <div className="solicitar-farmacia-card">
        <h2 className="solicitar-farmacia-title">Solicitar Permissão para Farmácia</h2>
        <p className="solicitar-farmacia-subtitle">
          Preencha os dados abaixo para solicitar permissão para se tornar uma farmácia parceira. 
          Após aprovação, você poderá cadastrar seu ponto de coleta.
        </p>

        {message && (
          <div className={`solicitar-farmacia-alert ${message.includes("sucesso") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="solicitar-farmacia-form-group">
            <label className="solicitar-farmacia-label">CNPJ do Estabelecimento *</label>
            <input
              type="text"
              className="solicitar-farmacia-input cnpj-input-small"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              required
            />
            <small className="solicitar-farmacia-small">Informe o CNPJ da farmácia/estabelecimento</small>
          </div>

          <div className="solicitar-farmacia-form-group">
            <label className="solicitar-farmacia-label">Justificativa *</label>
            <textarea
              className="solicitar-farmacia-textarea"
              name="justificativa"
              rows="6"
              value={formData.justificativa}
              onChange={handleChange}
              placeholder="Explique por que você deseja se tornar uma farmácia parceira. Inclua informações sobre sua experiência, localização, capacidade de atendimento e como pretende contribuir com o programa de descarte de medicamentos..."
              maxLength={500}
              required
            />
            <small className="solicitar-farmacia-small">{formData.justificativa.length}/500 caracteres</small>
          </div>

          <button type="submit" className="solicitar-farmacia-btn" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Solicitação"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SolicitarFarmacia;