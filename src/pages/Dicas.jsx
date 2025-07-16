import "../css/Dicas.css";

function Dicas() {
  return (
    <div className="dicas-container">
      <div className="dicas-box">
        <h1 className="dicas-title">Dicas de Armazenamento e Descarte</h1>
        <div className="dicas-list">
          <div className="dicas-item">
            <div className="dicas-icon dicas-icon-blue">🚿</div>
            <span className="dicas-text">Evite guardar remédios no banheiro (umidade prejudica a conservação).</span>
          </div>
          <div className="dicas-item">
            <div className="dicas-icon dicas-icon-green">📦</div>
            <span className="dicas-text">Não remova as embalagens originais dos medicamentos.</span>
          </div>
          <div className="dicas-item">
            <div className="dicas-icon dicas-icon-yellow">🖊️</div>
            <span className="dicas-text">Anote a validade dos medicamentos com caneta visível.</span>
          </div>
          <div className="dicas-item">
            <div className="dicas-icon dicas-icon-red">🔒</div>
            <span className="dicas-text">Mantenha medicamentos fora do alcance de crianças e animais.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dicas; 