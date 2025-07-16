import "../css/Educacao.css";

function Educacao() {
  return (
    <div className="educacao-container">
      <div className="educacao-box">
        <h1 className="educacao-title">Seção Educativa</h1>
        <div className="educacao-section">
          <div className="educacao-icon educacao-icon-blue">🌱</div>
          <div>
            <h2 className="educacao-section-title educacao-section-title-blue">Como o remédio pode poluir o solo e a água</h2>
            <p className="educacao-section-text">Medicamentos descartados incorretamente liberam substâncias químicas que contaminam o solo e os lençóis freáticos, prejudicando plantas, animais e até a água que bebemos.</p>
          </div>
        </div>
        <div className="educacao-section">
          <div className="educacao-icon educacao-icon-yellow">🚫</div>
          <div>
            <h2 className="educacao-section-title educacao-section-title-yellow">O que NÃO fazer com medicamentos vencidos</h2>
            <ul className="educacao-list">
              <li>Não jogue no lixo comum</li>
              <li>Não descarte em pias ou vasos sanitários</li>
              <li>Não queime medicamentos</li>
            </ul>
          </div>
        </div>
        <div className="educacao-section">
          <div className="educacao-icon educacao-icon-red">💧</div>
          <div>
            <h2 className="educacao-section-title educacao-section-title-red">Por que não jogar na pia, vaso ou lixo comum?</h2>
            <p className="educacao-section-text">Esses métodos levam os resíduos para o meio ambiente, contaminando a água, o solo e colocando em risco a saúde pública.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Educacao; 