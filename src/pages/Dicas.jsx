import React from "react";

function Dicas() {
  return (
    <div className="w-full min-h-screen bg-slate-100 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">Dicas de Armazenamento e Descarte</h1>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">🚿</div>
            <span className="text-slate-700">Evite guardar remédios no banheiro (umidade prejudica a conservação).</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">📦</div>
            <span className="text-slate-700">Não remova as embalagens originais dos medicamentos.</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-3xl">🖊️</div>
            <span className="text-slate-700">Anote a validade dos medicamentos com caneta visível.</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl">🔒</div>
            <span className="text-slate-700">Mantenha medicamentos fora do alcance de crianças e animais.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dicas; 