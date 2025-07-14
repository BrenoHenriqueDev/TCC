import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaHistory,
  FaCog,
} from "react-icons/fa";
import HistoricoAgendamentos from "../components/HistoricoAgendamentos";
import "../css/Perfil.css";

function Perfil() {
  // Exemplo de dados mockados de agendamentos
  const agendamentosMock = [
    {
      id: 1,
      data: "2024-06-20",
      horario: "10:00",
      local: "Farmácia Central",
      tipos: ["Comprimidos e cápsulas", "Xaropes"],
      status: "Pendente",
    },
    {
      id: 2,
      data: "2024-05-10",
      horario: "15:30",
      local: "Drogaria Vida",
      tipos: ["Pomadas / cremes"],
      status: "Concluído",
    },
  ];

  return (
    <div className="perfil-bg">
      <div className="perfil-container">
        {/* Cabeçalho do Perfil */}
        <div className="perfil-header">
          <div className="perfil-header-row">
            <div className="perfil-avatar-area">
              <div className="perfil-avatar">
                <FaUser className="perfil-avatar-icon" />
              </div>
              <button className="perfil-avatar-edit-btn">
                <FaEdit size={16} />
              </button>
            </div>
            <div className="perfil-header-info">
              <h1 className="perfil-nome">Dr. João Silva</h1>
              <p className="perfil-cargo">Médico Clínico Geral</p>
              <p className="perfil-crm">CRM: 12345-SP</p>
            </div>
          </div>
        </div>

        {/* Grid de Informações + Histórico lado a lado */}
        <div className="perfil-main-row">
          {/* Informações Pessoais */}
          <div className="perfil-info-card">
            <h2 className="perfil-info-title">
              <FaUser className="perfil-info-title-icon" />
              Informações Pessoais
            </h2>
            <div className="perfil-info-list">
              <div className="perfil-info-item">
                <FaEnvelope className="perfil-info-icon" />
                <span>joao.silva@email.com</span>
              </div>
              <div className="perfil-info-item">
                <FaPhone className="perfil-info-icon" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="perfil-info-item perfil-info-item-multiline">
                <FaMapMarkerAlt className="perfil-info-icon perfil-info-icon-multiline" />
                <span>Av. Paulista, 1000 - São Paulo, SP</span>
              </div>
            </div>
            <button className="perfil-info-edit-btn">
              <FaEdit />
              Editar Informações
            </button>
          </div>

          {/* Histórico de Agendamentos ao lado */}
          <div className="perfil-historico-area">
            <HistoricoAgendamentos
              agendamentos={agendamentosMock}
              onCancelar={() => {}}
            />
          </div>
        </div>

        {/* Configurações */}
        <div className="perfil-config-card">
          <h2 className="perfil-config-title">
            <FaCog className="perfil-config-title-icon" />
            Configurações
          </h2>
          <div className="perfil-config-list">
            <button className="perfil-config-btn">Alterar Senha</button>
            <button className="perfil-config-btn">
              Preferências de Notificação
            </button>
            <button className="perfil-config-btn">Privacidade</button>
            <button className="perfil-config-btn perfil-config-btn-danger">
              Excluir Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
