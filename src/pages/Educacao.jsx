import "../css/Educacao.css";
import Correto from "../Imagens/correto.webp";
import Descarte from "../Imagens/descarte.webp";
import Residuos from "../Imagens/residuos.webp";
import Poluicao from "../Imagens/poluicao.png"

function Educacao() {
  return (
    <div className="educacao-container">
      <div className="educacao-box">
        <h1 className="educacao-title">Educação Ambiental e Descarte de Medicamentos</h1>
        <p className="educacao-intro">
          O descarte correto de medicamentos é fundamental para proteger o meio ambiente
          e a saúde da população. Aqui você aprenderá como pequenas atitudes podem gerar
          grandes mudanças.
        </p>

        {/* Seção 1 - Poluição */}
        <div className="educacao-section">
          <img
            className="educacao-image"
            src={Poluicao}
            alt="Poluição causada por medicamentos"
          />
          <div>
            <h2 className="educacao-section-title educacao-section-title-blue">
              Como os medicamentos poluem o solo e a água
            </h2>
            <p className="educacao-section-text">
              Medicamentos descartados incorretamente liberam substâncias químicas
              que contaminam o solo e chegam até rios e lençóis freáticos. Isso prejudica
              animais, plantas e até a água potável que consumimos.
            </p>
            <ul className="educacao-list">
              <li>80% dos rios urbanos possuem resíduos farmacêuticos.</li>
              <li>Afeta a reprodução de animais aquáticos.</li>
              <li>Pode contaminar a água usada no consumo humano.</li>
            </ul>
          </div>
        </div>

        {/* Seção 2 - O que não fazer */}
        <div className="educacao-section reverse">
          <img
            className="educacao-image"
            src={Descarte}
            alt="Descarte incorreto de medicamentos"
          />
          <div>
            <h2 className="educacao-section-title educacao-section-title-yellow">
              O que NÃO fazer com medicamentos vencidos
            </h2>
            <p className="educacao-section-text">
              Evite ações que agravam a poluição e colocam a saúde em risco:
            </p>
            <ul className="educacao-list">
              <li>Não jogue no lixo comum.</li>
              <li>Não descarte em pias ou vasos sanitários.</li>
              <li>Não queime medicamentos — libera gases tóxicos.</li>
            </ul>
          </div>
        </div>

        {/* Seção 3 - Saúde pública */}
        <div className="educacao-section">
          <img
            className="educacao-image"
            src={Residuos}
            alt="Saúde pública e resíduos farmacêuticos"
          />
          <div>
            <h2 className="educacao-section-title educacao-section-title-red">
              Impacto na saúde pública
            </h2>
            <p className="educacao-section-text">
              A presença de medicamentos no meio ambiente pode causar resistência
              bacteriana e desequilíbrios hormonais em humanos e animais.
            </p>
            <ul className="educacao-list">
              <li>Criação de superbactérias resistentes a antibióticos.</li>
              <li>Problemas endócrinos em peixes e anfíbios.</li>
              <li>Resíduos podem retornar para o consumo humano.</li>
            </ul>
          </div>
        </div>

        {/* Seção 4 - Como descartar */}
        <div className="educacao-section reverse">
          <img
            className="educacao-image"
            src={Correto}
            alt="Descarte correto de medicamentos"
          />
          <div>
            <h2 className="educacao-section-title educacao-section-title-green">
              Como descartar corretamente?
            </h2>
            <p className="educacao-section-text">
              A maneira correta é simples: leve os medicamentos vencidos a pontos
              de coleta autorizados, como farmácias e unidades de saúde credenciadas.
            </p>
            <ul className="educacao-list">
              <li>Separe medicamentos em desuso.</li>
              <li>Evite misturar com lixo comum ou recicláveis.</li>
              <li>Verifique pontos de coleta mais próximos.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Educacao;
