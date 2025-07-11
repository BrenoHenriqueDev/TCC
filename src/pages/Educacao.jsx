import React from "react";

function Educacao() {
  return (
    <div className="w-full min-h-screen bg-slate-100 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">Seção Educativa</h1>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-5xl">🌱</div>
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Como o remédio pode poluir o solo e a água</h2>
            <p className="text-slate-700">Medicamentos descartados incorretamente liberam substâncias químicas que contaminam o solo e os lençóis freáticos, prejudicando plantas, animais e até a água que bebemos.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center text-5xl">🚫</div>
          <div>
            <h2 className="text-xl font-semibold text-yellow-700 mb-2">O que NÃO fazer com medicamentos vencidos</h2>
            <ul className="list-disc ml-6 text-slate-700">
              <li>Não jogue no lixo comum</li>
              <li>Não descarte em pias ou vasos sanitários</li>
              <li>Não queime medicamentos</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center text-5xl">💧</div>
          <div>
            <h2 className="text-xl font-semibold text-red-700 mb-2">Por que não jogar na pia, vaso ou lixo comum?</h2>
            <p className="text-slate-700">Esses métodos levam os resíduos para o meio ambiente, contaminando a água, o solo e colocando em risco a saúde pública.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Educacao; 