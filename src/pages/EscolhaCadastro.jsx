import { useNavigate } from "react-router-dom";

function EscolhaCadastro() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex justify-center items-center py-8 px-2 bg-slate-700">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 md:p-8 flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl text-slate-800 text-center font-bold mb-6 md:mb-8">
          Como você gostaria de se cadastrar?
        </h1>
        <button
          onClick={() => navigate("/cadastro-usuario")}
          className="w-full mb-4 py-3 px-4 rounded-md bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
        >
          Como Usuário
        </button>
        <button
          onClick={() => navigate("/cadastro-estabelecimento")}
          className="w-full py-3 px-4 rounded-md bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
        >
          Como Estabelecimento
        </button>
      </div>
    </div>
  );
}

export default EscolhaCadastro;