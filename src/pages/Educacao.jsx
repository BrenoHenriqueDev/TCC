import React from "react";
import "../css/Educacao.css";

function Educacao() {
  return (
    <div className="educacao-bg flex flex-col items-center">
      <div className="educacao-card">
        <h1 className="educacao-title">Seção Educativa</h1>
        <div className="educacao-row">
          <div className="educacao-icon educacao-icon-blue">🌱</div>
          <div>
            <h2 className="educacao-subtitle educacao-subtitle-blue">
              Como o remédio pode poluir o solo e a água
            </h2>
            <p className="educacao-text">
              Medicamentos descartados incorretamente liberam substâncias
              químicas que contaminam o solo e os lençóis freáticos,
              prejudicando plantas, animais e até a água que bebemos.
            </p>
          </div>
        </div>
        <div className="educacao-row">
          <div className="educacao-icon educacao-icon-yellow">🚫</div>
          <div>
            <h2 className="educacao-subtitle educacao-subtitle-yellow">
              O que NÃO fazer com medicamentos vencidos
            </h2>
            <ul className="educacao-list">
              <li>Não jogue no lixo comum</li>
              <li>Não descarte em pias ou vasos sanitários</li>
              <li>Não queime medicamentos</li>
            </ul>
          </div>
        </div>
        <div className="educacao-row">
          <div className="educacao-icon educacao-icon-red">💧</div>
          <div>
            <h2 className="educacao-subtitle educacao-subtitle-red">
              Por que não jogar na pia, vaso ou lixo comum?
            </h2>
            <p className="educacao-text">
              Esses métodos levam os resíduos para o meio ambiente, contaminando
              a água, o solo e colocando em risco a saúde pública.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Educacao;
