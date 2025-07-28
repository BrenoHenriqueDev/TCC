import "../css/Dicas.css";

function Dicas() {
  return (
    <div className="dicas-container">
      <div className="dicas-box">
        <h1 className="dicas-title">Dicas para Armazenamento e Descarte</h1>
        <p className="dicas-intro">
          Mantenha seus medicamentos bem armazenados para garantir eficácia e evite riscos
          à saúde e ao meio ambiente. Veja as principais dicas:
        </p>

        <div className="dicas-grid">
          <div className="dicas-item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png"
              alt="Caixa de medicamentos"
              className="dicas-icon"
            />
            <span className="dicas-text">
              Guarde sempre nas embalagens originais com a bula.
            </span>
          </div>

          <div className="dicas-item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
              alt="Segurança"
              className="dicas-icon"
            />
            <span className="dicas-text">
              Mantenha medicamentos fora do alcance de crianças e animais.
            </span>
          </div>

          <div className="dicas-item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
              alt="Organização"
              className="dicas-icon"
            />
            <span className="dicas-text">
              Organize em caixas separando por tipo e validade.
            </span>
          </div>

          <div className="dicas-item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
              alt="Reciclagem"
              className="dicas-icon"
            />
            <span className="dicas-text">
              Separe medicamentos vencidos para descarte correto em pontos autorizados.
            </span>
          </div>

          <div className="dicas-item">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png"
              alt="Evitar banheiro"
              className="dicas-icon"
            />
            <span className="dicas-text">
              Evite guardar medicamentos no banheiro por conta da umidade.
            </span>
          </div>
        </div>

        {/* Seção extra com passo a passo */}
        <div className="dicas-extra">
          <h2 className="dicas-section-title">Passo a passo para descarte correto</h2>
          <ol className="dicas-steps">
            <li>Verifique a data de validade e separe os medicamentos vencidos.</li>
            <li>Mantenha-os nas embalagens originais para facilitar identificação.</li>
            <li>Leve aos pontos de coleta de farmácias ou postos de saúde autorizados.</li>
          </ol>

          <h2 className="dicas-section-title">Benefícios do descarte correto</h2>
          <ul className="dicas-benefits">
            <li>Protege o meio ambiente e evita contaminação do solo e água.</li>
            <li>Evita riscos à saúde pública e acidentes domésticos.</li>
            <li>Contribui para programas de logística reversa sustentável.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dicas;
