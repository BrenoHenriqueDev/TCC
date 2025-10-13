import { useState } from "react";
import Img1 from "../Imagens/mao.jpg";
import Img2 from "../Imagens/medicos.jpg";
import Img3 from "../Imagens/lampada.jpg";
import { useNavigate } from "react-router-dom";
import "../css/Carousel.css";
import { useAuth } from "../hooks/HookLogin";

const slides = [
  {
    image: Img1,
    alt: "Remédio jogado na natureza",
    title: "Descarte Responsável de Medicamentos",
    text: "O descarte incorreto de medicamentos contamina o solo e a água, causando danos irreversíveis ao meio ambiente. Faça sua parte para um futuro mais sustentável.",
    actions: true,
  },
  {
    image: Img2,
    alt: "Cidadão entregando remédios em farmácia",
    title: "Coleta Segura e Conveniente",
    text: "No VenceMED, você encontra pontos de descarte responsável próximos a você. Use nosso aplicativo móvel para agendar coletas.",
    actions: true,
  },
  {
    image: Img3,
    alt: "Ponto de coleta feliz por ajudar",
    title: "Seja um Agente de Mudança",
    text: "Ajude sua cidade a ser mais sustentável. Cadastre-se como farmácia ou encontre pontos de coleta próximos!",
    actions: true,
  },
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  return (
    <div className="carousel-container">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="carousel-slide">
            <div className="carousel-content">
              <div className="carousel-text-section">
                <h2 className="carousel-title">{slide.title}</h2>
                <p className="carousel-description">{slide.text}</p>

              </div>
              <div className="carousel-image-section">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="carousel-image"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      <button
        onClick={prevSlide}
        className="carousel-arrow carousel-arrow-left"
      >
        &#x2039;
      </button>
      <button
        onClick={nextSlide}
        className="carousel-arrow carousel-arrow-right"
      >
        &#x203a;
      </button>

      {/* Indicadores */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`carousel-indicator${
              current === index ? " active" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
