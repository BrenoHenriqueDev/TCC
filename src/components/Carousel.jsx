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
    <div className="relative w-full max-w-6xl mx-auto mt-4 overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 flex flex-col md:flex-row items-center justify-center p-8 h-[520px] md:h-[420px] lg:h-[520px]"
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full md:w-1/2 h-64 md:h-96 lg:h-[400px] object-cover rounded-xl shadow-lg mb-6 md:mb-0 md:mr-12"
            />
            <div className="flex-1 flex flex-col items-center md:items-start">
              <p className="text-slate-100 text-xl md:text-2xl text-center md:text-left font-semibold mb-6">
                {slide.text}
              </p>
              {slide.actions && (
                <div className="flex gap-6 mt-2">
                  <button
                    className="px-7 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-lg"
                    onClick={() => navigate("/login")}
                  >
                    Cadastrar ponto
                  </button>
                  <button
                    className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg"
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
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        ›
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              current === index ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;