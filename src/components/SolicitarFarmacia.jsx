import { useState } from 'react';
import MensagemService from '../services/MensagemService';

const SolicitarFarmacia = () => {
    const [formData, setFormData] = useState({
        nomeFantasia: '',
        cnpj: '',
        endereco: '',
        telefone: '',
        responsavelTecnico: '',
        crf: '',
        justificativa: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await MensagemService.solicitarPermissaoFarmacia(formData);
            setMessage('Solicitação enviada com sucesso! Aguarde a análise do administrador.');
            setFormData({
                nomeFantasia: '',
                cnpj: '',
                endereco: '',
                telefone: '',
                responsavelTecnico: '',
                crf: '',
                justificativa: ''
            });
        } catch (error) {
            setMessage('Erro ao enviar solicitação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Solicitar Permissão para Farmácia</h2>
            
            {message && (
                <div className={`alert ${message.includes('sucesso') ? 'alert-success' : 'alert-danger'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nome Fantasia *</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nomeFantasia"
                        value={formData.nomeFantasia}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">CNPJ *</label>
                    <input
                        type="text"
                        className="form-control"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Endereço *</label>
                    <input
                        type="text"
                        className="form-control"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Telefone *</label>
                    <input
                        type="tel"
                        className="form-control"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Responsável Técnico *</label>
                    <input
                        type="text"
                        className="form-control"
                        name="responsavelTecnico"
                        value={formData.responsavelTecnico}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">CRF *</label>
                    <input
                        type="text"
                        className="form-control"
                        name="crf"
                        value={formData.crf}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Justificativa *</label>
                    <textarea
                        className="form-control"
                        name="justificativa"
                        rows="4"
                        value={formData.justificativa}
                        onChange={handleChange}
                        placeholder="Explique por que deseja se tornar uma farmácia parceira..."
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Enviando...' : 'Enviar Solicitação'}
                </button>
            </form>
        </div>
    );
};

export default SolicitarFarmacia;