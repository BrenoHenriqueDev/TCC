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
    <div className="min-h-screen bg-slate-700 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho do Perfil */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                <FaUser className="w-16 h-16 text-blue-500" />
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                <FaEdit size={16} />
              </button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800">
                Dr. João Silva
              </h1>
              <p className="text-gray-600">Médico Clínico Geral</p>
              <p className="text-gray-500 text-sm mt-2">CRM: 12345-SP</p>
            </div>
          </div>
        </div>

        {/* Grid de Informações + Histórico lado a lado */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          {/* Informações Pessoais */}
          <div className="bg-white rounded-lg shadow-lg p-6 w-full md:w-1/3 flex flex-col justify-between">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaUser className="text-blue-500" />
              Informações Pessoais
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <FaEnvelope className="text-blue-500" />
                <span>joao.silva@email.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <FaPhone className="text-blue-500" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <FaMapMarkerAlt className="text-blue-500 mt-1" />
                <span>Av. Paulista, 1000 - São Paulo, SP</span>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
              <FaEdit />
              Editar Informações
            </button>
          </div>

          {/* Histórico de Agendamentos ao lado */}
          <div className="w-full md:w-2/3 flex flex-col justify-between">
            <HistoricoAgendamentos
              agendamentos={agendamentosMock}
              onCancelar={() => {}}
            />
          </div>
        </div>

        {/* Configurações */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCog className="text-blue-500" />
            Configurações
          </h2>
          <div className="space-y-4">
            <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-700">
              Alterar Senha
            </button>
            <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-700">
              Preferências de Notificação
            </button>
            <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-700">
              Privacidade
            </button>
            <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-red-600">
              Excluir Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
