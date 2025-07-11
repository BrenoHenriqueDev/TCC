import Carousel from "../components/Carousel";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/HookLogin";

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="w-full min-h-screen bg-slate-700 flex flex-col items-center">
      {/* Seção de Boas-Vindas */}
      <section className="w-full max-w-3xl mt-10 bg-slate-800 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-4xl text-slate-50 font-bold text-center mb-2">
          VenceMED
        </h1>
        <p className="text-lg text-slate-200 text-center mb-6 font-medium">
          "Descartar medicamentos com responsabilidade é um ato de cuidado com a
          vida e o meio ambiente".
        </p>
        <button
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg transition-colors mb-2"
          onClick={() => navigate(isAuthenticated ? "/agendamento" : "/login")}
        >
          Agende uma coleta
        </button>
      </section>

      {/* Carousel */}
      <section className="w-full max-w-2xl mt-8">
        <Carousel />
      </section>

      {/* Como Funciona */}
      <section className="w-full max-w-4xl mt-12 flex flex-col items-center">
        <h2 className="text-2xl text-slate-50 font-bold mb-6">
          Como funciona?
        </h2>
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
          <div className="flex flex-col items-center bg-slate-800 rounded-lg p-6 w-full md:w-1/3">
            {/* Ícone placeholder */}
            <div className="bg-green-500 rounded-full w-14 h-14 flex items-center justify-center mb-3 text-white text-2xl">
              1
            </div>
            <p className="text-slate-200 text-center">
              Cadastre-se como cidadão ou ponto de coleta.
            </p>
          </div>
          <div className="flex flex-col items-center bg-slate-800 rounded-lg p-6 w-full md:w-1/3">
            <div className="bg-blue-500 rounded-full w-14 h-14 flex items-center justify-center mb-3 text-white text-2xl">
              2
            </div>
            <p className="text-slate-200 text-center">
              Agende a coleta de seus medicamentos vencidos.
            </p>
          </div>
          <div className="flex flex-col items-center bg-slate-800 rounded-lg p-6 w-full md:w-1/3">
            <div className="bg-yellow-500 rounded-full w-14 h-14 flex items-center justify-center mb-3 text-white text-2xl">
              3
            </div>
            <p className="text-slate-200 text-center">
              Descarte corretamente em um ponto próximo a você.
            </p>
          </div>
        </div>
      </section>

      {/* Para quem é o VenceMED? */}
      <section className="w-full max-w-4xl mt-12 flex flex-col items-center">
        <h2 className="text-2xl text-slate-50 font-bold mb-6">
          Para quem é o VenceMED?
        </h2>
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
          <div className="bg-slate-800 rounded-lg p-8 flex-1 flex flex-col items-center">
            <h3 className="text-xl text-slate-100 font-semibold mb-2">
              Sou cidadão
            </h3>
            <p className="text-slate-200 text-center mb-4">
              Deseja agendar a coleta de medicamentos vencidos?
            </p>
            <button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              onClick={() => navigate("/login")}
            >
              Sou cidadão
            </button>
          </div>
          <div className="bg-slate-800 rounded-lg p-8 flex-1 flex flex-col items-center">
            <h3 className="text-xl text-slate-100 font-semibold mb-2">
              Sou estabelecimento
            </h3>
            <p className="text-slate-200 text-center mb-4">
              Deseja receber descartes e ajudar o meio ambiente?
            </p>
            <button
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
              onClick={() => navigate("/login")}
            >
              Sou ponto de coleta
            </button>
          </div>
        </div>
      </section>

      {/* Impacto ambiental */}
      <section className="w-full max-w-4xl mt-12 mb-16 flex flex-col md:flex-row items-center bg-slate-800 rounded-xl p-8 gap-8">
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h2 className="text-2xl text-slate-50 font-bold mb-4">
            Impacto ambiental
          </h2>
          <p className="text-slate-200 text-lg mb-4">
            + de 90% dos remédios descartados incorretamente contaminam o solo e
            a água.
          </p>
        </div>
        {/* Imagem ilustrativa placeholder */}
        <div className="flex-1 flex justify-center">
          <div className="w-40 h-40 bg-slate-600 rounded-lg flex items-center justify-center text-slate-300">
            Imagem
          </div>
        </div>
      </section>
    </div>
  );
}
export default Home;
