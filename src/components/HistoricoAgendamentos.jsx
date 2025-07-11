import React from "react";
import { FaHistory } from "react-icons/fa";

const statusColors = {
  Pendente: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Concluído: "bg-green-100 text-green-800 border-green-300",
  Cancelado: "bg-red-100 text-red-800 border-red-300",
};

const HistoricoAgendamentos = ({ agendamentos, onCancelar }) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
      <FaHistory className="text-blue-500" /> Histórico de Agendamentos
    </h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-4 text-left text-slate-600 font-semibold">
              Data
            </th>
            <th className="py-3 px-4 text-left text-slate-600 font-semibold">
              Horário
            </th>
            <th className="py-3 px-4 text-left text-slate-600 font-semibold">
              Local
            </th>
            <th className="py-3 px-4 text-left text-slate-600 font-semibold">
              Tipos
            </th>
            <th className="py-3 px-4 text-left text-slate-600 font-semibold">
              Retirada
            </th>
            <th className="py-3 px-4 text-left text-slate-600 font-semibold">
              Status
            </th>
            <th className="py-3 px-4 text-left text-slate-600 font-semibold">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-6 text-slate-400">
                Nenhum agendamento encontrado.
              </td>
            </tr>
          )}
          {agendamentos.map((a) => (
            <tr key={a.id} className="border-b hover:bg-slate-50 transition">
              <td className="py-2 px-4 font-medium text-slate-700">{a.data}</td>
              <td className="py-2 px-4 text-slate-700">{a.horario}</td>
              <td className="py-2 px-4 text-slate-700">{a.local}</td>
              <td className="py-2 px-4">
                {a.tipos && a.tipos.length > 0 ? (
                  <span>
                    {a.tipos.join(", ")}
                    {a.tipos.includes("Outros") && a.outros
                      ? ` - ${a.outros}`
                      : ""}
                  </span>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </td>
              <td className="py-2 px-4">
                {a.retirada ? (
                  <span className="block text-xs text-slate-600">
                    <span className="font-semibold text-green-700">Sim</span>
                    <br />
                    {a.retirada.cep}
                    <br />
                    {a.retirada.rua}, {a.retirada.numero}
                    <br />
                    {a.retirada.bairro}
                    <br />
                    {a.retirada.cidade} - {a.retirada.estado}
                  </span>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </td>
              <td className="py-2 px-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full border text-xs font-bold ${
                    statusColors[a.status] ||
                    "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  {a.status}
                </span>
              </td>
              <td className="py-2 px-4">
                {a.status === "Pendente" && (
                  <button
                    onClick={() => onCancelar(a.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm shadow"
                  >
                    Cancelar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default HistoricoAgendamentos;
