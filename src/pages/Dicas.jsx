import React from "react";
import "../css/Dicas.css";

function Dicas() {
  return (
    <div className="dicas-bg flex flex-col items-center">
      <div className="dicas-card">
        <h1 className="dicas-title">Dicas de Armazenamento e Descarte</h1>
        <div className="dicas-list">
          <div className="dicas-item">
            <div className="dicas-item-icon dicas-item-icon-blue">🚿</div>
            <span className="dicas-item-text">
              Evite guardar remédios no banheiro (umidade prejudica a
              conservação).
            </span>
          </div>
          <div className="dicas-item">
            <div className="dicas-item-icon dicas-item-icon-green">📦</div>
            <span className="dicas-item-text">
              Não remova as embalagens originais dos medicamentos.
            </span>
          </div>
          <div className="dicas-item">
            <div className="dicas-item-icon dicas-item-icon-yellow">🖊️</div>
            <span className="dicas-item-text">
              Anote a validade dos medicamentos com caneta visível.
            </span>
          </div>
          <div className="dicas-item">
            <div className="dicas-item-icon dicas-item-icon-red">🔒</div>
            <span className="dicas-item-text">
              Mantenha medicamentos fora do alcance de crianças e animais.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dicas;
