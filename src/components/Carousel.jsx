import { useState } from "react";
import Img1 from "../Imagens/mao.jpg";
import Img2 from "../Imagens/medicos.jpg";
import Img3 from "../Imagens/lampada.jpg";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    image: Img1,
    alt: "Remédio jogado na natureza",
    text: "Descarte incorreto de medicamentos contamina o solo e a água.",
  },
  {
    image: Img2,
    alt: "Cidadão entregando remédios em farmácia",
    text: "No VenceMED, você agenda a coleta com um ponto de descarte responsável.",
  },
  {
    image: Img3,
    alt: "Ponto de coleta feliz por ajudar",
    text: "Ajude sua cidade. Seja um ponto de coleta ou agende sua entrega agora!",
    actions: true,
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  return (
    <div className="carousel-bg">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="carousel-slide">
            <img src={slide.image} alt={slide.alt} className="carousel-img" />
            <div className="carousel-slide-content">
              <p className="carousel-slide-text">{slide.text}</p>
              {slide.actions && (
                <div className="carousel-slide-actions">
                  <button
                    className="carousel-btn carousel-btn-green"
                    onClick={() => navigate("/login")}
                  >
                    Cadastrar ponto
                  </button>
                  <button
                    className="carousel-btn carousel-btn-blue"
                    onClick={() => navigate("/login")}
                  >
                    Agendar coleta
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Botões */}
      <button
        onClick={prevSlide}
        className="carousel-arrow carousel-arrow-left"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="carousel-arrow carousel-arrow-right"
      >
        ›
      </button>

      {/* Indicadores */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`carousel-indicator${
              current === index ? " carousel-indicator-active" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
